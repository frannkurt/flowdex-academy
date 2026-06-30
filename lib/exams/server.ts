// Helpers server-side del sistema de exámenes pedagógicos.
//
// Reglas clave:
// - El cliente NUNCA recibe `correct_option_index` ni `explanation` mientras
//   está rindiendo. Solo aparecen post-submit si reprobó.
// - El pool de preguntas por módulo se randomiza: tomamos 10 al azar de las
//   ~20 disponibles, y dentro de cada pregunta mezclamos el orden de opciones.
// - Como el cliente ve las opciones mezcladas, devuelve la respuesta como el
//   TEXTO de la opción seleccionada (no índice). El servidor reconstruye el
//   match contra `options[correct_option_index]` del row original.

import {
  EXAM_CONFIG,
  type CourseWithExam,
  type ExamQuestionPublic,
  type ExamQuestionRaw,
  type ExamResult,
  getPassingScore,
} from "@/lib/exams/types"
import { resolveProgressCourseConfig } from "@/lib/courses/progress-course-config"
import { getQuestionsFromRegistry } from "@/lib/exams/questions"
import type { SupabaseClient } from "@supabase/supabase-js"

// Fisher-Yates determinístico para una sola pasada. Devuelve un array nuevo.
function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Chequea si el usuario tiene acceso activo al curso para rendir el examen.
 *
 * El slug del examen viaja como progress slug (ej. `inner-circle-trading`),
 * pero el acceso real se resuelve contra el slug comercial (ej. `inner-circle`).
 * Por eso usamos `resolveProgressCourseConfig` para mapear.
 */
export async function hasExamAccess(
  client: SupabaseClient,
  userId: string,
  courseSlug: CourseWithExam | string
): Promise<boolean> {
  if (!userId) return false

  const { accessSlug } = resolveProgressCourseConfig(courseSlug)
  const nowIso = new Date().toISOString()

  const { data: course } = await client
    .from("courses")
    .select("id")
    .eq("slug", accessSlug)
    .maybeSingle()

  if (!course?.id) return false

  const { data: enrollment } = await client
    .from("user_courses")
    .select("user_id, expires_at")
    .eq("user_id", userId)
    .eq("course_id", course.id)
    .eq("is_active", true)
    .maybeSingle()

  if (!enrollment) return false

  if (enrollment.expires_at && new Date(enrollment.expires_at).getTime() < new Date(nowIso).getTime()) {
    return false
  }

  return true
}

/**
 * Devuelve el cooldown_until activo del usuario para ese módulo, o null si
 * no hay cooldown vigente.
 */
export async function getActiveCooldown(
  adminClient: SupabaseClient,
  userId: string,
  courseSlug: string,
  moduleNumber: number
): Promise<string | null> {
  const nowIso = new Date().toISOString()

  const { data } = await adminClient
    .from("user_quiz_attempts")
    .select("cooldown_until")
    .eq("user_id", userId)
    .eq("course_slug", courseSlug)
    .eq("module_number", moduleNumber)
    .not("cooldown_until", "is", null)
    .gt("cooldown_until", nowIso)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  return data?.cooldown_until ?? null
}

/**
 * Devuelve true si el usuario ya aprobó este examen alguna vez. Sirve para
 * mostrar un badge "ya aprobado" pero no bloquea reintentar.
 */
export async function hasPassedModule(
  adminClient: SupabaseClient,
  userId: string,
  courseSlug: string,
  moduleNumber: number
): Promise<boolean> {
  const { data } = await adminClient
    .from("user_quiz_attempts")
    .select("id")
    .eq("user_id", userId)
    .eq("course_slug", courseSlug)
    .eq("module_number", moduleNumber)
    .eq("passed", true)
    .limit(1)
    .maybeSingle()

  return Boolean(data)
}

