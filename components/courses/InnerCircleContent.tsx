
"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, AlertCircle, CheckCircle2 } from "lucide-react"
import { innerCircleContent, annexes, type Block, type InnerCircleModule } from "@/lib/courses/inner-circle-content"
import { loadCompletedModules, persistCompletedModules, resolveProgressStorageKey } from "@/lib/course-progress"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { InnerCircleManifiesto } from "./InnerCircleManifiesto"
import { InnerCircleRoadmap } from "./InnerCircleRoadmap"
import { ModulePills } from "./ModulePills"
import { CrossReference } from "./CrossReference"
import { CalloutBlock } from "./CalloutBlock"
import { LoreQuote } from "./LoreQuote"
import { PhilosophyQuote } from "./PhilosophyQuote"

const COMPLETED_MODULES_STORAGE_KEY = "flowdex:inner-circle:completed-modules:v1"
const MANIFESTO_COMMITMENT_STORAGE_KEY = "flowdex:inner-circle:manifesto-accepted:v1"
const COURSE_SLUG = "inner-circle"

const moduleColors = {
  teal: {
    badge: "bg-[#7DD4C0]/10 text-[#7DD4C0] border-[#7DD4C0]/20",
    number: "text-[#7DD4C0]",
    border: "border-l-[#7DD4C0]",
    dot: "bg-[#7DD4C0]",
    highlight: "bg-[#7DD4C0]/8 border-[#7DD4C0]/25 text-[#7DD4C0]",
    icon: "text-[#7DD4C0]",
    accentText: "text-[#7DD4C0]",
  },
  blue: {
    badge: "bg-[#5BB8D4]/10 text-[#5BB8D4] border-[#5BB8D4]/20",
    number: "text-[#5BB8D4]",
    border: "border-l-[#5BB8D4]",
    dot: "bg-[#5BB8D4]",
    highlight: "bg-[#5BB8D4]/8 border-[#5BB8D4]/25 text-[#5BB8D4]",
    icon: "text-[#5BB8D4]",
    accentText: "text-[#5BB8D4]",
  },
  gold: {
    badge: "bg-[#D4B86A]/10 text-[#D4B86A] border-[#D4B86A]/20",
    number: "text-[#D4B86A]",
    border: "border-l-[#D4B86A]",
    dot: "bg-[#D4B86A]",
    highlight: "bg-[#D4B86A]/8 border-[#D4B86A]/25 text-[#D4B86A]",
    icon: "text-[#D4B86A]",
    accentText: "text-[#D4B86A]",
  },
}

const innerCircleTracks = {
  obraMaestra: {
    tag: "Ruta base",
    title: "Obra Maestra",
    subtitle: "Desarrollo personal profundo para operar con identidad y templanza.",
    description:
      "Trabajás mentalidad, sesgos, disciplina y decisiones bajo presión para sostener resultados sin improvisar.",
    items: [
      {
        title: "Módulo 00 · Manifiesto y compromiso",
        description:
          "Punto de partida obligatorio para ordenar expectativas, firmar el compromiso y entrar con dirección clara.",
        featured: true,
      },
      {
        title: "Identidad y mentalidad del operador",
        description:
          "Visión completa del recorrido para entender cómo se conectan mentalidad, proceso y resultados.",
      },
      {
        title: "Gestión emocional y sesgos cognitivos",
        description:
          "Desarrollo progresivo sobre criterio, sesgos, disciplina, toma de decisiones y filosofía aplicada al mercado.",
      },
      {
        title: "Rutinas de alto rendimiento",
        description:
          "Workbook, auditoría, tracker y recursos prácticos para convertir contenido en hábitos operativos.",
      },
      {
        title: "Decisiones bajo presión + visión 10 años",
        description:
          "Cada hito se consolida con evidencia de avance para sostener consistencia durante toda la obra.",
      },
    ],
  },
  inversiones: {
    tag: "Disciplina inversiones",
    title: "Inner Circle · Inversiones",
    subtitle: "Construir un portafolio gestionado con criterio profesional.",
    description:
      "Convertís análisis en decisiones patrimoniales concretas, con marco profesional de evaluación, riesgo y ejecución.",
    items: [
      {
        title: "Sistema FPM · Flowdex Portfolio Method",
        description:
          "Metodología propia de Flowdex para estructurar portafolios profesionales. Reglas claras de construcción, simulación previa y gestión activa. Solo se enseña en Inner Circle.",
        featured: true,
      },
      {
        title: "Gestión dinámica del portafolio",
        description:
          "Identificación de zonas de compra, toma de ganancias y rebalanceo a lo largo del tiempo. Tu cartera no es estática, la trabajamos viva.",
      },
      {
        title: "Análisis fundamental y valuación de empresas",
        description:
          "Métricas financieras clave (P/E, ROE, deuda, márgenes). Cómo detectar empresas con fundamentos sólidos antes de que el mercado las descubra.",
      },
      {
        title: "Lectura macroeconómica y sectorial",
        description:
          "Tendencias macro, ciclos económicos y sectores con potencial de crecimiento. Aprendés a leer el contexto que mueve a las empresas.",
      },
      {
        title: "Sistema de monitoreo de noticias y catalizadores",
        description:
          "Cómo filtrar el ruido y detectar las noticias económicas globales que realmente mueven precios.",
      },
    ],
  },
  trading: {
    tag: "Disciplina trading",
    title: "Inner Circle · Trading",
    subtitle: "Ejecutar con sistema profesional, no con intuición.",
    description:
      "Entrenás operativa real con timing, ejecución y control de riesgo para lograr resultados repetibles en mercado vivo.",
    items: [
      {
        title: "Estrategia ORB Breakout · desarrollada por Franco para Flowdex",
        description:
          "Sistema propio con indicador exclusivo en TradingView. Reglas claras de entrada, gestión y salida. No se enseña en ningún otro nivel.",
        featured: true,
      },
      {
        title: "Sistema de scalping aplicado en H1 / M15",
        description:
          "Operativa intradía con marco temporal corto. Setup, ejecución y gestión activa en tiempo real sobre tus propias operaciones.",
      },
      {
        title: "Correlación dinámica entre pares y DXY",
        description:
          "Cómo leer el contexto del dólar y las correlaciones cruzadas para entrar con la mano del mercado, no contra ella.",
      },
      {
        title: "Monitoreo de mercado y noticias de impacto operativo",
        description:
          "Calendario económico aplicado, eventos que mueven precio, cómo posicionarte antes y después de news clave.",
      },
      {
        title: "Gestión de riesgo profesional aplicada",
        description:
          "Tamaño de posición, stop dinámico, manejo de drawdown. La diferencia entre el que sobrevive y el que vuela la cuenta.",
      },
    ],
  },
}

