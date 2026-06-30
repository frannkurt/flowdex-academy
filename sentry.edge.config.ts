// Configuración de Sentry para el runtime edge (Vercel Edge Functions, middleware
// con runtime "edge"). En Flowdex hoy no usamos edge runtime salvo lo que Next
// inyecta por default, pero dejamos esto para que cualquier error de edge se
// reporte igual.
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 0,

  enabled: process.env.NODE_ENV === "production",

  debug: false,
})
