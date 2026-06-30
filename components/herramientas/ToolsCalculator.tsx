"use client"

// Calculadora propia de Flowdex para reemplazar el iframe de Cashback Forex
// en /herramientas. Tres herramientas en tabs internos:
//   1. Tamaño de posición (trading)        → teal #7DD4C0
//   2. Interés compuesto (inversiones)     → azul #5BB8D4
//   3. Riesgo / beneficio (R:R)            → dorado #D4B86A
//
// Cada tab calcula 100% client-side, sin feed externo ni APIs de terceros.
// Los presets de pip value (position size) y los defaults son neutros: el
// usuario puede sobreescribir todo. La calculadora no pretende reemplazar
// el ejecutor del broker — es para sizing rápido y simulación.

import { useEffect, useMemo, useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"

type ToolTab = "position" | "compound" | "futures"

type TabMeta = {
  id: ToolTab
  label: string
  color: string
  badge: string
  description: string
  beta?: boolean
}

// Orden de tabs por cercanía pedagógica al alumno Flowdex (2026-05-26):
// arrancamos por forex (lo más universal), después R:R (gestión clásica),
// después futuros (más específico, prop firms), y cerramos con interés
// compuesto (foco distinto: inversión a largo plazo, no operación activa).
const TABS: TabMeta[] = [
  {
    id: "position",
    label: "Tamaño de posición",
    color: "#7DD4C0",
    badge: "Forex",
    beta: true,
    description:
      "Sizing por riesgo en forex: capital × % a arriesgar / (stop × valor del pip). Devuelve lotes y unidades para que abras la operación con el monto correcto.",
  },
  {
    id: "futures",
    label: "Futuros",
    // Terracota: cuarto color institucional que cierra la paleta cálida
    // del sistema (junto con el dorado IC). Diferenciable de teal/azul/dorado.
    color: "#C97A4D",
    badge: "Prop / futuros",
    beta: true,
    description:
      "Sizing para contratos de futuros US (ES, NQ, MES, MNQ, MGC). Calcula pérdida potencial en dólares, ratio R:R y % del capital o drawdown si operás cuenta de prop firm.",
  },
  {
    id: "compound",
    label: "Interés compuesto",
    color: "#5BB8D4",
    badge: "Inversiones",
    description:
      "Proyección de capital con aportes recurrentes y rendimiento compuesto. La gráfica muestra cómo se separa el balance real del dinero que aportaste.",
  },
]

// Metadata por par. La lógica del componente decide si necesita fetchear
// rate o no según QUOTE: si es USD el pip value es fijo ($10/lote para
// pip_size=0.0001, $10 para XAU con pip=0.01), si es otra moneda se
// fetchea USD/QUOTE y se calcula pip_value_usd = (pipSize * 100k) / rate.
// `defaultPipValueUsd` se usa como fallback inmediato mientras llega el
// rate y como valor final si el fetch falla.
//
// CONTRACT_SIZE = 100.000 unidades del activo base (lote standard FX).
type PairMeta = {
  base: string
  quote: string
  pipSize: number
  autoFetch: boolean
  defaultPipValueUsd: number
  note: string
}

const CONTRACT_SIZE = 100_000

const PAIRS: Record<string, PairMeta> = {
  // Majors XXX/USD: pip value fijo $10/lote, no necesita fetch.
  "EUR/USD": { base: "EUR", quote: "USD", pipSize: 0.0001, autoFetch: false, defaultPipValueUsd: 10, note: "Mayor más operado." },
  "GBP/USD": { base: "GBP", quote: "USD", pipSize: 0.0001, autoFetch: false, defaultPipValueUsd: 10, note: "Volátil, spread más ancho." },
  "AUD/USD": { base: "AUD", quote: "USD", pipSize: 0.0001, autoFetch: false, defaultPipValueUsd: 10, note: "Sensible a commodities." },
  "NZD/USD": { base: "NZD", quote: "USD", pipSize: 0.0001, autoFetch: false, defaultPipValueUsd: 10, note: "Correlación con AUD." },

  // USD/XXX: necesita rate USD/QUOTE. JPY tiene pipSize=0.01 (precios sin decimales fraccionarios).
  "USD/JPY": { base: "USD", quote: "JPY", pipSize: 0.01, autoFetch: true, defaultPipValueUsd: 6.5, note: "Pip = 0.01." },
  "USD/CAD": { base: "USD", quote: "CAD", pipSize: 0.0001, autoFetch: true, defaultPipValueUsd: 7.3, note: "Correlación con WTI." },
  "USD/CHF": { base: "USD", quote: "CHF", pipSize: 0.0001, autoFetch: true, defaultPipValueUsd: 11.2, note: "Refugio europeo." },

  // Cross con JPY (pip = 0.01)
  "EUR/JPY": { base: "EUR", quote: "JPY", pipSize: 0.01, autoFetch: true, defaultPipValueUsd: 6.5, note: "Cross popular, volatilidad media." },
  "GBP/JPY": { base: "GBP", quote: "JPY", pipSize: 0.01, autoFetch: true, defaultPipValueUsd: 6.5, note: "Cross volátil, gran rango diario." },
  "AUD/JPY": { base: "AUD", quote: "JPY", pipSize: 0.01, autoFetch: true, defaultPipValueUsd: 6.5, note: "Cross risk-on típico." },

  // Cross sin USD (pip = 0.0001)
  "EUR/GBP": { base: "EUR", quote: "GBP", pipSize: 0.0001, autoFetch: true, defaultPipValueUsd: 13, note: "Cross europeo, baja volatilidad." },
  "AUD/NZD": { base: "AUD", quote: "NZD", pipSize: 0.0001, autoFetch: true, defaultPipValueUsd: 5.9, note: "Cross commodities Oceanía." },
  "EUR/AUD": { base: "EUR", quote: "AUD", pipSize: 0.0001, autoFetch: true, defaultPipValueUsd: 6.5, note: "Cross EUR-AUD, volátil." },

  // Oro / metales: Frankfurter NO soporta XAU. Manual con default $10/lote
  // (estandarizado en la mayoría de brokers para spot gold).
  "XAU/USD": { base: "XAU", quote: "USD", pipSize: 0.01, autoFetch: false, defaultPipValueUsd: 10, note: "Oro spot, pip = 0.01. Pip value manual." },

  // Custom: el usuario define todo, sin fetch.
  Custom: { base: "", quote: "", pipSize: 0.0001, autoFetch: false, defaultPipValueUsd: 10, note: "Definí pip value manualmente." },
}

// Agrupamiento para el <select> con <optgroup>. Orden basado en el uso
// real: lo más operado primero (Majors), exóticos al final (Metales,
// Custom). Es el orden que usan Oanda / IG / Pepperstone en sus selectors.
const PAIR_GROUPS: Array<{ label: string; pairs: Array<keyof typeof PAIRS> }> = [
  { label: "Majors", pairs: ["EUR/USD", "GBP/USD", "AUD/USD", "NZD/USD"] },
  { label: "USD pairs", pairs: ["USD/JPY", "USD/CAD", "USD/CHF"] },
  { label: "Cross con JPY", pairs: ["EUR/JPY", "GBP/JPY", "AUD/JPY"] },
  { label: "Otros cross", pairs: ["EUR/GBP", "AUD/NZD", "EUR/AUD"] },
  { label: "Metales", pairs: ["XAU/USD"] },
  { label: "Otro", pairs: ["Custom"] },
]

function formatMoney(value: number, opts?: { compact?: boolean }) {
  if (!Number.isFinite(value)) return "—"
  if (opts?.compact && Math.abs(value) >= 10_000) {
    return value.toLocaleString("es-AR", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    })
  }
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  })
}

