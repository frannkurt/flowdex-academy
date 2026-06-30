"use client"

import { m as motion } from "framer-motion"
import { TrendingUp, BarChart3 } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { fadeUpProps, slideInLeftProps, slideInRightProps } from "@/lib/motion"

export function TwoPaths() {
  const { t } = useLanguage()

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id)
    if (element) {
      // Compensamos la altura del navbar sticky (~80px) para que el target
      // quede alineado al inicio visible, no oculto detrás del navbar.
      const NAVBAR_OFFSET = 80
      const top = element.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <section
      id="programas"
      className="section-divider-smooth relative overflow-hidden bg-gradient-to-b from-[#0B0C0D] via-[#111111] to-[#0B0C0D] py-14 sm:py-24"
    >
      {/* Blend transitions with neighboring dark sections */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0A0A0A] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

      {/* Background decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-[#2A2A2A] to-transparent" />
      </div>

      <div className="pointer-events-none absolute -left-24 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-[#5BB8D4]/6 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-[#7DD4C0]/6 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          {...fadeUpProps}
          className="mb-12 text-center type-display-lg text-white"
        >
          {t("paths.title")}
        </motion.h2>

        <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 lg:gap-6">

          {/* Investment Path */}
          <motion.div {...slideInLeftProps} className="group">
            <div className="relative h-full overflow-hidden glass-card rounded-2xl border-l-4 border-[#5BB8D4] p-7 transition-all duration-300 hover:border-[#5BB8D4]/80 hover:bg-[#111111]/90 lg:p-8 flex flex-col">
              <div className="pointer-events-none absolute right-0 inset-y-0 hidden w-[42%] overflow-hidden opacity-[0.14] md:block">
                <div className="absolute -right-[145px] top-1/2 h-[290px] w-[290px] -translate-y-1/2">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-wezMvzAr3Fzh5ipueR6RLesjCBS8sf.png"
                    alt=""
                    fill
                    sizes="290px"
                    className="object-contain"
                    style={{ filter: "drop-shadow(0 0 24px rgba(91, 184, 212, 0.25))" }}
                  />
                </div>
              </div>
              <div className="mb-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#5BB8D4]/10 flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-[#5BB8D4]" />
                </div>
                <h3 className="type-display-sm text-white">
                  {t("paths.investment")}
                </h3>
              </div>

              <p className="mb-6 text-lg leading-relaxed text-[#888888]">
                {t("paths.investmentDesc")}
              </p>

              <div className="mt-auto flex flex-col gap-3">
                <button
                  onClick={() => scrollToSection("#kickstart-investment")}
                  className="w-full py-3 px-6 text-sm font-medium text-white bg-[#5BB8D4]/10 border border-[#5BB8D4]/30 rounded-lg hover:bg-[#5BB8D4]/20 hover:border-[#5BB8D4]/50 transition-all"
                >
                  Kickstart Investment · Conocer más
                </button>
                <button
                  onClick={() => scrollToSection("#expert-investment")}
                  className="w-full py-3 px-6 text-sm font-medium text-[#0A0A0A] rounded-lg transition-all hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, #5BB8D4, #5BB8D4CC)",
                  }}
                >
                  Expert Investment · Conocer más
                </button>
              </div>
            </div>
          </motion.div>

          {/* Trading Path */}
          <motion.div {...slideInRightProps} className="group">
            <div className="relative h-full overflow-hidden glass-card rounded-2xl border-l-4 border-[#7DD4C0] p-7 transition-all duration-300 hover:border-[#7DD4C0]/80 hover:bg-[#111111]/90 lg:p-8 flex flex-col">
              <div className="pointer-events-none absolute left-0 inset-y-0 hidden w-[42%] overflow-hidden opacity-[0.14] md:block">
                <div className="absolute -left-[145px] top-1/2 h-[290px] w-[290px] -translate-y-1/2">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-wezMvzAr3Fzh5ipueR6RLesjCBS8sf.png"
                    alt=""
                    fill
                    sizes="290px"
                    className="object-contain"
                    style={{ filter: "drop-shadow(0 0 24px rgba(125, 212, 192, 0.25))" }}
                  />
                </div>
              </div>
              <div className="mb-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#7DD4C0]/10 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-[#7DD4C0]" />
                </div>
                <h3 className="type-display-sm text-white">
                  {t("paths.trading")}
                </h3>
              </div>

              <p className="mb-6 text-lg leading-relaxed text-[#888888]">
                {t("paths.tradingDesc")}
              </p>

              <div className="mt-auto flex flex-col gap-3">
                <button
                  onClick={() => scrollToSection("#kickstart-trading")}
                  className="w-full py-3 px-6 text-sm font-medium text-white bg-[#7DD4C0]/10 border border-[#7DD4C0]/30 rounded-lg hover:bg-[#7DD4C0]/20 hover:border-[#7DD4C0]/50 transition-all"
                >
                  Kickstart Trading · Conocer más
                </button>
                <button
                  onClick={() => scrollToSection("#trading-lab")}
                  className="w-full py-3 px-6 text-sm font-medium text-[#0A0A0A] rounded-lg transition-all hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, #7DD4C0, #7DD4C0CC)",
                  }}
                >
                  Trading Lab · Conocer más
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
