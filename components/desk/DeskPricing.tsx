"use client"

import Link from "next/link"
import { m as motion } from "framer-motion"
import { fadeUpProps, staggerParent, fadeUp, viewport } from "@/lib/motion"
import { deskLanding } from "@/lib/content/desk-landing"
import { track } from "./track"

export function DeskPricing() {
  const c = deskLanding.pricing
  return (
    <section id="desk-pricing" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUpProps} className="mb-12 text-center">
          <p className="mb-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#5BB8D4]">▸ {c.eyebrow}</p>
          <h2 className="type-display-md text-white">{c.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#A8A8A8] sm:text-base">{c.note}</p>
        </motion.div>

        {/* Mobile: stack vertical con el recomendado primero. Desktop: 3 columnas. */}
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="flex flex-col gap-4 md:grid md:grid-cols-3 md:items-stretch md:gap-5"
        >
          {[...c.plans]
            .sort((a, b) => Number(b.highlight) - Number(a.highlight))
            .map((p) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                className={`relative flex flex-col rounded-[4px] bg-[#0d0d0d] px-6 py-7 md:order-none ${
                  p.highlight
                    ? "border border-[#5BB8D4]/70 shadow-lg shadow-[#5BB8D4]/5"
                    : "border border-[#262626]"
                } ${p.id === "free" ? "md:order-first" : ""} ${p.highlight ? "md:order-last" : ""}`}
              >
                {p.highlight && "badge" in p && (
                  <span className="absolute -top-3 left-6 rounded-[3px] bg-[#5BB8D4] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]">
                    {p.badge}
                  </span>
                )}
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6e6e6e]">
                  {p.name}
                </h3>
                {/* El precio es el elemento dominante de la card */}
                <div className="mt-3 font-mono text-3xl font-bold tabular-nums text-white sm:text-4xl">{p.price}</div>
                <p className="mt-1 font-mono text-[11px] font-medium tabular-nums text-[#5BB8D4]">{p.detail}</p>
                {/* El modelo de packs nuevo no tiene `description`: listamos las features. */}
                <ul className="mt-4 flex-1 space-y-1.5 text-sm leading-relaxed text-[#A8A8A8]">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link
                  href={p.ctaHref}
                  onClick={() => track("desk_pricing_cta_click", { plan: p.id })}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-[4px] px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${
                    p.highlight
                      ? "bg-gradient-to-r from-[#5BB8D4] to-[#7DD4C0] text-[#0A0A0A] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#5BB8D4]/20"
                      : "border border-[#262626] bg-[#171717] text-white hover:border-[#5BB8D4]/60"
                  }`}
                >
                  {p.ctaText}
                </Link>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </section>
  )
}
