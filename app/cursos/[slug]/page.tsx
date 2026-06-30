import type { Metadata } from "next"
import type { CSSProperties } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  ArrowRight,
  Award,
  Check,
  Target,
  Users,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Quote,
  Star,
} from "lucide-react"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { JsonLd } from "@/components/JsonLd"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  COURSE_LANDING_MARKETING,
  getCourseFaq,
  getCourseLandingFullData,
  getPublicCourseSlugs,
} from "@/lib/courses/landing-marketing"
import { COURSE_RECORRIDO, getOutcomeIcon, hasRecorrido } from "@/lib/courses/landing-recorrido"
import {
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
  buildFaqJsonLd,
} from "@/lib/seo/structured-data"

export function generateStaticParams() {
  return getPublicCourseSlugs().map((slug) => ({ slug }))
}

// Mapeo slug → OG image. Cada curso tiene su placa de marca en fondo negro
// (coherente con el dark mode del sitio) para que cuando alguien comparta el
// link en WhatsApp / Twitter / LinkedIn el preview muestre la marca + nombre
// del curso, no un logo aislado.
const COURSE_OG_IMAGES: Record<string, string> = {
  "kickstart-investment": "/og/og-kickstart-investment.jpg",
  "expert-investment": "/og/og-expert-investment.jpg",
  "kickstart-trading": "/og/og-kickstart-trading.jpg",
  "trading-lab": "/og/og-trading-lab.jpg",
}

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const marketing = COURSE_LANDING_MARKETING[slug]

  if (!marketing) {
    return { title: "Curso no encontrado" }
  }

  const url = `https://flowdex.com.ar/cursos/${slug}`
  const ogImage = COURSE_OG_IMAGES[slug] ?? "/og/og-home.jpg"

  return {
    title: marketing.seoTitle,
    description: marketing.seoDescription,
    alternates: { canonical: `/cursos/${slug}` },
    keywords: [marketing.primaryKeyword, ...marketing.secondaryKeywords],
    openGraph: {
      title: marketing.seoTitle,
      description: marketing.seoDescription,
      type: "article",
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${marketing.seoTitle} — Flowdex`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: marketing.seoTitle,
      description: marketing.seoDescription,
      images: [ogImage],
    },
  }
}

function formatUsd(value: number) {
  return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}`
}

export default async function CourseLandingPage({ params }: PageProps) {
  const { slug } = await params
  const data = getCourseLandingFullData(slug)

  if (!data) {
    notFound()
  }

  const mentor = data.mentorRef
  const accent = data.brandColor.accent

  // Precio dinámico desde Supabase con fallback al catalog.
  let price = data.price

  try {
    const supabase = await createSupabaseServerClient()
    if (supabase) {
      const { data: row } = await supabase
        .from("courses")
        .select("price")
        .eq("slug", slug)
        .maybeSingle()

      if (row?.price != null) {
        const parsed = Number(row.price)
        if (Number.isFinite(parsed) && parsed >= 0) {
          price = parsed
        }
      }
    }
  } catch {
    // Si Supabase falla, seguimos con el precio del catalog.
  }

  const courseSchema = buildCourseJsonLd(slug)
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Inicio", url: "/" },
    { name: "Cursos", url: "/por-donde-empezar" },
    { name: data.name, url: `/cursos/${slug}` },
  ])
  // FAQ adaptada al nivel del curso (avanzados explicitan el prerequisito).
  const courseFaq = getCourseFaq(data)
  const faqSchema = buildFaqJsonLd(
    courseFaq.map((item) => ({ question: item.q, answer: item.a })),
  )

  // Estilos compartidos del botón con glow (mismo patrón que CourseCard).
  const ctaStyle = {
    background: accent,
    boxShadow: `0 0 22px ${accent}40, 0 4px 16px ${accent}33`,
    "--cta-glow-base": `${accent}55`,
    "--cta-glow-hover": `${accent}80`,
  } as CSSProperties

  const ctaClass =
    "w-full inline-flex items-center justify-center px-6 py-3.5 text-sm sm:text-base font-bold text-[#0A0A0A] rounded-xl tracking-wide transition-all hover:scale-[1.02] hover:[box-shadow:0_0_36px_var(--cta-glow-hover),0_6px_24px_var(--cta-glow-base)]"

  // Sección "camino lado a lado": cards a renderizar según contexto.
  // - Kickstart: actual + nextLevel (curso avanzado) + finalGoal (IC)
  // - Avanzado: previousLevel (Kickstart) + actual + nextLevel (IC)
  type PathCard = {
    label: string
    name: string
    pitch: string
    href: string
    highlight: boolean
    price?: string
  }
  const pathCards: PathCard[] = []
  if (data.previousLevel) {
    pathCards.push({
      label: "Antes",
      name: data.previousLevel.name,
      pitch: data.previousLevel.pitch,
      href: `/cursos/${data.previousLevel.slug}`,
      highlight: false,
    })
  }
  pathCards.push({
    label: "Estás acá",
    name: data.name,
    // heroSubtitle entero (antes era solo la primera oracion): suma
    // sustancia a la card destacada para igualarla con las laterales.
    pitch: data.heroSubtitle,
    href: `/cursos/${slug}`,
    highlight: true,
    price: `${formatUsd(price)} USD`,
  })
  if (data.nextLevel) {
    pathCards.push({
      label: "Después",
      name: data.nextLevel.name,
      pitch: data.nextLevel.pitch,
      href:
        data.nextLevel.slug === "inner-circle"
          ? "/inner-circle"
          : `/cursos/${data.nextLevel.slug}`,
      highlight: false,
    })
  }
  if (data.finalGoal) {
    pathCards.push({
      label: "Meta final",
      name: data.finalGoal.name,
      pitch: data.finalGoal.pitch,
      href: "/inner-circle",
      highlight: false,
    })
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      {courseSchema && <JsonLd data={courseSchema} />}
      <JsonLd data={breadcrumb} />
      <JsonLd data={faqSchema} />

      {/* Glows ambientales — mismo lenguaje que el resto del sitio */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full blur-[120px]"
          style={{ background: `${accent}14` }}
        />
        <div
          className="absolute right-[6%] top-[40%] h-80 w-80 rounded-full blur-[140px]"
          style={{ background: `${data.brandColor.from}14` }}
        />
        <div className="absolute left-1/2 top-[78%] h-72 w-[34rem] -translate-x-1/2 rounded-full bg-[#D4B86A]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* max-w-5xl (1024px) es el ancho que usa `/por-donde-empezar` y es el
            estándar para landings de cursos online — mantiene líneas de texto
            legibles (≤75 caracteres) y evita que el CTA full-width quede
            como cintazo en monitores grandes. */}
        <div className="mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="text-xs uppercase tracking-[0.18em] text-[#666666] mb-6"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <Link href="/por-donde-empezar" className="hover:text-white transition-colors">
              Cursos
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#AAAAAA]">{data.name}</span>
          </nav>

          {/* ============================================================== */}
          {/* HERO 1 COLUMNA — comercial puro                                  */}
          {/* Outcomes + Temario se movieron a su propia sección debajo del   */}
          {/* hero (grid 2-col) para eliminar el grid asimétrico que dejaba   */}
          {/* espacio vacío. Acá adentro queda solo el storytelling comercial.*/}
          {/* ============================================================== */}
          <section className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            <div className="pointer-events-none absolute -bottom-16 -right-16 hidden lg:block opacity-[0.08]">
              <OrbitalIcon size={260} animate={false} />
            </div>

            <div className="relative max-w-3xl">
              <span
                className="inline-flex self-start px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] rounded-full"
                style={{
                  background: `${accent}1F`,
                  color: accent,
                  border: `1px solid ${accent}40`,
                }}
              >
                {data.heroEyebrow}
              </span>

              <h1 className="mt-4 type-display-md">
                {data.heroTitle}
              </h1>

              <Link
                href={mentor.href}
                className="mt-4 inline-flex items-center gap-2 text-[13px] text-[#888888] hover:text-white transition-colors"
              >
                <GraduationCap size={14} style={{ color: accent }} />
                <span>
                  Dictado por <span className="text-white font-medium">{mentor.name}</span>{" "}
                  <span className="opacity-60">· {mentor.role}</span>
                </span>
              </Link>

              <p className="mt-5 text-base text-[#CCCCCC] leading-relaxed">{data.heroSubtitle}</p>

              <p className="mt-4 text-[13px] text-[#A7A7A7] leading-snug">
                <span className="font-semibold text-[#D0D0D0]">No es para vos si:</span>{" "}
                {data.notFor}
              </p>

              <div
                className="mt-4 flex items-start gap-3 rounded-xl border bg-black/30 p-3.5"
                style={{ borderColor: `${accent}30` }}
              >
                <Target size={16} style={{ color: accent }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1"
                    style={{ color: accent }}
                  >
                    Sabés que lo lográs cuando
                  </p>
                  <p className="text-[13px] text-[#D2E2E6] leading-snug">{data.masteryCriterion}</p>
                </div>
              </div>

              {/* Precio */}
              <div className="mt-6 flex items-baseline gap-3">
                <span
                  className="type-stat-md tabular-nums"
                  style={{ color: accent }}
                >
                  {formatUsd(price)}
                </span>
                <span className="text-sm text-[#888888]">USD</span>
              </div>

              {/* Cross-sell SOLO en Kickstarts (con upgrade real de $200).
                  Alineado a la izquierda con max-w-md para que matchee con el
                  precio (arriba) y el CTA (abajo) y no quede centrado-torcido. */}
              {data.hasUpgradeOffer && data.nextLevel && (
                <div className="mt-4 max-w-md">
                  <p
                    className="flex items-center gap-2 rounded-xl bg-[#101C1C] px-4 py-3 text-[13px] font-medium leading-snug"
                    style={{ color: accent }}
                  >
                    <Sparkles size={16} style={{ color: accent }} className="flex-shrink-0" />
                    <span>
                      Si subís a {data.nextLevel.name} después, sólo pagás $200 USD adicionales.
                    </span>
                  </p>
                </div>
              )}

              {/* CTA + link mentor en wrapper acotado para que no se estire */}
              <div className="mt-6 max-w-md">
                <Link href={`/checkout/${slug}`} className={ctaClass} style={ctaStyle}>
                  Comenzar el curso · {formatUsd(price)} USD
                </Link>

                <Link
                  href={mentor.href}
                  className="mt-3 block text-center text-xs opacity-70 hover:opacity-100 transition-opacity"
                  style={{ color: accent }}
                >
                  Quiénes dirigen el programa →
                </Link>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* QUÉ TE LLEVÁS — full-width con íconos temáticos                  */}
          {/* Antes era un grid 2-col que pareaba con un "Temario completo".  */}
          {/* Se eliminó el Temario porque duplicaba contenido del nuevo      */}
          {/* "Recorrido del programa" más abajo (mata atención).             */}
          {/* Ahora "Qué te llevás" gana protagonismo: full-width, grid de    */}
          {/* outcomes con ícono temático por bullet (color accent).          */}
          {/* ============================================================== */}
          <section
            className="mt-6 rounded-2xl border p-6 sm:p-8 lg:p-10"
            style={{
              background: `${accent}0E`,
              borderColor: `${accent}30`,
            }}
          >
            <p
              className="type-eyebrow-lg mb-6 text-center"
              style={{ color: accent }}
            >
              Qué te llevás
            </p>
            <ul className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {data.outcomes.map((item, idx) => {
                const Icon = getOutcomeIcon(slug, idx, Check)
                return (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 sm:p-4"
                  >
                    <div
                      className="flex-shrink-0 rounded-lg p-2 border"
                      style={{
                        background: `${accent}14`,
                        borderColor: `${accent}30`,
                      }}
                    >
                      <Icon size={16} style={{ color: accent }} />
                    </div>
                    <span className="text-sm text-[#D2E2E6] leading-relaxed pt-0.5">
                      {item}
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>

          {/* ============================================================== */}
          {/* RECORRIDO DEL PROGRAMA — módulo por módulo                       */}
          {/* Complemento del Temario lateral: cada módulo en su propio card  */}
          {/* con badge (PRE / M1…), título, subtítulo, ícono y secciones     */}
          {/* internas. Filosofía: mostrar la estructura y el valor sin       */}
          {/* revelar la pedagogía detallada que un competidor pueda copiar.  */}
          {/* ============================================================== */}
          {hasRecorrido(slug) && (() => {
            const recorridoModules = COURSE_RECORRIDO[slug]
            // Suma de horas por módulo si TODOS los módulos del curso declaran
            // `hours`. Si falta alguno, no mostramos el total (evita mentir).
            // Las clases en vivo no se suman acá (se comunican aparte en el
            // hero y en `includes`).
            const totalModuleHours = recorridoModules.every(
              (m) => typeof m.hours === "number",
            )
              ? recorridoModules.reduce((sum, m) => sum + (m.hours ?? 0), 0)
              : null
            return (
            <section className="mt-12 sm:mt-16">
              <div className="text-center mb-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-2">
                  Cómo está organizado
                </p>
                <h2 className="type-display-sm text-white">
                  Recorrido del programa, módulo por módulo.
                </h2>
                <p className="mt-3 text-sm text-[#9C9C9C] max-w-2xl mx-auto leading-relaxed">
                  Cada módulo construye sobre el anterior. Esto es lo que vas a recorrer y por qué.
                </p>
                {totalModuleHours !== null && (
                  <p className="mt-3 text-[12px] text-[#A8A8A8] max-w-2xl mx-auto leading-relaxed">
                    Carga académica estimada en los módulos:{" "}
                    <span className="text-white font-semibold">~{totalModuleHours}h</span>
                    <span className="text-[#787878]">
                      {" "}
                      · más clases grupales en vivo a lo largo del programa.
                    </span>
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {recorridoModules.map((mod) => {
                  const ModuleIcon = mod.icon
                  return (
                    <article
                      key={mod.badge}
                      className="rounded-2xl border border-[#2A2A2A] bg-[#0E0E0E]/80 p-5 sm:p-6 transition-colors hover:border-[color:var(--mod-accent)]/40"
                      style={{ ["--mod-accent" as string]: accent } as CSSProperties}
                    >
                      {/* Header del card: badge + título + ícono */}
                      <div className="flex items-start gap-4">
                        {/* Ícono principal del módulo */}
                        <div
                          className="flex-shrink-0 rounded-xl p-3 border"
                          style={{
                            background: `${accent}14`,
                            borderColor: `${accent}30`,
                          }}
                        >
                          <ModuleIcon size={22} style={{ color: accent }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                            <span
                              className="font-[var(--font-mono)] text-[11px] font-bold tracking-[0.18em] px-2 py-0.5 rounded"
                              style={{
                                background: `${accent}1F`,
                                color: accent,
                                border: `1px solid ${accent}40`,
                              }}
                            >
                              {mod.badge}
                            </span>
                            <h3 className="type-subheadline text-white">
                              {mod.title}
                            </h3>
                          </div>
                          <p className="text-[13px] text-[#A8A8A8] leading-snug">
                            {mod.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Secciones internas — grid de chips con ícono + descripción opcional */}
                      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                        {mod.sections.map((sec) => {
                          const SecIcon = sec.icon
                          return (
                            <div
                              key={sec.label}
                              className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                            >
                              <SecIcon
                                size={14}
                                className="mt-0.5 flex-shrink-0"
                                style={{ color: accent }}
                              />
                              <div className="min-w-0">
                                <p className="text-[13px] font-medium text-[#E2E2E2] leading-snug">
                                  {sec.label}
                                </p>
                                {sec.description && (
                                  <p className="mt-1 text-[12px] text-[#888888] leading-relaxed">
                                    {sec.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Badge dorado de examen final — sello premium que recorre
                          los 5 cards uniformemente. Usa el dorado de marca
                          (#D4B86A) en lugar del accent del curso para destacarlo
                          como feature transversal de Flowdex, no como un atributo
                          más del módulo. */}
                      <div
                        className="mt-4 flex items-center gap-2.5 rounded-xl border bg-[#D4B86A]/[0.06] px-3.5 py-2.5"
                        style={{ borderColor: "rgba(212, 184, 106, 0.35)" }}
                      >
                        <Award
                          size={14}
                          className="flex-shrink-0 text-[#D4B86A]"
                        />
                        <p className="text-[12px] text-[#D4B86A] font-medium tracking-wide">
                          Examen final del módulo
                          <span className="text-[#D4B86A]/70 font-normal">
                            {" "}
                            · validás lo que entendiste antes de avanzar
                          </span>
                        </p>
                      </div>

                      {mod.takeaway && (
                        <div
                          className="mt-4 flex items-start gap-2.5 rounded-xl border bg-black/30 p-3"
                          style={{ borderColor: `${accent}30` }}
                        >
                          <Sparkles
                            size={14}
                            style={{ color: accent }}
                            className="mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <p
                              className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1"
                              style={{ color: accent }}
                            >
                              Qué te llevás
                            </p>
                            <p className="text-[13px] text-[#D2E2E6] leading-snug">
                              {mod.takeaway}
                            </p>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </section>
            )
          })()}

          {/* ============================================================== */}
          {/* STATS ROW                                                        */}
          {/* ============================================================== */}
          <section className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {data.heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center backdrop-blur-sm"
              >
                <p
                  className="type-stat-md"
                  style={{ color: accent }}
                >
                  {stat.value}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[#8FA9B1]">
                  {stat.label}
                </p>
              </div>
            ))}
          </section>

          {/* ============================================================== */}
          {/* PARA QUIÉN ES                                                    */}
          {/* ============================================================== */}
          <section className="mt-12 sm:mt-16">
            <div className="text-center mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-2">
                ¿Te suena familiar?
              </p>
              <h2 className="type-display-sm text-white">
                Para quién es este curso.
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {data.forWhom.map((item, idx) => (
                <article
                  key={idx}
                  className="rounded-2xl border border-[#2A2A2A] bg-[#0E0E0E]/80 p-5 flex items-start gap-3"
                >
                  <Users size={16} style={{ color: accent }} className="mt-0.5 flex-shrink-0" />
                  <p className="text-[14px] text-[#CCCCCC] leading-relaxed">{item}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* POR QUÉ FUNCIONA — PILARES                                       */}
          {/* ============================================================== */}
          <section className="mt-12 sm:mt-16">
            <div className="text-center mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-2">
                Por qué funciona
              </p>
              <h2 className="type-display-sm text-white">
                Cuatro pilares que sostienen el método.
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {data.pillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className="rounded-2xl border border-[#2A2A2A] bg-[#0E0E0E]/80 p-5 sm:p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="rounded-lg p-2"
                      style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
                    >
                      <ShieldCheck size={16} style={{ color: accent }} />
                    </div>
                    <h3 className="type-subheadline text-white">{pillar.title}</h3>
                  </div>
                  <p className="text-[14px] text-[#A8A8A8] leading-relaxed">{pillar.description}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* MENTOR CARD — engordada con bio, specialties, badge, quote, CTA */}
          {/* ============================================================== */}
          <section className="mt-12 sm:mt-16">
            <div className="text-center mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-2">
                Quién te enseña
              </p>
              <h2 className="type-display-sm text-white">
                Tu mentor en este curso.
              </h2>
            </div>

            <article className="glass-card rounded-3xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Foto + insignia overlay
                    aspect-[4/5] respeta la proporción natural de un retrato
                    vertical y evita el zoom excesivo que provocaba aspect-square.
                    object-position [center_25%] sube el encuadre para que el
                    rostro quede mejor centrado. quality={95} fuerza Next/Image
                    a servir la versión de mayor calidad. */}
                <div className="md:w-[42%] relative aspect-[4/5] md:aspect-auto md:min-h-[480px] bg-gradient-to-br from-[#1A1A1A] to-[#111111]">
                  <Image
                    src={mentor.photo}
                    alt={mentor.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 42vw"
                    quality={95}
                    className="object-cover"
                    style={{ objectPosition: "center 25%" }}
                  />
                  {/* Insignia anclada abajo-izquierda */}
                  <div
                    className="absolute bottom-4 left-4 right-4 rounded-xl backdrop-blur-md p-3 border"
                    style={{
                      background: "rgba(10, 10, 10, 0.78)",
                      borderColor: `${accent}50`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-lg px-3 py-1.5 font-[var(--font-mono)] text-xl font-bold leading-none"
                        style={{
                          background: `${accent}20`,
                          color: accent,
                          border: `1px solid ${accent}50`,
                        }}
                      >
                        {mentor.badge.value}
                      </div>
                      <p className="text-[11px] text-[#CCCCCC] leading-snug">
                        {mentor.badge.label}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info del mentor */}
                <div className="md:w-[58%] p-6 sm:p-8 flex flex-col justify-center">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2"
                    style={{ color: accent }}
                  >
                    Mentor del curso
                  </p>
                  <h3 className="type-display-xs text-white mb-2">
                    {mentor.name}
                  </h3>
                  <p className="text-sm text-[#AAAAAA] leading-relaxed mb-4">{mentor.role}</p>

                  <p className="text-[14px] text-[#CCCCCC] leading-relaxed mb-5">{mentor.bio}</p>

                  <div className="mb-5">
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-2"
                      style={{ color: accent }}
                    >
                      Especialidades
                    </p>
                    <ul className="space-y-1.5">
                      {mentor.specialties.map((sp) => (
                        <li
                          key={sp}
                          className="flex items-start gap-2 text-[13px] text-[#D2E2E6] leading-snug"
                        >
                          <Star size={12} style={{ color: accent }} className="mt-1 flex-shrink-0" />
                          <span>{sp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <blockquote
                    className="border-l-2 pl-3 mb-5 italic text-[13px] text-[#D2E2E6] leading-relaxed"
                    style={{ borderColor: accent }}
                  >
                    <Quote size={12} style={{ color: accent }} className="inline mr-1 -mt-1" />
                    {mentor.quote}
                  </blockquote>

                  {/* Botón con borde (insignia clickeable, no link plano) */}
                  <Link
                    href={mentor.href}
                    className="self-start inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02]"
                    style={{
                      borderColor: `${accent}60`,
                      background: `${accent}14`,
                      color: accent,
                      boxShadow: `0 0 16px ${accent}25`,
                    }}
                  >
                    <ShieldCheck size={14} />
                    {mentor.ctaLabel}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          </section>

          {/* ============================================================== */}
          {/* QUÉ INCLUYE                                                      */}
          {/* ============================================================== */}
          <section className="mt-12 sm:mt-16">
            <div className="text-center mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-2">
                Sin letra chica
              </p>
              <h2 className="type-display-sm text-white">
                Qué incluye el programa.
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {data.includes.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-[#2A2A2A] bg-[#0E0E0E]/80 p-4"
                >
                  <Check size={14} style={{ color: accent }} className="mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] text-[#D2E2E6] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* CAMINO — hasta 3 cards: previo / actual / siguiente / meta IC   */}
          {/* ============================================================== */}
          {pathCards.length > 1 && (
            <section className="mt-12 sm:mt-16">
              <div className="text-center mb-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-2">
                  ¿Cuál curso me corresponde?
                </p>
                <h2 className="type-display-sm text-white">
                  El camino, lado a lado.
                </h2>
              </div>

              <div
                className={`grid gap-3 ${
                  pathCards.length === 4
                    ? "md:grid-cols-2 lg:grid-cols-4"
                    : "md:grid-cols-3"
                }`}
              >
                {pathCards.map((card) => (
                  <article
                    key={`${card.label}-${card.name}`}
                    className={`rounded-2xl p-5 relative flex flex-col h-full ${
                      card.highlight
                        ? "border-2"
                        : "border border-[#2A2A2A] bg-[#0E0E0E]/80"
                    }`}
                    style={
                      card.highlight
                        ? {
                            borderColor: accent,
                            background: `${accent}0E`,
                          }
                        : undefined
                    }
                  >
                    {card.highlight && (
                      <span
                        className="absolute -top-2.5 left-5 text-[10px] font-semibold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
                        style={{ background: accent, color: "#0A0A0A" }}
                      >
                        Estás acá
                      </span>
                    )}
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2"
                      style={{
                        color: card.highlight ? accent : "#888888",
                      }}
                    >
                      {card.highlight ? "Programa actual" : card.label}
                    </p>
                    <h3 className="type-subheadline text-white mb-2">
                      {card.name}
                    </h3>
                    <p
                      className={`text-[13px] leading-relaxed mb-4 ${
                        card.highlight ? "text-[#D2E2E6]" : "text-[#A8A8A8]"
                      }`}
                    >
                      {card.pitch}
                    </p>

                    {/* mt-auto empuja el bloque inferior al ras del fondo
                        de cada card, asi el precio de "Estas aca" queda en
                        el mismo eje vertical que los "Ver detalle" / "Mas
                        informacion" de las cards laterales. */}
                    <div className="mt-auto pt-2">
                      {card.highlight && card.price ? (
                        <span className="text-xs font-medium" style={{ color: accent }}>
                          {card.price}
                        </span>
                      ) : (
                        <Link
                          href={card.href}
                          className="inline-flex items-center gap-1 text-xs font-medium hover:text-white transition-colors"
                          style={{ color: accent }}
                        >
                          {card.name === "Inner Circle" ? "Más información" : "Ver detalle"}{" "}
                          <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* FAQ                                                              */}
          {/* ============================================================== */}
          <section className="mt-12 sm:mt-16">
            <div className="text-center mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-2">
                Para que no quede ninguna duda
              </p>
              <h2 className="type-display-sm text-white">
                Preguntas frecuentes.
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-2.5">
              {courseFaq.map((item) => (
                <details
                  key={item.q}
                  className="group glass-card rounded-xl border border-white/8 hover:border-[#7DD4C0]/30 open:border-[#D4B86A]/30 transition-colors"
                >
                  <summary className="flex items-center justify-between cursor-pointer text-left text-white text-sm px-4 py-3.5 list-none">
                    <span className="pr-4">{item.q}</span>
                    <span
                      className="transition-transform group-open:rotate-45 text-lg font-light"
                      style={{ color: accent }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-4 pb-4 text-[13px] text-[#A8A8A8] leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* CTA FINAL — más liviano, sin repetir "track record"             */}
          {/* ============================================================== */}
          <section className="mt-12 sm:mt-16">
            <div className="glass-card rounded-3xl p-7 sm:p-10 text-center max-w-2xl mx-auto relative overflow-hidden">
              <div className="pointer-events-none absolute -top-12 -right-12 hidden lg:block opacity-[0.05]">
                <OrbitalIcon size={180} animate={false} />
              </div>

              <p
                className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-2 relative"
                style={{ color: accent }}
              >
                Listo para empezar
              </p>
              <h2 className="type-display-sm text-white mb-3 relative">
                Tu primer paso con criterio.
              </h2>
              <p className="text-[14px] text-[#CCCCCC] leading-relaxed mb-6 max-w-md mx-auto relative">
                Acceso inmediato post-pago. Clases en vivo, comunidad activa y método replicable
                desde el día uno.
              </p>

              <div className="relative">
                <Link href={`/checkout/${slug}`} className={ctaClass} style={ctaStyle}>
                  Comenzar el curso · {formatUsd(price)} USD
                </Link>
                <p className="mt-3 text-[11px] text-[#666666]">
                  Pagás en USD vía MercadoPago (te cobra en pesos al cambio del día) o en cripto vía
                  NowPayments.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
