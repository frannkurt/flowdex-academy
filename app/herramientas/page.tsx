import Link from "next/link"
import type { Metadata } from "next"
import {
  Activity,
  Briefcase,
  Calculator,
  ExternalLink,
  Gauge,
  Landmark,
  LineChart,
  Newspaper,
} from "lucide-react"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { TickerTape } from "@/components/herramientas/tradingview/TickerTape"

export const metadata: Metadata = {
  title: "Herramientas para trading e inversión",
  description:
    "Calculadoras propias de Flowdex (tamaño de posición, interés compuesto, riesgo/beneficio), noticias con calendario económico en tiempo real y acceso directo a las herramientas oficiales del CME Group: Trading Simulator, FedWatch y CVOL.",
  alternates: { canonical: "/herramientas" },
}

const TOOLS = [
  {
    href: "/herramientas/calculadoras",
    eyebrow: "Operación",
    title: "Calculadoras",
    description:
      "Tres herramientas propias para el ciclo de operación: sizing en forex, contratos de futuros para prop firms y proyección de capital.",
    accent: "#7DD4C0",
    accentSoft: "rgba(125, 212, 192, 0.18)",
    Icon: Calculator,
    features: [
      "Tamaño de posición forex con precios FX en vivo",
      "Sizing de futuros US (ES, NQ, MES, MNQ, MGC) con prop firm",
      "Proyección de capital con interés compuesto",
    ],
  },
  {
    href: "/herramientas/noticias",
    eyebrow: "Contexto",
    title: "Noticias",
    description:
      "Headlines macro de fuentes serias en español e inglés, más el calendario económico para anticipar qué mueve los precios.",
    accent: "#5BB8D4",
    accentSoft: "rgba(91, 184, 212, 0.18)",
    Icon: Newspaper,
    features: [
      "Ámbito Financiero, Investing.com, Yahoo Finance",
      "Refresco automático cada 30 minutos",
      "Calendario económico live",
    ],
  },
  {
    href: "/herramientas/mercados",
    eyebrow: "Mercado",
    title: "Mercados",
    description:
      "La foto macro de un vistazo: resumen de mercado, mapa de calor del S&P 500 y screener de acciones por fundamentals.",
    accent: "#5BB8D4",
    accentSoft: "rgba(91, 184, 212, 0.18)",
    Icon: LineChart,
    features: [
      "Resumen de mercado: índices, acciones, cripto, forex",
      "Mapa de calor del S&P 500 por sector",
      "Screener de acciones (EE.UU. y Argentina)",
    ],
  },
] as const

// Atajos a herramientas de terceros que el alumno usa día a día. NO son
// herramientas Flowdex, por eso van como mini-cards más sutiles abajo, sin
// halos ni color de programa — sólo el ícono y el dominio. Mantener
// estética subordinada vs las TOOLS principales.
const EXTERNAL_TOOLS = [
  {
    href: "https://www.tradingview.com/chart/",
    label: "TradingView Chart",
    domain: "tradingview.com",
    Icon: LineChart,
  },
  {
    href: "https://www.invertironline.com/",
    label: "Broker IOL",
    domain: "invertironline.com",
    Icon: Briefcase,
  },
  {
    href: "https://www.xtb.com/lat",
    label: "Broker XTB",
    domain: "xtb.com",
    Icon: Briefcase,
  },
] as const

// Herramientas oficiales del CME Group. Van en su propia sección con
// tratamiento institucional (acento dorado) por encima de los atajos
// genéricos: linkear a los tools del propio exchange es alineación, no
// pieza ajena de relleno. Siempre linkeadas (nunca iframe) hacia
// cmegroup.com, abriendo en pestaña nueva.
const CME_TOOLS = [
  {
    href: "https://www.cmegroup.com/education/practice/about-the-trading-simulator.html",
    title: "CME Trading Simulator",
    description:
      "Practicá futuros con datos reales de mercado y capital simulado, en el simulador oficial del CME Institute. Mismo entorno que vas a operar, cero riesgo.",
    Icon: Activity,
  },
  {
    href: "https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html",
    title: "CME FedWatch",
    description:
      "La probabilidad que el mercado asigna a cada decisión de tasas de la Fed, calculada sobre futuros del CME. Clave para anticipar volatilidad en los índices.",
    Icon: Landmark,
  },
  {
    href: "https://www.cmegroup.com/market-data/cme-group-benchmark-administration/cme-group-volatility-indexes.html",
    title: "CVOL · Índice de volatilidad",
    description:
      "El índice de volatilidad del CME Group sobre las opciones de futuros más líquidas del mundo: una lectura del riesgo esperado a 30 días por clase de activo.",
    Icon: Gauge,
  },
] as const

