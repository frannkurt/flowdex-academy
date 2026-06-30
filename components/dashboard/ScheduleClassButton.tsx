"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { loadCompletedModules } from "@/lib/course-progress"

const KICKSTART_INVESTMENT_SLUG = "kickstart-investment"
const EXPERT_INVESTMENT_SLUG = "expert-investment"
const KICKSTART_TRADING_SLUG = "kickstart-trading"
const TRADING_LAB_SLUG = "trading-lab"

// El botón pega al endpoint /api/clases/[slug]/[module], que valida en la base
// que el progreso incluye los módulos requeridos antes de redirigir a Cal.com.
// Las URLs reales viven server-only en lib/courses/class-scheduling; acá solo
// queda la info para la UX (qué módulos pide cada clase y el label).

type ClassMilestone = {
  id: number
  requiredModules: number[]
  label: string
}

type CourseProgressConfig = {
  storageKey: string
  milestones: ClassMilestone[]
}

const COURSE_PROGRESS_CONFIG: Record<string, CourseProgressConfig> = {
  [KICKSTART_INVESTMENT_SLUG]: {
    storageKey: "flowdex:kickstart-investment:completed-modules:v2",
    milestones: [
      { id: 1, requiredModules: [1, 2], label: "Agendar clase 1" },
      { id: 2, requiredModules: [1, 2, 3], label: "Agendar clase 2" },
      { id: 3, requiredModules: [1, 2, 3, 4], label: "Agendar clase 3" },
    ],
  },
  [EXPERT_INVESTMENT_SLUG]: {
    storageKey: "flowdex:expert-investment:completed-modules:v1",
    milestones: [
      { id: 1, requiredModules: [1], label: "Agendar clase 1" },
      { id: 2, requiredModules: [1, 2, 3], label: "Agendar clase 2" },
      { id: 3, requiredModules: [1, 2, 3, 4], label: "Agendar clase 3" },
    ],
  },
  [KICKSTART_TRADING_SLUG]: {
    storageKey: "flowdex:kickstart-trading:completed-modules:v2",
    milestones: [
      { id: 1, requiredModules: [1, 2], label: "Agendar clase 1" },
      { id: 2, requiredModules: [1, 2, 3], label: "Agendar clase 2" },
      { id: 3, requiredModules: [1, 2, 3, 4], label: "Agendar clase 3" },
    ],
  },
  [TRADING_LAB_SLUG]: {
    storageKey: "flowdex:trading-lab:completed-modules:v1",
    milestones: [
      { id: 1, requiredModules: [1, 2], label: "Agendar clase 1" },
      { id: 2, requiredModules: [1, 2, 3], label: "Agendar clase 2" },
      { id: 3, requiredModules: [1, 2, 3, 4], label: "Agendar clase 3" },
    ],
  },
}

export function ScheduleClassButton({ courseSlug }: { courseSlug: string }) {
  const [completedModules, setCompletedModules] = useState<number[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const courseConfig = COURSE_PROGRESS_CONFIG[courseSlug]
  const progressStorageKey = courseConfig?.storageKey
  const milestonesCount = courseConfig?.milestones.length ?? 0

  useEffect(() => {
    let isMounted = true

    if (!progressStorageKey) {
      setCompletedModules([])
      setIsHydrated(true)
      return
    }

    async function hydrateProgress() {
      const { modules } = await loadCompletedModules(progressStorageKey, undefined, courseSlug)

      if (!isMounted) {
        return
      }

      setCompletedModules(modules)
      setIsHydrated(true)
    }

    void hydrateProgress()

    return () => {
      isMounted = false
    }
  }, [courseSlug, progressStorageKey])

  if (!courseConfig) {
    return null
  }

  if (!isHydrated) {
    return (
      <div className="grid w-full gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          disabled
          className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-[#2A2A2A] px-3 py-2 text-center text-[11px] leading-tight uppercase tracking-[0.08em] text-[#666666] opacity-70"
        >
          Cargando clases...
        </button>
      </div>
    )
  }

  const gridClassName =
    milestonesCount <= 2
      ? "grid w-full gap-2 sm:grid-cols-2"
      : "grid w-full gap-2 sm:grid-cols-2 lg:grid-cols-3"

  return (
    <div className={gridClassName}>
      {courseConfig.milestones.map((milestone) => {
        const isUnlocked = milestone.requiredModules.every((requiredModule) => completedModules.includes(requiredModule))
        const requiredModulesLabel = milestone.requiredModules.join(" y ")

        if (isUnlocked) {
          return (
            <Link
              key={milestone.id}
              href={`/api/clases/${courseSlug}/${Math.max(...milestone.requiredModules)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-[#7DD4C0]/40 bg-gradient-to-r from-[#5BB8D4]/25 to-[#7DD4C0]/25 px-3 py-2 text-center text-[11px] leading-tight uppercase tracking-[0.1em] text-[#DDF7F1] transition-colors hover:border-[#7DD4C0]/70 hover:text-white"
            >
              {milestone.label}
            </Link>
          )
        }

        return (
          <button
            key={milestone.id}
            type="button"
            disabled
            className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-[#2A2A2A] px-3 py-2 text-center text-[11px] leading-tight uppercase tracking-[0.08em] text-[#666666] opacity-70"
            title={`Clase ${milestone.id}: se habilita al completar modulos ${requiredModulesLabel}`}
          >
            {`Clase ${milestone.id} bloqueada`}
          </button>
        )
      })}
    </div>
  )
}
