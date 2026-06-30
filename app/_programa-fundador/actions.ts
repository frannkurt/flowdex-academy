"use server"

import { headers } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { limitBySlidingWindow } from "@/lib/security/rate-limit"
import { sendFounderApplicationReceived } from "@/lib/emails/send"

// Server action que recibe el formulario público de /programa-fundador y graba
// la postulación en `founder_applications`. Es público (no requiere login).
// Aplica rate limit por IP para evitar spam.

export type SubmitFounderApplicationState = {
  status: "idle" | "ok" | "error" | "duplicate" | "rate_limited"
  message?: string
  // Echo del payload para que el form pueda re-mostrarlo si hay error
  payload?: Record<string, string | string[]>
}

// Programa cerrado: mismo flag que la página. Poner en true para reabrir.
const PROGRAMA_ABIERTO = false

const PROGRAM_VALUES = new Set(["kickstart-investment", "kickstart-trading", "either"])
const EXPERIENCE_VALUES = new Set(["zero", "some", "intermediate", "advanced"])
const CHAT_VALUES = new Set(["telegram", "discord"])

function clean(value: FormDataEntryValue | null, maxLength?: number): string {
  const raw = String(value ?? "").trim()
  if (maxLength && raw.length > maxLength) {
    return raw.slice(0, maxLength)
  }
  return raw
}

function parseAge(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim()
  if (!raw) return null
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 120) return null
  return Math.trunc(parsed)
}

function parseHours(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim()
  if (!raw) return null
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) return null
  return Math.trunc(parsed)
}

function isValidEmail(email: string): boolean {
  // Regex pragmático, no perfecto. Para validación seria se manda confirmación por email igual.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function submitFounderApplicationAction(
  _prevState: SubmitFounderApplicationState,
  formData: FormData
): Promise<SubmitFounderApplicationState> {
  if (!PROGRAMA_ABIERTO) {
    return { status: "error", message: "Las postulaciones al programa fundador están cerradas." }
  }

  // ── Rate limit por IP: 3 intentos cada 10 minutos ──
  const hdrs = await headers()
  const ipHeader = hdrs.get("x-forwarded-for") ?? hdrs.get("x-real-ip") ?? "unknown"
  const ip = ipHeader.split(",")[0]?.trim() || "unknown"

  const rl = await limitBySlidingWindow({
    key: ip,
    prefix: "founder_application",
    limit: 3,
    windowMs: 10 * 60 * 1000,
  })

  if (!rl.success) {
    return {
      status: "rate_limited",
      message: "Detectamos varios intentos seguidos desde tu conexión. Esperá unos minutos y volvé a intentar.",
    }
  }

  // ── Parseo y validación de campos ──
  const full_name = clean(formData.get("full_name"), 120)
  const email = clean(formData.get("email"), 200).toLowerCase()
  const age = parseAge(formData.get("age"))
  const country = clean(formData.get("country"), 80) || null
  const city = clean(formData.get("city"), 80) || null
  const occupation = clean(formData.get("occupation"), 160) || null
  const program_choice_raw = clean(formData.get("program_choice"), 40)
  const experience_level_raw = clean(formData.get("experience_level"), 30)
  const motivation = clean(formData.get("motivation"), 800)
  const goals_6m = clean(formData.get("goals_6m"), 800)
  const weekly_hours = parseHours(formData.get("weekly_hours"))
  const referral_source = clean(formData.get("referral_source"), 200) || null

  // chat_platforms viene como múltiples valores con mismo name
  const chat_platforms_raw = formData.getAll("chat_platforms").map((v) => String(v).trim())
  const chat_platforms = chat_platforms_raw.filter((v) => CHAT_VALUES.has(v))

  const accepts_feedback = formData.get("accepts_feedback") === "on"
  const accepts_participation = formData.get("accepts_participation") === "on"

  const additional_notes = clean(formData.get("additional_notes"), 1000) || null

  // Validaciones obligatorias
  if (!full_name || full_name.length < 2) {
    return { status: "error", message: "Ingresá tu nombre completo.", payload: Object.fromEntries(formData) as Record<string, string> }
  }
  if (!email || !isValidEmail(email)) {
    return { status: "error", message: "Ingresá un email válido.", payload: Object.fromEntries(formData) as Record<string, string> }
  }
  if (!PROGRAM_VALUES.has(program_choice_raw)) {
    return { status: "error", message: "Elegí un programa al que postularte.", payload: Object.fromEntries(formData) as Record<string, string> }
  }
  if (!EXPERIENCE_VALUES.has(experience_level_raw)) {
    return { status: "error", message: "Elegí tu nivel de experiencia previa.", payload: Object.fromEntries(formData) as Record<string, string> }
  }
  if (!motivation || motivation.length < 40) {
    return { status: "error", message: "Contanos en al menos 40 caracteres por qué querés entrar a Flowdex.", payload: Object.fromEntries(formData) as Record<string, string> }
  }
  if (!goals_6m || goals_6m.length < 30) {
    return { status: "error", message: "Contanos qué esperás lograr en los próximos 6 meses (mínimo 30 caracteres).", payload: Object.fromEntries(formData) as Record<string, string> }
  }
  if (!accepts_feedback || !accepts_participation) {
    return { status: "error", message: "Para postularte tenés que aceptar dar feedback y participar activamente en la comunidad.", payload: Object.fromEntries(formData) as Record<string, string> }
  }

  // ── Insert con service role (la página es pública sin login) ──
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return { status: "error", message: "Error temporal del servidor. Probá de nuevo en unos minutos." }
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { error } = await adminClient
    .from("founder_applications")
    .insert({
      full_name,
      email,
      age,
      country,
      city,
      occupation,
      program_choice: program_choice_raw,
      experience_level: experience_level_raw,
      motivation,
      goals_6m,
      weekly_hours,
      referral_source,
      chat_platforms,
      accepts_feedback,
      accepts_participation,
      additional_notes,
    })

  if (error) {
    // 23505 = unique_violation (email duplicado)
    if (error.code === "23505") {
      return {
        status: "duplicate",
        message: "Ya tenemos una postulación con ese email. Si te equivocaste, escribinos por WhatsApp y la editamos.",
      }
    }
    return {
      status: "error",
      message: "No pudimos registrar tu postulación. Probá de nuevo en unos minutos.",
    }
  }

  // Email de confirmación (best-effort, no bloqueante)
  try {
    await sendFounderApplicationReceived({
      to: email,
      firstName: full_name.split(" ")[0] ?? null,
      programChoice: program_choice_raw as "kickstart-investment" | "kickstart-trading" | "either",
    })
  } catch {
    // No interrumpimos el flujo si el email falla
  }

  return {
    status: "ok",
    message: "Tu postulación quedó registrada. Te avisamos por email el lunes 1 de junio a la mañana.",
  }
}
