"use client"

// ===================================================================
// FLOWDEX · Terminal experimental (cliente)
// Página oculta /lab/terminal — datos de mercado argentinos en vivo.
// Estética alineada al sistema de marca (triada de colores, DM Sans /
// Space Mono, tarjetas oscuras con glow). Sin dependencias externas
// embebidas: todo se dibuja nativo con recharts.
// ===================================================================

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  fetchByma,
  fetchCripto,
  fetchDolarCripto,
  fetchDolares,
  fetchFCI,
  fetchInflacion,
  fetchPlazoFijo,
  fetchRiesgoHistorico,
  fmt,
  fmtBig,
  inflacionInteranual,
  signColor,
  type BymaPath,
  type Instrumento,
  type PlazoFijo,
} from "@/lib/terminal"
import type { AssetType } from "@/lib/terminal-store"
import { StarButton } from "./terminal/StarButton"
import { WatchlistModule } from "./terminal/WatchlistModule"
import { CalculadorasModule } from "./terminal/CalculadorasModule"
import { AlertasModule } from "./terminal/AlertasModule"
import { AlertEngine } from "./terminal/AlertEngine"

// Triada de marca
const AZUL = "#5BB8D4" // inversión
const TEAL = "#7DD4C0" // trading
const ORO = "#D4B86A" // inner circle
const DOWN = "#ef6a6a"

type TabId =
  | "watchlist"
  | "dolares"
  | "macro"
  | "acciones"
  | "cedears"
  | "bonos"
  | "cripto"
  | "tasas"
  | "calculadoras"
  | "alertas"

const TABS: { id: TabId; label: string; accent: string }[] = [
  { id: "watchlist", label: "★ Watchlist", accent: ORO },
  { id: "dolares", label: "Dólares", accent: TEAL },
  { id: "macro", label: "Macro", accent: AZUL },
  { id: "acciones", label: "Acciones", accent: AZUL },
  { id: "cedears", label: "CEDEARs", accent: TEAL },
  { id: "bonos", label: "Bonos", accent: AZUL },
  { id: "cripto", label: "Cripto", accent: ORO },
  { id: "tasas", label: "Tasas / FCI", accent: TEAL },
  { id: "calculadoras", label: "Calculadoras", accent: AZUL },
  { id: "alertas", label: "Alertas", accent: ORO },
]

// ---------- UI helpers ----------

function Eyebrow({ accent, children }: { accent: string; children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
      />
      <span
        className="type-eyebrow uppercase"
        style={{ color: accent, letterSpacing: "0.22em" }}
      >
        {children}
      </span>
    </div>
  )
}

function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(170deg,#0F1117_0%,#0B0D14_100%)] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:p-6 ${className}`}
    >
      {children}
    </div>
  )
}

function Pct({ value }: { value: number | null | undefined }) {
  const c = signColor(value)
  const arrow =
    value == null || Number.isNaN(value) ? "" : value > 0 ? "▲" : value < 0 ? "▼" : "■"
  return (
    <span className="font-mono font-medium" style={{ color: c }}>
      {arrow} {value == null ? "—" : `${fmt(Math.abs(value), 2)}%`}
    </span>
  )
}

function Loading({ accent = AZUL }: { accent?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-14 text-sm text-[#7E8898]">
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-[#2A2A2A]"
        style={{ borderTopColor: accent }}
      />
      Cargando datos…
    </div>
  )
}

function ErrorBox({ msg, onRetry }: { msg: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-[#D4B86A]/25 bg-[#1A1408]/40 p-4 text-sm text-[#D4B86A]">
      {msg}{" "}
      {onRetry && (
        <button onClick={onRetry} className="underline underline-offset-2">
          Reintentar
        </button>
      )}
    </div>
  )
}

// ---------- Hook de carga genérico ----------

function useFeed<T>(fetcher: (signal?: AbortSignal) => Promise<T>, enabled: boolean) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // `fetcher` debe ser estable (función de módulo o envuelta en useCallback).
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const d = await fetcher()
      setData(d)
    } catch (e) {
      setError(e instanceof Error ? e.message : "error")
    } finally {
      setLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    if (enabled) void load()
  }, [enabled, load])

  return { data, error, loading, reload: load }
}

