"use client"

import { m as motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useLanguage } from "@/lib/language-context"
import { fadeUpProps } from "@/lib/motion"
import { OrbitalIcon } from "./OrbitalIcon"

export function FAQ() {
  const { t } = useLanguage()

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
  ]

  return (
    <section className="section-divider-smooth relative overflow-hidden py-16 sm:py-20 bg-[#0E0E0E]">
      {/* Glows ambientales sutiles */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[20%] h-56 w-56 rounded-full bg-[#5BB8D4]/6 blur-[110px]" />
        <div className="absolute right-[10%] bottom-[15%] h-64 w-64 rounded-full bg-[#7DD4C0]/6 blur-[120px]" />
      </div>

      {/* Orbital decorativo */}
      <div className="pointer-events-none absolute -bottom-12 -right-12 z-0 hidden opacity-[0.07] lg:block">
        <OrbitalIcon size={220} animate={false} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUpProps}
          className="text-center mb-10"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-3">
            Para que no quede ninguna duda
          </p>
          <h2 className="type-display-md text-white">
            {t("faq.title")}
          </h2>
        </motion.div>

        <motion.div {...fadeUpProps}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-xl px-4 sm:px-5 border border-white/8 transition-colors duration-200 hover:border-[#7DD4C0]/30 data-[state=open]:border-[#D4B86A]/30"
              >
                <AccordionTrigger className="text-left text-white hover:text-[#7DD4C0] hover:no-underline py-4 text-sm sm:text-base [&[data-state=open]>svg]:text-[#D4B86A] [&[data-state=closed]>svg]:text-[#7DD4C0] [&>svg]:transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#A8A8A8] pb-4 text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
