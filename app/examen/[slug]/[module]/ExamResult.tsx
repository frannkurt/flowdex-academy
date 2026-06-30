"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, m as motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw } from "lucide-react"
import { Lora } from "next/font/google"
import type { ExamResult } from "@/lib/exams/types"

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
})

type Props = {
  result: ExamResult
  courseLabel: string
  moduleNumber: number
  backHref: string
  nextHref: string | null
  onRetake: () => void
}

// Mensaje simbólico para los aprobados, alineado al universo Flowdex.
// El Patio es el espacio donde el Aprendiz aprende observando a la Dama;
// "una loseta más del patio" es la metáfora de cada módulo aprobado.
function buildPassedTitle(score: number, total: number): string {
  if (score === total) return "Examen impecable"
  if (score >= total - 1) return "Dominio sólido"
  return "Examen aprobado"
}

function buildPassedSubtitle(): string {
  return "Un tramo del patio queda atrás. El Aprendiz se acerca un paso más al baile."
}

function buildFailedTitle(): string {
  return "Todavía no"
}

function buildFailedSubtitle(): string {
  return "El módulo merece una segunda lectura. En dos horas podés volver a rendir; revisá las respuestas correctas más abajo y volvé cuando estés listo."
}

export function ExamResultScreen({ result, courseLabel, moduleNumber, backHref, nextHref, onRetake }: Props) {
  // Animación del contador de score: 0 → result.score en ~1.2s
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    if (result.score === 0) {
      setAnimatedScore(0)
      return
    }
    let frame = 0
    const totalFrames = 36
    const interval = setInterval(() => {
      frame += 1
      const progress = Math.min(frame / totalFrames, 1)
      // Easing easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(eased * result.score))
      if (progress >= 1) clearInterval(interval)
    }, 32)

    return () => clearInterval(interval)
  }, [result.score])

  const passed = result.passed
  const percentage = Math.round((result.score / result.total) * 100)

  return (
    <main
      className={`${lora.className} relative min-h-screen overflow-hidden bg-[#0A0A0A] text-[#E8E8E8]`}
    >
      <BackgroundDecoration passed={passed} />

      {passed && <ParticleField />}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16">
        <Link
          href={backHref}
          className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm text-[#E8E8E8]/60 transition hover:text-[#D4B86A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al curso
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[#D4B86A]/70">
            {courseLabel} · Módulo {moduleNumber}
          </p>

          {passed ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#D4B86A]/40 bg-[#D4B86A]/10"
            >
              <Sparkles className="h-7 w-7 text-[#D4B86A]" />
            </motion.div>
          ) : null}

          <h1 className="text-balance text-4xl font-medium leading-tight md:text-5xl">
            {passed ? buildPassedTitle(result.score, result.total) : buildFailedTitle()}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base italic leading-relaxed text-[#E8E8E8]/70">
            {passed ? buildPassedSubtitle() : buildFailedSubtitle()}
          </p>

          {/* Scoreboard animado */}
          <div className="mx-auto mt-10 flex max-w-sm items-end justify-center gap-3 text-7xl font-medium md:text-8xl">
            <motion.span
              key={animatedScore}
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              className={passed ? "text-[#D4B86A]" : "text-[#E8E8E8]"}
            >
              {animatedScore}
            </motion.span>
            <span className="pb-3 text-3xl text-[#E8E8E8]/40 md:text-4xl">
              /{result.total}
            </span>
          </div>

          <div className="mx-auto mt-2 text-sm text-[#E8E8E8]/50">
            {percentage}% · Nota mínima para aprobar: {result.passing_score}/{result.total}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {passed && nextHref ? (
              <Link
                href={nextHref}
                className="inline-flex items-center gap-2 rounded-full bg-[#D4B86A] px-6 py-2.5 text-sm font-medium text-[#0A0A0A] transition hover:bg-[#E5CB7E]"
              >
                Continuar al módulo siguiente
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}

            <Link
              href={backHref}
              className="inline-flex items-center gap-2 rounded-full border border-[#1F1F1F] bg-[#0F0F0F] px-6 py-2.5 text-sm text-[#E8E8E8]/80 transition hover:border-[#2C2C2C] hover:text-[#E8E8E8]"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al curso
            </Link>

            {/* Reprobado con cooldown vigente → countdown que muta a botón.
                Reprobado sin cooldown (venció o el server no lo incluye, como
                en initialResult) → botón directo. Sin esta rama el alumno
                quedaba atrapado: reprobado, sin countdown y sin forma de
                volver a rendir. */}
            {!passed ? (
              result.cooldown_until ? (
                <CooldownPill cooldownUntil={result.cooldown_until} onRetake={onRetake} />
              ) : (
                <button
                  type="button"
                  onClick={onRetake}
                  className="inline-flex items-center gap-2 rounded-full bg-[#D4B86A] px-6 py-2.5 text-sm font-medium text-[#0A0A0A] transition hover:bg-[#E5CB7E]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Rendir de nuevo
                </button>
              )
            ) : null}
          </div>

          {passed ? (
            <button
              type="button"
              onClick={onRetake}
              className="mt-4 inline-flex items-center gap-2 text-xs text-[#E8E8E8]/45 transition hover:text-[#D4B86A]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Rendir de nuevo
            </button>
          ) : null}
        </motion.div>

        {/* Si reprobó: lista de respuestas con la correcta + explicación */}
        {!passed && result.wrong_answers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 w-full"
          >
            <h3 className="mb-6 text-center text-xs uppercase tracking-[0.3em] text-[#E8E8E8]/50">
              Lo que falta repasar
            </h3>
            <div className="flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {result.wrong_answers.map((w, idx) => (
                  <motion.div
                    key={w.question_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + idx * 0.05 }}
                    className="rounded-xl border border-[#1F1F1F] bg-[#0F0F0F] p-5"
                  >
                    <p className="text-sm font-medium text-[#E8E8E8]">{w.question_text}</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <p className="text-[#E8E8E8]/55">
                        <span className="text-[#E8E8E8]/40">Tu respuesta · </span>
                        <span className="line-through decoration-red-400/60">{w.your_answer}</span>
                      </p>
                      <p className="text-[#D4B86A]">
                        <span className="text-[#D4B86A]/60">Correcta · </span>
                        {w.correct_answer}
                      </p>
                    </div>
                    {w.explanation && (
                      <p className="mt-3 border-t border-[#1F1F1F] pt-3 text-xs italic leading-relaxed text-[#E8E8E8]/55">
                        {w.explanation}
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}

// Countdown vivo del cooldown tras reprobar. Se actualiza cada segundo; al
// llegar a cero se transforma en el botón "Rendir de nuevo" para que el
// alumno pueda reintentar sin salir de la pantalla.
function CooldownPill({ cooldownUntil, onRetake }: { cooldownUntil: string; onRetake: () => void }) {
  const [remainingMs, setRemainingMs] = useState(
    () => new Date(cooldownUntil).getTime() - Date.now()
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const next = new Date(cooldownUntil).getTime() - Date.now()
      setRemainingMs(next)
      if (next <= 0) clearInterval(interval)
    }, 1000)

    return () => clearInterval(interval)
  }, [cooldownUntil])

  if (remainingMs <= 0) {
    return (
      <button
        type="button"
        onClick={onRetake}
        className="inline-flex items-center gap-2 rounded-full bg-[#D4B86A] px-6 py-2.5 text-sm font-medium text-[#0A0A0A] transition hover:bg-[#E5CB7E]"
      >
        <RotateCcw className="h-4 w-4" />
        Rendir de nuevo
      </button>
    )
  }

  return (
    <span className="rounded-full border border-[#2A1F0E] bg-[#1A1306] px-5 py-2.5 text-xs uppercase tracking-[0.2em] tabular-nums text-[#D4B86A]/80">
      Nuevo intento en {formatCooldownShort(remainingMs)}
    </span>
  )
}

function formatCooldownShort(diffMs: number): string {
  if (diffMs <= 0) return "ahora"
  const totalSeconds = Math.floor(diffMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  // Con más de una hora alcanza el detalle a minutos; en la última hora
  // mostramos segundos para que el alumno vea el contador moverse.
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, "0")}m`
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`
}

function BackgroundDecoration({ passed }: { passed: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          background: passed
            ? "radial-gradient(ellipse at 50% 20%, rgba(212,184,106,0.18) 0%, rgba(10,10,10,0) 55%)"
            : "radial-gradient(ellipse at 50% 20%, rgba(80,80,80,0.06) 0%, rgba(10,10,10,0) 55%)",
        }}
      />
    </div>
  )
}

// Partículas doradas sutiles que descienden por la pantalla cuando aprueba.
function ParticleField() {
  // Solo en cliente: las partículas usan Math.random(), que difiere entre
  // server y cliente. Como ahora el resultado puede renderizarse en el server
  // (intento previo), montarlas solo tras hidratar evita el mismatch.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // 24 partículas con posición y delay aleatorios pero estables por render.
  const [particles] = useState(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      duration: 4 + Math.random() * 3,
      size: 2 + Math.random() * 3,
    }))
  )

  if (!mounted) {
    return null
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-[#D4B86A]/40"
          style={{ left: `${p.left}%`, top: -10, width: p.size, height: p.size }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: "110vh", opacity: [0, 0.7, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
