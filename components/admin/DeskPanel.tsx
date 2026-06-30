"use client"

// Panel "Desk" del /admin. Todo lo del producto hermano (Flowdex Desk) que no
// encaja en los tabs existentes: consumo de tokens, corridas, salud del cupo y
// del free tier de Gemini, y los packs de créditos vendidos.
//
// Es client porque el selector de período recalcula todo en memoria (UX
// instantánea). La data llega pre-cargada del Server Component padre.
//
// Triada de colores: Inversión #5BB8D4 (azul) · Trading #7DD4C0 (teal) · IC #D4B86A (dorado)

import { useEffect, useMemo, useState } from "react"
import UserSearchSelect from "@/components/admin/UserSearchSelect"

// ---------- Parámetros editables (verificá contra tu plan real) ----------
// Precio estimado de Gemini 2.5 Flash por millón de tokens. Cambialo si tu
// plan o el pricing de Google cambian — acá se calcula el "costo" mostrado.
const GEMINI_IN_PER_M = 0.3 // USD / 1M tokens de prompt
const GEMINI_OUT_PER_M = 2.5 // USD / 1M tokens de respuesta
// Techo diario de referencia del free tier (llamadas/día). Es orientativo para
// el medidor; ajustalo al límite real de tu cuenta.
const FREE_TIER_CALLS_PER_DAY = 250

// ---------- Tipos de input ----------
export type DeskRunRow = {
  id: string
  user_id: string
  ticker: string
  board: string | null
  funded_by: string
  created_at: string
  gemini_calls: number
  tokens_in: number
  tokens_out: number
  tokens_cached: number
  cache_hit: boolean
}

export type DeskEntitlementRow = {
  user_id: string
  tier: string
  radar_until: string | null
}

export type DeskCreditRow = {
  user_id: string
  credits_total: number
  credits_used: number
  source: string
  expires_at: string | null
}

export type DeskOrderRow = {
  id: string
  user_id: string
  pack: string
  credits: number
  amount_usd: number
  provider: string
  status: string
  paid_at: string | null
  created_at: string
}

export type DeskUserLite = { id: string; email: string }

type Period = "mes" | "todo"

const fmtUsd = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 2 })
const fmtInt = (n: number) => n.toLocaleString("es-AR")
const fmtTokens = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : String(n)

function tokenCost(tokensIn: number, tokensOut: number): number {
  return (tokensIn / 1_000_000) * GEMINI_IN_PER_M + (tokensOut / 1_000_000) * GEMINI_OUT_PER_M
}

const TIER_LABEL: Record<string, string> = { trial: "Trial", founder: "Fundador", admin: "Admin" }
const FUNDED_LABEL: Record<string, string> = {
  free: "Gratis", founder: "Fundador", admin: "Admin", pack: "Pack",
}

