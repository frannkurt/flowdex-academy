import Link from "next/link"
import type { Metadata } from "next"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { ToolsCalculator } from "@/components/herramientas/ToolsCalculator"
import { ForexCrossRates } from "@/components/herramientas/tradingview/ForexCrossRates"

export const metadata: Metadata = {
  title: "Calculadoras: posición, interés compuesto, riesgo/beneficio",
  description:
    "Tres calculadoras propias de Flowdex para trading e inversión: tamaño de posición por riesgo, proyección de capital con interés compuesto y análisis riesgo/beneficio.",
  alternates: { canonical: "/herramientas/calculadoras" },
}

export default function CalculadorasPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05070D] pt-24 pb-20 text-white">
      {/* OrbitalIcon como decoración de fondo, muy bajo opacity para que
          aparezca como filigrana sin pelear con el contenido. Es nuestra
          marca de propiedad: cualquier visitante que vea esta página
          asocia el orbital con Flowdex. */}
      <div className="pointer-events-none absolute right-0 top-12 opacity-[0.06] sm:right-10 sm:opacity-[0.08]">
        <OrbitalIcon size={420} animate />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-[#7DD4C0]/12 blur-3xl" />
        <div className="absolute right-[-120px] bottom-40 h-80 w-80 rounded-full bg-[#5BB8D4]/10 blur-3xl" />
        <div className="absolute bottom-[-180px] left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#2A7E96]/10 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/herramientas"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[#7E8898] transition-colors hover:text-[#7DD4C0]"
        >
          <span aria-hidden="true">←</span>
          Herramientas
        </Link>

        <div className="mt-6 mb-10 overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(140deg,#111421_0%,#0B0E16_58%,#0A1116_100%)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-9">
          <div className="inline-flex items-center rounded-full border border-[#28434B] bg-[#0C1A1F]/70 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7DD4C0] shadow-[0_0_8px_#7DD4C0]" />
            <p className="ml-2 text-[11px] uppercase tracking-[0.24em] text-[#7DD4C0]">Calculadoras</p>
          </div>
          <h1 className="mt-5 type-display-lg text-white">
            Pensá la operación antes de abrirla
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-[#B8BDC9]">
            Tres herramientas con metodología propia para resolver las preguntas que aparecen siempre: cuántas unidades
            cargar, dónde termina el capital con aportes constantes y si el ratio riesgo/beneficio sobrevive a una
            racha mala.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-[#98A1B5]">
            <span className="rounded-full border border-[#7DD4C0]/40 bg-[#0F1F1A]/70 px-3 py-1 text-[#7DD4C0]">
              Tamaño de posición
            </span>
            <span className="rounded-full border border-[#C97A4D]/40 bg-[#1F140D]/70 px-3 py-1 text-[#C97A4D]">
              Futuros
            </span>
            <span className="rounded-full border border-[#5BB8D4]/40 bg-[#0F1820]/70 px-3 py-1 text-[#5BB8D4]">
              Interés compuesto
            </span>
          </div>
        </div>

        <ToolsCalculator />

        {/* Tipos de cambio cruzados — acompaña a la calculadora de posición
            forex: las cotizaciones cruzadas en vivo mientras dimensionás. */}
        <article className="mt-10 overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(170deg,#0F1117_0%,#0B0D14_100%)] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:p-6">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#7DD4C0]">Forex en vivo</p>
            <h2 className="mt-2 type-display-sm text-white">Tipos de cambio cruzados</h2>
            <p className="mt-1 text-[11px] text-[#8C93A3]">Cotizaciones cruzadas en tiempo real para acompañar el sizing</p>
          </div>
          <div className="mb-4 h-px w-full bg-gradient-to-r from-[#7DD4C0]/35 via-[#2A2A2A] to-transparent" />
          <ForexCrossRates height={400} />
        </article>
      </section>
    </main>
  )
}
