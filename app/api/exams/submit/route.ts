import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/payments/mercadopago-pricing"
import {
  EXAM_CONFIG,
  type ExamQuestionPublic,
  type ExamResult,
  type ExamSubmitPayload,
  getPassingScore,
  isCourseWithExam,
} from "@/lib/exams/types"
import {
  calculateScore,
  computeCooldownUntil,
  getActiveCooldown,
  getAttemptResultByToken,
  getModuleQuestionsRaw,
  hasExamAccess,
} from "@/lib/exams/server"

export const dynamic = "force-dynamic"

/**
 * POST /api/exams/submit
 *
 * Body: ExamSubmitPayload
 *
 * Responde con ExamResult (sin exponer correct_option_index para preguntas
 * acertadas; solo aparece en wrong_answers).
 *
 * Flujo:
 * 1) Sesión válida + acceso al curso
 * 2) Validar payload (slug en lista, module_number int, answers array)
 * 3) Re-chequear cooldown (defensa contra race)
 * 4) Fetchear las preguntas raw filtrando por los question_ids del cliente
 *    (previene envío de IDs de otros módulos)
 * 5) Calcular score por texto
 * 6) Insertar attempt + setear cooldown_until si reprueba
 * 7) Devolver ExamResult
 */
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado." }, { status: 500 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 })
  }

  // 1) Parsear payload
  let payload: ExamSubmitPayload
  try {
    payload = (await request.json()) as ExamSubmitPayload
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 })
  }

  const { course_slug, module_number, answers, started_at: startedAtRaw, attempt_token } = payload

  // 2) Validaciones de shape
  if (!course_slug || !isCourseWithExam(course_slug)) {
    return NextResponse.json({ error: "Curso inválido." }, { status: 400 })
  }
  if (!Number.isInteger(module_number) || module_number < 1) {
    return NextResponse.json({ error: "Número de módulo inválido." }, { status: 400 })
  }
  if (!Array.isArray(answers) || answers.length === 0 || answers.length > 50) {
    return NextResponse.json({ error: "Respuestas inválidas." }, { status: 400 })
  }

  // Examen incompleto no se registra como intento. Una respuesta vacía cuenta
  // como error y genera "0/10 fantasma" + cooldown injusto; el cliente ya lo
  // bloquea, esto cubre payloads manuales o estados raros del borrador.
  const hasEmptyAnswers = answers.some(
    (a) => typeof a?.selected_option !== "string" || a.selected_option.trim().length === 0
  )
  if (hasEmptyAnswers) {
    return NextResponse.json(
      { error: "Examen incompleto: respondé todas las preguntas antes de finalizar." },
      { status: 400 }
    )
  }

  // Acceso al curso
  const hasAccess = await hasExamAccess(supabase, user.id, course_slug)
  if (!hasAccess) {
    return NextResponse.json({ error: "No tenés acceso a este curso." }, { status: 403 })
  }

  const admin = createSupabaseAdminClient()
  if (!admin) {
    return NextResponse.json({ error: "Service role no configurado." }, { status: 500 })
  }

  // Idempotencia: si ya existe un intento con este token, devolvemos ese
  // resultado en vez de guardar otro. Cubre el reintento por corte de red
  // (el cliente reenvía con el mismo token) y evita el intento fantasma.
  if (typeof attempt_token === "string" && attempt_token.length > 0) {
    const existing = await getAttemptResultByToken(admin, user.id, course_slug, module_number, attempt_token)
    if (existing) {
      return NextResponse.json(existing)
    }
  }

  // 3) Re-chequear cooldown (race protection)
  const activeCooldown = await getActiveCooldown(admin, user.id, course_slug, module_number)
  if (activeCooldown) {
    return NextResponse.json(
      {
        error: "Cooldown activo. Esperá a que termine antes del próximo intento.",
        cooldown_until: activeCooldown,
      },
      { status: 429 }
    )
  }

  // 4) Traer preguntas del registry y filtrar por los IDs enviados por el cliente.
  //    Defensa: si el cliente manda IDs que no pertenecen a este módulo, no los
  //    encuentra. El registry ya viene tipado y validado en build time.
  const questionIds = new Set(
    answers
      .map((a) => a.question_id)
      .filter((id): id is string => typeof id === "string" && id.length > 0)
  )

  if (questionIds.size === 0) {
    return NextResponse.json({ error: "Sin preguntas para evaluar." }, { status: 400 })
  }

  const modulePool = getModuleQuestionsRaw(course_slug, module_number)
  const rawQuestions = modulePool.filter((q) => questionIds.has(q.id))

  if (rawQuestions.length === 0) {
    return NextResponse.json({ error: "Preguntas no encontradas." }, { status: 400 })
  }

  // Cap defensivo: aunque pidamos N preguntas por examen, si el cliente
  // mandó menos válidas evaluamos contra las que efectivamente existen.
  const expectedTotal = Math.min(EXAM_CONFIG.QUESTIONS_PER_EXAM, rawQuestions.length)

  // 5) Armar el mapping para calculateScore reutilizando los helpers
  const publicQuestions: ExamQuestionPublic[] = rawQuestions.map((q) => ({
    id: q.id,
    question_text: q.question_text,
    options: q.options,
  }))

  const correctByQuestionId: Record<
    string,
    { correct_text: string; explanation: string | null; question_text: string }
  > = {}
  for (const q of rawQuestions) {
    correctByQuestionId[q.id] = {
      correct_text: q.options[q.correct_option_index],
      explanation: q.explanation,
      question_text: q.question_text,
    }
  }

  const { score, passed, wrong_answers } = calculateScore(
    publicQuestions,
    answers,
    correctByQuestionId
  )

  const passingScore = getPassingScore()
  const cooldown_until = computeCooldownUntil(passed)

  // 6) Insertar attempt
  // Nota sobre el schema real de user_quiz_attempts:
  // - `answers` (jsonb, NOT NULL): respuestas crudas del alumno para auditoría.
  // - `started_at` / `completed_at` (timestamptz, NOT NULL): ambos en NOW()
  //   por ahora. Si más adelante queremos medir duración del examen, el
  //   cliente puede mandar `started_at` en el payload.
  // - No hay columna `total`: las preguntas por examen son fijas (10), si
  //   alguna vez varía lo derivamos del jsonb `answers`.
  const nowIso = new Date().toISOString()
  // Validamos el started_at que manda el cliente: debe ser fecha válida, no
  // futura y no absurdamente vieja (máx 6h). Si no pasa, usamos NOW() (duración
  // no medible) en vez de confiar en un valor manipulado.
  let startedAtIso = nowIso
  if (typeof startedAtRaw === "string") {
    const startedMs = new Date(startedAtRaw).getTime()
    const nowMs = Date.now()
    if (Number.isFinite(startedMs) && startedMs <= nowMs && nowMs - startedMs <= 6 * 60 * 60 * 1000) {
      startedAtIso = new Date(startedMs).toISOString()
    }
  }
  const baseAttempt = {
    user_id: user.id,
    course_slug,
    module_number,
    score,
    passed,
    cooldown_until,
    answers,
    started_at: startedAtIso,
    completed_at: nowIso,
  }

  let insertResult = await admin
    .from("user_quiz_attempts")
    .insert({ ...baseAttempt, attempt_token: attempt_token ?? null })
    .select("id")
    .single()

  // Si la columna attempt_token todavía no existe (migración no corrida),
  // reintentamos sin ella para no romper el examen. Postgres: 42703 = columna
  // indefinida.
  if (insertResult.error?.code === "42703") {
    insertResult = await admin
      .from("user_quiz_attempts")
      .insert(baseAttempt)
      .select("id")
      .single()
  }

  const insertedAttempt = insertResult.data
  const insertErr = insertResult.error

  if (insertErr || !insertedAttempt) {
    console.error("[exams/submit] error insertando attempt", insertErr)
    return NextResponse.json({ error: "No pudimos guardar tu intento." }, { status: 500 })
  }

  const result: ExamResult = {
    score,
    total: expectedTotal,
    passed,
    passing_score: passingScore,
    // Solo enviamos wrong_answers si reprobó. Si aprobó queda lista vacía
    // para no spoilear preguntas para futuros intentos.
    wrong_answers: passed ? [] : wrong_answers,
    cooldown_until,
    attempt_id: insertedAttempt.id as string,
  }

  return NextResponse.json(result)
}
