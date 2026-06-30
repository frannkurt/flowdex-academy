"use client"

import { m as motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowUpRight, Check, ExternalLink } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { fadeUpProps } from "@/lib/motion"
import { OrbitalIcon } from "./OrbitalIcon"

type InnerCircleProps = {
  price?: number
}

const DEFAULT_INNER_CIRCLE_PRICE = 399

function formatUsd(value: number) {
  return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)} USD`
}

/**
 * Layout actual (mayo 2026): card en 3 bandas verticales — HEADER ROW
 * (visual izq + content der), HAIRLINE HORIZONTAL único que cruza
 * todo el ancho, FOOTER ROW (mentores+cita izq + prereq+precio+CTA
 * der). El hairline único garantiza que ambos colofones queden
 * perfectamente alineados al mismo alto (antes vivían dentro de
 * cada columna con mt-auto y como el contenido de cada columna es
 * de alto distinto, los hairlines no coincidían).
 *
 * Itinerario rápido para no repetir errores:
 *  - v1 (ostentosa): ribbon "TOPE DE GAMA", glow dorado, Crown, $700
 *    tachado. Descartada — gritar premium deja de ser premium.
 *  - v2.A (minimalismo puro): sin acentos, anodina. Quedó pelada.
 *  - v2.B (acentos sutiles + 2 columnas con hairlines internos):
 *    hairlines desalineados porque mt-auto empujaba según contenido.
 *  - v2.C (esta): split en 3 bandas, hairline único cruza el ancho.
 *  - v3 (editorial full-bleed sin card): descartada por anodina.
 */
export function InnerCircle({ price }: InnerCircleProps = {}) {
  const { t } = useLanguage()
  const [orbImageError, setOrbImageError] = useState(false)
  const displayPrice = formatUsd(price ?? DEFAULT_INNER_CIRCLE_PRICE)

  const indicatorCards = [
    {
      src: "https://s3.tradingview.com/i/I3rNRPLW_mid.png?v=1770326874",
      alt: "Magic Hours: MASTER SUITE",
      caption: "MASTER SUITE",
      desc: "Sesiones, killzones y ventanas de alta probabilidad en el chart.",
      href: "https://es.tradingview.com/script/I3rNRPLW/",
    },
    {
      src: "/FVGIFVG.jpg",
      alt: "FLOWDEX FVG / IFVG (ICT) Fair Value Gap Detector",
      caption: "FVG + IFVG VISUAL",
      desc: "Detecta Fair Value Gaps e inverse FVG (ICT) limpios y en vivo.",
      href: "https://www.tradingview.com/script/QNrtOsSP-FLOWDEX-FVG-IFVG-ICT-Fair-Value-Gap-Inverse-FVG-Detector/",
    },
  ]

  const includes = [
    t("innerCircle.cardInclude1"),
    t("innerCircle.cardInclude2"),
    t("innerCircle.cardInclude3"),
    t("innerCircle.cardInclude4"),
    t("innerCircle.cardInclude5"),
    t("innerCircle.cardInclude6"),
  ]

  // Desglose de los 3 cursos que viven adentro del IC (triada de colores
  // como en el dashboard). Mismo orden que el dashboard: psico / inv / trading.
  const coursePillars = [
    {
      accent: "#D4B86A",
      label: "Psicotrading",
      modules: "10 módulos",
      detail: "Mindset, emociones, sesgos y decisiones bajo presión.",
    },
    {
      accent: "#5BB8D4",
      label: "Inversiones avanzado",
      modules: "5 módulos",
      detail: "Sistema FPM, valuación de empresas y lectura macro.",
    },
    {
      accent: "#7DD4C0",
      label: "Trading avanzado",
      modules: "5 módulos",
      detail: "ORB Breakout, intradía en NY y gestión de riesgo.",
    },
  ]

  const quickStats = [
    { n: "3", l: "cursos avanzados" },
    { n: "20", l: "módulos" },
    { n: "7", l: "anexos descargables" },
    { n: "12", l: "meses de acceso al material" },
  ]

  return (
    <section
      id="inner-circle"
      className="section-divider-smooth py-28 sm:py-36 bg-[#070707] relative"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUpProps}
          className="relative overflow-hidden rounded-2xl border border-[#D4B86A]/30 bg-[#0A0A0A]"
        >
          {/* Hairline dorado superior — hermana la card con el dashboard del alumno */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#D4B86A]/45 to-transparent" />
          {/* Orbitales decorativos en esquinas opuestas — sutiles,
              sin animar, opacity microscópica. */}
          <div className="pointer-events-none absolute -top-16 -right-16 z-0 opacity-[0.05]">
            <OrbitalIcon size={280} animate={false} />
          </div>
          <div className="pointer-events-none absolute -bottom-20 -left-20 z-0 opacity-[0.04]">
            <OrbitalIcon size={220} animate={false} />
          </div>

          <div className="relative z-10">
            {/* ============================================
                HEADER ROW — visual izq + content der
                ============================================ */}
            <div className="flex flex-col lg:flex-row">
              {/* Columna visual (izquierda): ORB strategy + stack
                  vertical de indicadores propios. */}
              <div className="lg:w-5/12 p-6 sm:p-7 lg:p-8 bg-[#080808] border-b border-white/[0.05] lg:border-b-0 lg:border-r lg:border-white/[0.05] flex flex-col gap-4">
                <div className="rounded-xl overflow-hidden border border-white/[0.06] bg-[#0B0B0B]">
                  <div className="relative aspect-video w-full bg-[#0E0E0E]">
                    {!orbImageError ? (
                      <Image
                        src="/orb-strategy.png"
                        alt="Estrategia ORB Breakout en TradingView – Indicador exclusivo desarrollado por Franco para Flowdex"
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="absolute inset-0 object-cover"
                        onError={() => setOrbImageError(true)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                        <p className="text-sm text-[#8F8F8F]">
                          Estrategia ORB · imagen pendiente
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3 border-t border-white/[0.05]">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#D4B86A] mb-1.5">
                      Estrategia exclusiva
                    </p>
                    <p className="text-sm text-[#E0E0E0]">
                      ORB Breakout · Indicador propio en TradingView
                    </p>
                  </div>
                </div>

                {/* Indicadores adicionales — stack vertical de 2 rows
                    horizontales compactas. */}
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#666666] mb-1">
                    Indicadores propios
                  </p>
                  {indicatorCards.map((slide) => (
                    <a
                      key={slide.caption}
                      href={slide.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/ind flex items-center gap-3.5 rounded-lg border border-white/[0.05] bg-[#0B0B0B] p-3.5 hover:border-[#D4B86A]/35 hover:bg-[#0E0D0A] transition-all"
                    >
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md border border-white/[0.04]">
                        <Image
                          src={slide.src}
                          alt={slide.alt}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium text-[#E8E8E8]">
                          {slide.caption}
                        </p>
                        <p className="mt-1 text-[12px] leading-snug text-[#9A9A9A] line-clamp-2">
                          {slide.desc}
                        </p>
                      </div>
                      <ExternalLink
                        className="h-4 w-4 shrink-0 text-[#555555] transition-colors group-hover/ind:text-[#D4B86A]"
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>
              </div>

              {/* Columna content (derecha): eyebrow + title + subtitle
                  + tagline + includes (5 items). */}
              <div className="lg:w-7/12 p-7 sm:p-9 lg:p-10 flex flex-col">
                {/* Eyebrow microscópico — único acento dorado, apagado */}
                <p className="mb-6 text-[10px] uppercase tracking-[0.28em] text-[#D4B86A]">
                  Inner Circle
                </p>

                {/* Título — display grande, peso normal */}
                <h2 className="mb-3 type-display-md text-white">
                  {t("innerCircle.title")}
                </h2>

                {/* Subtitle — dorado apagado porque "La Obra Maestra del
                    operador" es nombre propio del método propietario. */}
                <p className="mb-7 text-base text-[#D4B86A] sm:text-[17px]">
                  {t("innerCircle.cardHighlight")}
                </p>

                {/* Tagline */}
                <p className="mb-9 text-[15px] leading-relaxed text-[#B8B8B8] sm:text-base sm:leading-[1.7]">
                  {t("innerCircle.cardTagline")}
                </p>

                {/* Includes — lista limpia con checks neutros. El primer
                    item lleva check dorado apagado como ancla. */}
                <ul className="space-y-3">
                  {includes.map((item, idx) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[14px] leading-relaxed text-[#CFCFCF] sm:text-[15px]"
                    >
                      <Check
                        className={`mt-[3px] h-3.5 w-3.5 shrink-0 ${
                          idx === 0 ? "text-[#D4B86A]" : "text-[#888888]"
                        }`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ============================================
                BANDA FULL-WIDTH — qué hay adentro: desglose de los 3
                cursos (triada), recursos y datos duros. Refuerza, no
                reemplaza, el bullet "3 cursos avanzados" de arriba.
                ============================================ */}
            <div className="border-t border-white/[0.05] px-6 py-5 sm:px-9 sm:py-6 lg:px-10">
              <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#D4B86A]">
                Tres cursos avanzados, un solo programa
              </p>

              <div className="grid gap-2.5 sm:grid-cols-3">
                {coursePillars.map((pillar) => (
                  <div
                    key={pillar.label}
                    className="rounded-xl border border-white/[0.06] bg-[#0B0B0B] p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ background: pillar.accent }}
                        />
                        <p className="truncate text-[13px] font-medium tracking-tight text-white">
                          {pillar.label}
                        </p>
                      </span>
                      <p className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-[#777777]">
                        {pillar.modules}
                      </p>
                    </div>
                    <p className="mt-1.5 text-[12px] leading-snug text-[#8E8E8E]">
                      {pillar.detail}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-[12.5px] leading-relaxed text-[#A0A0A0]">
                <span className="text-[#D4B86A]">+7 anexos descargables:</span> workbook de 30 días, tracker de progreso, 20 lecturas recomendadas, glosario aplicado y self-assessment inicial y final.
              </p>

              <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {quickStats.map((stat) => (
                  <div
                    key={stat.l}
                    className="rounded-lg border border-white/[0.06] bg-[#0B0B0B] px-3 py-2 text-center"
                  >
                    <p className="text-xl font-bold tabular-nums text-white">{stat.n}</p>
                    <p className="mt-0.5 text-[9.5px] uppercase tracking-[0.16em] text-[#888888]">
                      {stat.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ============================================
                HAIRLINE HORIZONTAL ÚNICO — cruza todo el ancho del
                card. Es la "línea divisoria" entre la zona de
                presentación (header) y la zona de cierre (footer).
                Garantiza alineación perfecta porque NO hay dos líneas
                — hay una sola.
                ============================================ */}
            <div className="h-px w-full bg-white/[0.06]" />

            {/* ============================================
                FOOTER — banda full-width: prereq arriba; abajo, en una
                fila, precio + mentores (línea fina) a la izquierda y
                CTA a la derecha. Mentores ya no ocupa una columna
                entera — se conserva como señal de confianza compacta.
                ============================================ */}
            <div className="px-6 py-6 sm:px-9 sm:py-7 lg:px-10">
              <p className="mb-4 text-[12px] text-[#888888]">
                {t("innerCircle.cardPrereq")}.
              </p>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    {/* Precio — dorado vivo, completa la triada */}
                    <span className="type-stat-md text-[#D4B86A]">{displayPrice}</span>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#666666]">
                      Pago único · 12 meses
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-[#9A9A9A]">
                    Con <span className="text-[#D8D8D8]">Augusto Holman</span> y{" "}
                    <span className="text-[#D8D8D8]">Franco Escudero</span>
                    <span className="mx-1.5 text-[#444444]">·</span>
                    <span className="italic text-[#8A8A8A]">
                      {"“Donde el método se vuelve hábito.”"}
                    </span>
                  </p>
                </div>

                <Link
                  href="/inner-circle"
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#D4B86A]/50 bg-gradient-to-b from-[#D4B86A]/[0.18] to-[#D4B86A]/[0.06] px-7 py-3.5 text-sm font-medium text-[#F5EBCF] transition-all hover:border-[#D4B86A]/80 hover:from-[#D4B86A]/[0.28] hover:to-[#D4B86A]/[0.12] hover:text-white hover:shadow-[0_10px_28px_-10px_rgba(212,184,106,0.45)]"
                >
                  {t("innerCircle.cardCta")}
                  <ArrowUpRight className="h-4 w-4 text-[#D4B86A]/85 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
