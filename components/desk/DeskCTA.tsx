"use client"

import Link from "next/link"
import { m as motion } from "framer-motion"
import { fadeUpProps } from "@/lib/motion"
import { deskLanding } from "@/lib/content/desk-landing"
import { track } from "./track"

export function DeskCTA() {
  const c = deskLanding.finalCta
  return (
    <section id="desk-final" className="relative overflow-hidden py-24 sm:py-32">
      {/* Acentos de gradiente, mismo lenguaje que el cierre de la home */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#5BB8D4]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#7DD4C0]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div {...fadeUpProps} className="flex flex-col items-center gap-6">
          <p className="font-mono text-[11px] tracking-[0.12em] text-[#6e6e6e]">
            <span className="text-[#5BB8D4]">$</span> flowdex desk <span className="text-[#D4B86A]">--iniciar</span>
          </p>
          <h2 className="type-display-lg text-white">{c.headline}</h2>
          <p className="text-base text-[#888888] sm:text-lg">{c.subheadline}</p>
          <Link
            href={c.ctaHref}
            onClick={() => track("desk_final_cta_click")}
            className="inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-gradient-to-r from-[#5BB8D4] to-[#7DD4C0] px-10 py-4 text-base font-semibold text-[#0A0A0A] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#5BB8D4]/20 sm:w-auto"
          >
            {c.ctaText}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
