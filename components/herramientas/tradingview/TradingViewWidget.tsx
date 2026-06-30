"use client"

// Componente base para embeber cualquier widget de TradingView.
//
// Los widgets se montan inyectando un <script> con la config como innerHTML
// dentro de un contenedor; el script genera el iframe como hijo. Acá
// replicamos ese patrón oficial en React, con:
//   - lazy-load por IntersectionObserver (no cargar varios iframes pesados
//     de una en páginas con muchos widgets),
//   - estado de carga: placeholder mientras pinta el iframe,
//   - fallback explícito si no carga (típicamente un ad/privacy blocker
//     cortando las requests a tradingview.com).
//
// La inyección va sobre un div interno propio (injectRef) que React deja
// vacío y nosotros manejamos a mano — React nunca le mete hijos por JSX,
// así que no hay conflicto.
//
// GUARD TÁCTIL (junio 2026): en touch, los iframes de TradingView se tragan
// el gesto de scroll — el calendario/screener/heatmap scrollean su contenido
// interno o capturan el touch para pan/zoom, y la página de atrás no se
// mueve. Como en mobile el widget ocupa todo el ancho, el usuario quedaba
// "atrapado" sin poder scrollear hacia abajo (reportado en /herramientas).
// Solución estándar de embeds (mismo patrón que Google Maps): un overlay
// transparente deja pasar el scroll de la página y recién al tocarlo se
// habilita la interacción con el widget. Solo en pointer coarse — desktop
// no cambia.

import { useEffect, useRef, useState } from "react"

export type TradingViewWidgetProps = {
  /** URL del script de embed (ej. embed-widget-ticker-tape.js). */
  scriptSrc: string
  /** Config JSON del widget (debe ser serializable). */
  config: Record<string, unknown>
  /** Alto mínimo del contenedor mientras carga (evita layout shift). */
  minHeight?: number | string
  className?: string
  /** Si true (default), monta el script recién al entrar en viewport. */
  lazy?: boolean
  /** Si true (default), en touch protege el scroll de la página con un
   *  overlay "tocá para interactuar" (ver IframeTouchGuard). */
  touchGuard?: boolean
  /** Si false, el guard no muestra el pill de hint (widgets finos). */
  touchGuardHint?: boolean
}

const TV_BASE = "https://s3.tradingview.com/external-embedding/"
const LOAD_TIMEOUT_MS = 8000

/**
 * Overlay transparente que protege el scroll de la página en dispositivos
 * táctiles: mientras está activo, los swipes scrollean la página (es DOM
 * común, no iframe) y un tap lo desactiva para interactuar con el widget.
 * Exportado para reusarlo en iframes que no pasan por TradingViewWidget
 * (ej. el calendario de Investing.com en NoticiasTabs).
 */
export function IframeTouchGuard({
  /** Si false, no muestra el hint "Tocá para interactuar" (widgets finos
   *  tipo ticker tape donde el pill taparía el contenido). */
  showHint = true,
}: {
  showHint?: boolean
}) {
  const [needsGuard, setNeedsGuard] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  // Solo en pointer coarse (touch real). Se resuelve en useEffect y no en
  // el initializer para no generar hydration mismatch: el server siempre
  // renderiza sin guard.
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setNeedsGuard(true)
    }
  }, [])

  if (!needsGuard || unlocked) return null

  return (
    <button
      type="button"
      onClick={() => setUnlocked(true)}
      aria-label="Activar interacción con el widget"
      className="absolute inset-0 z-20 flex w-full items-end justify-center bg-transparent pb-3"
    >
      {showHint && (
        <span className="pointer-events-none inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0A0A0A]/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[#8C93A3] backdrop-blur-sm">
          Tocá para interactuar
        </span>
      )}
    </button>
  )
}

export function TradingViewWidget({
  scriptSrc,
  config,
  minHeight = 400,
  className,
  lazy = true,
  touchGuard = true,
  touchGuardHint = true,
}: TradingViewWidgetProps) {
  const injectRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(!lazy)
  const [status, setStatus] = useState<"idle" | "ready" | "error">("idle")

  const configString = JSON.stringify(config)

  // Lazy-load: observar el contenedor y montar solo al acercarse al viewport.
  useEffect(() => {
    if (shouldLoad) return
    const el = injectRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: "240px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldLoad])

  // Inyección del script + detección de cuándo el widget pintó el iframe.
  useEffect(() => {
    if (!shouldLoad) return
    const el = injectRef.current
    if (!el) return

    setStatus("idle")
    el.innerHTML = ""

    const widget = document.createElement("div")
    widget.className = "tradingview-widget-container__widget"
    el.appendChild(widget)

    const script = document.createElement("script")
    script.src = scriptSrc.startsWith("http") ? scriptSrc : `${TV_BASE}${scriptSrc}`
    script.async = true
    script.type = "text/javascript"
    script.innerHTML = configString
    el.appendChild(script)

    // El widget se considera "listo" cuando aparece un <iframe> dentro.
    const observer = new MutationObserver(() => {
      if (el.querySelector("iframe")) {
        setStatus("ready")
        observer.disconnect()
      }
    })
    observer.observe(el, { childList: true, subtree: true })

    // Si en unos segundos no pintó nada, asumimos bloqueo / fallo de red.
    const timeout = window.setTimeout(() => {
      if (!el.querySelector("iframe")) {
        setStatus("error")
        observer.disconnect()
      }
    }, LOAD_TIMEOUT_MS)

    return () => {
      observer.disconnect()
      window.clearTimeout(timeout)
      el.innerHTML = ""
    }
  }, [shouldLoad, scriptSrc, configString])

  return (
    <div
      className={`tradingview-widget-container relative ${className ?? ""}`}
      style={{ minHeight }}
    >
      {/* Placeholder de carga — el iframe de TradingView lo tapa al pintar. */}
      {status !== "ready" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
          {status === "error" ? (
            <p className="max-w-sm text-[12px] leading-relaxed text-[#5C6273]">
              No se pudieron cargar los datos de mercado. Si tenés un bloqueador de anuncios o un
              navegador con escudos (Brave, uBlock, etc.), puede estar cortando las requests a
              TradingView — probá desactivándolo para este sitio.
            </p>
          ) : (
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#4A5160]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4A5160]" />
              Cargando datos de mercado…
            </span>
          )}
        </div>
      )}

      {/* Contenedor de inyección (React lo deja vacío, lo manejamos a mano). */}
      <div ref={injectRef} className="relative h-full w-full" />

      {/* Guard táctil: deja pasar el scroll de la página hasta que el
          usuario toca el widget para interactuar. Solo touch devices. */}
      {touchGuard && <IframeTouchGuard showHint={touchGuardHint} />}
    </div>
  )
}
