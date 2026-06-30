"use client"

import { LANDING_COURSE_SYLLABUS } from "@/lib/courses/landing-syllabus"
import { CourseCard } from "./CourseCard"

interface CoursesSectionProps {
  coursePrices?: Record<string, number>
}

const courses = [
  {
    id: "kickstart-investment",
    title: "KICKSTART INVESTMENT",
    description:
      "La base completa para entrar al mundo de las inversiones con criterio. Desde finanzas personales y orden patrimonial hasta los principales instrumentos del mercado argentino e internacional, con el marco mental para tomar decisiones de capital sin improvisar.",
    outcomes30Days: [
      "Tu plan de inversión base definido según perfil y horizonte.",
      "Una rutina semanal clara para analizar y decidir sin improvisar.",
      "Checklist de riesgo y capital para evitar errores de principiante.",
    ],
    masteryCriterion:
      "Pasás una semana sin mirar el mercado y tu plan sigue teniendo sentido. Justificás cada activo de tu cartera en una frase.",
    notFor:
      "buscás ganancias rápidas sin estudiar proceso, riesgo y disciplina.",
    price: "$99",
    badge: "initial" as const,
    accentColor: "blue" as const,
    discountNote: "Si subís a Expert Investment después, sólo pagás $200 USD adicionales",
    syllabus: LANDING_COURSE_SYLLABUS["kickstart-investment"],
    ctaLink: "/cursos/kickstart-investment",
  },
  {
    id: "expert-investment",
    title: "EXPERT INVESTMENT",
    description:
      "Formación avanzada para inversores que quieren decidir con fundamentos sólidos. Análisis fundamental profundo (incluyendo WACC, ROIC y MOAT), instrumentos de income (Dividendos, REITs, ETFs) y las estrategias clásicas de los grandes inversores institucionales aplicadas a tu propio portafolio.",
    outcomes30Days: [
      "Framework para valuar activos con criterios profesionales.",
      "Estructura de portafolio con reglas de rebalanceo concretas.",
      "Proceso de lectura macro y earnings aplicado a decisiones reales.",
    ],
    masteryCriterion:
      "Leés un balance, un earnings report y un escenario macro, y armás una tesis defendible en una página. Validás picks ajenos en vez de copiarlos.",
    notFor:
      "querés copiar picks sin entender fundamentos ni construir criterio propio.",
    price: "$299",
    badge: "advanced" as const,
    accentColor: "blue" as const,
    mentor: "Programa de Desarrollo de Capital · Augusto Holman",
    discountNote: "Si ya tenés Kickstart Investment, sólo pagás $200 USD adicionales — descuento automático al iniciar sesión",
    syllabus: LANDING_COURSE_SYLLABUS["expert-investment"],
    ctaLink: "/cursos/expert-investment",
  },
  {
    id: "kickstart-trading",
    title: "KICKSTART TRADING",
    description:
      "Primeros pasos en la operatividad con marco profesional desde el día uno. Mentalidad real del trader, análisis técnico aplicado, profundización en futuros y forex, gestión de riesgo serio y primer contacto con el mundo de las prop firms.",
    outcomes30Days: [
      "Tu setup operativo listo con reglas de entrada, salida y riesgo.",
      "Journal de trading activo para corregir decisiones impulsivas.",
      "Plan de ejecución simple para operar con consistencia inicial.",
    ],
    masteryCriterion:
      "Cerrás 20 trades con journal y reglas escritas. Ganadores y perdedores siguen el mismo proceso.",
    notFor:
      "esperás operar por impulso o señales sueltas sin respetar gestión de riesgo.",
    price: "$99",
    badge: "initial" as const,
    accentColor: "teal" as const,
    discountNote: "Si subís a Trading Lab después, sólo pagás $200 USD adicionales",
    syllabus: LANDING_COURSE_SYLLABUS["kickstart-trading"],
    ctaLink: "/cursos/kickstart-trading",
  },
  {
    id: "trading-lab",
    title: "FLOWDEX TRADING LAB",
    description:
      "Operatividad avanzada con visión institucional. Cómo piensa realmente el mercado, lectura profunda de liquidez, FVG, Volume Profile completo, top-down profesional, prop firms con dos lógicas de drawdown y la disciplina operativa que sostiene todo el sistema.",
    outcomes30Days: [
      "Plan top-down replicable para leer contexto y ejecutar con criterio.",
      "Reglas tacticas sobre liquidez, FVG y volume profile aplicadas.",
      "Sistema de control emocional y disciplina para sostener tu edge.",
    ],
    masteryCriterion:
      "Aprobás una evaluación respetando tus reglas, o sabés exactamente en qué regla te saliste. Tu top-down se sostiene cuando el mercado va en contra.",
    notFor:
      "buscas adrenalina o sobreoperar en lugar de construir un sistema serio.",
    price: "$299",
    badge: "advanced" as const,
    accentColor: "teal" as const,
    mentor: "Laboratorio de Trading · Augusto Holman & Franco Escudero",
    discountNote: "Si ya tenés Kickstart Trading, sólo pagás $200 USD adicionales — descuento automático al iniciar sesión",
    syllabus: LANDING_COURSE_SYLLABUS["trading-lab"],
    ctaLink: "/cursos/trading-lab",
  },
]

function formatPrice(price: number): string {
  return `$${price % 1 === 0 ? price.toFixed(0) : price.toFixed(2)}`
}

export function CoursesSection({ coursePrices = {} }: CoursesSectionProps) {
  return (
    <section className="section-divider-smooth bg-[#0A0A0A] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Investment Section */}
        <div id="investment" className="mb-14">
          <h2 className="mb-7 flex items-center gap-3  text-3xl text-white sm:text-4xl">
            <span className="w-3 h-3 rounded-full bg-[#5BB8D4]" />
            INVERSIÓN
          </h2>
          <div className="space-y-8">
            {courses
              .filter((c) => c.accentColor === "blue")
              .map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  price={coursePrices[course.id] != null ? formatPrice(coursePrices[course.id]) : course.price}
                />
              ))}
          </div>
        </div>

        {/* Trading Section */}
        <div id="trading">
          <h2 className="mb-7 flex items-center gap-3  text-3xl text-white sm:text-4xl">
            <span className="w-3 h-3 rounded-full bg-[#7DD4C0]" />
            TRADING
          </h2>
          <div className="space-y-8">
            {courses
              .filter((c) => c.accentColor === "teal")
              .map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  price={coursePrices[course.id] != null ? formatPrice(coursePrices[course.id]) : course.price}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