type TrackCardItem = {
  title: string
  description: string
  featured?: boolean
}

type TrackCardAccent = "gold" | "blue" | "teal"

const trackCardAccentStyles: Record<
  TrackCardAccent,
  {
    cardBorder: string
    cardGlow: string
    topLine: string
    tagText: string
    featuredItem: string
    button: string
  }
> = {
  gold: {
    cardBorder: "border-[#D4B86A]/32",
    cardGlow: "shadow-[0_18px_40px_rgba(212,184,106,0.08)]",
    topLine: "bg-gradient-to-r from-[#D4B86A]/75 via-[#D4B86A]/35 to-transparent",
    tagText: "text-[#D4B86A]",
    featuredItem: "border-[#D4B86A]/50 bg-[#221C11] shadow-[inset_0_0_0_1px_rgba(212,184,106,0.08)]",
    button:
      "border-[#D4B86A]/45 bg-gradient-to-r from-[#D4B86A]/16 to-[#D4B86A]/10 text-[#F7E8BF] shadow-[0_8px_22px_rgba(212,184,106,0.10)] hover:border-[#D4B86A]/70 hover:from-[#D4B86A]/22 hover:to-[#D4B86A]/16 hover:text-white",
  },
  blue: {
    cardBorder: "border-[#5BB8D4]/30",
    cardGlow: "shadow-[0_18px_40px_rgba(91,184,212,0.08)]",
    topLine: "bg-gradient-to-r from-[#5BB8D4]/75 via-[#7DD4C0]/30 to-transparent",
    tagText: "text-[#5BB8D4]",
    featuredItem: "border-[#5BB8D4]/50 bg-[#11242C] shadow-[inset_0_0_0_1px_rgba(125,212,192,0.08)]",
    button:
      "border-[#5BB8D4]/45 bg-gradient-to-r from-[#5BB8D4]/16 to-[#7DD4C0]/14 text-[#EAF8FC] shadow-[0_8px_22px_rgba(91,184,212,0.12)] hover:border-[#7DD4C0]/70 hover:from-[#5BB8D4]/22 hover:to-[#7DD4C0]/20 hover:text-white",
  },
  teal: {
    cardBorder: "border-[#7DD4C0]/28",
    cardGlow: "shadow-[0_18px_40px_rgba(125,212,192,0.08)]",
    topLine: "bg-gradient-to-r from-[#7DD4C0]/75 via-[#5BB8D4]/28 to-transparent",
    tagText: "text-[#7DD4C0]",
    featuredItem: "border-[#7DD4C0]/50 bg-[#102225] shadow-[inset_0_0_0_1px_rgba(125,212,192,0.08)]",
    button:
      "border-[#7DD4C0]/45 bg-gradient-to-r from-[#5BB8D4]/14 to-[#7DD4C0]/16 text-[#EAFBF7] shadow-[0_8px_22px_rgba(125,212,192,0.10)] hover:border-[#7DD4C0]/70 hover:from-[#5BB8D4]/18 hover:to-[#7DD4C0]/22 hover:text-white",
  },
}

