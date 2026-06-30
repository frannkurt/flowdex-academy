"use client"

import { m as motion } from "framer-motion"
import { fadeUp, fadeUpProps, fadeUpPropsWithDelay, staggerParent, viewport } from "@/lib/motion"
import { OrbitalIcon } from "./OrbitalIcon"

const dolores = [
  "Miraste 50 reels, 30 videos de YouTube, leíste decenas de PDFs y revisaste mil páginas web. Y seguís igual de perdido.",
  "Hiciste algún curso y no aprendiste.",
  "Decidís con miedo a perder o con avaricia de ganar más.",
  "Sentís que te falta algo, pero no sabés exactamente qué.",
]

export function Dolor() {
  return (
    <section className="section-divider-smooth py-10 sm:py-20 bg-[#0A0A0A] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0A0A0A] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

      {/* Orbital decorativo de fondo */}
      <div className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 opacity-[0.04] hidden md:block">
        <OrbitalIcon size={460} animate={false} />
      </div>
      <div className="pointer-events-none absolute -right-24 bottom-8 opacity-[0.03] hidden lg:block">
        <OrbitalIcon size={320} animate={false} />
      </div>

      {/* Glows sutiles en esquinas */}
      <div className="pointer-events-none absolute -top-20 left-[15%] h-72 w-72 rounded-full bg-[#5BB8D4]/[0.05] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 right-[15%] h-72 w-72 rounded-full bg-[#7DD4C0]/[0.05] blur-[120px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUpProps}>
          <h2 className="mb-8 text-center type-display-md text-white">
            ¿Reconocés algo de esto?
          </h2>

          <motion.ul
            className="mb-8 space-y-4"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {dolores.map((dolor) => (
              <motion.li
                key={dolor}
                variants={fadeUp}
                className="grid grid-cols-[1.5rem_1fr] items-baseline gap-3 text-base leading-relaxed text-[#D2D2D2] sm:text-lg"
              >
                <span className="text-[#5BB8D4] text-right">—</span>
                <span>{dolor}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            {...fadeUpPropsWithDelay(0.4)}
            className="border-t border-[#1F1F1F] pt-7 text-center"
          >
            <p className="type-headline text-white">
              Si te pasa algo de eso, no es porque seas malo.
            </p>
            <p className="mt-2 type-headline text-[#7DD4C0]">
              Es porque estás improvisando.
            </p>

            <p className="mx-auto mt-7 max-w-2xl text-sm leading-relaxed text-[#888888] sm:text-base">
              No vendemos resultados.
              <br className="hidden sm:block" />
              Enseñamos con método.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