function formatNumber(value: number, decimals = 2) {
  if (!Number.isFinite(value)) return "—"
  return value.toLocaleString("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

// ---------- 1. Position Size ----------

type FetchStatus = "idle" | "loading" | "success" | "error" | "unsupported"

function PositionSizeCalculator() {
  const [capital, setCapital] = useState("10000")
  const [riskPct, setRiskPct] = useState("1")
  const [stopPips, setStopPips] = useState("20")
  const [pair, setPair] = useState<keyof typeof PAIRS>("EUR/USD")
  const [pipValue, setPipValue] = useState(String(PAIRS["EUR/USD"].defaultPipValueUsd))

  // Estado del fetch de rate. Si el par requiere autoFetch, llamamos al
  // endpoint /api/forex-rate cuando cambia. Si el par no requiere fetch
  // (majors XXX/USD, XAU, Custom), status queda en "idle" y el pip value
  // se setea con el default del preset.
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle")
  const [livePrice, setLivePrice] = useState<number | null>(null)
  const [priceDate, setPriceDate] = useState<string | null>(null)

  const handlePairChange = (next: keyof typeof PAIRS) => {
    setPair(next)
    // Reseteamos pipValue al default del nuevo par mientras llega el fetch
    // (si aplica) — evita que quede el pipValue del par anterior visible
    // durante el loading.
    setPipValue(String(PAIRS[next].defaultPipValueUsd))
    setLivePrice(null)
    setPriceDate(null)
  }

  // Effect que dispara el fetch del rate cuando el par cambia y requiere
  // autoFetch. Maneja cancelación con AbortController para evitar race
  // conditions si el usuario cambia de par antes de que llegue la respuesta
  // (la respuesta vieja podría sobreescribir el pipValue del par nuevo).
  useEffect(() => {
    const meta = PAIRS[pair]

    if (!meta.autoFetch) {
      setFetchStatus("idle")
      setLivePrice(null)
      setPriceDate(null)
      return
    }

    const controller = new AbortController()
    setFetchStatus("loading")

    fetch(`/api/forex-rate?from=USD&to=${meta.quote}`, { signal: controller.signal })
      .then(async (r) => {
        const data = await r.json()
        if (controller.signal.aborted) return

        if (!r.ok) {
          // 404 explícito = par no soportado por Frankfurter (no es error real)
          setFetchStatus(r.status === 404 ? "unsupported" : "error")
          // Mantenemos el default que ya setee handlePairChange.
          return
        }

        const rate = typeof data?.rate === "number" ? data.rate : null
        if (!rate || rate <= 0) {
          setFetchStatus("error")
          return
        }

        // pip_value_usd = (pipSize * contract_size) / rate_usd_quote
        const pipValueUsd = (meta.pipSize * CONTRACT_SIZE) / rate
        setPipValue(pipValueUsd.toFixed(2))
        setLivePrice(rate)
        setPriceDate(typeof data?.date === "string" ? data.date : null)
        setFetchStatus("success")
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        console.error("[position-size] fetch rate failed:", err)
        setFetchStatus("error")
      })

    return () => controller.abort()
  }, [pair])

  const result = useMemo(() => {
    const capitalN = Number(capital)
    const riskPctN = Number(riskPct)
    const stopN = Number(stopPips)
    const pipN = Number(pipValue)

    if (!Number.isFinite(capitalN) || capitalN <= 0) return null
    if (!Number.isFinite(riskPctN) || riskPctN <= 0) return null
    if (!Number.isFinite(stopN) || stopN <= 0) return null
    if (!Number.isFinite(pipN) || pipN <= 0) return null

    const riskUsd = capitalN * (riskPctN / 100)
    // Lotes standard (CONTRACT_SIZE = 100k unidades) que arriesgan
    // exactamente riskUsd dado el stop y el valor del pip.
    const lots = riskUsd / (stopN * pipN)
    const units = lots * CONTRACT_SIZE

    return {
      riskUsd,
      lots,
      miniLots: lots * 10,
      microLots: lots * 100,
      units,
    }
  }, [capital, riskPct, stopPips, pipValue])

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2.5 rounded-lg border border-[#D9A441]/25 bg-[#D9A441]/[0.06] px-3.5 py-2.5">
        <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#D9A441]/50 text-[9px] font-bold text-[#D9A441]">!</span>
        <p className="text-[12px] leading-relaxed text-[#C9B486]">
          <span className="font-semibold uppercase tracking-wide text-[#D9A441]">Beta</span> · Usala como guía y verificá los números antes de operar con dinero real.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-4">
        <FieldGroup label="Capital de la cuenta" suffix="USD">
          <NumberInput
            value={capital}
            onChange={setCapital}
            min={0}
            step={100}
            accent="#7DD4C0"
          />
        </FieldGroup>

        <FieldGroup label="Riesgo por operación" suffix="%">
          <NumberInput
            value={riskPct}
            onChange={setRiskPct}
            min={0}
            max={100}
            step={0.25}
            accent="#7DD4C0"
          />
        </FieldGroup>

        <FieldGroup label="Stop loss" suffix="pips">
          <NumberInput
            value={stopPips}
            onChange={setStopPips}
            min={0}
            step={1}
            accent="#7DD4C0"
          />
        </FieldGroup>

        <FieldGroup label="Par / instrumento" suffix="">
          <select
            value={pair}
            onChange={(e) => handlePairChange(e.target.value as keyof typeof PAIRS)}
            className="w-full appearance-none rounded-lg border border-[#2A2A2A] bg-[#0E1117] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]"
          >
            {PAIR_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.pairs.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </FieldGroup>

        <FieldGroup
          label="Valor del pip por lote standard"
          suffix="USD"
          hint={
            fetchStatus === "loading"
              ? "Calculando con precio en vivo…"
              : fetchStatus === "success" && livePrice !== null
                ? `Auto-calculado: USD/${PAIRS[pair].quote} = ${formatNumber(livePrice, 4)}${priceDate ? ` (${priceDate})` : ""}`
                : fetchStatus === "error"
                  ? "No pudimos cargar el precio. Pip value editable manualmente."
                  : fetchStatus === "unsupported"
                    ? "Par no soportado por la fuente de precios. Cargá el pip value manualmente."
                    : PAIRS[pair].note
          }
        >
          <NumberInput
            value={pipValue}
            onChange={setPipValue}
            min={0}
            step={0.05}
            accent="#7DD4C0"
          />
        </FieldGroup>

        {/* Nota: el R:B vive en su propia calculadora (tab "Riesgo /
            beneficio"). Acá lo único que importa es cuántos lotes operar
            para arriesgar X. Mezclar ambas cosas confunde más que ayuda. */}
      </div>

      <ResultsCard accent="#7DD4C0">
        {result ? (
          <div className="space-y-5">
            <Metric
              label="Riesgo en dólares"
              value={formatMoney(result.riskUsd)}
              accent="#7DD4C0"
            />

            <div className="grid grid-cols-3 gap-3">
              <MiniMetric label="Lotes standard" value={formatNumber(result.lots, 2)} />
              <MiniMetric label="Mini lotes" value={formatNumber(result.miniLots, 2)} />
              <MiniMetric label="Micro lotes" value={formatNumber(result.microLots, 2)} />
            </div>

            <MiniMetric label="Unidades del activo" value={formatNumber(result.units, 0)} wide />
          </div>
        ) : (
          <EmptyResult message="Completá capital, riesgo, stop y valor del pip para ver el sizing." />
        )}
      </ResultsCard>
      </div>

      <CalcGuide
        accent="#7DD4C0"
        steps={[
          {
            title: "Cargá capital y % de riesgo por operación",
            body: "La regla clásica es no arriesgar más del 1-2% del capital por operación. Esto define cuántos USD podés perder si toca el stop.",
          },
          {
            title: "Definí el stop loss en pips",
            body: "Es la distancia entre tu precio de entrada y el stop, medida en pips (no en precio). Si operás EUR/USD y entrás en 1.0850 con stop en 1.0830, son 20 pips.",
          },
          {
            title: "Elegí el par a operar",
            body: "La lista está agrupada por categoría: Majors (XXX/USD), USD pairs, Cross con JPY, Otros cross, Metales y Custom. Lo más operado va arriba.",
          },
          {
            title: "El valor del pip se calcula solo",
            body: "Si el par no termina en /USD, la calc fetchea el precio en vivo (USD vs la moneda cotizada) y calcula automáticamente el valor del pip por lote standard. Igual queda editable por si tu broker tiene otro valor.",
          },
          {
            title: "Leé el sizing",
            body: "El resultado te da cuántos lotes standard, mini y micro tenés que operar para que la pérdida si toca stop sea exactamente lo que dijiste arriesgar. También las unidades totales del activo.",
          },
        ]}
      />
    </div>
  )
}

// ---------- 2. Compound Interest ----------

function CompoundInterestCalculator() {
  const [initial, setInitial] = useState("5000")
  const [monthlyContribution, setMonthlyContribution] = useState("500")
  const [monthlyRate, setMonthlyRate] = useState("1.2")
  const [months, setMonths] = useState("60")

  const result = useMemo(() => {
    const initN = Number(initial)
    const contN = Number(monthlyContribution)
    const rateN = Number(monthlyRate) / 100
    const periods = Math.floor(Number(months))

    if (!Number.isFinite(initN) || initN < 0) return null
    if (!Number.isFinite(contN) || contN < 0) return null
    if (!Number.isFinite(rateN)) return null
    if (!Number.isFinite(periods) || periods <= 0) return null

    const series: { month: number; balance: number; aportes: number }[] = []
    let balance = initN
    let aportesAcum = initN

    series.push({ month: 0, balance, aportes: aportesAcum })

    for (let m = 1; m <= periods; m++) {
      // El interés se aplica sobre el balance previo, después se suma
      // el aporte del mes. Es el orden conservador: el dinero nuevo no
      // genera rendimiento en el mismo mes que entra.
      balance = balance * (1 + rateN) + contN
      aportesAcum += contN
      series.push({ month: m, balance, aportes: aportesAcum })
    }

    const finalBalance = series[series.length - 1].balance
    const totalAportes = series[series.length - 1].aportes
    const intereses = finalBalance - totalAportes
    const annualRate = Math.pow(1 + rateN, 12) - 1

    return { series, finalBalance, totalAportes, intereses, annualRate }
  }, [initial, monthlyContribution, monthlyRate, months])

  // Densidad de ticks: cuando el plazo es largo, mostramos solo cada N meses
  // para que no se solapen las labels del eje X.
  const xTickInterval = useMemo(() => {
    if (!result) return 0
    const len = result.series.length
    if (len <= 12) return 0
    if (len <= 36) return 5
    if (len <= 72) return 11
    return 23
  }, [result])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
        <FieldGroup label="Capital inicial" suffix="USD">
          <NumberInput
            value={initial}
            onChange={setInitial}
            min={0}
            step={100}
            accent="#5BB8D4"
          />
        </FieldGroup>

        <FieldGroup label="Aporte mensual" suffix="USD">
          <NumberInput
            value={monthlyContribution}
            onChange={setMonthlyContribution}
            min={0}
            step={50}
            accent="#5BB8D4"
          />
        </FieldGroup>

        <FieldGroup
          label="Rendimiento mensual estimado"
          suffix="%"
          hint={
            result
              ? `Equivale a ${(result.annualRate * 100).toFixed(2)}% anual compuesto.`
              : "Tasa que esperás generar cada mes."
          }
        >
          <NumberInput
            value={monthlyRate}
            onChange={setMonthlyRate}
            step={0.1}
            accent="#5BB8D4"
          />
        </FieldGroup>

        <FieldGroup label="Plazo" suffix="meses">
          <NumberInput
            value={months}
            onChange={setMonths}
            min={1}
            step={1}
            accent="#5BB8D4"
          />
        </FieldGroup>

        <p className="rounded-lg border border-[#2A2A2A] bg-[#0E1117] p-3 text-[11px] leading-relaxed text-[#7E8898]">
          La proyección asume rendimiento constante y aportes regulares. El mercado real fluctúa: usá este número como
          referencia, no como promesa.
        </p>
      </div>

      <ResultsCard accent="#5BB8D4">
        {result ? (
          <div className="space-y-5">
            <Metric
              label="Balance al final del plazo"
              value={formatMoney(result.finalBalance)}
              accent="#5BB8D4"
            />

            <div className="grid grid-cols-2 gap-3">
              <MiniMetric label="Aportado en total" value={formatMoney(result.totalAportes)} />
              <MiniMetric
                label="Intereses generados"
                value={formatMoney(result.intereses)}
                accentValue="#5BB8D4"
              />
            </div>

            <div className="h-60 w-full rounded-xl border border-[#2A2A2A] bg-[#0A0D14] p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={result.series}
                  margin={{ top: 8, right: 10, left: 0, bottom: 4 }}
                >
                  <CartesianGrid stroke="#1B2330" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    interval={xTickInterval}
                    tick={{ fill: "#7E8898", fontSize: 11 }}
                    label={{ value: "Meses", position: "insideBottom", offset: -2, fill: "#7E8898", fontSize: 11 }}
                  />
                  <YAxis
                    tick={{ fill: "#7E8898", fontSize: 11 }}
                    tickFormatter={(v: number) => formatMoney(v, { compact: true })}
                    width={64}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0E1117",
                      border: "1px solid #2A2A2A",
                      borderRadius: 8,
                      color: "#E5E7EB",
                      fontSize: 12,
                    }}
                    labelFormatter={(label: number | string) => `Mes ${label}`}
                    formatter={(value: number, name: string) => [
                      formatMoney(value),
                      name === "balance" ? "Balance total" : "Aportes acumulados",
                    ]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, color: "#9AA3B5" }}
                    formatter={(value) => (value === "balance" ? "Balance total" : "Aportes acumulados")}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#5BB8D4"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#5BB8D4", stroke: "#0A0D14", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="aportes"
                    stroke="#6B7280"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <EmptyResult message="Completá capital inicial, aporte, rendimiento y plazo para ver la proyección." />
        )}
      </ResultsCard>
      </div>

      <CalcGuide
        accent="#5BB8D4"
        steps={[
          {
            title: "Cargá el capital inicial",
            body: "El monto con el que arrancás. Si todavía no invertiste nada, dejá 0 y la proyección se calcula solo a partir de los aportes.",
          },
          {
            title: "Definí el aporte mensual",
            body: "Cuánto sumás cada mes a la inversión. Si solo querés ver cómo crece el capital inicial sin aportes nuevos, dejá 0.",
          },
          {
            title: "Estimá un rendimiento mensual",
            body: "El % que esperás generar cada mes. La calc te muestra abajo a cuánto equivale en anual compuesto. Tip: 1% mensual ≈ 12,68% anual compuesto, 2% ≈ 26,82% anual.",
          },
          {
            title: "Cargá el plazo en meses",
            body: "Cuánto tiempo vas a mantener la estrategia. Para horizonte de 5 años son 60 meses; 10 años, 120; 20 años, 240.",
          },
          {
            title: "Mirá la gráfica",
            body: "La línea azul es el balance total con el interés compuesto trabajando; la línea gris punteada es solo lo que aportaste. La distancia entre ambas es lo que generó el interés — al principio es chica, después se vuelve la parte más grande del total.",
          },
        ]}
      />
    </div>
  )
}

