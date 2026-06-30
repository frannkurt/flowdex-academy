// Configuración de Sentry para el bundle del browser.
// Patrón canónico en @sentry/nextjs v10+ con Turbopack (Next 16). Reemplazó al
// viejo sentry.client.config.ts, que solo era detectado en builds con webpack.
//
// Setup minimalista (mayo 2026): solo error tracking, sin performance monitoring
// ni session replay (PostHog ya cubre replay de UX). Si más adelante se necesita
// replay del momento del error junto al stack trace, activar replaysOnErrorSampleRate.
//
// Las requests al ingest pasan por /monitoring (tunnelRoute en next.config.mjs),
// igual que PostHog pasa por /ingest. Esto evita adblockers, no toca CSP, y
// mantiene todo el tráfico dentro de flowdex.com.ar.
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring desactivado para no consumir cuota free en transacciones.
  // Si en algún momento querés trazas de algún endpoint específico, sampleá selectivo.
  tracesSampleRate: 0,

  // Session replay desactivado (lo hace PostHog).
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Solo enviar errores en producción. En dev queremos verlos en consola, no spamear Sentry.
  enabled: process.env.NODE_ENV === "production",

  // Filtrado de ruido común que no aporta nada accionable.
  ignoreErrors: [
    // Extensiones del browser
    "top.GLOBALS",
    // Errores de scripts cross-origin que no podemos debuggear
    "Script error.",
    // ResizeObserver loop noise que dispara cualquier librería con animaciones
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    // Network errors que ya manejamos en flujo (ej: usuario perdió wifi en checkout)
    "NetworkError",
    "Failed to fetch",

    // Web Locks API del SDK de Supabase: cuando hay varias pestañas/requests
    // coordinando el refresh del auth-token, una "roba" el lock y la otra reporta
    // esto. Es benigno (el refresh igual sucede), no afecta al usuario. 0 users.
    /Lock.*was released because another request stole it/,
    "Lock was stolen by another request",
    "Lock broken by another request",

    // Webview embebido (apps tipo Instagram/Android) y extensiones que inyectan
    // sus propios bridges. No es código nuestro, no es accionable.
    "window.webkit.messageHandlers",
    "Java object is gone",

    // Extensiones del visitante (billeteras cripto, password managers) que se
    // inyectan en la página. Ruido puro del entorno del cliente, 0 users.
    "Failed to connect to MetaMask",
    "Object Not Found Matching Id",

    // Conflicto React + Google Translate: el traductor mueve los text nodes y
    // React no los encuentra al reconciliar. Solo ocurre con traductor activo
    // (confirmado). Decisión: no soportar traductor por ahora (el fix global
    // tiene riesgo de regresión y el público que traduce es marginal en un sitio
    // en español). Se silencia el reporte; el comportamiento del sitio no se toca.
    /Failed to execute '(removeChild|insertBefore)' on 'Node'/,
  ],

  debug: false,
})

// Hook para capturar errores de navegación en App Router (Next 15+).
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
