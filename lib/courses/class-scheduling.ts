// Config SERVER-ONLY del agendado de clases en vivo.
//
// Las URLs de Cal.com viven acá y NO en el bundle del cliente. El alumno nunca
// recibe el link directo: el botón "Agendar clase" pega a
// /api/clases/[slug]/[module], que valida en la base que el progreso incluye
// los módulos requeridos y recién ahí redirige a la URL real. Así el gate de
// "completá el módulo antes de agendar" es real (server-side), no cosmético.
//
// IMPORTANTE: no importar este archivo desde componentes client. Los
// componentes mantienen su propia copia de requiredModules/label solo para la
// UX (habilitar/deshabilitar el botón); la verdad la dice el server.

export type ClassMilestone = {
  requiredModules: number[]
  url: string
}

export const CLASS_SCHEDULING: Record<string, Record<number, ClassMilestone>> = {
  "kickstart-trading": {
    2: { requiredModules: [1, 2], url: "https://cal.com/franco-escudero-5idua4/kt-c1" },
    3: { requiredModules: [1, 2, 3], url: "https://cal.com/franco-escudero-5idua4/kt-c2" },
    4: { requiredModules: [1, 2, 3, 4], url: "https://cal.com/franco-escudero-5idua4/kt-c3" },
  },
  "kickstart-investment": {
    2: { requiredModules: [1, 2], url: "https://cal.com/augusto-holman-flwjaq/ki-c1" },
    3: { requiredModules: [1, 2, 3], url: "https://cal.com/augusto-holman-flwjaq/ki-c2" },
    4: { requiredModules: [1, 2, 3, 4], url: "https://cal.com/augusto-holman-flwjaq/ki-c3" },
  },
  "expert-investment": {
    1: { requiredModules: [1], url: "https://cal.com/augusto-holman-flwjaq/ei-c1" },
    3: { requiredModules: [1, 2, 3], url: "https://cal.com/augusto-holman-flwjaq/ei-c2" },
    4: { requiredModules: [1, 2, 3, 4], url: "https://cal.com/augusto-holman-flwjaq/ei-c3" },
  },
  "trading-lab": {
    2: { requiredModules: [1, 2], url: "https://cal.com/franco-escudero-5idua4/tl-c1" },
    3: { requiredModules: [1, 2, 3], url: "https://cal.com/franco-escudero-5idua4/tl-c2" },
    4: { requiredModules: [1, 2, 3, 4], url: "https://cal.com/franco-escudero-5idua4/tl-c3" },
  },
}

export function getClassMilestone(slug: string, moduleNumber: number): ClassMilestone | null {
  return CLASS_SCHEDULING[slug]?.[moduleNumber] ?? null
}

// Link recurrente de las sesiones semanales del Inner Circle (jueves/viernes/
// sábado). No depende de completar módulos: se gatea por acceso activo al IC,
// vía /api/clases/inner-circle.
export const INNER_CIRCLE_CLASS_URL = "https://cal.com/franco-escudero-5idua4/ic"
