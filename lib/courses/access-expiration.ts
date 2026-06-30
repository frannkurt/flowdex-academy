const FOUR_MONTH_COURSE_SLUGS = new Set([
  "kickstart-investment",
  "expert-investment",
  "kickstart-trading",
  "trading-lab",
])

// Inner Circle = 12 meses de acceso al contenido del curso (anexos, módulos, /la-dama).
// Membresía = 30 días de acceso a Discord + Telegram con Franco y la comunidad.
// Cuando el alumno paga inner-circle, recibe AUTOMÁTICAMENTE 1 mes gratis de
// membresía (lo hace un trigger SQL en user_courses). Para mantener Discord/Telegram
// después del primer mes, el alumno renueva pagando $50 → +30 días sobre el período actual.
const MEMBRESIA_DURATION_DAYS = 30

function addMonths(baseDate: Date, months: number) {
  const next = new Date(baseDate)
  next.setMonth(next.getMonth() + months)
  return next
}

function addDays(baseDate: Date, days: number) {
  const next = new Date(baseDate)
  next.setDate(next.getDate() + days)
  return next
}

export function getAccessDurationMs(courseSlug: string) {
  const now = new Date()

  if (courseSlug === "membresia") {
    return addDays(now, MEMBRESIA_DURATION_DAYS).getTime() - now.getTime()
  }

  if (courseSlug === "inner-circle") {
    return addMonths(now, 12).getTime() - now.getTime()
  }

  if (FOUR_MONTH_COURSE_SLUGS.has(courseSlug)) {
    return addMonths(now, 4).getTime() - now.getTime()
  }

  return addMonths(now, 3).getTime() - now.getTime()
}

export function getCourseAccessExpiryDate(courseSlug: string, grantedAt?: Date) {
  const baseDate = grantedAt ?? new Date()

  if (courseSlug === "membresia") {
    return addDays(baseDate, MEMBRESIA_DURATION_DAYS)
  }

  if (courseSlug === "inner-circle") {
    return addMonths(baseDate, 12)
  }

  if (FOUR_MONTH_COURSE_SLUGS.has(courseSlug)) {
    return addMonths(baseDate, 4)
  }

  return addMonths(baseDate, 3)
}
