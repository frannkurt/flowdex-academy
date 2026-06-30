import Link from "next/link"
import { ClipboardCheck } from "lucide-react"

type Props = {
  courseSlug: string
  moduleNumber: number
}

/**
 * Botón de acceso al examen del módulo. Es OPCIONAL: no bloquea el avance
 * del módulo (eso lo decide el alumno marcando "Módulo completado"). El
 * botón abre `/examen/[slug]/[module]` en una ruta aparte para no recargar
 * la página del curso.
 *
 * Estilo: borde dorado tenue + texto chico aclarando que es opcional. La
 * idea es que se diferencie del CTA principal ("Marcar como completado")
 * y del CTA de agendado de clase.
 */
export function ExamButton({ courseSlug, moduleNumber }: Props) {
  return (
    <Link
      href={`/examen/${courseSlug}/${moduleNumber}`}
      className="inline-flex items-center gap-2 rounded-lg border border-[#D4B86A]/30 bg-[#D4B86A]/5 px-5 py-2.5 text-sm text-[#D4B86A] transition-colors hover:border-[#D4B86A]/60 hover:bg-[#D4B86A]/10"
    >
      <ClipboardCheck className="h-4 w-4" />
      Tomar examen del módulo
      <span className="ml-1 text-[10px] uppercase tracking-[0.2em] text-[#D4B86A]/60">
        Opcional
      </span>
    </Link>
  )
}
