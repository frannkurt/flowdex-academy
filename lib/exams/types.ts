// Tipos compartidos para el sistema de exámenes pedagógicos por módulo.
// El backend nunca expone `correct_option_index` al cliente. Los tipos están
// separados en variantes "raw" (DB completa) y "publicQuestion" (lo que viaja
// al frontend, sin la respuesta correcta).

export type ExamQuestionRaw = {
  id: string
  course_slug: string
  module_number: number
  question_text: string
  options: string[]
  correct_option_index: number
  explanation: string | null
}

// Lo que ve el cliente: la pregunta y las opciones mezcladas, sin la
// respuesta correcta. El orden de las opciones cambia por intento.
export type ExamQuestionPublic = {
  id: string
  question_text: string
  options: string[]
}

export type ExamSubmitPayload = {
  course_slug: string
  module_number: number
  // El cliente envía las respuestas como [{ id, selected_option_index }] con
  // el índice según el ORDEN MEZCLADO que recibió. El backend reconstruye el
  // mapping para verificar contra el orden real de la DB.
  answers: Array<{
    question_id: string
    // Texto de la opción seleccionada (en lugar del índice). Más robusto
    // porque el shuffle cambia el orden entre cliente y servidor.
    selected_option: string
  }>
  // Momento en que el alumno empezó el examen (ISO). Opcional: lo manda el
  // cliente para poder medir la duración real del intento. El server valida
  // que sea razonable antes de usarlo.
  started_at?: string
  // Token único del intento (idempotencia). Si el envío llega dos veces con el
  // mismo token (reintento de red), el server devuelve el resultado guardado en
  // vez de crear un intento duplicado.
  attempt_token?: string
}

export type ExamResult = {
  score: number
  total: number
  passed: boolean
  passing_score: number
  // Solo aparece si reprobó: lista de preguntas que falló con la respuesta
  // correcta y la explicación opcional. Si aprobó, queda vacío (premio limpio).
  wrong_answers: Array<{
    question_id: string
    question_text: string
    your_answer: string
    correct_answer: string
    explanation: string | null
  }>
  cooldown_until: string | null
  attempt_id: string
}

// Configuración global del sistema.
export const EXAM_CONFIG = {
  QUESTIONS_PER_EXAM: 10,
  POOL_SIZE_RECOMMENDED: 20,
  PASSING_PERCENTAGE: 0.7,
  COOLDOWN_HOURS_ON_FAIL: 2,
} as const

export function getPassingScore() {
  return Math.ceil(EXAM_CONFIG.QUESTIONS_PER_EXAM * EXAM_CONFIG.PASSING_PERCENTAGE)
}

// Slugs de cursos que tienen examen. Obra Maestra queda explícitamente fuera
// (lo decidiste vos: pedagógicamente no encaja con quiz).
// Importante: los slugs del IC para progreso son `inner-circle-trading` y
// `inner-circle-inversiones` (con `inversiones`, no `investment`). El acceso
// se chequea contra el curso comercial `inner-circle`.
// Obra Maestra queda fuera explícitamente (pedagógicamente no encaja con quiz).
export const COURSES_WITH_EXAM = [
  "kickstart-trading",
  "trading-lab",
  "kickstart-investment",
  "expert-investment",
  "inner-circle-trading",
  "inner-circle-inversiones",
] as const

export type CourseWithExam = (typeof COURSES_WITH_EXAM)[number]

export function isCourseWithExam(slug: string): slug is CourseWithExam {
  return (COURSES_WITH_EXAM as readonly string[]).includes(slug)
}
