export const INNER_CIRCLE_INVESTMENT_PROGRESS_SLUG = "inner-circle-inversiones"
export const INNER_CIRCLE_TRADING_PROGRESS_SLUG = "inner-circle-trading"

export type ProgressCourseConfig = {
  progressSlug: string
  accessSlug: string
}

const PROGRESS_COURSE_CONFIG: Record<string, ProgressCourseConfig> = {
  [INNER_CIRCLE_INVESTMENT_PROGRESS_SLUG]: {
    progressSlug: INNER_CIRCLE_INVESTMENT_PROGRESS_SLUG,
    accessSlug: "inner-circle",
  },
  [INNER_CIRCLE_TRADING_PROGRESS_SLUG]: {
    progressSlug: INNER_CIRCLE_TRADING_PROGRESS_SLUG,
    accessSlug: "inner-circle",
  },
}

const INTERNAL_PROGRESS_ONLY_SLUGS = new Set<string>([
  INNER_CIRCLE_INVESTMENT_PROGRESS_SLUG,
  INNER_CIRCLE_TRADING_PROGRESS_SLUG,
])

export function resolveProgressCourseConfig(courseSlug: string): ProgressCourseConfig {
  const normalizedSlug = courseSlug.trim().toLowerCase()

  return PROGRESS_COURSE_CONFIG[normalizedSlug] ?? {
    progressSlug: normalizedSlug,
    accessSlug: normalizedSlug,
  }
}

export function isInternalProgressOnlyCourseSlug(courseSlug: string) {
  return INTERNAL_PROGRESS_ONLY_SLUGS.has(courseSlug.trim().toLowerCase())
}
