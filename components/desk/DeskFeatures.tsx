"use client"

import { useEffect, useRef } from "react"
import { m as motion } from "framer-motion"
import {
  Users,
  Gauge,
  ShieldCheck,
  Map,
  History,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react"
import { fadeUpProps, staggerParent, fadeUp, viewport } from "@/lib/motion"
import { deskLanding } from "@/lib/content/desk-landing"
import { track } from "./track"

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  gauge: Gauge,
  shield: ShieldCheck,
  map: Map,
  history: History,
  layout: LayoutGrid,
}

export function DeskFeatures() {
  const c = deskLanding.features
  const ref = useRef<HTMLElement>(null)

  // Evento de sección vista (una sola vez) para medir hasta dónde llegan.
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          track("desk_features_section_view")
          obs.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUpProps} className="mb-12 text-center">
          <p className="mb-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#5BB8D4]">▸ {c.eyebrow}</p>
          <h2 className="type-display-md text-white">{c.title}</h2>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5"
        >
          {c.items.map((f) => {
            const Icon = ICONS[f.icon] ?? LayoutGrid
            return (
              <motion.div
                key={f.id}
                variants={fadeUp}
                className="rounded-[4px] border border-[#262626] bg-[#0d0d0d] px-5 py-6 transition-colors duration-200 hover:border-[#5BB8D4]/60 sm:px-6"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[3px] border border-[#262626] bg-[#171717]">
                  <Icon className="h-5 w-5 text-[#5BB8D4]" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A8A8A8]">{f.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
