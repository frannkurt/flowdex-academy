import { notFound, redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/payments/mercadopago-pricing"
import { isCourseWithExam } from "@/lib/exams/types"
import {
  getActiveCooldown,
  getLastAttemptResult,
  getModuleQuestionsRaw,
  hasExamAccess,
  hasPassedModule,
  selectExamQuestions,
} from "@/lib/exams/server"
import { getTotalModulesBySlug } from "@/lib/courses/module-counts"
import { innerCircleTradingContent } from "@/lib/courses/inner-circle-trading-content"
import { innerCircleInvestmentContent } from "@/lib/courses/inner-circle-investment-content"
import { ExamRunner } from "./ExamRunner"
import { CooldownScreen } from "./CooldownScreen"

export const dynamic = "force-dynamic"

type ExamPageProps = {
  params: Promise<{ slug: string; module: string }>
}

const COURSE_LABELS: Record<string, string> = {
  "kickstart-trading": "Kickstart Trading",
  "trading-lab": "Trading Lab",
  "kickstart-investment": "Kickstart Investment",
  "expert-investment": "Expert Investment",
  "inner-circle-trading": "Inner Circle · Trading",
  "inner-circle-inversiones": "Inner Circle · Inversiones",
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { slug, module: moduleParam } = await params

  // Validamos slug contra lista cerrada (no aceptamos cualquier string).
  if (!isCourseWithExam(slug)) {
    notFound()
  }

  // El parámetro de URL llega como string; parseamos a int.
  const moduleNumber = Number.parseInt(moduleParam, 10)
  if (!Number.isInteger(moduleNumber) || moduleNumber < 1) {
    notFound()
  }

  // Volver al curso preservando la posición exacta del alumno (?m=N), para que
  // no caiga siempre en el primer módulo. nextHref habilita "Continuar al
  // módulo siguiente" cuando hay uno.
  const courseHref = `/courses/${resolveBackHref(slug)}`
  const backHref = `${courseHref}?m=${moduleNumber}`
  const totalModules = getTotalModulesForExam(slug)
  const nextHref = moduleNumber < totalModules ? `${courseHref}?m=${moduleNumber + 1}` : null

  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    redirect("/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?returnTo=/examen/${slug}/${moduleNumber}`)
  }

  // Acceso al curso (resuelve slug de progreso → slug comercial cuando aplica).
  const hasAccess = await hasExamAccess(supabase, user.id, slug)
  if (!hasAccess) {
    redirect("/dashboard?exam=no-access")
  }

  // Admin client para acceder a user_quiz_attempts (RLS service-role-only).
  // Las preguntas viven en código (lib/exams/questions), no en DB.
  const admin = createSupabaseAdminClient()
  if (!admin) {
    redirect("/dashboard?exam=internal-error")
  }

  // 1) Cooldown activo → pantalla de espera con countdown
  const cooldownUntil = await getActiveCooldown(admin, user.id, slug, moduleNumber)
  if (cooldownUntil) {
    return (
      <CooldownScreen
        cooldownUntil={cooldownUntil}
        courseLabel={COURSE_LABELS[slug] ?? slug}
        moduleNumber={moduleNumber}
        backHref={backHref}
      />
    )
  }

  // 2) Fetchear preguntas (registry en código) y armar pool randomizado
  const rawQuestions = getModuleQuestionsRaw(slug, moduleNumber)
  if (rawQuestions.length === 0) {
    // Módulo sin preguntas cargadas todavía. Por ahora redirect al dashboard
    // con flag para mostrar mensaje. Cuando estén todas las preguntas no
    // debería pasar nunca.
    redirect(`/courses/${resolveBackHref(slug)}?exam=not-ready`)
  }

  const { publicQuestions, correctByQuestionId } = selectExamQuestions(rawQuestions)

  // 3) ¿Ya aprobó alguna vez? Solo info visual.
  const alreadyPassed = await hasPassedModule(admin, user.id, slug, moduleNumber)

  // Último intento (si existe): reconstruimos su resultado para que, al recargar
  // o reentrar, el alumno vea su resultado en vez de volver a la bienvenida.
  // SOLO si aprobó: un reprobado viejo no se resucita (el resultado del fail se
  // ve al momento de enviar, y mientras el cooldown está activo el server
  // muestra CooldownScreen). Resucitarlo para siempre confundía ("entré y me
  // tomó como 0") y dejaba las respuestas correctas a la vista en cada visita.
  const lastResult = await getLastAttemptResult(admin, user.id, slug, moduleNumber)
  const initialResult = lastResult?.passed ? lastResult : null

  // El mapping correctByQuestionId NO se envía al cliente (queda solo acá
  // como referencia; el ExamRunner recibe únicamente publicQuestions). El
  // cliente manda los textos elegidos al API /api/exams/submit, que
  // recalcula contra el registry en código.
  void correctByQuestionId

  return (
    <ExamRunner
      courseSlug={slug}
      moduleNumber={moduleNumber}
      courseLabel={COURSE_LABELS[slug] ?? slug}
      questions={publicQuestions}
      alreadyPassed={alreadyPassed}
      backHref={backHref}
      nextHref={nextHref}
      initialResult={initialResult}
    />
  )
}

// Mapea el slug del examen al URL del curso para el botón "Volver".
// IC trading e IC inversiones tienen sus propias URLs en /courses/.
function resolveBackHref(slug: string): string {
  if (slug === "inner-circle-trading") return "inner-circle-trading"
  if (slug === "inner-circle-inversiones") return "inner-circle-inversiones"
  return slug
}

// Total de módulos reales por curso de examen. Los 4 de escalera salen de
// module-counts; los dos sub-cursos del IC se cuentan desde su content.
function getTotalModulesForExam(slug: string): number {
  if (slug === "inner-circle-trading") {
    return innerCircleTradingContent.filter((mod) => mod.number > 0).length
  }
  if (slug === "inner-circle-inversiones") {
    return innerCircleInvestmentContent.filter((mod) => mod.number > 0).length
  }
  return getTotalModulesBySlug(slug)
}
