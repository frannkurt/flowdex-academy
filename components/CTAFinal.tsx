"use client"

import { m as motion } from "framer-motion"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { fadeUpProps } from "@/lib/motion"
import { OrbitalIcon } from "./OrbitalIcon"

export function CTAFinal() {
  const { t } = useLanguage()

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id)
    if (element) {
      const NAVBAR_OFFSET = 80
      const top = element.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <section className="section-divider-smooth py-24 sm:py-32 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background orbital — fijo (sin rotación) para bajar el "movimiento
          ambient" de la home. El de arriba en el Hero sigue girando para que
          el primer contacto tenga vida; este de abajo queda institucional. */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <OrbitalIcon size={800} animate={false} />
      </div>

      {/* Gradient accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5BB8D4]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7DD4C0]/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          {...fadeUpProps}
          className="flex flex-col items-center gap-8"
        >
          {/* Línea degradada superior branding */}
          <div className="w-32 h-1 mb-2 bg-gradient-to-r from-[#5BB8D4]/70 via-[#7DD4C0]/50 to-transparent opacity-80 mx-auto rounded-full" />
          {/* Title */}
          <h2 className="type-display-lg text-white">
            {t("ctaFinal.title")}
          </h2>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-[#888888] max-w-2xl">
            {t("ctaFinal.subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            {/* Primary apunta a /por-donde-empezar (RouteSelector) en lugar
                del IC: el IC requiere prerequisitos (Expert o Trading Lab),
                asi que para un visitante nuevo que llega al footer era un
                callejon sin salida. El RouteSelector resuelve mejor el
                problema de "no se por donde empezar". Cambio derivado de
                la auditoria GAP_UNICORNIO 2026-05. */}
            <Link
              href="/por-donde-empezar"
              className="inline-flex items-center justify-center px-9 py-4 text-base font-semibold text-[#0A0A0A] rounded-xl shadow-[0_12px_32px_rgba(91,184,212,0.32)] transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)",
              }}
            >
              {t("ctaFinal.primary")}
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection("#programas")}
              className="inline-flex items-center justify-center px-7 py-4 text-base font-medium rounded-xl border border-[#2A2A2A] text-[#CCCCCC] hover:border-[#7DD4C0]/50 hover:text-white transition-all duration-300"
            >
              {t("ctaFinal.secondary")}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
