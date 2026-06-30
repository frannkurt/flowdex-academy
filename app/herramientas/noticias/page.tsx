import Link from "next/link"
import type { Metadata } from "next"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { NoticiasTabs } from "@/components/herramientas/NoticiasTabs"
import { fetchAllNews, NEWS_SOURCES } from "@/lib/rss/fetch-news"

export const metadata: Metadata = {
  title: "Noticias financieras y calendario económico",
  description:
    "Headlines macro en español e inglés, agregados de Ámbito Financiero, Investing.com y Yahoo Finance, más el calendario económico en tiempo real.",
  alternates: { canonical: "/herramientas/noticias" },
}

// Cache de página: revalidamos cada 30 minutos. fetchAllNews ya hace cache
// a nivel de fetch (Next desduplica), pero declararlo a nivel de page hace
// que el HTML mismo se sirva desde cache CDN cuando aplica.
export const revalidate = 1800

export default async function NoticiasPage() {
  const items = await fetchAllNews(18)

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05070D] pt-24 pb-20 text-white">
      <div className="pointer-events-none absolute left-0 top-12 opacity-[0.06] sm:left-10 sm:opacity-[0.08]">
        <OrbitalIcon size={420} animate />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-120px] top-32 h-80 w-80 rounded-full bg-[#5BB8D4]/12 blur-3xl" />
        <div className="absolute -left-24 bottom-40 h-72 w-72 rounded-full bg-[#7DD4C0]/10 blur-3xl" />
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
            <p className="ml-2 text-[11px] uppercase tracking-[0.24em] text-[#5BB8D4]">Contexto macro</p>
          </div>
          <h1 className="mt-5 type-display-lg text-white">
            Lo que está moviendo los mercados
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-[#B8BDC9]">
            Headlines agregados de fuentes serias en español e inglés, ordenados por hora. En el tab de calendario,
            la agenda económica para anticipar qué evento puede mover los precios.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-[#98A1B5]">
            {NEWS_SOURCES.map((source) => (
              <span
                key={source.id}
                className="rounded-full border bg-black/20 px-3 py-1"
                style={{
                  borderColor: `${source.accent}40`,
                  color: source.accent,
                }}
              >
                {source.name}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs: Noticias / Calendario económico */}
        <NoticiasTabs items={items} />
      </section>
    </main>
  )
}
