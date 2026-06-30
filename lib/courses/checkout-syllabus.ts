import {
  INNER_CIRCLE_LANDING_SYLLABUS,
  LANDING_COURSE_SYLLABUS,
  isGrouped,
} from "@/lib/courses/landing-syllabus"
import { innerCircleContent } from "@/lib/courses/inner-circle-content"
import { innerCircleInvestmentContent } from "@/lib/courses/inner-circle-investment-content"
import { innerCircleTradingContent } from "@/lib/courses/inner-circle-trading-content"

export type CheckoutSyllabusSection = {
  title?: string
  items: string[]
  tone?: "teal" | "blue" | "gold"
  collapsible?: boolean
}

type CheckoutModuleLike = {
  number: number
  title: string
  subtitle: string
}

function formatModuleItem(module: CheckoutModuleLike) {
  return `Módulo ${module.number}: ${module.title}${module.subtitle ? ` · ${module.subtitle}` : ""}`
}

export function getCheckoutSyllabus(slug: string): CheckoutSyllabusSection[] {
  if (slug === "inner-circle") {
    return [
      {
        title: INNER_CIRCLE_LANDING_SYLLABUS.items[1],
        items: innerCircleContent.map((module) => formatModuleItem(module)),
        tone: "gold",
      },
      {
        title: "ORB Breakout · Trading",
        items: innerCircleTradingContent.map((module) => formatModuleItem(module)),
        tone: "teal",
      },
      {
        title: INNER_CIRCLE_LANDING_SYLLABUS.items[0],
        items: innerCircleInvestmentContent.map((module) => formatModuleItem(module)),
        tone: "blue",
      },
      {
        title: "Además incluye",
        items: INNER_CIRCLE_LANDING_SYLLABUS.items.slice(2),
        tone: "teal",
        collapsible: false,
      },
    ]
  }

  const syllabus = LANDING_COURSE_SYLLABUS[slug]
  if (!syllabus) return []

  // Cursos regulares (kickstart-trading, trading-lab, kickstart-investment,
  // expert-investment): temario expandido siempre, sin dropdowns. Como
  // tienen menos contenido que Inner Circle, el accordion no aporta —
  // mostrar todo directo se siente más sólido y reduce fricción.
  // Inner Circle conserva su accordion porque tiene tres bloques densos
  // (ORB Breakout, FPM, Obra Maestra) y ahí el colapso sí ordena.
  if (isGrouped(syllabus)) {
    return syllabus.map((group) => ({
      title: group.title,
      items: group.items,
      tone: "teal" as const,
      collapsible: false,
    }))
  }

  return [{ items: syllabus, tone: "teal", collapsible: false }]
}