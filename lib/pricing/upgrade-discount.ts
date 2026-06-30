import type { SupabaseClient } from "@supabase/supabase-js"

const UPGRADE_MAP: Record<string, string> = {
  "expert-investment": "kickstart-investment",
  "trading-lab": "kickstart-trading",
}

type UserCourseRow = {
  courses:
    | {
        slug: string | null
      }
    | Array<{ slug: string | null }>
    | null
}

export type UpgradeDiscountResult = {
  applied: boolean
  finalPrice: number
  basePrice: number
  requiredKickstartSlug: string | null
}

function extractSlug(courses: UserCourseRow["courses"]): string {
  if (!courses) return ""
  if (Array.isArray(courses)) return courses[0]?.slug ?? ""
  return courses.slug ?? ""
}

/**
 * Verifica si el usuario tiene el Kickstart correspondiente activo y, si lo
 * tiene, aplica el upgrade usando `courses.discount_price` como precio final.
 *
 * Reglas:
 * - Solo aplica para `expert-investment` (requiere `kickstart-investment` activo)
 *   y `trading-lab` (requiere `kickstart-trading` activo).
 * - "Activo" = `user_courses.is_active = true` AND (`expires_at IS NULL` OR `expires_at > now()`).
 * - Si el curso no tiene `discount_price` seteado (NULL) o el discount_price es
 *   mayor o igual al basePrice, no aplica descuento: el admin tiene control
 *   total desde el panel.
 * - Defensivo: el precio nunca baja de 0.
 */
export async function resolveUpgradeDiscount(
  client: SupabaseClient,
  userId: string,
  courseSlug: string,
  basePrice: number,
  discountPrice: number | null
): Promise<UpgradeDiscountResult> {
  const requiredKickstartSlug = UPGRADE_MAP[courseSlug] ?? null

  if (!requiredKickstartSlug) {
    return {
      applied: false,
      finalPrice: basePrice,
      basePrice,
      requiredKickstartSlug: null,
    }
  }

  // Si el admin no seteo discount_price para este curso, no hay upgrade que
  // aplicar aunque el alumno tenga el Kickstart. Decision explicita: el admin
  // es la fuente de verdad del precio de upgrade.
  if (discountPrice === null || discountPrice <= 0 || discountPrice >= basePrice) {
    return {
      applied: false,
      finalPrice: basePrice,
      basePrice,
      requiredKickstartSlug,
    }
  }

  const nowIso = new Date().toISOString()

  const { data, error } = await client
    .from("user_courses")
    .select("courses(slug)")
    .eq("user_id", userId)
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)

  if (error || !data) {
    return {
      applied: false,
      finalPrice: basePrice,
      basePrice,
      requiredKickstartSlug,
    }
  }

  const rows = data as UserCourseRow[]
  const hasKickstart = rows.some(
    (row) => extractSlug(row.courses) === requiredKickstartSlug
  )

  if (!hasKickstart) {
    return {
      applied: false,
      finalPrice: basePrice,
      basePrice,
      requiredKickstartSlug,
    }
  }

  return {
    applied: true,
    finalPrice: Math.max(discountPrice, 0),
    basePrice,
    requiredKickstartSlug,
  }
}
