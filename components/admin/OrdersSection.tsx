"use client"

import { useState, useMemo } from "react"

type OrderRow = {
  id: string
  user_id: string
  course_id: string
  amount_usd: number
  amount_ars: number | null
  provider: string
  provider_reference: string | null
  status: string
  created_at: string
  updated_at: string
}

type Props = {
  orders: OrderRow[]
  userById: Record<string, { email: string | null; full_name: string | null }>
  courseById: Record<string, { name: string }>
  markRefundedAction: (formData: FormData) => Promise<void>
  deleteOrderAction: (formData: FormData) => Promise<void>
}

// Estados que sí se pueden eliminar. Mantener sincronizado con el set del
// server action (app/admin/order-actions.ts). Si divergen, la UI muestra el
// botón pero el server lo bloquea — al menos no es inconsistente.
const DELETABLE_ORDER_STATUSES = new Set(["pending", "failed", "expired"])

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-[#7DD4C0]/15 text-[#7DD4C0]",
  pending: "bg-[#D4B87D]/15 text-[#D4B87D]",
  failed: "bg-[#7A2A2A]/20 text-[#F2B3B3]",
  expired: "bg-[#333]/30 text-[#888888]",
  refunded: "bg-[#5B8ED4]/15 text-[#90B8F2]",
}

const STATUS_LABELS: Record<string, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  failed: "Fallido",
  expired: "Expirado",
  refunded: "Reembolsado",
}

export function OrdersSection({
  orders,
  userById,
  courseById,
  markRefundedAction,
  deleteOrderAction,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const user = userById[order.user_id]
      const email = (user?.email || "").toLowerCase()
      const name = (user?.full_name || "").toLowerCase()
      const query = searchQuery.toLowerCase()

      const matchesSearch = !searchQuery || email.includes(query) || name.includes(query) || order.provider_reference?.toLowerCase().includes(query)
      const matchesStatus = statusFilter === "all" || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, userById, searchQuery, statusFilter])

  return (
    <div className="glass-card mt-6 rounded-2xl p-6 sm:p-8">
      <h2 className=" text-3xl tracking-tight text-white">Órdenes</h2>
      <p className="mt-2 text-sm text-[#888888]">
        Historial de compras. Podés buscar por email, nombre o referencia de pago y filtrar por estado.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por email, nombre o referencia..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[220px] rounded-xl border border-[#2A2A2A] bg-[#111111]/80 px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-[#2A2A2A] bg-[#111111]/80 px-4 py-3 text-white outline-none transition-colors focus:border-[#7DD4C0]"
        >
          <option value="all">Todos los estados</option>
          <option value="paid">Pagado</option>
          <option value="pending">Pendiente</option>
          <option value="failed">Fallido</option>
          <option value="expired">Expirado</option>
          <option value="refunded">Reembolsado</option>
        </select>
      </div>

      <p className="mt-3 text-xs text-[#666666]">{filtered.length} órdenes</p>

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4 text-sm text-[#888888]">
          No se encontraron órdenes.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Usuario</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Curso</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Monto</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Proveedor</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Referencia</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Estado</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Fecha</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const user = userById[order.user_id]
                const course = courseById[order.course_id]
                const canRefund = order.status === "paid"
                const canDelete = DELETABLE_ORDER_STATUSES.has(order.status)
                const isConfirming = confirmingDeleteId === order.id

                return (
                  <tr key={order.id} className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70">
                    <td className="px-3 py-3">
                      <p className="text-sm text-[#CCCCCC]">{user?.full_name || "Sin nombre"}</p>
                      <p className="text-xs text-[#888888]">{user?.email || order.user_id}</p>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#AAAAAA]">
                      {course?.name || order.course_id}
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-sm text-white">${Number(order.amount_usd).toFixed(2)} USD</p>
                      {order.amount_ars && (
                        <p className="text-xs text-[#888888]">${Number(order.amount_ars).toFixed(0)} ARS</p>
                      )}
                    </td>
                    <td className="px-3 py-3 text-sm text-[#AAAAAA] capitalize">{order.provider}</td>
                    <td className="px-3 py-3 text-xs text-[#888888] font-mono">{order.provider_reference || "-"}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs ${STATUS_COLORS[order.status] ?? "bg-[#333] text-[#888]"}`}>
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-[#888888]">
                      {new Date(order.created_at).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {canRefund && (
                          <form action={markRefundedAction}>
                            <input type="hidden" name="orderId" value={order.id} />
                            <input type="hidden" name="returnTab" value="ordenes" />
                            <button
                              type="submit"
                              className="rounded-lg border border-[#5B8ED4]/40 bg-[#1A2A3A] px-3 py-1.5 text-xs font-semibold text-[#90B8F2] transition-colors hover:bg-[#1E3248]"
                            >
                              Marcar reembolsado
                            </button>
                          </form>
                        )}

                        {canDelete && (
                          isConfirming ? (
                            <div className="inline-flex items-center gap-2">
                              {/* Form-action directo. Si envolvemos en
                                  closure con catch o startTransition, el
                                  redirect del server action se traga y el
                                  browser no refresca. */}
                              <form action={deleteOrderAction} className="inline">
                                <input type="hidden" name="orderId" value={order.id} />
                                <input type="hidden" name="returnTab" value="ordenes" />
                                <button
                                  type="submit"
                                  className="rounded-lg border border-[#7A2A2A] bg-[#2A1111] px-3 py-1.5 text-xs font-semibold text-[#F2B3B3] transition-colors hover:bg-[#341414]"
                                >
                                  Confirmar
                                </button>
                              </form>
                              <button
                                type="button"
                                onClick={() => setConfirmingDeleteId(null)}
                                className="rounded-lg border border-[#2A2A2A] bg-[#151515] px-3 py-1.5 text-xs text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmingDeleteId(order.id)}
                              className="rounded-lg border border-[#2A2A2A] bg-[#151515] px-3 py-1.5 text-xs font-semibold text-[#888888] transition-colors hover:border-[#7A2A2A]/60 hover:bg-[#1A0E0E] hover:text-[#F2B3B3]"
                            >
                              Eliminar
                            </button>
                          )
                        )}

                        {!canRefund && !canDelete && (
                          <span className="text-xs text-[#555555]">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
