"use client"

// Panel del admin para LEER el journal de un alumno. El profesor busca por email,
// elige, y ve las entradas (PnL, trades y notas) para tener criterio de dónde se
// traba cada uno. Solo lectura: no se edita ni se borra desde acá.

import { useEffect, useMemo, useState } from "react"

type AdminUser = { id: string; email: string }

type JournalEntry = {
  id: string
  entry_date: string
  pnl_usd: number
  trades_count: number
  notes: string | null
  updated_at: string
}

const ACCENT = "#7DD4C0" // teal · rama Trading

function fmtDate(s: string): string {
  try {
    return new Date(s + "T00:00:00").toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  } catch {
    return s
  }
}

function fmtUsd(n: number): string {
  const sign = n > 0 ? "+" : ""
  return `${sign}${n.toLocaleString("es-AR", { maximumFractionDigits: 2 })}`
}

export default function JournalsPanel({ users }: { users: AdminUser[] }) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<AdminUser | null>(null)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recent, setRecent] = useState<{ user_id: string; last_active: string }[]>([])

  const emailById = useMemo(() => {
    const m = new Map<string, string>()
    for (const u of users) m.set(u.id, u.email)
    return m
  }, [users])

  // Actividad reciente: alumnos con entradas, ordenados por la última cargada.
  useEffect(() => {
    let alive = true
    fetch("/api/admin/journals")
      .then((r) => r.json())
      .then((d) => {
        if (alive && Array.isArray(d.recent)) setRecent(d.recent)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return users.filter((u) => (u.email || "").toLowerCase().includes(q)).slice(0, 5)
  }, [query, users])

  async function selectUser(u: AdminUser) {
    setSelected(u)
    setQuery("")
    setLoading(true)
    setError(null)
    setEntries([])
    try {
      const res = await fetch(`/api/admin/journals?userId=${encodeURIComponent(u.id)}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "No se pudo cargar el journal.")
      } else {
        setEntries((data.entries ?? []) as JournalEntry[])
      }
    } catch {
      setError("Error de red.")
    } finally {
      setLoading(false)
    }
  }

  const summary = useMemo(() => {
    if (!entries.length) return null
    const totalPnl = entries.reduce((a, e) => a + (e.pnl_usd || 0), 0)
    const totalTrades = entries.reduce((a, e) => a + (e.trades_count || 0), 0)
    const wins = entries.filter((e) => (e.pnl_usd || 0) > 0).length
    const losses = entries.filter((e) => (e.pnl_usd || 0) < 0).length
    const withNotes = entries.filter((e) => (e.notes || "").trim()).length
    return { totalPnl, totalTrades, wins, losses, withNotes, days: entries.length }
  }, [entries])

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <h2 className="text-3xl tracking-tight text-white">Journals</h2>
      <p className="mt-2 text-sm text-[#888888]">
        Leé el journal de un alumno para ver dónde se traba: rachas de pérdidas, días sin
        registrar, notas. Solo lectura.
      </p>

      {/* Buscador de alumno */}
      <div className="relative mt-6 max-w-md">
        {selected ? (
          <div
            className="flex items-center justify-between gap-2 rounded-lg border bg-[#0C0C0C] px-3 py-2 text-sm text-[#CCCCCC]"
            style={{ borderColor: ACCENT }}
          >
            <span className="truncate">{selected.email}</span>
            <button
              type="button"
              onClick={() => {
                setSelected(null)
                setEntries([])
                setError(null)
              }}
              className="shrink-0 text-[11px] uppercase tracking-wider text-[#888888] hover:text-white"
            >
              cambiar
            </button>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscá al alumno por email…"
              autoComplete="off"
              className="w-full rounded-lg border border-[#2A2A2A] bg-[#0C0C0C] px-3 py-2 text-sm text-[#CCCCCC] outline-none focus:border-[#3a3a3a]"
            />
            {matches.length > 0 && (
              <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#0C0C0C] shadow-xl">
                {matches.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => selectUser(u)}
                    className="block w-full truncate px-3 py-2 text-left text-sm text-[#CCCCCC] hover:bg-[#1A1A1A]"
                  >
                    {u.email}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Actividad reciente: clickear al alumno abre su journal completo */}
      {!selected && recent.length > 0 && (
        <div className="mt-6">
          <div className="text-[11px] uppercase tracking-wider text-[#888888]">Actividad reciente</div>
          <div className="mt-2 flex flex-col gap-1">
            {recent
              .filter((r) => emailById.has(r.user_id))
              .map((r) => (
                <button
                  key={r.user_id}
                  type="button"
                  onClick={() => selectUser({ id: r.user_id, email: emailById.get(r.user_id) || "" })}
                  className="w-full max-w-md truncate rounded-lg border border-[#2A2A2A] bg-[#0C0C0C] px-3 py-2 text-left text-sm text-[#CCCCCC] transition-colors hover:border-[#3a3a3a] hover:bg-[#1A1A1A]"
                >
                  {emailById.get(r.user_id)}
                </button>
              ))}
          </div>
        </div>
      )}

      {loading && <p className="mt-6 text-sm text-[#888888]">Cargando journal…</p>}
      {error && <p className="mt-6 text-sm text-[#ff6b6b]">{error}</p>}

      {selected && !loading && !error && !entries.length && (
        <p className="mt-6 text-sm text-[#888888]">Este alumno todavía no cargó entradas en el journal.</p>
      )}

      {summary && (
        <>
          {/* Resumen */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {[
              { l: "Días registrados", v: String(summary.days) },
              {
                l: "PnL acumulado",
                v: `${fmtUsd(summary.totalPnl)} USD`,
                c: summary.totalPnl >= 0 ? ACCENT : "#ff6b6b",
              },
              { l: "Trades", v: String(summary.totalTrades) },
              { l: "Días verdes", v: String(summary.wins), c: ACCENT },
              { l: "Días rojos", v: String(summary.losses), c: "#ff6b6b" },
              { l: "Con notas", v: String(summary.withNotes) },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3">
                <div className="text-[10px] uppercase tracking-wider text-[#888888]">{s.l}</div>
                <div className="mt-1 text-lg font-semibold" style={{ color: s.c || "#FFFFFF" }}>
                  {s.v}
                </div>
              </div>
            ))}
          </div>

          {/* Entradas */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-[#888888]">
                  <th className="py-2 pr-4">Fecha</th>
                  <th className="py-2 pr-4">PnL (USD)</th>
                  <th className="py-2 pr-4">Trades</th>
                  <th className="py-2">Nota</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-t border-[#1E1E1E] align-top">
                    <td className="whitespace-nowrap py-2 pr-4 text-[#CCCCCC]">{fmtDate(e.entry_date)}</td>
                    <td
                      className="whitespace-nowrap py-2 pr-4 font-medium"
                      style={{ color: (e.pnl_usd || 0) > 0 ? ACCENT : (e.pnl_usd || 0) < 0 ? "#ff6b6b" : "#CCCCCC" }}
                    >
                      {fmtUsd(e.pnl_usd || 0)}
                    </td>
                    <td className="py-2 pr-4 text-[#CCCCCC]">{e.trades_count || 0}</td>
                    <td className="py-2 text-[#AAAAAA]" style={{ whiteSpace: "pre-line" }}>
                      {(e.notes || "").trim() || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
