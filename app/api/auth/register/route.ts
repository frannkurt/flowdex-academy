import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { limitBySlidingWindow } from "@/lib/security/rate-limit"
import { hasDistributedRateLimitConfig, hasTurnstileConfig, isProductionEnvironment } from "@/lib/security/runtime-config"

// Resolvemos la URL pública del sitio para que Supabase incluya el
// `emailRedirectTo` en el link de confirmación. Si no se pasa, Supabase usa
// la URL por defecto configurada en el dashboard.
function getSiteUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://www.flowdex.com.ar"
}

type RegisterBody = {
  fullName?: string
  email?: string
  password?: string
  phone?: string
  website?: string
  formStartedAt?: number
  turnstileToken?: string
}

// Validación liviana de teléfono (mismo criterio que el checkout): 6-20 dígitos
// reales, solo dígitos/espacios/+/-/(). Evita basura sin restringir formato.
function normalizePhone(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  const digits = trimmed.replace(/\D/g, "")
  if (digits.length < 6 || digits.length > 20) return null
  if (!/^[\d\s+()-]+$/.test(trimmed)) return null
  return trimmed
}

const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS_PER_IP = 8
const MAX_ATTEMPTS_PER_EMAIL = 3

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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

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

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Server auth no configurado. Faltan variables de Supabase." },
      { status: 500 }
    )
  }

  let body: RegisterBody

  try {
    body = (await request.json()) as RegisterBody
  } catch {
    return NextResponse.json({ error: "Payload invalido." }, { status: 400 })
  }

  const fullName = body.fullName?.trim()
  const email = body.email?.trim().toLowerCase()
  const password = body.password
  const website = body.website?.trim() ?? ""
  const formStartedAt = Number(body.formStartedAt)
  const turnstileToken = body.turnstileToken?.trim() ?? ""
  const phone = normalizePhone(body.phone)
  const clientIp = getClientIp(request)

  // Honeypot: if the hidden field is filled, silently accept to waste bot cycles.
  if (website) {
    return NextResponse.json({ ok: true })
  }

  // Bots typically submit instantly. Require minimum human fill time.
  if (!Number.isFinite(formStartedAt) || Date.now() - formStartedAt < 1500) {
    return NextResponse.json({ error: "No se pudo validar el registro." }, { status: 400 })
  }

  if (!fullName || !email || !password) {
    return NextResponse.json({ error: "Nombre, email y contraseña son obligatorios." }, { status: 400 })
  }

  if (fullName.length < 3 || fullName.length > 120) {
    return NextResponse.json({ error: "El nombre completo no es valido." }, { status: 400 })
  }

  if (!phone) {
    return NextResponse.json({ error: "Ingresá un teléfono de contacto válido." }, { status: 400 })
  }

  // Mínimo 8 caracteres con al menos una letra y un número. Estándar
  // razonable que reduce ataques de diccionario sin sumar fricción excesiva.
  // No requerimos mayúsculas/símbolos para no espantar usuarios mobile.
  if (password.length < 8) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 })
  }

  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)

  if (!hasLetter || !hasNumber) {
    return NextResponse.json(
      { error: "La contraseña debe tener al menos una letra y un número." },
      { status: 400 }
    )
  }

  const [ipRateLimit, emailRateLimit, turnstileOk] = await Promise.all([
    limitBySlidingWindow({
      key: clientIp,
      prefix: "auth:register:ip",
      limit: MAX_ATTEMPTS_PER_IP,
      windowMs: WINDOW_MS,
    }),
    limitBySlidingWindow({
      key: email,
      prefix: "auth:register:email",
      limit: MAX_ATTEMPTS_PER_EMAIL,
      windowMs: WINDOW_MS,
    }),
    verifyTurnstileToken(turnstileToken, clientIp),
  ])

  if (!ipRateLimit.success || !emailRateLimit.success) {
    return NextResponse.json(
      { error: "Demasiados intentos de registro. Intenta nuevamente en unos minutos." },
      { status: 429 }
    )
  }

  if (!turnstileOk) {
    return NextResponse.json(
      { error: "La verificacion de seguridad fallo o expiro. Intenta completar el CAPTCHA otra vez." },
      { status: 400 }
    )
  }

  // Usamos signUp del cliente público (no admin.createUser) porque signUp
  // dispara automáticamente el email de confirmación via el SMTP configurado
  // en Supabase (en nuestro caso Resend). admin.createUser NO manda email
  // aunque pongas email_confirm: false, porque está pensado para que un
  // administrador cree cuentas sin pasar por el flow público.
  // Requisito: en Supabase → Authentication → Sign In / Providers → Email
  // tiene que estar activado "Confirm email".
  const publicClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { data, error } = await publicClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
      },
      emailRedirectTo: `${getSiteUrl()}/login?confirmed=1`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Guardamos el teléfono en el perfil (best-effort; el trigger crea el profile
  // al alta del usuario). Si falla, no abortamos el registro.
  if (data?.user) {
    try {
      const admin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
      await admin.from("profiles").update({ phone }).eq("id", data.user.id)
    } catch (e) {
      console.error("[register] phone profile update failed", e)
    }
  }

  // Si Supabase tiene "Confirm email" desactivado, signUp devuelve una session
  // directa (usuario ya logueado). Lo marcamos para que el cliente lo redirija
  // al dashboard en vez de pedirle verificación.
  const requiresEmailVerification = !data?.session

  return NextResponse.json({
    ok: true,
    requiresEmailVerification,
    message: requiresEmailVerification
      ? "Te enviamos un email para confirmar tu cuenta. Revisá la bandeja y la carpeta de spam."
      : "Cuenta creada. Te estamos redirigiendo...",
  })
}