// Resumen de mercado — panel con 4 tabs (índices, acciones/CEDEARs, cripto,
// forex) y mini-gráfico. Foto macro de un vistazo para el alumno.

import { TradingViewWidget } from "./TradingViewWidget"

const TABS = [
  {
    title: "Índices",
    symbols: [
      { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
      { s: "FOREXCOM:NSXUSD", d: "Nasdaq 100" },
      { s: "FOREXCOM:DJI", d: "Dow Jones" },
      { s: "FOREXCOM:US2000", d: "Russell 2000" },
    ],
    originalTitle: "Indices",
  },
  {
    title: "Acciones",
    symbols: [
      { s: "NASDAQ:AAPL", d: "Apple" },
      { s: "NASDAQ:NVDA", d: "Nvidia" },
      { s: "NASDAQ:TSLA", d: "Tesla" },
      { s: "NASDAQ:MSFT", d: "Microsoft" },
      { s: "NASDAQ:AMZN", d: "Amazon" },
      { s: "NYSE:KO", d: "Coca-Cola" },
      { s: "NASDAQ:MELI", d: "MercadoLibre" },
      { s: "NASDAQ:GGAL", d: "Galicia" },
    ],
    originalTitle: "Stocks",
  },
  {
    title: "Cripto",
    symbols: [
      { s: "BINANCE:BTCUSDT", d: "Bitcoin" },
      { s: "BINANCE:ETHUSDT", d: "Ethereum" },
      { s: "BINANCE:SOLUSDT", d: "Solana" },
      { s: "BINANCE:BNBUSDT", d: "BNB" },
    ],
    originalTitle: "Crypto",
  },
  {
    title: "Forex",
    symbols: [
      { s: "FX:EURUSD", d: "EUR/USD" },
      { s: "FX:GBPUSD", d: "GBP/USD" },
      { s: "FX:USDJPY", d: "USD/JPY" },
      { s: "FX_IDC:USDARS", d: "USD/ARS" },
    ],
    originalTitle: "Forex",
  },
]

export function MarketOverview({ height = 540 }: { height?: number }) {
  return (
    <TradingViewWidget
      scriptSrc="embed-widget-market-overview.js"
      minHeight={height}
      config={{
        colorTheme: "dark",
        dateRange: "12M",
        showChart: true,
        locale: "es",
        isTransparent: true,
        showSymbolLogo: true,
        showFloatingTooltip: true,
        width: "100%",
        height,
        tabs: TABS,
      }}
    />
  )
}
