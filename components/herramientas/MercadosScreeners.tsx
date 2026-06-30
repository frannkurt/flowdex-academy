"use client"

// Sección de screeners con dos tabs: EE.UU. (contenido global) y Argentina /
// BYMA (lo local). Cada tab monta el widget de TradingView con su mercado.

import { useState } from "react"
import { StockScreener } from "@/components/herramientas/tradingview/StockScreener"

type Market = "america" | "argentina"

export function MercadosScreeners() {
  const [market, setMarket] = useState<Market>("america")

  return (
    <div>
      <div className="mb-5 inline-flex rounded-full border border-[#1F2330] bg-[#0B0E16]/70 p-1">
        <button
          type="button"
          onClick={() => setMarket("america")}
          className={`rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-all ${
            market === "america"
              ? "bg-[#5BB8D4]/15 text-[#5BB8D4] shadow-[inset_0_0_0_1px_rgba(91,184,212,0.4)]"
              : "text-[#7E8898] hover:text-[#B8BDC9]"
          }`}
        >
          EE.UU.
        </button>
        <button
          type="button"
          onClick={() => setMarket("argentina")}
          className={`rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-all ${
            market === "argentina"
              ? "bg-[#7DD4C0]/15 text-[#7DD4C0] shadow-[inset_0_0_0_1px_rgba(125,212,192,0.4)]"
              : "text-[#7E8898] hover:text-[#B8BDC9]"
          }`}
        >
          Argentina · BYMA
        </button>
      </div>

      {/* key fuerza el remount al cambiar de mercado para re-inyectar el script */}
      <StockScreener key={market} market={market} height={580} />
    </div>
  )
}
