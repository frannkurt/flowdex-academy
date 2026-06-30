"use client"

/**
 * CoursesGrid — versión compacta del listado de cursos para el landing.
 *
 * Reemplaza visualmente al componente `CoursesSection` (que renderiza el
 * detalle completo: temario, "qué te llevás", criterio de maestría, etc.).
 * Ese detalle ahora vive en las páginas dedicadas (`/cursos/<slug>`), así
 * que en el landing alcanza con una card resumen que invita a entrar.
 *
 * Para revertir: en `app/page.tsx`, reemplazar `<CoursesGrid />` por
 * `<CoursesSection />`. Ambos componentes coexisten sin pisarse.
 */

import Link from "next/link"
import { m as motion } from "framer-motion"
import { ArrowUpRight, BarChart3, Check, MessageCircle, Sparkles, TrendingUp } from "lucide-react"
import { fadeUpPropsWithDelay } from "@/lib/motion"
import { AITutorBanner } from "./AITutorBanner"
import { OrbitalIcon } from "./OrbitalIcon"

interface CoursesGridProps {
  coursePrices?: Record<string, number>
  /** Si true, inserta el banner del Tutor IA entre la fila de Inversiones
   *  y la fila de Trading. Default false para no afectar la home actual. */
  showAITutorBanner?: boolean
}

type AccentColor = "blue" | "teal"
type BadgeLevel = "initial" | "advanced"

interface CompactCourse {
  id: string
  slug: string
  title: string
  tagline: string
  level: BadgeLevel
  accent: AccentColor
  defaultPrice: number
  mentor?: string
  highlight?: string
  /** Campos opcionales para la versión "vendedora" (v2). Si están
   * definidos se renderiza el bloque ampliado (includes, outcome,
   * proof, urgencia, garantía, badge). Si no, cae al render minimal. */
  badge?: string
  includes?: string[]
  outcome?: string
  proof?: string
  urgency?: string
  support?: string
}

const COURSES: CompactCourse[] = [
  {
    id: "kickstart-investment",
    slug: "kickstart-investment",
    title: "Kickstart Investment",
    tagline:
      "La base completa para empezar a invertir con criterio. Mercado argentino y global, sin improvisar.",
    level: "initial",
    accent: "blue",
    defaultPrice: 99,
    mentor: "Augusto Holman",
    highlight: "Inversión desde Cero",
    badge: "Mejor para empezar",
    includes: [
      "4 módulos + Apertura · examen final por módulo",
      "Clases en vivo semanales con Augusto",
      "Argentina + mundo: BYMA, CEDEARs, NYSE, S&P 500",
    ],
    outcome:
      "Armá tu primera cartera con criterio propio, entendiendo el porqué de cada decisión y sin depender de “tips” ni modas.",
    proof: undefined,
    support: "Mentor activo durante todo el curso y en clases en vivo",
  },
  {
    id: "expert-investment",
    slug: "expert-investment",
    title: "Expert Investment",
    tagline:
      "Análisis fundamental real y las estrategias clásicas validadas por inversores institucionales hace décadas.",
    level: "advanced",
    accent: "blue",
    defaultPrice: 299,
    mentor: "Augusto Holman",
    highlight: "Programa de Desarrollo de Capital",
    includes: [
      "4 módulos avanzados · examen final por módulo",
      "Clases en vivo semanales con Augusto",
      "Las 7 estrategias clásicas: All Weather, Value, Growth…",
    ],
    outcome:
      "Analizás empresas como un experto: WACC, ROIC, MOAT y estrategias de rebalanceo profesional.",
    urgency: "Si ya tenés Kickstart Investment, pagás sólo $200 USD adicionales",
    support: "Mentor activo durante todo el curso y en clases en vivo",
  },
  {
    id: "kickstart-trading",
    slug: "kickstart-trading",
    title: "Kickstart Trading",
    tagline:
      "Pasá de la improvisación a la operativa profesional. Aprendé a estructurar tu trading con método, plan escrito y gestión de riesgo real.",
    level: "initial",
    accent: "teal",
    defaultPrice: 99,
    mentor: "Franco Escudero",
    highlight: "Trading desde Cero",
    includes: [
      "4 módulos pedagógicos · examen final por módulo",
      "Clases en vivo semanales con Franco",
      "Setup completo + introducción a prop firms",
    ],
    outcome:
      "Pasá de la improvisación a la operativa profesional, con reglas claras y confianza para operar.",
    support: "Mentor activo durante todo el curso y en clases en vivo",
  },
  {
    id: "trading-lab",
    slug: "trading-lab",
    title: "Flowdex Trading Lab",
    tagline:
      "Dominá los futuros con enfoque institucional: liquidez, FVG, Volume Profile y preparación táctica para prop firms.",
    level: "advanced",
    accent: "teal",
    defaultPrice: 299,
    mentor: "Franco Escudero",
    highlight: "Laboratorio de Trading",
    badge: "Recomendado",
    includes: [
      "4 módulos avanzados · examen final por módulo",
      "Clases en vivo semanales con Franco",
      "Preparación específica para Apex, Topstep y MFFU",
    ],
    outcome:
      "Leés el mercado como un profesional: contexto institucional y setups de alta probabilidad.",
    urgency: "Si ya tenés Kickstart Trading, pagás sólo $200 USD adicionales",
    support: "Mentor activo durante todo el curso y en clases en vivo",
  },
]

