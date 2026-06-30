// Tipos de cambio cruzados de divisas — tabla en tiempo real de los pares
// entre las monedas elegidas. Va al lado de la calculadora de posición forex
// para que el alumno vea las cotizaciones cruzadas mientras dimensiona.

import { TradingViewWidget } from "./TradingViewWidget"

export function ForexCrossRates({ height = 400 }: { height?: number }) {
  return (
    <TradingViewWidget
      scriptSrc="embed-widget-forex-cross-rates.js"
      minHeight={height}
      config={{
        width: "100%",
        height,
        currencies: ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "ARS"],
        isTransparent: true,
        colorTheme: "dark",
        locale: "es",
      }}
    />
  )
}
