import Link from "next/link"

// Migas de orientación dentro del curso: Dashboard › Curso › Módulo actual.
// El nombre del curso NO es link a propósito (estando en otro módulo, un click
// accidental te mandaría al módulo 1). El módulo actual se pinta con el color
// de la tríada del curso y se actualiza al navegar.

type Props = {
  courseName: string
  moduleLabel: string
  accentClassName: string
  // Los sub-cursos del Inner Circle vuelven a su hub interno
  // (/courses/inner-circle), no al dashboard general: el alumno sale del IC
  // recién con un segundo click desde el hub.
  dashboardHref?: string
  dashboardLabel?: string
}

export function CourseBreadcrumb({
  courseName,
  moduleLabel,
  accentClassName,
  dashboardHref = "/dashboard",
  dashboardLabel = "Dashboard",
}: Props) {
  return (
    <nav
      aria-label="Migas de navegación"
      className="mb-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#777777]"
    >
      <Link href={dashboardHref} className="transition-colors hover:text-white">
        {dashboardLabel}
      </Link>
      <span aria-hidden className="text-[#444444]">›</span>
      <span className="text-[#999999]">{courseName}</span>
      <span aria-hidden className="text-[#444444]">›</span>
      <span className={accentClassName}>{moduleLabel}</span>
    </nav>
  )
}
