"use client"

import { useEffect, useMemo, useState } from "react"
import { fetchCripto, fetchDolares, fmt, type CriptoCoin, type Dolar } from "@/lib/terminal"
import { useAlerts, type AlertOp, type PriceAlert } from "@/lib/terminal-store"
import { Card, Eyebrow, Field, inputCls, ORO, TEAL } from "./ui"

type Tipo = "dolar" | "crypto" | "byma"
type Panel = "arg_stocks" | "arg_cedears" | "arg_bonds"

const PANEL_LABEL: Record<Panel, string> = {
  arg_stocks: "Acción",
  arg_cedears: "CEDEAR",
  arg_bonds: "Bono",
}

export function AlertasModule() {
  const { alerts, add, remove, update } = useAlerts()
  const [dolares, setDolares] = useState<Dolar[]>([])
  const [cripto, setCripto] = useState<CriptoCoin[]>([])

  const [tipo, setTipo] = useState<Tipo>("dolar")
  const [casa, setCasa] = useState("blue")
  const [coin, setCoin] = useState("bitcoin")
  const [panel, setPanel] = useState<Panel>("arg_stocks")
  const [ticker, setTicker] = useState("")
  const [op, setOp] = useState<AlertOp>(">")
  const [valor, setValor] = useState("")

  const [notifPerm, setNotifPerm] = useState<NotificationPermission | "unsupported">("default")

  useEffect(() => {
    fetchDolares().then(setDolares).catch(() => {})
    fetchCripto().then(setCripto).catch(() => {})
    if (typeof Notification !== "undefined") setNotifPerm(Notification.permission)
    else setNotifPerm("unsupported")
  }, [])

  const canCreate = useMemo(() => {
    const v = Number(valor)
    if (!v || v <= 0) return false
    if (tipo === "byma" && ticker.trim().length === 0) return false
    return true
  }, [valor, tipo, ticker])

  function crear() {
    const v = Number(valor)
    if (!v) return
    let base: Omit<PriceAlert, "id" | "active">
    if (tipo === "dolar") {
      const d = dolares.find((x) => x.casa === casa)
      base = { assetType: "dolar", ref: casa, label: `Dólar ${d?.nombre ?? casa} (venta)`, op, value: v }
    } else if (tipo === "crypto") {
      const c = cripto.find((x) => x.id === coin)
      base = { assetType: "crypto", ref: coin, label: `${c?.symbol.toUpperCase() ?? coin} (USD)`, op, value: v }
    } else {
      const sym = ticker.trim().toUpperCase()
      base = { assetType: "byma", ref: sym, bymaPath: panel, label: `${sym} · ${PANEL_LABEL[panel]}`, op, value: v }
    }
    add(base)
    setValor("")
    setTicker("")
  }

  async function pedirNotif() {
    if (typeof Notification === "undefined") return
    const p = await Notification.requestPermission()
    setNotifPerm(p)
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Builder */}
      <Card>
        <Eyebrow accent={ORO}>Crear alerta</Eyebrow>
        <div className="mt-4 space-y-3">
          <Field label="Tipo de activo">
            <div className="inline-flex w-full rounded-lg border border-[#2A2A2A] bg-[#0A0D14] p-1">
              {(["dolar", "crypto", "byma"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className="flex-1 rounded-md px-2 py-1.5 text-[13px] font-semibold transition-all"
                  style={tipo === t ? { background: `${ORO}26`, color: "#fff", boxShadow: `inset 0 0 0 1px ${ORO}66` } : { color: "#7E8898" }}
                >
                  {t === "dolar" ? "Dólar" : t === "crypto" ? "Cripto" : "Ticker"}
                </button>
              ))}
            </div>
          </Field>

          {tipo === "dolar" && (
            <Field label="Cotización">
              <select className={inputCls} value={casa} onChange={(e) => setCasa(e.target.value)}>
                {dolares.filter((d) => d.casa !== "mayorista").map((d) => (
                  <option key={d.casa} value={d.casa} className="bg-[#0A0D14]">
                    {d.nombre} — hoy ${fmt(d.venta, 0)}
                  </option>
                ))}
              </select>
            </Field>
          )}

          {tipo === "crypto" && (
            <Field label="Moneda">
              <select className={inputCls} value={coin} onChange={(e) => setCoin(e.target.value)}>
                {cripto.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#0A0D14]">
                    {c.symbol.toUpperCase()} — US$ {fmt(c.current_price, c.current_price < 1 ? 4 : 2)}
                  </option>
                ))}
              </select>
            </Field>
          )}

          {tipo === "byma" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Panel">
                <select className={inputCls} value={panel} onChange={(e) => setPanel(e.target.value as Panel)}>
                  <option value="arg_stocks" className="bg-[#0A0D14]">Acciones</option>
                  <option value="arg_cedears" className="bg-[#0A0D14]">CEDEARs</option>
                  <option value="arg_bonds" className="bg-[#0A0D14]">Bonos</option>
                </select>
              </Field>
              <Field label="Ticker">
                <input className={inputCls} value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} placeholder="GGAL" />
              </Field>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Condición">
              <select className={inputCls} value={op} onChange={(e) => setOp(e.target.value as AlertOp)}>
                <option value=">" className="bg-[#0A0D14]">Sube hasta ≥</option>
                <option value="<" className="bg-[#0A0D14]">Baja hasta ≤</option>
              </select>
            </Field>
            <Field label="Valor">
              <input className={inputCls} inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0" />
            </Field>
          </div>

          <button
            onClick={crear}
            disabled={!canCreate}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-bold transition-all disabled:opacity-40"
            style={{ background: `${ORO}26`, color: "#fff", boxShadow: `inset 0 0 0 1px ${ORO}66` }}
          >
            Crear alerta
          </button>

          {notifPerm !== "granted" && notifPerm !== "unsupported" && (
            <button onClick={pedirNotif} className="w-full rounded-lg border border-[#2A2A2A] px-4 py-2 text-[12px] text-[#98A1B5] hover:text-white">
              🔔 Activar notificaciones del navegador
            </button>
          )}
          <p className="text-[11px] text-[#5A6678]">
            Las alertas se revisan cada ~45s mientras tengas el terminal abierto.
          </p>
        </div>
      </Card>

      {/* Lista */}
      <Card>
        <Eyebrow accent={TEAL}>Mis alertas · {alerts.length}</Eyebrow>
        <div className="mt-4 space-y-2">
          {alerts.length === 0 && (
            <div className="py-8 text-center text-sm text-[#7E8898]">Todavía no creaste alertas.</div>
          )}
          {alerts.map((a) => {
            const disparada = !!a.triggeredAt
            return (
              <div key={a.id} className="flex items-center gap-3 rounded-xl border border-[#2A2A2A] bg-[#0A0D14] px-3 py-2.5">
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: disparada ? ORO : a.active ? TEAL : "#4A5468", boxShadow: a.active && !disparada ? `0 0 8px ${TEAL}` : "none" }}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-white">{a.label}</div>
                  <div className="font-mono text-[11px] text-[#98A1B5]">
                    {a.op === ">" ? "≥" : "≤"} {fmt(a.value, 2)} · {disparada ? "disparada" : a.active ? "activa" : "pausada"}
                  </div>
                </div>
                {disparada ? (
                  <button
                    onClick={() => update(a.id, { active: true, triggeredAt: undefined })}
                    className="rounded-md px-2 py-1 text-[11px] font-semibold"
                    style={{ color: TEAL }}
                  >
                    Re-armar
                  </button>
                ) : (
                  <button
                    onClick={() => update(a.id, { active: !a.active })}
                    className="rounded-md px-2 py-1 text-[11px] font-semibold text-[#98A1B5] hover:text-white"
                  >
                    {a.active ? "Pausar" : "Activar"}
                  </button>
                )}
                <button onClick={() => remove(a.id)} className="text-[#7E8898] hover:text-[#ef6a6a]" aria-label="Eliminar">
                  ✕
                </button>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-[11px] text-[#5A6678]">
          Estado:{" "}
          {notifPerm === "granted" ? "notificaciones activas" : notifPerm === "unsupported" ? "navegador sin notificaciones" : "solo aviso en pantalla"}.
        </p>
      </Card>
    </div>
  )
}
