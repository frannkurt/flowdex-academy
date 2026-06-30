import { NextResponse } from "next/server"
import { limitBySlidingWindow } from "@/lib/security/rate-limit"
import { hasDistributedRateLimitConfig, hasTurnstileConfig, isProductionEnvironment } from "@/lib/security/runtime-config"
import { createSupabaseServerClient } from "@/lib/supabase/server"

// Endpoint server-side de login. Cierra el bypass que existía cuando el cliente
// llamaba a /api/auth/login-guard para los chequeos y después a
// supabase.auth.signInWithPassword cliente directamente — un atacante podía
// saltar el guard yendo derecho al endpoint público de Supabase.
//
// Ahora la única forma legítima de iniciar sesión desde el sitio pasa por
// acá: validamos honeypot, anti-bot timing, rate limit por IP y email,
// captcha Turnstile y recién ahí hacemos el signIn server-side (que setea
// las cookies de sesión vía createSupabaseServerClient).

type LoginBody = {
  email?: string
  password?: string
  website?: string
  formStartedAt?: number
  turnstileToken?: string
}

const WINDOW_MS = 10 * 60 * 1000
const HARD_LIMIT_IP = 20
const HARD_LIMIT_EMAIL = 8
const CAPTCHA_AFTER_IP_ATTEMPTS = 4
const CAPTCHA_AFTER_EMAIL_ATTEMPTS = 3

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (!forwarded) {
    return "unknown"
  }

  return forwarded.split(",")[0]?.trim() || "unknown"
}

async function verifyTurnstileToken(token: string, clientIp: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    return false
  }

  if (!token) {
    return false
  }

  const payload = new URLSearchParams()
  payload.set("secret", secretKey)
  payload.set("response", token)

  if (clientIp && clientIp !== "unknown") {
    payload.set("remoteip", clientIp)
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
    cache: "no-store",
  })

  if (!response.ok) {
    return false
  }

  const result = (await response.json()) as { success?: boolean }
  return result.success === true
}

export async function POST(request: Request) {
  if (isProductionEnvironment() && !hasDistributedRateLimitConfig()) {
    return NextResponse.json(
      { error: "Configuracion de seguridad incompleta: falta Upstash Redis para rate limiting." },
      { status: 503 }
    )
  }

  if (isProductionEnvironment() && !hasTurnstileConfig()) {
    return NextResponse.json(
      { error: "Configuracion de seguridad incompleta: falta Turnstile en el servidor." },
      { status: 503 }
    )
  }

  let body: LoginBody

  try {
    body = (await request.json()) as LoginBody
  } catch {
    return NextResponse.json({ error: "Payload invalido." }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase() ?? ""
  const password = body.password ?? ""
  const website = body.website?.trim() ?? ""
  const formStartedAt = Number(body.formStartedAt)
  const turnstileToken = body.turnstileToken?.trim() ?? ""
  const clientIp = getClientIp(request)

  // Honeypot: bots usually fill every field.
  if (website) {
    return NextResponse.json({ ok: true })
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "El email ingresado no es valido." }, { status: 400 })
  }

  if (!password) {
    return NextResponse.json({ error: "La contraseña es obligatoria." }, { status: 400 })
  }

  // Anti-bot: rechazamos submits que llegaron en menos de 300ms desde que se
  // hidrato el form. 300ms acomoda autofill de password managers + Enter rapido,
  // pero sigue frenando bots que envian en <100ms.
  if (!Number.isFinite(formStartedAt) || Date.now() - formStartedAt < 300) {
    console.warn("[auth/login] submit demasiado rapido", {
      formStartedAt,
      delta: Number.isFinite(formStartedAt) ? Date.now() - formStartedAt : null,
      email,
    })
    return NextResponse.json(
      { error: "No se pudo validar el login. Intentá de nuevo en unos segundos." },
      { status: 400 }
    )
  }

  const [ipRateLimit, emailRateLimit] = await Promise.all([
    limitBySlidingWindow({
      key: clientIp,
      prefix: "auth:login:ip",
      limit: HARD_LIMIT_IP,
      windowMs: WINDOW_MS,
    }),
    limitBySlidingWindow({
      key: email,
      prefix: "auth:login:email",
      limit: HARD_LIMIT_EMAIL,
      windowMs: WINDOW_MS,
    }),
  ])

  if (!ipRateLimit.success || !emailRateLimit.success) {
    return NextResponse.json(
      { error: "Demasiados intentos de inicio de sesion. Intenta nuevamente en unos minutos." },
      { status: 429 }
    )
  }

  // Captcha estricto desde el primer intento (decisión de marca mayo 2026):
  // Flowdex es sitio de pago, cuentas robadas tienen valor real, y Turnstile
  // es invisible para humanos legítimos casi siempre. La señal previa de
  // "requiresCaptcha condicional" (basada en rate-limit) queda solo como
  // metadato informativo en la respuesta — la validación es siempre.
  const requiresCaptcha = true

  if (!turnstileToken) {
    console.info("[auth/login] captcha requerido (sin token)", { email, clientIp })
    return NextResponse.json(
      {
        error: "Por seguridad necesitamos verificar que sos humano. Resolvé el captcha y volvé a intentar.",
        requiresCaptcha: true,
      },
      { status: 400 }
    )
  }

  const turnstileOk = await verifyTurnstileToken(turnstileToken, clientIp)

  if (!turnstileOk) {
    console.warn("[auth/login] captcha invalido o expirado", { email, clientIp })
    return NextResponse.json(
      {
        error: "La verificación de seguridad falló o expiró. Resolvé el captcha de nuevo.",
        requiresCaptcha: true,
      },
      { status: 400 }
    )
  }

  // Sign in server-side. createSupabaseServerClient maneja las cookies vía
  // next/headers, así que la sesión queda persistida correctamente.
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase no configurado en el servidor." },
      { status: 500 }
    )
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message, requiresCaptcha }, { status: 400 })
  }

  return NextResponse.json({ ok: true, requiresCaptcha })
}
