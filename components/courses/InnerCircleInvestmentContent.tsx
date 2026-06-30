"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { loadCompletedModules, persistCompletedModules, getModuleParamFromUrl, setModuleParamInUrl } from "@/lib/course-progress"
import { innerCircleInvestmentContent, type Block, type Module } from "@/lib/courses/inner-circle-investment-content"
import { CrossReference } from "@/components/courses/CrossReference"
import { CalloutBlock } from "@/components/courses/CalloutBlock"
import { LoreQuote } from "@/components/courses/LoreQuote"
import { PhilosophyQuote } from "@/components/courses/PhilosophyQuote"
import { ExamButton } from "@/components/courses/ExamButton"
import { CourseBreadcrumb } from "@/components/courses/CourseBreadcrumb"
import { ModulePills } from "@/components/courses/ModulePills"

const MODULES_PER_PAGE = 1
const COMPLETED_MODULES_STORAGE_KEY = "flowdex:inner-circle-investment:completed-modules:v1"
const COURSE_SLUG = "inner-circle-inversiones"

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

function RenderBlock({ block, colors }: { block: Block; colors: (typeof moduleColors)["teal"] }) {
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
      <p className="border-l-2 border-[#2A2A2A] pl-4 text-base leading-relaxed text-[#E0E0E0] italic">
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
        {block.items.map((item, index) => (
          <li key={`${item.text}-${index}`} className="flex items-start gap-3 text-sm">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`} />
            <span className="text-[#CCCCCC]">
              {item.label ? <span className="font-medium text-white">{item.label}: </span> : null}
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  if (block.type === "highlight") {
    return (
      <div className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-5 py-4">
        <p className="text-sm leading-relaxed text-[#E8E8E8] whitespace-pre-line">{block.text}</p>
      </div>
    )
  }

  if (block.type === "callout") {
    return (
      <CalloutBlock label={block.label} variant={block.variant} colors={colors}>
        {block.text}
      </CalloutBlock>
    )
  }

  if (block.type === "table") {
    return (
      <div className="overflow-hidden rounded-xl border border-[#2A2A2A]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2A2A] bg-[#1A1A1A]">
              {block.headers.map((header, index) => (
                <th key={`${header}-${index}`} className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.15em] ${colors.accentText}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="border-b border-[#1E1E1E] last:border-0">
                {row.map((cell, cellIndex) => (
                  <td key={`cell-${rowIndex}-${cellIndex}`} className={`px-4 py-3 align-top text-xs leading-relaxed ${cellIndex === 0 ? `font-semibold ${colors.accentText}` : "text-[#CCCCCC]"}`}>
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
    return <LoreQuote text={block.text} speaker={block.speaker} mythReference={block.mythReference} />
  }

  if (block.type === "philosophy_quote") {
    return <PhilosophyQuote text={block.text} author={block.author} source={block.source} />
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
  const sectionId = `ici-m${moduleNumber}-s${sectionIndex + 1}`

  return (
    <div id={sectionId} className={`scroll-mt-24 border-l-2 ${colors.border} bg-[#0F0F0F]`}>
      <div className="border-b border-[#1A1A1A] px-6 py-4">
        <div className="flex items-center gap-2.5">
          {section.icon ? <span className={`text-base leading-none ${colors.icon}`}>{section.icon}</span> : null}
          <h3 className="text-base font-semibold tracking-wide text-white sm:text-lg">{section.title}</h3>
        </div>
      </div>
      <div className="space-y-4 px-6 py-5">
        {section.blocks.map((block, index) => (
          <RenderBlock key={`${section.title}-${index}`} block={block} colors={colors} />
        ))}
      </div>
    </div>
  )
}

export function InnerCircleInvestmentContent() {
  const [page, setPage] = useState(0)
  const [initialModuleParam] = useState(() => getModuleParamFromUrl())
  const [completedModules, setCompletedModules] = useState<number[]>([])
  const [progressStorageKey, setProgressStorageKey] = useState(COMPLETED_MODULES_STORAGE_KEY)
  const [isProgressReady, setIsProgressReady] = useState(false)
  const scrollIntentRef = useRef<"top" | "stay" | "index">("top")

  const modules = useMemo(() => innerCircleInvestmentContent, [])
  const totalModules = modules.length

  useEffect(() => {
    let isMounted = true

    async function hydrateProgress() {
      const { storageKey, modules: storedModules } = await loadCompletedModules(COMPLETED_MODULES_STORAGE_KEY, totalModules, COURSE_SLUG)

      if (!isMounted) {
        return
      }

      setProgressStorageKey(storageKey)
      setCompletedModules(storedModules)

      const firstIncompleteModule = modules.find((module) => !storedModules.includes(module.number))
      const resumeModule = firstIncompleteModule ?? modules[modules.length - 1]
      const urlModule = initialModuleParam
        ? modules.find((module) => module.number === initialModuleParam)
        : undefined
      const targetModule = urlModule ?? resumeModule
      const resumeIndex = modules.findIndex((module) => module.number === targetModule.number)

      if (resumeIndex >= 0) {
        setPage(Math.floor(resumeIndex / MODULES_PER_PAGE))
      }

      setIsProgressReady(true)
    }

    void hydrateProgress()

    return () => {
      isMounted = false
    }
  }, [modules, totalModules, initialModuleParam])

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
    const current = modules[page * MODULES_PER_PAGE]
    if (current && current.number > 0) {
      setModuleParamInUrl(current.number)
    }
    const intent = scrollIntentRef.current
    scrollIntentRef.current = "stay"
    if (intent === "top") {
      window.scrollTo({ top: 0, behavior: "auto" })
    } else if (intent === "index") {
      document.getElementById("ici-modulo-indice")?.scrollIntoView({ behavior: "auto", block: "start" })
    }
  }, [page, isProgressReady, modules])

  const totalPages = Math.ceil(modules.length / MODULES_PER_PAGE)
  const completedCount = completedModules.length
  const progressPercentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0
  const progressSummary = isProgressReady ? `${progressPercentage}% completado` : "Sincronizando progreso..."
  const visibleModules = modules.slice(page * MODULES_PER_PAGE, page * MODULES_PER_PAGE + MODULES_PER_PAGE)
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
        courseName="Inner Circle · Inversiones"
        moduleLabel={currentModule?.number > 0 ? `Módulo ${currentModule.number}` : (currentModule?.title ?? "Curso")}
        accentClassName="text-[#D4B86A]"
        dashboardHref="/courses/inner-circle"
        dashboardLabel="Inner Circle"
      />
      <div className="mb-8 overflow-hidden rounded-2xl border border-[#1E1E1E] bg-[#101010]">
        <div className="grid gap-4 p-5 sm:grid-cols-[1.25fr_0.75fr] sm:p-6">
          <div>
            <p className={`text-[11px] uppercase tracking-[0.2em] ${currentModuleColors.number}`}>Inner Circle · Inversiones</p>
            <h2 className="mt-2 type-display-sm text-white">
              Módulo {currentModule?.number}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#B9B9B9]">
              {currentModule?.subtitle}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#5BB8D4]/35 bg-[#5BB8D4]/10 px-3 py-2 text-xs text-[#CDEAF3]">
              Diseñado para construir criterio real de portafolio: estructura, gestión, tesis y contexto.
            </div>
          </div>

          <div className="rounded-xl border border-[#2A2A2A] bg-[linear-gradient(180deg,#0E1A21,#0B0F11)] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#7DD4C0]">Disciplina inversiones</p>
            <p className="mt-3 text-sm leading-relaxed text-[#D3E5EA]">
              Cinco módulos secuenciales para pasar de intuición a sistema: construís el portafolio, lo gestionás, evaluás empresas, leés la macro y filtrás ruido informativo.
            </p>
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
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#5BB8D4]">Sistema</p>
          <p className="mt-1 text-sm text-[#D4D4D4]">Del mandato y el universo elegible hasta la gestión activa con reglas escritas.</p>
        </div>
        <div className="rounded-xl border border-[#2A2A2A] bg-[#101010] p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#5BB8D4]">Ritmo</p>
          <p className="mt-1 text-sm text-[#D4D4D4]">Módulos secuenciales. No se saltean. Cada uno se apoya en el anterior.</p>
        </div>
        <div className="rounded-xl border border-[#2A2A2A] bg-[#101010] p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#5BB8D4]">Objetivo</p>
          <p className="mt-1 text-sm text-[#D4D4D4]">Terminar con un sistema completo para diseñar, gestionar y defender un portafolio profesional.</p>
        </div>
      </div>

      <div id="ici-modulo-indice" className="mb-8 scroll-mt-24 rounded-xl border border-[#1E1E1E] bg-[#0F0F0F] p-4 sm:p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#7DD4C0]">Índice rápido del módulo</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {currentModule.sections.map((section, index) => (
            <a
              key={`${section.title}-${index}`}
              href={`#ici-m${currentModule.number}-s${index + 1}`}
              className="flex items-baseline gap-2 rounded-lg border border-[#222222] bg-[#111111] px-3 py-2 text-xs text-[#BBBBBB] transition-colors hover:border-[#5BB8D4]/60 hover:text-white"
            >
              <span className="w-5 shrink-0 text-right font-semibold tabular-nums text-[#7DD4C0]">{index + 1}.</span>
              <span>{section.title}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="mb-8 flex items-center gap-3">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={`page-${index}`}
            onClick={() => goTo(index, "stay")}
            className={`h-1.5 rounded-full transition-all duration-300 ${index === page ? "w-8 bg-[#7DD4C0]" : "w-3 bg-[#2A2A2A] hover:bg-[#444444]"}`}
            aria-label={`Página ${index + 1}`}
          />
        ))}
        <span className="ml-1 text-xs text-[#555555]">
          Módulo {page + 1} de {totalPages}
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
            modules={modules}
            currentNumber={currentModule?.number ?? 0}
            completed={completedModules}
            onSelect={(moduleNumber) => {
              const idx = modules.findIndex((m) => m.number === moduleNumber)
              if (idx >= 0) goTo(idx, "stay")
            }}
            accentActiveClassName="border-[#D4B86A] bg-[#D4B86A]/15 text-[#D4B86A]"
            accentDoneClassName="border-[#D4B86A]/40 text-[#D4B86A]/80"
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

      <div className="space-y-14">
        {visibleModules.map((module) => {
          const colors = moduleColors[module.color]
          const isFinalModule = module.number === totalModules

          return (
            <div key={`${module.number}-${module.title}`}>
              <div className="mb-6 flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${colors.badge} font-mono text-sm font-bold`}>
                  {String(module.number).padStart(2, "0")}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#555555]">Módulo {module.number}</p>
                  <h2 className="type-display-xs text-white">{module.title}</h2>
                  <p className="mt-1 text-sm text-[#888888]">{module.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-col divide-y divide-[#1A1A1A] overflow-hidden rounded-xl border border-[#1E1E1E]">
                {module.sections.map((section, sectionIndex) => (
                  <ModuleSection
                    key={`${module.number}-${section.title}`}
                    section={section}
                    sectionIndex={sectionIndex}
                    moduleNumber={module.number}
                    colors={colors}
                  />
                ))}
              </div>

              {isFinalModule ? (
                <div className="mt-4 rounded-xl border border-[#7DD4C0]/25 bg-gradient-to-r from-[#5BB8D4]/10 to-[#7DD4C0]/10 p-4 sm:p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7DD4C0]">Siguiente paso sugerido</p>
                  <p className="mt-2 text-sm text-[#D9E5E2]">
                    Cuando termines esta disciplina, volvés al panel principal de Inner Circle para integrar Obra Maestra, contexto general y el resto del recorrido.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/courses/inner-circle"
                      className="rounded-lg border border-[#7DD4C0]/40 bg-gradient-to-r from-[#5BB8D4]/25 to-[#7DD4C0]/25 px-4 py-2 text-sm font-medium text-[#DDF7F1] transition-colors hover:border-[#7DD4C0]/70 hover:text-white"
                    >
                      Volver a Inner Circle
                    </Link>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => toggleModuleCompletion(module.number)}
                  className={`rounded-lg border px-5 py-2.5 text-sm transition-colors ${
                    isCompleted(module.number)
                      ? "border-[#7DD4C0]/40 bg-[#7DD4C0]/10 text-[#7DD4C0] hover:bg-[#7DD4C0]/15"
                      : "border-[#2A2A2A] text-[#CCCCCC] hover:border-[#7DD4C0]/60 hover:text-white"
                  }`}
                >
                  {isCompleted(module.number) ? "Módulo completado" : "Marcar módulo como completado"}
                </button>

                {module.number > 0 && (
                  <ExamButton courseSlug={COURSE_SLUG} moduleNumber={module.number} />
                )}
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
            modules={modules}
            currentNumber={currentModule?.number ?? 0}
            completed={completedModules}
            onSelect={(moduleNumber) => {
              const idx = modules.findIndex((m) => m.number === moduleNumber)
              if (idx >= 0) goTo(idx, "index")
            }}
            accentActiveClassName="border-[#D4B86A] bg-[#D4B86A]/15 text-[#D4B86A]"
            accentDoneClassName="border-[#D4B86A]/40 text-[#D4B86A]/80"
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