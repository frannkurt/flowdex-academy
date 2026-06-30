import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getMembershipStatus } from "@/lib/membership/status"

export async function GET() {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    return Response.json(
      { error: "Not authenticated" },
      { status: 401 }
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json(
      { error: "Not authenticated" },
      { status: 401 }
    )
  }

  const membershipStatus = await getMembershipStatus(supabase, user.id)

  // Serializar las fechas para JSON
  const serializedStatus = membershipStatus
    ? {
        state: membershipStatus.state,
        expiresAt: membershipStatus.expiresAt.toISOString(),
        daysRemaining: membershipStatus.daysRemaining,
      }
    : null

  return Response.json({ status: serializedStatus })
}
