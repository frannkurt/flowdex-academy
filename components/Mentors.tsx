"use client"

import { m as motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Sparkles, ShieldCheck } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { fadeUpProps, fadeUpPropsWithDelay } from "@/lib/motion"
import { OrbitalIcon } from "./OrbitalIcon"

export function Mentors() {
  const { t } = useLanguage()

  const mentors = [
    {
      name: "Augusto Holman",
      role: t("mentors.augusto.role"),
      quote: undefined,
      focus: t("mentors.augusto.focus"),
      focus2: t("mentors.augusto.focus2"),
      prestige: t("mentors.augusto.prestige"),
      articleLabel: undefined,
      articleUrl: undefined,
      videoLabel: undefined,
      videoUrl: undefined,
      trackRecordHref: "/#kickstart-investment" as string | undefined,
      trackRecordLabel: "Ver el camino de Inversiones" as string | undefined,
      specialties: [
        t("mentors.augusto.specialty1"),
        t("mentors.augusto.specialty2"),
        t("mentors.augusto.specialty3"),
        t("mentors.augusto.specialty4"),
        t("mentors.augusto.specialty5"),
      ],
      accent: {
        line: "linear-gradient(90deg, #5BB8D4, #7AAFD8)",
        badgeBorder: "#5BB8D4",
        badgeBg: "rgba(91, 184, 212, 0.12)",
        badgeText: "#9EDDEA",
        spark: "#7DD4C0",
        chipBorder: "rgba(91, 184, 212, 0.25)",
        chipText: "#C8E5EE",
      },
      gradient: "from-[#5BB8D4] to-[#5BB8D4]/50",
      image: "/augustoblancoynegro.jpg",
      imageClassName: "object-cover object-[center_20%]",
    },
    {
      name: "Franco Escudero",
      role: t("mentors.frann.role"),
      quote: undefined,
      focus: t("mentors.frann.focus"),
      focus2: t("mentors.frann.focus2"),
      prestige: t("mentors.frann.prestige"),
      articleLabel: undefined,
      articleUrl: undefined,
      videoLabel: undefined,
      videoUrl: undefined,
      trackRecordHref: "/track-record",
      trackRecordLabel: "Ver track record verificable",
      specialties: [
        t("mentors.frann.specialty1"),
        t("mentors.frann.specialty2"),
        t("mentors.frann.specialty3"),
        t("mentors.frann.specialty4"),
        t("mentors.frann.specialty5"),
      ],
      accent: {
        line: "linear-gradient(90deg, #7DD4C0, #5BB8D4)",
        badgeBorder: "#7DD4C0",
        badgeBg: "rgba(125, 212, 192, 0.12)",
        badgeText: "#B8EBDD",
        spark: "#5BB8D4",
        chipBorder: "rgba(125, 212, 192, 0.25)",
        chipText: "#D2EFE7",
      },
      gradient: "from-[#7DD4C0] to-[#7DD4C0]/50",
      image: "/francoblancoynegro.jpg",
      imageClassName: "object-cover object-[center_55%]",
    },
  ]

  return (
    <section id="mentors" className="section-divider-smooth py-24 sm:py-32 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          {...fadeUpProps}
          className="type-display-lg text-center text-white mb-16"
        >
          {t("mentors.title")}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.name}
              {...fadeUpPropsWithDelay(index * 0.2)}
              className="glass-card relative rounded-2xl overflow-hidden border border-white/8 hover:border-white/15 transition-colors"
            >
              <div className="pointer-events-none absolute -bottom-14 -right-14 z-0 hidden opacity-[0.11] lg:block">
                <OrbitalIcon size={176} animate={false} />
              </div>

              {/* Photo */}
              <div
                className={`relative h-80 sm:h-96 bg-gradient-to-br ${mentor.gradient} overflow-hidden select-none`}
                onContextMenu={(e) => e.preventDefault()}
              >
                <Image
                  src={mentor.image}
                  alt={mentor.name}
                  fill
                  className={`${mentor.imageClassName ?? "object-cover object-[center_20%]"} grayscale contrast-110 pointer-events-none`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  draggable={false}
                  quality={80}
                />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="mb-6">
                  <div className="h-[2px] w-14 rounded-full" style={{ background: mentor.accent.line }} />
                </div>

                <h3 className="type-display-sm text-white mb-2">
                  {mentor.name}
                </h3>
                <p className="text-xs uppercase tracking-[0.14em] text-[#8FA9B0] mb-6">{mentor.role}</p>

                <div className="lg:flex lg:flex-col lg:min-h-[260px]">
                  {mentor.focus && (
                    <p className="text-base leading-relaxed text-[#D2EAF1] mb-3">{mentor.focus}</p>
                  )}

                  {mentor.focus2 && (
                    <p className="text-sm leading-relaxed text-[#AFCED7] mb-5">{mentor.focus2}</p>
                  )}

                  {mentor.prestige && (
                    <div className="lg:mt-auto mb-6">
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium"
                        style={{
                          borderColor: mentor.accent.badgeBorder,
                          backgroundColor: mentor.accent.badgeBg,
                          color: mentor.accent.badgeText,
                        }}
                      >
                        <Sparkles size={12} style={{ color: mentor.accent.spark }} />
                        {mentor.prestige}
                      </div>
                    </div>
                  )}
                </div>

                {mentor.specialties && (
                  <div className="mb-6 border-t border-white/8 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {mentor.specialties.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 rounded-full text-xs bg-white/5 border leading-none"
                        style={{
                          borderColor: mentor.accent.chipBorder,
                          color: mentor.accent.chipText,
                        }}
                      >
                        {item}
                      </span>
                      ))}
                    </div>
                  </div>
                )}

                {mentor.quote && !mentor.articleUrl && (
                  <div className="rounded-lg border border-[#5BB8D4]/25 bg-[#5BB8D4]/6 px-5 py-4 mb-3">
                    <p className="text-[11px] uppercase tracking-wider text-[#7FC8DC] mb-2">Filosofía de trading</p>
                    <p className="text-sm text-[#C8E8F0] italic leading-relaxed">"{mentor.quote}"</p>
                    <p className="text-[11px] text-[#5BB8D4]/60 mt-2 text-right">— {mentor.name}</p>
                  </div>
                )}

                {mentor.articleUrl && mentor.articleLabel && (
                  <div className="rounded-lg border border-[#7DD4C0]/25 bg-[#7DD4C0]/6 px-4 py-3 mb-3">
                    <p className="text-[11px] uppercase tracking-wider text-[#94DACA] mb-1.5">
                      {t("mentors.mediaContext")}
                    </p>
                    <a
                      href={mentor.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex text-sm text-[#7ED7C3] hover:text-[#A9F0DD] underline underline-offset-4"
                    >
                      {mentor.articleLabel}
                    </a>
                  </div>
                )}

                {mentor.videoUrl && mentor.videoLabel && (
                  <div className="rounded-lg border border-[#7DD4C0]/25 bg-[#7DD4C0]/6 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wider text-[#94DACA] mb-1.5">
                      {t("mentors.videoContext")}
                    </p>
                    <a
                      href={mentor.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex text-sm text-[#7ED7C3] hover:text-[#A9F0DD] underline underline-offset-4"
                    >
                      {mentor.videoLabel}
                    </a>
                  </div>
                )}

                {mentor.trackRecordHref && (
                  <Link
                    href={mentor.trackRecordHref}
                    className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[#7DD4C0]/30 bg-[#7DD4C0]/5 px-4 py-2.5 text-sm font-medium text-[#9EDDEA] transition-colors hover:border-[#7DD4C0]/60 hover:bg-[#7DD4C0]/10 hover:text-[#C3F4E8]"
                  >
                    <ShieldCheck size={15} />
                    {mentor.trackRecordLabel ?? "Ver track record verificable"}
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
