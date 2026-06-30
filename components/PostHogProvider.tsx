"use client"

// Provider de PostHog para Flowdex.
// Se inicializa una sola vez del lado del cliente, trackea pageviews
// automáticamente en cada cambio de ruta del App Router, e identifica al
// alumno con su user.id de Supabase cuando hay sesión activa.
//
// Tracking del sitio público: visitas anónimas + funnel de conversión.
// NO se usa para métricas de negocio (revenue, retención, finalización):
// esas se leen de Supabase desde el dashboard admin propio.

import { useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

// Init lazy del cliente de PostHog. Antes corría en module scope y bloqueaba
// el main thread ~221ms (auditoría PageSpeed mayo 2026). Ahora se posterga
// hasta que el browser está libre, vía requestIdleCallback en un useEffect
// (ver hook deferredPostHogInit más abajo).
// El recorder de sesiones se arranca con un segundo defer: PostHog se inicia
// con disable_session_recording: true y después llamamos a startSessionRecording()
// cuando ya pasó el LCP. Mantenemos toda la telemetría que sirve (autocapture,
// pageviews, identify, recorder) y bajamos TBT.
let posthogInitialized = false

function initPostHogClient() {
  if (posthogInitialized) return
  if (typeof window === "undefined") return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  // El check de NODE_ENV evita que PostHog se cargue durante `next dev` en
  // local: no se mandan eventos, no hay session replay, no se ensucia la cuota
  // ni se distorsionan métricas con la navegación de Franco/Augusto en dev.
  if (process.env.NODE_ENV !== "production") return
  posthogInitialized = true

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    // api_host apunta al reverse proxy de Next configurado en next.config.mjs
    // (/ingest). Esto hace que el tráfico salga desde flowdex.com.ar y no lo
    // bloqueen los adblockers que filtran posthog.com.
    api_host: "/ingest",
    // ui_host es donde está el dashboard de PostHog. Solo se usa para los
    // links del toolbar de debugging — el tráfico real sigue yendo al proxy.
    ui_host: "https://us.posthog.com",
    // Capturamos pageviews manualmente desde el efecto de abajo, así el App
    // Router de Next dispara el evento en cada cambio de ruta (sin esto,
    // PostHog solo registra el primer pageview al cargar la SPA).
    capture_pageview: false,
    // pageleave SÍ lo dejamos automático. Por defecto PostHog lo ata a
    // capture_pageview, así que al apagar pageview también se apaga pageleave
    // (y bounce rate / session duration quedan inexactos). Forzándolo a true
    // se dispara $pageleave en cada salida de página independientemente.
    capture_pageleave: true,
    // Auto-capture de clicks, inputs y forms. Sumado a nuestros eventos
    // custom, da contexto extra de qué tocan los visitantes sin que tengamos
    // que instrumentar cada botón.
    autocapture: true,
    // Arrancamos SIN session recording activo. Lo prende startSessionRecording()
    // unos segundos después, cuando el browser está libre (ver más abajo).
    // Esto baja TBT en el LCP sin sacrificar replay — el primer segundo del
    // hero raramente tiene interacciones accionables que valga la pena grabar.
    disable_session_recording: true,
    session_recording: {
      maskAllInputs: true,
    },
    // Persistencia en localStorage + cookie. Necesario para el funnel de
    // varios pasos (el visitante puede volver al día siguiente y seguimos
    // teniendo su distinct_id).
    persistence: "localStorage+cookie",
    // Solo crea perfil de persona cuando llamamos identify() (post-login).
    // Para anónimos solo trackea eventos sin crear perfil. Ahorra cuota de
    // PostHog y mantiene limpio el panel de Personas (solo aparecen alumnos
    // reales, no visitantes de paso). Recomendación oficial de PostHog para
    // sitios públicos desde 2024.
    person_profiles: "identified_only",
    // Solo loguea en consola en dev. En prod queda silencioso.
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") {
        ph.debug()
      }
    },
  })

  // Segundo defer: arrancar el recorder cuando el browser tenga otro idle slot.
  // Esto evita que el script del recorder corra back-to-back con el init.
  const startRec = () => {
    try {
      posthog.startSessionRecording()
    } catch {
      // posthog-js no tipa startSessionRecording en todas las versiones.
      // Si falla silencioso, simplemente no grabamos esa sesión.
    }
  }
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback
  if (typeof ric === "function") {
    ric(startRec, { timeout: 3000 })
  } else {
    setTimeout(startRec, 2000)
  }
}

// Componente interno que dispara pageviews en cada cambio de ruta y mantiene
// el identify del alumno sincronizado con la sesión de Supabase.
function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Pageview manual en cada cambio de pathname o query string.
  useEffect(() => {
    if (!pathname) return
    let url = window.origin + pathname
    const qs = searchParams?.toString()
    if (qs) url += "?" + qs
    posthog.capture("$pageview", { $current_url: url })
  }, [pathname, searchParams])

  // Identify del usuario cuando hay sesión, reset cuando se desloguea.
  // Sin esto, los eventos del alumno post-login quedan asociados al
  // distinct_id anónimo y rompemos la continuidad del funnel.
  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    // Si las env vars de Supabase no están configuradas en este entorno,
    // el wrapper devuelve null. En ese caso no hay nada que identificar.
    if (!supabase) return

    const syncIdentity = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        posthog.identify(user.id, {
          email: user.email,
          // Metadata adicional opcional. created_at viene de Supabase Auth
          // y sirve para segmentar "alumnos nuevos" vs "viejos" en PostHog.
          created_at: user.created_at,
        })
      }
    }

    syncIdentity()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        posthog.identify(session.user.id, {
          email: session.user.email,
          created_at: session.user.created_at,
        })
      } else if (event === "SIGNED_OUT") {
        // reset() limpia el distinct_id y arranca uno anónimo nuevo. Sin
        // esto, si otro usuario se loguea en el mismo browser, sus eventos
        // se atribuyen al alumno anterior.
        posthog.reset()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // Defer del init hasta que el browser está libre. Lo corremos en useEffect
  // post-hidratación con requestIdleCallback como cola; si el browser no lo
  // soporta, setTimeout de 1.5s. Esto saca el costo del init (~200ms de main
  // thread) de la ventana del LCP.
  useEffect(() => {
    if (typeof window === "undefined") return
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback
    if (typeof ric === "function") {
      ric(() => initPostHogClient(), { timeout: 2000 })
    } else {
      const t = setTimeout(() => initPostHogClient(), 1500)
      return () => clearTimeout(t)
    }
  }, [])

  // Si no hay key configurada o estamos en dev local (NODE_ENV !== production),
  // devolvemos los children sin envolverlos. En dev no inicializamos PostHog
  // arriba, así que el provider tampoco tiene nada que hacer.
  if (
    !process.env.NEXT_PUBLIC_POSTHOG_KEY ||
    process.env.NODE_ENV !== "production"
  ) {
    return <>{children}</>
  }

  return (
    <PHProvider client={posthog}>
      {/* Suspense porque useSearchParams suspende durante el render inicial */}
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
