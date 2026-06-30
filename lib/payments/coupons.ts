import type { SupabaseClient } from "@supabase/supabase-js"

// Lógica central de cupones de afiliado. Un cupón vive en `promo_codes`
// (recicla la tabla de promos existente) y, si tiene `affiliate_name`, además
// de descontar le da comisión a esa persona:
//   - Desk:    20% por defecto (commission_pct_desk), y el comprador suma +2 análisis.
//   - Academy: 5% por defecto (commission_pct_academy).
//
// Uso único: en Desk una sola vez por comprador; en Academy una vez por curso
// (puede reusarlo en otros). El índice único de coupon_redemptions lo garantiza,
// así que registrar la redención es idempotente (clave para los webhooks que
// pueden disparar dos veces por la misma orden).

export const DESK_COUPON_BONUS_CREDITS = 2
const DESK_BONUS_EXPIRY_MONTHS = 3

export type PromoRow = {
  code: string
  is_active: boolean
  valid_until: string | null
  max_uses: number | null
  current_uses: number
  discount_percentage: number | null
  discount_amount: number | null
  affiliate_user_id: string | null
  affiliate_name: string | null
  commission_pct_desk: number
  commission_pct_academy: number
  applies_desk: boolean
  applies_academy: boolean
}

// Aplica el descuento del cupón a un precio (cursos). % primero, si no, fijo.
export function applyCouponDiscount(price: number, promo: PromoRow): number {
  let out = price
  if (promo.discount_percentage && promo.discount_percentage > 0) {
    out = price * (1 - promo.discount_percentage / 100)
  } else if (promo.discount_amount && promo.discount_amount > 0) {
    out = price - promo.discount_amount
  }
  return Math.max(0, Math.round(out * 100) / 100)
}

function normalizeCode(v: unknown): string {
  return typeof v === "string" ? v.trim().toUpperCase() : ""
}

async function fetchPromo(client: SupabaseClient, code: string): Promise<PromoRow | null> {
  const { data } = await client
    .from("promo_codes")
    .select(
      "code, is_active, valid_until, max_uses, current_uses, discount_percentage, discount_amount, affiliate_user_id, affiliate_name, commission_pct_desk, commission_pct_academy, applies_desk, applies_academy"
    )
    .eq("code", code)
    .maybeSingle()
  return (data as PromoRow | null) ?? null
}

function promoIsLive(promo: PromoRow): boolean {
  if (!promo.is_active) return false
  if (promo.valid_until && new Date(promo.valid_until).getTime() < Date.now()) return false
  if (promo.max_uses != null && promo.current_uses >= promo.max_uses) return false
  return true
}

export type CouponCheck =
  | { ok: true; code: string; promo: PromoRow }
  | { ok: false; reason: string }

// Validación liviana al aplicar el cupón en el checkout (no consume nada todavía).
export async function checkCoupon(
  client: SupabaseClient,
  rawCode: string,
  product: "desk" | "academy",
  buyerId: string | null,
  courseSlug?: string | null
): Promise<CouponCheck> {
  const code = normalizeCode(rawCode)
  if (!code) return { ok: false, reason: "Ingresá un cupón." }

  const promo = await fetchPromo(client, code)
  if (!promo) return { ok: false, reason: "Cupón no encontrado." }
  if (!promoIsLive(promo)) return { ok: false, reason: "Cupón inactivo o vencido." }
  if (product === "desk" && !promo.applies_desk) return { ok: false, reason: "Este cupón no aplica al Desk." }
  if (product === "academy" && !promo.applies_academy) return { ok: false, reason: "Este cupón no aplica a cursos." }

  // Uso único ya consumido (si hay comprador identificado).
  if (buyerId) {
    const { data: prior } = await client
      .from("coupon_redemptions")
      .select("id")
      .eq("code", code)
      .eq("buyer_user_id", buyerId)
      .eq("product", product)
      .eq("course_slug", product === "academy" ? courseSlug ?? "" : "")
      .maybeSingle()
    if (prior) return { ok: false, reason: "Ya usaste este cupón acá." }
  }

  return { ok: true, code, promo }
}

// Registra la redención + comisión al acreditarse una compra. Idempotente: si la
// fila ya existe (índice único), no duplica ni vuelve a dar el bonus.
// Devuelve true si fue una redención NUEVA (recién ahí se otorga el +2 del Desk).
export async function recordRedemption(args: {
  client: SupabaseClient
  code: string
  product: "desk" | "academy"
  buyerId: string
  orderRef: string
  amountPaidUsd: number
  courseSlug?: string | null
}): Promise<boolean> {
  const { client, product, buyerId, orderRef, amountPaidUsd } = args
  const code = normalizeCode(args.code)
  if (!code) return false

  const promo = await fetchPromo(client, code)
  if (!promo) return false

  const pct = product === "desk" ? Number(promo.commission_pct_desk) : Number(promo.commission_pct_academy)
  const commission = Math.round(((amountPaidUsd * pct) / 100) * 100) / 100

  const { data: inserted, error } = await client
    .from("coupon_redemptions")
    .insert({
      code,
      affiliate_user_id: promo.affiliate_user_id,
      affiliate_name: promo.affiliate_name,
      buyer_user_id: buyerId,
      product,
      course_slug: product === "academy" ? args.courseSlug ?? null : null,
      order_ref: orderRef,
      amount_paid_usd: amountPaidUsd,
      commission_pct: pct,
      commission_usd: commission,
    })
    .select("id")
    .maybeSingle()

  // 23505 = unique_violation → ya estaba redimido (doble disparo de webhook). No es error.
  if (error) {
    if ((error as { code?: string }).code !== "23505") {
      console.error("[coupons] recordRedemption insert falló", { code, product, orderRef, error })
    }
    return false
  }
  if (!inserted) return false

  // Sumar 1 al contador de usos del cupón (best-effort).
  try {
    await client
      .from("promo_codes")
      .update({ current_uses: (Number(promo.current_uses) || 0) + 1 })
      .eq("code", code)
  } catch {
    /* best-effort */
  }

  return true
}

// Otorga los +2 análisis gratis al comprador de un pack del Desk con cupón.
// Se llama SOLO cuando recordRedemption devolvió true (redención nueva) → idempotente.
export async function grantDeskCouponBonus(
  client: SupabaseClient,
  buyerId: string,
  orderRef: string
): Promise<void> {
  const expires = new Date()
  expires.setMonth(expires.getMonth() + DESK_BONUS_EXPIRY_MONTHS)
  const { error } = await client.from("desk_credits").insert({
    user_id: buyerId,
    credits_total: DESK_COUPON_BONUS_CREDITS,
    credits_used: 0,
    source: "cupon",
    order_ref: orderRef,
    expires_at: expires.toISOString(),
  })
  if (error) {
    console.error("[coupons] grantDeskCouponBonus falló", { buyerId, orderRef, error })
  }
}
