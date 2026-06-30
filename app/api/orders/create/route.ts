import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/payments/mercadopago-pricing"
import { getInnerCircleEligibility } from "@/lib/inner-circle-eligibility"
import { resolveCoursePricing } from "@/lib/pricing/course-pricing"
import { resolveUpgradeDiscount } from "@/lib/pricing/upgrade-discount"
import { limitBySlidingWindow } from "@/lib/security/rate-limit"
import { isInternalProgressOnlyCourseSlug } from "@/lib/courses/progress-course-config"
import { hasDistributedRateLimitConfig, isProductionEnvironment } from "@/lib/security/runtime-config"
import { checkCoupon, applyCouponDiscount } from "@/lib/payments/coupons"

// Rate limit por user: 10 ordenes pendientes cada 15 min.
// Cubre el caso real (alumno duda entre MP y NOWPayments, prueba dos o tres
// veces); frena a alguien que quiera llenar la tabla `orders` de basura.
const ORDERS_WINDOW_MS = 15 * 60 * 1000
const ORDERS_MAX_PER_USER = 10

type OrderCreateBody = {
  courseSlug: string
  provider: "mercadopago" | "nowpayments" | "paypal"
  phone?: string
  // Checkout exprés (sin sesión): email + nombre para resolver la cuenta
  // invisible. Solo se usan cuando NO hay usuario logueado.
  email?: string
  fullName?: string
  coupon?: string
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (!forwarded) return "unknown"
  return forwarded.split(",")[0]?.trim() || "unknown"
}

// Validación liviana de email (espejo del checkout). La verificación fuerte
// la hace el pago mismo: nadie paga un curso a una casilla que no controla.
function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null
  const email = value.trim().toLowerCase()
  if (email.length < 5 || email.length > 254) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return null
  return email
}

// Validación liviana de teléfono (espejo de la del checkout): entre 6 y 20
// dígitos reales, solo dígitos/espacios/+/-/() . No restringe formato
// internacional, solo evita basura.
function normalizePhone(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  const digits = trimmed.replace(/\D/g, "")
  if (digits.length < 6 || digits.length > 20) return null
  if (!/^[\d\s+()-]+$/.test(trimmed)) return null
  return trimmed
}

type CourseRow = {
  id: string
  price: number
  name: string
  slug: string
  discount_price: number | string | null
}

