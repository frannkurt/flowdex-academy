"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { m as motion } from "framer-motion"
import { fadeUpProps } from "@/lib/motion"
import { deskLanding } from "@/lib/content/desk-landing"
import { DeskMiniDemo } from "./DeskMiniDemo"
import { track } from "./track"

export function DeskHero() {
  const c = deskLanding.hero
  const ctaRef = useRef<HTMLDivElement>(null)
  const [showSticky, setShowSticky] = useState(false)

  // CTA sticky mobile: aparece cuando el CTA del hero salió del viewport y se
  // oculta cuando el cierre final (#desk-final) entra en pantalla.
  useEffect(() => {
    const hero = ctaRef.current
    const final = document.getElementById("desk-final")
    let heroVisible = true
    let finalVisible = false
    const update = () => setShowSticky(!heroVisible && !finalVisible)
    const obsHero = new IntersectionObserver(([e]) => {
      heroVisible = e.isIntersecting
      update()
    })
    const obsFinal = new IntersectionObserver(([e]) => {
      finalVisible = e.isIntersecting
      update()
    })
    if (hero) obsHero.observe(hero)
    if (final) obsFinal.observe(final)
    return () => {
      obsHero.disconnect()
      obsFinal.disconnect()
    }
  }, [])

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Glows ambientales, mismo lenguaje que la home */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-[#5BB8D4]/8 blur-[130px]" />
        <div className="absolute right-[6%] bottom-[8%] h-80 w-80 rounded-full bg-[#7DD4C0]/8 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        {/* Columna de texto */}
        <motion.div {...fadeUpProps} className="text-center lg:text-left">
          <p className="mb-4 font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#5BB8D4]">▸ {c.eyebrow}</p>
          <h1 className="type-display-lg text-white">{c.headline}</h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-[#A8A8A8] sm:text-lg lg:mx-0">
            {c.subheadline}
          </p>

          <div ref={ctaRef} className="mt-8 flex flex-col items-center gap-3 lg:items-start">
            <Link
              href={c.ctaHref}
              onClick={() => track("desk_hero_cta_click")}
              className="inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-gradient-to-r from-[#5BB8D4] to-[#7DD4C0] px-10 py-4 text-base font-semibold text-[#0A0A0A] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#5BB8D4]/20 sm:w-auto"
            >
              {c.ctaText}
            </Link>
            <p className="font-mono text-[10.5px] tracking-wide text-[#888888]">{c.trustSignal}</p>
            <Link
              href={c.loginHref}
              className="text-xs text-[#A8DACE] underline-offset-4 transition-colors hover:text-[#DDF7F1] hover:underline"
            >
              {c.loginText}
            </Link>
          </div>

          {/* Números reales del producto */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {deskLanding.stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 rounded-[4px] border border-[#262626] bg-[#0d0d0d] px-3 py-4 lg:items-start"
              >
                <span className="font-mono text-2xl font-bold tabular-nums text-white">{s.value}</span>
                <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.12em] text-[#6e6e6e]">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Visual: mini demo en vivo del Desk (réplica fiel del Terminal real,
            datos hardcodeados que se animan — precios, análisis y tablero) */}
        <motion.div {...fadeUpProps} className="relative">
          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-[#5BB8D4]/10 via-transparent to-[#7DD4C0]/10 blur-2xl" />
          <div className="relative">
            <DeskMiniDemo />
          </div>
        </motion.div>
      </div>

      {/* CTA sticky — solo mobile, primeras secciones */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-2 transition-all duration-300 md:hidden ${
          showSticky ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        <div className="bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent absolute inset-0 -top-6" />
        <Link
          href={c.ctaHref}
          onClick={() => track("desk_sticky_cta_click")}
          className="relative flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#5BB8D4] to-[#7DD4C0] px-6 py-4 text-base font-semibold text-[#0A0A0A] shadow-lg shadow-black/40"
        >
          {c.ctaText}
        </Link>
      </div>
    </section>
  )
}
