// Helper de analytics de la landing del Desk. posthog-js ya queda inicializado
// por PostHogProvider (layout raíz); si la key no está, capture es inocuo.
import posthog from "posthog-js"

export function track(event: string, props?: Record<string, unknown>) {
  try {
    posthog.capture(event, props)
  } catch {
    // analytics nunca rompe la página
  }
}