const ACCENT_TOKENS: Record<
  AccentColor,
  {
    border: string
    text: string
    bgChip: string
    icon: typeof BarChart3
    label: string
  }
> = {
  blue: {
    border: "border-[#5BB8D4]",
    text: "text-[#5BB8D4]",
    bgChip: "bg-[#5BB8D4]/10",
    icon: BarChart3,
    label: "Inversión",
  },
  teal: {
    border: "border-[#7DD4C0]",
    text: "text-[#7DD4C0]",
    bgChip: "bg-[#7DD4C0]/10",
    icon: TrendingUp,
    label: "Trading",
  },
}

function formatPrice(value: number) {
  return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}`
}

export function CoursesGrid({ coursePrices = {}, showAITutorBanner = false }: CoursesGridProps) {
  return (
    <section
      id="cursos"
      className="section-divider-smooth relative overflow-hidden bg-[#0A0A0A] py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute -left-32 top-[18%] h-72 w-72 rounded-full bg-[#5BB8D4]/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-[14%] h-72 w-72 rounded-full bg-[#7DD4C0]/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-[#A0A0A0]">
            Programas
          </span>
          <h2 className="type-display-md text-white">
            Elegí tu próximo paso
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#888888]">
            Cuatro programas, dos caminos. Conocé el temario completo, el mentor a cargo y el
            criterio pedagógico de cada uno.
          </p>
        </div>

        {/* gap-y-10 entre filas refuerza la separación Inversión / Trading
            por respiración visual, sin necesidad de header de sección. */}
        <div className="grid gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-2">
          {COURSES.map((course, idx) => {
            const tokens = ACCENT_TOKENS[course.accent]

            const Icon = tokens.icon
            const price =
              coursePrices[course.id] != null
                ? formatPrice(coursePrices[course.id])
                : `$${course.defaultPrice}`
            const isFeatured = Boolean(course.badge)
            const isAdvanced = course.level === "advanced"

            // Glow del card y translate-y en hover quedaron ELIMINADOS
            // por feedback (mayo 2026): la interaccion lift+shine
            // distraía y sobre-vendía. El unico glow que queda activo
            // es el del boton "Ver el curso completo" (definido inline
            // mas abajo) — la interaccion se concentra en el CTA
            // donde sí aporta, no en el card entero.

            return (
                <motion.div
                key={course.id}
                id={course.id}
                {...fadeUpPropsWithDelay(idx * 0.08)}
                className="relative scroll-mt-24"
              >
                {/* Ribbon "Mejor punto de entrada" / "Más elegido" — sólo si la
                    card es featured. Rompe la simetría visual y jerarquiza. */}
                {course.badge ? (
                  <div className="absolute -top-3 left-6 z-20">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0A0A0A] shadow-lg ${
                        course.accent === "blue"
                          ? "bg-gradient-to-r from-[#5BB8D4] to-[#8FD4E5]"
                          : "bg-gradient-to-r from-[#7DD4C0] to-[#A5E2D2]"
                      }`}
                    >
                      <Sparkles className="h-3 w-3" />
                      {course.badge}
                    </span>
                  </div>
                ) : null}

                <Link
                  href={`/cursos/${course.slug}`}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${
                    isFeatured ? "border-white/15" : "border-white/[0.06]"
                  } border-l-4 ${tokens.border} bg-gradient-to-br ${
                    isFeatured ? "from-[#131316] to-[#0B0B0D]" : "from-[#0F0F10] to-[#0A0A0B]"
                  } p-6 transition-colors duration-300 hover:border-white/15 sm:p-7`}
                >
                  {/* Hairline dorada superior — sólo en cursos avanzados.
                      Firma "tier premium" silenciosa, técnica clásica de
                      packaging de lujo. Gradient horizontal que se concentra
                      en el centro y se desvanece a los costados. */}
                  {isAdvanced ? (
                    <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${course.accent === "blue" ? "via-[#5BB8D4]" : "via-[#7DD4C0]"} to-transparent`} />
                  ) : null}

                  {/* Marca de agua: orbital de Flowdex en la esquina inferior
                      derecha. Opacity muy baja para no competir con el
                      contenido. Mismo lenguaje visual que la página del curso. */}
                  <div className="pointer-events-none absolute -bottom-12 -right-12 opacity-[0.06] transition-opacity duration-300 group-hover:opacity-[0.1]">
                    <OrbitalIcon size={180} animate={false} />
                  </div>

                  {/* Top row: chip + icono */}
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${tokens.bgChip} ${tokens.text}`}
                      >
                        {course.level === "initial" ? "Nivel inicial" : "Nivel avanzado"}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.14em] text-[#555555]">
                        · {tokens.label}
                      </span>
                    </div>
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tokens.bgChip}`}
                    >
                      <Icon className={`h-5 w-5 ${tokens.text}`} />
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="mb-1 type-display-xs text-white">
                    {course.title}
                  </h3>

                  {course.highlight ? (
                    <p className={`mb-3 text-xs uppercase tracking-[0.14em] ${tokens.text}`}>
                      {course.highlight}
                      {course.mentor ? (
                        <span className="text-[#666666] normal-case tracking-normal">
                          {" · "}
                          {course.mentor}
                        </span>
                      ) : null}
                    </p>
                  ) : null}

                  {/* Tagline */}
                  <p className="mb-5 text-sm leading-relaxed text-[#9A9A9A]">{course.tagline}</p>

                  {/* Outcome destacado (v2) */}
                  {course.outcome ? (
                    <div
                      className={`mb-5 rounded-lg border ${tokens.bgChip} border-white/[0.04] p-3`}
                    >
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[#A0A0A0]">
                        Al terminar
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-white">{course.outcome}</p>
                    </div>
                  ) : null}

                  {/* Includes con checks (v2) */}
                  {course.includes && course.includes.length > 0 ? (
                    <ul className="mb-5 space-y-2">
                      {course.includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#C8C8C8]"
                        >
                          <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tokens.text}`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {/* Prueba social (v2) — solo si hay dato real */}
                  {course.proof ? (
                    <p className="mb-4 text-[11px] uppercase tracking-[0.14em] text-[#888888]">
                      {course.proof}
                    </p>
                  ) : null}

                  {/* Footer: precio + CTA */}
                  <div className="mt-auto border-t border-white/[0.05] pt-5">
                    {/* Mini-banner de urgencia */}
                    {course.urgency ? (
                      <p className="mb-3 text-[11px] leading-relaxed text-[#D4B86A]">
                        {course.urgency}
                      </p>
                    ) : null}

                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-2xl font-semibold ${tokens.text}`}>{price}</span>
                          <span className="text-xs text-[#666666]">USD</span>
                        </div>
                        <span className="mt-1 block text-[11px] uppercase tracking-[0.14em] text-[#666666]">
                          Pago único · 4 meses de acceso
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold text-[#0A0A0A] transition-all ${
                          course.accent === "blue"
                            ? "bg-gradient-to-r from-[#5BB8D4] to-[#8FD4E5] group-hover:shadow-[0_4px_20px_rgba(91,184,212,0.35)]"
                            : "bg-gradient-to-r from-[#7DD4C0] to-[#A5E2D2] group-hover:shadow-[0_4px_20px_rgba(125,212,192,0.35)]"
                        }`}
                      >
                        Ver el curso<span className="hidden md:inline">completo</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>

                    {/* Acompañamiento (v2) — antes "garantía". Es el
                        reductor de riesgo honesto: comunidad y mentor real. */}
                    {course.support ? (
                      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[#888888]">
                        <MessageCircle className="h-3.5 w-3.5 text-[#888888]" />
                        {course.support}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Banner del Tutor IA — feature transversal "incluido en todos
            los cursos". Va DESPUÉS del grid de cursos (no en el medio)
            para que la grilla de productos se respete como unidad y el
            usuario pueda comparar los 4 cursos sin freno visual.
            Se renderiza solo si showAITutorBanner=true (default en la home). */}
        {showAITutorBanner ? (
          <div className="mt-8 sm:mt-10">
            <AITutorBanner />
          </div>
        ) : null}
      </div>
    </section>
  )
}
