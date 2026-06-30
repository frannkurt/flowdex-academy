import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Filosofía Flowdex · Para alumnos",
  description:
    "Documento interno de la filosofía con la que construimos Flowdex. Acceso exclusivo para alumnos.",
  robots: { index: false, follow: false },
}

async function hasConfirmedPurchase(userId: string) {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    return false
  }

  const nowIso = new Date().toISOString()

  const [{ data: activeCourses, error: activeCoursesError }, { data: paidOrders, error: paidOrdersError }] =
    await Promise.all([
      supabase
        .from("user_courses")
        .select("course_id, expires_at")
        .eq("user_id", userId)
        .eq("is_active", true)
        .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
        .limit(1),
      supabase
        .from("orders")
        .select("id")
        .eq("user_id", userId)
        .in("status", ["paid", "completed", "approved"])
        .limit(1),
    ])

  if (activeCoursesError && paidOrdersError) {
    return false
  }

  return Boolean((activeCourses && activeCourses.length > 0) || (paidOrders && paidOrders.length > 0))
}

export default async function FilosofiaLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    redirect("/login?returnTo=/filosofia")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?returnTo=/filosofia")
  }

  const canAccess = await hasConfirmedPurchase(user.id)

  if (!canAccess) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] px-6 text-white sm:px-8">
        <div className="mx-auto max-w-md space-y-6 py-32 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4B86A]">Documento exclusivo</p>
          <h1 className="type-display-sm text-white">Filosofía Flowdex</h1>
          <p className="text-sm leading-relaxed text-[#888888]">
            Este documento se entrega solo a alumnos que ya forman parte de un programa de Flowdex.
            Si todavía no comenzaste tu formación, podés conocer nuestros cursos.
          </p>
          <Link
            href="/courses"
            className="inline-block border border-[#D4B86A] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[#D4B86A] transition hover:bg-[#D4B86A] hover:text-black"
          >
            Ver programas
          </Link>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