export default function HerramientasHubPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05070D] pt-24 pb-20 text-white">
      {/* OrbitalIcon como marca de propiedad sobre el hero. Bajísimo opacity
          para que no compita con el texto pero esté ahí para cualquier
          observador atento. */}
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 opacity-[0.05] sm:opacity-[0.07]">
        <OrbitalIcon size={520} animate />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-[#7DD4C0]/12 blur-3xl" />
        <div className="absolute right-[-140px] top-40 h-96 w-96 rounded-full bg-[#5BB8D4]/12 blur-3xl" />
        <div className="absolute bottom-[-220px] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#2A7E96]/10 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-[#28434B] bg-[#0C1A1F]/70 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7DD4C0] shadow-[0_0_8px_#7DD4C0]" />
            <p className="ml-2 text-[11px] uppercase tracking-[0.24em] text-[#7DD4C0]">Herramientas</p>
          </div>
          <h1 className="mt-6 type-display-hero text-white">
            Tu toolkit operativo
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[#B8BDC9]">
            Lo que necesitás abierto al lado del gráfico cuando estás por tomar una decisión. Calculadoras propias para
            sizing y proyección, y un panel macro para no operar a ciegas.
          </p>
        </div>

        {/* Cinta de cotizaciones — tira fina estilo terminal, una sola línea
            que corre en horizontal (también en mobile, sin apilarse). */}
        <div className="mt-10 overflow-hidden rounded-xl border border-[#1F2330] bg-[#0B0E16]/60">
          <TickerTape />
        </div>

        <div className="mt-12 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = tool.Icon
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(170deg,#10131C_0%,#0A0D14_100%)] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-all hover:border-[#3A3A3A] hover:-translate-y-1 sm:p-9"
              >
                {/* Halo de color sutil arriba del card, se intensifica en hover. */}
                <div
                  className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: tool.accentSoft, opacity: 0.5 }}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p
                      className="text-[11px] uppercase tracking-[0.22em]"
                      style={{ color: tool.accent }}
                    >
                      {tool.eyebrow}
                    </p>
                    <h2 className="mt-2 type-display-sm text-white">{tool.title}</h2>
                  </div>
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all group-hover:scale-105"
                    style={{
                      borderColor: `${tool.accent}40`,
                      background: `linear-gradient(135deg, ${tool.accentSoft} 0%, transparent 100%)`,
                    }}
                  >
                    <Icon
                      className="h-6 w-6 transition-colors"
                      style={{ color: tool.accent }}
                      strokeWidth={1.6}
                    />
                  </div>
                </div>

                <p className="relative mt-3 text-sm leading-relaxed text-[#9AA3B5] sm:text-[15px]">
                  {tool.description}
                </p>

                <ul className="relative mt-6 space-y-2.5">
                  {tool.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[13px] text-[#B8BDC9]">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: tool.accent }}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative mt-auto flex items-center gap-2 border-t border-[#1F2330] pt-5 text-[11px] uppercase tracking-[0.18em] text-[#7E8898] transition-colors group-hover:text-white">
                  Abrir herramienta
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* === HERRAMIENTAS DEL CME GROUP ===
            Sección propia con acento teal (programa Trading). Linkea a los
            tools del propio exchange donde cotizan los futuros que se operan
            en Trading. El rótulo describe DÓNDE cotizan los futuros, no atribuye
            a Flowdex ningún vínculo oficial con CME (evaluación en curso, sin
            acuerdo). Más prominente que los atajos genéricos de abajo. */}
        <div className="mt-16">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#1F302C]" />
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#7DD4C0]">
              Donde cotizan los futuros que operamos
            </p>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#1F302C]" />
          </div>

          <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-[#9AA3B5]">
            Los futuros que operamos en Trading cotizan en el CME Group. Estas son herramientas
            del propio exchange, directo de la fuente.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {CME_TOOLS.map((tool) => {
              const Icon = tool.Icon
              return (
                <a
                  key={tool.href}
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-[#7DD4C0]/25 bg-[linear-gradient(170deg,#0C1614_0%,#070B0A_100%)] p-5 transition-all hover:border-[#7DD4C0]/50 hover:-translate-y-1 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="type-subheadline text-white">{tool.title}</h3>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#7DD4C0]/30 bg-[#7DD4C0]/10 transition-transform group-hover:scale-105">
                      <Icon className="h-5 w-5 text-[#7DD4C0]" strokeWidth={1.6} />
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#9AA3B5]">
                    {tool.description}
                  </p>
                  <div className="mt-auto flex items-center gap-1.5 pt-5 text-[11px] uppercase tracking-[0.18em] text-[#7DD4C0]/80 transition-colors group-hover:text-[#7DD4C0]">
                    Abrir en cmegroup.com
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        {/* === ATAJOS EXTERNOS ===
            Sección subordinada visualmente: chips chicos en gris neutro,
            sin halos ni accent de programa. Son links a sitios de terceros
            (TradingView, brokers) que el alumno usa con frecuencia. NO
            están al mismo nivel jerárquico que las tools propias de
            Flowdex — por diseño. */}
        <div className="mt-16">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#1F2330]" />
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#5C6273]">
              Atajos · herramientas externas
            </p>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#1F2330]" />
          </div>

          <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-3">
            {EXTERNAL_TOOLS.map((tool) => {
              const Icon = tool.Icon
              return (
                <a
                  key={tool.href}
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-[#1F2330] bg-[#0B0E16]/70 px-4 py-3 transition-all hover:border-[#2F3645] hover:bg-[#10141C]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#222836] bg-[#0E1218]">
                    <Icon
                      className="h-4 w-4 text-[#9AA3B5] transition-colors group-hover:text-[#E5E7EB]"
                      strokeWidth={1.7}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#D7DBE5] transition-colors group-hover:text-white">
                      {tool.label}
                    </p>
                    <p className="truncate text-[10px] uppercase tracking-[0.14em] text-[#5C6273]">
                      {tool.domain}
                    </p>
                  </div>
                  <ExternalLink
                    className="h-3.5 w-3.5 shrink-0 text-[#3F4655] transition-colors group-hover:text-[#9AA3B5]"
                    strokeWidth={1.8}
                  />
                </a>
              )
            })}
          </div>
        </div>

        {/* Nota al pie discreta — sirve de cierre visual y refuerza la idea
            de que el toolkit va a crecer. */}
        <p className="mt-14 text-center text-[11px] uppercase tracking-[0.18em] text-[#5C6273]">
          Más herramientas en camino · construidas en Flowdex
        </p>
      </section>
    </main>
  )
}