/**
 * Reconstruye el ExamResult del último intento guardado del usuario para ese
 * módulo, para poder mostrarlo aunque el alumno recargue la pantalla (el
 * intento vive en la base; solo la vista vivía en memoria). Devuelve null si
 * no rindió nunca. NO incluye cooldown (este helper se usa cuando ya no hay
 * cooldown activo); el caso de cooldown vigente lo maneja CooldownScreen.
 */
type AttemptRow = {
  id: string
  score: number | null
  passed: boolean | null
  answers: unknown
  cooldown_until?: string | null
}

// Reconstruye un ExamResult a partir de una fila de user_quiz_attempts,
// recomputando las respuestas falladas desde el registry (solo si reprobó).
function buildAttemptResult(
  row: AttemptRow,
  courseSlug: string,
  moduleNumber: number,
  includeCooldown: boolean
): ExamResult {
  const passed = Boolean(row.passed)
  const score = Number(row.score) || 0
  const answers = Array.isArray(row.answers)
    ? (row.answers as Array<{ question_id: string; selected_option: string }>)
    : []

  const wrongAnswers: ExamResult["wrong_answers"] = []
  if (!passed && answers.length > 0) {
    const pool = getModuleQuestionsRaw(courseSlug, moduleNumber)
    const byId = new Map(pool.map((q) => [q.id, q]))
    for (const a of answers) {
      const q = byId.get(a.question_id)
      if (!q) continue
      const correct = q.options[q.correct_option_index]
      if (a.selected_option !== correct) {
        wrongAnswers.push({
          question_id: q.id,
          question_text: q.question_text,
          your_answer: a.selected_option || "(sin responder)",
          correct_answer: correct,
          explanation: q.explanation,
        })
      }
    }
  }

  return {
    score,
    total: EXAM_CONFIG.QUESTIONS_PER_EXAM,
    passed,
    passing_score: getPassingScore(),
    wrong_answers: wrongAnswers,
    cooldown_until: includeCooldown ? (row.cooldown_until ?? null) : null,
    attempt_id: row.id,
  }
}

export async function getLastAttemptResult(
  adminClient: SupabaseClient,
  userId: string,
  courseSlug: string,
  moduleNumber: number
): Promise<ExamResult | null> {
  const { data: attempt } = await adminClient
    .from("user_quiz_attempts")
    .select("id, score, passed, answers")
    .eq("user_id", userId)
    .eq("course_slug", courseSlug)
    .eq("module_number", moduleNumber)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!attempt) return null
  return buildAttemptResult(attempt as AttemptRow, courseSlug, moduleNumber, false)
}

// Idempotencia: devuelve el resultado del intento que ya tenga ese token, o
// null si no existe. Si el cliente reintenta el envío con el mismo token (por
// un corte de red), el server devuelve este resultado en vez de guardar otro
// intento. Incluye cooldown porque el cliente necesita mostrarlo.
export async function getAttemptResultByToken(
  adminClient: SupabaseClient,
  userId: string,
  courseSlug: string,
  moduleNumber: number,
  token: string
): Promise<ExamResult | null> {
  const { data: attempt } = await adminClient
    .from("user_quiz_attempts")
    .select("id, score, passed, answers, cooldown_until")
    .eq("user_id", userId)
    .eq("attempt_token", token)
    .maybeSingle()

  if (!attempt) return null
  return buildAttemptResult(attempt as AttemptRow, courseSlug, moduleNumber, true)
}

/**
 * Trae las preguntas raw del registry en código (lib/exams/questions/).
 *
 * IMPORTANTE: solo llamar desde server components o route handlers. El
 * registry incluye `correct_option_index` y `explanation`; si se importa
 * desde un componente "use client", esa info viaja al bundle del browser.
 *
 * No es async (lectura sincrónica desde código), pero la dejamos con la
 * misma forma para no romper a los callers existentes y por si alguna vez
 * se mezcla con preguntas dinámicas de DB.
 */
