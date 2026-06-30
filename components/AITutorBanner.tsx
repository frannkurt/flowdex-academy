"use client"

import { m as motion } from "framer-motion"
import { BookOpen, Clock, Sparkles, Wand2 } from "lucide-react"
import { fadeUpSubtleProps } from "@/lib/motion"

// Banda horizontal que se inserta entre la fila de Inversiones y la de
// Trading dentro del grid de cursos. Layout split: a la izquierda el
// titulo principal y la descripcion del Maestro Flowdex, a la derecha
// tres mini-features que aprovechan el ancho sin parecer relleno. Cada
// bullet aporta una clarificacion concreta del feature.
//
// El hairline dorado superior es la firma silenciosa de "premium /
// transversal" que ya usamos en las cards de cursos avanzados. La
// orbita decorativa de fondo en ambos laterales mantiene el lenguaje
// visual de marca sin competir con el contenido.
export function AITutorBanner() {
  const features = [
    {
      icon: BookOpen,
      text: "Conoce los módulos, las clases y el método Flowdex.",
    },
    {
      icon: Wand2,
      text: "Te lleva al módulo y la clase donde se enseñó cada concepto.",
    },
    {
      icon: Clock,
      text: "Disponible las 24 horas para resolver tus consultas.",
    },
  ]

  return (
    <motion.div {...fadeUpSubtleProps} className="md:col-span-2">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0E1014] via-[#0B0D10] to-[#0A0B0E] px-6 py-8 sm:px-8 sm:py-8 lg:px-10">
        {/* Hairline dorado superior: firma silenciosa de "premium" /
            "transversal" coherente con las cards de nivel avanzado. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4B86A]/60 to-transparent" />

        {/* Glow central calido tenue que da un punto de gravedad
            visual al centro del banner sin meter elementos. */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-72 rounded-full bg-[#D4B86A]/[0.04] blur-[100px]" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* Columna izquierda: titulo + sub */}
          <div className="text-center lg:text-left">
            <span className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D4B86A]">
              Incluido en todos los cursos
            </span>

            <div className="mb-2 flex items-center justify-center gap-3 lg:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#5BB8D4] to-[#7DD4C0]">
                <Sparkles className="h-5 w-5 text-[#0A0A0A]" />
              </div>
              <h3 className="type-display-sm text-white">
                Tu Maestro Flowdex
              </h3>
            </div>

            {/* Sub-titular categorico: aclara que es un asistente con IA
                exclusivo del curso, sin meter esa definicion adentro de la
                frase aspiracional siguiente (jerarquia mas limpia). */}
            <p className="mb-3 text-[13px] uppercase tracking-[0.16em] text-[#5BB8D4] lg:text-[12px]">
              Asistente IA personalizado · diseñado y entrenado por Flowdex
            </p>

            <p className="mx-auto max-w-lg text-sm leading-relaxed text-[#A8A8A8] sm:text-[15px] lg:mx-0">
              El aprendizaje no se detiene entre clases. Dudas resueltas en el momento, módulos para profundizar entre sesiones y conceptos sólidos al llegar a cada nueva sesión.
            </p>
          </div>

          {/* Columna derecha: tres mini-features */}
          <ul className="grid gap-3 sm:grid-cols-3 lg:flex lg:flex-col lg:gap-3.5">
            {features.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-start gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.015] px-3.5 py-3"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#5BB8D4]/10">
                  <Icon className="h-3.5 w-3.5 text-[#5BB8D4]" />
                </div>
                <span className="text-[12.5px] leading-snug text-[#C8C8C8]">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