// ---------- 3. Risk / Reward — ELIMINADA (2026-05-26) ----------
//
// La calculadora R:R se removió porque:
//   1. UX confusa incluso con la guía paso a paso — el toggle bidireccional
//      (detectar ratio / buscar target) sumaba un eje cognitivo extra
//      sobre los 5 inputs que ya tenía.
//   2. TradingView ya calcula R:R nativamente con la herramienta de
//      Long Position / Short Position en el chart. El alumno la tiene
//      ahí gratis y mejor integrada que cualquier formulario standalone.
//   3. La calc no agregaba diferencial frente al ejecutor del broker —
//      solo pre-calculaba lo que el chart después mostraba en vivo.
// Si querés recuperarla, está en git history antes de este commit.


// ---------- 4. Futuros (ES / NQ / MES / MNQ / MGC) ----------

// Tabla de instrumentos con sus tick sizes y valores. Datos reales de CME
// para futuros US listados. tickValue está en USD por tick para 1 contrato.
// ticksPerPoint refleja el tick size: ES/NQ/MES/MNQ usan 0.25 (4 ticks por
// punto), MGC usa 0.10 (10 ticks por punto). Custom queda con defaults de
// ES pero editables, para cualquier otro futuro que el alumno opere.
type FuturesInstrument = {
  symbol: string
  description: string
  tickSize: number
  tickValue: number
  ticksPerPoint: number
}

