"use client"

import { m as motion } from "framer-motion"
import { fadeUpProps } from "@/lib/motion"
import { OrbitalIcon } from "./OrbitalIcon"

export function FilosofiaSneakPeek() {
  return (
    <section className="section-divider-smooth py-20 sm:py-28 bg-[#080808] relative overflow-hidden">
      {/* Orbital decorativo de fondo */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <OrbitalIcon size={620} animate={false} />
      </div>

      {/* Glows sutiles */}
      <div className="pointer-events-none absolute top-1/2 left-[10%] h-72 w-72 -translate-y-1/2 rounded-full bg-[#D4B86A]/[0.04] blur-[140px]" />
      <div className="pointer-events-none absolute top-1/2 right-[10%] h-72 w-72 -translate-y-1/2 rounded-full bg-[#7DD4C0]/[0.04] blur-[140px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div {...fadeUpProps}>
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.28em] text-[#D4B86A]">
            Desde la filosofía Flowdex
          </p>

          <blockquote className="type-display-md text-white">
            <span className="text-[#D4B86A]">&ldquo;</span>
            La formación seria toma tiempo.
            <br className="hidden sm:block" />{" "}
            <span className="text-[#7DD4C0]">Eso es un hecho, no una opinión.</span>
            <span className="text-[#D4B86A]">&rdquo;</span>
          </blockquote>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-[#888888] sm:text-base">
            Eso explica todo lo que hacemos. Y todo lo que no.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
