"use client"

import { m as motion } from "framer-motion"
import {
  Send,
  Users,
  Rocket,
  GraduationCap,
  Crown,
  Instagram,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

import { fadeUp, fadeUpProps, staggerParent, viewport } from "@/lib/motion"

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M19.8 5.4A16.9 16.9 0 0 0 15.7 4l-.2.4c-.1.3-.3.7-.4 1-1-.2-1.9-.3-2.9-.3-1 0-1.9.1-2.9.3a12.6 12.6 0 0 0-.6-1.4 16.8 16.8 0 0 0-4 1.4C2.1 9 1.5 12.4 1.8 15.8a16.8 16.8 0 0 0 5 2.5l1.1-1.8c-.6-.2-1.1-.5-1.6-.8l.4-.3c3 1.4 6.3 1.4 9.2 0l.4.3c-.5.3-1 .6-1.6.8l1.1 1.8a16.7 16.7 0 0 0 5-2.5c.5-3.9-.8-7.2-1.2-10.4ZM8.9 13.8c-.8 0-1.4-.8-1.4-1.7 0-1 .6-1.7 1.4-1.7.8 0 1.4.8 1.4 1.7s-.6 1.7-1.4 1.7Zm6.2 0c-.8 0-1.4-.8-1.4-1.7 0-1 .6-1.7 1.4-1.7.8 0 1.4.8 1.4 1.7s-.6 1.7-1.4 1.7Z" />
    </svg>
  )
}

// Eliminamos "step2 · Elegís tu camino" porque era redundante con
// TwoPaths (ahi se materializa la decision real). El step solo
// anunciaba que despues vas a elegir, sin que el usuario haga nada.
// La logica de coloreo (index < 2 azul, < 4 mid, sino teal) sigue
// distribuyendo bien con 5 pasos: 0-1 azul, 2-3 mid, 4 teal.
const steps = [
  { icon: Users, key: "step1" }, // Canal de novedades
  { icon: Rocket, key: "step3" }, // Kickstart
  { icon: Send, key: "stepComunidad" }, // Comunidad
  { icon: GraduationCap, key: "step4" }, // Nivel Avanzado
  { icon: Crown, key: "step5" }, // Inner Circle
]

type ProtocolProps = {
  innerCirclePrice?: number
}

const DEFAULT_INNER_CIRCLE_PRICE = 399

function formatUsd(value: number) {
  return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)} USD`
}

export function Protocol({ innerCirclePrice: _innerCirclePrice }: ProtocolProps = {}) {
  const { t } = useLanguage()
  const telegramUrl = "https://t.me/+-J9qtCZnY7xiOWQx"
  const discordUrl = "https://discord.gg/TrrMKxnP3k"
  const instagramUrl = "https://www.instagram.com/flowdexx_/"

  function renderStepDesc(stepKey: string) {
    return t(`protocol.${stepKey}.desc`)
  }

  return (
    <section className="section-divider-smooth py-16 sm:py-32 bg-[#0A0A0A] relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5BB8D4]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7DD4C0]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          {...fadeUpProps}
          className="type-display-lg text-center text-white mb-16"
        >
          {t("protocol.title")}
        </motion.h2>

        {/* Timeline - Desktop */}
        <motion.div
          className="hidden lg:flex items-start justify-between relative"
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {/* Connecting Line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-[#5BB8D4] via-[#6CC4CA] to-[#7DD4C0]" />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.key}
                variants={fadeUp}
                className="flex flex-col items-center text-center relative z-10 w-36"
              >
                {/* Icon Circle */}
                <div className="w-16 h-16 rounded-full bg-[#111111] border border-[#2A2A2A] flex items-center justify-center mb-4 relative">
                  <Icon
                    size={24}
                    className={
                      index < 2
                        ? "text-[#5BB8D4]"
                        : index < 4
                        ? "text-[#6CC4CA]"
                        : "text-[#7DD4C0]"
                    }
                  />
                  {/* Step Number */}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-xs flex items-center justify-center text-[#888888]">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  {t(`protocol.${step.key}.title`)}
                </h3>
                <p className="text-xs text-[#888888] leading-relaxed">
                  {renderStepDesc(step.key)}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Timeline - Mobile/Tablet */}
        <motion.div
          className="lg:hidden flex flex-col gap-6"
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.key}
                variants={fadeUp}
                className="flex items-start gap-4"
              >
                {/* Left Line */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#111111] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                    <Icon
                      size={20}
                      className={
                        index < 2
                          ? "text-[#5BB8D4]"
                          : index < 4
                          ? "text-[#6CC4CA]"
                          : "text-[#7DD4C0]"
                      }
                    />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-8 bg-gradient-to-b from-[#5BB8D4]/50 to-[#7DD4C0]/50 mt-2" />
                  )}
                </div>
                {/* Content */}
                <div className="pt-2">
                  <span className="text-xs text-[#888888] mb-1 block">
                    Paso {index + 1}
                  </span>
                  <h3 className="text-base font-semibold text-white mb-1">
                    {t(`protocol.${step.key}.title`)}
                  </h3>
                  <p className="text-sm text-[#888888]">
                    {renderStepDesc(step.key)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#7DD4C0]/35 bg-[#7DD4C0]/10 px-4 py-2.5 text-sm font-medium text-[#9EDDEA] transition-colors hover:border-[#7DD4C0]/60 hover:text-[#C3F4E8]"
          >
            <Send size={16} />
            <span>{t("protocol.telegramCta")}</span>
          </a>
          <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#7289DA]/35 bg-[#7289DA]/10 px-4 py-2.5 text-sm font-medium text-[#B9C6FF] transition-colors hover:border-[#7289DA]/60 hover:text-[#D5DEFF]"
          >
            <DiscordIcon className="size-4" />
            <span>{t("protocol.discordCta")}</span>
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#E1306C]/35 bg-[#E1306C]/10 px-4 py-2.5 text-sm font-medium text-[#F5A8C5] transition-colors hover:border-[#E1306C]/60 hover:text-[#FACDD9]"
          >
            <Instagram size={16} />
            <span>{t("protocol.instagramCta")}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