const FUTURES_INSTRUMENTS: Record<string, FuturesInstrument> = {
  ES: { symbol: "ES", description: "E-mini S&P 500", tickSize: 0.25, tickValue: 12.5, ticksPerPoint: 4 },
  NQ: { symbol: "NQ", description: "E-mini Nasdaq 100", tickSize: 0.25, tickValue: 5, ticksPerPoint: 4 },
  MES: { symbol: "MES", description: "Micro E-mini S&P 500", tickSize: 0.25, tickValue: 1.25, ticksPerPoint: 4 },
  MNQ: { symbol: "MNQ", description: "Micro E-mini Nasdaq 100", tickSize: 0.25, tickValue: 0.5, ticksPerPoint: 4 },
  MGC: { symbol: "MGC", description: "Micro Gold", tickSize: 0.1, tickValue: 1, ticksPerPoint: 10 },
  Custom: { symbol: "Custom", description: "Personalizado", tickSize: 0.25, tickValue: 12.5, ticksPerPoint: 4 },
}

type StopUnit = "points" | "ticks"
type TargetMode = "by-target" | "by-ratio"
type RiskLevel = "ok" | "caution" | "alert" | "danger"

// Semáforo de riesgo en 4 niveles: verde → amarillo → naranja → rojo.
// Coherente con el imaginario operativo del trader (verde = sano, rojo =
// peligro), no con la paleta de marca terracota que confundía al usuario.
//
// Thresholds calibrados con criterio de Franco (2026-05-26):
//   - PROP FIRM (basado en drawdown máximo):
//     ≤2%   ok       — riesgo sostenible
//     2-5%  caution  — aceptable pero pedís más al día
//     5-10% alert    — exigente, pocas operaciones tolera
//     >10%  danger   — sobre el límite recomendado por op
//   - CUENTA PROPIA (basado en capital total):
//     ≤1%   ok       — conservador clásico
//     1-2%  caution  — dentro del 2% por op clásico
//     2-5%  alert    — por encima del 2%, exposición elevada
//     >5%   danger   — puede comer la cuenta rápido
function getRiskLevel(pct: number, isPropFirm: boolean): RiskLevel {
  if (isPropFirm) {
    if (pct > 10) return "danger"
    if (pct > 5) return "alert"
    if (pct > 2) return "caution"
    return "ok"
  }
  if (pct > 5) return "danger"
  if (pct > 2) return "alert"
  if (pct > 1) return "caution"
  return "ok"
}

