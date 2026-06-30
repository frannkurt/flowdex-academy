"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { tradingLabContent } from "@/lib/courses/trading-lab-content"
import { type Block, type Module } from "@/lib/courses/kickstart-investment-content"
import { loadCompletedModules, persistCompletedModules, getModuleParamFromUrl, setModuleParamInUrl } from "@/lib/course-progress"
import { CrossReference } from "@/components/courses/CrossReference"
import { CalloutBlock } from "@/components/courses/CalloutBlock"
import { ToolLink } from "@/components/courses/ToolLink"
import { LoreQuote } from "@/components/courses/LoreQuote"
import { ExamButton } from "@/components/courses/ExamButton"
import { CourseBreadcrumb } from "@/components/courses/CourseBreadcrumb"
import { ModulePills } from "@/components/courses/ModulePills"
import { CourseTradingViewWidget } from "@/components/herramientas/tradingview/CourseTradingViewWidget"

const MODULES_PER_PAGE = 1
const COMPLETED_MODULES_STORAGE_KEY = "flowdex:trading-lab:completed-modules:v1"
const COURSE_SLUG = "trading-lab"
// URLs de Cal.com (cuenta franco-escudero-5idua4) para las clases en vivo de
// Trading Lab.
const CLASS_SCHEDULING_MILESTONES = {
  2: { requiredModules: [1, 2], label: "Agendar clase 1" },
  3: { requiredModules: [1, 2, 3], label: "Agendar clase 2" },
  4: { requiredModules: [1, 2, 3, 4], label: "Agendar clase 3" },
}

const moduleColors = {
  teal: {
    badge: "bg-[#7DD4C0]/10 text-[#7DD4C0] border-[#7DD4C0]/20",
    number: "text-[#7DD4C0]",
    border: "border-l-[#7DD4C0]",
    dot: "bg-[#7DD4C0]",
    highlight: "bg-[#7DD4C0]/8 border-[#7DD4C0]/25 text-[#7DD4C0]",
    icon: "text-[#7DD4C0]",
  },
  blue: {
    badge: "bg-[#5BB8D4]/10 text-[#5BB8D4] border-[#5BB8D4]/20",
    number: "text-[#5BB8D4]",
    border: "border-l-[#5BB8D4]",
    dot: "bg-[#5BB8D4]",
    highlight: "bg-[#5BB8D4]/8 border-[#5BB8D4]/25 text-[#5BB8D4]",
    icon: "text-[#5BB8D4]",
  },
  gold: {
    badge: "bg-[#D4B86A]/10 text-[#D4B86A] border-[#D4B86A]/20",
    number: "text-[#D4B86A]",
    border: "border-l-[#D4B86A]",
    dot: "bg-[#D4B86A]",
    highlight: "bg-[#D4B86A]/8 border-[#D4B86A]/25 text-[#D4B86A]",
    icon: "text-[#D4B86A]",
  },
}

function renderTextWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)

  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={`link-${i}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-[#5BB8D4]/60 underline-offset-4 transition-colors hover:text-[#7DD4C0]"
        >
          {part}
        </a>
      )
    }

    return <span key={`text-${i}`}>{part}</span>
  })
}

function RenderBlock({ block, colors }: { block: Block; colors: (typeof moduleColors)["teal"] }) {
  if (block.type === "intro") {
    return (
      <p className="border-l-2 border-[#2A2A2A] pl-4 text-[15px] leading-7 italic text-[#E8E8E8]">
        {renderTextWithLinks(block.text)}
      </p>
    )
  }

  if (block.type === "paragraph") {
    return <p className="text-[15px] leading-7 text-[#CFCFCF]">{renderTextWithLinks(block.text)}</p>
  }

  if (block.type === "list") {
    return (
      <ul className="space-y-2.5">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[15px] leading-7">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`} />
            <span className="text-[#CCCCCC]">
              {item.label && <span className="font-medium text-white">{item.label}: </span>}
              {renderTextWithLinks(item.text)}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  if (block.type === "concept") {
    return (
      <div className={`flex flex-col items-start gap-2 rounded-lg border px-4 py-3.5 sm:flex-row sm:items-center sm:gap-3 ${colors.highlight}`}>
        <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider">{block.label}</span>
        <span className="hidden h-5 w-px shrink-0 bg-current opacity-35 sm:inline-block" aria-hidden="true" />
        <span className="text-xs leading-relaxed opacity-90 sm:text-[13px] sm:leading-6">{renderTextWithLinks(block.text)}</span>
      </div>
    )
  }

  if (block.type === "highlight") {
    return (
      <div className="rounded-xl border border-[#2A2A2A] bg-[#171717] px-5 py-4">
        <p className="text-[15px] leading-7 text-[#E8E8E8] whitespace-pre-line">{renderTextWithLinks(block.text)}</p>
      </div>
    )
  }

  if (block.type === "example") {
    const itemCount = block.items.length
    const cols =
      itemCount <= 5
        ? itemCount
        : itemCount === 6 || itemCount === 9
          ? 3
          : 4
    const flexBasis = `calc(${100 / cols}% - 1px)`
    return (
      <div className="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#111111]">
        <div className="border-b border-[#2A2A2A] px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#888888]">Ejemplo</p>
        </div>
        <div className="flex flex-wrap gap-px bg-[#2A2A2A]">
          {block.items.map((item, i) => (
            <div
              key={i}
              style={{ flexBasis, minWidth: 140, flexGrow: 1, flexShrink: 0 }}
              className="flex flex-col items-center justify-start gap-2 bg-[#0F0F0F] px-4 py-3 text-center sm:px-5 sm:py-3.5"
            >
              <p className={`text-sm font-bold leading-snug ${colors.number}`}>{item.label}</p>
              <p className="max-w-[24ch] text-xs leading-[1.45] text-[#888888]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (block.type === "image") {
    return (
      <div className="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0C0C0C]">
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <Image
            src={block.src}
            alt={block.alt}
            fill
            sizes="(max-width: 640px) 100vw, 720px"
            className="object-contain object-center"
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

  if (block.type === "callout") {
    return (
      <CalloutBlock label={block.label} variant={block.variant} colors={colors}>
        {renderTextWithLinks(block.text)}
      </CalloutBlock>
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

  if (block.type === "tool") {
    return (
      <ToolLink
        toolName={block.toolName}
        description={block.description}
        href={block.href}
        ctaLabel={block.ctaLabel}
        eyebrow={block.eyebrow}
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

  if (block.type === "tv_widget") {
    return (
      <CourseTradingViewWidget
        kind={block.widget}
        symbol={block.symbol}
        label={block.label}
        caption={block.caption}
        height={block.height}
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
  section: Module["sections"][number]
  sectionIndex: number
  moduleNumber: number
  colors: (typeof moduleColors)["teal"]
}) {
  const sectionId = `tl-m${moduleNumber}-s${sectionIndex + 1}`

  return (
    <div id={sectionId} className={`scroll-mt-24 border-l-2 ${colors.border} bg-[#0F0F0F]`}>
      <div className="border-b border-[#1A1A1A] px-6 py-4">
        <div className="flex items-center gap-2.5">
          {section.icon && <span className={`text-base leading-none ${colors.icon}`}>{section.icon}</span>}
          <h3 className="type-headline text-white">{section.title}</h3>
        </div>
      </div>
      <div className="space-y-4 px-6 py-5">
        {section.blocks.map((block, i) => (
          <RenderBlock key={i} block={block} colors={colors} />
        ))}
      </div>
    </div>
  )
}

export function TradingLabContent() {
  const [page, setPage] = useState(0)
  const [initialModuleParam] = useState(() => getModuleParamFromUrl())
  const [completedModules, setCompletedModules] = useState<number[]>([])
  const [progressStorageKey, setProgressStorageKey] = useState(COMPLETED_MODULES_STORAGE_KEY)
  const [isProgressReady, setIsProgressReady] = useState(false)

  const realModules = useMemo(() => tradingLabContent.filter((mod) => mod.number > 0), [])
  const totalRealModules = realModules.length

  useEffect(() => {
    let isMounted = true

    async function hydrateProgress() {
      const { storageKey, modules } = await loadCompletedModules(COMPLETED_MODULES_STORAGE_KEY, totalRealModules, COURSE_SLUG)

      if (!isMounted) {
        return
      }

      setProgressStorageKey(storageKey)
      setCompletedModules(modules)

      const firstIncompleteModule = realModules.find((module) => !modules.includes(module.number))
      const resumeModule = firstIncompleteModule ?? realModules[realModules.length - 1]
      const urlModule = initialModuleParam
        ? realModules.find((module) => module.number === initialModuleParam)
        : undefined
      const targetModule = urlModule ?? resumeModule

      if (targetModule) {
        const resumeIndex = tradingLabContent.findIndex((module) => module.number === targetModule.number)
        if (resumeIndex >= 0) {
          setPage(Math.floor(resumeIndex / MODULES_PER_PAGE))
        }
      }

      setIsProgressReady(true)
    }

    void hydrateProgress()

    return () => {
      isMounted = false
    }
  }, [realModules, totalRealModules, initialModuleParam])

  useEffect(() => {
    if (!isProgressReady) {
      return
    }

    persistCompletedModules(progressStorageKey, completedModules, COURSE_SLUG)
  }, [completedModules, isProgressReady, progressStorageKey])

  useEffect(() => {
    if (!isProgressReady) {
      return
    }
    const current = tradingLabContent[page * MODULES_PER_PAGE]
    if (current && current.number > 0) {
      setModuleParamInUrl(current.number)
    }
    const intent = scrollIntentRef.current
    scrollIntentRef.current = "stay"
    if (intent === "top") {
      window.scrollTo({ top: 0, behavior: "auto" })
    } else if (intent === "index") {
      document.getElementById("tl-modulo-indice")?.scrollIntoView({ behavior: "auto", block: "start" })
    }
  }, [page, isProgressReady])

  const totalPages = Math.ceil(tradingLabContent.length / MODULES_PER_PAGE)
  const completedCount = completedModules.length
  const progressPercentage = totalRealModules > 0 ? Math.round((completedCount / totalRealModules) * 100) : 0
  const progressSummary = isProgressReady ? `${progressPercentage}% completado` : "Sincronizando progreso..."
  const visibleModules = tradingLabContent.slice(
    page * MODULES_PER_PAGE,
    page * MODULES_PER_PAGE + MODULES_PER_PAGE
  )

  const scrollIntentRef = useRef<"top" | "stay" | "index">("top")

  function goTo(next: number, intent: "top" | "stay" | "index" = "stay") {
    scrollIntentRef.current = intent
    setPage(Math.max(0, Math.min(next, totalPages - 1)))
  }

  function isCompleted(moduleNumber: number) {
    return completedModules.includes(moduleNumber)
  }

  function toggleModuleCompletion(moduleNumber: number) {
    if (moduleNumber <= 0) {
      return
    }

    setCompletedModules((prev) => {
      if (prev.includes(moduleNumber)) {
        return prev.filter((value) => value !== moduleNumber)
      }
      return [...prev, moduleNumber].sort((a, b) => a - b)
    })
  }

  const currentModule = visibleModules[0]
  const currentModuleColors = moduleColors[(currentModule?.color as keyof typeof moduleColors) ?? "blue"]

  return (
    <div className="mt-10">
      <CourseBreadcrumb
        courseName="Trading Lab"
        moduleLabel={currentModule?.number > 0 ? `Módulo ${currentModule.number}` : (currentModule?.title ?? "Curso")}
        accentClassName="text-[#7DD4C0]"
      />
      <div className="mb-8 overflow-hidden rounded-2xl border border-[#1E1E1E] bg-[#101010]">
        <div className="grid gap-4 p-5 sm:grid-cols-[1.2fr_0.8fr] sm:p-6">
          <div>
            <p className={`text-[11px] uppercase tracking-[0.2em] ${currentModuleColors.number}`}>Trading Lab</p>
            <h2 className="mt-2 type-display-sm text-white">
              {currentModule?.number > 0 ? `Módulo ${currentModule.number}` : currentModule?.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#B9B9B9]">
              {currentModule?.subtitle}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#7DD4C0]/35 bg-[#7DD4C0]/10 px-3 py-2 text-xs text-[#D8F2EB]">
              Enfoque guiado de laboratorio: criterio, ejecucion y feedback real.
            </div>
          </div>

          <div className="relative min-h-[160px] overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0C0C0C]">
            <Image
              src="/flowdex trading lab 1x1.png"
              alt={`Módulo ${currentModule?.number ?? 1} - Trading Lab`}
              fill
              sizes="(max-width: 640px) 100vw, 360px"
              className="object-cover object-center opacity-85 invert"
            />
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-[#1E1E1E] bg-[#111111]/80 p-4 sm:p-5">
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
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#2A2A2A] bg-[#101010] p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#5BB8D4]">Metodo</p>
          <p className="mt-1 text-sm text-[#D4D4D4]">Aplica cada modulo con registro operativo y revision de ejecucion posterior.</p>
        </div>
        <div className="rounded-xl border border-[#2A2A2A] bg-[#101010] p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#5BB8D4]">Ritmo</p>
          <p className="mt-1 text-sm text-[#D4D4D4]">Menos cantidad, mas calidad: sesiones enfocadas con criterio y gestion de riesgo.</p>
        </div>
        <div className="rounded-xl border border-[#2A2A2A] bg-[#101010] p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#5BB8D4]">Objetivo</p>
          <p className="mt-1 text-sm text-[#D4D4D4]">Prioriza sesiones enfocadas y consistencia semanal por encima del volumen.</p>
        </div>
      </div>

      <div id="tl-modulo-indice" className="mb-8 scroll-mt-24 rounded-xl border border-[#1E1E1E] bg-[#0F0F0F] p-4 sm:p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#7DD4C0]">Índice rápido del módulo</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {visibleModules[0].sections.map((section, i) => (
            <a
              key={`${section.title}-${i}`}
              href={`#tl-m${visibleModules[0].number}-s${i + 1}`}
              className="flex items-baseline gap-2 rounded-lg border border-[#222222] bg-[#111111] px-3 py-2 text-xs text-[#BBBBBB] transition-colors hover:border-[#5BB8D4]/60 hover:text-white"
            >
              <span className="w-5 shrink-0 text-right font-semibold tabular-nums text-[#7DD4C0]">{i + 1}.</span>
              <span>{section.title}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="mb-8 flex items-center gap-3">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, "stay")}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === page ? "w-8 bg-[#7DD4C0]" : "w-3 bg-[#2A2A2A] hover:bg-[#444444]"}`}
            aria-label={`Página ${i + 1}`}
          />
        ))}
        <span className="ml-1 text-xs text-[#555555]">
          {currentModule?.number > 0 ? `Módulo ${currentModule.number} de ${realModules.length}` : "Apertura"}
        </span>
      </div>

      <div className="mb-8 flex items-center justify-between gap-3 rounded-xl border border-[#1E1E1E] bg-[#0F0F0F] p-3 sm:p-4">
        <button
          onClick={() => goTo(page - 1, "stay")}
          disabled={page === 0}
          className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Módulo anterior
        </button>

        <div className="text-center">
          <ModulePills
            modules={realModules}
            currentNumber={currentModule?.number ?? 0}
            completed={completedModules}
            onSelect={(moduleNumber) => {
              const idx = tradingLabContent.findIndex((m) => m.number === moduleNumber)
              if (idx >= 0) goTo(idx, "stay")
            }}
            accentActiveClassName="border-[#7DD4C0] bg-[#7DD4C0]/15 text-[#7DD4C0]"
            accentDoneClassName="border-[#7DD4C0]/40 text-[#7DD4C0]/80"
          />
        </div>

        <button
          onClick={() => goTo(page + 1, "stay")}
          disabled={page >= totalPages - 1}
          className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          Módulo siguiente →
        </button>
      </div>

      <div className="space-y-14">
        {visibleModules.map((mod) => {
          const colors = moduleColors[mod.color]
          const schedulingMilestone = CLASS_SCHEDULING_MILESTONES[mod.number as keyof typeof CLASS_SCHEDULING_MILESTONES]
          const canScheduleClass = Boolean(
            schedulingMilestone?.requiredModules.every((requiredModule) => completedModules.includes(requiredModule))
          )

          return (
            <div key={`${mod.number}-${mod.title}`}>
              <div className="mb-6 flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${colors.badge} font-mono text-sm font-bold`}>
                  {String(mod.number).padStart(2, "0")}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">Módulo {mod.number}</p>
                  <h2 className="type-display-xs text-white">{mod.title}</h2>
                  <p className="mt-1 text-sm text-[#888888]">{mod.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-col divide-y divide-[#1A1A1A] overflow-hidden rounded-xl border border-[#1E1E1E]">
                {mod.sections.map((section, si) => (
                  <ModuleSection key={si} section={section} sectionIndex={si} moduleNumber={mod.number} colors={colors} />
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => toggleModuleCompletion(mod.number)}
                  className={`rounded-lg border px-5 py-2.5 text-sm transition-colors ${
                    isCompleted(mod.number)
                      ? "border-[#7DD4C0]/40 bg-[#7DD4C0]/10 text-[#7DD4C0] hover:bg-[#7DD4C0]/15"
                      : "border-[#2A2A2A] text-[#CCCCCC] hover:border-[#7DD4C0]/60 hover:text-white"
                  }`}
                >
                  {isCompleted(mod.number) ? "Módulo completado" : "Marcar módulo como completado"}
                </button>

                {mod.number > 0 && (
                  <ExamButton courseSlug={COURSE_SLUG} moduleNumber={mod.number} />
                )}

                {schedulingMilestone ? (
                  canScheduleClass ? (
                    <a
                      href={`/api/clases/${COURSE_SLUG}/${mod.number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-[#7DD4C0]/40 bg-gradient-to-r from-[#5BB8D4]/25 to-[#7DD4C0]/25 px-5 py-2.5 text-sm text-[#DDF7F1] transition-colors hover:border-[#7DD4C0]/70 hover:text-white"
                    >
                      {schedulingMilestone.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="rounded-lg border border-[#2A2A2A] px-5 py-2.5 text-sm text-[#666666] opacity-70"
                      title="Completa los módulos 1 y 2 para habilitar el agendado"
                    >
                      Se habilita al completar módulos 1 y 2
                    </button>
                  )
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-14 flex items-center justify-between border-t border-[#1A1A1A] pt-8">
        <button
          onClick={() => goTo(page - 1, "index")}
          disabled={page === 0}
          className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] px-5 py-2.5 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Módulo anterior
        </button>

        <div className="text-center">
          <ModulePills
            modules={realModules}
            currentNumber={currentModule?.number ?? 0}
            completed={completedModules}
            onSelect={(moduleNumber) => {
              const idx = tradingLabContent.findIndex((m) => m.number === moduleNumber)
              if (idx >= 0) goTo(idx, "index")
            }}
            accentActiveClassName="border-[#7DD4C0] bg-[#7DD4C0]/15 text-[#7DD4C0]"
            accentDoneClassName="border-[#7DD4C0]/40 text-[#7DD4C0]/80"
          />
        </div>

        <button
          onClick={() => goTo(page + 1, "index")}
          disabled={page >= totalPages - 1}
          className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] px-5 py-2.5 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          Módulo siguiente →
        </button>
      </div>
    </div>
  )
}
