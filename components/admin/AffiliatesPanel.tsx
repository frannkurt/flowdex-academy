"use client"

// Tab "Afiliados" del /admin. Agrupa las redenciones de cupones por afiliado
// (la persona dueña del cupón) y muestra: cuánto vendió, cuánta comisión le
// debés (pendiente) y cuánta ya le pagaste. El pago es mensual y manual:
// "Marcar como pagado" cierra todas las comisiones pendientes de esa persona.

import { useMemo, useState } from "react"

export type AffiliateRedemptionRow = {
  id: string
  code: string
  affiliate_user_id: string | null
  affiliate_name: string | null
  buyer_user_id: string | null
  product: string
  course_slug: string | null
  order_ref: string | null
  amount_paid_usd: number
  commission_pct: number
  commission_usd: number
  commission_paid_at: string | null
  created_at: string
}

export type AffiliateUserLite = { id: string; email: string }

const fmtUsd = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 2 })

export default function AffiliatesPanel({
  redemptions,
  users,
  markPaidAction,
}: {
  redemptions: AffiliateRedemptionRow[]
  users: AffiliateUserLite[]
  markPaidAction: (formData: FormData) => Promise<void>
}) {
  const [openKey, setOpenKey] = useState<string | null>(null)

  const emailById = useMemo(() => {
    const m = new Map<string, string>()
    users.forEach((u) => m.set(u.id, u.email))
    return m
  }, [users])

  // Agrupar por USUARIO afiliado (fuente de verdad). Si una redención no tiene
  // afiliado, cae en un grupo por código de cupón.
  const groups = useMemo(() => {
    const map = new Map<
      string,
      { name: string; userId: string | null; code: string; rows: AffiliateRedemptionRow[]; sold: number; owed: number; paid: number }
    >()
    redemptions.forEach((r) => {
      const key = r.affiliate_user_id || `code:${r.code}`
      const name =
        (r.affiliate_user_id && emailById.get(r.affiliate_user_id)) ||
        r.affiliate_name?.trim() ||
        "(sin afiliado)"
      const cur = map.get(key) || { name, userId: r.affiliate_user_id, code: r.code, rows: [], sold: 0, owed: 0, paid: 0 }
      cur.rows.push(r)
      cur.sold += Number(r.amount_paid_usd || 0)
      if (r.commission_paid_at) cur.paid += Number(r.commission_usd || 0)
      else cur.owed += Number(r.commission_usd || 0)
      map.set(key, cur)
    })
    return [...map.entries()]
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => b.owed - a.owed)
  }, [redemptions, emailById])

  const totals = useMemo(() => {
    const owed = groups.reduce((s, g) => s + g.owed, 0)
    const sold = groups.reduce((s, g) => s + g.sold, 0)
    return { owed, sold, affiliates: groups.length }
  }, [groups])

  if (redemptions.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <h2 className="text-2xl tracking-tight text-white">Afiliados</h2>
        <p className="mt-2 text-sm text-[#888888]">
          Todavía no hay ventas con cupón. Creá un cupón con nombre de afiliado en la pestaña Promos.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4B86A]">Comisión adeudada</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{fmtUsd(totals.owed)}</p>
          <p className="mt-1 text-xs text-[#888888]">Total pendiente de pago a afiliados</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#7DD4C0]">Vendido con cupón</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{fmtUsd(totals.sold)}</p>
          <p className="mt-1 text-xs text-[#888888]">Monto total de las compras con cupón</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#5BB8D4]">Afiliados activos</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{totals.affiliates}</p>
          <p className="mt-1 text-xs text-[#888888]">Con al menos una venta</p>
        </div>
      </div>

      {groups.map((g) => {
        const open = openKey === g.key
        return (
          <div key={g.key} className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl tracking-tight text-white">{g.name}</h3>
                <p className="mt-1 text-sm text-[#888888]">
                  Cupón <span className="text-[#CCCCCC]">{g.code}</span> · {g.rows.length} ventas · vendió {fmtUsd(g.sold)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#D4B86A]">Le debés</p>
                <p className="text-2xl font-semibold text-white">{fmtUsd(g.owed)}</p>
                {g.paid > 0 && <p className="text-xs text-[#666666]">Ya pagado: {fmtUsd(g.paid)}</p>}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOpenKey(open ? null : g.key)}
                className="rounded-lg border border-[#2A2A2A] px-4 py-2 text-xs font-semibold text-[#AAAAAA] transition-colors hover:text-white"
              >
                {open ? "Ocultar ventas" : "Ver ventas"}
              </button>
              {g.owed > 0 && (
                <form action={markPaidAction}>
                  <input type="hidden" name="returnTab" value="afiliados" />
                  <input type="hidden" name="affiliateUserId" value={g.userId ?? ""} />
                  <input type="hidden" name="code" value={g.code} />
                  <button
                    type="submit"
                    className="rounded-lg bg-[#1E1E1E] px-4 py-2 text-xs font-semibold text-[#7DD4C0] transition-colors hover:bg-[#262626]"
                  >
                    Marcar {fmtUsd(g.owed)} como pagado
                  </button>
                </form>
              )}
            </div>

            {open && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-[#888888]">
                      <th className="px-3 py-1">Fecha</th>
                      <th className="px-3 py-1">Producto</th>
                      <th className="px-3 py-1">Comprador</th>
                      <th className="px-3 py-1 text-right">Pagó</th>
                      <th className="px-3 py-1 text-right">Comisión</th>
                      <th className="px-3 py-1">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows
                      .slice()
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((r) => (
                        <tr key={r.id} className="rounded-xl bg-[#111111]/70">
                          <td className="px-3 py-2 text-[#888888]">
                            {new Date(r.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                          </td>
                          <td className="px-3 py-2 text-[#CCCCCC]">
                            {r.product === "desk" ? "Desk · pack" : `Curso${r.course_slug ? ` · ${r.course_slug}` : ""}`}
                          </td>
                          <td className="px-3 py-2 text-[#CCCCCC]">
                            {(r.buyer_user_id && emailById.get(r.buyer_user_id)) || (r.buyer_user_id ? r.buyer_user_id.slice(0, 8) : "—")}
                          </td>
                          <td className="px-3 py-2 text-right text-[#CCCCCC]">{fmtUsd(Number(r.amount_paid_usd))}</td>
                          <td className="px-3 py-2 text-right font-semibold text-[#D4B86A]">
                            {fmtUsd(Number(r.commission_usd))} <span className="text-[10px] text-[#666666]">({r.commission_pct}%)</span>
                          </td>
                          <td className="px-3 py-2">
                            {r.commission_paid_at ? (
                              <span className="text-[#7DD4C0]">pagado</span>
                            ) : (
                              <span className="text-[#D4B86A]">pendiente</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