const RISK_LEVEL_STYLES: Record<RiskLevel, { border: string; bg: string; text: string }> = {
  ok: { border: "rgba(125, 212, 192, 0.35)", bg: "#0F1F1A", text: "#7DD4C0" },
  caution: { border: "rgba(212, 184, 106, 0.4)", bg: "#1F1A0E", text: "#D4B86A" },
  alert: { border: "rgba(212, 144, 90, 0.4)", bg: "#1F140D", text: "#D4905A" },
  danger: { border: "rgba(242, 179, 179, 0.4)", bg: "#2A1111", text: "#F2B3B3" },
}

// Copy del card de riesgo según nivel y modo. Centralizado acá para no
// ensuciar el JSX con un ternario gigante. La idea es explicar el "qué
// significa este número" sin presuponer que el usuario sabe la regla del
// 2% o el límite del 10% en prop firms.
function getRiskCopy(level: RiskLevel, isPropFirm: boolean): string {
  if (isPropFirm) {
    switch (level) {
      case "ok":
        return "Riesgo conservador, sostenible para la cuenta."
      case "caution":
        return "Aceptable, pero cuidá no sumar varias operaciones del mismo tamaño en un día."
      case "alert":
        return "Exigente. Con dos pérdidas seguidas estás en zona crítica del drawdown."
      case "danger":
        return "Por encima del 10% por operación recomendado en prop firms. Una sola pérdida importante puede tirar la cuenta."
    }
  }
  switch (level) {
    case "ok":
      return "Conservador. Bien dentro de la regla del 1-2% por operación que recomiendan los traders profesionales."
    case "caution":
      return "Dentro del 2% por operación clásico — el techo que recomienda la mayoría de los traders profesionales."
    case "alert":
      return "Por encima del 2% por operación. Operación con exposición elevada."
    case "danger":
      return "Riesgo muy alto. Más del 5% por operación puede comerse la cuenta con pocas pérdidas seguidas."
  }
}