export default function DeskPanel({
  runs,
  entitlements,
  credits,
  orders,
  users,
  grantCreditsAction,
  setTierAction,
  linkedAccounts = [],
}: {
  runs: DeskRunRow[]
  entitlements: DeskEntitlementRow[]
  credits: DeskCreditRow[]
  orders: DeskOrderRow[]
  users: DeskUserLite[]
  grantCreditsAction: (formData: FormData) => Promise<void>
  setTierAction: (formData: FormData) => Promise<void>
  linkedAccounts?: Array<{ fingerprint: string; emails: string[] }>
}) {
  const [period, setPeriod] = useState<Period>("mes")
  const [pack, setPack] = useState("")

  const emailById = useMemo(() => {
    const m = new Map<string, string>()
    users.forEach((u) => m.set(u.id, u.email))
    return m
  }, [users])

  const monthStart = useMemo(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1).getTime()
  }, [])
  const dayStart = useMemo(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  }, [])

  const periodRuns = useMemo(() => {
    if (period === "todo") return runs
    return runs.filter((r) => new Date(r.created_at).getTime() >= monthStart)
  }, [runs, period, monthStart])

  // ---------- KPIs ----------
  const kpi = useMemo(() => {
    const tokensIn = periodRuns.reduce((s, r) => s + (r.tokens_in || 0), 0)
    const tokensOut = periodRuns.reduce((s, r) => s + (r.tokens_out || 0), 0)
    const calls = periodRuns.reduce((s, r) => s + (r.gemini_calls || 0), 0)
    const cacheHits = periodRuns.filter((r) => r.cache_hit).length
    const activeUsers = new Set(periodRuns.map((r) => r.user_id)).size
    const callsToday = runs
      .filter((r) => new Date(r.created_at).getTime() >= dayStart)
      .reduce((s, r) => s + (r.gemini_calls || 0), 0)

    const paidOrders = orders.filter((o) => o.status === "paid")
    const periodPaid = period === "todo"
      ? paidOrders
      : paidOrders.filter((o) => new Date(o.paid_at || o.created_at).getTime() >= monthStart)
    const revenue = periodPaid.reduce((s, o) => s + Number(o.amount_usd || 0), 0)

    return {
      runs: periodRuns.length,
      tokensIn, tokensOut, calls,
      cost: tokenCost(tokensIn, tokensOut),
      cacheRate: periodRuns.length ? (cacheHits / periodRuns.length) * 100 : 0,
      activeUsers, callsToday, revenue, packs: periodPaid.length,
    }
  }, [periodRuns, runs, orders, period, monthStart, dayStart])

  // ---------- Consumo por usuario ----------
  const perUser = useMemo(() => {
    const map = new Map<string, { runs: number; tokensIn: number; tokensOut: number; calls: number }>()
    periodRuns.forEach((r) => {
      const cur = map.get(r.user_id) || { runs: 0, tokensIn: 0, tokensOut: 0, calls: 0 }
      cur.runs += 1
      cur.tokensIn += r.tokens_in || 0
      cur.tokensOut += r.tokens_out || 0
      cur.calls += r.gemini_calls || 0
      map.set(r.user_id, cur)
    })
    const rows = [...map.entries()].map(([uid, v]) => ({
      uid,
      email: emailById.get(uid) || uid.slice(0, 8),
      ...v,
      cost: tokenCost(v.tokensIn, v.tokensOut),
    }))
    rows.sort((a, b) => b.cost - a.cost)
    return rows
  }, [periodRuns, emailById])

  // ---------- Cupo / créditos vivos ----------
  const creditStats = useMemo(() => {
    const now = Date.now()
    const live = credits.filter((c) => !c.expires_at || new Date(c.expires_at).getTime() > now)
    const remaining = live.reduce((s, c) => s + Math.max(0, (c.credits_total || 0) - (c.credits_used || 0)), 0)
    const tierCount = { trial: 0, founder: 0, admin: 0 } as Record<string, number>
    entitlements.forEach((e) => { tierCount[e.tier] = (tierCount[e.tier] || 0) + 1 })
    return { remaining, tierCount }
  }, [credits, entitlements])

  const recentRuns = useMemo(
    () => [...periodRuns].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 40),
    [periodRuns]
  )

  const freeTierPct = Math.min(100, (kpi.callsToday / FREE_TIER_CALLS_PER_DAY) * 100)

  // Salud viva del Desk: resumen en memoria del proceso Python (proxy admin).
  // Se refresca solo cada 60s. Si el Desk está dormido (escala a cero) o sin
  // token, muestra el motivo en vez de romper.
  const [health, setHealth] = useState<{
    status: string
    window_min: number
    counts: Record<string, { label: string; count: number }>
    recent: { ts: number; kind: string; label: string; detail: string }[]
  } | null>(null)
  const [healthErr, setHealthErr] = useState<string | null>(null)
  useEffect(() => {
    let alive = true
    const load = () => {
      fetch("/api/admin/desk-health")
        .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
        .then(({ ok, j }) => {
          if (!alive) return
          if (ok) {
            setHealth(j)
            setHealthErr(null)
          } else {
            setHealth(null)
            setHealthErr(j?.error ?? "No disponible")
          }
        })
        .catch(() => {
          if (alive) setHealthErr("No se pudo cargar.")
        })
    }
    load()
    const id = setInterval(load, 60_000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header + selector de período */}
      <div className="glass-card flex flex-wrap items-end justify-between gap-3 rounded-2xl p-6">
        <div>
          <h2 className="text-3xl tracking-tight text-white">Flowdex Desk</h2>
          <p className="mt-1 text-sm text-[#888888]">
            Consumo, corridas y salud del producto de research.
          </p>
        </div>
        <div className="flex gap-1 rounded-xl border border-[#2A2A2A] bg-[#111111]/60 p-1">
          {(["mes", "todo"] as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all ${
                period === p ? "bg-[#1E1E1E] text-[#7DD4C0]" : "text-[#888888] hover:text-[#CCCCCC]"
              }`}
            >
              {p === "mes" ? "Este mes" : "Todo"}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard eyebrow="Corridas" value={fmtInt(kpi.runs)} sub={`${kpi.activeUsers} usuarios activos`} accent="#7DD4C0" />
        <KpiCard eyebrow="Tokens (in/out)" value={`${fmtTokens(kpi.tokensIn)} / ${fmtTokens(kpi.tokensOut)}`} sub={`${fmtInt(kpi.calls)} llamadas LLM`} accent="#5BB8D4" />
        <KpiCard eyebrow="Costo estimado" value={fmtUsd(kpi.cost)} sub="Gemini Flash (editable)" accent="#D4B86A" />
        <KpiCard eyebrow="Ingresos por packs" value={fmtUsd(kpi.revenue)} sub={`${kpi.packs} packs pagados`} accent="#7DD4C0" />
      </div>

      {/* Salud del sistema: estado vivo del Desk (fallos en ventana de 10 min) */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl tracking-tight text-white">Salud del sistema</h3>
          {health && (() => {
            const map: Record<string, { label: string; color: string }> = {
              ok: { label: "Operativo", color: "#7DD4C0" },
              atencion: { label: "Atención", color: "#D4B86A" },
              degradado: { label: "Degradado", color: "#E5484D" },
            }
            const s = map[health.status] ?? map.ok
            return (
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
                style={{ color: s.color, backgroundColor: `${s.color}1A` }}
              >
                ● {s.label}
              </span>
            )
          })()}
        </div>
        <p className="mt-1 text-sm text-[#888888]">
          Fallos por tipo en los últimos {health?.window_min ?? 10} min. El detalle completo
          vive en Cloud Logging; las alertas graves van a Telegram y mail.
        </p>

        {healthErr && (
          <p className="mt-4 text-sm text-[#D4B86A]">{healthErr}</p>
        )}

        {health && (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.keys(health.counts).length === 0 ? (
                <span className="text-sm text-[#7DD4C0]">Sin fallos en la ventana. Todo OK.</span>
              ) : (
                Object.entries(health.counts).map(([kind, c]) => (
                  <span
                    key={kind}
                    className="rounded-lg border border-[#2A2A2A] bg-[#111111]/60 px-3 py-1.5 text-xs text-[#CCCCCC]"
                  >
                    {c.label}: <b className={c.count >= 3 ? "text-[#E5484D]" : "text-white"}>{c.count}</b>
                  </span>
                ))
              )}
            </div>

            {health.recent.length > 0 && (
              <div className="mt-5 space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888888]">
                  Últimos fallos
                </p>
                {health.recent.slice(0, 12).map((e, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-[#CCCCCC]">
                      <span className="text-[#888888]">{e.label}</span> · {e.detail || "—"}
                    </span>
                    <span className="shrink-0 text-[#666666]">
                      {(() => {
                        const secs = Math.max(0, Math.round(Date.now() / 1000 - e.ts))
                        if (secs < 60) return `hace ${secs}s`
                        if (secs < 3600) return `hace ${Math.round(secs / 60)}m`
                        return `hace ${Math.round(secs / 3600)}h`
                      })()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Salud: free tier hoy + cache + créditos + tiers */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#5BB8D4]">Free tier hoy</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {fmtInt(kpi.callsToday)}<span className="text-base text-[#888888]"> / {FREE_TIER_CALLS_PER_DAY}</span>
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#1A1A1A]">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${freeTierPct}%`, background: freeTierPct > 85 ? "#E07A5F" : "#7DD4C0" }}
            />
          </div>
          <p className="mt-2 text-xs text-[#888888]">Llamadas LLM de hoy vs. techo configurable.</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4B86A]">Cache hit</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{kpi.cacheRate.toFixed(0)}%</p>
          <p className="mt-2 text-xs text-[#888888]">Corridas servidas del cache compartido (cero Gemini).</p>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#7DD4C0]">Créditos vivos</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{fmtInt(creditStats.remaining)}</p>
          <p className="mt-2 text-xs text-[#888888]">
            Tiers: {creditStats.tierCount.trial || 0} trial · {creditStats.tierCount.founder || 0} fundador · {creditStats.tierCount.admin || 0} admin
          </p>
        </div>
      </div>

      {/* Gestión manual: créditos de cortesía + asignar plan */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl tracking-tight text-white">Gestión manual</h3>
        <p className="mt-1 text-sm text-[#888888]">
          Cargar créditos a mano (cortesía / ajuste) o asignar plan. Todo queda en auditoría.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Cargar créditos / pack */}
          <form action={grantCreditsAction} className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4">
            <input type="hidden" name="returnTab" value="desk" />
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#7DD4C0]">Cargar créditos / pack</p>
            <div className="mt-3 space-y-3">
              <UserSearchSelect users={users} name="targetUserId" accent="#7DD4C0" />
              {/* Producto vendible del Desk: pack de créditos o pase del Radar.
                  Los créditos/días salen del catálogo en el server. */}
              <select name="pack" value={pack} onChange={(e) => setPack(e.target.value)}
                className="w-full rounded-lg border border-[#2A2A2A] bg-[#0C0C0C] px-3 py-2 text-sm text-[#CCCCCC]">
                <option value="">Créditos sueltos (custom)</option>
                <option value="inicial">Pack Inicial · 5 análisis</option>
                <option value="pro">Pack Pro · 20 análisis</option>
                <option value="intensivo">Pack Premium · 30 análisis + Radar 90d</option>
                <option value="radar30">Pase Radar · 30 días</option>
                <option value="radar90">Pase Radar · 90 días</option>
                <option value="radar365">Pase Radar · 1 año (+10 análisis)</option>
              </select>
              <div className="flex gap-2">
                <input name="amount" type="number" min={1} placeholder="Créditos (si es custom)"
                  disabled={pack !== ""}
                  className="w-1/2 rounded-lg border border-[#2A2A2A] bg-[#0C0C0C] px-3 py-2 text-sm text-[#CCCCCC] disabled:opacity-40" />
                <input name="months" type="number" min={1} defaultValue={6} title="Meses hasta vencer (créditos)" className="w-1/2 rounded-lg border border-[#2A2A2A] bg-[#0C0C0C] px-3 py-2 text-sm text-[#CCCCCC]" />
              </div>
              <select name="source" defaultValue="cortesia" className="w-full rounded-lg border border-[#2A2A2A] bg-[#0C0C0C] px-3 py-2 text-sm text-[#CCCCCC]">
                <option value="cortesia">Cortesía / gratis</option>
                <option value="manual">Ajuste manual</option>
                <option value="pago_no_acreditado">Pagó y no se le acreditó</option>
              </select>
              <button type="submit" className="w-full rounded-lg bg-[#1E1E1E] px-4 py-2 text-sm font-semibold text-[#7DD4C0] transition-colors hover:bg-[#262626]">
                Cargar
              </button>
            </div>
          </form>

          {/* Asignar rol (tier): NO es un producto vendible, es el rol de acceso
              del usuario en el Desk (cuántos análisis gratis tiene por período). */}
          <form action={setTierAction} className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4">
            <input type="hidden" name="returnTab" value="desk" />
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#D4B86A]">Asignar rol</p>
            <div className="mt-3 space-y-3">
              <UserSearchSelect users={users} name="targetUserId" accent="#D4B86A" />
              <select name="tier" defaultValue="founder" className="w-full rounded-lg border border-[#2A2A2A] bg-[#0C0C0C] px-3 py-2 text-sm text-[#CCCCCC]">
                <option value="trial">Trial (2 de por vida)</option>
                <option value="founder">Fundador (2 por mes)</option>
                <option value="admin">Admin (20 por día)</option>
              </select>
              <p className="text-[10px] text-[#666666]">El rol define el cupo gratis por período, no es algo que se venda.</p>
              <button type="submit" className="w-full rounded-lg bg-[#1E1E1E] px-4 py-2 text-sm font-semibold text-[#D4B86A] transition-colors hover:bg-[#262626]">
                Asignar rol
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Cuentas vinculadas (anti-abuso): misma huella en 2+ cuentas */}
      {linkedAccounts.length > 0 && (
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <h3 className="text-xl tracking-tight text-white">Cuentas vinculadas</h3>
          <p className="mt-1 text-sm text-[#888888]">
            Misma huella de dispositivo en varias cuentas (posible misma persona con varios mails).
            A las nuevas de confianza alta se les bloquean las 2 pruebas gratis automáticamente.
          </p>
          <div className="mt-4 space-y-2">
            {linkedAccounts.map((g) => (
              <div key={g.fingerprint} className="rounded-xl border border-[#E07A5F]/30 bg-[#111111]/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#E07A5F]">
                  {g.emails.length} cuentas · huella {g.fingerprint.slice(0, 12)}…
                </p>
                <p className="mt-1 text-sm text-[#CCCCCC]">{g.emails.join("  ·  ")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consumo por usuario */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl tracking-tight text-white">Consumo por usuario</h3>
        {perUser.length === 0 ? (
          <p className="mt-4 text-sm text-[#888888]">Sin corridas en el período.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-[#888888]">
                  <th className="px-3 py-1">Usuario</th>
                  <th className="px-3 py-1 text-right">Corridas</th>
                  <th className="px-3 py-1 text-right">Llamadas</th>
                  <th className="px-3 py-1 text-right">Tokens</th>
                  <th className="px-3 py-1 text-right">Costo</th>
                </tr>
              </thead>
              <tbody>
                {perUser.map((u) => (
                  <tr key={u.uid} className="rounded-xl bg-[#111111]/70">
                    <td className="px-3 py-2 text-[#CCCCCC]">{u.email}</td>
                    <td className="px-3 py-2 text-right text-[#CCCCCC]">{fmtInt(u.runs)}</td>
                    <td className="px-3 py-2 text-right text-[#CCCCCC]">{fmtInt(u.calls)}</td>
                    <td className="px-3 py-2 text-right text-[#CCCCCC]">{fmtTokens(u.tokensIn + u.tokensOut)}</td>
                    <td className="px-3 py-2 text-right font-semibold text-[#7DD4C0]">{fmtUsd(u.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Corridas recientes */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl tracking-tight text-white">Corridas recientes</h3>
        {recentRuns.length === 0 ? (
          <p className="mt-4 text-sm text-[#888888]">Sin corridas en el período.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-[#888888]">
                  <th className="px-3 py-1">Fecha</th>
                  <th className="px-3 py-1">Usuario</th>
                  <th className="px-3 py-1">Activo</th>
                  <th className="px-3 py-1">Financiada</th>
                  <th className="px-3 py-1 text-right">Llamadas</th>
                  <th className="px-3 py-1 text-right">Tokens</th>
                  <th className="px-3 py-1 text-right">Costo</th>
                </tr>
              </thead>
              <tbody>
                {recentRuns.map((r) => (
                  <tr key={r.id} className="rounded-xl bg-[#111111]/70">
                    <td className="px-3 py-2 text-[#888888]">
                      {new Date(r.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}
                      {" "}
                      {new Date(r.created_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-3 py-2 text-[#CCCCCC]">{emailById.get(r.user_id) || r.user_id.slice(0, 8)}</td>
                    <td className="px-3 py-2 font-semibold text-white">{r.ticker}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-md border border-[#2A2A2A] px-2 py-0.5 text-xs text-[#AAAAAA]">
                        {FUNDED_LABEL[r.funded_by] || r.funded_by}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-[#CCCCCC]">
                      {r.cache_hit ? <span className="text-[#D4B86A]">cache</span> : fmtInt(r.gemini_calls)}
                    </td>
                    <td className="px-3 py-2 text-right text-[#CCCCCC]">{fmtTokens(r.tokens_in + r.tokens_out)}</td>
                    <td className="px-3 py-2 text-right text-[#7DD4C0]">
                      {r.cache_hit ? "—" : fmtUsd(tokenCost(r.tokens_in, r.tokens_out))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function KpiCard({ eyebrow, value, sub, accent }: { eyebrow: string; value: string; sub: string; accent: string }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>{eyebrow}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-[#888888]">{sub}</p>
    </div>
  )
}
