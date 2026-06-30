// Hook de instrumentación de Next.js. Se ejecuta una vez por runtime al arrancar
// el server. Carga la config de Sentry correspondiente (node o edge) y expone
// onRequestError para que los errores no manejados en server components y route
// handlers lleguen al dashboard.
//
// Next 16 ejecuta esto automáticamente (no requiere experimental.instrumentationHook).
import * as Sentry from "@sentry/nextjs"

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config")
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config")
  }
}

export const onRequestError = Sentry.captureRequestError
