"use client"

import { m as motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { fadeUpProps } from "@/lib/motion"
import { deskLanding } from "@/lib/content/desk-landing"
import { track } from "./track"

export function DeskFAQ() {
  const c = deskLanding.faq
  return (
    <section className="relative overflow-hidden bg-[#0E0E0E] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] bottom-[12%] h-56 w-56 rounded-full bg-[#5BB8D4]/6 blur-[110px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUpProps} className="mb-10 text-center">
          <p className="mb-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#5BB8D4]">▸ {c.eyebrow}</p>
          <h2 className="type-display-md text-white">{c.title}</h2>
        </motion.div>

        <motion.div {...fadeUpProps}>
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
            onValueChange={(v) => {
              if (!v) return
              const idx = Number(String(v).replace("item-", ""))
              const q = c.items[idx]?.question
              if (q) track("desk_faq_expand", { question: q })
            }}
          >
            {c.items.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="rounded-[4px] border border-[#262626] bg-[#0d0d0d] px-4 transition-colors duration-200 hover:border-[#5BB8D4]/50 data-[state=open]:border-[#5BB8D4]/50 sm:px-5"
              >
                <AccordionTrigger className="min-h-12 py-4 text-left text-sm text-white hover:text-[#5BB8D4] hover:no-underline sm:text-base [&>svg]:text-[#5BB8D4]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-[#A8A8A8]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
