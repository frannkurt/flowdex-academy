"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { ChevronLeft, ChevronRight, Lock, Trash2, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useLanguage } from "@/lib/language-context"

type JournalEntry = {
  id: string
  entry_date: string
  pnl_usd: number
  trades_count: number
  notes: string | null
  updated_at: string
}

type Props = {
  hasAccess: boolean
}

type EquityRange = "1m" | "3m" | "6m" | "1y"

const WEEK_DAYS_ES = ["L", "M", "M", "J", "V", "S", "D"]
const WEEK_DAYS_EN = ["M", "T", "W", "T", "F", "S", "S"]
const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]
const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const EQUITY_RANGE_MONTHS: Record<EquityRange, number> = {
  "1m": 1,
  "3m": 3,
  "6m": 6,
  "1y": 12,
}

function formatLocalIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function formatUsd(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : ""
  const abs = Math.abs(value)
  return `${sign}$${abs.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function startOfEquityRange(date: Date, range: EquityRange) {
  const months = EQUITY_RANGE_MONTHS[range]
  return new Date(date.getFullYear(), date.getMonth() - (months - 1), 1)
}

function upsertEntryList(entries: JournalEntry[], entry: JournalEntry) {
  const next = entries.filter((item) => item.entry_date !== entry.entry_date)
  next.push(entry)
  next.sort((left, right) => left.entry_date.localeCompare(right.entry_date))
  return next
}

function removeEntryFromList(entries: JournalEntry[], entryDate: string) {
  return entries.filter((item) => item.entry_date !== entryDate)
}

function formatEquityAxisLabel(iso: string, language: "es" | "en", range: EquityRange) {
  const date = new Date(`${iso}T00:00:00`)
  const locale = language === "es" ? "es-AR" : "en-US"

  if (range === "1m") {
    return date.toLocaleDateString(locale, { day: "numeric" })
  }

  if (range === "3m") {
    return date.toLocaleDateString(locale, { day: "numeric", month: "short" })
  }

  return date.toLocaleDateString(locale, { month: "short" })
}

function formatEquityTooltipLabel(iso: string, language: "es" | "en") {
  const date = new Date(`${iso}T00:00:00`)
  const locale = language === "es" ? "es-AR" : "en-US"
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

// Devuelve el indice 0-6 donde 0=Lunes, 6=Domingo
function mondayBasedDay(date: Date): number {
  const day = date.getDay() // 0=Domingo
  return day === 0 ? 6 : day - 1
}

export function JournalClient({ hasAccess }: Props) {
  const { language } = useLanguage()
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()))
  const [entries, setEntries] = useState<Record<string, JournalEntry>>({})
  const [equityEntries, setEquityEntries] = useState<JournalEntry[]>([])
  const [equityRange, setEquityRange] = useState<EquityRange>("1m")
  const [isLoading, setIsLoading] = useState(false)
  const [isEquityLoading, setIsEquityLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [equityError, setEquityError] = useState<string | null>(null)

  const monthLabel = useMemo(() => {
    const months = language === "es" ? MONTHS_ES : MONTHS_EN
    return `${months[cursor.getMonth()]} ${cursor.getFullYear()}`
  }, [cursor, language])

  const fetchMonth = useCallback(async () => {
    if (!hasAccess) return

    setIsLoading(true)
    setError(null)

    const from = formatLocalIsoDate(startOfMonth(cursor))
    const to = formatLocalIsoDate(endOfMonth(cursor))

    try {
      const response = await fetch(`/api/journal?from=${from}&to=${to}`, {
        method: "GET",
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("No se pudieron leer las entradas.")
      }

      const data = (await response.json()) as { entries: JournalEntry[] }
      const map: Record<string, JournalEntry> = {}
      for (const entry of data.entries) {
        map[entry.entry_date] = entry
      }
      setEntries(map)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.")
    } finally {
      setIsLoading(false)
    }
  }, [cursor, hasAccess])

  useEffect(() => {
    void fetchMonth()
  }, [fetchMonth])

  const fetchEquity = useCallback(async () => {
    if (!hasAccess) return

    setIsEquityLoading(true)
    setEquityError(null)

    const from = formatLocalIsoDate(startOfEquityRange(cursor, equityRange))
    const to = formatLocalIsoDate(endOfMonth(cursor))

    try {
      const response = await fetch(`/api/journal?from=${from}&to=${to}`, {
        method: "GET",
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(language === "es" ? "No se pudo leer la curva." : "Could not load the curve.")
      }

      const data = (await response.json()) as { entries: JournalEntry[] }
      setEquityEntries(data.entries)
    } catch (err) {
      setEquityError(err instanceof Error ? err.message : language === "es" ? "Error inesperado." : "Unexpected error.")
    } finally {
      setIsEquityLoading(false)
    }
  }, [cursor, equityRange, hasAccess, language])

  useEffect(() => {
    void fetchEquity()
  }, [fetchEquity])

  const monthEntries = useMemo(() => Object.values(entries), [entries])

  const summary = useMemo(() => {
    if (monthEntries.length === 0) {
      return {
        totalPnl: 0,
        totalTrades: 0,
        winRate: null as number | null,
        bestDay: null as JournalEntry | null,
        worstDay: null as JournalEntry | null,
      }
    }

    let totalPnl = 0
  let totalTrades = 0
    let greenDays = 0
    let redDays = 0
    let bestDay: JournalEntry | null = null
    let worstDay: JournalEntry | null = null

    for (const entry of monthEntries) {
      const pnl = Number(entry.pnl_usd)
      totalPnl += pnl
      totalTrades += Number(entry.trades_count)
      if (pnl > 0) greenDays += 1
      else if (pnl < 0) redDays += 1
      if (!bestDay || pnl > Number(bestDay.pnl_usd)) bestDay = entry
      if (!worstDay || pnl < Number(worstDay.pnl_usd)) worstDay = entry
    }

    const decidedDays = greenDays + redDays
    const winRate = decidedDays > 0 ? (greenDays / decidedDays) * 100 : null

    return { totalPnl, totalTrades, winRate, bestDay, worstDay }
  }, [monthEntries])

  const equityCurve = useMemo(() => {
    const rangeStart = startOfEquityRange(cursor, equityRange)
    const rangeEnd = endOfMonth(cursor)
    const map = new Map(equityEntries.map((entry) => [entry.entry_date, entry]))
    let acc = 0
    const points: Array<{ iso: string; pnl: number }> = []
    for (let date = new Date(rangeStart); date <= rangeEnd; date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)) {
      const iso = formatLocalIsoDate(date)
      const entry = map.get(iso)
      if (entry) acc += Number(entry.pnl_usd)
      points.push({ iso, pnl: Number(acc.toFixed(2)) })
    }
    return points
  }, [cursor, equityEntries, equityRange])

  const hasAnyEntry = monthEntries.length > 0
  const hasAnyEquityEntry = equityEntries.length > 0

  const calendarCells = useMemo(() => {
    const monthStart = startOfMonth(cursor)
    const monthEnd = endOfMonth(cursor)
    const leadingBlanks = mondayBasedDay(monthStart)
    const totalDays = monthEnd.getDate()

    const cells: Array<
      | { type: "blank"; key: string }
      | { type: "day"; key: string; date: Date; iso: string; entry: JournalEntry | undefined }
    > = []

    for (let i = 0; i < leadingBlanks; i++) {
      cells.push({ type: "blank", key: `blank-${i}` })
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(cursor.getFullYear(), cursor.getMonth(), day)
      const iso = formatLocalIsoDate(date)
      cells.push({
        type: "day",
        key: iso,
        date,
        iso,
        entry: entries[iso],
      })
    }

    return cells
  }, [cursor, entries])

  const goToPrevMonth = () =>
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
  const goToNextMonth = () =>
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
  const goToToday = () => setCursor(startOfMonth(new Date()))

  const todayIso = formatLocalIsoDate(new Date())
  const weekDays = language === "es" ? WEEK_DAYS_ES : WEEK_DAYS_EN

  const handleSave = async (payload: {
    entryDate: string
    pnlUsd: number
    tradesCount: number
    notes: string | null
  }) => {
    setError(null)
    const response = await fetch("/api/journal", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string }
      setError(data.error ?? "No se pudo guardar.")
      return false
    }

    const data = (await response.json()) as { entry: JournalEntry }
    setEntries((prev) => ({ ...prev, [data.entry.entry_date]: data.entry }))
    setEquityEntries((prev) => upsertEntryList(prev, data.entry))
    return true
  }

  const handleDelete = async (entryDate: string) => {
    setError(null)
    const response = await fetch(`/api/journal?entryDate=${entryDate}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string }
      setError(data.error ?? "No se pudo borrar.")
      return false
    }

    setEntries((prev) => {
      const next = { ...prev }
      delete next[entryDate]
      return next
    })
    setEquityEntries((prev) => removeEntryFromList(prev, entryDate))
    return true
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070D] pt-24 pb-20 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#5BB8D4]/15 blur-3xl" />
        <div className="absolute right-[-120px] top-56 h-80 w-80 rounded-full bg-[#7DD4C0]/12 blur-3xl" />
        <div className="absolute bottom-[-180px] left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#2A7E96]/10 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(140deg,#111421_0%,#0B0E16_58%,#0A1116_100%)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="pointer-events-none absolute right-[-30px] top-1/2 hidden h-52 w-52 -translate-y-1/2 opacity-[0.06] lg:block">
            <Image src="/3 LOGO PNG BLANCO.png" alt="" fill sizes="208px" className="object-contain" />
          </div>
          <div className="mb-5 inline-flex items-center rounded-full border border-[#28434B] bg-[#0C1A1F]/70 px-3 py-1">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#7DD4C0]">
              {language === "es" ? "Tu Journal personal" : "Your personal journal"}
            </p>
          </div>
          <h1 className="mt-3  text-4xl sm:text-5xl tracking-tight text-white">
            JOURNAL
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#B8BDC9] sm:text-base lg:max-w-3xl xl:max-w-4xl xl:text-[1.05rem]">
            {language === "es"
              ? "El trader que no registra, no aprende: repite. Anota tu PnL diario, la cantidad de trades y lo que viviste en la sesion."
              : "The trader who doesn't journal doesn't learn; they repeat. Log your daily PnL, trade count and what you experienced."}
          </p>
          <div className="mt-6 max-w-2xl border-l border-[#D9B16F]/35 pl-4 sm:pl-5 lg:max-w-[46rem] xl:max-w-[52rem]">
            <p className=" text-lg italic leading-tight tracking-[0.01em] text-[#E8C38A] sm:text-[1.6rem] xl:text-[1.75rem]">
              {language === "es"
                ? '"Los patrones aparecen cuando los miras a los ojos."'
                : '"Patterns appear when you look them in the eye."'}
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-[#E8C38A] sm:text-xs">
              {language === "es" ? "El maestro" : "The Master"}
            </p>
          </div>
        </div>

        {!hasAccess ? <LockedView language={language} /> : (
          <>
            <SummaryPanel
              summary={summary}
              language={language}
              monthLabel={monthLabel}
            />

            <div className="relative mt-6 overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(170deg,#0F1117_0%,#0B0D14_100%)] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:p-6">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative h-[72%] w-[72%] max-h-[760px] max-w-[760px] opacity-[0.055] sm:opacity-[0.07]">
                  <Image src="/3 LOGO PNG BLANCO.png" alt="" fill sizes="70vw" className="object-contain" priority />
                </div>
              </div>
              <div className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPrevMonth}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2A2A2A] bg-black/20 text-[#D7DBE5] transition-colors hover:border-[#7DD4C0]/40 hover:text-white"
                    aria-label="Mes anterior"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <h2 className=" text-2xl tracking-tight text-white">
                    {monthLabel}
                  </h2>
                  <button
                    type="button"
                    onClick={goToNextMonth}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2A2A2A] bg-black/20 text-[#D7DBE5] transition-colors hover:border-[#7DD4C0]/40 hover:text-white"
                    aria-label="Mes siguiente"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={goToToday}
                  className="rounded-full border border-[#2A2A2A] bg-black/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-[#A3ACBE] transition-colors hover:border-[#7DD4C0]/40 hover:text-white"
                >
                  {language === "es" ? "Hoy" : "Today"}
                </button>
              </div>

              {error && (
                <div className="relative z-10 mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {error}
                </div>
              )}

              <div className="relative z-10 mb-2 grid grid-cols-7 gap-1.5 text-center text-[10px] uppercase tracking-[0.14em] text-[#6A6F7E]">
                {weekDays.map((d, idx) => (
                  <span key={`${d}-${idx}`}>{d}</span>
                ))}
              </div>

              <div className={`relative z-10 grid grid-cols-7 gap-1.5 ${isLoading ? "opacity-60" : ""}`}>
                {calendarCells.map((cell) => {
                  if (cell.type === "blank") {
                    return <div key={cell.key} className="aspect-square" />
                  }
                  const isToday = cell.iso === todayIso
                  const pnl = cell.entry ? Number(cell.entry.pnl_usd) : null
                  const tradesCount = cell.entry ? Number(cell.entry.trades_count) : null
                  const tone =
                    pnl === null
                      ? "neutral"
                      : pnl > 0
                      ? "green"
                      : pnl < 0
                      ? "red"
                      : "flat"

                  const baseClasses =
                    "group relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border text-center backdrop-blur-[1.5px] transition-all"
                  const toneClasses =
                    tone === "green"
                      ? "border-[#1F6B5C] bg-[#0B2A23]/88 hover:border-[#7DD4C0]/70"
                      : tone === "red"
                      ? "border-[#6B2030] bg-[#2A0E15]/88 hover:border-red-400/70"
                      : tone === "flat"
                      ? "border-[#3A3A3A] bg-[#181818]/84 hover:border-[#7DD4C0]/40"
                      : "border-[#1F232C] bg-[#0D1015]/80 hover:border-[#7DD4C0]/30"
                  const todayClass = isToday ? "ring-1 ring-[#7DD4C0]/60" : ""

                  return (
                    <button
                      key={cell.key}
                      type="button"
                      onClick={() => setSelectedDate(cell.iso)}
                      className={`${baseClasses} ${toneClasses} ${todayClass}`}
                    >
                      <span className="absolute left-1.5 top-1 text-[10px] font-medium text-[#6A6F7E] sm:text-[11px]">
                        {cell.date.getDate()}
                      </span>
                      {pnl !== null ? (
                        <>
                          <span
                            className={`relative z-10 -translate-y-1 text-[13px] font-semibold leading-none drop-shadow-sm sm:text-base ${
                              tone === "green"
                                ? "text-[#7DD4C0]"
                                : tone === "red"
                                ? "text-red-300"
                                : "text-[#A3ACBE]"
                            }`}
                          >
                            {formatUsd(pnl)}
                          </span>
                          <span className="absolute bottom-1.5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/6 bg-black/20 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[#8891A4] sm:text-[10px]">
                            {tradesCount} {language === "es" ? "trades" : tradesCount === 1 ? "trade" : "trades"}
                          </span>
                        </>
                      ) : (
                        <span className="relative z-10 text-[10px] uppercase tracking-[0.14em] text-[#3A3F4C] sm:text-[11px]">
                          —
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              <p className="relative z-10 mt-4 text-xs text-[#6A6F7E]">
                {language === "es"
                  ? "Tocá un dia para registrar o editar. Verde = positivo. Rojo = negativo. Gris = sin operar."
                  : "Tap a day to record or edit. Green = positive. Red = negative. Gray = no trading."}
              </p>
            </div>

            <EquityCurvePanel
              data={equityCurve}
              range={equityRange}
              onRangeChange={setEquityRange}
              language={language}
              monthLabel={monthLabel}
              hasAnyEntry={hasAnyEquityEntry}
              isLoading={isEquityLoading}
              error={equityError}
            />
          </>
        )}
      </section>

      {selectedDate && hasAccess && (
        <EntryModal
          dateIso={selectedDate}
          entry={entries[selectedDate]}
          language={language}
          onClose={() => setSelectedDate(null)}
          onSave={async (payload) => {
            const ok = await handleSave(payload)
            if (ok) setSelectedDate(null)
          }}
          onDelete={async () => {
            if (!entries[selectedDate]) return
            const ok = await handleDelete(selectedDate)
            if (ok) setSelectedDate(null)
          }}
        />
      )}
    </main>
  )
}

function LockedView({ language }: { language: "es" | "en" }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(170deg,#0F1117_0%,#0B0D14_100%)] p-8 text-center shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
      <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#28434B] bg-[#0C1A1F]/70">
        <Lock size={22} className="text-[#7DD4C0]" />
      </div>
      <h2 className=" text-2xl tracking-tight text-white sm:text-3xl">
        {language === "es" ? "Esta herramienta es del camino del Trader" : "This tool belongs to the Trader path"}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-[#B8BDC9] sm:text-base">
        {language === "es"
          ? "El Journal es una pieza central del metodo Flowdex para trading: te obliga a registrar, revisar y aprender de cada sesion. Activa Kickstart Trading, Trading Lab o Inner Circle para empezar a usarlo."
          : "The Journal is a core piece of the Flowdex trading method: it forces you to record, review and learn from each session. Activate Kickstart Trading, Trading Lab or Inner Circle to start using it."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/checkout/kickstart-trading"
          className="rounded-xl px-5 py-3 text-sm font-semibold text-[#0A0A0A] transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)" }}
        >
          Kickstart Trading
        </Link>
        <Link
          href="/checkout/trading-lab"
          className="rounded-xl border border-[#2A2A2A] bg-black/20 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-[#7DD4C0]/40"
        >
          Trading Lab
        </Link>
        <Link
          href="/checkout/inner-circle"
          className="rounded-xl border border-[#2A2A2A] bg-black/20 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-[#7DD4C0]/40"
        >
          Inner Circle
        </Link>
      </div>
    </div>
  )
}

function SummaryPanel({
  summary,
  language,
  monthLabel,
}: {
  summary: {
    totalPnl: number
    totalTrades: number
    winRate: number | null
    bestDay: JournalEntry | null
    worstDay: JournalEntry | null
  }
  language: "es" | "en"
  monthLabel: string
}) {
  const totalTone =
    summary.totalPnl > 0
      ? "text-[#7DD4C0]"
      : summary.totalPnl < 0
      ? "text-red-300"
      : "text-[#A3ACBE]"

  const stats = [
    {
      label: language === "es" ? "PnL del mes" : "Month PnL",
      value: formatUsd(summary.totalPnl),
      tone: totalTone,
    },
    {
      label: "Win %",
      value:
        summary.winRate === null
          ? "—"
          : `${Math.round(summary.winRate)}%`,
      tone: "text-[#7DD4C0]",
    },
    {
      label: language === "es" ? "Trades" : "Trades",
      value: String(summary.totalTrades),
      tone: "text-[#A3ACBE]",
    },
    {
      label: language === "es" ? "Mejor dia" : "Best day",
      value: summary.bestDay ? formatUsd(Number(summary.bestDay.pnl_usd)) : "—",
      tone: "text-[#7DD4C0]",
    },
    {
      label: language === "es" ? "Peor dia" : "Worst day",
      value: summary.worstDay ? formatUsd(Number(summary.worstDay.pnl_usd)) : "—",
      tone: "text-red-300",
    },
  ]

  return (
    <div className="overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(170deg,#0F1117_0%,#0B0D14_100%)] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:p-6">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#7DD4C0]">
        {language === "es" ? "Resumen de" : "Summary of"} {monthLabel}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#1F232C] bg-[#0D1015] px-3 py-3"
          >
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6A6F7E]">{stat.label}</p>
            <p className={`mt-1 text-lg font-semibold sm:text-xl ${stat.tone}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function EntryModal({
  dateIso,
  entry,
  language,
  onClose,
  onSave,
  onDelete,
}: {
  dateIso: string
  entry: JournalEntry | undefined
  language: "es" | "en"
  onClose: () => void
  onSave: (payload: {
    entryDate: string
    pnlUsd: number
    tradesCount: number
    notes: string | null
  }) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [pnl, setPnl] = useState<string>(entry ? String(Math.abs(Number(entry.pnl_usd))) : "")
  const [sign, setSign] = useState<"profit" | "loss">(
    entry && Number(entry.pnl_usd) < 0 ? "loss" : "profit"
  )
  const [trades, setTrades] = useState<string>(entry ? String(entry.trades_count) : "")
  const [notes, setNotes] = useState<string>(entry?.notes ?? "")
  const [saving, setSaving] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const dateLabel = useMemo(() => {
    const [y, m, d] = dateIso.split("-").map(Number)
    const date = new Date(y, m - 1, d)
    const locale = language === "es" ? "es-AR" : "en-US"
    return date.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }, [dateIso, language])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    const parsedPnl = Number(pnl.replace(",", "."))
    const parsedTrades = Number(trades || "0")

    if (Number.isNaN(parsedPnl)) {
      setLocalError(language === "es" ? "PnL invalido." : "Invalid PnL.")
      return
    }

    if (!Number.isInteger(parsedTrades) || parsedTrades < 0) {
      setLocalError(language === "es" ? "Cantidad invalida." : "Invalid count.")
      return
    }

    const absPnl = Math.abs(parsedPnl)
    const signedPnl = sign === "loss" ? -absPnl : absPnl

    setSaving(true)
    await onSave({
      entryDate: dateIso,
      pnlUsd: signedPnl,
      tradesCount: parsedTrades,
      notes: notes.trim() || null,
    })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-[70] mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#0D1015] p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#888888] transition-colors hover:text-white"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#7DD4C0]">
          {language === "es" ? "Registro del dia" : "Daily entry"}
        </p>
        <h3 className="mt-1  text-xl tracking-tight text-white capitalize">
          {dateLabel}
        </h3>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-[0.14em] text-[#A3ACBE]">
              {language === "es" ? "Resultado del dia" : "Day result"}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSign("profit")}
                aria-pressed={sign === "profit"}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  sign === "profit"
                    ? "border-[#7DD4C0]/60 bg-[#7DD4C0]/10 text-[#7DD4C0]"
                    : "border-[#2A2A2A] bg-[#05070D] text-[#A3ACBE] hover:text-white"
                }`}
              >
                {language === "es" ? "Ganancia" : "Profit"}
              </button>
              <button
                type="button"
                onClick={() => setSign("loss")}
                aria-pressed={sign === "loss"}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  sign === "loss"
                    ? "border-[#E26B6B]/60 bg-[#E26B6B]/10 text-[#E26B6B]"
                    : "border-[#2A2A2A] bg-[#05070D] text-[#A3ACBE] hover:text-white"
                }`}
              >
                {language === "es" ? "Perdida" : "Loss"}
              </button>
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-[0.14em] text-[#A3ACBE]">
              {sign === "loss"
                ? language === "es" ? "Monto perdido (USD)" : "Loss amount (USD)"
                : language === "es" ? "Monto ganado (USD)" : "Profit amount (USD)"}
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={pnl}
              onChange={(e) => setPnl(e.target.value)}
              placeholder="0.00"
              className={`rounded-lg border border-[#2A2A2A] bg-[#05070D] px-3 py-2.5 text-base text-white outline-none transition-colors ${
                sign === "loss" ? "focus:border-[#E26B6B]/60" : "focus:border-[#7DD4C0]/60"
              }`}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-[0.14em] text-[#A3ACBE]">
              {language === "es" ? "Cantidad de trades" : "Trade count"}
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={trades}
              onChange={(e) => setTrades(e.target.value)}
              placeholder="0"
              className="rounded-lg border border-[#2A2A2A] bg-[#05070D] px-3 py-2.5 text-base text-white outline-none transition-colors focus:border-[#7DD4C0]/60"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-[0.14em] text-[#A3ACBE]">
              {language === "es" ? "Notas" : "Notes"}
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder={
                language === "es"
                  ? "Que viste en el mercado, que emocion dominó, que harias distinto..."
                  : "What you saw in the market, what emotion took over, what you'd do differently..."
              }
              className="rounded-lg border border-[#2A2A2A] bg-[#05070D] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]/60"
            />
            <span className="text-[10px] text-[#6A6F7E]">{notes.length}/2000</span>
          </label>

          {localError && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {localError}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            {entry ? (
              <button
                type="button"
                onClick={() => void onDelete()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200 transition-colors hover:bg-red-500/20"
              >
                <Trash2 size={14} />
                {language === "es" ? "Borrar" : "Delete"}
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#2A2A2A] bg-black/20 px-4 py-2 text-sm text-[#D7DBE5] transition-colors hover:text-white"
              >
                {language === "es" ? "Cancelar" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[#0A0A0A] transition-all hover:scale-105 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)" }}
              >
                {saving
                  ? language === "es"
                    ? "Guardando..."
                    : "Saving..."
                  : language === "es"
                  ? "Guardar"
                  : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// Equity curve del rango elegido — PnL acumulado dia a dia.
function EquityCurvePanel({
  data,
  range,
  onRangeChange,
  language,
  monthLabel,
  hasAnyEntry,
  isLoading,
  error,
}: {
  data: Array<{ iso: string; pnl: number }>
  range: EquityRange
  onRangeChange: (range: EquityRange) => void
  language: "es" | "en"
  monthLabel: string
  hasAnyEntry: boolean
  isLoading: boolean
  error: string | null
}) {
  const lastPnl = data.length > 0 ? data[data.length - 1].pnl : 0
  const totalRangePnl = Number(lastPnl.toFixed(2))
  const tone = lastPnl > 0 ? "green" : lastPnl < 0 ? "red" : "flat"
  const lineColor = tone === "green" ? "#7DD4C0" : tone === "red" ? "#F87171" : "#5A6271"
  const rangeHeading =
    range === "1m"
      ? monthLabel.toUpperCase()
      : range === "3m"
      ? language === "es"
        ? "Ultimos 3 meses"
        : "Last 3 months"
      : range === "6m"
      ? language === "es"
        ? "Ultimos 6 meses"
        : "Last 6 months"
      : language === "es"
      ? "Ultimo año"
      : "Last year"
  const rangeOptions: Array<{ value: EquityRange; label: string }> = [
    { value: "1m", label: language === "es" ? "Mes actual" : "Current month" },
    { value: "3m", label: language === "es" ? "3 meses" : "3 months" },
    { value: "6m", label: language === "es" ? "6 meses" : "6 months" },
    { value: "1y", label: language === "es" ? "1 a\u00f1o" : "1 year" },
  ]
  const totalTone =
    totalRangePnl > 0
      ? "text-[#7DD4C0]"
      : totalRangePnl < 0
      ? "text-red-300"
      : "text-[#A3ACBE]"

  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(170deg,#0F1117_0%,#0B0D14_100%)] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#7DD4C0]">
            {language === "es" ? "Curva de PnL acumulado" : "Cumulative PnL curve"}
          </p>
          <h2 className="mt-2  text-2xl tracking-tight text-white">
            {rangeHeading}
          </h2>
          <div className="mt-3 inline-flex items-center gap-3 rounded-2xl border border-[#1F232C] bg-[#0B0D14] px-4 py-2">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#7E879A]">
              {language === "es" ? "PnL total" : "Total PnL"}
            </span>
            <span className={`text-sm font-semibold ${totalTone}`}>
              {formatUsd(totalRangePnl)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start">
          <div className="inline-flex rounded-full border border-[#1F232C] bg-[#0B0D14] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {rangeOptions.map((option) => {
              const isActive = option.value === range

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onRangeChange(option.value)}
                  className={`rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-all sm:px-4 ${
                    isActive
                      ? "bg-[linear-gradient(135deg,#5BB8D4_0%,#7DD4C0_100%)] text-[#071015] shadow-[0_6px_18px_rgba(125,212,192,0.22)]"
                      : "text-[#7E879A] hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
          <span className="rounded-full border border-[#2A2A2A] bg-black/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#A3ACBE]">
            {language === "es" ? "Equity" : "Equity"}
          </span>
        </div>
      </div>
      <div className="mb-4 h-px w-full bg-gradient-to-r from-[#7DD4C0]/35 via-[#2A2A2A] to-transparent" />

      {error ? (
        <div className="flex h-56 items-center justify-center text-center text-sm text-red-200 sm:h-64">
          {error}
        </div>
      ) : hasAnyEntry ? (
        <div className="h-56 w-full sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="journalEquityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="iso"
                stroke="#3A3F4C"
                tick={{ fill: "#6A6F7E", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#1F232C" }}
                minTickGap={range === "1m" ? 18 : range === "3m" ? 28 : 36}
                tickFormatter={(value: string) => formatEquityAxisLabel(value, language, range)}
              />
              <YAxis
                stroke="#3A3F4C"
                tick={{ fill: "#6A6F7E", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#1F232C" }}
                tickFormatter={(value: number) => formatUsd(value)}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  background: "#0D1015",
                  border: "1px solid #2A2A2A",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#7DD4C0", fontSize: 11, marginBottom: 4 }}
                  labelFormatter={(value: string) => formatEquityTooltipLabel(value, language)}
                formatter={(value: number) => [formatUsd(value), language === "es" ? "PnL acumulado" : "Cumulative PnL"]}
              />
              <Area
                type="monotone"
                dataKey="pnl"
                stroke={lineColor}
                strokeWidth={2}
                fill="url(#journalEquityGradient)"
                dot={false}
                activeDot={{ r: 4, fill: lineColor, stroke: "#0D1015", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : isLoading ? (
        <div className="flex h-56 items-center justify-center text-center text-sm text-[#6A6F7E] sm:h-64">
          {language === "es" ? "Cargando curva..." : "Loading curve..."}
        </div>
      ) : (
        <div className="flex h-56 items-center justify-center text-center text-sm text-[#6A6F7E] sm:h-64">
          {language === "es"
            ? "Cargá entradas en el rango elegido para ver la curva acumulada."
            : "Add entries in the selected range to see the cumulative curve."}
        </div>
      )}
    </div>
  )
}
