// Cantidad total de módulos por curso público.
//
// Fuente de verdad: los arrays *Content en lib/courses/<slug>-content.ts.
// Cada item tiene un `number`; los que tienen number > 0 son módulos
// numerados (los 0 son secciones intro/aparte y no se cuentan).
//
// Lo extraemos a un módulo aparte porque varios consumidores lo necesitan:
// - inner-circle-eligibility.ts (gating de Inner Circle por finalización)
// - MetricsPanel (tasa de finalización por curso, distribución de progreso)
//
// Si en el futuro se agregan cursos nuevos, sumarlos al switch acá una
// sola vez.

import { kickstartInvestmentContent } from "@/lib/courses/kickstart-investment-content"
import { expertInvestmentContent } from "@/lib/courses/expert-investment-content"
import { kickstartTradingContent } from "@/lib/courses/kickstart-trading-content"
import { tradingLabContent } from "@/lib/courses/trading-lab-content"

export const PUBLIC_COURSE_SLUGS = [
  "kickstart-investment",
  "expert-investment",
  "kickstart-trading",
  "trading-lab",
  "inner-circle",
  "membresia",
] as const

export type PublicCourseSlug = (typeof PUBLIC_COURSE_SLUGS)[number]

export function getTotalModulesBySlug(slug: string): number {
  switch (slug) {
    case "kickstart-investment":
      return kickstartInvestmentContent.filter((item) => item.number > 0).length
    case "expert-investment":
      return expertInvestmentContent.filter((item) => item.number > 0).length
    case "kickstart-trading":
      return kickstartTradingContent.filter((item) => item.number > 0).length
    case "trading-lab":
      return tradingLabContent.filter((item) => item.number > 0).length
    default:
      // Inner Circle y Membresía no se miden por módulos completados (son
      // experiencias en vivo / acceso a comunidad). Devolvemos 0 para que
      // el MetricsPanel los excluya de tasa de finalización.
      return 0
  }
}

// Devuelve el número de módulos completados a partir del jsonb persistido
// en course_progress.completed_modules. Robusto contra valores no esperados.
export function countCompletedModules(value: unknown, maxModules?: number): number {
  if (!Array.isArray(value)) {
    return 0
  }

  const valid = value
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item >= 1)

  const uniqueValid = Array.from(new Set(valid))
  const completedCount = uniqueValid.length

  if (typeof maxModules === "number" && maxModules > 0) {
    // Si la lista persistida tiene módulos por encima del máximo (por ej.
    // restos viejos de un curso con menos módulos), no inflamos el count.
    const capped = uniqueValid.filter((n) => n <= maxModules)
    return Math.min(capped.length, maxModules)
  }

  return completedCount
}
