import Link from "next/link"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { ProtectedContent } from "@/components/ProtectedContent"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { KickstartInvestmentContent } from "@/components/courses/KickstartInvestmentContent"
import { ExpertInvestmentContent } from "@/components/courses/ExpertInvestmentContent"
import { KickstartTradingContent } from "@/components/courses/KickstartTradingContent"
import { TradingLabContent } from "@/components/courses/TradingLabContent"
import { InnerCircleContent } from "@/components/courses/InnerCircleContent"
import { CourseTutor } from "@/components/CourseTutor"
import { isCourseTutorSupported } from "@/lib/tutor/course-context"

type CoursePageParams = {
  params: Promise<{
    slug: string
  }>
}

export default async function CourseDetailPage({ params }: CoursePageParams) {
  const { slug } = await params
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

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, name, description, price, slug")
    .eq("slug", slug)
    .maybeSingle()

  if (courseError || !course) {
    notFound()
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
  const fallbackAccessBySlug: Record<string, string> = {
    "kickstart-investment": "4 meses desde activacion",
    "expert-investment": "4 meses desde activacion",
    "kickstart-trading": "4 meses desde activacion",
    "trading-lab": "4 meses desde activacion",
  }
  const accessExpiresLabel = accessExpiresAt ?? fallbackAccessBySlug[slug] ?? "Sin vencimiento"

  const currentYear = new Date().getFullYear()

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <OrbitalIcon size={800} animate priority />
      </div>

      <ProtectedContent year={currentYear}>
      <section id="curso-top" className="relative z-10 mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 rounded-2xl border border-[#1E1E1E] bg-[#111111]/80 backdrop-blur-sm p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#7DD4C0]">Contenido del curso</p>
              <h1 className="mt-2  text-4xl tracking-tight sm:text-5xl">{course.name}</h1>
              <p className="mt-3 max-w-2xl text-sm text-[#AAAAAA]">{course.description}</p>
            </div>
            <div className="shrink-0 rounded-xl border border-[#7DD4C0]/20 bg-[#7DD4C0]/5 px-4 py-3 text-center">
              <p className="text-xs text-[#7DD4C0] uppercase tracking-widest">Acceso</p>
              <p className="mt-1 text-sm font-semibold text-white">Activo ✓</p>
              <p className="mt-1 text-xs text-[#A8DAD0]">
                Vence: {accessExpiresLabel}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white sm:w-auto"
            >
              ← Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#5BB8D4]/60 hover:text-white sm:w-auto"
            >
              Ir al inicio
            </Link>
          </div>
        </div>

        {(slug === "kickstart-investment" || slug === "expert-investment" || slug === "kickstart-trading" || slug === "trading-lab") && (
          <div className="mb-10 rounded-2xl border border-[#1E1E1E] bg-[#111111]/80 p-5 sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#7DD4C0]">Docente del curso</p>
            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#0E0E0E] sm:h-28 sm:w-28">
                <Image
                  src={slug === "kickstart-trading" || slug === "trading-lab" ? "/francoblancoynegro.jpg" : "/augustoblancoynegro.jpg"}
                  alt={slug === "kickstart-trading" || slug === "trading-lab" ? "Franco Escudero" : "Augusto Holman"}
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  className="object-cover object-center"
                />
              </div>
              <div className="flex-1">
                <h2 className=" text-3xl tracking-tight text-white sm:text-4xl">
                  {slug === "kickstart-trading" || slug === "trading-lab" ? "Franco Escudero" : "Augusto Holman"}
                </h2>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#6FA0B0]">
                  {slug === "kickstart-trading"
                    ? "Trader profesional de futuros (mercados de CME Group)"
                    : slug === "trading-lab"
                    ? "Laboratorio operativo de trading"
                    : "Director de Inversiones"}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#C8C8C8]">
                  {slug === "kickstart-trading"
                    ? "Diseño metodologías simples y replicables para formar traders con criterio propio y resultados sostenibles en el tiempo."
                    : slug === "trading-lab"
                    ? "En Trading Lab trabajamos sesiones aplicadas con escenarios reales, ejecución disciplinada y feedback concreto para mejorar consistencia y toma de decisiones bajo presión."
                    : slug === "expert-investment"
                    ? "Especialista en asset allocation, análisis fundamental y gestión de riesgo. En Expert Investment, Augusto profundiza en metodología profesional para evaluar activos, construir estrategia y ejecutar decisiones con foco en consistencia y preservación de capital."
                    : "Especialista en asset allocation, análisis fundamental y gestión de riesgo. En este programa Augusto te guía paso a paso para convertir fundamentos financieros en decisiones de inversión claras, medibles y sostenibles, con foco en disciplina operativa y construcción de patrimonio de largo plazo."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-10 rounded-2xl border border-[#1E1E1E] bg-[#111111]/80 p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#7DD4C0]">Guía del programa</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Bienvenida al programa</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#BBBBBB]">
                Este curso esta disenado para ayudarte a tomar decisiones con criterio, metodo y consistencia. Avanza
                paso a paso, consolidando fundamentos antes de pasar a los temas avanzados.
              </p>
            </div>

            <div className="rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Cómo usar este curso</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-[#BBBBBB]">
                <li>1. Avanza por modulos en orden y marca cada uno como completado.</li>
                <li>2. Toma notas clave de cada clase y registra tus dudas.</li>
                <li>3. Agenda clase cuando el modulo requerido este completado.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Course content */}
        {slug === "kickstart-investment" && <KickstartInvestmentContent />}
        {slug === "expert-investment" && <ExpertInvestmentContent />}
        {slug === "kickstart-trading" && <KickstartTradingContent />}
        {slug === "trading-lab" && <TradingLabContent />}
        {slug === "inner-circle" && <InnerCircleContent />}

        {/* Bottom nav */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#curso-top"
            className="inline-flex w-full items-center justify-center rounded-lg border border-[#5BB8D4]/45 bg-gradient-to-r from-[#5BB8D4]/25 to-[#7DD4C0]/25 px-6 py-3 text-sm font-medium text-[#DDF7F1] transition-colors hover:border-[#7DD4C0]/65 hover:text-white sm:w-auto"
          >
            ↑ Inicio del curso
          </a>
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center rounded-lg border border-[#2A2A2A] px-6 py-3 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white sm:w-auto"
          >
            ← Dashboard
          </Link>
        </div>

        {/* IP footer */}
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

      {isCourseTutorSupported(slug) && (
        <CourseTutor courseSlug={slug} courseName={course.name} />
      )}
    </main>
  )
}
