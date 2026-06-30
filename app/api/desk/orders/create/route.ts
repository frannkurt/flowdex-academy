import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { limitBySlidingWindow } from "@/lib/security/rate-limit"
import { hasDistributedRateLimitConfig, isProductionEnvironment } from "@/lib/security/runtime-config"
import { getDeskPack, DESK_CREDIT_EXPIRY_MONTHS } from "@/lib/payments/desk-packs"
import { checkCoupon } from "@/lib/payments/coupons"

// Crea una orden de pack del Flowdex Desk en `desk_orders` con el monto y los
// créditos resueltos en el SERVER desde el catálogo (nunca confiando en el cliente).
//
// Compra sin login (checkout exprés, mismo patrón que la Academy): si no hay sesión,
// el cliente manda email + nombre + teléfono; resolvemos/creamos una cuenta invisible
// por email y le pegamos los créditos ahí. El acceso al Desk llega por email post-pago.
// Si hay sesión, la orden va al usuario logueado sin pedir nada.

const ORDERS_WINDOW_MS = 15 * 60 * 1000
const ORDERS_MAX = 10

type Body = {
  pack: string
  provider: "mercadopago" | "nowpayments" | "paypal"
  email?: string
  fullName?: string
  phone?: string
  coupon?: string
}

function getClientIp(request: Request) {
  const fwd = request.headers.get("x-forwarded-for")
  return fwd ? fwd.split(",")[0]?.trim() || "unknown" : "unknown"
}
function normalizeEmail(v: unknown): string | null {
  if (typeof v !== "string") return null
  const e = v.trim().toLowerCase()
  if (e.length < 5 || e.length > 254) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return null
  return e
}
function normalizePhone(v: unknown): string | null {
  if (typeof v !== "string") return null
  const t = v.trim()
  const d = t.replace(/\D/g, "")
  if (d.length < 6 || d.length > 20) return null
  if (!/^[\d\s+()-]+$/.test(t)) return null
  return t
}

export async function POST(request: Request) {
  if (isProductionEnvironment() && !hasDistributedRateLimitConfig()) {
    return NextResponse.json(
      { error: "Configuración de seguridad incompleta: falta Upstash Redis para rate limiting." },
      { status: 503 }
    )
  }

  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado." }, { status: 500 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 })
  }

  const pack = getDeskPack(body.pack)
  if (!pack) {
    return NextResponse.json({ error: "Pack inválido." }, { status: 400 })
  }
  if (body.provider !== "mercadopago" && body.provider !== "nowpayments" && body.provider !== "paypal") {
    return NextResponse.json({ error: "Provider inválido." }, { status: 400 })
  }

  const rateLimit = await limitBySlidingWindow({
    key: user ? user.id : `ip:${getClientIp(request)}`,
    prefix: user ? "desk:orders:create:user" : "desk:orders:create:guest",
    limit: ORDERS_MAX,
    windowMs: ORDERS_WINDOW_MS,
  })
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Demasiados intentos. Esperá unos minutos antes de crear otra orden." },
      { status: 429 }
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase service role no configurado." }, { status: 500 })
  }
  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // ---- Resolver el comprador ----
  let buyerId: string
  if (user) {
    buyerId = user.id
  } else {
    const email = normalizeEmail(body.email)
    const fullName = body.fullName?.trim() ?? ""
    const phone = normalizePhone(body.phone)
    if (!email) return NextResponse.json({ error: "Ingresá un email válido." }, { status: 400 })
    if (fullName.length < 3 || fullName.length > 120)
      return NextResponse.json({ error: "Ingresá tu nombre completo." }, { status: 400 })
    if (!phone) return NextResponse.json({ error: "Teléfono de contacto inválido." }, { status: 400 })

    const { data: existing } = await serviceClient
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (existing) {
      buyerId = (existing as { id: string }).id
    } else {
      const { data: created, error: createErr } = await serviceClient.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: fullName, guest_checkout: true, signup_source: "flowdex_desk" },
      })
      if (createErr || !created?.user) {
        console.error("[desk/orders/create] guest createUser failed", createErr)
        return NextResponse.json(
          { error: "No pudimos preparar tu cuenta. Probá de nuevo o registrate primero." },
          { status: 500 }
        )
      }
      buyerId = created.user.id
    }
    // Guardamos el teléfono de contacto (best-effort, no abortamos la compra si falla).
    await serviceClient.from("profiles").update({ phone }).eq("id", buyerId)
  }

  // Cupón (opcional): valida contra promo_codes (activo, aplica al Desk, no
  // usado antes por este comprador). Si vino uno inválido, cortamos para que el
  // comprador lo sepa; si es válido lo guardamos y el fulfillment dará los +2.
  let couponCode: string | null = null
  if (typeof body.coupon === "string" && body.coupon.trim()) {
    const check = await checkCoupon(serviceClient, body.coupon, "desk", buyerId)
    if (!check.ok) {
      return NextResponse.json({ error: check.reason }, { status: 400 })
    }
    couponCode = check.code
  }

  const { data: order, error: orderError } = await serviceClient
    .from("desk_orders")
    .insert({
      user_id: buyerId,
      pack: pack.id,
      credits: pack.credits,
      radar_days: pack.radarDays,
      amount_usd: pack.priceUsd,
      provider: body.provider,
      status: "pending",
      credit_expires_months: DESK_CREDIT_EXPIRY_MONTHS,
      coupon_code: couponCode,
    })
    .select("id")
    .single()

  if (orderError || !order) {
    console.error("[desk/orders/create] no se pudo crear la orden", orderError)
    return NextResponse.json({ error: "No se pudo crear la orden." }, { status: 500 })
  }

  return NextResponse.json({ deskOrderId: (order as { id: string }).id })
}
