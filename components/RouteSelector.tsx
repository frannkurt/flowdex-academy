"use client"

import { useState } from "react"
import Link from "next/link"
import { m as motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react"

type CourseId =
  | "kickstart-investment"
  | "expert-investment"
  | "kickstart-trading"
  | "trading-lab"
  | "inner-circle"

type Recommendation = {
  course: CourseId
  title: string
  badge: string
  color: string
  oneLiner: string
  href: string
  nextLevel?: { title: string; description: string; href: string }
}

const RECOMMENDATIONS: Record<CourseId, Recommendation> = {
  "kickstart-investment": {
    course: "kickstart-investment",
    title: "Kickstart Investment",
    badge: "Inicial · Inversión",
    color: "#5BB8D4",
    oneLiner:
      "Tu punto de entrada al mundo de las inversiones con criterio. Base patrimonial, instrumentos y rutina semanal para tomar decisiones sin improvisar.",
    href: "/cursos/kickstart-investment",
    nextLevel: {
      title: "Después, Expert Investment",
      description:
        "Una vez que tenés la base, el siguiente paso natural es Expert Investment con descuento de $200 por upgrade.",
      href: "/cursos/expert-investment",
    },
  },
  "expert-investment": {
    course: "expert-investment",
    title: "Expert Investment",
    badge: "Avanzado · Inversión",
    color: "#5BB8D4",
    oneLiner:
      "Para inversores con base que quieren armar tesis propias. Análisis fundamental profundo, lectura macro y construcción profesional de portafolio.",
    href: "/cursos/expert-investment",
    nextLevel: {
      title: "Después, el Inner Circle",
      description:
        "Una vez completado Expert, el Inner Circle es el paso natural si querés mentoría continua y review personalizado de tus decisiones de capital.",
      href: "/inner-circle",
    },
  },
  "kickstart-trading": {
    course: "kickstart-trading",
    title: "Kickstart Trading",
    badge: "Inicial · Trading",
    color: "#7DD4C0",
    oneLiner:
      "Primeros pasos en la operatividad con marco profesional. Mentalidad, setup, análisis técnico, gestión de riesgo y primer contacto con prop firms.",
    href: "/cursos/kickstart-trading",
    nextLevel: {
      title: "Después, Flowdex Trading Lab",
      description:
        "Una vez que tenés la base operativa, el siguiente paso natural es Trading Lab con descuento de $200 por upgrade.",
      href: "/cursos/trading-lab",
    },
  },
  "trading-lab": {
    course: "trading-lab",
    title: "Flowdex Trading Lab",
    badge: "Avanzado · Trading",
    color: "#7DD4C0",
    oneLiner:
      "Operatividad avanzada con visión institucional. Lectura de liquidez, FVG, Volume Profile, top-down profesional y gestión de evaluaciones de prop firms.",
    href: "/cursos/trading-lab",
    nextLevel: {
      title: "Después, el Inner Circle",
      description:
        "Una vez completado Trading Lab, el Inner Circle es el paso natural si querés mentoría continua y review personalizado de tus operaciones.",
      href: "/inner-circle",
    },
  },
  "inner-circle": {
    course: "inner-circle",
    title: "Inner Circle",
    badge: "Programa premium · 12 meses",
    color: "#D4B86A",
    oneLiner:
      "Programa anual con mentoría grupal, review personalizado de trades, indicadores propios y comunidad cerrada. Requiere haber completado Expert Investment o Trading Lab.",
    href: "/inner-circle",
  },
}

type Option = { label: string; sublabel?: string; next: string }
type Step = {
  id: string
  question: string
  hint?: string
  options: Option[]
}

const STEPS: Record<string, Step> = {
  path: {
    id: "path",
    question: "¿Qué te llama más?",
    hint: "El primer corte separa los dos grandes caminos del programa.",
    options: [
      {
        label: "Inversión",
        sublabel: "Construir patrimonio a largo plazo con criterio",
        next: "inv-q1",
      },
      {
        label: "Trading",
        sublabel: "Operar el mercado activamente sobre futuros o forex",
        next: "trade-q1",
      },
    ],
  },

  // ===== PATH INVERSIÓN: 4 preguntas técnicas =====
  "inv-q1": {
    id: "inv-q1",
    question: "¿Sabés diferenciar un FCI, un ETF y un CEDEAR?",
    hint: "Conocés el vehículo, sus comisiones, su moneda de denominación y para qué sirve cada uno.",
    options: [
      { label: "Sí, los manejo", next: "inv-q2" },
      { label: "No los manejo bien", sublabel: "Mejor empezar por la base", next: "kickstart-investment" },
    ],
  },
  "inv-q2": {
    id: "inv-q2",
    question: "¿Sabés qué es un ratio P/E y cuándo es alto o bajo?",
    hint: "Price-to-Earnings. Cuándo una acción está cara o barata según sus ganancias.",
    options: [
      { label: "Sí, lo uso para analizar", next: "inv-q3" },
      { label: "No, no lo manejo", sublabel: "Mejor empezar por la base", next: "kickstart-investment" },
    ],
  },
  "inv-q3": {
    id: "inv-q3",
    question: "¿Podés leer un balance básico (activo, pasivo y patrimonio neto)?",
    hint: "Identificar deuda, liquidez y solvencia mirando los estados financieros de una empresa.",
    options: [
      { label: "Sí, los leo con criterio", next: "inv-q4" },
      { label: "No, no sé leerlos", sublabel: "Mejor empezar por la base", next: "kickstart-investment" },
    ],
  },
  "inv-q4": {
    id: "inv-q4",
    question: "¿Tenés una cartera armada con criterio (perfil + horizonte + asset allocation)?",
    hint: "No es tener acciones sueltas. Es tener estructura, ponderación y reglas de rebalanceo.",
    options: [
      { label: "Sí, opero con plan", sublabel: "Listo para el avanzado", next: "expert-investment" },
      { label: "No, todavía no", sublabel: "Mejor empezar por la base", next: "kickstart-investment" },
    ],
  },

  // ===== PATH TRADING: 4 preguntas técnicas =====
  "trade-q1": {
    id: "trade-q1",
    question: "¿Operaste con dinero real (cuenta propia o prop firm) más de 50 trades?",
    hint: "Paper trading no cuenta. El número importa porque es a partir de ahí que aparecen tus patrones reales — los aciertos, los errores y las emociones que solo se sienten con dinero en juego.",
    options: [
      { label: "Sí, más de 50 trades reales", next: "trade-q2" },
      { label: "No, todavía no", sublabel: "Mejor empezar por la base", next: "kickstart-trading" },
    ],
  },
  "trade-q2": {
    id: "trade-q2",
    question: "¿Sabés definir si el mercado está en tendencia, rango o consolidación?",
    hint: "Y, sobre todo, cómo cambia tu operativa según el contexto. Si operás igual en tendencia que en rango, no estás leyendo el contexto.",
    options: [
      { label: "Sí, leo el contexto antes de operar", next: "trade-q3" },
      { label: "No, opero igual en cualquier contexto", sublabel: "Mejor empezar por la base", next: "kickstart-trading" },
    ],
  },
  "trade-q3": {
    id: "trade-q3",
    question: "¿Identificás soportes y resistencias en múltiples timeframes?",
    hint: "Marcás zonas relevantes en HTF (diario / 4h) y bajás a LTF (1h / 15m) para ejecutar. Si solo mirás un timeframe, no estás leyendo estructura.",
    options: [
      { label: "Sí, opero con análisis multi-timeframe", next: "trade-q4" },
      { label: "No, miro un solo gráfico", sublabel: "Mejor empezar por la base", next: "kickstart-trading" },
    ],
  },
  "trade-q4": {
    id: "trade-q4",
    question: "¿Tenés reglas de entrada, salida y gestión de riesgo escritas que sostenés?",
    hint: "Reglas concretas en un documento o en tu journal, no en tu cabeza. Si las cambiás trade por trade, no son reglas.",
    options: [
      { label: "Sí, tengo sistema con reglas escritas", sublabel: "Listo para el avanzado", next: "trading-lab" },
      { label: "No, opero por intuición", sublabel: "Mejor empezar por la base", next: "kickstart-trading" },
    ],
  },
}

function isCourseId(value: string): value is CourseId {
  return value in RECOMMENDATIONS
}

export function RouteSelector() {
  const [history, setHistory] = useState<string[]>(["path"])
  const [result, setResult] = useState<CourseId | null>(null)

  const currentStepId = history[history.length - 1]
  const currentStep = STEPS[currentStepId]
  const totalSteps = STEPS[currentStepId] ? history.length + 2 : history.length

  const handleAnswer = (next: string) => {
    if (isCourseId(next)) {
      setResult(next)
      return
    }
    if (STEPS[next]) {
      setHistory((prev) => [...prev, next])
    }
  }

  const handleBack = () => {
    if (result) {
      setResult(null)
      return
    }
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1))
    }
  }

  const handleReset = () => {
    setHistory(["path"])
    setResult(null)
  }

  const canGoBack = history.length > 1 || result !== null

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#0E0E0E]/80 p-6 sm:p-8 lg:p-10">
      {/* Header con progreso */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {!result ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7DD4C0]">
              Paso {history.length} de hasta 5
            </p>
          ) : (
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D4B86A]">
              Recomendación
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canGoBack && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] px-3 py-1.5 text-xs text-[#A8A8A8] transition-colors hover:border-[#7DD4C0]/40 hover:text-white"
            >
              <ArrowLeft size={13} />
              Volver
            </button>
          )}
          {result && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] px-3 py-1.5 text-xs text-[#A8A8A8] transition-colors hover:border-[#D4B86A]/40 hover:text-white"
            >
              <RotateCcw size={13} />
              Empezar de nuevo
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!result && currentStep ? (
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="type-display-xs text-white mb-2">
              {currentStep.question}
            </h3>
            {currentStep.hint && (
              <p className="text-sm text-[#888] mb-6 leading-relaxed">{currentStep.hint}</p>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              {currentStep.options.map((option, i) => {
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAnswer(option.next)}
                    className="group text-left rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 transition-all hover:border-[#7DD4C0]/40 hover:bg-[#7DD4C0]/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-base font-semibold text-white mb-1 group-hover:text-[#7DD4C0] transition-colors">
                          {option.label}
                        </p>
                        {option.sublabel && (
                          <p className="text-xs text-[#A8A8A8] leading-snug">{option.sublabel}</p>
                        )}
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-[#555] mt-1 flex-shrink-0 group-hover:text-[#7DD4C0] group-hover:translate-x-0.5 transition-all"
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {(() => {
              const rec = RECOMMENDATIONS[result]
              return (
                <div>
                  <div
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] mb-5"
                    style={{
                      borderColor: `${rec.color}40`,
                      backgroundColor: `${rec.color}12`,
                      color: rec.color,
                      borderWidth: 1,
                    }}
                  >
                    <Sparkles size={12} />
                    Tu programa sugerido · {rec.badge}
                  </div>

                  <h3 className="type-display-sm text-white mb-4">
                    {rec.title}
                  </h3>

                  <p className="text-base text-[#CFCFCF] leading-relaxed mb-7 max-w-2xl">
                    {rec.oneLiner}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={rec.href}
                      className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-[#0A0A0A] transition-all hover:scale-[1.02]"
                      style={{
                        background: `linear-gradient(135deg, ${rec.color}, ${rec.color}CC)`,
                        boxShadow: `0 0 24px ${rec.color}55`,
                      }}
                    >
                      {rec.course === "inner-circle" ? "Ver detalle del programa" : "Descubrí qué vas a aprender"}
                      <ArrowRight size={15} />
                    </Link>
                    <a
                      href="https://wa.me/message/WD3RGNGTSPFYA1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] px-5 py-3 text-sm font-medium text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/50 hover:text-white"
                    >
                      Tengo dudas, hablemos
                    </a>
                  </div>

                  {rec.nextLevel && (
                    <div className="mt-8 pt-6 border-t border-[#1F1F1F]">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#888] mb-2">
                        Paso siguiente en el camino
                      </p>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-[260px]">
                          <p className="text-sm font-semibold text-white mb-1">
                            {rec.nextLevel.title}
                          </p>
                          <p className="text-xs text-[#A8A8A8] leading-snug">
                            {rec.nextLevel.description}
                          </p>
                        </div>
                        <Link
                          href={rec.nextLevel.href}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7DD4C0] hover:text-white transition-colors"
                        >
                          Ver más
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
