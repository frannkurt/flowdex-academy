"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { kickstartInvestmentContent, type Block, type Module } from "@/lib/courses/kickstart-investment-content"
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
const COMPLETED_MODULES_STORAGE_KEY = "flowdex:kickstart-investment:completed-modules:v2"
const COURSE_SLUG = "kickstart-investment"
// URLs de Cal.com (cuenta augusto-holman-flwjaq) para las clases en vivo de
// Kickstart Investment.
const CLASS_SCHEDULING_MILESTONES = {
  2: { requiredModules: [1, 2], label: "Agendar clase 1" },
  3: { requiredModules: [1, 2, 3], label: "Agendar clase 2" },
  4: { requiredModules: [1, 2, 3, 4], label: "Agendar clase 3" },
} as const

const moduleColors = {
  teal: {
    badge: "bg-[#7DD4C0]/10 text-[#7DD4C0] border-[#7DD4C0]/20",
    number: "text-[#7DD4C0]",
    border: "border-l-[#7DD4C0]",
    dot: "bg-[#7DD4C0]",
    highlight: "bg-[#7DD4C0]/8 border-[#7DD4C0]/25 text-[#7DD4C0]",
    icon: "text-[#7DD4C0]",
    gradient: "from-[#7DD4C0]/10 to-transparent",
  },
  blue: {
    badge: "bg-[#5BB8D4]/10 text-[#5BB8D4] border-[#5BB8D4]/20",
    number: "text-[#5BB8D4]",
    border: "border-l-[#5BB8D4]",
    dot: "bg-[#5BB8D4]",
    highlight: "bg-[#5BB8D4]/8 border-[#5BB8D4]/25 text-[#5BB8D4]",
    icon: "text-[#5BB8D4]",
    gradient: "from-[#5BB8D4]/10 to-transparent",
  },
  gold: {
    badge: "bg-[#D4B86A]/10 text-[#D4B86A] border-[#D4B86A]/20",
    number: "text-[#D4B86A]",
    border: "border-l-[#D4B86A]",
    dot: "bg-[#D4B86A]",
    highlight: "bg-[#D4B86A]/8 border-[#D4B86A]/25 text-[#D4B86A]",
    icon: "text-[#D4B86A]",
    gradient: "from-[#D4B86A]/10 to-transparent",
  },
}