function FuturesCalculator() {
  const [instrument, setInstrument] = useState<keyof typeof FUTURES_INSTRUMENTS>("ES")
  const [customTickValue, setCustomTickValue] = useState("12.5")
  const [contracts, setContracts] = useState("1")
  const [stopAmount, setStopAmount] = useState("20")
  const [stopUnit, setStopUnit] = useState<StopUnit>("points")
  const [hasTarget, setHasTarget] = useState(true)
  const [targetMode, setTargetMode] = useState<TargetMode>("by-target")
  const [targetAmount, setTargetAmount] = useState("40")
  const [targetUnit, setTargetUnit] = useState<StopUnit>("points")
  const [targetRatio, setTargetRatio] = useState("2")
  const [capital, setCapital] = useState("50000")
  const [isPropFirm, setIsPropFirm] = useState(false)
  const [drawdown, setDrawdown] = useState("2000")

  const instrumentMeta = FUTURES_INSTRUMENTS[instrument]
  const tickValueResolved = instrument === "Custom" ? Number(customTickValue) : instrumentMeta.tickValue

  const result = useMemo(() => {
    const contractsN = Number(contracts)
    const stopAmountN = Number(stopAmount)
    const capitalN = Number(capital)
    const drawdownN = Number(drawdown)
    const targetAmountN = Number(targetAmount)
    const targetRatioN = Number(targetRatio)

    if (!Number.isFinite(contractsN) || contractsN <= 0) return null
    if (!Number.isFinite(stopAmountN) || stopAmountN <= 0) return null
    if (!Number.isFinite(tickValueResolved) || tickValueResolved <= 0) return null
    if (!Number.isFinite(capitalN) || capitalN <= 0) return null
    if (isPropFirm && (!Number.isFinite(drawdownN) || drawdownN <= 0)) return null

    const stopTicks = stopUnit === "ticks" ? stopAmountN : stopAmountN * instrumentMeta.ticksPerPoint
    const stopPoints = stopTicks / instrumentMeta.ticksPerPoint
    const stopLossUsd = contractsN * stopTicks * tickValueResolved

    let targetTicks: number | null = null
    let targetPoints: number | null = null
    let potentialGainUsd: number | null = null
    let ratio: number | null = null

    if (hasTarget) {
      if (targetMode === "by-target") {
        // El usuario cargó target en puntos/ticks → ratio se deduce.
        if (Number.isFinite(targetAmountN) && targetAmountN > 0) {
          targetTicks = targetUnit === "ticks" ? targetAmountN : targetAmountN * instrumentMeta.ticksPerPoint
          targetPoints = targetTicks / instrumentMeta.ticksPerPoint
          potentialGainUsd = contractsN * targetTicks * tickValueResolved
          ratio = potentialGainUsd / stopLossUsd
        }
      } else {
        // El usuario cargó ratio objetivo → target en ticks se deduce.
        // Como ganancia = ratio × pérdida, y ganancia = contratos × targetTicks
        // × tickValue, entonces targetTicks = stopTicks × ratio.
        if (Number.isFinite(targetRatioN) && targetRatioN > 0) {
          targetTicks = stopTicks * targetRatioN
          targetPoints = targetTicks / instrumentMeta.ticksPerPoint
          potentialGainUsd = stopLossUsd * targetRatioN
          ratio = targetRatioN
        }
      }
    }

    const referenceCapital = isPropFirm ? drawdownN : capitalN
    const riskPctOfReference =
      referenceCapital > 0 ? (stopLossUsd / referenceCapital) * 100 : null

    return {
      stopLossUsd,
      stopTicks,
      stopPoints,
      targetTicks,
      targetPoints,
      potentialGainUsd,
      ratio,
      riskPctOfReference,
      referenceLabel: isPropFirm ? "del drawdown" : "del capital",
    }
  }, [
    contracts,
    stopAmount,
    stopUnit,
    tickValueResolved,
    instrumentMeta.ticksPerPoint,
    hasTarget,
    targetMode,
    targetAmount,
    targetUnit,
    targetRatio,
    capital,
    drawdown,
    isPropFirm,
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2.5 rounded-lg border border-[#D9A441]/25 bg-[#D9A441]/[0.06] px-3.5 py-2.5">
        <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#D9A441]/50 text-[9px] font-bold text-[#D9A441]">!</span>
        <p className="text-[12px] leading-relaxed text-[#C9B486]">
          <span className="font-semibold uppercase tracking-wide text-[#D9A441]">Beta</span> · Usala como guía y verificá los números antes de operar con dinero real.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        <div className="space-y-4">
        <FieldGroup label="Instrumento" suffix="" hint={`${instrumentMeta.description}. Tick = ${instrumentMeta.tickSize} pts, $${instrumentMeta.tickValue}/tick, ${instrumentMeta.ticksPerPoint} ticks por punto.`}>
          <select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value as keyof typeof FUTURES_INSTRUMENTS)}
            className="w-full appearance-none rounded-lg border border-[#2A2A2A] bg-[#0E1117] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#C97A4D]"
          >
            {Object.keys(FUTURES_INSTRUMENTS).map((sym) => (
              <option key={sym} value={sym}>
                {sym === "Custom" ? "Custom (personalizado)" : `${sym} — ${FUTURES_INSTRUMENTS[sym].description}`}
              </option>
            ))}
          </select>
        </FieldGroup>

        {instrument === "Custom" && (
          <FieldGroup label="Valor por tick" suffix="USD" hint="Ingresá el valor por tick por contrato del instrumento que operás.">
            <NumberInput value={customTickValue} onChange={setCustomTickValue} min={0} step={0.05} accent="#C97A4D" />
          </FieldGroup>
        )}

        <FieldGroup label="Contratos" suffix="">
          <NumberInput value={contracts} onChange={setContracts} min={0} step={1} accent="#C97A4D" />
        </FieldGroup>

        <FieldGroup label="Stop loss" suffix={stopUnit === "points" ? "PUNTOS" : "TICKS"}>
          <div className="flex gap-2">
            <NumberInput value={stopAmount} onChange={setStopAmount} min={0} step={0.25} accent="#C97A4D" />
            <UnitToggle value={stopUnit} onChange={setStopUnit} accent="#C97A4D" />
          </div>
        </FieldGroup>

        <FieldGroup label="¿Querés calcular target?" suffix="">
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { value: true, label: "Con target" },
                { value: false, label: "Sin target" },
              ] as const
            ).map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setHasTarget(opt.value)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors sm:text-sm ${
                  hasTarget === opt.value
                    ? "border-[#C97A4D] bg-[#1F140D] text-[#C97A4D]"
                    : "border-[#2A2A2A] bg-[#0E1117] text-[#9AA3B5] hover:border-[#C97A4D]/40 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FieldGroup>

        {hasTarget && (
          <>
            <FieldGroup label="¿Cómo definís el target?" suffix="">
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: "by-target" as TargetMode, label: "Por puntos/ticks" },
                    { id: "by-ratio" as TargetMode, label: "Por ratio" },
                  ]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTargetMode(opt.id)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors ${
                      targetMode === opt.id
                        ? "border-[#C97A4D] bg-[#1F140D] text-[#C97A4D]"
                        : "border-[#2A2A2A] bg-[#0E1117] text-[#9AA3B5] hover:border-[#C97A4D]/40 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </FieldGroup>

            {targetMode === "by-target" ? (
              <FieldGroup label="Take profit" suffix={targetUnit === "points" ? "PUNTOS" : "TICKS"}>
                <div className="flex gap-2">
                  <NumberInput value={targetAmount} onChange={setTargetAmount} min={0} step={0.25} accent="#C97A4D" />
                  <UnitToggle value={targetUnit} onChange={setTargetUnit} accent="#C97A4D" />
                </div>
              </FieldGroup>
            ) : (
              <FieldGroup
                label="Ratio objetivo"
                suffix=":1"
                hint="Múltiplo del riesgo. Ej 2 = ganar el doble de lo que arriesgás. La calc resuelve los puntos/ticks del target sola."
              >
                <NumberInput value={targetRatio} onChange={setTargetRatio} min={0} step={0.5} accent="#C97A4D" />
              </FieldGroup>
            )}
          </>
        )}

        <FieldGroup label="Capital de la cuenta" suffix="USD">
          <NumberInput value={capital} onChange={setCapital} min={0} step={100} accent="#C97A4D" />
        </FieldGroup>

        <FieldGroup
          label="¿Cuenta de prop firm?"
          suffix=""
          hint={
            isPropFirm
              ? "El % de riesgo se calcula sobre el drawdown máximo (lo que realmente podés perder antes de que te bajen la cuenta), no sobre el balance total."
              : "Activalo si operás cuenta FTMO, Apex, TopStep u otra prop firm."
          }
        >
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { value: false, label: "No" },
                { value: true, label: "Sí, prop firm" },
              ] as const
            ).map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setIsPropFirm(opt.value)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors sm:text-sm ${
                  isPropFirm === opt.value
                    ? "border-[#C97A4D] bg-[#1F140D] text-[#C97A4D]"
                    : "border-[#2A2A2A] bg-[#0E1117] text-[#9AA3B5] hover:border-[#C97A4D]/40 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FieldGroup>

        {isPropFirm && (
          <FieldGroup label="Drawdown máximo" suffix="USD">
            <NumberInput value={drawdown} onChange={setDrawdown} min={0} step={50} accent="#C97A4D" />
          </FieldGroup>
        )}
      </div>

      <ResultsCard accent="#C97A4D">
        {result ? (
          <div className="space-y-5">
            <Metric
              label="Pérdida potencial si toca stop"
              value={formatMoney(result.stopLossUsd)}
              accent="#C97A4D"
            />

            {result.riskPctOfReference !== null && (() => {
              const level = getRiskLevel(result.riskPctOfReference, isPropFirm)
              const styles = RISK_LEVEL_STYLES[level]
              const pctFmt = formatNumber(result.riskPctOfReference, 1)
              const copy = getRiskCopy(level, isPropFirm)
              return (
                <div
                  className="rounded-xl border p-4"
                  style={{ borderColor: styles.border, background: styles.bg }}
                >
                  <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: styles.text }}>
                    Riesgo {result.referenceLabel}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{pctFmt}%</p>
                  <p className="mt-1 text-xs text-[#7E8898]">{copy}</p>
                </div>
              )
            })()}

            <div className="grid grid-cols-2 gap-3">
              <MiniMetric label="Stop en puntos" value={formatNumber(result.stopPoints, 2)} />
              <MiniMetric label="Stop en ticks" value={formatNumber(result.stopTicks, 0)} />
            </div>

            {result.potentialGainUsd !== null && result.ratio !== null && (
              <>
                {/* Ganancia + Ratio en paridad visual: dos cards lado a lado,
                    uno verde teal (positivo = ganar) y otro dorado (gestión =
                    ratio). El ratio se muestra grande, no como subtexto. */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#7DD4C0]/30 bg-[#0F1F1A] p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#7DD4C0]">Ganancia potencial</p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {formatMoney(result.potentialGainUsd)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#D4B86A]/30 bg-[#1A1609] p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#D4B86A]">Ratio R:R</p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {formatNumber(result.ratio, 2)} : 1
                    </p>
                    <p className="mt-1 text-[11px] text-[#7E8898]">
                      Win rate mínimo: {((1 / (1 + result.ratio)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {result.targetPoints !== null && result.targetTicks !== null && (
                  <div className="grid grid-cols-2 gap-3">
                    <MiniMetric label="Target en puntos" value={formatNumber(result.targetPoints, 2)} />
                    <MiniMetric label="Target en ticks" value={formatNumber(result.targetTicks, 0)} />
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <EmptyResult message="Completá instrumento, contratos, stop y capital para ver el sizing." />
        )}
      </ResultsCard>
      </div>

      <CalcGuide
        accent="#C97A4D"
        steps={[
          {
            title: "Elegí el instrumento",
            body: "ES, NQ, MES, MNQ o MGC. La calculadora carga sola el valor del tick correspondiente. Si operás otro futuro, elegí Custom y cargá vos el valor del tick.",
          },
          {
            title: "Cargá cantidad de contratos y stop loss",
            body: "Stop en puntos o ticks (el toggle al lado convierte de uno al otro). La calc te muestra cuántos dólares perdés si toca stop.",
          },
          {
            title: "Decidí si querés target (opcional)",
            body: "Con target podés definirlo de dos formas: cargás puntos/ticks exactos y te calcula el ratio, o cargás el ratio que querés (ej 2:1) y te calcula los puntos/ticks del take profit.",
          },
          {
            title: "Cargá capital y activá prop firm si corresponde",
            body: "Si operás cuenta de FTMO, Apex, TopStep u otra prop firm, activá el toggle. El cálculo del % de riesgo pasa a hacerse sobre el drawdown máximo (lo que realmente podés perder antes de que te tiren la cuenta), no sobre el balance total.",
          },
          {
            title: "Leé el card de riesgo",
            body: "Funciona como semáforo en 4 niveles: verde (conservador), amarillo (aceptable), naranja (alerta), rojo (peligro). En cuenta propia el techo recomendado es 2% del capital por operación; en prop firms, 10% del drawdown máximo.",
          },
        ]}
      />
    </div>
  )
}

// ---------- UI helpers ----------

function FieldGroup({
  label,
  suffix,
  hint,
  children,
}: {
  label: string
  suffix: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      {/* Sufijo INLINE con el label, separado por · y en el mismo tono que
          el label. Antes vivía a la derecha del input en color débil y se
          perdía visualmente. Acá se lee como una unidad con el label. */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#9AA3B5]">{label}</span>
        {suffix && (
          <>
            <span className="text-[10px] text-[#4A5263]" aria-hidden="true">·</span>
            <span className="text-[11px] uppercase tracking-[0.16em] text-[#7E8898]">{suffix}</span>
          </>
        )}
      </div>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1.5 text-[11px] leading-snug text-[#7E8898]">{hint}</p>}
    </label>
  )
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  accent,
}: {
  value: string
  onChange: (v: string) => void
  min?: number
  max?: number
  step?: number
  accent: string
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      step={step}
      inputMode="decimal"
      className="w-full rounded-lg border border-[#2A2A2A] bg-[#0E1117] px-3 py-2 text-sm text-white outline-none transition-colors focus:bg-[#10141C]"
      style={{ caretColor: accent }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = accent
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "#2A2A2A"
      }}
    />
  )
}

// Toggle compacto puntos / ticks para la calc de futuros. Reusable en
// stop y target. Se renderiza al lado del NumberInput como un segmented
// control con dos opciones cortas.
function UnitToggle({
  value,
  onChange,
  accent,
}: {
  value: "points" | "ticks"
  onChange: (v: "points" | "ticks") => void
  accent: string
}) {
  const options: Array<{ id: "points" | "ticks"; label: string }> = [
    { id: "points", label: "Pts" },
    { id: "ticks", label: "Ticks" },
  ]
  return (
    <div className="flex shrink-0 overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#0E1117]">
      {options.map((opt) => {
        const isActive = value === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className="px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors"
            style={{
              background: isActive ? `${accent}1F` : "transparent",
              color: isActive ? accent : "#7E8898",
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function ResultsCard({
  accent,
  children,
}: {
  accent: string
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl border border-[#2A2A2A] bg-[linear-gradient(180deg,#0F1117_0%,#0B0D14_100%)] p-5 sm:p-6"
      style={{ boxShadow: `inset 0 1px 0 ${accent}1A` }}
    >
      <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: accent }}>
        Resultado
      </p>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function Metric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: accent }}>
        {label}
      </p>
      <p className="mt-1.5 text-4xl font-semibold text-white sm:text-5xl">{value}</p>
    </div>
  )
}

function MiniMetric({
  label,
  value,
  wide,
  accentValue,
}: {
  label: string
  value: string
  wide?: boolean
  accentValue?: string
}) {
  return (
    <div
      className={`rounded-xl border border-[#2A2A2A] bg-[#0E1117] p-3 ${wide ? "col-span-3" : ""}`}
    >
      <p className="text-[10px] uppercase tracking-[0.14em] text-[#7E8898]">{label}</p>
      <p className="mt-1 text-base font-semibold text-white sm:text-lg" style={accentValue ? { color: accentValue } : undefined}>
        {value}
      </p>
    </div>
  )
}

function EmptyResult({ message, accent = "#7E8898" }: { message: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#2A2A2A] bg-[#0A0D14] p-6 text-center">
      <p className="text-sm" style={{ color: accent }}>
        {message}
      </p>
    </div>
  )
}

// Guía paso a paso al pie de las calculadoras más densas (Futuros, R:R).
// Para las simples (forex, interés compuesto) no se usa — el primer
// vistazo a los inputs alcanza para entender qué hacer. Cuando el usuario
// se pierde con 3 toggles y 6 inputs, esta guía corta lo orienta sin
// abrir documentación aparte.
type GuideStep = { title: string; body: string }

function CalcGuide({
  steps,
  accent,
  title = "Cómo usar esta calculadora",
}: {
  steps: GuideStep[]
  accent: string
  title?: string
}) {
  return (
    <div className="rounded-2xl border border-[#1F2330] bg-[#0A0D14] p-5 sm:p-6">
      <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: accent }}>
        {title}
      </p>
      <ol className="mt-4 space-y-3">
        {steps.map((step, idx) => (
          <li key={idx} className="flex gap-3 sm:gap-4">
            <span
              className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] pt-0.5"
              style={{ color: accent }}
            >
              {(idx + 1).toString().padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-medium text-white">{step.title}</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-[#9AA3B5]">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ---------- Container ----------

export function ToolsCalculator() {
  const [activeTab, setActiveTab] = useState<ToolTab>("position")
  const activeMeta = TABS.find((t) => t.id === activeTab)!

  return (
    <div className="rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(170deg,#0F1117_0%,#0B0D14_100%)] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: activeMeta.color }}>
            Calculadoras Flowdex
          </p>
          <h2 className="mt-2 type-display-sm text-white">{activeMeta.label}</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#9AA3B5]">{activeMeta.description}</p>
        </div>
        <span
          className="mt-1 rounded-full border bg-black/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]"
          style={{ borderColor: `${activeMeta.color}40`, color: activeMeta.color }}
        >
          {activeMeta.badge}
        </span>
      </div>

      <div
        className="mt-5 mb-6 h-px w-full"
        style={{ background: `linear-gradient(to right, ${activeMeta.color}40, #2A2A2A 60%, transparent)` }}
      />

      <div role="tablist" className="mb-6 grid gap-2 grid-cols-1 sm:grid-cols-3">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className="rounded-xl border px-4 py-3 text-left transition-all"
              style={{
                borderColor: isActive ? `${tab.color}60` : "#2A2A2A",
                background: isActive
                  ? `linear-gradient(135deg, ${tab.color}1A 0%, #0E1117 100%)`
                  : "#0E1117",
              }}
            >
              <div className="flex items-center gap-1.5">
                <p
                  className="text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: isActive ? tab.color : "#7E8898" }}
                >
                  {tab.badge}
                </p>
                {tab.beta && (
                  <span className="rounded-full border border-[#D9A441]/40 bg-[#D9A441]/10 px-1.5 py-px text-[8px] font-semibold uppercase tracking-[0.16em] text-[#D9A441]">
                    Beta
                  </span>
                )}
              </div>
              <p className={`mt-1 text-sm font-medium ${isActive ? "text-white" : "text-[#9AA3B5]"}`}>
                {tab.label}
              </p>
            </button>
          )
        })}
      </div>

      {activeTab === "position" && <PositionSizeCalculator />}
      {activeTab === "compound" && <CompoundInterestCalculator />}
      {activeTab === "futures" && <FuturesCalculator />}
    </div>
  )
}
