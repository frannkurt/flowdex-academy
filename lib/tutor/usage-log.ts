// Log de uso del tutor IA en Supabase.
//
// Para qué sirve:
// - Auditoría: contrastar consumo real vs facturación de Google.
// - Detección de abuso: ver patrones (mismo user spam, picos raros).
// - Producto: saber qué cursos generan más preguntas, mejorar el material.
//
// Pragmatismo:
// - Best-effort: si falla, no rompe la respuesta al alumno.
// - No guarda el TEXTO de las preguntas (PII + privacidad). Solo metadatos.
// - Si querés debuggear preguntas puntuales, agregar un flag opcional.

import { createClient } from "@supabase/supabase-js"

type LogEntry = {
  userId: string
  courseSlug: string
  promptChars: number
  replyChars: number
  tokensInput?: number
  tokensOutput?: number
  tokensCached?: number
  cacheHit: boolean
  blocked: boolean // true si fue cortado por filtro (jailbreak)
}

// Cliente con service role para evitar problemas con RLS en una tabla de
// auditoría que el usuario no debería poder leer/modificar.
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function logTutorUsage(entry: LogEntry): Promise<void> {
  const client = getAdminClient()
  if (!client) return

  try {
    await client.from("tutor_usage").insert({
      user_id: entry.userId,
      course_slug: entry.courseSlug,
      prompt_chars: entry.promptChars,
      reply_chars: entry.replyChars,
      tokens_input: entry.tokensInput ?? null,
      tokens_output: entry.tokensOutput ?? null,
      tokens_cached: entry.tokensCached ?? null,
      cache_hit: entry.cacheHit,
      blocked: entry.blocked,
    })
  } catch (err) {
    // No rompemos la respuesta al alumno si el log falla.
    console.error("[tutor-usage] log failed:", err)
  }
}
