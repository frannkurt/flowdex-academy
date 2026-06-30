"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, m as motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { Lora } from "next/font/google"
import type { ExamQuestionPublic, ExamResult } from "@/lib/exams/types"
import { EXAM_CONFIG, getPassingScore } from "@/lib/exams/types"
import { ExamResultScreen } from "./ExamResult"

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
})

type Answers = Record<string, string> // question_id → selected_option text

// Token único por intento. Viaja con el envío para que el server pueda
// deduplicar: si llega dos veces (reintento de red), guarda un solo intento.
function genAttemptToken(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

type Props = {
  courseSlug: string
  moduleNumber: number
  courseLabel: string
  questions: ExamQuestionPublic[]
  alreadyPassed: boolean
  backHref: string
  nextHref: string | null
  initialResult: ExamResult | null
}

export function ExamRunner({
  courseSlug,
  moduleNumber,
  courseLabel,
  questions,
  alreadyPassed,
  backHref,
  nextHref,
  initialResult,
}: Props) {
  const [hasStarted, setHasStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  // Si el alumno ya tiene un intento guardado, arrancamos mostrando su
  // resultado (sobrevive a recargar). "Rendir de nuevo" lo limpia.
  const [result, setResult] = useState<ExamResult | null>(initialResult ?? null)
  // Momento de inicio del examen, para medir duración real del intento.
  const [startedAt, setStartedAt] = useState<string | null>(null)
  // Token de idempotencia del intento en curso.
  const [attemptToken, setAttemptToken] = useState<string>(() => genAttemptToken())

  function handleStart() {
    setStartedAt(new Date().toISOString())
    setHasStarted(true)
  }

  // Empezar un intento nuevo desde cero (no recarga, así no re-muestra el
  // último resultado leído de la base).
  function handleRetake() {
    try {
      window.sessionStorage.removeItem(draftKey)
    } catch {
      // noop
    }
    setResult(null)
    setHasStarted(false)
    setCurrentIndex(0)
    setAnswers({})
    setStartedAt(null)
    setSubmitError(null)
    setAttemptToken(genAttemptToken())
  }

  // Borrador del examen en curso. Persistimos respuestas + pregunta actual en
  // sessionStorage para no perder el progreso si se recarga, se rota el celular
  // o se descarta la pestaña a mitad del examen.
  const draftKey = `exam-draft:${courseSlug}:${moduleNumber}`

  // Hidratar borrador al montar.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(draftKey)
      if (!raw) return
      const draft = JSON.parse(raw) as {
        hasStarted?: boolean
        currentIndex?: number
        answers?: Answers
        startedAt?: string
        attemptToken?: string
      }

      // El server randomiza el set de preguntas en cada carga de página. Si el
      // borrador es de una carga anterior, sus respuestas apuntan a IDs que ya
      // no existen: hidratarlo dejaría el examen "respondido" en la UI pero
      // vacío en el payload (así nacen los 0/10 con respuestas en blanco).
      // En ese caso descartamos el borrador y arrancamos limpio.
      const validIds = new Set(questions.map((q) => q.id))
      const draftAnswers =
        draft.answers && typeof draft.answers === "object" ? draft.answers : {}
      const draftIsStale = Object.keys(draftAnswers).some((id) => !validIds.has(id))
      if (draftIsStale) {
        window.sessionStorage.removeItem(draftKey)
        return
      }

      setAnswers(draftAnswers)
      if (typeof draft.currentIndex === "number") {
        setCurrentIndex(Math.min(Math.max(draft.currentIndex, 0), questions.length - 1))
      }
      if (draft.hasStarted) setHasStarted(true)
      if (draft.startedAt) setStartedAt(draft.startedAt)
      if (draft.attemptToken) setAttemptToken(draft.attemptToken)
    } catch {
      // Borrador corrupto: lo ignoramos.
    }
  }, [draftKey, questions])

  // Guardar borrador en cada cambio, una vez empezado.
  useEffect(() => {
    if (!hasStarted) return
    try {
      window.sessionStorage.setItem(
        draftKey,
        JSON.stringify({ hasStarted, currentIndex, answers, startedAt, attemptToken })
      )
    } catch {
      // sessionStorage no disponible: seguimos sin persistir.
    }
  }, [hasStarted, currentIndex, answers, startedAt, attemptToken, draftKey])

  const total = questions.length
  const currentQuestion = questions[currentIndex]
  const selectedOption = currentQuestion ? answers[currentQuestion.id] : undefined
  const isLastQuestion = currentIndex === total - 1
  const passingScore = useMemo(() => getPassingScore(), [])

  function handleSelectOption(option: string) {
    if (!currentQuestion) return
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }))

    // Autoavance: si no es la última pregunta, pasamos a la siguiente con
    // un delay corto para que el alumno vea el check visual antes del fade.
    // En la última pregunta no avanzamos: queda esperando que el alumno
    // toque "Finalizar examen" (confirmación explícita del submit).
    if (currentIndex < total - 1) {
      window.setTimeout(() => {
        setCurrentIndex((i) => (i < total - 1 ? i + 1 : i))
      }, 350)
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return

    // Guard: no se envía un examen incompleto. Si por algún estado raro
    // (borrador, navegación) quedó una pregunta sin responder, llevamos al
    // alumno ahí en vez de mandar respuestas vacías que cuentan como error.
    const firstUnanswered = questions.findIndex((q) => !(answers[q.id] ?? "").trim())
    if (firstUnanswered !== -1) {
      setCurrentIndex(firstUnanswered)
      setSubmitError(
        `Te queda al menos una pregunta sin responder (la ${firstUnanswered + 1}). Respondela antes de finalizar.`
      )
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload = {
        course_slug: courseSlug,
        module_number: moduleNumber,
        answers: questions.map((q) => ({
          question_id: q.id,
          selected_option: answers[q.id] ?? "",
        })),
        started_at: startedAt ?? undefined,
        attempt_token: attemptToken,
      }

      // Reintentos ante fallo de red / 5xx (hasta 2 reintentos con backoff).
      // Las respuestas quedan en sessionStorage, así que aunque falle todo, el
      // alumno no pierde lo que respondió.
      let response: Response | null = null
      const maxAttempts = 3
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          response = await fetch("/api/exams/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
          // 5xx: reintentamos. 4xx y 2xx: salimos del loop.
          if (response.status < 500 || attempt === maxAttempts) break
        } catch (err) {
          if (attempt === maxAttempts) throw err
        }
        await new Promise((resolve) => window.setTimeout(resolve, 600 * attempt))
      }

      if (!response) {
        throw new Error("sin respuesta del servidor")
      }

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => ({}))) as {
          error?: string
          cooldown_until?: string
        }
        // 429 con cooldown: el intento ya quedó registrado. Lo aclaramos para
        // que el alumno no crea que se perdió y reintente al pedo.
        if (response.status === 429 && errorBody.cooldown_until) {
          window.sessionStorage.removeItem(draftKey)
          setSubmitError(
            "Tu intento quedó registrado. Hay un descanso antes del próximo: volvé al curso y reintentá cuando se habilite."
          )
        } else {
          setSubmitError(errorBody.error ?? "No pudimos procesar tu examen. Intentá de nuevo.")
        }
        setIsSubmitting(false)
        return
      }

      const data = (await response.json()) as ExamResult
      // Examen procesado OK: limpiamos el borrador.
      try {
        window.sessionStorage.removeItem(draftKey)
      } catch {
        // noop
      }
      setResult(data)
    } catch (err) {
      console.error("[exam] submit failed", err)
      setSubmitError("Error de red. Tus respuestas quedaron guardadas; probá de nuevo en unos segundos.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Si ya hay resultado, mostramos la pantalla de resultado
  if (result) {
    return (
      <ExamResultScreen
        result={result}
        courseLabel={courseLabel}
        moduleNumber={moduleNumber}
        backHref={backHref}
        nextHref={nextHref}
        onRetake={handleRetake}
      />
    )
  }

  // Pantalla de bienvenida (antes de empezar)
  if (!hasStarted) {
    return (
      <main
        className={`${lora.className} relative min-h-screen overflow-hidden bg-[#0A0A0A] text-[#E8E8E8]`}
      >
        <BackgroundDecoration />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16">
          <Link
            href={backHref}
            className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm text-[#E8E8E8]/60 transition hover:text-[#D4B86A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al curso
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[#D4B86A]/80">
              {courseLabel}
            </p>
            <h1 className="text-balance text-4xl font-medium leading-tight md:text-5xl">
              Examen del módulo {moduleNumber}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#E8E8E8]/75">
              {alreadyPassed
                ? "Ya superaste este examen una vez. Podés volver a rendirlo si querés repasar."
                : "Diez preguntas para validar que el módulo está sólido en tu cabeza. Sin trampas: si reprobás, hay un descanso de dos horas antes del próximo intento."}
            </p>

            <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 text-center">
              <Stat label="Preguntas" value={`${EXAM_CONFIG.QUESTIONS_PER_EXAM}`} />
              <Stat label="Para aprobar" value={`${passingScore}/${EXAM_CONFIG.QUESTIONS_PER_EXAM}`} />
              <Stat
                label="Descanso si reprobás"
                value={`${EXAM_CONFIG.COOLDOWN_HOURS_ON_FAIL}hs`}
              />
            </div>

            <button
              type="button"
              onClick={handleStart}
              className="mt-12 inline-flex items-center gap-2 rounded-full bg-[#D4B86A] px-8 py-3 text-sm font-medium text-[#0A0A0A] transition hover:bg-[#E5CB7E]"
            >
              Empezar el examen
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-6 text-xs text-[#E8E8E8]/40">
              Una pregunta por pantalla. Vas a poder volver atrás.
            </p>
          </motion.div>
        </div>
      </main>
    )
  }

  // Pantalla de pregunta
  const progressPct = ((currentIndex + 1) / total) * 100

  return (
    <main
      className={`${lora.className} relative min-h-screen overflow-hidden bg-[#0A0A0A] text-[#E8E8E8]`}
    >
      <BackgroundDecoration />

      {/* Barra de progreso fija arriba */}
      <div className="fixed inset-x-0 top-0 z-20 h-[3px] bg-[#1A1A1A]">
        <motion.div
          className="h-full bg-[#D4B86A]"
          initial={false}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col px-6 pb-12 pt-14">
        {/* Header con contador */}
        <div className="mb-10 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#E8E8E8]/50">
          <span>{courseLabel} · Módulo {moduleNumber}</span>
          <span>
            <span className="text-[#D4B86A]">{currentIndex + 1}</span>
            <span className="mx-1">/</span>
            <span>{total}</span>
          </span>
        </div>

        {/* Pregunta + opciones con fade entre cada una */}
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="flex flex-1 flex-col"
            >
              <h2 className="text-balance text-2xl font-medium leading-snug md:text-3xl">
                {currentQuestion.question_text}
              </h2>

              <div className="mt-10 flex flex-col gap-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === option
                  return (
                    <button
                      type="button"
                      key={`${currentQuestion.id}-${idx}`}
                      onClick={() => handleSelectOption(option)}
                      className={`group relative flex items-center gap-4 rounded-xl border px-5 py-4 text-left transition ${
                        isSelected
                          ? "border-[#D4B86A] bg-[#D4B86A]/10"
                          : "border-[#1F1F1F] bg-[#0F0F0F] hover:border-[#2C2C2C] hover:bg-[#141414]"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs transition ${
                          isSelected
                            ? "border-[#D4B86A] bg-[#D4B86A] text-[#0A0A0A]"
                            : "border-[#2C2C2C] text-[#E8E8E8]/60 group-hover:border-[#3A3A3A]"
                        }`}
                      >
                        {isSelected ? <Check className="h-3.5 w-3.5" /> : String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-base leading-relaxed">{option}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navegación inferior */}
        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-full border border-[#1F1F1F] px-5 py-2.5 text-sm text-[#E8E8E8]/70 transition hover:border-[#2C2C2C] hover:text-[#E8E8E8] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedOption || isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-[#D4B86A] px-7 py-2.5 text-sm font-medium text-[#0A0A0A] transition hover:bg-[#E5CB7E] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando
                </>
              ) : (
                <>
                  Finalizar examen
                  <Check className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            // En preguntas intermedias no hay botón a la derecha: el click
            // en una opción avanza solo. El bloque vacío mantiene el layout
            // (justify-between) con "Anterior" pegado a la izquierda.
            <div />
          )}
        </div>

        {submitError && (
          <p className="mt-4 text-center text-sm text-red-400">{submitError}</p>
        )}
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#1F1F1F] bg-[#0F0F0F] px-3 py-4">
      <p className="text-2xl font-medium text-[#D4B86A]">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#E8E8E8]/45">{label}</p>
    </div>
  )
}

function BackgroundDecoration() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% -10%, rgba(212,184,106,0.08) 0%, rgba(10,10,10,0) 50%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 110%, rgba(212,184,106,0.04) 0%, rgba(10,10,10,0) 55%)",
        }}
      />
    </div>
  )
}
