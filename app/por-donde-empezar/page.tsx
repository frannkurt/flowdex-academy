import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, Compass, MapPin, ShieldCheck, Sparkles } from "lucide-react"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { RouteSelector } from "@/components/RouteSelector"

export const metadata: Metadata = {
  title: "Por Dónde Empezar: Cursos de Trading e Inversión",
  description:
    "Guía para elegir tu primer curso de trading o inversión en Flowdex. Tres caminos según tu nivel y objetivo: Inversiones, Trading o Inner Circle. Encontrá el tuyo en 30 segundos y avanzá con criterio.",
  alternates: { canonical: "/por-donde-empezar" },
  keywords: [
    "cómo empezar en trading",
    "cómo empezar a invertir",
    "qué curso de trading elegir",
    "aprender a invertir desde cero",
    "diferencia entre trading e inversión",
  ],
  openGraph: {
    title: "Por Dónde Empezar | Cursos de Trading e Inversión Flowdex",
    description:
      "Tres caminos según donde estés. Elegí tu primer curso de trading o inversión y arrancá con criterio.",
    type: "article",
    url: "https://flowdex.com.ar/por-donde-empezar",
  },
}

// --- Datos placeholder. Reescribir cuando se valide estructura. ---

const cursos = [
  {
    nombre: "Kickstart Investment",
    badge: "Inicial · Inversión",
    color: "#5BB8D4",
    paraQuien: "Persona que nunca invirtió o que invierte por impulso y quiere ordenar el patrimonio.",
    duracion: "≈ 4 semanas con dedicación de 3-5 hs/semana",
    formato: "Clases en vivo grupales, newsletters con análisis de mercado y comunidad cerrada con asistencia pedagógica.",
    precio: "$99 USD",
    queVasAprender: [
      "Ordenar tu patrimonio antes de invertir: presupuesto, fondo de emergencia y orden de capital.",
      "Diferenciar renta fija de renta variable y cuándo conviene cada una según tu perfil.",
      "Cómo funcionan los mercados argentinos (BYMA) e internacionales (NYSE, NASDAQ, S&P 500).",
      "Instrumentos concretos: Bonos, FCIs, Plazos Fijos, CEDEARs, ETFs, Staking y Acciones.",
      "Definir tu perfil de inversor y armar tu primera rutina semanal de análisis.",
    ],
    siguienteNivel: "Expert Investment (con descuento de $200 por upgrade).",
    // Linkea a la landing dedicada del curso (SEO) — desde ahí el alumno
    // llega al checkout. Antes apuntaba directo al checkout.
    href: "/cursos/kickstart-investment",
  },
  {
    nombre: "Expert Investment",
    badge: "Avanzado · Inversión",
    color: "#5BB8D4",
    paraQuien: "Inversor con base que quiere armar tesis propias y dejar de copiar picks ajenos.",
    duracion: "≈ 6-8 semanas con dedicación de 4-6 hs/semana",
    formato: "Clases en vivo grupales con frameworks profesionales, newsletters de análisis y comunidad cerrada con asistencia pedagógica.",
    precio: "$299 USD",
    queVasAprender: [
      "Análisis fundamental aplicado: estados financieros, ratios clave y valuación profesional de empresas.",
      "Análisis fundamental avanzado: WACC, ROIC y construcción de MOAT competitivo.",
      "Macroeconomía para inversores: tasas, inflación e impacto real en cada clase de activo.",
      "Instrumentos de income: Dividendos, REITs y ETFs con criterio profesional.",
      "Las 7 estrategias clásicas: All Weather, Buy & Hold, Value, Growth, Magic Formula, Piotroski, CAN SLIM.",
      "Construcción y rebalanceo de portafolio: correlación, ponderación y reglas de ajuste.",
    ],
    siguienteNivel: "Inner Circle si querés mentoría continua + comunidad cerrada.",
    href: "/cursos/expert-investment",
  },
  {
    nombre: "Kickstart Trading",
    badge: "Inicial · Trading",
    color: "#7DD4C0",
    paraQuien: "Persona sin experiencia operativa que quiere arrancar con marco profesional desde el día uno.",
    duracion: "≈ 4 semanas con dedicación de 4-6 hs/semana",
    formato: "Clases en vivo grupales desde mentalidad y setup hasta primer contacto con prop firms. Newsletters de análisis y comunidad cerrada con asistencia pedagógica.",
    precio: "$99 USD",
    queVasAprender: [
      "Mentalidad real del trader: qué es realmente esto y qué no es (sin promesas vacías).",
      "Setup operativo profesional: TradingView, broker, plataforma de ejecución y journal del trader.",
      "Lectura de velas japonesas y estructura de mercado (tendencias, rangos, patrones).",
      "Soportes, resistencias y análisis técnico aplicado por timeframe.",
      "Futuros y Forex en profundidad: contratos, márgenes, sesiones y comportamiento.",
      "Gestión de órdenes (Market, Limit, Stop) y cálculo de tamaño de posición con la regla del 2%.",
      "Primer contacto con el mundo de las prop firms: qué son, cómo funcionan y por qué importan.",
    ],
    siguienteNivel: "Flowdex Trading Lab (con descuento de $200 por upgrade).",
    href: "/cursos/kickstart-trading",
  },
  {
    nombre: "Flowdex Trading Lab",
    badge: "Avanzado · Trading",
    color: "#7DD4C0",
    paraQuien: "Trader con base técnica que quiere operar con visión institucional y aprobar prop firms.",
    duracion: "≈ 6-8 semanas con dedicación de 5-7 hs/semana",
    formato: "Clases en vivo grupales: lectura institucional, ejecución y gestión de evaluaciones. Newsletters de análisis y comunidad cerrada con asistencia pedagógica.",
    precio: "$299 USD",
    queVasAprender: [
      "Cómo piensa realmente el mercado: lógica institucional detrás del precio.",
      "Fair Value Gaps (FVG): 4 tipos, 4 requisitos y operativa táctica con criterio.",
      "Volume Profile completo: POC, VAH, VAL, VAS y los 5 perfiles de Dalton aplicados.",
      "Liquidez avanzada: barridos, equal highs/lows, inducement y trampas institucionales.",
      "Top-Down multi-timeframe profesional: contexto, zona, confirmación y ejecución.",
      "Prop Firms: dos lógicas de drawdown, gestión de evaluación y mantenimiento de cuenta.",
      "Disciplina operativa y gestión emocional aplicada al método.",
    ],
    siguienteNivel: "Inner Circle para review personalizado y desarrollo de sistema propio.",
    href: "/cursos/trading-lab",
  },
  {
    nombre: "Inner Circle",
    badge: "Programa premium · 12 meses · requiere Expert o Trading Lab",
    color: "#D4B86A",
    paraQuien: "Alumno que ya completó Expert Investment o Trading Lab y quiere mentoría continua + review personalizado de sus operaciones.",
    duracion: "Programa anual con 12 sesiones grupales por mes",
    formato: "Mentoría grupal mensual + review personalizado de tus operaciones (1-a-1) + método FPM + ORB Breakout + Obra Maestra + newsletters + comunidad cerrada.",
    precio: "$399 USD",
    queVasAprender: [
      "Flowdex Portfolio Method (FPM): el método propio de gestión de capital aplicado a portafolio real.",
      "Sistema ORB Breakout: la estrategia completa de Franco con sus indicadores propios de Flowdex.",
      "Los 10 módulos de la Obra Maestra del operador: el cierre pedagógico del programa.",
      "Review personalizado de tus propias operaciones (1-a-1, no genérico).",
      "Mentoría grupal con Augusto y Franco (12 sesiones por mes, 3 por semana).",
      "Acceso a la comunidad cerrada del Inner Circle y a los newsletters de análisis avanzado.",
    ],
    siguienteNivel: "Membresía de continuidad post programa.",
    href: "/inner-circle",
  },
]

