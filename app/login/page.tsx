"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { getAuthErrorMessage } from "@/lib/supabase/auth-errors"

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string
      theme?: "light" | "dark" | "auto"
      size?: "normal" | "compact" | "flexible"
      callback?: (token: string) => void
      "expired-callback"?: () => void
      "error-callback"?: () => void
    }
  ) => string | number
  reset: (widgetId?: string | number) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

function getSafeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null
  }

  return value
}

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [returnTo, setReturnTo] = useState<string | null>(null)
  const [formStartedAt, setFormStartedAt] = useState<number>(Date.now())
  const [website, setWebsite] = useState("")
  // Captcha siempre visible desde el primer intento (decisión mayo 2026).
  // Coincide con backend que ahora valida turnstile en cada request.
  const [showCaptcha, setShowCaptcha] = useState(true)
  const [captchaToken, setCaptchaToken] = useState("")
  const [turnstileReady, setTurnstileReady] = useState(false)
  const [captchaWidgetId, setCaptchaWidgetId] = useState<string | number | null>(null)
  const [captchaError, setCaptchaError] = useState<string | null>(null)
  const captchaContainerRef = useRef<HTMLDivElement | null>(null)
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setReturnTo(getSafeReturnTo(params.get("returnTo")))
    setFormStartedAt(Date.now())

    if (window.turnstile) {
      setTurnstileReady(true)
    }
  }, [])

  useEffect(() => {
    if (!turnstileSiteKey) {
      return
    }

    if (window.turnstile) {
      setTurnstileReady(true)
      return
    }

    const scriptId = "turnstile-api-script"
    let script = document.getElementById(scriptId) as HTMLScriptElement | null

    const onLoad = () => setTurnstileReady(true)
    const onError = () => {
      setCaptchaError("No se pudo cargar el script de seguridad. Recarga la pagina.")
    }

    if (!script) {
      script = document.createElement("script")
      script.id = scriptId
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      script.async = false
      script.defer = false
      script.addEventListener("load", onLoad)
      script.addEventListener("error", onError)
      document.head.appendChild(script)
    } else {
      script.addEventListener("load", onLoad)
      script.addEventListener("error", onError)
    }

    return () => {
      script?.removeEventListener("load", onLoad)
      script?.removeEventListener("error", onError)
    }
  }, [turnstileSiteKey])

  useEffect(() => {
    if (!showCaptcha || !turnstileSiteKey || !turnstileReady || !captchaContainerRef.current) {
      return
    }

    if (!window.turnstile) {
      return
    }

    if (captchaWidgetId !== null) {
      return
    }

    let cancelled = false
    let attempts = 0

    const tryRender = () => {
      if (cancelled || captchaWidgetId !== null || !captchaContainerRef.current) {
        return
      }

      if (!window.turnstile || typeof window.turnstile.render !== "function") {
        attempts += 1
        if (attempts > 20) {
          setCaptchaError("No se pudo inicializar el captcha. Recarga la pagina e intenta de nuevo.")
          return
        }
        window.setTimeout(tryRender, 250)
        return
      }

      try {
        captchaContainerRef.current.replaceChildren()
        const widgetId = window.turnstile.render(captchaContainerRef.current, {
          sitekey: turnstileSiteKey,
          theme: "dark",
          size: "normal",
          callback: (token: string) => {
            setCaptchaToken(token)
            setCaptchaError(null)
          },
          "expired-callback": () => {
            setCaptchaToken("")
          },
          "error-callback": () => {
            setCaptchaToken("")
            setCaptchaError("No se pudo cargar el captcha. Recarga la pagina e intenta de nuevo.")
          },
        })
        setCaptchaWidgetId(widgetId)
      } catch {
        setCaptchaError("No se pudo inicializar el captcha. Recarga la pagina e intenta de nuevo.")
      }
    }

    tryRender()

    return () => {
      cancelled = true
    }
  }, [showCaptcha, turnstileSiteKey, turnstileReady, captchaWidgetId])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)
    setErrorMessage(null)

    const formData = new FormData(event.currentTarget)
    const turnstileToken = String(formData.get("cf-turnstile-response") ?? captchaToken)

    const response = await fetch("/api/auth/login", {
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

    const payload = (await response.json().catch(() => null)) as
      | { error?: string; requiresCaptcha?: boolean; ok?: boolean }
      | null

    if (!response.ok) {
      setLoading(false)
      setShowCaptcha((previous) => Boolean(payload?.requiresCaptcha) || previous)

      if (payload?.requiresCaptcha) {
        setCaptchaToken("")
        if (!turnstileSiteKey) {
          setErrorMessage("Falta configurar NEXT_PUBLIC_TURNSTILE_SITE_KEY en produccion.")
          return
        }
        if (window.turnstile && captchaWidgetId !== null) {
          window.turnstile.reset(captchaWidgetId)
        }
      }

      setErrorMessage(getAuthErrorMessage(payload?.error ?? "No se pudo iniciar sesion."))
      return
    }

    if (payload?.requiresCaptcha) {
      setShowCaptcha(true)
    }

    // Hard navigation a propósito. El login lo hace el server (vía
    // /api/auth/login), no el cliente — entonces el cliente Supabase del
    // Navbar no recibe el evento de auth y se queda mostrando "Ingresar"
    // hasta que algo lo dispare. Con window.location.assign forzamos un
    // SSR fresh: el RootLayout vuelve a leer la cookie y el Navbar se
    // monta con initialUser correcto desde el primer paint del dashboard.
    // Bonus: el botón sigue diciendo "Ingresando..." hasta que el browser
    // pinta la nueva página, no hay flash.
    window.location.assign(returnTo ?? "/dashboard")
  }

  const registerHref = returnTo ? `/register?returnTo=${encodeURIComponent(returnTo)}` : "/register"

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
              INICIAR SESION
            </h1>
            <p className="text-sm text-[#888888]">
              Accede a tu cuenta para ver tu progreso y tus cursos.
            </p>
          </div>

          {/* OAuth con Google. Arriba del form email/password porque es el
              camino de menor fricción — si el usuario tiene Google logueado,
              entra en un click sin captcha ni password. El form tradicional
              queda como segunda opción para quien prefiere email. */}
          <div className="mb-6 space-y-3">
            <GoogleSignInButton
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
              <label className="mb-2 block text-sm font-medium text-[#CCCCCC]" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111]/80 px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
                placeholder="Tu contraseña"
              />
              <div className="mt-2 text-right">
                <Link href="/forgot-password" className="text-xs text-[#7DD4C0] hover:text-[#5BB8D4]">
                  Olvidé mi contraseña
                </Link>
              </div>
            </div>

            {turnstileSiteKey && showCaptcha ? (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-[#7DD4C0]/20 bg-[#7DD4C0]/5 p-3">
                <p className="text-center text-xs text-[#7DD4C0]">
                  Verificación de seguridad. Es automática, casi siempre no requiere acción.
                  Si aparece una casilla, marcala para continuar.
                </p>
                <input type="hidden" name="cf-turnstile-response" value={captchaToken} readOnly />
                <div ref={captchaContainerRef} className="min-h-[65px]" />
                {!captchaToken && !captchaError ? (
                  <p className="text-center text-xs text-[#888888]">
                    Cargando verificación de seguridad…
                  </p>
                ) : null}
                {captchaError ? <p className="text-center text-xs text-red-300">{captchaError}</p> : null}
              </div>
            ) : null}

            {errorMessage && (
              <div className="space-y-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                <p className="text-sm text-red-300">{errorMessage}</p>
                <p className="text-xs text-[#CCCCCC]">
                  ¿No podés entrar?{" "}
                  <Link
                    href="/forgot-password"
                    className="font-semibold text-[#7DD4C0] underline underline-offset-2 hover:text-[#5BB8D4]"
                  >
                    Recuperá tu contraseña
                  </Link>
                  .
                </p>
              </div>
            )}

            {(() => {
              // El captcha de Turnstile resuelve el challenge invisible en
              // ~1-2s. Si el usuario aprieta "Ingresar" antes, el backend
              // rechaza el submit por falta de token y queda la sensación
              // de "doble click". Bloqueamos el botón hasta tener token.
              const waitingForCaptcha =
                Boolean(turnstileSiteKey) && showCaptcha && !captchaToken
              return (
                <button
                  type="submit"
                  disabled={loading || waitingForCaptcha}
                  className="w-full rounded-xl px-5 py-3 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)" }}
                >
                  {loading
                    ? "Ingresando..."
                    : waitingForCaptcha
                      ? "Verificando seguridad..."
                      : "Ingresar"}
                </button>
              )
            })()}
          </form>

          <p className="mt-6 text-center text-sm text-[#888888]">
            No tienes cuenta?{" "}
            <Link href={registerHref} className="font-medium text-[#7DD4C0] hover:text-[#5BB8D4]">
              Registrate
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
