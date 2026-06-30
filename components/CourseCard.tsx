"use client"

import { m as motion } from "framer-motion"
import { ChevronDown, Check, Target } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { OrbitalIcon } from "./OrbitalIcon"
import { isGrouped, type SyllabusContent } from "@/lib/courses/landing-syllabus"

interface CourseCardProps {
  id: string
  logo?: string
  logoAlt?: string
  title: string
  description: string
  outcomes30Days?: string[]
  masteryCriterion?: string
  notFor?: string
  price: string
  badge: "initial" | "advanced"
  accentColor: "blue" | "teal"
  syllabus: SyllabusContent
  ctaLink: string
  mentor?: string
  discountNote?: string
}

export function CourseCard({
  id,
  logo,
  logoAlt,
  title,
  description,
  outcomes30Days,
  masteryCriterion,
  notFor,
  price,
  badge,
  accentColor,
  syllabus,
  ctaLink,
  mentor,
  discountNote,
}: CourseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useLanguage()

  const colorClasses = {
    blue: {
      accent: "#5BB8D4",
      bg: "bg-[#5BB8D4]/10",
      border: "border-[#5BB8D4]/30",
      text: "text-[#5BB8D4]",
      gradient: "linear-gradient(135deg, #5BB8D4, #5BB8D4CC)",
    },
    teal: {
      accent: "#7DD4C0",
      bg: "bg-[#7DD4C0]/10",
      border: "border-[#7DD4C0]/30",
      text: "text-[#7DD4C0]",
      gradient: "linear-gradient(135deg, #7DD4C0, #7DD4C0CC)",
    },
  }

  const colors = colorClasses[accentColor]

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card relative rounded-2xl overflow-hidden"
    >
      {!logo && (
        <div
          className={`pointer-events-none absolute -bottom-14 z-0 hidden opacity-[0.11] lg:block ${
            accentColor === "blue" ? "-right-14" : "-left-14"
          }`}
        >
          <OrbitalIcon size={168} animate={false} />
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Logo Section */}
        {logo && (
          <div className="lg:w-2/5 p-8 lg:p-12 flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#111111]">
            <div className="relative w-full max-w-[280px] aspect-square">
              <Image
                src={logo}
                alt={logoAlt ?? ""}
                fill
                className={`object-contain ${
                  id !== "inner-circle"
                    ? "filter invert mix-blend-screen opacity-90"
                    : "mix-blend-screen opacity-95"
                }`}
              />
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className={`${logo ? "lg:w-3/5" : "w-full"} p-6 lg:p-8 flex flex-col`}>
          {!logo ? (
            /* Two-column layout when no logo */
            <div className="flex flex-col lg:flex-row gap-6 h-full">
              {/* Left: comercial puro (badge, título, mentor, descripción, notFor, precio, CTAs) */}
              <div className="lg:w-1/2 flex flex-col">
                <span className={`inline-flex self-start px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full ${colors.bg} ${colors.text} mb-3`}>
                  {badge === "initial" ? t("course.initial") : t("course.advanced")}
                </span>
                <h3 className=" text-xl sm:text-2xl text-white mb-2">{title}</h3>
                {mentor && (
                  <p className="text-[13px] text-[#888888] mb-3">
                    <span className="text-white">{mentor}</span>
                  </p>
                )}
                <p className="text-[15px] text-[#888888] leading-relaxed mb-4">{description}</p>
                {notFor && (
                  <p className="mb-3 text-[13px] text-[#A7A7A7] leading-snug">
                    <span className="font-semibold text-[#D0D0D0]">No es para vos si:</span> {notFor}
                  </p>
                )}
                {masteryCriterion && (
                  <div className="mb-3 flex items-start gap-2.5 rounded-lg border border-white/10 bg-black/30 p-3">
                    <Target size={15} className={`${colors.text} mt-0.5 flex-shrink-0`} />
                    <div>
                      <p className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${colors.text}`}>
                        Sabés que lo lográs cuando
                      </p>
                      <p className="text-[13px] leading-snug text-[#D2E2E6]">{masteryCriterion}</p>
                    </div>
                  </div>
                )}
                <div className="mt-auto space-y-3">
                  <div className="inline-flex items-baseline gap-2">
                    <span
                      className="font-[var(--font-mono)] text-[28px] font-bold tabular-nums leading-none"
                      style={{ color: colors.accent }}
                    >
                      {price}
                    </span>
                    <span className="text-[13px] text-[#888888] leading-none">USD</span>
                  </div>
                  {discountNote && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                      <span className="text-base">🎓</span>
                      <p className={`text-[13px] font-medium ${colors.text}`}>{discountNote}</p>
                    </div>
                  )}
                  <Link href={ctaLink}
                    className="w-full py-3.5 px-5 flex items-center justify-center text-[15px] font-bold text-[#0A0A0A] rounded-lg transition-all hover:scale-[1.02] tracking-wide hover:[box-shadow:0_0_36px_var(--cta-glow-hover),0_6px_24px_var(--cta-glow-base)]"
                    style={{
                      background: colors.gradient,
                      boxShadow: `0 0 22px ${colors.accent}40, 0 4px 16px ${colors.accent}33`,
                      "--cta-glow-base": `${colors.accent}55`,
                      "--cta-glow-hover": `${colors.accent}80`,
                    } as React.CSSProperties}>
                    {t("course.enroll")}
                  </Link>
                  <a
                    href="#mentors"
                    className={`block text-center text-xs ${colors.text} opacity-70 hover:opacity-100 transition-opacity`}
                  >
                    Quiénes dirigen el programa →
                  </a>
                </div>
              </div>

              {/* Right: info pedagógica (Qué te llevás + Temario) */}
              <div className="lg:w-1/2 flex flex-col gap-3">
                {outcomes30Days && outcomes30Days.length > 0 && (
                  <div className={`rounded-lg border ${colors.border} ${colors.bg} p-3.5`}>
                    <p className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${colors.text}`}>
                      Qué te llevás
                    </p>
                    <ul className="space-y-1.5">
                      {outcomes30Days.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-[13px] text-[#D2E2E6] leading-snug">
                          <span className={`${colors.text} mt-0.5`}>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className={`flex-1 p-4 lg:p-5 rounded-xl ${colors.bg} border ${colors.border} flex flex-col justify-center`}>
                  <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${colors.text} mb-4 text-center`}>{t("course.syllabus")}</p>
                  {isGrouped(syllabus) ? (
                    <div className="space-y-3.5">
                      {syllabus.map((group, gi) => (
                        <div key={gi}>
                          <p className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${colors.text} opacity-80`}>
                            {group.title}
                          </p>
                          <ul className="space-y-1.5">
                            {group.items.map((item, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check size={14} className={`flex-shrink-0 mt-[3px] ${colors.text}`} />
                                <span className="text-[13px] text-[#D8D8D8] leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {syllabus.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check size={15} className={`flex-shrink-0 mt-[3px] ${colors.text}`} />
                          <span className="text-[13px] text-[#D8D8D8] leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Original layout with logo */
            <>
              <span className={`inline-flex self-start px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ${colors.bg} ${colors.text} mb-4`}>
                {badge === "initial" ? t("course.initial") : t("course.advanced")}
              </span>
              <h3 className=" text-2xl sm:text-3xl text-white mb-3">{title}</h3>
              {mentor && (
                <p className="text-sm text-[#888888] mb-4">
                  <span className="text-white">{mentor}</span>
                </p>
              )}
              <p className="text-[#888888] leading-relaxed mb-6">{description}</p>
              {outcomes30Days && outcomes30Days.length > 0 && (
                <div className={`mb-4 rounded-lg border ${colors.border} ${colors.bg} p-4`}>
                  <p className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${colors.text}`}>
                    Qué te llevás
                  </p>
                  <ul className="space-y-1.5">
                    {outcomes30Days.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-[#D2E2E6]">
                        <span className={`${colors.text} mt-0.5`}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {masteryCriterion && (
                <div className="mb-4 flex items-start gap-3 rounded-lg border border-white/10 bg-black/30 p-4">
                  <Target size={16} className={`${colors.text} mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${colors.text}`}>
                      Sabés que lo lográs cuando
                    </p>
                    <p className="text-sm leading-relaxed text-[#D2E2E6]">{masteryCriterion}</p>
                  </div>
                </div>
              )}
              {notFor && (
                <p className="mb-4 text-sm text-[#A7A7A7] leading-relaxed">
                  <span className="font-semibold text-[#D0D0D0]">No es para vos si:</span> {notFor}
                </p>
              )}
              <div className="inline-flex items-baseline gap-2 mb-4 mx-auto">
                <span
                  className="font-[var(--font-mono)] text-3xl font-bold tabular-nums leading-none"
                  style={{ color: colors.accent }}
                >
                  {price}
                </span>
                <span className="text-sm text-[#888888] leading-none">USD</span>
              </div>
              {discountNote && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${colors.bg} border ${colors.border} mb-6`}>
                  <span className="text-lg">🎓</span>
                  <p className={`text-sm font-medium ${colors.text}`}>{discountNote}</p>
                </div>
              )}
              <button onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-2 text-sm font-medium ${colors.text} mb-4 hover:opacity-80 transition-opacity`}>
                <ChevronDown size={18} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                {t("course.syllabus")}
              </button>
              <motion.div initial={false} animate={{ height: isExpanded ? "auto" : 0 }} className="overflow-hidden">
                {isGrouped(syllabus) ? (
                  <div className="space-y-4 pb-6">
                    {syllabus.map((group, gi) => (
                      <div key={gi}>
                        <p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${colors.text} opacity-80`}>
                          {group.title}
                        </p>
                        <ul className="space-y-2">
                          {group.items.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Check size={16} className={`mt-0.5 flex-shrink-0 ${colors.text}`} />
                              <span className="text-sm text-[#888888]">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2 pb-6">
                    {syllabus.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check size={16} className={`mt-0.5 flex-shrink-0 ${colors.text}`} />
                        <span className="text-sm text-[#888888]">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
              <div className="mt-auto">
                <Link href={ctaLink}
                  className="w-full py-4 px-6 flex items-center justify-center text-base font-bold text-[#0A0A0A] rounded-lg transition-all hover:scale-[1.02] tracking-wide hover:[box-shadow:0_0_36px_var(--cta-glow-hover),0_6px_24px_var(--cta-glow-base)]"
                  style={{
                    background: colors.gradient,
                    boxShadow: `0 0 22px ${colors.accent}40, 0 4px 16px ${colors.accent}33`,
                    "--cta-glow-base": `${colors.accent}55`,
                    "--cta-glow-hover": `${colors.accent}80`,
                  } as React.CSSProperties}>
                  {t("course.enroll")}
                </Link>
                <a
                  href="#mentors"
                  className={`block text-center text-xs ${colors.text} opacity-70 hover:opacity-100 transition-opacity pt-3`}
                >
                  Quiénes dirigen el programa →
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
