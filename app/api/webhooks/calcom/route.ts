// Webhook receptor de Cal.com.
//
// Cal.com manda un POST con header `X-Cal-Signature-256` que es el HMAC-SHA256
// del body raw, usando como key el secret que Franco configura en el panel de
// Cal (https://cal.com/.../developer/webhooks → campo "Secreto").
//
// Eventos que procesamos:
//   - BOOKING_CREATED       → upsert con status 'confirmed'
//   - BOOKING_RESCHEDULED   → upsert con status 'rescheduled' (Cal reusa el mismo uid)
//   - BOOKING_CANCELLED     → upsert con status 'cancelled'
//
// La métrica que alimenta el dashboard es global (suma de reservas) — no se
// asocia a curso específico porque las clases de Cal cubren cualquier tema y
// no podemos discriminar (decisión cerrada por Franco).
//
// Importante: este endpoint NO toca nada del setup actual de Cal.com (event
// types, ciclo, links). Solo consume los webhooks. Si falla, Cal reintenta.

import { NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

// Forzamos Node runtime (no Edge) porque dependemos de `crypto` con HMAC
// y de la lectura raw del body sin que Edge meta sus transformaciones.
export const runtime = "nodejs"

// Tipado mínimo del payload de Cal.com. Solo modelamos los campos que
// efectivamente leemos; el payload completo se guarda en jsonb para
// poder hacer backfill o sumar campos sin tocar el endpoint.
type CalcomTriggerEvent =
  | "BOOKING_CREATED"
  | "BOOKING_RESCHEDULED"
  | "BOOKING_CANCELLED"
  | "BOOKING_REJECTED"
  | "BOOKING_REQUESTED"

interface CalcomWebhookPayload {
  triggerEvent: CalcomTriggerEvent
  payload?: {
    uid?: string
    bookingId?: number | string
    id?: number | string
    title?: string
    eventTitle?: string
    type?: string
    eventType?: { slug?: string; title?: string } | string
    startTime?: string
    endTime?: string
    status?: string
    attendees?: Array<{ email?: string; name?: string }>
    organizer?: { email?: string; name?: string }
  }
}

// Helper: extraer el booking_id estable que viene de Cal. El nombre del campo
// cambia entre versiones de la API; probamos tres antes de tirar la toalla.
function extractBookingId(p: CalcomWebhookPayload["payload"]): string | null {
  if (!p) return null
  if (p.uid) return String(p.uid)
  if (p.bookingId !== undefined) return String(p.bookingId)
  if (p.id !== undefined) return String(p.id)
  return null
}

function extractEventType(p: CalcomWebhookPayload["payload"]): string | null {
  if (!p) return null
  if (typeof p.eventType === "string") return p.eventType
  if (typeof p.eventType === "object") {
    return p.eventType.slug || p.eventType.title || null
  }
  if (p.type) return p.type
  if (p.eventTitle) return p.eventTitle
  if (p.title) return p.title
  return null
}

function statusForEvent(triggerEvent: CalcomTriggerEvent): string {
  switch (triggerEvent) {
    case "BOOKING_CREATED":
      return "confirmed"
    case "BOOKING_RESCHEDULED":
      return "rescheduled"
    case "BOOKING_CANCELLED":
      return "cancelled"
    case "BOOKING_REJECTED":
      return "rejected"
    case "BOOKING_REQUESTED":
      return "pending"
    default:
      return "confirmed"
  }
}

// Comparación constant-time del HMAC para evitar timing attacks. Si el secret
// no está configurado en el server, rechazamos todo (failing closed).
//
// Cal.com puede mandar la firma en dos formatos según versión del webhook:
//   - Hex puro: "a1b2c3..."
//   - Con prefijo: "sha256=a1b2c3..."
// Normalizamos quitando el prefijo si existe antes de comparar. Sin esto, el
// largo no matchea y rechazamos firmas válidas silenciosamente.
function isValidSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false

  const normalizedSig = signature.startsWith("sha256=") ? signature.slice(7) : signature

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex")

  // timingSafeEqual requiere buffers de igual longitud o tira. Si no
  // coinciden de largo, el HMAC ya no puede matchear: short-circuit a false.
  const sigBuf = Buffer.from(normalizedSig, "utf8")
  const expBuf = Buffer.from(expected, "utf8")
  if (sigBuf.length !== expBuf.length) return false

  return crypto.timingSafeEqual(sigBuf, expBuf)
}

export async function POST(request: Request) {
  const secret = process.env.CALCOM_WEBHOOK_SECRET

  if (!secret) {
    // En dev sin secret configurado conviene fallar visible para que se note.
    // En prod nunca debería pasar (debe estar en Vercel).
    return NextResponse.json(
      { error: "CALCOM_WEBHOOK_SECRET no configurado en el server" },
      { status: 500 }
    )
  }

  // Leemos el body como string crudo para verificar la firma. Si lo parseamos
  // como JSON antes, perdemos los whitespace y la firma no matchea.
  const rawBody = await request.text()
  const signature = request.headers.get("x-cal-signature-256")

  if (!isValidSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let payload: CalcomWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const bookingId = extractBookingId(payload.payload)
  if (!bookingId) {
    // Sin id estable no podemos hacer upsert. Devolvemos 200 para que Cal no
    // reintente (no es problema de Cal, es payload sin lo que necesitamos),
    // pero con flag de ignored para debugging.
    return NextResponse.json({ ok: true, ignored: true, reason: "no booking id" })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Supabase credentials no configuradas" },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const attendee = payload.payload?.attendees?.[0]
  const upsertRow = {
    booking_id: bookingId,
    user_email: attendee?.email ?? payload.payload?.organizer?.email ?? null,
    user_name: attendee?.name ?? payload.payload?.organizer?.name ?? null,
    event_type: extractEventType(payload.payload),
    start_at: payload.payload?.startTime ?? null,
    end_at: payload.payload?.endTime ?? null,
    status: statusForEvent(payload.triggerEvent),
    payload: payload as unknown as Record<string, unknown>,
  }

  const { error } = await supabase
    .from("class_bookings")
    .upsert(upsertRow, { onConflict: "booking_id" })

  if (error) {
    // Devolvemos 500 para que Cal reintente. Loguear con console.error para
    // verlo en los logs de Vercel y no perder visibility del fallo.
    console.error("[calcom-webhook] supabase upsert failed", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ ok: true, bookingId, status: upsertRow.status })
}

// Cal a veces hace un "Prueba Ping" desde el panel que manda GET sin payload.
// Devolvemos 200 para que el botón se marque como passed.
export async function GET() {
  return NextResponse.json({ ok: true, service: "flowdex-calcom-webhook" })
}