const filasComparativa: { label: string; values: string[] }[] = [
  {
    label: "Nivel del alumno",
    values: [
      "Sin experiencia previa",
      "Inversor con base",
      "Sin experiencia operativa",
      "Trader con base técnica",
      "Alumno con base · inversión y/o trading",
    ],
  },
  {
    label: "Tiempo estimado",
    values: ["4 semanas", "6-8 semanas", "4 semanas", "6-8 semanas", "12 meses"],
  },
  {
    label: "Carga semanal",
    values: ["3-5 hs", "4-6 hs", "4-6 hs", "5-7 hs", "Variable según etapa"],
  },
  {
    label: "Formato",
    values: [
      "Clases en vivo grupales · newsletters de análisis · comunidad con asistencia pedagógica",
      "Clases en vivo grupales · newsletters de análisis · comunidad con asistencia pedagógica",
      "Clases en vivo grupales · newsletters de análisis · comunidad con asistencia pedagógica",
      "Clases en vivo grupales · newsletters de análisis · comunidad con asistencia pedagógica",
      "Mentoría grupal mensual + review personalizado de operaciones + newsletters + comunidad cerrada",
    ],
  },
  {
    label: "Acceso",
    values: [
      "Directo",
      "Directo",
      "Directo",
      "Directo",
      "Requiere haber completado Expert Investment o Trading Lab",
    ],
  },
  {
    label: "Precio",
    values: ["$99", "$299", "$99", "$299", "$399"],
  },
  {
    label: "Próximo paso natural",
    values: [
      "Expert Investment",
      "Inner Circle",
      "Trading Lab",
      "Inner Circle",
      "Membresía de continuidad",
    ],
  },
]

