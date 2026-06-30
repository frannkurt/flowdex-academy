import Link from "next/link"
import { redirect } from "next/navigation"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ScheduleClassButton } from "@/components/dashboard/ScheduleClassButton"
import { InnerCircleScheduleButtons } from "@/components/dashboard/InnerCircleScheduleButtons"
import { CourseBadges } from "@/components/dashboard/CourseBadges"
import { CommunitiesSection } from "@/components/dashboard/CommunitiesSection"
import { PhilosophyHero } from "@/components/dashboard/PhilosophyHero"
import { PanelGuideButton } from "@/components/dashboard/PanelGuideButton"
import { kickstartInvestmentContent } from "@/lib/courses/kickstart-investment-content"
import { expertInvestmentContent } from "@/lib/courses/expert-investment-content"
import { kickstartTradingContent } from "@/lib/courses/kickstart-trading-content"
import { tradingLabContent } from "@/lib/courses/trading-lab-content"
import { isInternalProgressOnlyCourseSlug } from "@/lib/courses/progress-course-config"

const KICKSTART_INVESTMENT_SLUG = "kickstart-investment"
const EXPERT_INVESTMENT_SLUG = "expert-investment"
const KICKSTART_TRADING_SLUG = "kickstart-trading"
const TRADING_LAB_SLUG = "trading-lab"

const COURSE_COMPLEXITY_ORDER: Record<string, number> = {
  "kickstart-investment": 1,
  "kickstart-trading": 2,
  membresia: 3,
  "expert-investment": 4,
  "trading-lab": 5,
  "inner-circle": 6,
}

type PurchasedCourse = {
  courseId: string
  title: string
  description: string
  price: number
  slug: string
  status: string
  grantedAt: string
  expiresAt: string
}

type DashboardCourse = {
  courseId: string
  title: string
  description: string
  price: number
  slug: string
  status: "active" | "locked"
  grantedAt: string
  expiresAt: string
  isUnlocked: boolean
}

type CourseCatalogRow = {
  id: string
  name: string | null
  description: string | null
  price: number | null
  slug: string | null
}

type UserCourseRow = {
  user_id: string
  course_id: string
  granted_at: string | null
  expires_at: string | null
  is_active: boolean | null
  courses:
    | {
        id: string
        name: string | null
        description: string | null
        price: number | null
        slug: string | null
      }
    | null
}

type CourseRelation =
  | {
      slug: string | null
    }
  | Array<{
      slug: string | null
    }>
  | null

type CourseProgressRow = {
  course_id: string
  completed_modules: unknown
  courses: CourseRelation
}

function getSlugFromCourseRelation(courses: CourseRelation) {
  if (!courses) {
    return ""
  }

  if (Array.isArray(courses)) {
    return courses[0]?.slug ?? ""
  }

  return courses.slug ?? ""
}

function getCourseInstructor(slug: string) {
  switch (slug) {
    case "kickstart-investment":
      return "Augusto Holman"
    case "trading-lab":
      return "Augusto Holman y Franco Escudero"
    case "expert-investment":
      return "Augusto Holman"
    case "inner-circle":
      return "Franco Escudero"
    case "kickstart-trading":
      return "Franco Escudero"
    case "membresia":
      return "Equipo Flowdex"
    default:
      return "Equipo Flowdex"
  }
}

type CourseTheme = {
  accent: string
  label: string
  borderActive: string
  borderLocked: string
  bgActive: string
  text: string
  badge: string
  ctaSolid: string
  ctaSoft: string
  progressFrom: string
  progressTo: string
  glowFrom: string
  glowTo: string
}

function getCourseTheme(slug: string): CourseTheme {
  const isInvestment = slug === "kickstart-investment" || slug === "expert-investment"
  const isTrading = slug === "kickstart-trading" || slug === "trading-lab"

  if (isInvestment) {
    return {
      accent: "#5BB8D4",
      label: "INVERSIÓN",
      borderActive: "border-[#5BB8D4]/55 hover:border-[#5BB8D4]/85",
      borderLocked: "border-[#5BB8D4]/15 hover:border-[#5BB8D4]/40",
      bgActive: "bg-[#5BB8D4]/[0.04]",
      text: "text-[#5BB8D4]",
      badge: "border border-[#5BB8D4]/40 bg-[#5BB8D4]/10 text-[#5BB8D4]",
      ctaSolid: "bg-[#5BB8D4] hover:bg-[#7DC8E0] text-[#0A1A20]",
      ctaSoft: "border border-[#5BB8D4]/45 bg-[#5BB8D4]/10 text-[#B9E2F0] hover:bg-[#5BB8D4]/20 hover:text-white",
      progressFrom: "from-[#3D9CBE]",
      progressTo: "to-[#5BB8D4]",
      glowFrom: "bg-[#5BB8D4]/20",
      glowTo: "bg-[#3D9CBE]/15",
    }
  }

  if (isTrading) {
    return {
      accent: "#7DD4C0",
      label: "TRADING",
      borderActive: "border-[#7DD4C0]/55 hover:border-[#7DD4C0]/85",
      borderLocked: "border-[#7DD4C0]/15 hover:border-[#7DD4C0]/40",
      bgActive: "bg-[#7DD4C0]/[0.04]",
      text: "text-[#7DD4C0]",
      badge: "border border-[#7DD4C0]/40 bg-[#7DD4C0]/10 text-[#7DD4C0]",
      ctaSolid: "bg-[#7DD4C0] hover:bg-[#9FE0CF] text-[#0A1A18]",
      ctaSoft: "border border-[#7DD4C0]/45 bg-[#7DD4C0]/10 text-[#B7E8DC] hover:bg-[#7DD4C0]/20 hover:text-white",
      progressFrom: "from-[#5BB8D4]",
      progressTo: "to-[#7DD4C0]",
      glowFrom: "bg-[#7DD4C0]/20",
      glowTo: "bg-[#5BB8D4]/15",
    }
  }

  // Inner Circle (dorado)
  return {
    accent: "#D4B86A",
    label: "INNER CIRCLE",
    borderActive: "border-[#D4B86A]/55 hover:border-[#D4B86A]/85",
    borderLocked: "border-[#D4B86A]/22 hover:border-[#D4B86A]/45",
    bgActive: "bg-[#D4B86A]/[0.04]",
    text: "text-[#D4B86A]",
    badge: "border border-[#D4B86A]/45 bg-[#D4B86A]/10 text-[#D4B86A]",
    ctaSolid: "bg-[#D4B86A] hover:bg-[#E0C97A] text-[#1A1408]",
    ctaSoft: "border border-[#D4B86A]/45 bg-[#D4B86A]/10 text-[#E8D7A0] hover:bg-[#D4B86A]/20 hover:text-white",
    progressFrom: "from-[#B89A4A]",
    progressTo: "to-[#D4B86A]",
    glowFrom: "bg-[#D4B86A]/22",
    glowTo: "bg-[#B89A4A]/15",
  }
}

