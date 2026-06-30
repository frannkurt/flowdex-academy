import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { computeMercadoPagoPricing, createSupabaseAdminClient, normalizePromoCode } from "@/lib/payments/mercadopago-pricing"
import { limitBySlidingWindow } from "@/lib/security/rate-limit"
import { isInternalProgressOnlyCourseSlug } from "@/lib/courses/progress-course-config"
import { hasDistributedRateLimitConfig, isProductionEnvironment } from "@/lib/security/runtime-config"

// Rate limit por IP: 30 cotizaciones cada 10 min.
// Suficiente para un humano que tantea precios y promo codes, frena bots que
// quieran adivinar promo codes a fuerza bruta.
const QUOTE_WINDOW_MS = 10 * 60 * 1000
const QUOTE_MAX_PER_IP = 30

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (!forwarded) return "unknown"
  return forwarded.split(",")[0]?.trim() || "unknown"
}

export async function GET(request: Request) {
  if (isProductionEnvironment() && !hasDistributedRateLimitConfig()) {
    return NextResponse.json(
      { error: "Configuracion de seguridad incompleta: falta Upstash Redis para rate limiting." },
      { status: 503 }
    )
  }

  const requestUrl = new URL(request.url)
  const courseSlug = requestUrl.searchParams.get("courseSlug")?.trim().toLowerCase()
  const promoCode = normalizePromoCode(requestUrl.searchParams.get("promoCode"))

  if (!courseSlug) {
    return NextResponse.json({ error: "courseSlug es obligatorio." }, { status: 400 })
  }

  if (isInternalProgressOnlyCourseSlug(courseSlug)) {
    return NextResponse.json({ error: "Curso no disponible." }, { status: 404 })
  }

  const rateLimit = await limitBySlidingWindow({
    key: getClientIp(request),
    prefix: "pricing:quote:ip",
    limit: QUOTE_MAX_PER_IP,
    windowMs: QUOTE_WINDOW_MS,
  })

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Demasiados intentos. Esperá unos minutos." },
      { status: 429 }
    )
  }

  const adminClient = createSupabaseAdminClient()

  if (!adminClient) {
    return NextResponse.json({ error: "Supabase service role no configurado." }, { status: 500 })
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } }

  try {
    const pricing = await computeMercadoPagoPricing({
      adminClient,
      userId: user?.id ?? null,
      courseSlug,
      promoCode: promoCode || null,
      strictPromo: Boolean(promoCode),
    })

    return NextResponse.json({
      ok: true,
      ...pricing,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo calcular el precio del curso."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
