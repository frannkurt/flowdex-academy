import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { hasTradingJournalAccess } from "@/lib/journal/access"
import { limitBySlidingWindow } from "@/lib/security/rate-limit"
import { hasDistributedRateLimitConfig, isProductionEnvironment } from "@/lib/security/runtime-config"

// Rate limit por user: 60 operaciones cada 5 min.
// Cubre el caso real (alumno edita un dia, navega meses, carga una semana de
// golpe); frena bots que quieran inundar la tabla.
const JOURNAL_WINDOW_MS = 5 * 60 * 1000
const JOURNAL_MAX_PER_USER = 60

// Validacion de notas: maximo 2000 caracteres para evitar abuso de storage.
const NOTES_MAX_LENGTH = 2000
const PNL_MIN = -1_000_000
const PNL_MAX = 1_000_000
const TRADES_MAX = 1000

type JournalEntry = {
  id: string
  entry_date: string
  pnl_usd: number
  trades_count: number
  notes: string | null
  updated_at: string
}

function isValidIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime())
}

async function enforceRateLimit(userId: string) {
  return limitBySlidingWindow({
    key: userId,
    prefix: "journal:user",
    limit: JOURNAL_MAX_PER_USER,
    windowMs: JOURNAL_WINDOW_MS,
  })
}

function rateLimitGuard() {
  if (isProductionEnvironment() && !hasDistributedRateLimitConfig()) {
    return NextResponse.json(
      { error: "Configuracion de seguridad incompleta: falta Upstash Redis para rate limiting." },
      { status: 503 }
    )
  }
  return null
}

// GET /api/journal?from=YYYY-MM-DD&to=YYYY-MM-DD
// Devuelve las entradas del usuario en el rango (inclusive ambos extremos).
// Si no se pasa rango, devuelve los ultimos 90 dias.
export async function GET(request: Request) {
  const limitGuard = rateLimitGuard()
  if (limitGuard) return limitGuard

  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado." }, { status: 500 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 })
  }

  const rateLimit = await enforceRateLimit(user.id)
  if (!rateLimit.success) {
    return NextResponse.json({ error: "Demasiados intentos." }, { status: 429 })
  }

  const hasAccess = await hasTradingJournalAccess(supabase, user.id)
  if (!hasAccess) {
    return NextResponse.json({ entries: [], locked: true })
  }

  const url = new URL(request.url)
  const fromParam = url.searchParams.get("from")
  const toParam = url.searchParams.get("to")

  const today = new Date()
  const defaultFrom = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
  const from = fromParam && isValidIsoDate(fromParam) ? fromParam : defaultFrom.toISOString().slice(0, 10)
  const to = toParam && isValidIsoDate(toParam) ? toParam : today.toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from("journal_entries")
    .select("id, entry_date, pnl_usd, trades_count, notes, updated_at")
    .eq("user_id", user.id)
    .gte("entry_date", from)
    .lte("entry_date", to)
    .order("entry_date", { ascending: true })

  if (error) {
    return NextResponse.json({ error: "No se pudieron leer las entradas." }, { status: 500 })
  }

  return NextResponse.json({
    entries: (data ?? []) as JournalEntry[],
    locked: false,
  })
}

type UpsertBody = {
  entryDate: string
  pnlUsd: number
  tradesCount: number
  notes?: string | null
}

// POST /api/journal
// Upsert de una entrada del dia (unique por user_id + entry_date).
export async function POST(request: Request) {
  const limitGuard = rateLimitGuard()
  if (limitGuard) return limitGuard

  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado." }, { status: 500 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 })
  }

  const rateLimit = await enforceRateLimit(user.id)
  if (!rateLimit.success) {
    return NextResponse.json({ error: "Demasiados intentos." }, { status: 429 })
  }

  const hasAccess = await hasTradingJournalAccess(supabase, user.id)
  if (!hasAccess) {
    return NextResponse.json(
      { error: "Necesitas un curso de Trading activo para usar el Journal." },
      { status: 403 }
    )
  }

  let body: UpsertBody
  try {
    body = (await request.json()) as UpsertBody
  } catch {
    return NextResponse.json({ error: "Payload invalido." }, { status: 400 })
  }

  const { entryDate, pnlUsd, tradesCount, notes } = body

  if (!entryDate || !isValidIsoDate(entryDate)) {
    return NextResponse.json({ error: "Fecha invalida." }, { status: 400 })
  }

  if (typeof pnlUsd !== "number" || Number.isNaN(pnlUsd) || pnlUsd < PNL_MIN || pnlUsd > PNL_MAX) {
    return NextResponse.json({ error: "PnL fuera de rango." }, { status: 400 })
  }

  if (typeof tradesCount !== "number" || !Number.isInteger(tradesCount) || tradesCount < 0 || tradesCount > TRADES_MAX) {
    return NextResponse.json({ error: "Cantidad de trades invalida." }, { status: 400 })
  }

  const normalizedNotes =
    typeof notes === "string" ? notes.trim().slice(0, NOTES_MAX_LENGTH) : null

  const { data, error } = await supabase
    .from("journal_entries")
    .upsert(
      {
        user_id: user.id,
        entry_date: entryDate,
        pnl_usd: pnlUsd,
        trades_count: tradesCount,
        notes: normalizedNotes && normalizedNotes.length > 0 ? normalizedNotes : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,entry_date" }
    )
    .select("id, entry_date, pnl_usd, trades_count, notes, updated_at")
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "No se pudo guardar la entrada." }, { status: 500 })
  }

  return NextResponse.json({ entry: data as JournalEntry })
}

// DELETE /api/journal?entryDate=YYYY-MM-DD
export async function DELETE(request: Request) {
  const limitGuard = rateLimitGuard()
  if (limitGuard) return limitGuard

  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado." }, { status: 500 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 })
  }

  const rateLimit = await enforceRateLimit(user.id)
  if (!rateLimit.success) {
    return NextResponse.json({ error: "Demasiados intentos." }, { status: 429 })
  }

  const hasAccess = await hasTradingJournalAccess(supabase, user.id)
  if (!hasAccess) {
    return NextResponse.json(
      { error: "Necesitas un curso de Trading activo para usar el Journal." },
      { status: 403 }
    )
  }

  const url = new URL(request.url)
  const entryDate = url.searchParams.get("entryDate")

  if (!entryDate || !isValidIsoDate(entryDate)) {
    return NextResponse.json({ error: "Fecha invalida." }, { status: 400 })
  }

  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("user_id", user.id)
    .eq("entry_date", entryDate)

  if (error) {
    return NextResponse.json({ error: "No se pudo borrar la entrada." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
