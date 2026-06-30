"use client"

// Widget de TradingView embebido dentro del contenido de un curso (bloque
// `tv_widget`). Mapea el tipo de widget a su script de embed y su config,
// y lo envuelve en una card sobria con label y caption opcionales para que
// se integre con la estética de las clases. Dark + transparente.

import { TradingViewWidget } from "./TradingViewWidget"

export type CourseWidgetKind =
  | "advanced_chart"
  | "symbol_info"
  | "fundamental_data"
  | "company_profile"
  | "technical_analysis"

const SCRIPT: Record<CourseWidgetKind, string> = {
  advanced_chart: "embed-widget-advanced-chart.js",
  symbol_info: "embed-widget-symbol-info.js",
  fundamental_data: "embed-widget-financials.js",
  company_profile: "embed-widget-symbol-profile.js",
  technical_analysis: "embed-widget-technical-analysis.js",
}

const DEFAULT_HEIGHT: Record<CourseWidgetKind, number> = {
  advanced_chart: 500,
  symbol_info: 220,
  fundamental_data: 440,
  company_profile: 400,
  technical_analysis: 425,
}

function buildConfig(kind: CourseWidgetKind, symbol: string, height: number): Record<string, unknown> {
  if (kind === "advanced_chart") {
    return {
      autosize: false,
      width: "100%",
      height,
      symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "es",
      allow_symbol_change: true,
      hide_side_toolbar: false,
      hide_volume: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
    }
  }

  const base = {
    symbol,
    colorTheme: "dark",
    isTransparent: true,
    locale: "es",
    width: "100%",
    height,
  }

  if (kind === "fundamental_data") {
    return { ...base, displayMode: "regular", largeChartUrl: "" }
  }

  if (kind === "technical_analysis") {
    return { ...base, interval: "1D", showIntervalTabs: true, displayMode: "single" }
  }

  return base
}

export function CourseTradingViewWidget({
  kind,
  symbol,
  label,
  caption,
  height,
}: {
  kind: CourseWidgetKind
  symbol: string
  label?: string
  caption?: string
  height?: number
}) {
  const resolvedHeight = height ?? DEFAULT_HEIGHT[kind]

  return (
    <div className="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0B0E16]/50">
      <div className="flex items-center justify-between border-b border-[#1F2330] px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5BB8D4]">
          {label ?? "Datos en vivo"}
        </span>
        <span className="text-[10px] uppercase tracking-[0.16em] text-[#5C6273]">TradingView</span>
      </div>
      <div className="p-2 sm:p-3">
        <TradingViewWidget
          scriptSrc={SCRIPT[kind]}
          config={buildConfig(kind, symbol, resolvedHeight)}
          minHeight={resolvedHeight}
        />
      </div>
      {caption && (
        <p className="border-t border-[#1F2330] px-4 py-2.5 text-[11px] leading-relaxed text-[#8C93A3]">
          {caption}
        </p>
      )}
    </div>
  )
}
