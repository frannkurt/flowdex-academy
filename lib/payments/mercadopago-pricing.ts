import { createClient } from "@supabase/supabase-js"
import { resolveCoursePricing } from "@/lib/pricing/course-pricing"
import { isInternalProgressOnlyCourseSlug } from "@/lib/courses/progress-course-config"

type CourseRow = {
  id: string
  slug: string
  name: string
  price: number | string
  discount_price: number | string | null
}

type PromoCodeRow = {
  code: string
  discount_percentage: number | string | null
  discount_amount: number | string | null
  valid_until: string | null
  max_uses: number | null
  current_uses: number | null
  is_active: boolean
}

export type PricingResult = {
  course: {
    id: string
    slug: string
    name: string
  }
  basePrice: number
  finalPrice: number
  upgradeApplied: boolean
  promoApplied: boolean
  promoCodeApplied: string | null
}

const UPGRADE_PATHS: Record<string, string> = {
  "expert-investment": "kickstart-investment",
  "trading-lab": "kickstart-trading",
}

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return value
  }

  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}

export function normalizePromoCode(value: string | null | undefined) {
  return (value ?? "").trim().toUpperCase()
}

export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

async function hasActiveCourseAccess(adminClient: ReturnType<typeof createSupabaseAdminClient>, userId: string, courseSlug: string) {
  if (!adminClient) {
    return false
  }

  const { data: course } = await adminClient
    .from("courses")
    .select("id")
    .eq("slug", courseSlug)
    .maybeSingle()

  if (!course?.id) {
    return false
  }

  const { data: enrollment } = await adminClient
    .from("user_courses")
    .select("user_id")
    .eq("user_id", userId)
    .eq("course_id", course.id)
    .eq("is_active", true)
    .maybeSingle()

  return Boolean(enrollment)
}

function validatePromoCode(promo: PromoCodeRow | null) {
  if (!promo) {
    return { ok: false, error: "Codigo promo no encontrado." }
  }

  if (!promo.is_active) {
    return { ok: false, error: "Codigo promo inactivo." }
  }

  if (promo.valid_until && new Date(promo.valid_until).getTime() < Date.now()) {
    return { ok: false, error: "Codigo promo vencido." }
  }

  const maxUses = promo.max_uses
  const currentUses = promo.current_uses ?? 0

  if (maxUses !== null && currentUses >= maxUses) {
    return { ok: false, error: "Codigo promo sin usos disponibles." }
  }

  return { ok: true, error: null }
}

export async function computeMercadoPagoPricing(params: {
  adminClient: ReturnType<typeof createSupabaseAdminClient>
  courseSlug: string
  userId?: string | null
  promoCode?: string | null
  strictPromo?: boolean
}) {
  const { adminClient, courseSlug, userId, promoCode, strictPromo = true } = params

  if (!adminClient) {
    throw new Error("Supabase service role no configurado.")
  }

  if (isInternalProgressOnlyCourseSlug(courseSlug)) {
    throw new Error("Curso invalido.")
  }

  const { data: course } = await adminClient
    .from("courses")
    .select("id, slug, name, price, discount_price")
    .eq("slug", courseSlug)
    .maybeSingle()

  const courseRow = course as CourseRow | null

  if (!courseRow) {
    throw new Error("Curso invalido.")
  }

  const coursePricing = resolveCoursePricing({
    slug: courseRow.slug,
    basePrice: roundMoney(toNumber(courseRow.price)),
  })

  const basePrice = coursePricing.finalPrice
  let finalPrice = basePrice
  let upgradeApplied = false

  const prerequisiteSlug = UPGRADE_PATHS[courseRow.slug]

  if (prerequisiteSlug && userId) {
    const hasPrerequisite = await hasActiveCourseAccess(adminClient, userId, prerequisiteSlug)

    if (hasPrerequisite && courseRow.discount_price !== null) {
      const discountPrice = roundMoney(toNumber(courseRow.discount_price))

      if (discountPrice > 0 && discountPrice < finalPrice) {
        finalPrice = discountPrice
        upgradeApplied = true
      }
    }
  }

  let promoApplied = false
  let promoCodeApplied: string | null = null

  const normalizedPromoCode = normalizePromoCode(promoCode)

  if (normalizedPromoCode) {
    const { data: promo } = await adminClient
      .from("promo_codes")
      .select("code, discount_percentage, discount_amount, valid_until, max_uses, current_uses, is_active")
      .eq("code", normalizedPromoCode)
      .maybeSingle()

    const promoRow = promo as PromoCodeRow | null
    const promoValidation = validatePromoCode(promoRow)

    if (!promoValidation.ok) {
      if (strictPromo) {
        throw new Error(promoValidation.error ?? "Codigo promo invalido.")
      }
    } else if (promoRow) {
      const percentage = toNumber(promoRow.discount_percentage)
      const amount = toNumber(promoRow.discount_amount)

      if (percentage > 0) {
        finalPrice -= finalPrice * (percentage / 100)
      }

      if (amount > 0) {
        finalPrice -= amount
      }

      finalPrice = Math.max(1, roundMoney(finalPrice))
      promoApplied = true
      promoCodeApplied = promoRow.code
    }
  }

  const result: PricingResult = {
    course: {
      id: courseRow.id,
      slug: courseRow.slug,
      name: courseRow.name,
    },
    basePrice,
    finalPrice,
    upgradeApplied,
    promoApplied,
    promoCodeApplied,
  }

  return result
}

export async function incrementPromoCodeUsage(adminClient: ReturnType<typeof createSupabaseAdminClient>, promoCode: string | null | undefined) {
  if (!adminClient) {
    return
  }

  const normalizedPromoCode = normalizePromoCode(promoCode)

  if (!normalizedPromoCode) {
    return
  }

  const { data: promo } = await adminClient
    .from("promo_codes")
    .select("code, max_uses, current_uses, is_active, valid_until")
    .eq("code", normalizedPromoCode)
    .maybeSingle()

  const promoRow = promo as Pick<PromoCodeRow, "code" | "max_uses" | "current_uses" | "is_active" | "valid_until"> | null

  if (!promoRow || !promoRow.is_active) {
    return
  }

  if (promoRow.valid_until && new Date(promoRow.valid_until).getTime() < Date.now()) {
    return
  }

  const currentUses = promoRow.current_uses ?? 0

  if (promoRow.max_uses !== null && currentUses >= promoRow.max_uses) {
    return
  }

  await adminClient
    .from("promo_codes")
    .update({ current_uses: currentUses + 1 })
    .eq("code", promoRow.code)
}
