"use client"

import { m as motion } from "framer-motion"
import { fadeUpProps, staggerParent, fadeUp, viewport } from "@/lib/motion"
import { deskLanding } from "@/lib/content/desk-landing"

export function DeskSolution() {
  const c = deskLanding.solution
  return (
    <section className="relative overflow-hidden bg-[#0E0E0E] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[15%] top-[10%] h-56 w-56 rounded-full bg-[#7DD4C0]/6 blur-[110px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUpProps} className="mb-12 text-center">
          <p className="mb-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#5BB8D4]">▸ {c.eyebrow}</p>
          <h2 className="type-display-md text-white">{c.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-[#A8A8A8] sm:text-base">{c.description}</p>
        </motion.div>

        <motion.ol
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-4 md:grid-cols-3 md:gap-6"
        >
          {c.steps.map((step, i) => (
            <motion.li
              key={step.title}
              variants={fadeUp}
              className="relative rounded-[4px] border border-[#262626] bg-[#0d0d0d] px-5 py-6 sm:px-6"
            >
              <span className="font-mono text-xl font-bold tabular-nums text-[#5BB8D4]">0{i + 1}</span>
              <h3 className="mt-3 text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A8A8A8]">{step.text}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
