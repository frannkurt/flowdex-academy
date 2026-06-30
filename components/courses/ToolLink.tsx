/**
 * Bloque "Herramienta del sitio" para enlazar a páginas internas de Flowdex
 * (journal, calendario económico, calculadora de posición, etc.) desde el
 * contenido del curso.
 *
 * Se abre SIEMPRE en una pestaña nueva para que el alumno no pierda el
 * punto de lectura donde estaba dentro del curso.
 *
 * Visualmente: card destacada con borde aqua en una sola columna — eyebrow,
 * nombre, descripción corta y CTA explícita "Abrir en pestaña nueva ↗".
 */

export type ToolLinkProps = {
  toolName: string
  description: string
  href: string
  ctaLabel?: string
  /** Etiqueta superior. Por defecto "Herramienta del sitio". */
  eyebrow?: string
}

export function ToolLink({ toolName, description, href, ctaLabel, eyebrow }: ToolLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block no-underline"
    >
      <div className="rounded-xl border border-[#5BB8D4]/30 bg-gradient-to-br from-[#0E1A22]/70 to-[#0A1116]/40 px-5 py-4 transition-all hover:border-[#5BB8D4]/55 hover:from-[#0F1E27]/80 sm:px-6 sm:py-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7DD4C0]">
          {eyebrow ?? "Herramienta del sitio"}
        </span>
        <p className="mt-2 text-[15px] font-semibold leading-snug text-white sm:text-base">
          {toolName}
        </p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#B8BDC9] sm:text-[13px]">
          {description}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#5BB8D4] transition-colors group-hover:text-[#7DD4C0] sm:text-[13px]">
          {ctaLabel ?? "Abrir en pestaña nueva"}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
        </span>
      </div>
    </a>
  )
}
