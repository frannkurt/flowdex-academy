import Link from "next/link"
import { redirect } from "next/navigation"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { ProtectedContent } from "@/components/ProtectedContent"
import { InnerCircleTradingContent } from "@/components/courses/InnerCircleTradingContent"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function InnerCircleTradingPage() {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    redirect("/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", "inner-circle")
    .maybeSingle()

  if (!course) {
    redirect("/dashboard")
  }

  const { data: purchase } = await supabase
    .from("user_courses")
    .select("user_id, expires_at")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .maybeSingle()

  if (!purchase) {
    redirect("/dashboard?error=acceso_vencido")
  }

  const accessExpiresAt = purchase.expires_at
    ? new Date(purchase.expires_at).toLocaleDateString("es-AR")
    : null
  const accessExpiresLabel = accessExpiresAt ?? "12 meses desde activacion"

  const currentYear = new Date().getFullYear()

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <OrbitalIcon size={800} animate priority />
      </div>

      <ProtectedContent year={currentYear}>
      <section id="curso-top" className="relative z-10 mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-2xl border border-[#1E1E1E] bg-[#111111]/80 p-6 backdrop-blur-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#7DD4C0]">Disciplina Inner Circle</p>
              <h1 className="mt-2  text-4xl tracking-tight sm:text-5xl">Inner Circle · Trading</h1>
              <p className="mt-3 max-w-2xl text-sm text-[#AAAAAA]">
                Sistema de ejecución profesional en futuros: setup ORB, contexto de mercado, noticias y gestión de riesgo aplicada.
              </p>
            </div>
            <div className="shrink-0 rounded-xl border border-[#7DD4C0]/20 bg-[#7DD4C0]/5 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-widest text-[#7DD4C0]">Acceso</p>
              <p className="mt-1 text-sm font-semibold text-white">Activo ✓</p>
              <p className="mt-1 text-xs text-[#A8DAD0]">Vence: {accessExpiresLabel}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {/* Volver siempre al hub del IC (su propio dashboard interno).
                La salida al dashboard general vive en el hub: un click más,
                a propósito, para no sacar al alumno del Inner Circle. */}
            <Link
              href="/courses/inner-circle"
              className="inline-flex w-full items-center justify-center rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white sm:w-auto"
            >
              ← Inner Circle
            </Link>
          </div>
        </div>

        <div className="mb-10 rounded-2xl border border-[#1E1E1E] bg-[#111111]/80 p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#7DD4C0]">Guía de estudio</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Secuencia</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#BBBBBB]">Los módulos son progresivos: setup, ejecución, contexto, noticias y riesgo.</p>
            </div>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Aplicación</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#BBBBBB]">No avances sin journal operativo. Cada módulo requiere evidencia práctica en mercado real o replay.</p>
            </div>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Objetivo</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#BBBBBB]">Cerrar la disciplina con un protocolo ejecutable, medible y sostenible en el tiempo.</p>
            </div>
          </div>
        </div>

        <InnerCircleTradingContent />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#curso-top"
            className="inline-flex w-full items-center justify-center rounded-lg border border-[#5BB8D4]/45 bg-gradient-to-r from-[#5BB8D4]/25 to-[#7DD4C0]/25 px-6 py-3 text-sm font-medium text-[#DDF7F1] transition-colors hover:border-[#7DD4C0]/65 hover:text-white sm:w-auto"
          >
            ↑ Inicio del curso
          </a>
          <Link
            href="/courses/inner-circle"
            className="inline-flex w-full items-center justify-center rounded-lg border border-[#2A2A2A] px-6 py-3 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white sm:w-auto"
          >
            ← Inner Circle
          </Link>
        </div>

        <div className="mt-10 rounded-xl border border-[#D4B86A]/20 bg-[#1A1408]/40 px-4 py-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4B86A]/80">
            © Flowdex {currentYear} — Material protegido por Ley 11.723
          </p>
          <p className="mt-1 text-[10px] text-[#9A8E6E]">
            Reproducción, distribución o uso comercial no autorizado de este contenido está expresamente prohibido.{" "}
            <Link href="/legal/propiedad-intelectual" className="text-[#D4B86A] hover:text-[#E6DAB6] underline-offset-2 hover:underline">
              Aviso de Propiedad Intelectual
            </Link>
          </p>
        </div>
      </section>
      </ProtectedContent>
    </main>
  )
}