function getCourseProgram(slug: string) {
  switch (slug) {
    case "kickstart-investment":
      return kickstartInvestmentContent.map((item) => {
        if (item.number === 0) {
          return `Apertura: ${item.title}`
        }
        return `Modulo ${item.number}: ${item.title}`
      })
    case "expert-investment":
      return expertInvestmentContent.map((item) => {
        if (item.number === 0) {
          return `Apertura: ${item.title}`
        }
        return `Modulo ${item.number}: ${item.title}`
      })
    case "kickstart-trading":
      return kickstartTradingContent.map((item) => {
        if (item.number === 0) {
          return `Apertura: ${item.title}`
        }
        return `Modulo ${item.number}: ${item.title}`
      })
    case "trading-lab":
      return tradingLabContent.map((item) => {
        if (item.number === 0) {
          return `Apertura: ${item.title}`
        }
        return `Modulo ${item.number}: ${item.title}`
      })
    default:
      return null
  }
}

async function getPurchasedCourses(userId: string) {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from("user_courses")
    .select("user_id, course_id, granted_at, expires_at, is_active, courses(id, name, description, price, slug)")
    .eq("user_id", userId)
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("granted_at", { ascending: false })

  if (error || !data || data.length === 0) {
    return []
  }

  return (data as unknown as UserCourseRow[])
    .filter((purchase) => purchase.courses !== null)
    .map((purchase) => ({
      courseId: purchase.courses?.id ?? "",
      title: purchase.courses?.name ?? "Curso sin titulo",
      description: purchase.courses?.description ?? "Sin descripcion",
      price: purchase.courses?.price ?? 0,
      slug: purchase.courses?.slug ?? "",
      status: purchase.is_active ? "active" : "inactive",
      grantedAt: purchase.granted_at
        ? new Date(purchase.granted_at).toLocaleDateString("es-AR")
        : "-",
      expiresAt: purchase.expires_at
        ? new Date(purchase.expires_at).toLocaleDateString("es-AR")
        : "-",
    }))
    .sort((a, b) => {
      const aOrder = COURSE_COMPLEXITY_ORDER[a.slug] ?? Number.MAX_SAFE_INTEGER
      const bOrder = COURSE_COMPLEXITY_ORDER[b.slug] ?? Number.MAX_SAFE_INTEGER

      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }

      return a.title.localeCompare(b.title, "es", { sensitivity: "base" })
    })
}

async function getAllCourses() {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from("courses")
    .select("id, name, description, price, slug")

  if (error || !data || data.length === 0) {
    return []
  }

  return (data as CourseCatalogRow[])
    .filter((course) => Boolean(course.slug) && !isInternalProgressOnlyCourseSlug(course.slug ?? ""))
    .map((course) => ({
      courseId: course.id,
      title: course.name ?? "Curso sin titulo",
      description: course.description ?? "Sin descripcion",
      price: Number(course.price ?? 0),
      slug: course.slug ?? "",
    }))
}

async function getUserCourseProgress(userId: string) {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from("course_progress")
    .select("course_id, completed_modules, courses(slug)")
    .eq("user_id", userId)

  if (error || !data || data.length === 0) {
    return []
  }

  return data as CourseProgressRow[]
}

function countCompletedModules(value: unknown, maxModules?: number) {
  if (!Array.isArray(value)) {
    return 0
  }

  const validModules = value
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item >= 1)

  const completedCount = new Set(validModules).size

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

