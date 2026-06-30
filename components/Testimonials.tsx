"use client"

import { m as motion } from "framer-motion"
import { Star } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { fadeUpProps, fadeUpPropsWithDelay } from "@/lib/motion"

export function Testimonials() {
  const { t } = useLanguage()

  const reviews = [
    {
      name: t("testimonials.review1.name"),
      role: t("testimonials.review1.role"),
      text: t("testimonials.review1.text"),
    },
    {
      name: t("testimonials.review2.name"),
      role: t("testimonials.review2.role"),
      text: t("testimonials.review2.text"),
    },
    {
      name: t("testimonials.review3.name"),
      role: t("testimonials.review3.role"),
      text: t("testimonials.review3.text"),
    },
    {
      name: t("testimonials.review4.name"),
      role: t("testimonials.review4.role"),
      text: t("testimonials.review4.text"),
    },
  ]

  return (
    <section className="section-divider-smooth py-24 sm:py-28 bg-[#090909]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUpProps}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[#79CDE3] mb-3">{t("testimonials.kicker")}</p>
          <h2 className="type-display-md text-white">
            {t("testimonials.title")}
          </h2>
          <p className="text-sm sm:text-base text-[#A8A8A8] mt-4 max-w-3xl mx-auto">{t("testimonials.subtitle")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              {...fadeUpPropsWithDelay(index * 0.1)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-7"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#7DD4C0] text-xs tracking-wide uppercase">{review.role}</p>
                <div className="flex items-center gap-0.5" role="img" aria-label="5 estrellas">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-[#F3C96B] text-[#F3C96B]" />
                  ))}
                </div>
              </div>

              <p className="text-[#D9E7EB] leading-relaxed text-sm sm:text-[15px]">"{review.text}"</p>

              <div className="mt-5 pt-4 border-t border-white/10">
                <p className="text-white font-medium text-sm">{review.name}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}