// ===================================================================
// Módulo: DÓLARES
// ===================================================================

const DOLAR_EMOJI: Record<string, string> = {
  oficial: "🏛️",
  blue: "💵",
  bolsa: "📊",
  contadoconliqui: "🌎",
  mayorista: "🏦",
  cripto: "₿",
  tarjeta: "💳",
}

function DolaresModule({ active }: { active: boolean }) {
  const { data, error, loading, reload } = useFeed(fetchDolares, active)

  // refresco cada 60s
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => void reload(), 60_000)
    return () => clearInterval(t)
  }, [active, reload])

  if (loading && !data) return <Loading accent={TEAL} />
  if (error && !data) return <ErrorBox msg={`No se pudieron cargar las cotizaciones.`} onRetry={reload} />
  if (!data) return null

  const oficial = data.find((d) => d.casa === "oficial")
  const ofVenta = oficial?.venta ?? null

  const brechas = data
    .filter((d) => d.casa !== "oficial" && d.casa !== "mayorista")
    .map((d) => ({
      nombre: d.nombre,
      brecha: ofVenta ? +(((d.venta / ofVenta) - 1) * 100).toFixed(1) : 0,
    }))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((d) => {
          const brecha =
            ofVenta && d.casa !== "oficial" ? ((d.venta / ofVenta) - 1) * 100 : null
          return (
            <div
              key={d.casa}
              className="relative overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[linear-gradient(160deg,#141821_0%,#0C101A_100%)] p-4 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-[#98A1B5]">
                <span>{DOLAR_EMOJI[d.casa] ?? "💱"}</span>
                {d.nombre}
                <span className="ml-auto">
                  <StarButton item={{ id: `dolar:${d.casa}`, type: "dolar", symbol: d.casa, label: `Dólar ${d.nombre}` }} />
                </span>
              </div>
              <div className="mt-2 font-mono text-3xl font-bold text-white">
                ${fmt(d.venta, 0)}
                <span className="ml-1 text-sm font-normal text-[#7E8898]">/venta</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-[#2A2A2A] pt-3 font-mono text-[11px] text-[#98A1B5]">
                <span>
                  Compra <b className="text-white">${fmt(d.compra, 0)}</b>
                </span>
                <span>
                  Venta <b className="text-white">${fmt(d.venta, 0)}</b>
                </span>
              </div>
              {brecha != null ? (
                <div
                  className="mt-2 inline-block rounded-md px-2 py-0.5 font-mono text-[11px] font-medium"
                  style={{ color: brecha > 0 ? DOWN : TEAL, background: `${brecha > 0 ? DOWN : TEAL}1A` }}
                >
                  {brecha > 0 ? "▲" : "▼"} {fmt(Math.abs(brecha), 1)}% {brecha > 0 ? "más caro" : "más barato"}
                </div>
              ) : (
                <div
                  className="mt-2 inline-block rounded-md px-2 py-0.5 font-mono text-[11px] font-medium"
                  style={{ color: "#98A1B5", background: "#ffffff10" }}
                >
                  Referencia · brecha 0%
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Card>
        <Eyebrow accent={TEAL}>Brechas vs oficial</Eyebrow>
        <p className="mt-2 text-[11px] text-[#98A1B5]">
          Cuánto más caro o barato está cada dólar respecto al oficial.{" "}
          <span style={{ color: TEAL }}>Verde = más barato</span> ·{" "}
          <span style={{ color: DOWN }}>Rojo = más caro</span>.
        </p>
        <div className="mt-4 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={brechas} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="nombre" tick={{ fill: "#7E8898", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#7E8898", fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
              <Tooltip
                cursor={{ fill: "#ffffff08" }}
                contentStyle={{ background: "#0B0D14", border: "1px solid #2A2A2A", borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: "#fff", fontWeight: 600 }}
                itemStyle={{ color: "#fff" }}
                formatter={(v: number) => [
                  `${v > 0 ? "+" : ""}${v}% ${v > 0 ? "más caro" : v < 0 ? "más barato" : ""}`,
                  "Brecha vs oficial",
                ]}
              />
              <Bar dataKey="brecha" radius={[6, 6, 0, 0]}>
                {brechas.map((b, i) => (
                  <Cell key={i} fill={b.brecha > 0 ? DOWN : TEAL} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

// ===================================================================
// Módulo: MACRO
// ===================================================================

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[linear-gradient(160deg,#141821_0%,#0C101A_100%)] p-4">
      <div className="text-[11px] font-medium uppercase tracking-wide text-[#98A1B5]">{label}</div>
      <div className="mt-2 font-mono text-2xl font-bold text-white">{value}</div>
      {sub && <div className="mt-1 font-mono text-[11px] text-[#7E8898]">{sub}</div>}
    </div>
  )
}

function MacroModule({ active }: { active: boolean }) {
  const riesgo = useFeed(fetchRiesgoHistorico, active)
  const infl = useFeed(fetchInflacion, active)
  const dolares = useFeed(fetchDolares, active)

  if ((riesgo.loading || infl.loading) && !riesgo.data) return <Loading accent={AZUL} />

  const rpHist = riesgo.data ?? []
  const rpLast = rpHist[rpHist.length - 1]
  const inflSerie = infl.data ?? []
  const inflLast = inflSerie[inflSerie.length - 1]
  const interanual = inflSerie.length ? inflacionInteranual(inflSerie) : null

  const d = dolares.data ?? []
  const of = d.find((x) => x.casa === "oficial")?.venta
  const blue = d.find((x) => x.casa === "blue")?.venta
  const ccl = d.find((x) => x.casa === "contadoconliqui")?.venta

  const rpChart = rpHist.slice(-180)
  const inflChart = inflSerie.slice(-24)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {rpLast && <Stat label="Riesgo País" value={`${fmt(rpLast.valor, 0)} pb`} sub={rpLast.fecha} />}
        {inflLast && <Stat label="Inflación mensual" value={`${fmt(inflLast.valor, 1)}%`} sub={inflLast.fecha} />}
        {interanual != null && <Stat label="Inflación interanual" value={`${fmt(interanual, 1)}%`} sub="acum. 12 meses" />}
        {of && blue && <Stat label="Brecha Blue" value={`${fmt((blue / of - 1) * 100, 1)}%`} sub="vs oficial" />}
        {of && ccl && <Stat label="Brecha CCL" value={`${fmt((ccl / of - 1) * 100, 1)}%`} sub="vs oficial" />}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <Eyebrow accent={DOWN}>Riesgo país · histórico</Eyebrow>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rpChart} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="fecha" tick={{ fill: "#7E8898", fontSize: 9 }} tickLine={false} axisLine={false} minTickGap={40} />
                <YAxis tick={{ fill: "#7E8898", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0B0D14", border: "1px solid #2A2A2A", borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="valor" stroke={DOWN} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <Eyebrow accent={ORO}>Inflación mensual (IPC) · 24m</Eyebrow>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inflChart} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="fecha" tick={{ fill: "#7E8898", fontSize: 9 }} tickLine={false} axisLine={false} minTickGap={30} />
                <YAxis tick={{ fill: "#7E8898", fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
                <Tooltip cursor={{ fill: "#ffffff08" }} contentStyle={{ background: "#0B0D14", border: "1px solid #2A2A2A", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v}%`, "IPC"]} />
                <Bar dataKey="valor" fill={ORO} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ===================================================================
// Módulo: MERCADO (acciones / cedears / bonos) — tabla reutilizable
// ===================================================================

type SortKey = keyof Pick<Instrumento, "symbol" | "c" | "pct_change" | "px_bid" | "px_ask" | "v">

function MarketModule({
  path,
  accent,
  active,
  wType,
}: {
  path: BymaPath
  accent: string
  active: boolean
  wType: AssetType
}) {
  const fetcher = useCallback((s?: AbortSignal) => fetchByma(path, s), [path])
  const { data, error, loading, reload } = useFeed(fetcher, active)
  const [q, setQ] = useState("")
  const [sort, setSort] = useState<{ k: SortKey; dir: 1 | -1 }>({ k: "pct_change", dir: -1 })

  useEffect(() => {
    if (!active) return
    const t = setInterval(() => void reload(), 90_000)
    return () => clearInterval(t)
  }, [active, reload])

  const rows = useMemo(() => {
    let r = (data ?? []).filter((x) => x.c > 0)
    const query = q.toUpperCase()
    if (query) r = r.filter((x) => x.symbol.includes(query))
    r = [...r].sort((a, b) => {
      const x = a[sort.k]
      const y = b[sort.k]
      if (typeof x === "string" && typeof y === "string") return sort.dir * x.localeCompare(y)
      return sort.dir * ((Number(x) || 0) - (Number(y) || 0))
    })
    return r
  }, [data, q, sort])

  if (loading && !data) return <Loading accent={accent} />
  if (error && !data)
    return (
      <Card>
        <ErrorBox msg="No se pudo cargar el panel BYMA." onRetry={reload} />
      </Card>
    )

  const cols: { k: SortKey; label: string }[] = [
    { k: "symbol", label: "Ticker" },
    { k: "c", label: "Último" },
    { k: "pct_change", label: "Var % día" },
    { k: "px_bid", label: "Compra" },
    { k: "px_ask", label: "Venta" },
    { k: "v", label: "Volumen" },
  ]

  const toggleSort = (k: SortKey) =>
    setSort((s) => (s.k === k ? { k, dir: (s.dir * -1) as 1 | -1 } : { k, dir: -1 }))

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Eyebrow accent={accent}>Panel BYMA · {rows.length} instrumentos</Eyebrow>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar ticker…"
          className="w-full max-w-[240px] rounded-lg border border-[#2A2A2A] bg-[#0A0D14] px-3 py-2 font-mono text-sm text-white outline-none placeholder:text-[#5A6678] focus:border-[#5BB8D4]/60"
        />
      </div>
      <p className="mb-3 text-[11px] text-[#5A6678]">
        Variación del día (vs. cierre anterior). Volumen en nominales operados.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[12.5px]">
          <thead>
            <tr>
              {cols.map((c, i) => (
                <th
                  key={c.k}
                  onClick={() => toggleSort(c.k)}
                  className={`cursor-pointer select-none whitespace-nowrap border-b border-[#2A2A2A] px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wide text-[#7E8898] hover:text-white ${i === 0 ? "text-left" : "text-right"}`}
                >
                  {c.label} {sort.k === c.k ? (sort.dir < 0 ? "▼" : "▲") : "⇅"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.symbol} className="border-b border-[#ffffff08] hover:bg-[#5BB8D4]/5">
                <td className="px-3 py-2.5 text-left">
                  <span className="inline-flex items-center gap-2">
                    <StarButton item={{ id: `${wType}:${r.symbol}`, type: wType, symbol: r.symbol, label: r.symbol }} />
                    <span
                      className="rounded-md px-2 py-1 text-[10px] font-bold"
                      style={{ background: `${accent}1F`, color: accent }}
                    >
                      {r.symbol}
                    </span>
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right text-white">${fmt(r.c, 2)}</td>
                <td className="px-3 py-2.5 text-right">
                  <Pct value={r.pct_change} />
                </td>
                <td className="px-3 py-2.5 text-right text-[#98A1B5]">${fmt(r.px_bid, 2)}</td>
                <td className="px-3 py-2.5 text-right text-[#98A1B5]">${fmt(r.px_ask, 2)}</td>
                <td className="px-3 py-2.5 text-right text-[#7E8898]">{fmtBig(r.v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ===================================================================
// Módulo: CRIPTO
// ===================================================================

function CriptoModule({ active }: { active: boolean }) {
  const cripto = useFeed(fetchCripto, active)
  const dolares = useFeed(fetchDolares, active)
  const dolarCripto = useFeed(fetchDolarCripto, active)

  if (cripto.loading && !cripto.data) return <Loading accent={ORO} />

  const coins = cripto.data ?? []
  const d = dolares.data ?? []
  const cr = dolarCripto.data && !Number.isNaN(dolarCripto.data.venta) ? dolarCripto.data : null
  const of = d.find((x) => x.casa === "oficial")?.venta

  return (
    <div className="space-y-5">
      {(cr || of) && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {cr && <Stat label="Dólar Cripto" value={`$${fmt(cr.venta, 0)}`} sub={cr.fuente} />}
          {cr && of && <Stat label="Brecha Cripto" value={`${fmt((cr.venta / of - 1) * 100, 1)}%`} sub="vs oficial" />}
        </div>
      )}
      <Card>
        <Eyebrow accent={ORO}>Mercado cripto · USD · 24h</Eyebrow>
        {cripto.error && !coins.length ? (
          <div className="mt-4">
            <ErrorBox msg="No se pudo cargar el mercado cripto." onRetry={cripto.reload} />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse font-mono text-[12.5px]">
              <thead>
                <tr>
                  {["Moneda", "Precio USD", "24h %", "Cap.", "Vol. 24h"].map((h, i) => (
                    <th key={h} className={`whitespace-nowrap border-b border-[#2A2A2A] px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wide text-[#7E8898] ${i === 0 ? "text-left" : "text-right"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coins.map((c) => (
                  <tr key={c.id} className="border-b border-[#ffffff08] hover:bg-[#D4B86A]/5">
                    <td className="px-3 py-2.5 text-left">
                      <span className="flex items-center gap-2">
                        <StarButton item={{ id: `crypto:${c.id}`, type: "crypto", symbol: c.id, label: c.symbol.toUpperCase() }} />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.image} alt="" width={20} height={20} className="rounded-full" />
                        <b className="text-white">{c.symbol.toUpperCase()}</b>
                        <span className="text-[#7E8898]">{c.name}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-white">
                      ${fmt(c.current_price, c.current_price < 1 ? 4 : 2)}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Pct value={c.price_change_percentage_24h} />
                    </td>
                    <td className="px-3 py-2.5 text-right text-[#98A1B5]">${fmtBig(c.market_cap)}</td>
                    <td className="px-3 py-2.5 text-right text-[#7E8898]">${fmtBig(c.total_volume)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

// ===================================================================
// Módulo: TASAS / FCI
// ===================================================================

function TasasModule({ active }: { active: boolean }) {
  const pf = useFeed(fetchPlazoFijo, active)
  const fci = useFeed(fetchFCI, active)

  const pfRows = useMemo(
    () => (pf.data ?? []).filter((x) => x.tnaClientes > 0).sort((a, b) => b.tnaClientes - a.tnaClientes),
    [pf.data],
  )
  const fciRows = useMemo(
    () => (fci.data ?? []).sort((a, b) => b.patrimonio - a.patrimonio).slice(0, 25),
    [fci.data],
  )

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card>
        <Eyebrow accent={TEAL}>Plazo fijo · TNA clientes</Eyebrow>
        <div className="mt-4">
          {pf.loading && !pf.data ? (
            <Loading accent={TEAL} />
          ) : pf.error && !pf.data ? (
            <ErrorBox msg="No se pudieron cargar las tasas." onRetry={pf.reload} />
          ) : (
            <div className="space-y-0">
              {pfRows.map((b, i) => (
                <PlazoFijoRow key={b.entidad} bank={b} rank={i + 1} />
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <Eyebrow accent={AZUL}>FCI Money Market</Eyebrow>
        <div className="mt-4 overflow-x-auto">
          {fci.loading && !fci.data ? (
            <Loading accent={AZUL} />
          ) : fci.error && !fci.data ? (
            <ErrorBox msg="No se pudieron cargar los FCI." onRetry={fci.reload} />
          ) : (
            <table className="w-full border-collapse font-mono text-[12px]">
              <thead>
                <tr>
                  {["Fondo", "VCP", "Patrimonio"].map((h, i) => (
                    <th key={h} className={`border-b border-[#2A2A2A] px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wide text-[#7E8898] ${i === 0 ? "text-left" : "text-right"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fciRows.map((f) => (
                  <tr key={f.fondo} className="border-b border-[#ffffff08]">
                    <td className="px-3 py-2.5 text-left text-[11.5px] text-white">{f.fondo}</td>
                    <td className="px-3 py-2.5 text-right text-[#98A1B5]">${fmt(f.vcp, 2)}</td>
                    <td className="px-3 py-2.5 text-right text-[#7E8898]">${fmtBig(f.patrimonio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  )
}

function PlazoFijoRow({ bank, rank }: { bank: PlazoFijo; rank: number }) {
  const [imgOk, setImgOk] = useState(true)
  return (
    <div className="flex items-center gap-3 border-b border-[#ffffff08] py-2.5">
      <div
        className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-md font-mono text-[11px] font-bold"
        style={{ background: `${TEAL}1F`, color: TEAL }}
      >
        {rank}
      </div>
      {imgOk && bank.logo ? (
        // logo del BCRA: forzamos https porque el CSP bloquea http
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bank.logo.replace(/^http:\/\//, "https://")}
          alt=""
          width={24}
          height={24}
          className="rounded bg-white p-0.5"
          onError={() => setImgOk(false)}
        />
      ) : (
        <div className="grid h-6 w-6 flex-shrink-0 place-items-center rounded bg-[#1A1F2B] text-[10px] font-bold text-[#7E8898]">
          {bank.entidad.replace(/^BANCO\s+/i, "").charAt(0)}
        </div>
      )}
      <div className="min-w-0 flex-1 truncate text-[12.5px] text-white">{bank.entidad}</div>
      <div className="font-mono text-[15px] font-bold" style={{ color: TEAL }}>
        {fmt(bank.tnaClientes * 100, 2)}%
      </div>
    </div>
  )
}

// ===================================================================
// Reloj + estado de mercado (solo cliente, evita hydration mismatch)
// ===================================================================

function ClockStatus() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  if (!now) return null

  const ar = new Date(now.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }))
  const day = ar.getDay()
  const mins = ar.getHours() * 60 + ar.getMinutes()
  const open = day >= 1 && day <= 5 && mins >= 11 * 60 && mins <= 17 * 60
  const color = open ? TEAL : DOWN

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#0F1117]/70 px-3 py-1.5">
        <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        <div className="leading-tight">
          <div className="text-[11px] font-semibold text-white">{open ? "BYMA Abierto" : "BYMA Cerrado"}</div>
          <div className="text-[9px] text-[#7E8898]">{open ? "Rueda 11–17h" : "Fuera de rueda"}</div>
        </div>
      </div>
      <div className="text-right font-mono leading-tight">
        <div className="text-base font-semibold text-white">{ar.toLocaleTimeString("es-AR", { hour12: false })}</div>
        <div className="text-[10px] capitalize text-[#7E8898]">
          {ar.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "short" })} · ART
        </div>
      </div>
    </div>
  )
}

// ===================================================================
// Componente principal
// ===================================================================

export default function TerminalClient() {
  const [tab, setTab] = useState<TabId>("dolares")

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Eyebrow accent={AZUL}>Terminal · Experimental</Eyebrow>
          <h1 className="type-display-md mt-2 text-white">Mercado Argentino en vivo</h1>
        </div>
        <ClockStatus />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1.5 rounded-2xl border border-[#2A2A2A] bg-[#0B0E16]/60 p-1.5">
        {TABS.map((t) => {
          const isActive = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="rounded-xl px-4 py-2 text-sm font-semibold transition-all"
              style={
                isActive
                  ? { color: "#fff", background: `${t.accent}26`, boxShadow: `inset 0 0 0 1px ${t.accent}66` }
                  : { color: "#7E8898" }
              }
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Módulos */}
      {tab === "watchlist" && <WatchlistModule />}
      {tab === "dolares" && <DolaresModule active />}
      {tab === "macro" && <MacroModule active />}
      {tab === "acciones" && <MarketModule path="arg_stocks" accent={AZUL} active wType="stock" />}
      {tab === "cedears" && <MarketModule path="arg_cedears" accent={TEAL} active wType="cedear" />}
      {tab === "bonos" && <MarketModule path="arg_bonds" accent={AZUL} active wType="bond" />}
      {tab === "cripto" && <CriptoModule active />}
      {tab === "tasas" && <TasasModule active />}
      {tab === "calculadoras" && <CalculadorasModule />}
      {tab === "alertas" && <AlertasModule />}

      {/* Motor de alertas: siempre montado, revisa precios en segundo plano */}
      <AlertEngine />

      <p className="mt-8 text-center text-[11px] leading-relaxed text-[#5A6678]">
        Datos en vivo · solo informativo, no constituye recomendación de inversión.
        <br />
        Fuentes: dolarapi · argentinadatos · data912 · CoinGecko.
      </p>
    </div>
  )
}