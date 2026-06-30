// Configuración de Sentry para el runtime server (Node.js).
// Captura errores en API routes, server actions, server components, middleware
// (cuando corre en Node). Setup minimalista igual que client: solo error tracking.
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 0,

  enabled: process.env.NODE_ENV === "production",

  debug: false,
})
