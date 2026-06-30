// Registry central de preguntas de exámenes, por curso y módulo.
//
// Cada curso con examen tiene su propio archivo con un Record<modulo, preguntas>.
// Este index los junta para que `lib/exams/server.ts` los consulte uniformemente.
//
// Para agregar un curso nuevo:
// 1. Crear `lib/exams/questions/<slug>.ts` exportando Record<number, ExamQuestionRaw[]>
// 2. Sumarlo al objeto `examQuestionsByCourse` debajo

import type { ExamQuestionRaw } from "@/lib/exams/types"
import { kickstartTradingQuestions } from "@/lib/exams/questions/kickstart-trading"
import { tradingLabQuestions } from "@/lib/exams/questions/trading-lab"
import { kickstartInvestmentQuestions } from "@/lib/exams/questions/kickstart-investment"
import { expertInvestmentQuestions } from "@/lib/exams/questions/expert-investment"
import { innerCircleTradingQuestions } from "@/lib/exams/questions/inner-circle-trading"
import { innerCircleInversionesQuestions } from "@/lib/exams/questions/inner-circle-inversiones"

type ModuleQuestionsMap = Record<number, ExamQuestionRaw[]>

const examQuestionsByCourse: Record<string, ModuleQuestionsMap> = {
  "kickstart-trading": kickstartTradingQuestions,
  "trading-lab": tradingLabQuestions,
  "kickstart-investment": kickstartInvestmentQuestions,
  "expert-investment": expertInvestmentQuestions,
  "inner-circle-trading": innerCircleTradingQuestions,
  "inner-circle-inversiones": innerCircleInversionesQuestions,
}

/**
 * Devuelve el pool de preguntas para un módulo de un curso. Si el curso no
 * está registrado o el módulo no tiene preguntas cargadas todavía, devuelve
 * un array vacío.
 */
export function getQuestionsFromRegistry(
  courseSlug: string,
  moduleNumber: number
): ExamQuestionRaw[] {
  const courseMap = examQuestionsByCourse[courseSlug]
  if (!courseMap) return []
  return courseMap[moduleNumber] ?? []
}
