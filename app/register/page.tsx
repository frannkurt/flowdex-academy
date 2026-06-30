"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { TurnstileCaptcha } from "@/components/auth/TurnstileCaptcha"
import { getAuthErrorMessage } from "@/lib/supabase/auth-errors"

function getSafeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null
  }

  return value
}

export default function RegisterPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [returnTo, setReturnTo] = useState<string | null>(null)
  const [formStartedAt, setFormStartedAt] = useState<number>(Date.now())
  const [website, setWebsite] = useState("")
  const [captchaToken, setCaptchaToken] = useState("")
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setReturnTo(getSafeReturnTo(params.get("returnTo")))
    setFormStartedAt(Date.now())
  }, [])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const turnstileToken = String(formData.get("cf-turnstile-response") ?? captchaToken)

    if (turnstileSiteKey && !turnstileToken) {
      setErrorMessage("Completa la verificacion de seguridad para continuar.")
      return
    }

    setLoading(true)
    setErrorMessage(null)

    const registerResponse = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        phone,
        website,
        formStartedAt,
        turnstileToken,
      }),
    })

    const registerPayload = (await registerResponse.json().catch(() => null)) as
      | { error?: string; requiresEmailVerification?: boolean; message?: string }
      | null

    if (!registerResponse.ok) {
      setLoading(false)
      setErrorMessage(getAuthErrorMessage(registerPayload?.error ?? "No se pudo crear la cuenta."))
      return
    }

    // Si el API indica que hace falta verificación de email, NO intentamos
    // signin (Supabase no permite login hasta confirmar). Mostramos mensaje
    // y limpiamos el formulario para que el usuario vaya a su mail.
    if (registerPayload?.requiresEmailVerification) {
      setLoading(false)
      setSuccessMessage(
        registerPayload.message ??
          "Te enviamos un email para confirmar tu cuenta. Revisá la bandeja y la carpeta de spam."
      )
      setPassword("")
      return
    }

    // Sign in server-side a través del nuevo endpoint. No usamos
    // supabase.auth.signInWithPassword cliente para cerrar el bypass del guard.
    const loginResponse = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        website,
        formStartedAt,
        turnstileToken,
      }),
    })

    const loginPayload = (await loginResponse.json().catch(() => null)) as
      | { error?: string }
      | null

    if (!loginResponse.ok) {
      setLoading(false)
      setErrorMessage(getAuthErrorMessage(loginPayload?.error ?? "No se pudo iniciar sesion."))
      return
    }

    // Hard navigation a propósito (ver comentario equivalente en
    // /login/page.tsx). El signIn lo hace el server, el cliente Supabase
    // del Navbar no se entera, así que necesitamos un SSR fresh para que
    // el Navbar arranque con initialUser válido. Además el botón se queda
    // en "Creando cuenta..." sin flash hasta que el browser pinta el
    // dashboard.
    window.location.assign(returnTo ?? "/dashboard")
  }

  const loginHref = returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login"

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
        <OrbitalIcon size={520} animate />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        {/* Entrada resuelta en CSS (.auth-card-enter), no en framer: con
            motion.div el form viajaba con opacity:0 inline y quedaba
            invisible hasta hidratar — pantalla negra en celulares lentos. */}
        <div className="auth-card-enter glass-card w-full max-w-md rounded-2xl p-6 sm:p-8">
          <div className="mb-8 flex flex-col items-center gap-4 text-center">
            <OrbitalIcon size={56} animate={false} />
            <h1 className="type-display-md text-white">
              CREAR CUENTA
            </h1>
            <p className="text-sm text-[#888888]">
              Registrate para acceder al panel y gestionar tus cursos.
            </p>
          </div>

          {/* OAuth con Google. Arriba del form porque es el camino de menor
              fricción para signup (sin password, sin captcha). Para registros
              de Google no se manda email de verificación (Google ya verificó
              al usuario) — entra directo al dashboard. */}
          <div className="mb-6 space-y-3">
            <GoogleSignInButton
              label="Registrate con Google"
              onError={(msg) => setErrorMessage(msg)}
            />
            <div className="relative flex items-center">
              <div className="h-px flex-1 bg-[#2A2A2A]" />
              <span className="px-3 text-[10px] uppercase tracking-[0.18em] text-[#666666]">
                o con email
              </span>
              <div className="h-px flex-1 bg-[#2A2A2A]" />
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#CCCCCC]" htmlFor="fullName">
                Nombre completo
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111]/80 px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#CCCCCC]" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111]/80 px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
                placeholder="Mínimo 8 caracteres, una letra y un número"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#CCCCCC]" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111]/80 px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#CCCCCC]" htmlFor="phone">
                Teléfono / WhatsApp
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111]/80 px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
                placeholder="+54 9 11 1234 5678"
              />
            </div>

            {turnstileSiteKey ? (
              <TurnstileCaptcha
                siteKey={turnstileSiteKey}
                onToken={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken("")}
              />
            ) : null}

            {errorMessage && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <div className="rounded-lg border border-[#7DD4C0]/40 bg-[#7DD4C0]/10 px-4 py-3 text-sm text-[#DDF7F1]">
                <p className="font-semibold text-[#7DD4C0]">Cuenta creada</p>
                <p className="mt-1 leading-relaxed">{successMessage}</p>
                <p className="mt-2 text-xs text-[#9EDDEA]">
                  Después de confirmar el email, podés ingresar desde{" "}
                  <Link href="/login" className="underline hover:text-white">
                    iniciar sesión
                  </Link>
                  .
                </p>
              </div>
            )}

            {(() => {
              const waitingForCaptcha = Boolean(turnstileSiteKey) && !captchaToken
              return (
                <button
                  type="submit"
                  disabled={loading || Boolean(successMessage) || waitingForCaptcha}
                  className="w-full rounded-xl px-5 py-3 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)" }}
                >
                  {loading
                    ? "Creando cuenta..."
                    : successMessage
                      ? "Revisá tu email"
                      : waitingForCaptcha
                        ? "Verificando seguridad..."
                        : "Crear cuenta"}
                </button>
              )
            })()}
          </form>

          <p className="mt-6 text-center text-sm text-[#888888]">
            Ya tienes cuenta?{" "}
            <Link href={loginHref} className="font-medium text-[#7DD4C0] hover:text-[#5BB8D4]">
              Inicia sesion
            </Link>
          </p>

          <p className="mt-3 text-center text-sm text-[#888888]">
            <Link href="/" className="hover:text-white">
              Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
