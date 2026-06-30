// Mapa de calor de acciones — S&P 500 agrupado por sector, tamaño por market
// cap y color por variación del día. Reemplaza el link externo que mandaba
// al heatmap a tradingview.com; ahora vive nativo en /herramientas/mercados.

import { TradingViewWidget } from "./TradingViewWidget"

export function StockHeatmap({ height = 560 }: { height?: number }) {
  return (
    <TradingViewWidget
      scriptSrc="embed-widget-stock-heatmap.js"
      minHeight={height}
      config={{
        dataSource: "SPX500",
        blockSize: "market_cap_basic",
        blockColor: "change",
        grouping: "sector",
        locale: "es",
        symbolUrl: "",
        colorTheme: "dark",
        hasTopBar: false,
        isDataSetEnabled: false,
        isZoomEnabled: true,
        hasSymbolTooltip: true,
        isMonoSize: false,
        width: "100%",
        height,
      }}
    />
  )
}
