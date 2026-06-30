"use server"

// Server actions de gestión manual del Flowdex Desk desde el /admin:
//   - grantDeskCreditsAction: carga créditos a mano (cortesía / ajuste manual)
//   - setDeskTierAction: asigna plan/tier (trial / founder / admin)
// Convención (igual que user-actions): validar admin, operar con SERVICE_ROLE
// (saltea RLS), registrar TODO en admin_actions (auditoría), y revalidar /admin.

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getDeskPack } from "@/lib/payments/desk-packs"

async function assertAdmin(): Promise<{ adminUserId: string }> {
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/dashboard")
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()
  if (profile?.role !== "admin") redirect("/dashboard")
  return { adminUserId: user.id }
}

function serviceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY no configurada (gestión Desk).")
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

function returnPath(formData: FormData, status?: string) {
  const tab = String(formData.get("returnTab") ?? "desk")
  const params = new URLSearchParams({ tab })
  if (status) params.set("status", status)
  return `/admin?${params.toString()}`
}

async function logAction(
  client: SupabaseClient,
  actorId: string,
  action: string,
  targetUserId: string | null,
  detail: Record<string, unknown>,
) {
  // La auditoría nunca debe tumbar la acción: si falla el log, seguimos.
  try {
    await client.from("admin_actions").insert({
      actor_id: actorId,
      action,
      target_user_id: targetUserId,
      detail,
    })
  } catch {
    // best-effort
  }
}

// ---------- Cargar créditos a mano ----------
export async function grantDeskCreditsAction(formData: FormData) {
  const { adminUserId } = await assertAdmin()

  const targetUserId = String(formData.get("targetUserId") ?? "").trim()
  // Motivo del alta: cortesía/gratis, ajuste manual, o pago no acreditado.
  const rawSource = String(formData.get("source") ?? "cortesia").trim()
  const allowedSources = ["cortesia", "manual", "pago_no_acreditado"]
  const source = allowedSources.includes(rawSource) ? rawSource : "cortesia"
  const months = parseInt(String(formData.get("months") ?? "6"), 10)

  // Si eligió un pack/pase del catálogo, los créditos y días de Radar salen de
  // ahí (no se confía en el cliente). Si no, es alta de créditos sueltos (custom).
  const packId = String(formData.get("pack") ?? "").trim()
  const pack = packId ? getDeskPack(packId) : null
  const customAmount = parseInt(String(formData.get("amount") ?? ""), 10)
  const credits = pack ? pack.credits : customAmount
  const radarDays = pack ? pack.radarDays : 0

  if (!targetUserId || (!pack && (!Number.isFinite(customAmount) || customAmount <= 0))) {
    redirect(returnPath(formData, "desk_credits_error"))
  }

  const client = serviceClient()
  const expires = new Date()
  expires.setMonth(expires.getMonth() + (Number.isFinite(months) ? months : 6))

  // Créditos (si el pack los trae, o si es alta custom).
  if (credits > 0) {
    const { error } = await client.from("desk_credits").insert({
      user_id: targetUserId,
      credits_total: credits,
      credits_used: 0,
      source: pack ? `${source}:${pack.id}` : source,
      expires_at: expires.toISOString(),
    })
    if (error) {
      redirect(returnPath(formData, "desk_credits_error"))
    }
  }

  // Pase del Radar (packs radar* y el Premium): extiende radar_until, sumando
  // al vencimiento vigente si ya tiene uno (mismo criterio que el fulfillment).
  if (radarDays > 0) {
    const { data: entRaw } = await client
      .from("desk_entitlements")
      .select("radar_until, tier")
      .eq("user_id", targetUserId)
      .maybeSingle()
    const ent = entRaw as { radar_until: string | null; tier: string } | null
    const now = new Date()
    const current = ent?.radar_until ? new Date(ent.radar_until) : null
    const base = current && current > now ? current : now
    const radarUntil = new Date(base.getTime() + radarDays * 86400_000)
    await client.from("desk_entitlements").upsert(
      { user_id: targetUserId, tier: ent?.tier ?? "trial", radar_until: radarUntil.toISOString() },
      { onConflict: "user_id" }
    )
  }

  await logAction(client, adminUserId, "desk_grant_product", targetUserId, {
    pack: pack?.id ?? null,
    credits,
    radarDays,
    source,
    months,
  })

  revalidatePath("/admin")
  redirect(returnPath(formData, "desk_credits_ok"))
}

// ---------- Asignar plan / tier ----------
export async function setDeskTierAction(formData: FormData) {
  const { adminUserId } = await assertAdmin()

  const targetUserId = String(formData.get("targetUserId") ?? "").trim()
  const tier = String(formData.get("tier") ?? "").trim()
  const allowed = ["trial", "founder", "admin"]

  if (!targetUserId || !allowed.includes(tier)) {
    redirect(returnPath(formData, "desk_tier_error"))
  }

  const client = serviceClient()
  const { error } = await client
    .from("desk_entitlements")
    .upsert(
      { user_id: targetUserId, tier, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    )

  if (error) {
    redirect(returnPath(formData, "desk_tier_error"))
  }

  await logAction(client, adminUserId, "desk_set_tier", targetUserId, { tier })

  revalidatePath("/admin")
  redirect(returnPath(formData, "desk_tier_ok"))
}

// ---------- Payout: marcar la comisión de un afiliado como pagada ----------
// El pago a afiliados es mensual y manual: esto marca como pagadas TODAS las
// redenciones pendientes del afiliado (commission_paid_at = ahora) y lo asienta
// en auditoría. Recibe affiliateName (o, si no hay nombre, el code del cupón).
export async function markAffiliatePaidAction(formData: FormData) {
  const { adminUserId } = await assertAdmin()

  const affiliateUserId = String(formData.get("affiliateUserId") ?? "").trim()
  const code = String(formData.get("code") ?? "").trim().toUpperCase()
  if (!affiliateUserId && !code) {
    redirect(returnPath(formData, "affiliate_pay_error"))
  }

  const client = serviceClient()
  const now = new Date().toISOString()

  // Filtramos por usuario afiliado (fuente de verdad); si no hay, por código.
  let query = client
    .from("coupon_redemptions")
    .update({ commission_paid_at: now })
    .is("commission_paid_at", null)
    .select("id, commission_usd")
  query = affiliateUserId ? query.eq("affiliate_user_id", affiliateUserId) : query.eq("code", code)

  const { data: updated, error } = await query
  if (error) {
    redirect(returnPath(formData, "affiliate_pay_error"))
  }

  const rows = (updated ?? []) as Array<{ id: string; commission_usd: number }>
  const total = rows.reduce((s, r) => s + Number(r.commission_usd || 0), 0)

  await logAction(client, adminUserId, "affiliate_payout", affiliateUserId || null, {
    affiliate_user_id: affiliateUserId || null,
    code: code || null,
    redemptions_paid: rows.length,
    total_usd: total,
  })

  revalidatePath("/admin")
  redirect(returnPath(formData, "affiliate_pay_ok"))
}
