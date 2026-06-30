import Link from "next/link"

// Inner Circle Q&A: un solo event type en Cal.com que ofrece los 3 horarios
// semanales (jueves 21hs, viernes 20hs, sábado 14hs ARG). El alumno entra al
// link y elige el día que le convenga. El link real vive server-only; pegamos
// al endpoint que valida acceso activo al IC antes de redirigir.
const INNER_CIRCLE_SCHEDULE_ENDPOINT = "/api/clases/inner-circle"

export function InnerCircleScheduleButtons() {
  return (
    <Link
      href={INNER_CIRCLE_SCHEDULE_ENDPOINT}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-[#D4B86A]/40 bg-[#D4B86A]/10 px-3 py-2 text-center text-xs uppercase tracking-[0.14em] text-[#E8D7A0] transition-colors hover:border-[#D4B86A]/70 hover:bg-[#D4B86A]/15 hover:text-white"
    >
      Agendar Q&A semanal
    </Link>
  )
}
