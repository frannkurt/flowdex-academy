import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getDeskPack } from "@/lib/payments/desk-packs"
import { DeskCheckoutClient } from "./DeskCheckoutClient"

// Checkout de packs del Desk. Exige sesión: los créditos se acreditan a un
// user_id. Sin login redirige a registro con returnTo de vuelta acá.

export const dynamic = "force-dynamic"

export default async function DeskCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const packId = typeof params.pack === "string" ? params.pack : ""
  const pack = getDeskPack(packId)

  if (!pack) {
    redirect("/desk")
  }

  // Compra sin login: si no hay sesión, el checkout pide email+nombre+teléfono y
  // crea una cuenta invisible (el acceso al Desk llega por email post-pago). Si ya
  // está logueado, la orden se pega a su usuario sin pedir nada.
  const supabase = await createSupabaseServerClient()
  const userResult = supabase ? await supabase.auth.getUser() : null
  const user = userResult?.data.user ?? null

  return <DeskCheckoutClient pack={pack} isGuest={!user} />
}
