/**
 * Bloque de cita filosófica clásica.
 *
 * Renderiza citas directas de pensadores (estoicos, presocráticos, clásicos
 * grecorromanos, modernos que recogen lo clásico) sin adaptación al lore
 * del Patio. Estas citas acompañan el contenido como referencia editorial
 * fuera del universo simbólico Flowdex.
 *
 * Se diferencia visualmente del LoreQuote (púrpura, voz del Patio),
 * CrossReference (dorado, navegación entre cursos) y ToolLink (aqua,
 * herramientas del sitio) mediante una paleta pizarra / slate que evoca
 * manuscrito antiguo o tablilla académica.
 */

export type PhilosophyQuoteProps = {
  text: string
  author: string
  source?: string
}

export function PhilosophyQuote({ text, author, source }: PhilosophyQuoteProps) {
  return (
    <figure className="relative my-2 overflow-hidden rounded-xl border border-[#6E7E92]/25 bg-gradient-to-br from-[#131722]/70 to-[#0E1118]/55 px-5 py-5 sm:px-7 sm:py-6">
      {/* Marca decorativa lateral */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#6E7E92]/0 via-[#8A95A4]/40 to-[#6E7E92]/0"
      />

      <blockquote className="relative pl-3 sm:pl-4">
        <p className="font-serif text-[15px] leading-relaxed text-[#D4D8DE] whitespace-pre-line sm:text-[16px] sm:leading-[1.75]">
          “{text}”
        </p>
        <footer className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#8A95A4]">
            ·
          </span>
          <cite className="not-italic text-[13px] font-medium text-[#B8C5D4] sm:text-sm">
            {author}
          </cite>
          {source && (
            <span className="text-[12px] italic text-[#8A95A4] sm:text-[12.5px]">
              {source}
            </span>
          )}
        </footer>
      </blockquote>
    </figure>
  )
}
