// ===================================================================
// FLOWDEX · Terminal experimental (/lab/terminal)
// Tipos, fetchers y helpers de formato.
// ===================================================================
//
// Fuentes (todas gratuitas):
//  - dolarapi.com        → cotizaciones de dólar (CORS abierto)
//  - argentinadatos.com  → riesgo país, inflación, plazo fijo, FCI (CORS abierto)
//  - CoinGecko           → mercado cripto en USD (CORS abierto)
//  - /api/byma           → proxy propio a data912 para acciones/bonos/CEDEARs
//
// Los que tienen CORS se consultan directo desde el cliente; data912 va por
// nuestro API route porque no envía cabeceras CORS.

// ---------- Tipos ----------

export interface Dolar {
  casa: string
  nombre: string
  compra: number
  venta: number
  fechaActualizacion: string
}

export interface SerieValor {
  fecha: string
  valor: number
}

export interface PlazoFijo {
  entidad: string
  logo: string
  tnaClientes: number
  tnaNoClientes: number
}

export interface FCI {
  fondo: string
  horizonte: string
  fecha: string
  vcp: number
  patrimonio: number
}

export interface Instrumento {
  symbol: string
  c: number // último
  pct_change: number
  px_bid: number
  px_ask: number
  v: number // volumen
}

export interface CriptoCoin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
}

export type BymaPath = "arg_stocks" | "arg_bonds" | "arg_cedears"

// ---------- Fetchers ----------

async function getJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  const r = await fetch(url, { cache: "no-store", signal })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return (await r.json()) as T
}

// Todo se consume desde nuestro propio dominio (/api/feed y /api/byma) para
// quedar same-origin: lo exige el CSP del sitio (connect-src 'self') y de paso
// cachea server-side y no expone los terceros al cliente.

export const fetchDolares = (signal?: AbortSignal) =>
  getJSON<Dolar[]>("/api/feed?src=dolares", signal)

export const fetchRiesgoHistorico = (signal?: AbortSignal) =>
  getJSON<SerieValor[]>("/api/feed?src=riesgo", signal)

export const fetchInflacion = (signal?: AbortSignal) =>
  getJSON<SerieValor[]>("/api/feed?src=inflacion", signal)

export const fetchPlazoFijo = (signal?: AbortSignal) =>
  getJSON<PlazoFijo[]>("/api/feed?src=plazofijo", signal)

export const fetchFCI = (signal?: AbortSignal) =>
  getJSON<FCI[]>("/api/feed?src=fci", signal)

export const fetchCripto = (signal?: AbortSignal) =>
  getJSON<CriptoCoin[]>("/api/feed?src=cripto", signal)

export const fetchByma = (path: BymaPath, signal?: AbortSignal) =>
  getJSON<Instrumento[]>(`/api/byma?path=${path}`, signal)

export interface DolarCripto {
  compra: number
  venta: number
  fuente: string
}

// Dólar cripto desde CriptoYa (agrega varios exchanges, incl. Binance).
export const fetchDolarCripto = (signal?: AbortSignal) =>
  getJSON<{
    cripto?: { usdt?: { ask: number; bid: number }; ccb?: { ask: number; bid: number } }
  }>("/api/feed?src=cripto_dolar", signal).then((d) => {
    const u = d.cripto?.usdt ?? d.cripto?.ccb
    return {
      compra: u?.bid ?? NaN,
      venta: u?.ask ?? NaN,
      fuente: "CriptoYa · USDT",
    } as DolarCripto
  })

// ---------- Helpers de formato ----------

export function fmt(n: number | null | undefined, d = 2): string {
  if (n == null || Number.isNaN(n)) return "—"
  return Number(n).toLocaleString("es-AR", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })
}

export function fmtBig(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—"
  const a = Math.abs(n)
  if (a >= 1e12) return (n / 1e12).toFixed(2) + "B"
  if (a >= 1e9) return (n / 1e9).toFixed(2) + "MM"
  if (a >= 1e6) return (n / 1e6).toFixed(2) + "M"
  if (a >= 1e3) return (n / 1e3).toFixed(1) + "k"
  return fmt(n, 0)
}

// Color por signo, usando la paleta de marca (teal sube, destructive baja).
export function signColor(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n) || n === 0) return "#7E8898"
  return n > 0 ? "#7DD4C0" : "#ef6a6a"
}

// Inflación interanual a partir de la serie mensual (acumula últimos 12).
export function inflacionInteranual(serie: SerieValor[]): number {
  const last12 = serie.slice(-12)
  const factor = last12.reduce((acc, m) => acc * (1 + m.valor / 100), 1)
  return (factor - 1) * 100
}
