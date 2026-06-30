"use server"

// Server actions para gestión de órdenes desde el panel admin.
//
// Regla de oro: NO se borran órdenes pagas ni reembolsadas. Esas filas son
// el histórico contable y se preservan siempre (auditoría, fiscal, cruces
// con Mercado Pago / NOWPayments). Solo se permite eliminar órdenes que
// quedaron colgadas en estados pending / failed / expired — esas no movieron
// caja y nadie las extraña.

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const DELETABLE_ORDER_STATUSES = new Set(["pending", "failed", "expired"])

async function assertAdminOrRedirect() {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    redirect("/dashboard")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }
}

function buildReturnPath(formData: FormData, status?: string) {
  const tab = String(formData.get("returnTab") ?? "ordenes")
  const params = new URLSearchParams({ tab })
  if (status) params.set("status", status)
  return `/admin?${params.toString()}`
}

export async function deleteOrderAction(formData: FormData) {
  await assertAdminOrRedirect()

  const orderId = String(formData.get("orderId") ?? "").trim()
  if (!orderId) {
    redirect(buildReturnPath(formData, "order_delete_error"))
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    redirect(buildReturnPath(formData, "order_delete_error"))
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Doble-check del status antes de borrar. La UI ya esconde el botón para
  // paid/refunded, pero el server action no confía: alguien podría hacer
  // POST directo con un orderId pago. Re-verificamos en la DB.
  const { data: order } = await adminClient
    .from("orders")
    .select("id, status")
    .eq("id", orderId)
    .maybeSingle()

  if (!order) {
    redirect(buildReturnPath(formData, "order_delete_error"))
  }

  if (!DELETABLE_ORDER_STATUSES.has(order.status)) {
    // Intento de borrar paga/refunded — silencioso pero loguea.
    console.warn(
      `[order-actions] intento de borrar orden ${orderId} con status protegido "${order.status}"`
    )
    redirect(buildReturnPath(formData, "order_delete_protected"))
  }

  const { error } = await adminClient.from("orders").delete().eq("id", orderId)

  if (error) {
    console.error("[order-actions] delete failed", error)
    redirect(buildReturnPath(formData, "order_delete_error"))
  }

  revalidatePath("/admin")
  redirect(buildReturnPath(formData, "order_deleted"))
}