export function getModuleQuestionsRaw(
  courseSlug: string,
  moduleNumber: number
): ExamQuestionRaw[] {
  return getQuestionsFromRegistry(courseSlug, moduleNumber)
}

/**
 * Selecciona N preguntas al azar del pool y mezcla el orden de opciones de
 * cada pregunta. Devuelve dos cosas:
 * - `public`: lo que viaja al frontend (sin la respuesta correcta)
 * - `correctByQuestionId`: el texto de la opción correcta por question_id,
 *   para el cálculo del score en el submit.
 *
 * Si el pool es menor que N, agarra todas las que haya (sin completar con
 * placeholder; el módulo es responsable de tener pool suficiente).
 */
export function selectExamQuestions(
  pool: ExamQuestionRaw[],
  questionsPerExam: number = EXAM_CONFIG.QUESTIONS_PER_EXAM
): {
  publicQuestions: ExamQuestionPublic[]
  correctByQuestionId: Record<string, { correct_text: string; explanation: string | null; question_text: string }>
} {
  const shuffled = shuffle(pool)
  const picked = shuffled.slice(0, Math.min(questionsPerExam, shuffled.length))

  const publicQuestions: ExamQuestionPublic[] = []
  const correctByQuestionId: Record<
    string,
    { correct_text: string; explanation: string | null; question_text: string }
  > = {}

  for (const q of picked) {
    const correctText = q.options[q.correct_option_index]
    const shuffledOptions = shuffle(q.options)

    publicQuestions.push({
      id: q.id,
      question_text: q.question_text,
      options: shuffledOptions,
    })

    correctByQuestionId[q.id] = {
      correct_text: correctText,
      explanation: q.explanation,
      question_text: q.question_text,
    }
  }

  return { publicQuestions, correctByQuestionId }
}

/**
 * Calcula el resultado del examen comparando las respuestas del cliente
 * (texto de la opción elegida) contra el texto correcto guardado en DB.
 *
 * Cuenta una pregunta como bien respondida si el texto enviado coincide
 * exactamente con el correcto. Las preguntas omitidas (no enviadas) cuentan
 * como mal.
 */
export function calculateScore(
  publicQuestions: ExamQuestionPublic[],
  answers: Array<{ question_id: string; selected_option: string }>,
  correctByQuestionId: Record<string, { correct_text: string; explanation: string | null; question_text: string }>
): {
  score: number
  total: number
  passed: boolean
  wrong_answers: Array<{
    question_id: string
    question_text: string
    your_answer: string
    correct_answer: string
    explanation: string | null
  }>
} {
  const answerMap = new Map<string, string>()
  for (const a of answers) {
    answerMap.set(a.question_id, a.selected_option)
  }

  let score = 0
  const wrongAnswers: Array<{
    question_id: string
    question_text: string
    your_answer: string
    correct_answer: string
    explanation: string | null
  }> = []

  for (const q of publicQuestions) {
    const meta = correctByQuestionId[q.id]
    if (!meta) continue
    const submitted = answerMap.get(q.id) ?? ""
    const isCorrect = submitted === meta.correct_text

    if (isCorrect) {
      score += 1
    } else {
      wrongAnswers.push({
        question_id: q.id,
        question_text: meta.question_text,
        your_answer: submitted || "(sin responder)",
        correct_answer: meta.correct_text,
        explanation: meta.explanation,
      })
    }
  }

  const total = publicQuestions.length
  const passingScore = getPassingScore()
  const passed = score >= passingScore

  return { score, total, passed, wrong_answers: wrongAnswers }
}

/**
 * Calcula el timestamp `cooldown_until` cuando reprueba. Suma
 * COOLDOWN_HOURS_ON_FAIL horas a `now`. Si aprobó, devuelve null.
 */
export function computeCooldownUntil(passed: boolean): string | null {
  if (passed) return null
  const now = new Date()
  now.setHours(now.getHours() + EXAM_CONFIG.COOLDOWN_HOURS_ON_FAIL)
  return now.toISOString()
}
