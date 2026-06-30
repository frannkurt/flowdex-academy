"use client"

import Link from "next/link"
import { m as motion } from "framer-motion"
import { fadeUpProps } from "@/lib/motion"
import { deskLanding } from "@/lib/content/desk-landing"

export function DeskSocialProof() {
  const c = deskLanding.socialProof
  return (
    <section className="relative overflow-hidden bg-[#0E0E0E] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[12%] top-[18%] h-64 w-64 rounded-full bg-[#5BB8D4]/6 blur-[120px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div {...fadeUpProps} className="rounded-[4px] border border-[#262626] bg-[#0d0d0d] px-6 py-10 sm:px-10">
          <p className="mb-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#5BB8D4]">▸ {c.eyebrow}</p>
          <h2 className="type-display-md text-white">{c.title}</h2>
          <p className="mt-5 text-sm leading-relaxed text-[#A8A8A8] sm:text-base">{c.text}</p>
          <Link
            href={c.linkHref}
            className="mt-6 inline-flex items-center gap-2 rounded-[3px] border border-[#262626] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#6e6e6e] transition-all duration-200 hover:border-[#5BB8D4] hover:text-[#5BB8D4]"
          >
            {c.linkText} →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
