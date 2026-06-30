"use client"

// Tabs de la página /herramientas/noticias: separa Noticias del Calendario
// económico. En el tab de calendario va primero el widget de TradingView
// (dark, tematizado) y abajo el de Investing.com como respaldo de data.

import { useEffect, useState } from "react"
import type { NewsItem } from "@/lib/rss/fetch-news"
import { NewsFeed } from "@/components/herramientas/NewsFeed"
import { EconomicCalendar } from "@/components/herramientas/tradingview/EconomicCalendar"
import { IframeTouchGuard } from "@/components/herramientas/tradingview/TradingViewWidget"

type Tab = "noticias" | "calendario"

export function NoticiasTabs({ items }: { items: NewsItem[] }) {
  const [tab, setTab] = useState<Tab>("noticias")

  // Deep-link al tab de calendario: los cursos linkean a
  // /herramientas/noticias#calendario (antes apuntaban a
  // /herramientas#calendario, anchor que murió cuando /herramientas se
  // refactorizó a hub + sub-páginas). Lo resolvemos en useEffect (no en
  // el initializer de useState) para no generar hydration mismatch:
  // el server siempre renderiza "noticias".
  useEffect(() => {
    if (window.location.hash === "#calendario") {
      setTab("calendario")
    }
  }, [])

  return (
    <div>
      {/* Selector de tabs */}
      <div className="mb-8 inline-flex rounded-full border border-[#1F2330] bg-[#0B0E16]/70 p-1">
        <button
          type="button"
          onClick={() => setTab("noticias")}
          className={`rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-all ${
            tab === "noticias"
              ? "bg-[#5BB8D4]/15 text-[#5BB8D4] shadow-[inset_0_0_0_1px_rgba(91,184,212,0.4)]"
              : "text-[#7E8898] hover:text-[#B8BDC9]"
          }`}
        >
          Noticias
        </button>
        <button
          type="button"
          onClick={() => setTab("calendario")}
          className={`rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-all ${
            tab === "calendario"
              ? "bg-[#7DD4C0]/15 text-[#7DD4C0] shadow-[inset_0_0_0_1px_rgba(125,212,192,0.4)]"
              : "text-[#7E8898] hover:text-[#B8BDC9]"
          }`}
        >
          Calendario económico
        </button>
      </div>

      {/* === TAB NOTICIAS === */}
      {tab === "noticias" && (
        <div>
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#5BB8D4]">Últimos headlines</p>
              <h2 className="mt-1.5 type-display-sm text-white">Noticias</h2>
            </div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#5C6273]">Actualizan cada 30 min</p>
          </div>
          <NewsFeed items={items} />
        </div>
      )}

      {/* === TAB CALENDARIO === */}
      {tab === "calendario" && (
        <div className="space-y-8">
          {/* Calendario TradingView (principal) */}
          <article className="overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(170deg,#0F1117_0%,#0B0D14_100%)] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#7DD4C0]">Agenda económica</p>
                <h2 className="mt-2 type-display-sm text-white">Calendario económico</h2>
                <p className="mt-1 text-[11px] text-[#8C93A3]">Importancia media y alta · EE.UU. y eurozona</p>
              </div>
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[#7DD4C0]/30 bg-[#0C1A1F]/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#7DD4C0]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7DD4C0] shadow-[0_0_8px_#7DD4C0]" />
                Live
              </span>
            </div>
            <div className="mb-4 h-px w-full bg-gradient-to-r from-[#7DD4C0]/35 via-[#2A2A2A] to-transparent" />
            <EconomicCalendar height={620} />
          </article>

          {/* Calendario Investing.com (respaldo de data) */}
          <article
            id="calendario-investing"
            className="overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(170deg,#0F1117_0%,#0B0D14_100%)] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#5BB8D4]">Vista alternativa</p>
                <h2 className="mt-2 type-display-sm text-white">Calendario Investing.com</h2>
                <p className="mt-1 text-[11px] text-[#8C93A3]">Cobertura más amplia de países y eventos</p>
              </div>
            </div>
            <div className="mb-4 h-px w-full bg-gradient-to-r from-[#5BB8D4]/35 via-[#2A2A2A] to-transparent" />
            <div className="relative mx-auto w-full max-w-[700px] overflow-hidden rounded-2xl border border-[#24303D] bg-[radial-gradient(circle_at_top,#18202A_0%,#0A0A0A_48%,#07080B_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ring-1 ring-[#FFFFFF0F] sm:p-4">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#5BB8D4]/8 to-transparent" />
              <iframe
                src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=25,32,6,37,72,22,17,39,14,10,35,43,56,36,110,11,26,12,4,5&calType=day&timeZone=48&lang=1"
                title="Calendario económico en tiempo real (Investing.com)"
                className="relative z-10 mx-auto block h-[680px] w-full max-w-[650px] rounded-lg bg-white sm:h-[720px]"
                frameBorder="0"
                marginWidth={0}
                marginHeight={0}
              />
              {/* Guard táctil: sin esto, en mobile el iframe de Investing se
                  traga el swipe (scrollea su lista interna de eventos) y la
                  página queda "atrapada" sin poder scrollear hacia abajo. */}
              <IframeTouchGuard />
            </div>
            <p className="mx-auto mt-3 w-full max-w-[760px] text-xs text-[#8C93A3]">
              Real Time Economic Calendar provided by{" "}
              <a
                href="https://www.investing.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#5BB8D4] transition-colors hover:text-white"
              >
                Investing.com
              </a>
              .
            </p>
          </article>
        </div>
      )}
    </div>
  )
}
