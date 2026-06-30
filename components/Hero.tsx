"use client"

import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { OrbitalIcon } from "./OrbitalIcon"

// Stat numérico formateado del Hero. Antes se llamaba AnimatedCounter pero
// no animaba nada. Nombre corregido para no inducir a error.
function HeroStat({ target, suffix = "" }: { target: number; suffix?: string }) {
  return (
    <span className="font-[var(--font-mono)] text-2xl sm:text-3xl font-bold gradient-text leading-none">
      {target.toLocaleString()}
      {suffix}
    </span>
  )
}

export function Hero() {
  const { t } = useLanguage()

  const scrollToPrograms = () => {
    const element = document.querySelector("#programas")
    if (element) {
      // Compensamos la altura del navbar sticky para que la sección destino
      // no quede oculta detrás del navbar. Mismo patrón que en TwoPaths,
      // Navbar y CTAFinal.
      const NAVBAR_OFFSET = 80
      const top = element.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20 pb-12"
    >
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 mesh-gradient" />

      {/* Orbital de fondo. En mobile va más chico y SIN animar: un orbital de
          600px rotando + blur arriba del fold competía con el LCP y hacía
          trabajar al compositor en cada scroll. En desktop se mantiene igual.
          Las dos instancias se alternan por display (sm:), así la versión
          animada ni se monta visible en mobile (CSS pausa la animación en
          display:none) y no se pinta a 600px. */}
      {/* En mobile NO renderizamos el orbital de fondo: aunque es decorativo
          (opacity-10), al ser un <img> grande Lighthouse lo elegía como
          elemento LCP, y eso clavaba el LCP en ~4s. Sin la imagen, el LCP cae
          al texto del h1 (pinta a ~FCP). En desktop se mantiene igual. */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 hidden sm:block">
        <OrbitalIcon size={600} animate priority />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="hero-enter flex flex-col items-center gap-8">
          {/* Main Title */}
          <h1 className="type-display-hero text-white max-w-5xl text-balance">
            {t("hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-lg sm:text-xl text-[#888888] leading-relaxed text-pretty">
            {t("hero.subtitle")}
          </p>

          {/* CTAs */}
          <div className="mt-4 flex flex-col items-center gap-3">
            <button
              onClick={scrollToPrograms}
              className="rounded-xl px-10 py-4 text-base font-semibold text-[#0A0A0A] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#5BB8D4]/20"
              style={{
                background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)",
              }}
            >
              {t("hero.cta")}
            </button>
            {/* Anchor de autoridad pre-fold: reemplaza al link chico "Track
                record verificable" que pasaba desapercibido (text-xs #666).
                Lo elevamos a mini-bloque visible con icono + dato concreto
                ("46 evaluaciones aprobadas en el último año") para resolver
                la brecha de proof architecture detectada en la auditoria
                GAP_UNICORNIO 2026-05. El total 46 sale de la suma de
                propFirms[].count en /track-record (MFFU 34 + Topstep 5 +
                Apex 5 + Tradeify 1 + Lucid 1). Si cambia, actualizar aca. */}
            <Link
              href="/track-record"
              className="group mt-1 inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-[#7DD4C0]/25 bg-[#7DD4C0]/[0.05] px-4 py-2 text-[11px] text-[#A8DACE] transition-all duration-200 hover:border-[#7DD4C0]/55 hover:bg-[#7DD4C0]/[0.09] hover:text-[#DDF7F1] sm:text-xs"
            >
              <ShieldCheck size={13} className="shrink-0 text-[#7DD4C0]" aria-hidden="true" />
              <span className="font-medium">Track record verificable</span>
              <span className="text-[#5F8B85]" aria-hidden="true">·</span>
              <span className="hidden sm:inline">46 evaluaciones aprobadas en el último año</span>
              <span className="sm:hidden">46 evaluaciones aprobadas</span>
              <ArrowRight size={11} className="shrink-0 text-[#7DD4C0] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Stats */}
          <div
            className="hero-enter-delayed mt-8 grid w-full max-w-2xl grid-cols-3 gap-3 border-t border-[#2A2A2A] pt-7 sm:mt-12 sm:gap-4 sm:pt-10"
          >
            <div className="flex flex-col items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-4.5">
              <HeroStat target={2} />
              <span className="text-[11px] text-[#888888] uppercase tracking-[0.18em] sm:text-xs sm:tracking-wider">
                {t("hero.stat1")}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-4.5">
              <HeroStat target={5} />
              <span className="text-[11px] text-[#888888] uppercase tracking-[0.18em] sm:text-xs sm:tracking-wider">
                {t("hero.stat2")}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-4.5">
              <HeroStat target={37} />
              <span className="text-[11px] text-[#888888] uppercase tracking-[0.18em] sm:text-xs sm:tracking-wider">
                {t("hero.stat3")}
              </span>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
