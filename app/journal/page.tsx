import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { hasTradingJournalAccess } from "@/lib/journal/access"
import { JournalClient } from "./JournalClient"

export const metadata = {
  title: "Journal del Trader — Flowdex",
  description:
    "Tu Journal personal de trading. Registrá PnL, trades y notas para convertir cada operación en aprendizaje.",
}

export default async function JournalPage() {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    redirect("/login?returnTo=/journal")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?returnTo=/journal")
  }

  const hasAccess = await hasTradingJournalAccess(supabase, user.id)

  return <JournalClient hasAccess={hasAccess} />
}
