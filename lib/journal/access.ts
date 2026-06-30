import type { SupabaseClient } from "@supabase/supabase-js"

// Slugs de cursos que habilitan el Journal del trader.
// Decision: el Journal sirve para registro diario de PnL, asi que solo aplica
// a alumnos con algun camino de Trading activo (incluyendo Inner Circle, que
// incluye el modulo de Trading internamente).
export const JOURNAL_ALLOWED_COURSE_SLUGS = [
  "kickstart-trading",
  "trading-lab",
  "inner-circle",
  "inner-circle-trading",
] as const

type UserCourseRow = {
  courses:
    | { slug: string | null }
    | Array<{ slug: string | null }>
    | null
}

function extractSlug(courses: UserCourseRow["courses"]): string | null {
  if (!courses) return null
  if (Array.isArray(courses)) return courses[0]?.slug ?? null
  return courses.slug ?? null
}

/**
 * Devuelve true si el usuario tiene al menos un curso activo (is_active=true
 * y no expirado) entre los slugs que habilitan el Journal.
 *
 * Acepta cualquier supabase client (server, admin, anon con auth). RLS se
 * encarga de filtrar si corresponde.
 */
export async function hasTradingJournalAccess(
  client: SupabaseClient,
  userId: string
): Promise<boolean> {
  if (!userId) return false

  const nowIso = new Date().toISOString()

  const { data, error } = await client
    .from("user_courses")
    .select("courses(slug)")
    .eq("user_id", userId)
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)

  if (error || !data) return false

  const rows = data as UserCourseRow[]
  const allowed = new Set<string>(JOURNAL_ALLOWED_COURSE_SLUGS)

  return rows.some((row) => {
    const slug = extractSlug(row.courses)
    return slug ? allowed.has(slug) : false
  })
}