function DashboardTrackCard({
  tag,
  title,
  subtitle,
  description,
  items,
  onReadCourse,
  accent,
}: {
  tag: string
  title: string
  subtitle: string
  description: string
  items: TrackCardItem[]
  onReadCourse: () => void
  accent: TrackCardAccent
}) {
  const accentStyles = trackCardAccentStyles[accent]

  return (
    <article className={`relative flex h-full flex-col overflow-hidden rounded-xl border bg-gradient-to-b from-[#141414] to-[#0F0F0F] p-4 sm:p-5 ${accentStyles.cardBorder} ${accentStyles.cardGlow}`}>
      <div className={`absolute left-4 right-4 top-0 h-px sm:left-5 sm:right-5 ${accentStyles.topLine}`} />
      <div className="flex flex-col lg:h-[17.5rem]">
        <p className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${accentStyles.tagText}`}>{tag}</p>
        <h4 className="type-display-xs text-white">{title}</h4>
        <p className="mt-2 text-[#A6A6A6] italic">{subtitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-[#9AA9AD]">{description}</p>
      </div>
      <div className={`mt-5 h-px ${accentStyles.topLine}`} />

      <div className="mt-4 grid gap-2.5">
        {items.map((item) => (
          <div
            key={item.title}
            className={`flex h-16 w-full items-center rounded-lg border px-3.5 py-2 ${
              item.featured
                ? accentStyles.featuredItem
                : "border-[#242424] bg-[#0E0E0E]"
            }`}
          >
            <p className="text-[13px] font-medium text-[#E9E9E9] leading-snug">{item.title}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-1">
        <button
          onClick={onReadCourse}
          className={`inline-flex h-10 w-full items-center justify-center rounded-lg border px-4 text-sm font-semibold transition-colors ${accentStyles.button}`}
        >
          Leer curso
        </button>
      </div>
    </article>
  )
}

function RenderBlock({
  block,
  colors,
  moduleNumber,
}: {
  block: Block
  colors: (typeof moduleColors)["teal"]
  moduleNumber: number
}) {
  const isBiasModule = moduleNumber === 4

  if (block.type === "image") {
    return (
      <div
        className="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0C0C0C] select-none"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <Image
            src={block.src}
            alt={block.alt}
            fill
            sizes="(max-width: 640px) 100vw, 720px"
            className="object-contain object-center pointer-events-none"
            draggable={false}
            quality={85}
          />
        </div>
        {block.caption && (
          <div className="border-t border-[#1E1E1E] px-4 py-2.5">
            <p className="text-center text-xs text-[#666666]">{block.caption}</p>
          </div>
        )}
      </div>
    )
  }

  if (block.type === "intro") {
    return (
      <p className="text-base leading-relaxed text-[#E0E0E0] border-l-2 border-[#2A2A2A] pl-4 italic">
        {block.text}
      </p>
    )
  }

  if (block.type === "paragraph") {
    return <p className="text-sm leading-relaxed text-[#CCCCCC]">{block.text}</p>
  }

  if (block.type === "highlight") {
    return (
      <div className="rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] px-5 py-4">
        <p className="text-sm leading-relaxed text-[#E8E8E8] whitespace-pre-line">{block.text}</p>
      </div>
    )
  }

  if (block.type === "callout") {
    if (isBiasModule && block.label === "Cita") {
      return (
        <div className="my-12 border-y border-[#2A2A2A] px-6 py-8 text-center">
          <p className="text-2xl leading-snug font-light italic text-[#7DD4C0]">
            "{block.text.split("—")[0].trim()}"
          </p>
          {block.text.includes("—") && (
            <p className="mt-2 text-base text-[#7DD4C0]">
              — {block.text.split("—").slice(1).join("—").trim()}
            </p>
          )}
        </div>
      )
    }

    if (isBiasModule && block.label.toLowerCase().includes("imagen sugerida")) {
      return (
        <div className="rounded-xl border-2 border-dashed border-[#5BB8D4]/50 bg-[#5BB8D4]/5 px-6 py-5">
          <p className="type-eyebrow-lg text-[#5BB8D4]">
            [Imagen - El cerebro tramposo]
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#9AA4AB]">{block.text}</p>
        </div>
      )
    }

    if (isBiasModule && block.label === "Acción para hoy") {
      return (
        <div className="rounded-xl border border-[#7DD4C0] bg-[#7DD4C0]/8 px-6 py-5">
          <p className="type-eyebrow text-[#7DD4C0]">
            Accion para hoy
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#F1F6F5]">{block.text}</p>
        </div>
      )
    }

    if (isBiasModule && block.label === "Para llevarte") {
      return (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-7 py-8 text-center">
          <p className="type-eyebrow text-[#5BB8D4]">Para llevarte</p>
          <p className="mt-4 text-xl leading-snug font-light text-white">{block.text}</p>
        </div>
      )
    }

    return (
      <CalloutBlock label={block.label} variant={block.variant} colors={colors}>
        {block.text}
      </CalloutBlock>
    )
  }

  if (block.type === "list") {
    return (
      <ul className="space-y-2">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`} />
            <span className="text-[#CCCCCC]">
              {item.label && (
                <span className="font-medium text-white">{item.label}:{" "}</span>
              )}
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  if (block.type === "table") {
    const isBiasTable =
      block.headers.length === 3 &&
      block.headers[0] === "Sesgo" &&
      block.headers[1] === "Qué pasa" &&
      block.headers[2] === "Antídoto operativo"

    if (isBiasTable) {
      return (
        <div className="space-y-3.5">
          {block.rows.map((row, i) => {
            const [rawTitle, description, antidote] = row
            const [numPart, namePart] = rawTitle.split("·")
            const number = (numPart ?? String(i + 1)).trim().padStart(2, "0")
            const title = (namePart ?? rawTitle).trim().toUpperCase()

            return (
              <article key={`${rawTitle}-${i}`} className="relative rounded-xl border border-[#2A2A2A] bg-[#111111] px-5 py-5 sm:px-6 sm:py-5.5">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="type-eyebrow-lg text-[#5BB8D4]">
                    {title}
                  </h4>
                  <span className="shrink-0  text-[28px] leading-none tracking-wide text-[#5BB8D4]/40">
                    {number}
                  </span>
                </div>

                <p className="mt-2 text-[14px] leading-[1.5] text-[#888888]">
                  {description}
                </p>

                <div className="mt-3 border-t border-dashed border-[#2A2A2A] pt-2.5">
                  <p className="type-eyebrow text-[#7DD4C0]">
                    Antídoto
                  </p>
                  <p className="mt-1 text-[14px] leading-[1.5] text-[#FFFFFF]">
                    {antidote}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      )
    }

    return (
      <div className="rounded-xl border border-[#2A2A2A] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1A1A1A] border-b border-[#2A2A2A]">
              {block.headers.map((h, i) => (
                <th key={i} className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.15em] ${colors.accentText}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri} className="border-b border-[#1E1E1E] last:border-0">
                {row.map((cell, ci) => (
                  <td key={ci} className={`px-4 py-3 text-xs leading-relaxed align-top ${ci === 0 ? `font-semibold ${colors.accentText}` : "text-[#CCCCCC]"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (block.type === "columns") {
    // Por defecto: left = negativo (rojo), right = positivo (verde/teal del módulo)
    // Si invertColors=true, se invierte: left = positivo, right = negativo
    const invert = block.invertColors === true
    const leftIsNegative = !invert
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {[block.left, block.right].map((col, ci) => {
          const isNegative = ci === 0 ? leftIsNegative : !leftIsNegative
          return (
            <div key={ci} className="rounded-xl border border-[#2A2A2A] bg-[#111111] overflow-hidden">
              <div className={`border-b border-[#2A2A2A] px-4 py-2.5 ${isNegative ? "bg-[#1A0E0E]" : "bg-[#0E1A12]"}`}>
                <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${isNegative ? "text-[#D4706A]" : colors.accentText}`}>
                  {col.title}
                </p>
              </div>
              <ul className="p-4 space-y-2">
                {col.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#BBBBBB] leading-relaxed">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${isNegative ? "bg-[#D4706A]" : colors.dot}`} />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    )
  }

  if (block.type === "exercise") {
    return (
      <div className="rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] overflow-hidden">
        <div className={`border-b border-[#2A2A2A] px-4 py-3 bg-gradient-to-r ${colors.highlight.replace("bg-", "from-")} to-transparent`}>
          <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${colors.accentText}`}>{block.title}</p>
        </div>
        <div className="px-5 py-4 space-y-3">
          {block.blocks.map((b, i) => (
            <RenderBlock key={i} block={b} colors={colors} moduleNumber={moduleNumber} />
          ))}
        </div>
      </div>
    )
  }

  if (block.type === "reference") {
    return (
      <CrossReference
        targetCourse={block.targetCourse}
        targetModule={block.targetModule}
        reason={block.reason}
        href={block.href}
      />
    )
  }

  if (block.type === "lore_quote") {
    return (
      <LoreQuote
        text={block.text}
        speaker={block.speaker}
        mythReference={block.mythReference}
      />
    )
  }

  if (block.type === "philosophy_quote") {
    return (
      <PhilosophyQuote
        text={block.text}
        author={block.author}
        source={block.source}
      />
    )
  }

  return null
}

function ModuleSection({
  section,
  sectionIndex,
  moduleNumber,
  colors,
}: {
  section: InnerCircleModule["sections"][number]
  sectionIndex: number
  moduleNumber: number
  colors: (typeof moduleColors)["teal"]
}) {
  const sectionId = `ic-m${moduleNumber}-s${sectionIndex + 1}`

  return (
    <div id={sectionId} className={`scroll-mt-24 border-l-2 ${colors.border} bg-[#0F0F0F]`}>
      <div className="px-6 py-4 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-2.5">
          {section.icon && (
            <span className={`text-base leading-none ${colors.icon}`}>{section.icon}</span>
          )}
          <h3 className="type-display-xs text-white uppercase">{section.title}</h3>
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">
        {section.blocks.map((block, i) => (
          <RenderBlock key={i} block={block} colors={colors} moduleNumber={moduleNumber} />
        ))}
      </div>
    </div>
  )
}

export function InnerCircleContent() {
  const [page, setPage] = useState(0)
  const [completedModules, setCompletedModules] = useState<number[]>([])
  const [progressStorageKey, setProgressStorageKey] = useState(COMPLETED_MODULES_STORAGE_KEY)
  const [manifestoStorageKey, setManifestoStorageKey] = useState(MANIFESTO_COMMITMENT_STORAGE_KEY)
  const [isProgressReady, setIsProgressReady] = useState(false)
  const [isCommitmentAccepted, setIsCommitmentAccepted] = useState(false)
  const [isCommitmentHydrated, setIsCommitmentHydrated] = useState(false)
  const [signatureName, setSignatureName] = useState("Tu firma")
  const [membershipStatus, setMembershipStatus] = useState<{
    state: "active" | "expiring_soon"
    expiresAt: string
    daysRemaining: number
  } | null>(null)
  const [isMembershipLoading, setIsMembershipLoading] = useState(true)

  const totalModules = innerCircleContent.length

  useEffect(() => {
    let isMounted = true

    async function hydrateProgress() {
      const { storageKey, modules } = await loadCompletedModules(COMPLETED_MODULES_STORAGE_KEY, totalModules, COURSE_SLUG)
      if (!isMounted) return
      setProgressStorageKey(storageKey)
      setCompletedModules(modules)

      // El recorrido siempre inicia mostrando el Módulo 00.
      setPage(0)
      setIsProgressReady(true)
    }

    void hydrateProgress()
    return () => { isMounted = false }
  }, [totalModules])

  useEffect(() => {
    if (!isProgressReady) return
    persistCompletedModules(progressStorageKey, completedModules, COURSE_SLUG)
  }, [completedModules, isProgressReady, progressStorageKey])

  useEffect(() => {
    let isMounted = true

    async function hydrateCommitment() {
      const scopedStorageKey = await resolveProgressStorageKey(MANIFESTO_COMMITMENT_STORAGE_KEY)
      if (!isMounted) {
        return
      }

      setManifestoStorageKey(scopedStorageKey)

      const scopedAccepted = window.localStorage.getItem(scopedStorageKey)
      const legacyAccepted = window.localStorage.getItem(MANIFESTO_COMMITMENT_STORAGE_KEY)
      const localAccepted = scopedAccepted === "true" || legacyAccepted === "true"

      if (legacyAccepted !== null && scopedStorageKey !== MANIFESTO_COMMITMENT_STORAGE_KEY) {
        window.localStorage.removeItem(MANIFESTO_COMMITMENT_STORAGE_KEY)
      }

      // La base es la fuente de verdad (cross-device); el localStorage queda
      // como caché optimista para no parpadear mientras llega la respuesta.
      let dbAccepted = false
      try {
        const res = await fetch("/api/inner-circle/manifesto", { credentials: "include", cache: "no-store" })
        if (res.ok) {
          const json = (await res.json()) as { accepted?: boolean }
          dbAccepted = Boolean(json.accepted)
        }
      } catch {
        // Sin red: caemos al estado local.
      }
      if (!isMounted) {
        return
      }

      const accepted = localAccepted || dbAccepted

      // Si aceptó en este equipo pero la base no lo tiene, lo registramos.
      if (localAccepted && !dbAccepted) {
        void fetch("/api/inner-circle/manifesto", { method: "POST", credentials: "include" }).catch(() => {})
      }
      if (accepted) {
        window.localStorage.setItem(scopedStorageKey, "true")
      }

      setIsCommitmentAccepted(accepted)
      setIsCommitmentHydrated(true)
    }

    void hydrateCommitment()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isCommitmentAccepted) {
      return
    }

    window.scrollTo({ top: 0, behavior: "auto" })
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`)
    }
  }, [page, isCommitmentAccepted])

  useEffect(() => {
    let isMounted = true

    async function loadMembershipStatus() {
      try {
        const response = await fetch("/api/user/membership-status")
        if (!isMounted) return
        
        if (!response.ok) {
          setIsMembershipLoading(false)
          return
        }

        const data = await response.json()
        if (!isMounted) return
        
        setMembershipStatus(data.status)
      } catch (error) {
        console.error("Error loading membership status:", error)
      } finally {
        if (isMounted) {
          setIsMembershipLoading(false)
        }
      }
    }

    void loadMembershipStatus()
    return () => { isMounted = false }
  }, [])

  const totalPages = innerCircleContent.length + 1
  const completedCount = completedModules.length
  const totalMilestones = totalModules + 1
  const completedMilestones = completedCount + (isCommitmentAccepted ? 1 : 0)
  const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
  const progressSummary = isProgressReady ? `${progressPercentage}% completado` : "Sincronizando progreso..."
  const signatureDate = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date())
  const maxModuleNumber = innerCircleContent[innerCircleContent.length - 1]?.number ?? 10
  const currentModuleNumber = page === 0 ? 0 : innerCircleContent[page - 1]?.number ?? 0
  const currentModule = page === 0 ? null : innerCircleContent[page - 1]

  // Pills numeradas clickeables (mismo patrón que el resto de los cursos).
  // El módulo 0 es el Onboarding/Manifiesto (página 0); los módulos 1-10 son
  // secuenciales, así que página === número de módulo.
  const pillModules = [
    { number: 0, title: "Módulo 00 · Onboarding y Manifiesto" },
    ...innerCircleContent.map((m) => ({ number: m.number, title: m.title })),
  ]
  const pillCompleted = isCommitmentAccepted ? [0, ...completedModules] : completedModules

  useEffect(() => {
    let isMounted = true

    async function hydrateSignatureName() {
      const supabase = createSupabaseBrowserClient()

      if (!supabase) {
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!isMounted || !user) {
        return
      }

      const fullName =
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name.trim()
          : ""

      const emailName = user.email?.split("@")[0] ?? ""
      const normalizedEmailName = emailName
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
        .trim()

      setSignatureName(fullName || normalizedEmailName || "Tu firma")
    }

    void hydrateSignatureName()

    return () => {
      isMounted = false
    }
  }, [])

  function goTo(next: number) {
    setPage(Math.max(0, Math.min(next, totalPages - 1)))
  }

  function isCompleted(moduleNumber: number) {
    return completedModules.includes(moduleNumber)
  }

  function toggleModuleCompletion(moduleNumber: number) {
    setCompletedModules((prev) =>
      prev.includes(moduleNumber)
        ? prev.filter((v) => v !== moduleNumber)
        : [...prev, moduleNumber].sort((a, b) => a - b)
    )
  }

  function acceptManifestoCommitment() {
    window.localStorage.setItem(manifestoStorageKey, "true")
    setIsCommitmentAccepted(true)
    setPage(0)
    // Registramos la aceptación en la base (cross-device + queda registro).
    void fetch("/api/inner-circle/manifesto", { method: "POST", credentials: "include" }).catch(() => {})
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function goToModuleZero() {
    setPage(0)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function goToCourseReadingStart() {
    setPage(0)
    window.requestAnimationFrame(() => {
      const section = document.getElementById("ic-modules-start")
      section?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  function goToInnerCircleInvestmentCourse() {
    window.location.assign("/courses/inner-circle-inversiones")
  }

  function goToInnerCircleTradingCourse() {
    window.location.assign("/courses/inner-circle-trading")
  }

  function formatFecha(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (!isCommitmentHydrated) {
    return null
  }

  if (!isCommitmentAccepted) {
    return (
      <div>
        <InnerCircleRoadmap />
        <InnerCircleManifiesto signatureName={signatureName} signatureDate={signatureDate} />

        <div className="my-10 rounded-2xl border border-[#1E1E1E] bg-[#0F0F0F] p-6 sm:p-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#7DD4C0]">Módulo 00 · Onboarding y Manifiesto</p>
          <h3 className="mt-3 type-display-sm text-white">
            Confirmar compromiso
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#B8B8B8]">
            Al aceptar, confirmás que leíste el manifiesto y que comenzás esta obra con compromiso real.
            Desde ese momento se habilitan los módulos del programa.
          </p>

          {!isCommitmentAccepted ? (
            <button
              onClick={acceptManifestoCommitment}
              className="mt-6 inline-flex items-center justify-center rounded-lg border border-[#7DD4C0]/40 bg-gradient-to-r from-[#5BB8D4]/20 to-[#7DD4C0]/20 px-6 py-3 text-sm font-medium text-[#E9FBF6] transition-colors hover:border-[#7DD4C0]/70 hover:text-white"
            >
              Acepto el compromiso y firmo el manifiesto
            </button>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-[#7DD4C0]/40 bg-[#7DD4C0]/12 px-3 py-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#7DD4C0]">Módulo 00</span>
          <span className="text-[11px] font-medium text-[#E9FBF6]">Completado · Manifiesto firmado</span>
        </div>
        <button
          onClick={goToModuleZero}
          className="rounded-lg border border-[#2A2A2A] px-4 py-2 text-xs uppercase tracking-[0.15em] text-[#B8B8B8] transition-colors hover:border-[#5BB8D4]/60 hover:text-white"
        >
          Ir al módulo 00
        </button>
      </div>

      {page === 0 && (
        <section className="mb-10 rounded-2xl border border-[#1E1E1E] bg-[#0F0F0F]/80 p-4 sm:p-6">
          <div className="mb-4 sm:mb-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#7DD4C0]">Panel interno</p>
            <h3 className="mt-2 type-display-xs text-white">
              Dashboard de contenido Inner Circle
            </h3>
            <p className="mt-2 text-sm text-[#9A9A9A]">
              Esta vista organiza la Obra Maestra y las dos disciplinas técnicas dentro del mismo recorrido.
            </p>
          </div>

          {!isMembershipLoading && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-[#2A2A2A] bg-gradient-to-br from-[#121212] via-[#101010] to-[#0A0A0A]">
              {!membershipStatus ? (
                <div className="grid gap-4 p-5 sm:gap-6 sm:p-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#888888]">
                      Membresía
                    </p>
                    <h3 className="type-display-xs text-white">
                      No tenés una membresía activa
                    </h3>
                    <p className="text-sm text-[#AAAAAA] leading-relaxed max-w-xl">
                      Activa tu membresía mensual para acceder a la comunidad privada de
                      Discord y Telegram del Inner Circle.
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <Link
                      href="/checkout/membresia"
                      className="inline-flex h-11 items-center justify-center rounded-lg border border-[#7DD4C0] bg-[#7DD4C0]/10 px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#7DD4C0] transition-colors hover:bg-[#7DD4C0] hover:text-black"
                    >
                      Activar membresía
                    </Link>
                    <p className="text-[11px] text-[#888888]">$50 USD por 30 días</p>
                  </div>
                </div>
              ) : membershipStatus.state === "active" ? (
                <div className="grid gap-4 p-5 sm:gap-6 sm:p-6 lg:grid-cols-[1.4fr_1fr] lg:items-center border-l-4 border-[#7DD4C0]">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#7DD4C0]" />
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#7DD4C0]">
                        Membresía activa
                      </p>
                    </div>
                    <h3 className="type-display-xs text-white">
                      Inner Circle Community
                    </h3>
                    <p className="text-sm text-[#AAAAAA] leading-relaxed max-w-xl">
                      Tu acceso a Discord y Telegram del Inner Circle está activo. Vence el{" "}
                      <span className="text-white font-medium">{formatFecha(membershipStatus.expiresAt)}</span>.
                      Te quedan {membershipStatus.daysRemaining} días.
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#0D0D0D] px-3 py-2">
                      <Calendar size={14} className="text-[#7DD4C0]" />
                      <span className="text-xs text-[#CCCCCC]">
                        Próxima renovación: {formatFecha(membershipStatus.expiresAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#666666]">
                      $50 USD/mes. Renovación manual desde el botón antes del vencimiento.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 p-5 sm:gap-6 sm:p-6 lg:grid-cols-[1.4fr_1fr] lg:items-center border-l-4 border-[#D4B86A]">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-[#D4B86A]" />
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#D4B86A]">
                        Tu membresía vence pronto
                      </p>
                    </div>
                    <h3 className="type-display-xs text-white">
                      {membershipStatus.daysRemaining === 1
                        ? "Vence mañana"
                        : `Te quedan ${membershipStatus.daysRemaining} días`}
                    </h3>
                    <p className="text-sm text-[#CCCCCC] leading-relaxed max-w-xl">
                      Vence el <span className="text-white font-medium">{formatFecha(membershipStatus.expiresAt)}</span>.
                      Renová para no perder el acceso a Discord y Telegram del Inner Circle.
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <Link
                      href="/checkout/membresia"
                      className="inline-flex h-11 items-center justify-center rounded-lg border border-[#D4B86A] bg-[#D4B86A]/10 px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4B86A] transition-colors hover:bg-[#D4B86A] hover:text-black"
                    >
                      Renovar membresía
                    </Link>
                    <p className="text-[11px] text-[#888888]">$50 USD por 30 días más</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-3">
            <DashboardTrackCard
              tag={innerCircleTracks.obraMaestra.tag}
              title={innerCircleTracks.obraMaestra.title}
              subtitle={innerCircleTracks.obraMaestra.subtitle}
              description={innerCircleTracks.obraMaestra.description}
              items={innerCircleTracks.obraMaestra.items}
              onReadCourse={goToCourseReadingStart}
              accent="gold"
            />
            <DashboardTrackCard
              tag={innerCircleTracks.inversiones.tag}
              title={innerCircleTracks.inversiones.title}
              subtitle={innerCircleTracks.inversiones.subtitle}
              description={innerCircleTracks.inversiones.description}
              items={innerCircleTracks.inversiones.items}
              onReadCourse={goToInnerCircleInvestmentCourse}
              accent="blue"
            />
            <DashboardTrackCard
              tag={innerCircleTracks.trading.tag}
              title={innerCircleTracks.trading.title}
              subtitle={innerCircleTracks.trading.subtitle}
              description={innerCircleTracks.trading.description}
              items={innerCircleTracks.trading.items}
              onReadCourse={goToInnerCircleTradingCourse}
              accent="teal"
            />
          </div>
        </section>
      )}

      <section id="ic-modules-start" className="mb-8 rounded-2xl border border-[#1E1E1E] bg-[linear-gradient(180deg,#111111,#0D0D0D)] p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-[#1E1E1E]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5BB8D4]">Módulos · Obra Interior</span>
          <div className="h-px flex-1 bg-[#1E1E1E]" />
        </div>

        <div className="mt-5 rounded-xl border border-[#1E1E1E] bg-[#121212] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#7DD4C0]">Progreso del curso</p>
              <p className="mt-1 text-sm text-[#BBBBBB]">{progressSummary}</p>
            </div>
            <p className="text-lg font-semibold text-white">{isProgressReady ? `${progressPercentage}%` : "--"}</p>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#1B1B1B]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#5BB8D4] to-[#7DD4C0] transition-all duration-500"
              style={{ width: `${isProgressReady ? progressPercentage : 0}%` }}
            />
          </div>

          <div className="mt-4 flex flex-col items-center gap-2">
            <ModulePills
              modules={pillModules}
              currentNumber={currentModuleNumber}
              completed={pillCompleted}
              onSelect={(moduleNumber) => goTo(moduleNumber)}
              accentActiveClassName="border-[#7DD4C0] bg-[#7DD4C0]/15 text-[#7DD4C0]"
              accentDoneClassName="border-[#7DD4C0]/40 text-[#7DD4C0]/80"
              zeroLabel="00"
            />
            {/* translate="no": Google Translate congela los text nodes que
                toca y el contador dejaba de actualizarse al navegar. */}
            <span className="text-xs text-[#666666]" translate="no">
              Módulo {String(currentModuleNumber).padStart(2, "0")} de {String(maxModuleNumber).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-[#1A1A1A] pt-4 lg:flex-row lg:items-center lg:justify-between">
            <button
              onClick={() => goTo(page - 1)}
              disabled={page === 0}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              ← Módulo anterior
            </button>
            <p className="text-center text-xs text-[#666666] lg:min-w-[140px]" translate="no">
              Módulo {String(currentModuleNumber).padStart(2, "0")} de {String(maxModuleNumber).padStart(2, "0")}
            </p>
            <button
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages - 1}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              Módulo siguiente →
            </button>
          </div>

          {currentModule && (
            <div className="mt-4 border-t border-[#1A1A1A] pt-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#7DD4C0]">Índice rápido del módulo</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {currentModule.sections.map((section, i) => (
                  <a
                    key={`${section.title}-${i}`}
                    href={`#ic-m${currentModule.number}-s${i + 1}`}
                    className="flex items-baseline gap-2 rounded-lg border border-[#222222] bg-[#111111] px-3 py-2 text-xs text-[#BBBBBB] transition-colors hover:border-[#5BB8D4]/60 hover:text-white"
                  >
                    <span className="w-5 shrink-0 text-right font-semibold tabular-nums text-[#7DD4C0]">{i + 1}.</span>
                    <span>{section.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Módulos */}
      <div className="space-y-14">
        {page === 0 ? (
          <div>
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#7DD4C0]/30 bg-[#7DD4C0]/10 font-mono text-sm font-bold text-[#7DD4C0]">
                00
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">Módulo 00</p>
                <h2 className="type-display-sm text-white">
                  Onboarding y Manifiesto
                </h2>
                <p className="mt-1 text-sm text-[#888888]">
                  Base de compromiso antes de comenzar con los módulos 01-10.
                </p>
              </div>
            </div>

            <InnerCircleRoadmap />
            <InnerCircleManifiesto signatureName={signatureName} signatureDate={signatureDate} />

            <div className="rounded-xl border border-[#1E1E1E] bg-[#0F0F0F] p-5 sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#7DD4C0]">Estado del módulo</p>
              <p className="mt-2 text-sm text-[#DDF7F1]">
                Completado. Ya firmaste el manifiesto y habilitaste el recorrido completo.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-lg border border-[#7DD4C0]/30 bg-[#7DD4C0]/10 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-[#DDF7F1]">
                  Completado
                </span>
              </div>
            </div>
          </div>
        ) : (
          (() => {
            if (!currentModule) return null

            const mod = currentModule
            const colors = moduleColors[mod.color]

            return (
              <div key={mod.number}>
                {/* Header del módulo */}
                <div className="mb-6 flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${colors.badge} font-mono text-sm font-bold`}>
                    {String(mod.number).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">Módulo {mod.number}</p>
                    <h2 className="type-display-sm text-white">
                      {mod.title}
                    </h2>
                    <p className="mt-1 text-sm text-[#888888]">{mod.subtitle}</p>
                  </div>
                </div>

                {/* Secciones */}
                <div className="flex flex-col divide-y divide-[#1A1A1A] rounded-xl border border-[#1E1E1E] overflow-hidden">
                  {mod.sections.map((section, si) => (
                    <ModuleSection key={si} section={section} sectionIndex={si} moduleNumber={mod.number} colors={colors} />
                  ))}
                </div>

                {/* Recursos y Anexos */}
                {(() => {
                  const moduleAnnexes = annexes.filter((a) => a.applicableToModules.includes(mod.number))
                  if (moduleAnnexes.length === 0) return null

                  return (
                    <div className="mt-8 rounded-xl border border-[#1E1E1E] bg-[#0F0F0F] p-5 sm:p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm uppercase tracking-[0.2em] text-[#7DD4C0] font-medium">📎 Recursos para este módulo</span>
                        <span className="inline-flex items-center justify-center bg-[#7DD4C0]/10 text-[#7DD4C0] text-xs rounded-full px-2 py-0.5 border border-[#7DD4C0]/20">
                          {moduleAnnexes.length}
                        </span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {moduleAnnexes.map((annex) => (
                          <div
                            key={annex.id}
                            className="group rounded-lg border border-[#222222] bg-[#1A1A1A]/50 p-3 hover:border-[#5BB8D4]/40 hover:bg-[#1A1A1A]/80 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 rounded-full bg-[#5BB8D4]/10 border border-[#5BB8D4]/20 w-7 h-7 flex items-center justify-center text-xs font-semibold text-[#5BB8D4]">
                                {annex.letter}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white leading-tight">{annex.title}</p>
                                <p className="mt-1 text-xs text-[#888888] leading-relaxed">{annex.description}</p>
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[10px] uppercase tracking-[0.05em] text-[#7DD4C0]/70">
                                    {annex.type === "workbook" && "📝 Workbook"}
                                    {annex.type === "template" && "📋 Plantilla"}
                                    {annex.type === "reference" && "📖 Referencia"}
                                    {annex.type === "test" && "✓ Test"}
                                  </span>
                                  <a
                                    className="text-xs text-[#5BB8D4]/70 hover:text-[#5BB8D4] transition-colors underline"
                                    href={`/annexes/pdf/${encodeURIComponent(annex.downloadFileName)}`}
                                    download={annex.downloadFileName}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Descargar PDF
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}

                {/* Botón completar */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => toggleModuleCompletion(mod.number)}
                    className={`rounded-lg border px-5 py-2.5 text-sm transition-colors ${
                      isCompleted(mod.number)
                        ? "border-[#7DD4C0]/40 bg-[#7DD4C0]/10 text-[#7DD4C0] hover:bg-[#7DD4C0]/15"
                        : "border-[#2A2A2A] text-[#CCCCCC] hover:border-[#7DD4C0]/60 hover:text-white"
                    }`}
                  >
                    {isCompleted(mod.number) ? "✓ Módulo completado" : "Marcar módulo como completado"}
                  </button>
                </div>
              </div>
            )
          })()
        )}
      </div>

      {/* Navegación */}
      <div className="mt-14 flex items-center justify-between border-t border-[#1A1A1A] pt-8">
        <button
          onClick={() => goTo(page - 1)}
          disabled={page === 0}
          className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] px-5 py-2.5 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Módulo anterior
        </button>
        <div className="text-center">
          <ModulePills
            modules={pillModules}
            currentNumber={currentModuleNumber}
            completed={pillCompleted}
            onSelect={(moduleNumber) => goTo(moduleNumber)}
            accentActiveClassName="border-[#7DD4C0] bg-[#7DD4C0]/15 text-[#7DD4C0]"
            accentDoneClassName="border-[#7DD4C0]/40 text-[#7DD4C0]/80"
            zeroLabel="00"
          />
          <p className="mt-2 text-xs text-[#555555]" translate="no">
            Módulo {String(currentModuleNumber).padStart(2, "0")} de {String(maxModuleNumber).padStart(2, "0")}
          </p>
        </div>
        <button
          onClick={() => goTo(page + 1)}
          disabled={page === totalPages - 1}
          className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] px-5 py-2.5 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          Módulo siguiente →
        </button>
      </div>
    </div>
  )
}
