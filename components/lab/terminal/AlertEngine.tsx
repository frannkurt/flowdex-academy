"use client"

// Motor de alertas: montado siempre en el terminal. Cada 45s revisa las
// alertas activas contra los precios en vivo y dispara toast + sonido +
// notificación del navegador (si el usuario la habilitó). Una vez disparada,
// la alerta queda inactiva (se puede re-armar desde la pestaña Alertas).

import { useCallback, useEffect, useRef, useState } from "react"
import { fetchByma, fetchCripto, fetchDolares, fmt } from "@/lib/terminal"
import { readAlerts, writeAlerts, type PriceAlert } from "@/lib/terminal-store"
import { ORO } from "./ui"

interface Toast {
  key: string
  msg: string
}

function meets(a: PriceAlert, cur: number) {
  return a.op === ">" ? cur >= a.value : cur <= a.value
}

function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g)
    g.connect(ctx.destination)
    o.type = "sine"
    o.frequency.value = 880
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5)
    o.start()
    o.stop(ctx.currentTime + 0.5)
  } catch {
    /* sin audio disponible */
  }
}

function notify(title: string, body: string) {
  try {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(title, { body })
    }
  } catch {
    /* ignorar */
  }
}

export function AlertEngine() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const busy = useRef(false)

  const removeToast = useCallback((key: string) => {
    setToasts((t) => t.filter((x) => x.key !== key))
  }, [])

  useEffect(() => {
    const tick = async () => {
      if (busy.current) return
      const pending = readAlerts().filter((a) => a.active && !a.triggeredAt)
      if (pending.length === 0) return
      busy.current = true
      try {
        const needDolar = pending.some((a) => a.assetType === "dolar")
        const needCrypto = pending.some((a) => a.assetType === "crypto")
        const paths = new Set(
          pending.filter((a) => a.assetType === "byma" && a.bymaPath).map((a) => a.bymaPath!),
        )

        const [dol, cri, stk, ced, bon] = await Promise.all([
          needDolar ? fetchDolares().catch(() => []) : Promise.resolve([]),
          needCrypto ? fetchCripto().catch(() => []) : Promise.resolve([]),
          paths.has("arg_stocks") ? fetchByma("arg_stocks").catch(() => []) : Promise.resolve([]),
          paths.has("arg_cedears") ? fetchByma("arg_cedears").catch(() => []) : Promise.resolve([]),
          paths.has("arg_bonds") ? fetchByma("arg_bonds").catch(() => []) : Promise.resolve([]),
        ])

        const current = (a: PriceAlert): number | null => {
          if (a.assetType === "dolar") return dol.find((x) => x.casa === a.ref)?.venta ?? null
          if (a.assetType === "crypto") return cri.find((x) => x.id === a.ref)?.current_price ?? null
          const arr = a.bymaPath === "arg_stocks" ? stk : a.bymaPath === "arg_cedears" ? ced : bon
          return arr.find((x) => x.symbol === a.ref)?.c ?? null
        }

        const fired: { a: PriceAlert; cur: number }[] = []
        for (const a of pending) {
          const cur = current(a)
          if (cur != null && meets(a, cur)) fired.push({ a, cur })
        }

        if (fired.length) {
          const firedIds = new Set(fired.map((f) => f.a.id))
          writeAlerts(
            readAlerts().map((x) =>
              firedIds.has(x.id) ? { ...x, active: false, triggeredAt: Date.now() } : x,
            ),
          )
          for (const f of fired) {
            const msg = `${f.a.label} ${f.a.op === ">" ? "≥" : "≤"} ${fmt(f.a.value, 2)} · ahora ${fmt(f.cur, 2)}`
            beep()
            notify("Alerta Flowdex", msg)
            setToasts((t) => [...t, { key: f.a.id + ":" + Date.now(), msg }])
          }
        }
      } finally {
        busy.current = false
      }
    }

    const iv = setInterval(tick, 45_000)
    void tick()
    return () => clearInterval(iv)
  }, [])

  // auto-dismiss
  useEffect(() => {
    if (!toasts.length) return
    const timers = toasts.map((t) => setTimeout(() => removeToast(t.key), 14_000))
    return () => timers.forEach(clearTimeout)
  }, [toasts, removeToast])

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex max-w-[340px] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.key}
          className="flex items-start gap-3 rounded-2xl border bg-[#0F1117]/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur"
          style={{ borderColor: `${ORO}66` }}
        >
          <span className="text-lg leading-none" style={{ color: ORO }}>
            🔔
          </span>
          <div className="flex-1">
            <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: ORO }}>
              Alerta disparada
            </div>
            <div className="mt-1 font-mono text-[12.5px] text-white">{t.msg}</div>
          </div>
          <button onClick={() => removeToast(t.key)} className="text-[#7E8898] hover:text-white">
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
