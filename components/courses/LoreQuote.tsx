/**
 * Bloque de cita del lore Flowdex.
 *
 * Renderiza las voces de los arquetipos del Patio (El Aprendiz, El Maestro,
 * El que se fue y volvió, El que mira de afuera, El que vuelve cada noche,
 * El que nunca cruzó) con un styling distintivo púrpura suave / serif que
 * las diferencia visualmente del resto del contenido del curso.
 *
 * Si la cita incluye una referencia a un mito griego (Ícaro, Cassandra,
 * Aquiles, Sísifo, Penélope, etc.), la atribución a la fuente clásica
 * aparece unida al final del bloque como pie editorial, no como bloque
 * separado.
 */

export type LoreQuoteProps = {
  text: string
  speaker: string
  mythReference?: string
}

export function LoreQuote({ text, speaker, mythReference }: LoreQuoteProps) {
  return (
    <figure className="relative my-2 overflow-hidden rounded-xl border border-[#7C5BCB]/15 bg-gradient-to-br from-[#15131C]/80 to-[#0E0D14]/60 px-5 py-6 sm:px-7 sm:py-7">
      {/* Comilla decorativa */}
      <span
        aria-hidden
        className="absolute left-4 top-1 font-serif text-6xl leading-none text-[#9B7AE0]/25 sm:left-5 sm:text-7xl"
      >
        “
      </span>

      <blockquote className="relative pl-6 sm:pl-8">
        <p className="font-serif text-[15px] italic leading-relaxed text-[#D8D2E0] whitespace-pre-line sm:text-[16px] sm:leading-[1.75]">
          {text}
        </p>
        <footer className="mt-4 flex flex-col gap-1.5">
          <cite className="not-italic">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#9B7AE0]/70">
              Voz del Patio ·{" "}
            </span>
            <span className="font-serif text-[13px] italic text-[#B89BE8] sm:text-sm">
              {speaker}
            </span>
          </cite>
          {mythReference && (
            <p className="text-[11px] leading-relaxed text-[#8E869F] sm:text-[12px]">
              <span className="mr-1.5 inline-block text-[#9B7AE0]/55">↳</span>
              {mythReference}
            </p>
          )}
        </footer>
      </blockquote>
    </figure>
  )
}
