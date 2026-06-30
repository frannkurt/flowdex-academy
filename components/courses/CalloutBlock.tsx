/**
 * Bloque de "callout" con tres variantes semánticas.
 *
 * Reemplaza el render legacy de callout que era todo del mismo color.
 * Ahora cada callout transmite jerarquía según su mensaje:
 *
 * - "warning" → naranja universal con triángulo. Reservado para riesgo real,
 *   trampas y alertas que pueden costarle plata al alumno. Frecuencia baja.
 *
 * - "key" → dorado universal con divider sobrio. Para fórmulas, principios,
 *   reglas y ideas-ancla que el alumno debe guardar mentalmente. Frecuencia
 *   media.
 *
 * - "info" → color del módulo (teal/blue/gold según el módulo donde aparece).
 *   Default. Para contexto, ejemplos resueltos, "por qué importa", notas
 *   pedagógicas. Frecuencia alta.
 *
 * Si no se especifica `variant`, se asume "info" para compatibilidad hacia
 * atrás. Los renderers de cada curso siguen pudiendo customizar el estilo
 * del variant "info" si quieren (algunos usaban naranja por default).
 */

import type { ReactNode } from "react"

type CalloutVariant = "warning" | "key" | "info"

type ModuleColors = {
  highlight: string
  icon: string
  number?: string
  accentText?: string
}

type CalloutBlockProps = {
  label: string
  variant?: CalloutVariant
  colors: ModuleColors
  children: ReactNode
}

export function CalloutBlock({ label, variant, colors, children }: CalloutBlockProps) {
  const resolved: CalloutVariant = variant ?? "info"

  if (resolved === "warning") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-[#C47A2A]/30 bg-[#C47A2A]/8 px-5 py-4">
        <span className="mt-0.5 shrink-0 text-[#E09040]">⚠</span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#E09040]">{label}</p>
          <p className="mt-1.5 text-[14px] leading-6 text-[#D4B088]">{children}</p>
        </div>
      </div>
    )
  }

  if (resolved === "key") {
    return (
      <div className="rounded-xl border border-[#D4B86A]/30 bg-[#1A1408]/40 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D4B86A]">{label}</p>
        <p className="mt-2 text-sm leading-relaxed text-[#E6DAB6]">{children}</p>
      </div>
    )
  }

  // info — usa el color del módulo (teal/blue/gold).
  const accent = colors.accentText ?? colors.icon
  return (
    <div className={`rounded-xl border px-5 py-4 ${colors.highlight}`}>
      <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${accent}`}>{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-[#D5D5D5]">{children}</p>
    </div>
  )
}
