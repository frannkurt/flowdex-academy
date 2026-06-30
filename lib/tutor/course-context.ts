// Helper para el tutor IA: convierte el contenido estructurado de un curso
// (Module[] con secciones y bloques) a un string plano apto para usar como
// contexto en el system prompt de Gemini.
//
// El objetivo es que el modelo solo "sepa" del curso al que pertenece el
// alumno: si el slug es kickstart-trading, solo se inyecta el contenido de
// kickstart-trading. Nada más.

import type { Module } from "@/lib/courses/kickstart-investment-content"
import { kickstartInvestmentContent } from "@/lib/courses/kickstart-investment-content"
import { kickstartTradingContent } from "@/lib/courses/kickstart-trading-content"
import { expertInvestmentContent } from "@/lib/courses/expert-investment-content"
import { tradingLabContent } from "@/lib/courses/trading-lab-content"

// Metadata visible al modelo: nombre humano del curso para que pueda
// referirse a él en sus respuestas.
const COURSE_META: Record<string, { name: string; content: Module[] | null }> = {
  "kickstart-investment": {
    name: "Kickstart Investment",
    content: kickstartInvestmentContent,
  },
  "kickstart-trading": {
    name: "Kickstart Trading",
    content: kickstartTradingContent,
  },
  "expert-investment": {
    name: "Expert Investment",
    content: expertInvestmentContent,
  },
  "trading-lab": {
    name: "Trading Lab",
    content: tradingLabContent,
  },
  // Inner Circle no tiene Module[] estructurado: usa componentes propios
  // (Roadmap, Manifiesto). Por ahora se excluye del tutor IA. Si en el
  // futuro se quiere habilitar, hay que armar un resumen manual acá.
  "inner-circle": {
    name: "Inner Circle",
    content: null,
  },
}

export function isCourseTutorSupported(slug: string): boolean {
  return Boolean(COURSE_META[slug]?.content)
}

export function getCourseName(slug: string): string | null {
  return COURSE_META[slug]?.name ?? null
}

// Aplana un Module[] a texto plano. Mantiene jerarquía (módulo > sección >
// bloque) con encabezados explícitos para que el modelo pueda citar
// "Módulo 2, sección X" si hace falta.
export function flattenCourseContent(slug: string): string | null {
  const meta = COURSE_META[slug]
  if (!meta?.content) return null

  const lines: string[] = []
  lines.push(`# Contenido del curso: ${meta.name}`)
  lines.push("")

  for (const mod of meta.content) {
    lines.push(`## Módulo ${mod.number}: ${mod.title}`)
    lines.push(`> ${mod.subtitle}`)
    lines.push("")

    for (const sec of mod.sections) {
      lines.push(`### ${sec.title}`)

      for (const block of sec.blocks) {
        switch (block.type) {
          case "intro":
          case "paragraph":
          case "highlight":
            lines.push(block.text)
            break
          case "concept":
          case "callout":
            lines.push(`**${block.label}:** ${block.text}`)
            break
          case "list":
          case "example":
            for (const item of block.items) {
              lines.push(`- ${item.label ? `${item.label}: ` : ""}${item.text}`)
            }
            break
          case "reference":
            lines.push(`(Referencia a ${block.targetCourse} — ${block.targetModule}: ${block.reason})`)
            break
          case "tool":
            lines.push(`Herramienta: ${block.toolName} — ${block.description}`)
            break
          case "lore_quote":
            lines.push(`"${block.text}" — ${block.speaker}`)
            break
          case "image":
            // Las imágenes no aportan al contexto textual; se omiten.
            break
        }
        lines.push("")
      }
    }
  }

  return lines.join("\n")
}