function RenderBlock({ block, colors }: { block: Block; colors: (typeof moduleColors)["teal"] }) {
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

  if (block.type === "concept") {
    return (
      <div className={`flex flex-col items-start gap-2 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:gap-3 ${colors.highlight}`}>
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wider">{block.label}</span>
        <span className="hidden h-5 w-px shrink-0 bg-current opacity-35 sm:inline-block" aria-hidden="true" />
        <span className="text-xs leading-relaxed opacity-90 sm:text-[13px] sm:leading-6">{block.text}</span>
      </div>
    )
  }

  if (block.type === "highlight") {
    return (
      <div className="rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] px-5 py-4">
        <p className="text-sm leading-relaxed text-[#E8E8E8] whitespace-pre-line">{block.text}</p>
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
      <div className="rounded-xl border border-[#2A2A2A] bg-[#111111] overflow-hidden">
        <div className="border-b border-[#2A2A2A] px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#888888]">Ejemplo de portafolio</p>
        </div>
        <div className="flex flex-wrap gap-px bg-[#2A2A2A]">
          {block.items.map((item, i) => (
            <div
              key={i}
              style={{ flexBasis, minWidth: 140, flexGrow: 1, flexShrink: 0 }}
              className="flex flex-col items-center justify-start gap-2 bg-[#0F0F0F] px-4 py-3 text-center sm:px-4 sm:py-3.5"
            >
              <p className={`text-2xl font-bold leading-tight ${colors.number}`}>{item.label}</p>
              <p className="max-w-[24ch] text-xs leading-[1.45] text-[#888888]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (block.type === "image") {
    return (
      <figure className="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0F0F0F]">
        {/* Dynamic content image with graceful fallback behavior. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.src}
          alt={block.alt}
          className="h-auto w-full object-cover"
          onError={(event) => {
            const target = event.currentTarget
            target.style.display = "none"
            const fallback = target.nextElementSibling as HTMLElement | null
            if (fallback) {
              fallback.style.display = "flex"
            }
          }}
        />
        <div
          className="hidden min-h-[220px] items-center justify-center px-6 py-8 text-center text-sm text-[#8B8B8B]"
          aria-hidden="true"
        >
          Imagen pendiente de carga
        </div>
        {block.caption ? (
          <figcaption className="border-t border-[#2A2A2A] px-4 py-3 text-xs text-[#8E8E8E]">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  if (block.type === "callout") {
    return (
      <CalloutBlock label={block.label} variant={block.variant} colors={colors}>
        {block.text}
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
  const sectionId = `ki-m${moduleNumber}-s${sectionIndex + 1}`

  return (
    <div id={sectionId} className={`scroll-mt-24 border-l-2 ${colors.border} bg-[#0F0F0F]`}>
      <div className="px-6 py-4 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-2.5">
          {section.icon && (
            <span className={`text-base leading-none ${colors.icon}`}>{section.icon}</span>
          )}
          <h3 className="font-semibold text-white text-base sm:text-lg tracking-wide">{section.title}</h3>
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">
        {section.blocks.map((block, i) => (
          <RenderBlock key={i} block={block} colors={colors} />
        ))}
      </div>
    </div>
  )
}

export function KickstartInvestmentContent() {
  const [page, setPage] = useState(0)
  const [initialModuleParam] = useState(() => getModuleParamFromUrl())
  const [completedModules, setCompletedModules] = useState<number[]>([])
  const [progressStorageKey, setProgressStorageKey] = useState(COMPLETED_MODULES_STORAGE_KEY)
  const [isProgressReady, setIsProgressReady] = useState(false)

  // Intención de scroll al cambiar de módulo:
  // - "top": al hidratar / retomar (arranca arriba de todo).
  // - "stay": navegación desde los controles de arriba (no movemos el scroll).
  // - "index": navegación desde los controles de abajo (lo llevamos al índice
  //   rápido del nuevo módulo).
  const scrollIntentRef = useRef<"top" | "stay" | "index">("top")

  // Incluir módulo 0 (Apertura Estratégica) como primer módulo real
  const realModules = useMemo(() => kickstartInvestmentContent, [])
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


      // Si la URL trae ?m=N válido, ese módulo manda. Si no, arrancamos por el
      // módulo 0 (Apertura Estratégica) salvo que haya progreso previo.
      const urlModule = initialModuleParam
        ? realModules.find((module) => module.number === initialModuleParam)
        : undefined
      let resumeIndex = 0
      if (urlModule) {
        const idx = kickstartInvestmentContent.findIndex((module) => module.number === urlModule.number)
        if (idx >= 0) resumeIndex = Math.floor(idx / MODULES_PER_PAGE)
      } else if (modules.length > 0) {
        const firstIncompleteModule = realModules.find((module) => !modules.includes(module.number))
        const resumeModule = firstIncompleteModule ?? realModules[realModules.length - 1]
        if (resumeModule) {
          const idx = kickstartInvestmentContent.findIndex((module) => module.number === resumeModule.number)
          if (idx >= 0) resumeIndex = Math.floor(idx / MODULES_PER_PAGE)
        }
      }
      setPage(resumeIndex)

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
    const current = kickstartInvestmentContent[page * MODULES_PER_PAGE]
    if (current && current.number > 0) {
      setModuleParamInUrl(current.number)
    }
    const intent = scrollIntentRef.current
    scrollIntentRef.current = "stay"
    if (intent === "top") {
      window.scrollTo({ top: 0, behavior: "auto" })
    } else if (intent === "index") {
      document.getElementById("ki-modulo-indice")?.scrollIntoView({ behavior: "auto", block: "start" })
    }
  }, [page, isProgressReady])

  const totalPages = Math.ceil(kickstartInvestmentContent.length / MODULES_PER_PAGE)
  const completedCount = completedModules.length
  // Solo módulos > 0 cuentan para el total real
  const totalMainModules = kickstartInvestmentContent.filter((mod) => mod.number > 0).length
  const progressPercentage = totalMainModules > 0 ? Math.round((completedCount / totalMainModules) * 100) : 0
  const progressSummary = isProgressReady ? `${progressPercentage}% completado` : "Sincronizando progreso..."
  const visibleModules = kickstartInvestmentContent.slice(
    page * MODULES_PER_PAGE,
    page * MODULES_PER_PAGE + MODULES_PER_PAGE
  )
  const currentModule = visibleModules[0]
  const currentModuleColors = moduleColors[(currentModule?.color as keyof typeof moduleColors) ?? "blue"]

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

  return (
    <div className="mt-10">
      <CourseBreadcrumb
        courseName="Kickstart Investment"
        moduleLabel={currentModule?.number > 0 ? `Módulo ${currentModule.number}` : (currentModule?.title ?? "Curso")}
        accentClassName="text-[#5BB8D4]"
      />
      <div className="mb-8 overflow-hidden rounded-2xl border border-[#1E1E1E] bg-[#101010]">
        <div className="grid gap-4 p-5 sm:grid-cols-[1.2fr_0.8fr] sm:p-6">
          <div>
            <p className={`text-[11px] uppercase tracking-[0.2em] ${currentModuleColors.number}`}>Kickstart Investment</p>
            <h2 className="mt-2 type-display-sm text-white">
              {currentModule?.number > 0 ? `Módulo ${currentModule.number}` : currentModule?.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#B9B9B9]">
              {currentModule?.subtitle}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#5BB8D4]/35 bg-[#5BB8D4]/10 px-3 py-2 text-xs text-[#CDEAF3]">
              Enfoque guiado de inversión: estudiá, aplicá y consolidá criterio por módulo.
            </div>
          </div>

          <div className="relative min-h-[160px] overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0C0C0C]">
            <Image
              src="/Flowdex kickstart investment 1x1.png"
              alt={`Módulo ${currentModule?.number ?? 1} - Kickstart Investment`}
              fill
              sizes="(max-width: 640px) 100vw, 360px"
              className="object-cover object-center opacity-85"
            />
          </div>
        </div>
      </div>

      {/* Study progress */}
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
          <p className="mt-1 text-sm text-[#D4D4D4]">Evalua contexto, tesis y riesgo antes de asignar capital.</p>
        </div>
        <div className="rounded-xl border border-[#2A2A2A] bg-[#101010] p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#5BB8D4]">Ritmo</p>
          <p className="mt-1 text-sm text-[#D4D4D4]">Sosten una cadencia estable y evita decisiones por ruido de corto plazo.</p>
        </div>
        <div className="rounded-xl border border-[#2A2A2A] bg-[#101010] p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#5BB8D4]">Objetivo</p>
          <p className="mt-1 text-sm text-[#D4D4D4]">Construir decisiones de cartera solidas y sostenibles en el tiempo.</p>
        </div>
      </div>

      <div id="ki-modulo-indice" className="mb-8 scroll-mt-24 rounded-xl border border-[#1E1E1E] bg-[#0F0F0F] p-4 sm:p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#7DD4C0]">Índice rápido del módulo</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {currentModule.sections.map((section, i) => (
            <a
              key={`${section.title}-${i}`}
              href={`#ki-m${currentModule.number}-s${i + 1}`}
              className="flex items-baseline gap-2 rounded-lg border border-[#222222] bg-[#111111] px-3 py-2 text-xs text-[#BBBBBB] transition-colors hover:border-[#5BB8D4]/60 hover:text-white"
            >
              <span className="w-5 shrink-0 text-right font-semibold tabular-nums text-[#7DD4C0]">{i + 1}.</span>
              <span>{section.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Page indicator */}
      <div className="mb-8 flex items-center gap-3">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, "stay")}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === page
                ? "w-8 bg-[#7DD4C0]"
                : "w-3 bg-[#2A2A2A] hover:bg-[#444444]"
            }`}
            aria-label={`Página ${i + 1}`}
          />
        ))}
        <span className="ml-1 text-xs text-[#555555]">
          {currentModule?.number > 0 ? `Módulo ${currentModule.number} de ${totalMainModules}` : "Apertura"}
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
              const idx = kickstartInvestmentContent.findIndex((m) => m.number === moduleNumber)
              if (idx >= 0) goTo(idx, "stay")
            }}
            accentActiveClassName="border-[#5BB8D4] bg-[#5BB8D4]/15 text-[#5BB8D4]"
            accentDoneClassName="border-[#5BB8D4]/40 text-[#5BB8D4]/80"
          />
        </div>

        <button
          onClick={() => goTo(page + 1, "stay")}
          disabled={page === totalPages - 1}
          className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          Módulo siguiente →
        </button>
      </div>

      {/* Modules */}
      <div className="space-y-14">
        {visibleModules.map((mod) => {
          const colors = moduleColors[mod.color]
          const isOpening = mod.number === 0
          const schedulingMilestone = CLASS_SCHEDULING_MILESTONES[mod.number as keyof typeof CLASS_SCHEDULING_MILESTONES]
          const canScheduleClass = schedulingMilestone
            ? schedulingMilestone.requiredModules.every((moduleNumber) => isCompleted(moduleNumber))
            : false
          const requiredModulesLabel = schedulingMilestone?.requiredModules.join(" y ")

          return (
            <div key={`${mod.number}-${mod.title}`}>
              <div className="mb-6 flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${colors.badge} font-mono text-sm font-bold`}>
                  {isOpening ? "AP" : String(mod.number).padStart(2, "0")}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">
                    {isOpening ? "Apertura de conocimiento" : `Módulo ${mod.number}`}
                  </p>
                  <h2 className="type-display-xs text-white">
                    {mod.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#888888]">{mod.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-col divide-y divide-[#1A1A1A] rounded-xl border border-[#1E1E1E] overflow-hidden">
                {mod.sections.map((section, si) => (
                  <ModuleSection key={si} section={section} sectionIndex={si} moduleNumber={mod.number} colors={colors} />
                ))}
              </div>

              {!isOpening && (
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

                  {schedulingMilestone &&
                    (canScheduleClass ? (
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
                        title={`Completa los módulos ${requiredModulesLabel} para habilitar el agendado`}
                      >
                        {`Se habilita al completar módulos ${requiredModulesLabel}`}
                      </button>
                    ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation */}
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
              const idx = kickstartInvestmentContent.findIndex((m) => m.number === moduleNumber)
              if (idx >= 0) goTo(idx, "index")
            }}
            accentActiveClassName="border-[#5BB8D4] bg-[#5BB8D4]/15 text-[#5BB8D4]"
            accentDoneClassName="border-[#5BB8D4]/40 text-[#5BB8D4]/80"
          />
        </div>

        <button
          onClick={() => goTo(page + 1, "index")}
          disabled={page === totalPages - 1}
          className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] px-5 py-2.5 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          Módulo siguiente →
        </button>
      </div>

    </div>
  )
}
