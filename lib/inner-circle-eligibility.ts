import { kickstartInvestmentContent } from "@/lib/courses/kickstart-investment-content"
import { expertInvestmentContent } from "@/lib/courses/expert-investment-content"
import { kickstartTradingContent } from "@/lib/courses/kickstart-trading-content"
import { tradingLabContent } from "@/lib/courses/trading-lab-content"
import type { SupabaseClient } from "@supabase/supabase-js"

type UserCourseRow = {
  courses:
    | {
        slug: string | null
      }
    | null
}

type CourseProgressRow = {
  completed_modules: unknown
  courses:
    | {
        slug: string | null
      }
    | Array<{
        slug: string | null
      }>
    | null
}

type PathCourseStatus = {
  slug: string
  unlocked: boolean
  completedModules: number
  totalModules: number
  completed: boolean
}

type PathStatus = {
  key: "investment" | "trading"
  completed: boolean
  suggestedCourseSlug: string | null
  courses: PathCourseStatus[]
}

export type InnerCircleEligibilityResult = {
  isEligible: boolean
  paths: PathStatus[]
}

const PATHS: Array<{ key: "investment" | "trading"; slugs: string[] }> = [
  { key: "investment", slugs: ["kickstart-investment", "expert-investment"] },
  { key: "trading", slugs: ["kickstart-trading", "trading-lab"] },
]

function countCompletedModules(value: unknown, maxModules?: number) {
  if (!Array.isArray(value)) {
    return 0
  }

  const valid = value
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item >= 1)

  const completedCount = new Set(valid).size

  if (typeof maxModules === "number" && maxModules > 0) {
    return Math.min(completedCount, maxModules)
  }

  return completedCount
}

function getTotalModulesBySlug(slug: string) {
  switch (slug) {
    case "kickstart-investment":
      return kickstartInvestmentContent.filter((item) => item.number > 0).length
    case "expert-investment":
      return expertInvestmentContent.filter((item) => item.number > 0).length
    case "kickstart-trading":
      return kickstartTradingContent.filter((item) => item.number > 0).length
    case "trading-lab":
      return tradingLabContent.filter((item) => item.number > 0).length
    default:
      return 0
  }
}

function getSlugFromCourseRelation(courses: CourseProgressRow["courses"]) {
  if (!courses) {
    return ""
  }

  if (Array.isArray(courses)) {
    return courses[0]?.slug ?? ""
  }

  return courses.slug ?? ""
}

export async function getInnerCircleEligibility(
  supabase: SupabaseClient,
  userId: string
): Promise<InnerCircleEligibilityResult> {
  const nowIso = new Date().toISOString()

  const [unlockedResult, progressResult] = await Promise.all([
    supabase
      .from("user_courses")
      .select("courses(slug)")
      .eq("user_id", userId)
      .eq("is_active", true)
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`),
    supabase
      .from("course_progress")
      .select("completed_modules, courses(slug)")
      .eq("user_id", userId),
  ])

  const unlockedRows = (unlockedResult.data as UserCourseRow[] | null) ?? []
  const progressRows = (progressResult.data as CourseProgressRow[] | null) ?? []

  const unlockedSlugs = new Set(
    unlockedRows
      .map((row) => row.courses?.slug ?? "")
      .filter((slug) => Boolean(slug))
  )

  const completedModulesBySlug = new Map(
    progressRows
      .map((row) => {
        const slug = getSlugFromCourseRelation(row.courses)

        if (!slug) {
          return null
        }

        const totalModules = getTotalModulesBySlug(slug)
        return [slug, countCompletedModules(row.completed_modules, totalModules)] as const
      })
      .filter((entry): entry is readonly [string, number] => entry !== null)
  )

  const paths: PathStatus[] = PATHS.map((path) => {
    const courses = path.slugs.map((slug) => {
      const totalModules = getTotalModulesBySlug(slug)
      const completedModules = completedModulesBySlug.get(slug) ?? 0
      const unlocked = unlockedSlugs.has(slug)
      const completed = totalModules > 0 && unlocked && completedModules >= totalModules

      return {
        slug,
        unlocked,
        completedModules,
        totalModules,
        completed,
      }
    })

    return {
      key: path.key,
      completed: courses.every((course) => course.completed),
      suggestedCourseSlug: courses.find((course) => !course.completed)?.slug ?? null,
      courses,
    }
  })

  return {
    isEligible: paths.some((path) => path.completed),
    paths,
  }
}