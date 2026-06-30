// Catálogo de packs del Flowdex Desk — fuente única de verdad de créditos,
// pases del Radar y precio por SKU. Lo consumen el create de la orden (para
// fijar monto/créditos/pase en el server, nunca confiando en el cliente) y la
// UI del checkout.
//
// Modelo cerrado 2026-06-10 (BACKLOG item 10), implementado JUNTO con el Radar:
// - Packs de créditos: 5/$12 · 20/$39 · 30/$99 (Premium, incluye Radar 90 días).
// - Pases del Radar (por tiempo, sin suscripción): 30d/$19 · 90d/$49 ·
//   1 año/$149 (+10 análisis de cross-bonus, simétrico con el Premium).
// - 1 crédito = 1 Lectura Flowdex completa o 1 análisis de dividendo.

export type DeskPackId =
  | "inicial"
  | "pro"
  | "intensivo"
  | "radar30"
  | "radar90"
  | "radar365"

export type DeskPack = {
  id: DeskPackId
  kind: "credits" | "radar"
  name: string
  credits: number
  radarDays: number // días de pase del Radar de Dividendos (0 = sin pase)
  priceUsd: number
  perAnalysis: string // calculado, para mostrar ("" en pases puros)
  tagline: string
  highlight: boolean
  badge?: string
}

export const DESK_PACKS: Record<DeskPackId, DeskPack> = {
  inicial: {
    id: "inicial",
    kind: "credits",
    name: "Inicial",
    credits: 5,
    radarDays: 0,
    priceUsd: 12,
    perAnalysis: "2,40",
    tagline: "Para estirar el mes cuando los gratis no alcanzan.",
    highlight: false,
  },
  pro: {
    id: "pro",
    kind: "credits",
    name: "Pro",
    credits: 20,
    radarDays: 0,
    priceUsd: 39,
    perAnalysis: "1,95",
    tagline: "Para revisar la cartera y estudiar ideas nuevas cada semana.",
    highlight: true,
    badge: "Más elegido",
  },
  intensivo: {
    id: "intensivo",
    kind: "credits",
    name: "Premium",
    credits: 30,
    radarDays: 90,
    priceUsd: 99,
    perAnalysis: "3,30",
    tagline: "30 análisis + el Radar de Dividendos por 90 días. Todo incluido.",
    highlight: false,
    badge: "Todo incluido",
  },
  radar30: {
    id: "radar30",
    kind: "radar",
    name: "Radar · 30 días",
    credits: 0,
    radarDays: 30,
    priceUsd: 19,
    perAnalysis: "",
    tagline: "Un mes del Radar de Dividendos completo: estados, rachas y calculadora.",
    highlight: false,
  },
  radar90: {
    id: "radar90",
    kind: "radar",
    name: "Radar · 90 días",
    credits: 0,
    radarDays: 90,
    priceUsd: 49,
    perAnalysis: "",
    tagline: "Un trimestre del Radar: seguí la calidad de tu renta sin apuro.",
    highlight: true,
    badge: "Recomendado",
  },
  radar365: {
    id: "radar365",
    kind: "radar",
    name: "Radar · 1 año",
    credits: 10,
    radarDays: 365,
    priceUsd: 149,
    perAnalysis: "",
    tagline: "Un año del Radar + 10 análisis incluidos de regalo.",
    highlight: false,
    badge: "+10 análisis",
  },
}

// Los créditos comprados vencen a los 3 meses de la compra (modelo 2026-06-10:
// antes 6 — se acorta junto con el reempaque de packs para no acumular pasivo
// eterno). Los gratis no vencen: son one-time (cliente) o mensuales (founder).
export const DESK_CREDIT_EXPIRY_MONTHS = 3

export function getDeskPack(id: string | null | undefined): DeskPack | null {
  if (!id) return null
  return (DESK_PACKS as Record<string, DeskPack>)[id] ?? null
}

export const DESK_PACK_LIST: DeskPack[] = [
  DESK_PACKS.inicial,
  DESK_PACKS.pro,
  DESK_PACKS.intensivo,
]

export const DESK_RADAR_PASS_LIST: DeskPack[] = [
  DESK_PACKS.radar30,
  DESK_PACKS.radar90,
  DESK_PACKS.radar365,
]
