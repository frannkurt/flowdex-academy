// Calendario económico de TradingView.
// Importancia media + alta (importanceFilter "0,1") y foco USD + eurozona
// (currencyFilter "USD,EUR") — lo que mueve los futuros US y las acciones
// US/CEDEARs que operan los alumnos. Dark + transparente sobre el fondo.

import { TradingViewWidget } from "./TradingViewWidget"

export function EconomicCalendar({ height = 620 }: { height?: number }) {
  return (
    <TradingViewWidget
      scriptSrc="embed-widget-events.js"
      minHeight={height}
      config={{
        colorTheme: "dark",
        isTransparent: true,
        width: "100%",
        height,
        locale: "es",
        importanceFilter: "0,1",
        currencyFilter: "USD,EUR",
      }}
    />
  )
}
