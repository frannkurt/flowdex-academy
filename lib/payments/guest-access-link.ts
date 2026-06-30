import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Checkout exprés: si la cuenta del comprador se creó invisible al ordenar
 * (metadata guest_checkout, sin login previo), genera un link de recovery
 * para que elija su contraseña y entre directo desde el email de bienvenida.
 * Devuelve null si la cuenta es normal o si falla la generación (el email
 * de compra sale igual, con el CTA estándar al dashboard).
 */
export async function buildGuestAccessUrl(
  admin: SupabaseClient,
  userId: string,
  email: string
): Promise<string | null> {
  try {
    const { data: authUser } = await admin.auth.admin.getUserById(userId)
    const isGuestAccount =
      authUser?.user?.user_metadata?.guest_checkout === true && !authUser.user.last_sign_in_at

    if (!isGuestAccount) return null

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.flowdex.com.ar").replace(/\/$/, "")
    const { data: linkData } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: `${appUrl}/reset-password` },
    })
    return linkData?.properties?.action_link ?? null
  } catch (error) {
    console.error("[guest-access-link] generation failed", error)
    return null
  }
}
