import type { SupabaseClient } from "@supabase/supabase-js"

// Cuántos días antes de vencer se considera "por vencer" (warning ambar).
// Decisión de Franco: 3 días de aviso previo, suficiente para que renueve
// sin abrir grace period que regale meses de suscripción.
const EXPIRING_SOON_DAYS = 3

export type MembershipStatus =
  | { state: "active"; expiresAt: Date; daysRemaining: number }
  | { state: "expiring_soon"; expiresAt: Date; daysRemaining: number }
  | null

/**
 * Devuelve el estado de la membresía del usuario para mostrar en el dashboard.
 *
 * Estados:
 * - active: faltan más de EXPIRING_SOON_DAYS para vencer
 * - expiring_soon: vence entre 1 y EXPIRING_SOON_DAYS días (advertencia)
 * - null: nunca compró membresía, o ya venció (no hay grace period: vencida
 *   y desaparece, el alumno tuvo 3 días de aviso previo)
 */
export async function getMembershipStatus(
  client: SupabaseClient,
  userId: string
): Promise<MembershipStatus> {
  // Resolver el course_id de "membresia"
  const { data: course } = await client
    .from("courses")
    .select("id")
    .eq("slug", "membresia")
    .maybeSingle()

  if (!course?.id) return null

  const nowIso = new Date().toISOString()

  const { data: userCourse } = await client
    .from("user_courses")
    .select("expires_at")
    .eq("user_id", userId)
    .eq("course_id", course.id)
    .eq("is_active", true)
    .not("expires_at", "is", null)
    .gt("expires_at", nowIso)
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!userCourse?.expires_at) return null

  const expiresAt = new Date(userCourse.expires_at)
  const now = new Date()
  const msInDay = 24 * 60 * 60 * 1000
  const msDelta = expiresAt.getTime() - now.getTime()
  const daysRemaining = Math.ceil(msDelta / msInDay)

  if (daysRemaining > EXPIRING_SOON_DAYS) {
    return { state: "active", expiresAt, daysRemaining }
  }

  if (daysRemaining > 0) {
    return { state: "expiring_soon", expiresAt, daysRemaining }
  }

  // Vencida: no mostramos nada. El alumno tuvo aviso 3 días antes.
  return null
}
