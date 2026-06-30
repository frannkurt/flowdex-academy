import Link from "next/link"

/**
 * Bloque "Ver también" para conectar módulos entre cursos.
 *
 * Se usa adentro del contenido de los cursos para apuntar a temas que se
 * profundizan en otros niveles (Kickstart → Expert → Inner Circle, o cruces
 * entre Inversiones y Trading). Mejora la percepción de sistema en lugar de
 * cursos sueltos.
 *
 * Visualmente: caja sutil con borde sutil dorado, ícono de flecha, label
 * "VER TAMBIÉN" en mayúscula chica, curso/módulo destino destacado, y la
 * razón pedagógica de la cita.
 */

export type CrossReferenceProps = {
  targetCourse: string
  targetModule: string
  reason: string
  href?: string
}

export function CrossReference({
  targetCourse,
  targetModule,
  reason,
  href,
}: CrossReferenceProps) {
  const content = (
    <div className="group flex flex-col gap-2 rounded-xl border border-[#D4B86A]/25 bg-[#1A1408]/40 px-4 py-3 transition-colors hover:border-[#D4B86A]/45 sm:flex-row sm:items-start sm:gap-4 sm:px-5 sm:py-4">
      <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4B86A]">
          Ver también
        </span>
        <span aria-hidden className="text-[#D4B86A]/70 sm:hidden">·</span>
        <span aria-hidden className="hidden text-[14px] text-[#D4B86A]/60 sm:inline">↗</span>
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-medium leading-snug text-[#E6DAB6] sm:text-sm">
          {targetCourse} · <span className="text-white">{targetModule}</span>
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-[#9A8E6E] sm:text-[13px]">
          {reason}
        </p>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {content}
      </Link>
    )
  }

  return content
}