const cursoHeaders: { name: string; color: string; group: "investment" | "trading" | "ic" }[] = [
  { name: "Kickstart Investment", color: "#5BB8D4", group: "investment" },
  { name: "Expert Investment", color: "#5BB8D4", group: "investment" },
  { name: "Kickstart Trading", color: "#7DD4C0", group: "trading" },
  { name: "Trading Lab", color: "#7DD4C0", group: "trading" },
  { name: "Inner Circle", color: "#D4B86A", group: "ic" },
]

export default function PorDondeEmpezarPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      {/* Glows ambientales */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-[#5BB8D4]/8 blur-[120px]" />
        <div className="absolute right-[6%] top-[48%] h-80 w-80 rounded-full bg-[#7DD4C0]/8 blur-[140px]" />
        <div className="absolute left-1/2 top-[78%] h-72 w-[34rem] -translate-x-1/2 rounded-full bg-[#D4B86A]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* ===== HERO ===== */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7DD4C0]/30 bg-[#7DD4C0]/8 px-4 py-1.5 mb-6">
              <Compass size={14} className="text-[#7DD4C0]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7DD4C0]">
                Por dónde empezar
              </span>
            </div>
            <h1 className="type-display-lg">
              Tres caminos. Una sola pregunta:
              <span className="block text-[#7DD4C0] mt-2">¿dónde estás hoy?</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-[#CCCCCC] leading-relaxed">
              Esta página te orienta en 30 segundos. Si arrancás de cero, si ya operás, o si querés mentoría
              continua — cada caso tiene su punto de entrada.
            </p>
          </div>
        </section>

        {/* ===== DECISIÓN RÁPIDA (selector interactivo) ===== */}
        <section className="px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-3">
                Decisión rápida
              </p>
              <h2 className="type-display-sm text-white">
                Encontrá tu programa en tres preguntas.
              </h2>
              <p className="mt-3 text-sm text-[#888] max-w-xl mx-auto leading-relaxed">
                Respondé con honestidad. Al final te decimos cuál es tu punto de entrada y por qué.
              </p>
            </div>

            <RouteSelector />
          </div>
        </section>

        {/* ===== TABLA COMPARATIVA ===== */}
        <section className="px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-3">
                Visión panorámica
              </p>
              <h2 className="type-display-sm text-white">
                <span className="hidden sm:inline">Los cinco programas, lado a lado.</span>
                <span className="sm:hidden">Los cinco programas, en detalle.</span>
              </h2>
            </div>

            {/* DESKTOP / TABLET: tabla comparativa lado a lado */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl border border-[#2A2A2A] bg-[#0E0E0E]/80">
              <table className="w-full min-w-[920px] text-left">
                {/* Banda de grupo (Inversión / Trading / Inner Circle) */}
                <thead>
                  <tr>
                    <th
                      rowSpan={2}
                      className="p-4 sm:p-5 text-center align-middle bg-gradient-to-br from-[#0E0E0E] via-[#121212] to-[#1A1A1A] border-b border-r border-[#2A2A2A] rounded-tl-2xl"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#666] leading-none">
                        Comparar
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#444]">programas</p>
                    </th>
                    <th colSpan={2} className="p-3 sm:p-4 text-center border-b border-[#5BB8D4]/30 bg-[#5BB8D4]/5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5BB8D4]">
                        · Inversión
                      </p>
                    </th>
                    <th colSpan={2} className="p-3 sm:p-4 text-center border-b border-[#7DD4C0]/30 bg-[#7DD4C0]/5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7DD4C0]">
                        · Trading
                      </p>
                    </th>
                    <th className="p-3 sm:p-4 text-center border-b border-[#D4B86A]/30 bg-[#D4B86A]/5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A]">
                        · Premium
                      </p>
                    </th>
                  </tr>
                  {/* Headers de cursos */}
                  <tr className="border-b border-[#2A2A2A]">
                    {cursoHeaders.map((curso, i) => {
                      const isLast = i === cursoHeaders.length - 1
                      const isGroupEnd =
                        !isLast && cursoHeaders[i + 1]?.group !== curso.group
                      return (
                        <th
                          key={curso.name}
                          className={`p-4 sm:p-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white whitespace-nowrap ${
                            isLast
                              ? ""
                              : isGroupEnd
                                ? "border-r border-[#2A2A2A]"
                                : "border-r border-[#1A1A1A]"
                          }`}
                          style={{ color: curso.color }}
                        >
                          {curso.name}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filasComparativa.map((fila, fi) => (
                    <tr key={fi} className="border-b border-[#1A1A1A] last:border-0">
                      <td className="p-4 sm:p-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D4B86A] whitespace-nowrap border-r border-[#2A2A2A] align-middle">
                        {fila.label}
                      </td>
                      {fila.values.map((valor, vi) => {
                        const isLast = vi === fila.values.length - 1
                        const isGroupEnd =
                          !isLast && cursoHeaders[vi + 1]?.group !== cursoHeaders[vi].group
                        return (
                          <td
                            key={vi}
                            className={`p-4 sm:p-5 text-sm text-[#CFCFCF] leading-snug align-middle ${
                              isLast
                                ? ""
                                : isGroupEnd
                                  ? "border-r border-[#2A2A2A]"
                                  : "border-r border-[#1A1A1A]"
                            }`}
                          >
                            {valor}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE: cards apiladas (una por programa) */}
            <div className="sm:hidden space-y-4">
              {cursoHeaders.map((curso, ci) => {
                const groupLabel =
                  curso.group === "investment"
                    ? "Inversión"
                    : curso.group === "trading"
                      ? "Trading"
                      : "Premium"
                return (
                  <article
                    key={curso.name}
                    className="rounded-2xl border bg-[#0E0E0E]/80 overflow-hidden"
                    style={{ borderColor: `${curso.color}33` }}
                  >
                    <header
                      className="px-5 py-4 border-b"
                      style={{
                        borderColor: `${curso.color}26`,
                        backgroundColor: `${curso.color}0D`,
                      }}
                    >
                      <p
                        className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5"
                        style={{ color: curso.color }}
                      >
                        · {groupLabel}
                      </p>
                      <h3
                        className="type-subheadline"
                        style={{ color: curso.color }}
                      >
                        {curso.name}
                      </h3>
                    </header>
                    <dl className="divide-y divide-[#1A1A1A]">
                      {filasComparativa.map((fila) => (
                        <div key={fila.label} className="px-5 py-3.5">
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4B86A] mb-1.5">
                            {fila.label}
                          </dt>
                          <dd className="text-sm text-[#CFCFCF] leading-snug">
                            {fila.values[ci]}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== DETALLE POR CURSO ===== */}
        <section className="px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-3">
                En profundidad
              </p>
              <h2 className="type-display-sm text-white">
                Cada programa en detalle.
              </h2>
              <p className="mt-3 text-sm text-[#888] max-w-xl mx-auto leading-relaxed">
                Si la tabla no te alcanzó, acá tenés perfil ideal, formato, qué vas a aprender y próximo paso de cada uno.
              </p>
            </div>

            <div className="space-y-6">
              {cursos.map((curso) => (
                <article
                  key={curso.nombre}
                  className="relative rounded-2xl border border-[#2A2A2A] bg-[#0E0E0E]/80 p-6 sm:p-8"
                >
                  <div className="pointer-events-none absolute -top-10 -right-10 hidden lg:block opacity-[0.08]">
                    <OrbitalIcon size={140} animate={false} />
                  </div>

                  <div className="relative">
                    <div
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] mb-4"
                      style={{
                        borderColor: `${curso.color}40`,
                        backgroundColor: `${curso.color}12`,
                        color: curso.color,
                        borderWidth: 1,
                      }}
                    >
                      <Sparkles size={12} />
                      {curso.badge}
                    </div>

                    <h3 className="type-display-xs text-white mb-4">
                      {curso.nombre}
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 mb-6">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#888] mb-1.5">
                          Para quién
                        </p>
                        <p className="text-sm text-[#D8D8D8] leading-snug">{curso.paraQuien}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#888] mb-1.5">
                          Duración estimada
                        </p>
                        <p className="text-sm text-[#D8D8D8] leading-snug">{curso.duracion}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#888] mb-1.5">
                          Formato
                        </p>
                        <p className="text-sm text-[#D8D8D8] leading-snug">{curso.formato}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#888] mb-1.5">
                          Inversión
                        </p>
                        <p className="text-sm text-[#D8D8D8] leading-snug">{curso.precio}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p
                        className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-2"
                        style={{ color: curso.color }}
                      >
                        Qué vas a aprender
                      </p>
                      <ul className="space-y-1.5">
                        {curso.queVasAprender.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-[#D8D8D8] leading-snug">
                            <Check
                              size={14}
                              className="mt-[3px] flex-shrink-0"
                              style={{ color: curso.color }}
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1F1F1F]">
                      <p className="text-xs text-[#888]">
                        <span className="text-[#A8A8A8]">Próximo paso natural: </span>
                        <span className="text-white">{curso.siguienteNivel}</span>
                      </p>
                      <Link
                        href={curso.href}
                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                        style={{
                          backgroundColor: `${curso.color}18`,
                          color: curso.color,
                          borderColor: `${curso.color}40`,
                          borderWidth: 1,
                        }}
                      >
                        {curso.href.startsWith("/checkout") ? "Inscribirme ahora" : "Ver detalle del programa"}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section className="px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28">
          <div className="max-w-3xl mx-auto text-center rounded-3xl border border-[#2A2A2A] bg-[#0E0E0E]/80 p-8 sm:p-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#7DD4C0]/10 border border-[#7DD4C0]/30 mb-5">
              <MapPin size={20} className="text-[#7DD4C0]" />
            </div>
            <h2 className="type-display-sm text-white mb-3">
              Si seguís sin estar seguro, escribinos.
            </h2>
            <p className="text-sm sm:text-base text-[#A8A8A8] leading-relaxed mb-6 max-w-xl mx-auto">
              Una conversación corta vale más que diez páginas leídas. Te orientamos al programa que te
              corresponde y, si no es ninguno todavía, te lo decimos.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/message/WD3RGNGTSPFYA1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-[#0A0A0A] transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)",
                  boxShadow: "0 0 24px rgba(125, 212, 192, 0.35)",
                }}
              >
                <ShieldCheck size={16} />
                Hablar por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
