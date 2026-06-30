"use client"

import { m as motion } from "framer-motion"
import { fadeUpProps, staggerParent, fadeUp, viewport } from "@/lib/motion"
import { deskLanding } from "@/lib/content/desk-landing"

export function DeskProblem() {
  const c = deskLanding.problem
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUpProps} className="mb-10 text-center">
          <p className="mb-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#5BB8D4]">▸ {c.eyebrow}</p>
          <h2 className="type-display-md text-white">{c.title}</h2>
        </motion.div>

        <motion.ul
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="space-y-4"
        >
          {c.scenarios.map((s) => (
            <motion.li
              key={s.slice(0, 24)}
              variants={fadeUp}
              className="flex gap-3 rounded-[4px] border border-[#262626] bg-[#0d0d0d] px-5 py-4 text-sm leading-relaxed text-[#C9C9C9] sm:px-6 sm:py-5 sm:text-base"
            >
              <span className="select-none font-mono font-bold text-[#D4B86A]">›</span>
              <span>{s}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
