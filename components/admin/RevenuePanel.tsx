"use client"

import { useState, useMemo } from "react"

type OrderRow = {
  id: string
  user_id: string
  course_id: string
  amount_usd: number
  provider: string
  status: string
  created_at: string
}

type CourseMap = Record<string, { name: string; slug: string }>
type UserMap = Record<string, { full_name: string | null; email: string | null }>

interface RevenuePanelProps {
  orders: OrderRow[]
  courseById: CourseMap
  userById: UserMap
}

type Period = "all" | "month" | "year"

function startOf(period: Period): Date | null {
  if (period === "all") return null
  const now = new Date()
  if (period === "month") return new Date(now.getFullYear(), now.getMonth(), 1)
  if (period === "year") return new Date(now.getFullYear(), 0, 1)
  return null
}

export default function RevenuePanel({ orders, courseById, userById }: RevenuePanelProps) {
  const [period, setPeriod] = useState<Period>("all")

  const paidOrders = useMemo(() => {
    const from = startOf(period)
    return orders.filter((o) => {
      if (o.status !== "paid") return false
      if (!from) return true
      return new Date(o.created_at) >= from
    })
  }, [orders, period])

  const totalRevenue = useMemo(
    () => paidOrders.reduce((sum, o) => sum + Number(o.amount_usd), 0),
    [paidOrders]
  )

  const avgTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

  // Revenue by course
  const byCourse = useMemo(() => {
    const map: Record<string, { name: string; count: number; total: number }> = {}
    for (const o of paidOrders) {
      const name = courseById[o.course_id]?.name ?? "Desconocido"
      if (!map[o.course_id]) map[o.course_id] = { name, count: 0, total: 0 }
      map[o.course_id].count++
      map[o.course_id].total += Number(o.amount_usd)
    }
    return Object.values(map).sort((a, b) => b.total - a.total)
  }, [paidOrders, courseById])

  // Revenue by provider
  const byProvider = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {}
    for (const o of paidOrders) {
      if (!map[o.provider]) map[o.provider] = { count: 0, total: 0 }
      map[o.provider].count++
      map[o.provider].total += Number(o.amount_usd)
    }
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total)
  }, [paidOrders])

  const PERIODS: { id: Period; label: string }[] = [
    { id: "all", label: "Todo" },
    { id: "month", label: "Este mes" },
    { id: "year", label: "Este año" },
  ]

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPeriod(p.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] transition-colors ${
              period === p.id
                ? "bg-[#7DD4C0]/15 text-[#7DD4C0] border border-[#7DD4C0]/30"
                : "border border-[#2A2A2A] text-[#888888] hover:text-[#CCCCCC]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[#7DD4C0]">Ingresos USD</p>
          <p className="mt-2  text-3xl tracking-tight text-white">
            ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-xs text-[#888888]">{paidOrders.length} {paidOrders.length === 1 ? "venta" : "ventas"} pagadas</p>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[#7DD4C0]">Ventas</p>
          <p className="mt-2  text-3xl tracking-tight text-white">{paidOrders.length}</p>
          <p className="mt-1 text-xs text-[#888888]">
            {orders.filter((o) => o.status === "pending").length} pendientes ·{" "}
            {orders.filter((o) => o.status === "refunded").length} reembolsadas
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[#7DD4C0]">Ticket promedio</p>
          <p className="mt-2  text-3xl tracking-tight text-white">
            ${avgTicket.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-xs text-[#888888]">USD por venta pagada</p>
        </div>
      </div>

      {/* By course */}
      {byCourse.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className=" text-xl tracking-tight text-white">Por curso</h3>
          <div className="mt-4 space-y-3">
            {byCourse.map((c) => {
              const pct = totalRevenue > 0 ? (c.total / totalRevenue) * 100 : 0
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#CCCCCC]">{c.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#888888]">{c.count} {c.count === 1 ? "venta" : "ventas"}</span>
                      <span className="text-sm font-semibold text-white">
                        ${c.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#2A2A2A]">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-[#5BB8D4] to-[#7DD4C0] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* By provider */}
      {byProvider.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className=" text-xl tracking-tight text-white">Por proveedor</h3>
          <div className="mt-4 flex flex-wrap gap-4">
            {byProvider.map(([provider, data]) => (
              <div key={provider} className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 px-5 py-4 flex-1 min-w-[140px]">
                <p className="text-xs uppercase tracking-[0.15em] text-[#888888]">{provider}</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  ${data.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="mt-0.5 text-xs text-[#666666]">{data.count} {data.count === 1 ? "venta" : "ventas"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className=" text-xl tracking-tight text-white">
          Transacciones{period !== "all" ? ` — ${period === "month" ? "este mes" : "este año"}` : ""}
        </h3>
        <p className="mt-1 text-sm text-[#888888]">Solo ventas pagadas en el período</p>

        {paidOrders.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4 text-sm text-[#888888]">
            No hay ventas pagadas en este período.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Fecha</th>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Usuario</th>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Curso</th>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Proveedor</th>
                  <th className="px-3 py-2 text-right text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">USD</th>
                </tr>
              </thead>
              <tbody>
                {paidOrders
                  .slice()
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((o) => {
                    const user = userById[o.user_id]
                    const course = courseById[o.course_id]
                    return (
                      <tr key={o.id} className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70">
                        <td className="px-3 py-3 text-xs text-[#888888]">
                          {new Date(o.created_at).toLocaleDateString("es-AR")}
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-sm text-[#CCCCCC]">{user?.full_name || "Sin nombre"}</p>
                          <p className="text-xs text-[#666666]">{user?.email || o.user_id}</p>
                        </td>
                        <td className="px-3 py-3 text-sm text-[#AAAAAA]">
                          {course?.name ?? "Desconocido"}
                        </td>
                        <td className="px-3 py-3 text-xs text-[#888888]">{o.provider}</td>
                        <td className="px-3 py-3 text-right text-sm font-semibold text-white">
                          ${Number(o.amount_usd).toFixed(2)}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="px-3 py-2 text-right text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Total</td>
                  <td className="px-3 py-2 text-right text-sm font-bold text-white">
                    ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
