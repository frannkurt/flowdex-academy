"use client"

import { useEffect, useRef, useState } from "react"

// Tipado mínimo del API global de Turnstile en modo render explícito.
// No declaramos `Window.turnstile` global para no chocar con otras
// declaraciones; casteamos localmente donde se usa.
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
  remove?: (widgetId?: string | number) => void
}

function getTurnstile(): TurnstileApi | undefined {
  return (window as unknown as { turnstile?: TurnstileApi }).turnstile
}

type Props = {
  siteKey: string
  onToken: (token: string) => void
  onExpire: () => void
}

/**
 * Captcha de Cloudflare Turnstile con render EXPLÍCITO.
 *
 * Por qué explícito y no el widget declarativo (.cf-turnstile): el script de
 * Cloudflare escanea el DOM buscando .cf-turnstile una sola vez, cuando carga.
 * Con navegación client-side de Next (el script ya estaba cargado de una
 * visita anterior) el div nuevo nunca se monta como widget → el token no llega
 * nunca → el botón queda en "Verificando seguridad..." para siempre. Acá
 * cargamos el script una sola vez (id estable, render=explicit) y montamos el
 * widget por API cuando el contenedor ya existe.
 */
export function TurnstileCaptcha({ siteKey, onToken, onExpire }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  // Callbacks en ref para que el efecto no dependa de identidades inestables.
  const callbacksRef = useRef({ onToken, onExpire })
  callbacksRef.current = { onToken, onExpire }

  const [token, setToken] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let widgetId: string | number | null = null
    let retryTimer: number | null = null
    let attempts = 0

    // Inyectar el script si no está (id estable: una sola carga por sesión).
    const scriptId = "turnstile-api-script"
    if (!getTurnstile() && !document.getElementById(scriptId)) {
      const script = document.createElement("script")
      script.id = scriptId
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      script.addEventListener("error", () => {
        if (!cancelled) {
          setError("No se pudo cargar la verificación de seguridad. Recargá la página.")
        }
      })
      document.head.appendChild(script)
    }

    // Polleamos hasta que el API esté disponible y recién ahí montamos el
    // widget. Cubre tanto la carga en frío como el script ya presente.
    const tryRender = () => {
      if (cancelled || !containerRef.current) {
        return
      }

      const turnstile = getTurnstile()
      if (!turnstile || typeof turnstile.render !== "function") {
        attempts += 1
        if (attempts > 40) {
          // ~10s sin API: algo bloqueó el script (adblock, red). Avisamos.
          setError("No se pudo cargar la verificación de seguridad. Recargá la página.")
          return
        }
        retryTimer = window.setTimeout(tryRender, 250)
        return
      }

      try {
        containerRef.current.replaceChildren()
        widgetId = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "dark",
          size: "normal",
          callback: (t: string) => {
            setToken(t)
            setError(null)
            callbacksRef.current.onToken(t)
          },
          "expired-callback": () => {
            setToken("")
            callbacksRef.current.onExpire()
          },
          "error-callback": () => {
            setToken("")
            callbacksRef.current.onExpire()
            setError("Falló la verificación de seguridad. Recargá la página e intentá de nuevo.")
          },
        })
      } catch {
        setError("No se pudo inicializar la verificación. Recargá la página e intentá de nuevo.")
      }
    }

    tryRender()

    return () => {
      cancelled = true
      if (retryTimer !== null) {
        window.clearTimeout(retryTimer)
      }
      if (widgetId !== null) {
        try {
          getTurnstile()?.remove?.(widgetId)
        } catch {
          // El widget ya no existe (navegación): nada que limpiar.
        }
      }
    }
  }, [siteKey])

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-[#7DD4C0]/20 bg-[#7DD4C0]/5 p-3">
      <p className="text-center text-xs text-[#7DD4C0]">
        Verificación de seguridad. Es automática, casi siempre no requiere acción.
        Si aparece una casilla, marcala para continuar.
      </p>
      <input type="hidden" name="cf-turnstile-response" value={token} readOnly />
      <div ref={containerRef} className="min-h-[65px]" />
      {!token && !error ? (
        <p className="text-center text-xs text-[#888888]">
          Cargando verificación de seguridad…
        </p>
      ) : null}
      {error ? <p className="text-center text-xs text-red-300">{error}</p> : null}
    </div>
  )
}
