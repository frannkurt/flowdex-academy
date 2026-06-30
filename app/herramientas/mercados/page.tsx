import Link from "next/link"
import type { Metadata } from "next"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { MarketOverview } from "@/components/herramientas/tradingview/MarketOverview"
import { StockHeatmap } from "@/components/herramientas/tradingview/StockHeatmap"
import { MercadosScreeners } from "@/components/herramientas/MercadosScreeners"

export const metadata: Metadata = {
  title: "Mercados: resumen, mapa de calor y screener",
  description:
    "Foto macro de los mercados, mapa de calor del S&P 500 por sector y screener de acciones para filtrar por fundamentals e indicadores en EE.UU. y Argentina.",
  alternates: { canonical: "/herramientas/mercados" },
}

export default function MercadosPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05070D] pt-24 pb-20 text-white">
      <div className="pointer-events-none absolute right-0 top-12 opacity-[0.06] sm:right-10 sm:opacity-[0.08]">
        <OrbitalIcon size={420} animate />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-[#5BB8D4]/12 blur-3xl" />
        <div className="absolute right-[-120px] bottom-40 h-80 w-80 rounded-full bg-[#7DD4C0]/10 blur-3xl" />
        <div className="absolute bottom-[-180px] left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#2A7E96]/10 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/herramientas"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[#7E8898] transition-colors hover:text-[#5BB8D4]"
        >
          <span aria-hidden="true">←</span>
          Herramientas
        </Link>

        <div className="mt-6 mb-10 overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(140deg,#111421_0%,#0B0E16_58%,#0A1116_100%)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-9">
          <div className="inline-flex items-center rounded-full border border-[#28434B] bg-[#0C1A1F]/70 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5BB8D4] shadow-[0_0_8px_#5BB8D4]" />
            <p className="ml-2 text-[11px] uppercase tracking-[0.24em] text-[#5BB8D4]">Mercados</p>
          </div>
          <h1 className="mt-5 type-display-lg text-white">El mapa completo del mercado</h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-[#B8BDC9]">
            La foto macro de un vistazo, el mapa de calor del S&P 500 por sector y un screener para filtrar acciones
            por fundamentals e indicadores. Para entender dónde está la fuerza antes de decidir.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-[#98A1B5]">
            <span className="rounded-full border border-[#5BB8D4]/40 bg-[#0F1820]/70 px-3 py-1 text-[#5BB8D4]">
              Resumen de mercado
            </span>
            <span className="rounded-full border border-[#7DD4C0]/40 bg-[#0F1F1A]/70 px-3 py-1 text-[#7DD4C0]">
              Mapa de calor
            </span>
            <span className="rounded-full border border-[#D4B86A]/40 bg-[#1A1408]/70 px-3 py-1 text-[#D4B86A]">
              Screener
            </span>
          </div>
        </div>

        {/* === RESUMEN DE MERCADO === */}
        <article className="mb-10 overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(170deg,#0F1117_0%,#0B0D14_100%)] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:p-6">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#5BB8D4]">Visión macro</p>
            <h2 className="mt-2 type-display-sm text-white">Resumen de mercado</h2>
            <p className="mt-1 text-[11px] text-[#8C93A3]">Índices, acciones, cripto y forex</p>
          </div>
          <div className="mb-4 h-px w-full bg-gradient-to-r from-[#5BB8D4]/35 via-[#2A2A2A] to-transparent" />
          <MarketOverview height={540} />
        </article>

        {/* === MAPA DE CALOR === */}
        <article className="mb-10 overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(170deg,#0F1117_0%,#0B0D14_100%)] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:p-6">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#7DD4C0]">Sectores y breadth</p>
            <h2 className="mt-2 type-display-sm text-white">Mapa de calor · S&P 500</h2>
            <p className="mt-1 text-[11px] text-[#8C93A3]">Agrupado por sector · tamaño por market cap · color por variación del día</p>
          </div>
          <div className="mb-4 h-px w-full bg-gradient-to-r from-[#7DD4C0]/35 via-[#2A2A2A] to-transparent" />
          <StockHeatmap height={560} />
        </article>

        {/* === SCREENER === */}
        <article className="overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(170deg,#0F1117_0%,#0B0D14_100%)] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:p-6">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D4B86A]">Buscador con filtros</p>
            <h2 className="mt-2 type-display-sm text-white">Screener de acciones</h2>
            <p className="mt-1 text-[11px] text-[#8C93A3]">Filtrá por fundamentals e indicadores · EE.UU. y Argentina</p>
          </div>
          <div className="mb-4 h-px w-full bg-gradient-to-r from-[#D4B86A]/35 via-[#2A2A2A] to-transparent" />
          <MercadosScreeners />
        </article>
      </section>
    </main>
  )
}
