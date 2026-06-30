import { NextResponse } from "next/server"
import { runReengagement } from "@/lib/emails/reengagement"

// Vercel Cron no debe cachear: siempre ejecuta la lógica real.
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Cron diario de re-enganche por email.
 *
 * - Alumnos que entraron y frenaron (≥7 días) → ciclo semanal de 4 mails.
 * - Alumnos que nunca entraron → 2 mails (día 3 y 10 desde el registro).
 *
 * La idempotencia y la secuencia viven en `runReengagement` (tabla
 * engagement_emails). Acá solo autorizamos y delegamos.
 *
 * Manual / debug: `?dryRun=true` calcula a quién le llegaría sin mandar nada.
 */
function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return false
  const authHeader = request.headers.get("authorization") ?? ""
  return authHeader === `Bearer ${cronSecret}`
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const url = new URL(request.url)
  const dryRun = url.searchParams.get("dryRun") === "true"

  const summary = await runReengagement({ dryRun })

  console.log("[reengagement] ejecutado", {
    dryRun: summary.dryRun,
    inactiveSent: summary.inactiveSent,
    neverEnteredSent: summary.neverEnteredSent,
    executedAt: summary.executedAt,
  })

  return NextResponse.json(summary, { status: summary.ok ? 200 : 500 })
}
