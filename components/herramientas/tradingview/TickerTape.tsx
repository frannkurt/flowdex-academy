// Cinta de cotizaciones (ticker tape) — una sola línea fina estilo terminal.
// 14 símbolos: índices US, CEDEARs populares, cripto, macro y el toque
// local con USD/ARS. displayMode "compact" la mantiene en una fila que corre
// en horizontal, también en mobile (no se apila ni crece en alto).

import { TradingViewWidget } from "./TradingViewWidget"

const SYMBOLS = [
  { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
  { proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100" },
  { proName: "FOREXCOM:DJI", title: "Dow Jones" },
  { proName: "NASDAQ:AAPL", title: "Apple" },
  { proName: "NASDAQ:NVDA", title: "Nvidia" },
  { proName: "NASDAQ:TSLA", title: "Tesla" },
  { proName: "NASDAQ:MSFT", title: "Microsoft" },
  { proName: "NYSE:KO", title: "Coca-Cola" },
  { proName: "BINANCE:BTCUSDT", title: "Bitcoin" },
  { proName: "BINANCE:ETHUSDT", title: "Ethereum" },
  { proName: "TVC:GOLD", title: "Oro" },
  { proName: "TVC:DXY", title: "Índice dólar" },
  { proName: "FX:EURUSD", title: "EUR/USD" },
  { proName: "FX_IDC:USDARS", title: "USD/ARS" },
]

export function TickerTape({ className }: { className?: string }) {
  return (
    <TradingViewWidget
      scriptSrc="embed-widget-ticker-tape.js"
      minHeight={46}
      lazy={false}
      // La cinta es display-only (corre sola, no se interactúa): el pill
      // "tocá para interactuar" taparía la única línea de cotizaciones.
      touchGuardHint={false}
      className={className}
      config={{
        symbols: SYMBOLS,
        showSymbolLogo: true,
        isTransparent: true,
        displayMode: "compact",
        colorTheme: "dark",
        locale: "es",
      }}
    />
  )
}
