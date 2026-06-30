"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  fetchByma,
  fetchCripto,
  fetchDolares,
  fmt,
  type CriptoCoin,
  type Dolar,
  type Instrumento,
} from "@/lib/terminal"
import { useWatchlist } from "@/lib/terminal-store"
import { Card, Eyebrow, ORO, DOWN } from "./ui"
import { StarButton } from "./StarButton"

interface Resolved {
  id: string
  type: string
  label: string
  symbol: string
  price: number | null
  pct: number | null
}

const TYPE_LABEL: Record<string, string> = {
  dolar: "Dólar",
  stock: "Acción",
  cedear: "CEDEAR",
  bond: "Bono",
  crypto: "Cripto",
}

export function WatchlistModule() {
  const { items } = useWatchlist()
  const [dolares, setDolares] = useState<Dolar[]>([])
  const [cripto, setCripto] = useState<CriptoCoin[]>([])
  const [stocks, setStocks] = useState<Instrumento[]>([])
  const [cedears, setCedears] = useState<Instrumento[]>([])
  const [bonds, setBonds] = useState<Instrumento[]>([])
  const [loading, setLoading] = useState(true)

  const needs = useMemo(() => {
    const t = new Set(items.map((i) => i.type))
    return {
      dolar: t.has("dolar"),
      crypto: t.has("crypto"),
      stock: t.has("stock"),
      cedear: t.has("cedear"),
      bond: t.has("bond"),
    }
  }, [items])

  const load = useCallback(async () => {
    setLoading(true)
    const jobs: Promise<void>[] = []
    if (needs.dolar) jobs.push(fetchDolares().then(setDolares).catch(() => {}))
    if (needs.crypto) jobs.push(fetchCripto().then(setCripto).catch(() => {}))
    if (needs.stock) jobs.push(fetchByma("arg_stocks").then(setStocks).catch(() => {}))
    if (needs.cedear) jobs.push(fetchByma("arg_cedears").then(setCedears).catch(() => {}))
    if (needs.bond) jobs.push(fetchByma("arg_bonds").then(setBonds).catch(() => {}))
    await Promise.allSettled(jobs)
    setLoading(false)
  }, [needs])

  useEffect(() => {
    void load()
    const t = setInterval(() => void load(), 60_000)
    return () => clearInterval(t)
  }, [load])

  const rows: Resolved[] = useMemo(() => {
    return items.map((it) => {
      let price: number | null = null
      let pct: number | null = null
      if (it.type === "dolar") {
        const d = dolares.find((x) => x.casa === it.symbol)
        price = d?.venta ?? null
      } else if (it.type === "crypto") {
        const c = cripto.find((x) => x.id === it.symbol)
        price = c?.current_price ?? null
        pct = c?.price_change_percentage_24h ?? null
      } else {
        const arr = it.type === "stock" ? stocks : it.type === "cedear" ? cedears : bonds
        const r = arr.find((x) => x.symbol === it.symbol)
        price = r?.c ?? null
        pct = r?.pct_change ?? null
      }
      return { id: it.id, type: it.type, label: it.label, symbol: it.symbol, price, pct }
    })
  }, [items, dolares, cripto, stocks, cedears, bonds])

  if (items.length === 0) {
    return (
      <Card>
        <Eyebrow accent={ORO}>Mi watchlist</Eyebrow>
        <div className="py-10 text-center text-sm text-[#7E8898]">
          Todavía no seguís ningún activo.
          <br />
          Tocá la ⭐ en cualquier dólar, acción, CEDEAR, bono o cripto para sumarlo acá.
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <Eyebrow accent={ORO}>Mi watchlist · {items.length}</Eyebrow>
        {loading && <span className="text-[11px] text-[#7E8898]">actualizando…</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[12.5px]">
          <thead>
            <tr>
              {["", "Activo", "Tipo", "Precio", "Var %"].map((h, i) => (
                <th
                  key={i}
                  className={`whitespace-nowrap border-b border-[#2A2A2A] px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wide text-[#7E8898] ${i <= 1 ? "text-left" : "text-right"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-[#ffffff08] hover:bg-[#D4B86A]/5">
                <td className="px-2 py-2.5">
                  <StarButton item={{ id: r.id, type: r.type as never, symbol: r.symbol, label: r.label }} />
                </td>
                <td className="px-3 py-2.5 text-left font-semibold text-white">{r.label}</td>
                <td className="px-3 py-2.5 text-left text-[#7E8898]">{TYPE_LABEL[r.type] ?? r.type}</td>
                <td className="px-3 py-2.5 text-right text-white">
                  {r.price == null ? "—" : `$${fmt(r.price, 2)}`}
                </td>
                <td className="px-3 py-2.5 text-right">
                  {r.pct == null ? (
                    <span className="text-[#5A6678]">—</span>
                  ) : (
                    <span style={{ color: r.pct > 0 ? "#7DD4C0" : r.pct < 0 ? DOWN : "#7E8898" }}>
                      {r.pct > 0 ? "▲" : r.pct < 0 ? "▼" : "■"} {fmt(Math.abs(r.pct), 2)}%
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
