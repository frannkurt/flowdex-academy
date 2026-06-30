// Screener / analizador de acciones — buscador con filtros por fundamentals
// e indicadores. Se usa en dos mercados: EE.UU. (contenido global) y
// Argentina / BYMA (lo local). El prop `market` decide cuál.

import { TradingViewWidget } from "./TradingViewWidget"

type Market = "america" | "argentina"

export function StockScreener({
  market = "america",
  height = 560,
}: {
  market?: Market
  height?: number
}) {
  return (
    <TradingViewWidget
      scriptSrc="embed-widget-screener.js"
      minHeight={height}
      config={{
        width: "100%",
        height,
        defaultColumn: "overview",
        defaultScreen: "general",
        market,
        showToolbar: true,
        colorTheme: "dark",
        locale: "es",
        isTransparent: true,
      }}
    />
  )
}