export async function POST(request: Request) {
  if (isProductionEnvironment() && !hasDistributedRateLimitConfig()) {
    return NextResponse.json(
      { error: "Configuracion de seguridad incompleta: falta Upstash Redis para rate limiting." },
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

  let body: OrderCreateBody
  try {
    body = (await request.json()) as OrderCreateBody
  } catch {
    return NextResponse.json({ error: "Payload invalido." }, { status: 400 })
  }

  const { courseSlug, provider } = body

  if (!courseSlug || !provider) {
    return NextResponse.json({ error: "courseSlug y provider son obligatorios." }, { status: 400 })
  }

  const phone = normalizePhone(body.phone)
  if (!phone) {
    return NextResponse.json({ error: "Teléfono de contacto inválido." }, { status: 400 })
  }

  if (isInternalProgressOnlyCourseSlug(courseSlug)) {
    return NextResponse.json({ error: "Curso no disponible para compra." }, { status: 404 })
  }

  if (provider !== "mercadopago" && provider !== "nowpayments" && provider !== "paypal") {
    return NextResponse.json({ error: "Provider invalido." }, { status: 400 })
  }

  const rateLimit = await limitBySlidingWindow({
    // Logueado: por user. Invitado: por IP (no hay user todavía).
    key: user ? user.id : `ip:${getClientIp(request)}`,
    prefix: user ? "orders:create:user" : "orders:create:guest",
    limit: ORDERS_MAX_PER_USER,
    windowMs: ORDERS_WINDOW_MS,
  })

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Demasiados intentos. Esperá unos minutos antes de crear otra orden." },
      { status: 429 }
    )
  }

  const adminClient = createSupabaseAdminClient()
  if (!adminClient) {
    return NextResponse.json({ error: "Supabase service role no configurado." }, { status: 500 })
  }

  // ---- Checkout exprés: resolver la cuenta del comprador sin sesión ----
  // Si no hay usuario logueado, el checkout manda email + nombre. Buscamos la
  // cuenta por email; si no existe la creamos invisible (sin password, email
  // confirmado — el pago valida que la casilla es real). El alumno elige su
  // contraseña desde el link del email de bienvenida post-pago.
  let buyerId: string
  if (user) {
    buyerId = user.id
  } else {
    const email = normalizeEmail(body.email)
    const fullName = body.fullName?.trim() ?? ""

    if (!email) {
      return NextResponse.json({ error: "Ingresá un email válido." }, { status: 400 })
    }
    if (fullName.length < 3 || fullName.length > 120) {
      return NextResponse.json({ error: "Ingresá tu nombre completo." }, { status: 400 })
    }
    // Inner Circle exige cuenta con caminos completados: sin sesión no hay
    // forma de validar elegibilidad.
    if (courseSlug.trim().toLowerCase() === "inner-circle") {
      return NextResponse.json(
        { error: "Para comprar Inner Circle necesitás iniciar sesión con tu cuenta." },
        { status: 401 }
      )
    }

    const { data: existingProfile } = await adminClient
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (existingProfile) {
      buyerId = (existingProfile as { id: string }).id
    } else {
      const { data: created, error: createError } = await adminClient.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          // Marca para que el email de compra incluya el link de "crear
          // contraseña" en vez del CTA normal al dashboard.
          guest_checkout: true,
        },
      })

      if (createError || !created?.user) {
        console.error("[orders/create] guest createUser failed", createError)
        return NextResponse.json(
          { error: "No pudimos preparar tu cuenta. Probá de nuevo o registrate primero." },
          { status: 500 }
        )
      }
      buyerId = created.user.id
    }
  }

  // Guardamos el teléfono de contacto en el perfil del alumno. Si falla, no
  // abortamos la compra: el pago es lo prioritario, el dato se puede recapturar.
  await adminClient.from("profiles").update({ phone }).eq("id", buyerId)

  const { data: course, error: courseError } = await adminClient
    .from("courses")
    .select("id, price, name, slug, discount_price")
    .eq("slug", courseSlug.trim().toLowerCase())
    .maybeSingle()

  if (courseError || !course) {
    return NextResponse.json({ error: "Curso no encontrado." }, { status: 404 })
  }

  const typedCourse = course as CourseRow
  const pricing = resolveCoursePricing({
    slug: typedCourse.slug,
    basePrice: Number(typedCourse.price),
  })

  if (typedCourse.slug === "inner-circle") {
    const eligibility = await getInnerCircleEligibility(adminClient, buyerId)

    if (!eligibility.isEligible) {
      return NextResponse.json(
        {
          error:
            "Para acceder a Inner Circle, necesitas completar al 100% uno de estos caminos: Inversiones o Trading.",
        },
        { status: 403 }
      )
    }
  }

  // Auto-upgrade: si el usuario ya tiene el Kickstart correspondiente activo
  // y el curso tiene `discount_price` seteado, lo aplicamos como precio final.
  // El admin controla el upgrade desde el panel via courses.discount_price.
  const discountPriceFromDb =
    typedCourse.discount_price === null || typedCourse.discount_price === undefined
      ? null
      : Number(typedCourse.discount_price)
  const upgradeDiscount = await resolveUpgradeDiscount(
    adminClient,
    buyerId,
    typedCourse.slug,
    pricing.finalPrice,
    discountPriceFromDb
  )

  // Cupón (opcional): valida (activo, aplica a cursos, no usado antes por este
  // comprador para ESTE curso) y aplica su descuento sobre el precio final. El
  // código se guarda en la orden → al acreditarse, el trigger registra la comisión.
  let finalPrice = upgradeDiscount.finalPrice
  let couponCode: string | null = null
  if (typeof body.coupon === "string" && body.coupon.trim()) {
    const check = await checkCoupon(adminClient, body.coupon, "academy", buyerId, typedCourse.slug)
    if (!check.ok) {
      return NextResponse.json({ error: check.reason }, { status: 400 })
    }
    couponCode = check.code
    finalPrice = applyCouponDiscount(finalPrice, check.promo)
  }

  const { data: order, error: orderError } = await adminClient
    .from("orders")
    .insert({
      user_id: buyerId,
      course_id: typedCourse.id,
      amount_usd: finalPrice,
      provider,
      status: "pending",
      coupon_code: couponCode,
    })
    .select("id")
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: "No se pudo crear la orden." }, { status: 500 })
  }

  return NextResponse.json({ orderId: (order as { id: string }).id })
}