function buildDashboardCourses(allCourses: Awaited<ReturnType<typeof getAllCourses>>, purchasedCourses: PurchasedCourse[]): DashboardCourse[] {
  const purchasedBySlug = new Map(purchasedCourses.map((course) => [course.slug, course]))

  return allCourses
    .filter((course) => course.slug !== "membresia" && !isInternalProgressOnlyCourseSlug(course.slug))
    .map((course) => {
      const purchased = purchasedBySlug.get(course.slug)

      if (purchased) {
        return {
          ...course,
          status: "active" as const,
          grantedAt: purchased.grantedAt,
          expiresAt: purchased.expiresAt,
          isUnlocked: true,
        }
      }

      return {
        ...course,
        status: "locked" as const,
        grantedAt: "-",
        expiresAt: "-",
        isUnlocked: false,
      }
    })
    .sort((a, b) => {
      const aOrder = COURSE_COMPLEXITY_ORDER[a.slug] ?? Number.MAX_SAFE_INTEGER
      const bOrder = COURSE_COMPLEXITY_ORDER[b.slug] ?? Number.MAX_SAFE_INTEGER

      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }

      return a.title.localeCompare(b.title, "es", { sensitivity: "base" })
    })
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    redirect("/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Discord callback feedback (vía query params)
  const resolvedSearchParams = (await searchParams) ?? {}
  const discordParam = resolvedSearchParams.discord
  const discordSlug = resolvedSearchParams.slug
  const discordMsg = resolvedSearchParams.discord_msg
  const discordFeedback =
    typeof discordParam === "string"
      ? {
          kind: discordParam,
          slug: typeof discordSlug === "string" ? discordSlug : undefined,
          message: typeof discordMsg === "string" ? discordMsg : undefined,
        }
      : undefined

  const purchasedCourses = await getPurchasedCourses(user.id)
  const allCourses = await getAllCourses()
  const courses = buildDashboardCourses(allCourses, purchasedCourses)
  const progressRows = await getUserCourseProgress(user.id)

  const unlockedSlugs = new Set(purchasedCourses.map((course) => course.slug))
  const completedModulesBySlug = new Map(
    progressRows
      .map((row) => {
        const slug = getSlugFromCourseRelation(row.courses)

        if (!slug) {
          return null
        }

        const totalModules = getTotalModulesBySlug(slug)
        if (totalModules === 0) {
          return [slug, 0] as const
        }

        return [slug, countCompletedModules(row.completed_modules, totalModules)] as const
      })
      .filter((entry): entry is readonly [string, number] => entry !== null)
  )

  const hasCompletedCourse = (slug: string) => {
    const totalModules = getTotalModulesBySlug(slug)
    if (totalModules === 0) {
      return false
    }

    if (!unlockedSlugs.has(slug)) {
      return false
    }

    return (completedModulesBySlug.get(slug) ?? 0) >= totalModules
  }

  const hasCompletedInvestmentPath =
    hasCompletedCourse("kickstart-investment") && hasCompletedCourse("expert-investment")
  const hasCompletedTradingPath =
    hasCompletedCourse("kickstart-trading") && hasCompletedCourse("trading-lab")
  const canUnlockInnerCircle = hasCompletedInvestmentPath || hasCompletedTradingPath
  const investmentPathSlugs = [KICKSTART_INVESTMENT_SLUG, EXPERT_INVESTMENT_SLUG]
  const tradingPathSlugs = [KICKSTART_TRADING_SLUG, TRADING_LAB_SLUG]
  const investmentCompletedCount = investmentPathSlugs.filter((slug) => hasCompletedCourse(slug)).length
  const tradingCompletedCount = tradingPathSlugs.filter((slug) => hasCompletedCourse(slug)).length
  const hasAnyInnerCirclePrereqStarted =
    unlockedSlugs.has("kickstart-investment") ||
    unlockedSlugs.has("expert-investment") ||
    unlockedSlugs.has("kickstart-trading") ||
    unlockedSlugs.has("trading-lab")

  const totalCompletedModules = Array.from(completedModulesBySlug.entries())
    .filter(([slug]) => unlockedSlugs.has(slug))
    .reduce((acc, [, count]) => acc + count, 0)

  const activeCoursesCount = purchasedCourses.length

  // Cursos activos con progreso (excluye inner-circle y membresia)
  const activeCoursesWithProgress = purchasedCourses
    .filter((c) => c.slug !== "inner-circle" && c.slug !== "membresia")
    .map((c) => {
      const totalModules = getTotalModulesBySlug(c.slug)
      const completedModules = completedModulesBySlug.get(c.slug) ?? 0
      const pct = totalModules > 0 ? Math.min(100, Math.round((completedModules / totalModules) * 100)) : 0
      return { ...c, totalModules, completedModules, pct }
    })

  // Featured course: el de mayor prioridad para mostrar arriba
  // 1) El más cercano a terminar (1-99%, mayor pct)
  // 2) Si no hay en progreso, el primero sin empezar (0%)
  // 3) Si todos completos, el primero (para revisitar)
  type FeaturedVariant = "continue" | "start" | "complete" | "empty"
  const featuredCourse: (typeof activeCoursesWithProgress)[number] | null = (() => {
    if (activeCoursesWithProgress.length === 0) return null
    const inProgress = activeCoursesWithProgress
      .filter((c) => c.completedModules > 0 && c.completedModules < c.totalModules)
      .sort((a, b) => b.pct - a.pct)
    if (inProgress.length > 0) return inProgress[0]
    const notStarted = activeCoursesWithProgress.filter((c) => c.completedModules === 0)
    if (notStarted.length > 0) return notStarted[0]
    return activeCoursesWithProgress[0]
  })()

  const featuredVariant: FeaturedVariant = !featuredCourse
    ? "empty"
    : featuredCourse.completedModules === 0
      ? "start"
      : featuredCourse.completedModules >= featuredCourse.totalModules
        ? "complete"
        : "continue"

  const otherActiveCoursesCount = featuredCourse
    ? Math.max(0, activeCoursesWithProgress.length - 1)
    : 0

  function getCourseCtaLabel(completed: number, total: number): string {
    if (total <= 0) return "Abrir curso"
    if (completed === 0) return "Empezar curso"
    if (completed >= total) return "Revisitar curso"
    return "Continuar curso"
  }

  function getCourseStateChip(completed: number, total: number): { label: string; tone: "neutral" | "active" | "done" } {
    if (total <= 0) return { label: "Activo", tone: "active" }
    if (completed === 0) return { label: "Por empezar", tone: "neutral" }
    if (completed >= total) return { label: "Completado", tone: "done" }
    return { label: "En curso", tone: "active" }
  }

  function getCourseShortDescription(slug: string): string | null {
    switch (slug) {
      case "kickstart-investment":
        return "Curso base de inversión."
      case "expert-investment":
        return "Curso avanzado de inversión."
      case "kickstart-trading":
        return "Curso base de trading."
      case "trading-lab":
        return "Curso avanzado de trading."
      default:
        return null
    }
  }

  function getCourseValueBullets(slug: string): string[] {
    switch (slug) {
      case "kickstart-investment":
        return [
          "Desde cero hasta inversor consciente",
          "Acciones, CEDEARs, FCIs y staking",
          "Clases en vivo + comunidad",
        ]
      case "expert-investment":
        return [
          "Análisis fundamental avanzado",
          "Dividendos, REITs y armado de portafolio",
          "Clases en vivo + comunidad",
        ]
      case "kickstart-trading":
        return [
          "Fundamentos sólidos del trading",
          "Análisis técnico aplicado + gestión",
          "Clases en vivo + comunidad",
        ]
      case "trading-lab":
        return [
          "Smart Money y Fair Value Gaps",
          "Plan de trading + prop firms",
          "Clases en vivo + comunidad",
        ]
      default:
        return []
    }
  }

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : user.email

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
        <OrbitalIcon size={620} animate priority />
      </div>

      <section id="dashboard-top" className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        {/* Saludo sutil — sin hero gigante */}
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#7DD4C0]">Panel privado</p>
            <span className="h-px w-8 bg-[#1F1F1F]" />
            <p className="text-sm text-[#CCCCCC]">Hola, {fullName}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-x-5 gap-y-1 text-[10px] uppercase tracking-[0.22em] text-[#666]">
              <span>
                <span className="font-semibold text-white tabular-nums">{activeCoursesCount}</span> cursos
              </span>
              <span className="text-[#2A2A2A]">·</span>
              <span>
                <span className="font-semibold text-white tabular-nums">{totalCompletedModules}</span> módulos completados
              </span>
              <span className="text-[#2A2A2A]">·</span>
              <span>
                Inner Circle{" "}
                <span className="font-semibold text-white">
                  {canUnlockInnerCircle
                    ? unlockedSlugs.has("inner-circle")
                      ? "activo"
                      : "habilitado"
                    : "en camino"}
                </span>
              </span>
            </div>
            <PanelGuideButton />
          </div>
        </div>

        {/* PhilosophyHero — apertura cinematográfica */}
        <PhilosophyHero />

        {/* Card de acción primaria: continuar / empezar / completado / vacío */}
        {(() => {
          if (featuredVariant === "empty") {
            return (
              <div className="mb-8 overflow-hidden rounded-2xl border border-[#7DD4C0]/35 bg-gradient-to-br from-[#0A1614] via-[#0A0A0A] to-[#0A0A0A] p-6 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#7DD4C0]">Empezá tu camino</p>
                    <h2 className="mt-2 text-2xl tracking-tight text-white sm:text-3xl">
                      Aún no tenés cursos en tu cuenta
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-[#A8A8A8]">
                      Explorá los programas disponibles abajo. Cuando compres uno aparecerá acá con tu progreso.
                    </p>
                  </div>
                  <Link
                    href="#dashboard-cursos"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#7DD4C0] px-7 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#0A1A18] transition-all hover:bg-[#9FE0CF] hover:shadow-lg"
                  >
                    Ver programas
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            )
          }

          if (!featuredCourse) return null

          // Con 2+ cursos activos: tira compacta de acceso rápido (no repite las cards detalladas de "Cursando")
          if (activeCoursesWithProgress.length >= 2) {
            // Orden: en progreso primero (mayor avance), luego sin empezar, luego completados
            const rankActive = (c: (typeof activeCoursesWithProgress)[number]) => {
              if (c.completedModules > 0 && c.completedModules < c.totalModules) return 0
              if (c.completedModules === 0) return 1
              return 2
            }
            const sortedActives = [...activeCoursesWithProgress].sort(
              (a, b) => rankActive(a) - rankActive(b) || b.pct - a.pct
            )
            const anyInProgress = sortedActives.some((c) => c.completedModules > 0 && c.completedModules < c.totalModules)
            const stripTitle = anyInProgress ? "Continuá donde dejaste" : "Acceso rápido"
            const lgCols =
              sortedActives.length >= 4
                ? "lg:grid-cols-4"
                : sortedActives.length === 3
                  ? "lg:grid-cols-3"
                  : "lg:grid-cols-2"
            return (
              <div className="mb-6">
                <div className="mb-4 flex items-baseline gap-3">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#7DD4C0]">{stripTitle}</p>
                  <span className="h-px flex-1 bg-gradient-to-r from-[#7DD4C0]/30 to-transparent" />
                </div>
                <div className={`grid gap-3 sm:grid-cols-2 ${lgCols}`}>
                  {sortedActives.map((c) => {
                    const ct = getCourseTheme(c.slug)
                    const variant =
                      c.completedModules === 0
                        ? "start"
                        : c.completedModules >= c.totalModules
                          ? "complete"
                          : "continue"
                    const statusLabel =
                      variant === "start" ? "Por empezar" : variant === "complete" ? "Completado" : `${c.pct}%`
                    const actionLabel =
                      variant === "start" ? "Empezar" : variant === "complete" ? "Revisitar" : "Continuar"
                    return (
                      <Link
                        key={c.slug}
                        href={`/courses/${c.slug}`}
                        className={`group relative flex flex-col gap-3 overflow-hidden rounded-xl border ${ct.borderActive} ${ct.bgActive} p-4 transition-all hover:-translate-y-0.5`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-[10px] uppercase tracking-[0.22em] ${ct.text}`}>{ct.label}</p>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] tabular-nums text-[#888]">{statusLabel}</span>
                        </div>
                        <h3 className="text-[17px] leading-tight tracking-tight text-white">{c.title}</h3>
                        {variant === "continue" && (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: c.totalModules }, (_, i) => (
                              <span
                                key={i}
                                className={`h-1 flex-1 rounded-full ${
                                  i < c.completedModules
                                    ? `bg-gradient-to-r ${ct.progressFrom} ${ct.progressTo}`
                                    : "bg-[#1A1A1A]"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                        <div className={`mt-auto inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] ${ct.text}`}>
                          {actionLabel}
                          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          }

          const theme = getCourseTheme(featuredCourse.slug)
          const ctaLabel = getCourseCtaLabel(featuredCourse.completedModules, featuredCourse.totalModules)
          const eyebrow =
            featuredVariant === "start"
              ? "Listo para empezar"
              : featuredVariant === "complete"
                ? "Curso completado"
                : "Continuá donde dejaste"
          const nextModuleNumber =
            featuredVariant === "continue"
              ? Math.min(featuredCourse.completedModules + 1, featuredCourse.totalModules)
              : featuredVariant === "start"
                ? 1
                : featuredCourse.totalModules
          const subline =
            featuredVariant === "start"
              ? `Empezá por el módulo 1 de ${featuredCourse.totalModules}`
              : featuredVariant === "complete"
                ? `Completaste los ${featuredCourse.totalModules} módulos · repasá lo que quieras`
                : `Vas por el módulo ${nextModuleNumber} de ${featuredCourse.totalModules}`
          const otherActives = activeCoursesWithProgress.filter((c) => c.slug !== featuredCourse.slug)

          return (
            <div className={`group relative mb-6 overflow-hidden rounded-2xl border ${theme.borderActive} ${theme.bgActive} transition-colors`}>
              <div className={`pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full ${theme.glowFrom} blur-3xl opacity-70`} />
              <div className={`pointer-events-none absolute -bottom-24 left-1/4 h-40 w-40 rounded-full ${theme.glowTo} blur-3xl opacity-50`} />

              <Link href={`/courses/${featuredCourse.slug}`} className="block">
                <div className="relative grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10 sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className={`text-[10px] uppercase tracking-[0.26em] ${theme.text}`}>{eyebrow}</p>
                      {featuredVariant === "continue" && (
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#777]">
                          · <span className={`font-semibold tabular-nums ${theme.text}`}>{featuredCourse.pct}%</span>
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1.5 text-2xl tracking-tight text-white sm:text-[28px]">{featuredCourse.title}</h2>
                    <p className="mt-1 text-[13px] text-[#A0A0A0]">{subline}</p>

                    {featuredVariant === "continue" && (
                      <div className="mt-3 h-[5px] w-full max-w-md overflow-hidden rounded-full bg-[#1A1A1A]">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${theme.progressFrom} ${theme.progressTo}`}
                          style={{ width: `${featuredCourse.pct}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex sm:justify-end">
                    <span className={`inline-flex h-11 items-center justify-center gap-2.5 rounded-lg px-6 text-[11px] uppercase tracking-[0.2em] font-semibold transition-all ${theme.ctaSolid} group-hover:shadow-lg`}>
                      {ctaLabel}
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                  </div>
                </div>
              </Link>

              {otherActives.length > 0 && (
                <div className="relative border-t border-[#1F1F1F]/80 bg-[#080808]/60 px-5 py-2.5 sm:px-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#666]">O seguí con</span>
                    {otherActives.map((c) => {
                      const ct = getCourseTheme(c.slug)
                      const otherCta = getCourseCtaLabel(c.completedModules, c.totalModules).toLowerCase()
                      return (
                        <Link
                          key={c.slug}
                          href={`/courses/${c.slug}`}
                          className={`inline-flex items-center gap-1.5 rounded-md border border-[#1F1F1F] bg-[#0F0F0F] px-2.5 py-1 text-[11px] text-[#C8C8C8] transition-colors hover:border-[#2F2F2F] hover:text-white`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full`} style={{ background: ct.accent }} />
                          {c.title}
                          <span className="text-[#666]">· {otherCta}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        <div id="dashboard-cursos" className="glass-card scroll-mt-24 relative overflow-hidden rounded-2xl p-5 sm:p-8">
          <div className="pointer-events-none absolute -top-16 -right-16 opacity-[0.035]">
            <OrbitalIcon size={320} animate={false} />
          </div>
          <div className="relative mb-7 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#7DD4C0]">Tu recorrido</p>
              <h2 className="mt-2 text-2xl tracking-tight text-white sm:text-3xl">
                TUS CURSOS
              </h2>
              <p className="mt-2 text-sm text-[#8E8E8E]">Tu progreso, lo que sigue y lo que podés sumar.</p>
            </div>
            <div className="w-full sm:w-auto">
              <Link
                href="/"
                className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white sm:w-auto"
              >
                Ir al inicio
              </Link>
            </div>
          </div>

          {(() => {
            const activeCoursesList = courses.filter((c) => c.isUnlocked && c.slug !== "inner-circle")
            const availableCoursesList = courses.filter((c) => !c.isUnlocked && c.slug !== "inner-circle")
            const innerCircleEntry = courses.find((c) => c.slug === "inner-circle")

            return (
              <>
                {activeCoursesList.length > 0 && (
                  <section className="mb-10">
                    <div className="mb-4 flex items-baseline gap-3">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#7DD4C0]">Cursando</p>
                      <span className="h-px flex-1 bg-gradient-to-r from-[#7DD4C0]/30 to-transparent" />
                    </div>
                    <div className={`grid gap-5 ${activeCoursesList.length > 1 ? "lg:grid-cols-2" : "mx-auto max-w-5xl"}`}>
                      {activeCoursesList.map((course) => {
                        const theme = getCourseTheme(course.slug)
                        const totalModules = getTotalModulesBySlug(course.slug)
                        const completedModules = completedModulesBySlug.get(course.slug) ?? 0
                        const hasTrackableProgress = totalModules > 0
                        const progressPercent = hasTrackableProgress
                          ? Math.min(100, Math.round((completedModules / totalModules) * 100))
                          : 0
                        const program = getCourseProgram(course.slug)
                        const canSchedule =
                          course.slug === KICKSTART_INVESTMENT_SLUG ||
                          course.slug === EXPERT_INVESTMENT_SLUG ||
                          course.slug === KICKSTART_TRADING_SLUG ||
                          course.slug === TRADING_LAB_SLUG
                        const ctaLabel = getCourseCtaLabel(completedModules, totalModules)
                        const chip = getCourseStateChip(completedModules, totalModules)
                        const chipClass =
                          chip.tone === "done"
                            ? "border-[#2A2A2A] bg-[#0F0F0F] text-[#7A7A7A]"
                            : chip.tone === "neutral"
                              ? "border-[#2A2A2A] bg-[#0F0F0F] text-[#999]"
                              : theme.badge
                        // Sidebar "Qué sigue" solo si hay UNA card (no en grid de varias)
                        const useSidebar = activeCoursesList.length === 1
                        const nextModuleNumber =
                          completedModules === 0
                            ? 1
                            : completedModules >= totalModules
                              ? totalModules
                              : completedModules + 1
                        const nextModuleTitle =
                          program && program[nextModuleNumber - 1] ? program[nextModuleNumber - 1] : `Módulo ${nextModuleNumber}`

                        return (
                          <article
                            key={`${course.courseId}-${course.slug}`}
                            className={`relative overflow-hidden rounded-2xl border ${theme.borderActive} ${theme.bgActive} p-5 sm:p-6 transition-colors`}
                          >
                            <div className={`pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full ${theme.glowFrom} blur-3xl opacity-60`} />
                            <div className={`pointer-events-none absolute -bottom-28 -left-16 h-48 w-48 rounded-full ${theme.glowTo} blur-3xl opacity-35`} />

                            <div className={`relative ${useSidebar ? "grid gap-6 lg:grid-cols-[1.65fr_1fr]" : ""}`}>
                              {/* Columna principal */}
                              <div className="flex h-full flex-col">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3">
                                    <OrbitalIcon size={36} animate={false} className="shrink-0 opacity-95" />
                                    <div>
                                      <p className={`text-[10px] uppercase tracking-[0.24em] ${theme.text}`}>{theme.label}</p>
                                      <h3 className="mt-0.5 text-xl tracking-tight text-white sm:text-2xl">
                                        {course.title}
                                      </h3>
                                    </div>
                                  </div>
                                  <span className={`inline-flex h-7 items-center rounded-full border px-3 text-[10px] uppercase tracking-[0.18em] ${chipClass}`}>
                                    {chip.label}
                                  </span>
                                </div>

                                <p className="mt-3 text-sm leading-relaxed text-[#A8A8A8]">{course.description}</p>
                                <p className="mt-1 text-xs text-[#777]">Docente: {getCourseInstructor(course.slug)}</p>

                                {hasTrackableProgress && (
                                  <div className="mt-4 rounded-xl border border-[#1F1F1F] bg-[#0A0A0A]/60 p-4">
                                    <div className="mb-2 flex items-baseline justify-between">
                                      <span className={`text-[10px] uppercase tracking-[0.22em] ${theme.text}`}>Progreso</span>
                                      <span className="text-sm font-semibold tabular-nums text-white">{progressPercent}%</span>
                                    </div>
                                    {/* Indicador de módulos como puntos */}
                                    <div className="mt-1 flex items-center gap-1.5">
                                      {Array.from({ length: totalModules }, (_, i) => {
                                        const isDone = i < completedModules
                                        return (
                                          <span
                                            key={i}
                                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                                              isDone
                                                ? `bg-gradient-to-r ${theme.progressFrom} ${theme.progressTo}`
                                                : "bg-[#1A1A1A]"
                                            }`}
                                          />
                                        )
                                      })}
                                    </div>
                                    <p className="mt-2.5 text-[11px] text-[#7A7A7A]">
                                      {completedModules}/{totalModules} módulos · vence {course.expiresAt}
                                    </p>
                                  </div>
                                )}

                                {program && program.length > 0 && (
                                  <details className="group mt-3 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A]/50 open:bg-[#0A0A0A]/70">
                                    <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-2.5 text-[10px] uppercase tracking-[0.22em] text-[#777] transition-colors hover:text-white">
                                      <span>Ver programa completo</span>
                                      <span aria-hidden className="text-[#555] transition-transform group-open:rotate-180">▾</span>
                                    </summary>
                                    <div className="flex flex-col gap-1.5 px-3.5 pb-3.5">
                                      {program.map((moduleTitle, idx) => {
                                        const isDone = idx < completedModules
                                        return (
                                          <span
                                            key={moduleTitle}
                                            className={`inline-flex w-fit items-center gap-2 rounded-md border px-2.5 py-1 text-[11px] ${
                                              isDone
                                                ? `${theme.borderActive} ${theme.text}`
                                                : "border-[#222] bg-[#131313] text-[#9A9A9A]"
                                            }`}
                                          >
                                            {isDone && (
                                              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24" aria-hidden>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                              </svg>
                                            )}
                                            {moduleTitle}
                                          </span>
                                        )
                                      })}
                                    </div>
                                  </details>
                                )}

                                <div className="mt-auto pt-5">
                                  <Link
                                    href={`/courses/${course.slug}`}
                                    className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg px-5 text-[11px] uppercase tracking-[0.2em] font-semibold transition-all ${theme.ctaSolid} hover:shadow-lg`}
                                  >
                                    {ctaLabel}
                                    <span aria-hidden>→</span>
                                  </Link>
                                </div>
                              </div>

                              {/* Sidebar "Qué sigue" — solo si hay 1 sola card */}
                              {useSidebar && (
                                <aside className="rounded-xl border border-[#1A1A1A] bg-[#0A0A0A]/70 p-4 flex flex-col">
                                  <p className={`text-[10px] uppercase tracking-[0.24em] ${theme.text}`}>Qué sigue</p>

                                  <div className="mt-3 rounded-lg border border-[#1F1F1F] bg-[#0C0C0C] p-3">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#666]">
                                      {completedModules >= totalModules ? "Último módulo visto" : "Próximo módulo"}
                                    </p>
                                    <p className="mt-1 text-sm leading-snug text-white">{nextModuleTitle}</p>
                                  </div>

                                  {canSchedule && (
                                    <div className="mt-3 rounded-lg border border-[#1F1F1F] bg-[#0C0C0C] p-3">
                                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#666]">Tu próxima clase</p>
                                      <div className="mt-2">
                                        <ScheduleClassButton courseSlug={course.slug} />
                                      </div>
                                    </div>
                                  )}

                                  <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div className="rounded-lg border border-[#1F1F1F] bg-[#0C0C0C] px-3 py-2.5">
                                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#666]">Módulos</p>
                                      <p className="mt-1 text-sm font-semibold tabular-nums text-white">
                                        {completedModules}<span className="text-[#3A3A3A]">/{totalModules}</span>
                                      </p>
                                    </div>
                                    <div className="rounded-lg border border-[#1F1F1F] bg-[#0C0C0C] px-3 py-2.5">
                                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#666]">Vence</p>
                                      <p className="mt-1 text-sm font-semibold text-white">{course.expiresAt}</p>
                                    </div>
                                  </div>
                                </aside>
                              )}

                              {/* En grid (2+ cards), el ScheduleClassButton va dentro de la columna principal */}
                              {!useSidebar && canSchedule && (
                                <div className="mt-3">
                                  <ScheduleClassButton courseSlug={course.slug} />
                                </div>
                              )}
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  </section>
                )}

                {availableCoursesList.length > 0 && (
                  <section className="mb-10">
                    <div className="mb-4 flex items-baseline gap-3">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#8E8E8E]">Programas disponibles</p>
                      <span className="h-px flex-1 bg-gradient-to-r from-[#2E2E2E] to-transparent" />
                    </div>
                    <div className={`grid gap-4 sm:grid-cols-2 ${availableCoursesList.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
                      {availableCoursesList.map((course) => {
                        const theme = getCourseTheme(course.slug)
                        const bullets = getCourseValueBullets(course.slug)
                        return (
                          <article
                            key={`${course.courseId}-${course.slug}`}
                            className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${theme.borderLocked} bg-gradient-to-br from-[#0C0C0C] via-[#0A0A0A] to-[#080808] p-5 transition-all hover:-translate-y-0.5 hover:bg-[#0F0F0F] sm:p-6`}
                          >
                            <div className={`pointer-events-none absolute -top-16 -right-12 h-36 w-36 rounded-full ${theme.glowFrom} blur-3xl opacity-0 transition-opacity group-hover:opacity-30`} />

                            <div className="relative flex items-start gap-3 min-w-0">
                              <OrbitalIcon size={32} animate={false} className="shrink-0 opacity-80" />
                              <div className="min-w-0">
                                <p className={`text-[10px] uppercase tracking-[0.24em] ${theme.text}`}>{theme.label}</p>
                                <h3 className="mt-0.5 text-lg tracking-tight text-white sm:text-xl">
                                  {course.title}
                                </h3>
                              </div>
                            </div>

                            <p className="relative mt-3 line-clamp-1 text-sm leading-snug text-[#9A9A9A]">{getCourseShortDescription(course.slug) ?? course.description}</p>

                            {bullets.length > 0 && (
                              <ul className="relative mt-4 space-y-2">
                                {bullets.map((bullet) => (
                                  <li key={bullet} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-[#C8C8C8]">
                                    <span className={`mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full ${theme.text.replace("text-", "bg-")}`} />
                                    {bullet}
                                  </li>
                                ))}
                              </ul>
                            )}

                            <div className="relative mt-auto pt-5">
                              <Link
                                href={`/cursos/${course.slug}`}
                                className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-[11px] uppercase tracking-[0.2em] font-semibold transition-all ${theme.ctaSoft}`}
                              >
                                Ver curso completo
                                <span aria-hidden>→</span>
                              </Link>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  </section>
                )}

                {innerCircleEntry && (() => {
                  const icTheme = getCourseTheme("inner-circle")
                  const isUnlocked = innerCircleEntry.isUnlocked
                  const ctaPrimary = isUnlocked ? (
                    <Link
                      href="/courses/inner-circle"
                      className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-6 text-[11px] uppercase tracking-[0.2em] font-semibold transition-all bg-gradient-to-b from-[#E2CB82] via-[#D4B86A] to-[#B8964A] text-[#1A1408] hover:from-[#E8D391] hover:to-[#C2A052] hover:shadow-lg`}
                    >
                      Entrar al Inner Circle
                      <span aria-hidden>→</span>
                    </Link>
                  ) : (
                    <Link
                      href="/checkout/inner-circle"
                      className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-6 text-[11px] uppercase tracking-[0.2em] font-semibold transition-all bg-gradient-to-b from-[#E2CB82] via-[#D4B86A] to-[#B8964A] text-[#1A1408] hover:from-[#E8D391] hover:to-[#C2A052] hover:shadow-lg`}
                    >
                      {canUnlockInnerCircle ? "Desbloquear acceso" : "Sumarme al Inner Circle"}
                      <span aria-hidden>→</span>
                    </Link>
                  )
                  const incluyePills = [
                    "Auditoría de tu operativa en vivo",
                    "Psicotrading + gestión de riesgo",
                    "Estrategia ORB Flowdex",
                    "Indicadores propios",
                    "12 sesiones grupales al mes (3 por semana)",
                    "1er mes de membresía incluido",
                  ]
                  const innerCirclePillars = [
                    { accent: "#D4B86A", label: "Psicotrading", modules: "10 módulos", detail: "Mindset, emociones y alto rendimiento" },
                    { accent: "#5BB8D4", label: "Inversiones avanzado", modules: "5 módulos", detail: "Sistema FPM, valuación y macro" },
                    { accent: "#7DD4C0", label: "Trading avanzado", modules: "5 módulos", detail: "ORB, intradía NY y gestión de riesgo" },
                  ]

                  return (
                    <section>
                      <div className="mb-4 flex items-baseline gap-3">
                        <p className={`text-[11px] uppercase tracking-[0.24em] ${icTheme.text}`}>Inner Circle</p>
                        <span className="h-px flex-1 bg-gradient-to-r from-[#D4B86A]/30 to-transparent" />
                      </div>
                      <article className={`relative overflow-hidden rounded-2xl border ${isUnlocked ? "border-[#D4B86A]/30" : "border-[#D4B86A]/20"} bg-[#070707] p-6 sm:p-8`}>
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4B86A]/45 to-transparent" />
                        <div className="pointer-events-none absolute -top-24 -right-20 opacity-[0.05]">
                          <OrbitalIcon size={360} animate={false} />
                        </div>

                        {/* Header */}
                        <div className="relative flex items-start gap-3">
                          <OrbitalIcon size={38} animate={false} className="shrink-0 opacity-95" />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                              <p className={`text-[10px] uppercase tracking-[0.26em] ${icTheme.text}`}>
                                {isUnlocked ? "Acceso activo" : "Programa premium"}
                              </p>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E50]">3 cursos · 20 módulos en vivo</p>
                            </div>
                            <h3 className="mt-1 text-2xl tracking-tight text-white sm:text-[28px]">Inner Circle</h3>
                          </div>
                        </div>
                        <p className="relative mt-4 max-w-2xl text-[14px] leading-relaxed text-[#C2C2C2]">
                          {isUnlocked
                            ? "Acceso premium activo. Tres cursos avanzados, sesiones privadas y seguimiento cercano con Franco Escudero y Augusto Holman."
                            : "Acompañamiento estratégico en vivo con Franco Escudero y Augusto Holman. Tres cursos avanzados: psicotrading, inversiones y trading."}
                        </p>

                        {/* Los 3 cursos — fila pareja */}
                        <p className="relative mt-6 text-[10px] uppercase tracking-[0.24em] text-[#D4B86A]/90">Lo que incluye por dentro</p>
                        <div className="relative mt-2.5 grid gap-2 sm:grid-cols-3">
                          {innerCirclePillars.map((pillar) => (
                            <div
                              key={pillar.label}
                              className="rounded-lg border border-[#1F1F1F] bg-[#0A0A0A]/60 p-3.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="flex min-w-0 items-center gap-2">
                                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: pillar.accent }} />
                                  <p className="truncate text-[13px] font-medium tracking-tight text-white">{pillar.label}</p>
                                </span>
                                <p className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-[#777]">{pillar.modules}</p>
                              </div>
                              <p className="mt-1.5 text-[11.5px] leading-snug text-[#8E8E8E]">{pillar.detail}</p>
                            </div>
                          ))}
                        </div>
                        <p className="relative mt-2 text-[11px] leading-relaxed text-[#7A6E50]">
                          Los tres juntos cubren psicología, inversión y trading: el recorrido completo adentro del Inner Circle.
                        </p>

                        {/* Qué incluye + requisitos/ritmo — del mismo alto */}
                        <div className="relative mt-3 grid gap-3 lg:grid-cols-2 lg:items-stretch">
                          <div className="flex flex-col rounded-xl border border-[#D4B86A]/15 bg-[#0A0A0A]/60 p-4">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-[#D4B86A]/90">Qué incluye</p>
                            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                              {incluyePills.map((pill) => (
                                <li
                                  key={pill}
                                  className="flex items-center gap-2 text-[12px] leading-snug text-[#C8BFA6]"
                                >
                                  <svg
                                    className="h-3 w-3 shrink-0 text-[#D4B86A]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2.2}
                                    viewBox="0 0 24 24"
                                    aria-hidden
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                  {pill}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {!isUnlocked ? (
                            <div className="flex flex-col rounded-xl border border-[#D4B86A]/15 bg-[#0A0A0A]/70 p-4">
                              <div className="flex items-baseline justify-between gap-3">
                                <p className="text-[10px] uppercase tracking-[0.24em] text-[#D4B86A]/85">Sugerencia · ideal completar un camino</p>
                                <p className="text-[10px] uppercase tracking-[0.18em] text-[#9A8854]">
                                  {canUnlockInnerCircle
                                    ? "Ya podés desbloquearlo"
                                    : hasAnyInnerCirclePrereqStarted
                                      ? "En progreso"
                                      : "Sin iniciar"}
                                </p>
                              </div>
                              <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
                                <div className="rounded-lg border border-[#5BB8D4]/20 bg-[#0A0F12]/80 px-3 py-2.5">
                                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#5BB8D4]/85">Camino Inversiones</p>
                                  <div className="mt-0.5 flex items-baseline justify-between">
                                    <span className="text-base font-semibold tabular-nums text-white">
                                      {investmentCompletedCount}<span className="text-[#3A3A3A]">/2</span>
                                    </span>
                                    <span className="text-[10px] text-[#5A6A70]">cursos</span>
                                  </div>
                                </div>
                                <div className="rounded-lg border border-[#7DD4C0]/20 bg-[#0A1412]/80 px-3 py-2.5">
                                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#7DD4C0]/85">Camino Trading</p>
                                  <div className="mt-0.5 flex items-baseline justify-between">
                                    <span className="text-base font-semibold tabular-nums text-white">
                                      {tradingCompletedCount}<span className="text-[#3A3A3A]">/2</span>
                                    </span>
                                    <span className="text-[10px] text-[#5A6A70]">cursos</span>
                                  </div>
                                </div>
                              </div>
                              <p className="mt-2 text-[10px] leading-relaxed text-[#7A6E50]">
                                Te recomendamos cerrar un camino completo (2 cursos) antes de entrar, pero podés sumarte cuando quieras. Si te queda grande, te ayudamos a empezar por el curso que corresponde.
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col rounded-xl border border-[#D4B86A]/15 bg-[#0A0A0A]/70 p-4">
                              <p className="text-[10px] uppercase tracking-[0.24em] text-[#D4B86A]/85">Tu ritmo</p>
                              <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
                                <div className="rounded-lg border border-[#D4B86A]/15 bg-[#0A0A0A]/60 px-3 py-2.5">
                                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#9A8854]">Sesiones en vivo</p>
                                  <p className="mt-0.5 text-base font-semibold tabular-nums text-white">12<span className="text-[10px] font-normal text-[#777]"> /mes</span></p>
                                </div>
                                <div className="rounded-lg border border-[#D4B86A]/15 bg-[#0A0A0A]/60 px-3 py-2.5">
                                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#9A8854]">Respuesta</p>
                                  <p className="mt-0.5 text-base font-semibold tabular-nums text-white">48<span className="text-[10px] font-normal text-[#777]"> hs</span></p>
                                </div>
                              </div>
                              <p className="mt-2 text-[10px] leading-relaxed text-[#7A6E50]">
                                Seguimiento personal + grupales con Franco y Augusto.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* CTA — centrado y contenido */}
                        <div className="relative mx-auto mt-4 flex w-full max-w-md flex-col gap-2">
                          {ctaPrimary}
                          {isUnlocked && <InnerCircleScheduleButtons />}
                        </div>
                      </article>
                    </section>
                  )
                })()}
              </>
            )
          })()}

          {courses.length === 0 && (
            <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/60 p-6 text-center">
              <p className="text-sm text-[#CCCCCC]">Aún no tenés cursos registrados en tu cuenta.</p>
              <p className="mt-2 text-sm text-[#888888]">
                Cuando compres un curso, aparecerá automáticamente en este panel.
              </p>
            </div>
          )}
        </div>

        <CourseBadges courseSlugs={purchasedCourses.map((c) => c.slug)} />

        <div id="dashboard-comunidad" className="mt-8 scroll-mt-24">
          <CommunitiesSection userId={user.id} feedback={discordFeedback} />
        </div>
      </section>
    </main>
  )
}
