"use client"

// ===================================================================
// FLOWDEX · Terminal — persistencia local (watchlist + alertas)
// Todo en localStorage: cero backend, cero Supabase. Per-dispositivo.
// Sincroniza entre componentes vía un CustomEvent propio + el evento
// nativo "storage" (otras pestañas).
// ===================================================================

import { useCallback, useEffect, useState } from "react"

const WL_KEY = "flowdex_terminal_watchlist_v1"
const AL_KEY = "flowdex_terminal_alertas_v1"
const EVT = "flowdex-terminal-store"

export type AssetType = "dolar" | "stock" | "cedear" | "bond" | "crypto"

export interface WatchItem {
  id: string // ej "dolar:blue", "stock:GGAL", "crypto:bitcoin"
  type: AssetType
  symbol: string // casa | ticker | coin id
  label: string
}

export type AlertOp = ">" | "<"

export interface PriceAlert {
  id: string
  assetType: Extract<AssetType, "dolar" | "crypto"> | "byma"
  ref: string // casa | coin id | ticker
  bymaPath?: "arg_stocks" | "arg_cedears" | "arg_bonds"
  label: string
  op: AlertOp
  value: number
  active: boolean
  triggeredAt?: number
}

// ---------- helpers ----------

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const s = window.localStorage.getItem(key)
    return s ? (JSON.parse(s) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, val: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(val))
    window.dispatchEvent(new CustomEvent(EVT, { detail: { key } }))
  } catch {
    /* storage lleno / bloqueado: ignoramos en silencio */
  }
}

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback)

  useEffect(() => {
    const load = () => setValue(read<T>(key, fallback))
    load()
    const onCustom = (e: Event) => {
      if ((e as CustomEvent).detail?.key === key) load()
    }
    window.addEventListener(EVT, onCustom)
    window.addEventListener("storage", load)
    return () => {
      window.removeEventListener(EVT, onCustom)
      window.removeEventListener("storage", load)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [value, setValue] as const
}

// ---------- watchlist ----------

export function useWatchlist() {
  const [items] = useStored<WatchItem[]>(WL_KEY, [])

  const toggle = useCallback((it: WatchItem) => {
    const cur = read<WatchItem[]>(WL_KEY, [])
    const exists = cur.some((x) => x.id === it.id)
    write(WL_KEY, exists ? cur.filter((x) => x.id !== it.id) : [...cur, it])
  }, [])

  const has = useCallback((id: string) => items.some((x) => x.id === id), [items])

  return { items, toggle, has }
}

// ---------- alertas ----------

export function useAlerts() {
  const [alerts] = useStored<PriceAlert[]>(AL_KEY, [])

  const add = useCallback((a: Omit<PriceAlert, "id" | "active">) => {
    const cur = read<PriceAlert[]>(AL_KEY, [])
    const alert: PriceAlert = { ...a, id: crypto.randomUUID(), active: true }
    write(AL_KEY, [alert, ...cur])
  }, [])

  const remove = useCallback((id: string) => {
    write(
      AL_KEY,
      read<PriceAlert[]>(AL_KEY, []).filter((x) => x.id !== id),
    )
  }, [])

  const update = useCallback((id: string, patch: Partial<PriceAlert>) => {
    write(
      AL_KEY,
      read<PriceAlert[]>(AL_KEY, []).map((x) => (x.id === id ? { ...x, ...patch } : x)),
    )
  }, [])

  return { alerts, add, remove, update }
}

// Lectura directa (para el motor, fuera de React state).
export const readAlerts = () => read<PriceAlert[]>(AL_KEY, [])
export const writeAlerts = (a: PriceAlert[]) => write(AL_KEY, a)
