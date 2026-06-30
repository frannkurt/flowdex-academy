"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { m as motion } from "framer-motion"
import { ArrowLeft, Hourglass } from "lucide-react"
import { Lora } from "next/font/google"

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
})

type Props = {
  cooldownUntil: string
  courseLabel: string
  moduleNumber: number
  backHref: string
}

function computeRemaining(cooldownUntil: string) {
  const diffMs = new Date(cooldownUntil).getTime() - Date.now()
  if (diffMs <= 0) return { expired: true, hours: 0, minutes: 0, seconds: 0 }
  const totalSeconds = Math.floor(diffMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { expired: false, hours, minutes, seconds }
}

export function CooldownScreen({ cooldownUntil, courseLabel, moduleNumber, backHref }: Props) {
  const [remaining, setRemaining] = useState(() => computeRemaining(cooldownUntil))

  useEffect(() => {
    const interval = setInterval(() => {
      const next = computeRemaining(cooldownUntil)
      setRemaining(next)
      // Cuando expira, recargamos para que el server vuelva a evaluar y
      // habilite el examen.
      if (next.expired) {
        clearInterval(interval)
        window.location.reload()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [cooldownUntil])

  return (
    <main
      className={`${lora.className} relative min-h-screen overflow-hidden bg-[#0A0A0A] text-[#E8E8E8]`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(212,184,106,0.06) 0%, rgba(10,10,10,0) 50%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16">
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
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#D4B86A]/30 bg-[#D4B86A]/5">
            <Hourglass className="h-7 w-7 text-[#D4B86A]" />
          </div>

          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[#D4B86A]/70">
            {courseLabel} · Módulo {moduleNumber}
          </p>
          <h1 className="text-balance text-4xl font-medium leading-tight md:text-5xl">
            La pausa antes del próximo intento
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base italic leading-relaxed text-[#E8E8E8]/70">
            Repasá el módulo con calma. El descanso es parte del aprendizaje.
          </p>

          {/* Countdown */}
          <div className="mx-auto mt-12 flex max-w-md justify-center gap-3">
            <TimeBlock label="Horas" value={remaining.hours} />
            <Separator />
            <TimeBlock label="Minutos" value={remaining.minutes} />
            <Separator />
            <TimeBlock label="Segundos" value={remaining.seconds} />
          </div>

          <p className="mt-12 text-xs text-[#E8E8E8]/40">
            Esta pantalla se actualiza sola cuando termine la espera.
          </p>
        </motion.div>
      </div>
    </main>
  )
}

function TimeBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-[#1F1F1F] bg-[#0F0F0F] text-4xl font-medium text-[#D4B86A] md:h-24 md:w-24 md:text-5xl">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#E8E8E8]/45">
        {label}
      </span>
    </div>
  )
}

function Separator() {
  return (
    <div className="flex h-20 items-center text-3xl text-[#E8E8E8]/30 md:h-24">
      :
    </div>
  )
}
