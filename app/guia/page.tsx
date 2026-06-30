import type { Metadata } from "next"
import Link from "next/link"
import {
  BookOpen,
  Users,
  CheckCircle2,
  CalendarClock,
  ClipboardCheck,
  Sparkles,
  Medal,
  TrendingUp,
  MessageCircle,
  RotateCcw,
} from "lucide-react"
import { OrbitalIcon } from "@/components/OrbitalIcon"

// Guía utilitaria interna para alumnos: cómo usar el panel paso a paso.
// No aporta SEO (contenido de uso, no de captación), así que va noindex
// para no diluir el ranking de las páginas comerciales.
export const metadata: Metadata = {
  title: "Guía del alumno",
  description:
    "Cómo usar tu panel de Flowdex paso a paso: filosofía, comunidades, módulos, clases en vivo, exámenes y tutor IA.",
  robots: { index: false, follow: true },
}

// Mapa de pasos para el índice navegable del hero. El acento sigue la triada
// de colores de Flowdex (azul inversión · teal trading · dorado IC/premium).
const STEPS = [
  { n: 1, id: "filosofia", title: "Empezá por la Filosofía", icon: BookOpen, accent: "#D4B86A" },
  { n: 2, id: "comunidades", title: "Entrá a las comunidades", icon: Users, accent: "#7DD4C0" },
  { n: 3, id: "modulos", title: "Avanzá módulo por módulo", icon: CheckCircle2, accent: "#5BB8D4" },
  { n: 4, id: "clases", title: "Agendá tus clases en vivo", icon: CalendarClock, accent: "#7DD4C0" },
  { n: 5, id: "examen", title: "Rendí el examen (opcional)", icon: ClipboardCheck, accent: "#D4B86A" },
  { n: 6, id: "tutor", title: "Apoyate en el Tutor IA", icon: Sparkles, accent: "#5BB8D4" },
  { n: 7, id: "medallas", title: "Sumá tus medallas", icon: Medal, accent: "#D4B86A" },
  { n: 8, id: "siguiente", title: "Subí al siguiente escalón", icon: TrendingUp, accent: "#D4B86A" },
] as const

export default function GuiaPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="pointer-events-none absolute top-24 right-0 h-72 w-72 rounded-full bg-[#7DD4C0]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-[#5BB8D4]/10 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        {/* HERO */}
        <header className="relative overflow-hidden rounded-2xl border border-[#1F1F1F] bg-[linear-gradient(180deg,rgba(15,15,15,0.98),rgba(10,10,10,0.98))] p-6 sm:p-10">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]">
            <OrbitalIcon size={480} animate={false} />
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7DD4C0]/45 to-transparent" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#2A2A2A] px-4 py-2 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:bg-white/5 hover:text-white"
              >
                ← Volver al panel
              </Link>
            </div>

            <p className="mt-7 text-[11px] uppercase tracking-[0.3em] text-[#7DD4C0]">
              Guía del alumno
            </p>
            <h1 className="mt-3 type-display-lg text-white">
              Cómo usar tu panel
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-[#BBBBBB]">
              Un recorrido simple y en orden para sacarle todo el jugo a Flowdex.
              Seguí los pasos de arriba hacia abajo: cada uno se apoya en el
              anterior. No hay apuro — esto es para que sepas exactamente qué
              hacer en cada momento.
            </p>

            {/* Índice navegable de pasos */}
            <nav className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {STEPS.map((step) => {
                const Icon = step.icon
                return (
                  <a
                    key={step.id}
                    href={`#${step.id}`}
                    className="group flex items-center gap-3 rounded-xl border border-[#1F1F1F] bg-[#0C0C0C]/70 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-[#2F2F2F]"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-[13px] font-semibold tabular-nums"
                      style={{
                        color: step.accent,
                        borderColor: `${step.accent}55`,
                        backgroundColor: `${step.accent}12`,
                      }}
                    >
                      {step.n}
                    </span>
                    <span className="min-w-0 flex-1 text-[13.5px] leading-snug text-[#C8C8C8] transition-colors group-hover:text-white">
                      {step.title}
                    </span>
                    <Icon
                      size={16}
                      className="shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
                      style={{ color: step.accent }}
                    />
                  </a>
                )
              })}
            </nav>
          </div>
        </header>

        {/* PASOS */}
        <div className="mt-6 space-y-6">

          {/* ── PASO 1 · FILOSOFÍA ─────────────────────────────────────── */}
          <section
            id="filosofia"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border border-[#D4B86A]/20 bg-[#070707] p-6 sm:p-9"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4B86A]/45 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,184,106,0.08),transparent_55%)]" />
            <div className="pointer-events-none absolute -bottom-24 -right-28 opacity-[0.05]">
              <OrbitalIcon size={420} animate={false} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4B86A]/45 bg-[#D4B86A]/10 text-base font-semibold tabular-nums text-[#D4B86A]">
                  1
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4B86A]">
                    Antes de todo
                  </p>
                  <h2 className="mt-0.5 type-display-sm text-white">
                    Empezá por la Filosofía Flowdex
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
                <p>
                  Antes de abrir el primer módulo, leé la{" "}
                  <span className="text-[#D4B86A]">Filosofía Flowdex</span>. Es la
                  carta donde explicamos cómo trabajamos, qué esperamos de vos y
                  qué podés esperar de nosotros. No es relleno: es el mapa mental
                  con el que vas a recorrer todo lo demás.
                </p>
                <p>
                  Entenderla primero hace que cada clase, cada módulo y cada
                  decisión del método tengan sentido. Te lleva unos minutos y te
                  ahorra horas de andar a ciegas.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/filosofia"
                  className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#E2CB82] via-[#D4B86A] to-[#B8964A] px-6 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#1A1408] transition-all hover:from-[#E8D391] hover:to-[#C2A052] hover:shadow-[0_8px_24px_-6px_rgba(212,184,106,0.45)]"
                >
                  Leer Filosofía Flowdex
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#7A6E50]">
                  <BookOpen size={13} />
                  Unos minutos de lectura · sólo para alumnos
                </span>
              </div>
            </div>
          </section>

          {/* ── PASO 2 · COMUNIDADES ───────────────────────────────────── */}
          <section
            id="comunidades"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border border-[#7DD4C0]/22 bg-[#070707] p-6 sm:p-9"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7DD4C0]/45 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(125,212,192,0.07),transparent_55%)]" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#7DD4C0]/45 bg-[#7DD4C0]/10 text-base font-semibold tabular-nums text-[#7DD4C0]">
                  2
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#7DD4C0]">
                    No estudies solo
                  </p>
                  <h2 className="mt-0.5 type-display-sm text-white">
                    Entrá a Discord y Telegram
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
                <p>
                  En tu panel, abajo de todo, vas a ver la sección{" "}
                  <span className="text-[#7DD4C0]">Acceso a Discord y Telegram</span>.
                  Tocá el botón de cada comunidad: el sistema te asigna{" "}
                  <span className="text-white">automáticamente el rol que te corresponde</span>{" "}
                  y te suma al grupo privado y al canal de tu curso. No tenés que
                  pedirle acceso a nadie ni buscar el link a mano.
                </p>
                <p>
                  Cada curso tiene su propia comunidad: si tenés más de uno, vas
                  a entrar a cada espacio con el rol correcto. Con entrar a uno de
                  los dos —Discord o Telegram— ya estás adentro, y no te vas a
                  perder ninguna clase, porque las elegís vos, el día y el horario
                  que quieras. Igual lo ideal es estar en ambos: ahí ves cuando
                  otro alumno abre un debate o comparte algo que te sirve.
                </p>
              </div>

              <div className="mt-5 rounded-xl border border-[#7DD4C0]/20 bg-[#7DD4C0]/[0.05] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <MessageCircle size={16} className="text-[#7DD4C0]" />
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#7DD4C0]">
                    Para qué sirve la comunidad
                  </p>
                </div>
                <p className="mt-2.5 text-[14px] leading-7 text-[#B6C7C2]">
                  Es tu espacio para estar activo todo el tiempo: preguntá tus
                  dudas, dejá tu opinión, debatí ideas y compartí tus resultados.
                  Mientras más participás, más aprovechás. Nadie acá estudia
                  aislado.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link
                  href="/dashboard#dashboard-comunidad"
                  className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#7DD4C0] px-6 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#0A1A18] transition-all hover:bg-[#9FE0CF] hover:shadow-lg"
                >
                  Ir a mis comunidades
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
                <span className="max-w-xs text-[11px] leading-snug text-[#7A8A86]">
                  Los botones que te asignan el rol están en tu panel: te llevan a
                  Discord y Telegram con el acceso correcto.
                </span>
              </div>
            </div>
          </section>

          {/* ── PASO 3 · MÓDULOS ───────────────────────────────────────── */}
          <section
            id="modulos"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border border-[#5BB8D4]/22 bg-[#070707] p-6 sm:p-9"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5BB8D4]/45 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(91,184,212,0.07),transparent_55%)]" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#5BB8D4]/45 bg-[#5BB8D4]/10 text-base font-semibold tabular-nums text-[#5BB8D4]">
                  3
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#5BB8D4]">
                    El corazón del método
                  </p>
                  <h2 className="mt-0.5 type-display-sm text-white">
                    Avanzá módulo por módulo
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
                <p>
                  Cada curso está dividido en módulos que se leen en orden, de a
                  uno por página. Leé el módulo con calma y, cuando lo terminaste,
                  tocá{" "}
                  <span className="text-white">«Marcar módulo como completado»</span>.
                </p>
                <p>
                  Ese botón es clave: mueve tu barra de progreso, va sumando hacia
                  tus medallas y —sobre todo— es lo que{" "}
                  <span className="text-[#5BB8D4]">habilita tus clases en vivo</span>.
                  Si no marcás los módulos, las clases quedan bloqueadas. Sos vos
                  quien controla tu avance.
                </p>
              </div>

              <ol className="mt-6 space-y-3">
                {[
                  { k: "Leé el módulo completo", v: "Tomá notas de lo que más te resuena y de lo que te genere dudas." },
                  { k: "Marcalo como completado", v: "Recién ahí se desbloquea lo que sigue." },
                  { k: "Repetí con el siguiente", v: "Sin saltarte módulos: cada uno apoya al próximo." },
                ].map((row, i) => (
                  <li
                    key={row.k}
                    className="flex items-start gap-3 rounded-xl border border-[#1F1F1F] bg-[#0C0C0C]/60 px-4 py-3"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#5BB8D4]/40 bg-[#5BB8D4]/10 text-[11px] font-semibold tabular-nums text-[#5BB8D4]">
                      {i + 1}
                    </span>
                    <span className="text-[14px] leading-6 text-[#C8C8C8]">
                      <span className="font-medium text-white">{row.k}.</span>{" "}
                      {row.v}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ── PASO 4 · CLASES EN VIVO ────────────────────────────────── */}
          <section
            id="clases"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border border-[#7DD4C0]/22 bg-[#070707] p-6 sm:p-9"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7DD4C0]/45 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(125,212,192,0.07),transparent_55%)]" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#7DD4C0]/45 bg-[#7DD4C0]/10 text-base font-semibold tabular-nums text-[#7DD4C0]">
                  4
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#7DD4C0]">
                    Donde se acelera todo
                  </p>
                  <h2 className="mt-0.5 type-display-sm text-white">
                    Agendá tus clases en vivo
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
                <p>
                  A medida que vas completando los módulos, dentro del curso se te
                  van habilitando los botones para{" "}
                  <span className="text-[#7DD4C0]">agendar tus clases en vivo</span>.
                  Cada clase pide tener listos ciertos módulos; hasta entonces
                  aparece bloqueada. Elegís día y horario y queda reservada.
                </p>
              </div>

              {/* Regla destacada: estudiar antes de agendar */}
              <div className="mt-5 rounded-xl border border-[#7DD4C0]/30 bg-[#7DD4C0]/[0.06] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#7DD4C0]" />
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#7DD4C0]">
                    Estudiá el módulo antes de la clase
                  </p>
                </div>
                <p className="mt-2.5 text-[14px] leading-7 text-[#B6C7C2]">
                  Llegá a la clase con el módulo estudiado. No hace falta que lo
                  entiendas todo a la perfección: si hay cosas que no te cierran o
                  que no sabés cómo llevar a la práctica, no te preocupes —{" "}
                  <span className="text-white">para eso es la clase</span>. Lo que
                  importa es que llegues con el material leído y estudiado para
                  aprovechar el tiempo en vivo en tus dudas reales.
                </p>
              </div>

              {/* Reprogramar y repetir */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#1F1F1F] bg-[#0C0C0C]/60 p-4">
                  <div className="flex items-center gap-2">
                    <CalendarClock size={15} className="text-[#7DD4C0]" />
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#8FA8A2]">
                      Se pueden reprogramar
                    </p>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-6 text-[#B0B0B0]">
                    Si te surge algo, reprogramá la clase desde el mismo enlace de
                    agenda. Sin dramas.
                  </p>
                </div>
                <div className="rounded-xl border border-[#1F1F1F] bg-[#0C0C0C]/60 p-4">
                  <div className="flex items-center gap-2">
                    <RotateCcw size={15} className="text-[#7DD4C0]" />
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#8FA8A2]">
                      Repetí hasta 3 veces
                    </p>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-6 text-[#B0B0B0]">
                    Si algo no quedó claro, podés volver a tomar la clase del mismo
                    módulo hasta 3 veces. Repetir está bien.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── PASO 5 · EXAMEN ────────────────────────────────────────── */}
          <section
            id="examen"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border border-[#D4B86A]/20 bg-[#070707] p-6 sm:p-9"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4B86A]/45 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,184,106,0.07),transparent_55%)]" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4B86A]/45 bg-[#D4B86A]/10 text-base font-semibold tabular-nums text-[#D4B86A]">
                  5
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4B86A]">
                    Opcional, pero recomendado
                  </p>
                  <h2 className="mt-0.5 type-display-sm text-white">
                    Rendí el examen del módulo
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
                <p>
                  Al final de cada módulo vas a encontrar el botón{" "}
                  <span className="text-[#D4B86A]">«Tomar examen del módulo»</span>.
                  Es <span className="text-white">opcional</span>: no bloquea tu
                  avance ni la clase. Está para que te autoevalúes y confirmes que
                  fijaste lo importante antes de seguir.
                </p>
                <p>
                  Si lo rendís y algo te sale flojo, ya sabés qué repasar y qué
                  llevar a tu clase en vivo. Usalo a tu favor.
                </p>
              </div>
            </div>
          </section>

          {/* ── PASO 6 · TUTOR IA ──────────────────────────────────────── */}
          <section
            id="tutor"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border border-[#5BB8D4]/22 bg-[#070707] p-6 sm:p-9"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5BB8D4]/45 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(91,184,212,0.07),transparent_55%)]" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#5BB8D4]/45 bg-[#5BB8D4]/10 text-base font-semibold tabular-nums text-[#5BB8D4]">
                  6
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#5BB8D4]">
                    Tu ayudante de estudio
                  </p>
                  <h2 className="mt-0.5 type-display-sm text-white">
                    Apoyate en el Tutor IA
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
                <p>
                  Dentro de cada curso, abajo a la derecha, vas a ver el botón{" "}
                  <span className="inline-flex items-center gap-1 text-[#7DD4C0]">
                    <Sparkles size={13} /> Tutor IA
                  </span>. Es un asistente que conoce{" "}
                  <span className="text-white">solo el contenido de ese curso</span>{" "}
                  y te lo explica con tus palabras: pedile que te aclare un
                  concepto, que te dé un ejemplo o que te resuma un módulo.
                </p>
                <p>
                  Es ideal para destrabar dudas rápidas mientras estudiás, sin
                  cortar el ritmo. Para tus dudas más profundas o de cómo aplicar
                  algo, guardá esas para la clase en vivo y la comunidad.
                </p>
              </div>

              <div className="mt-5 rounded-xl border border-[#5BB8D4]/20 bg-[#5BB8D4]/[0.05] px-5 py-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#5BB8D4]">
                  Tené en cuenta
                </p>
                <ul className="mt-2.5 space-y-1.5 text-[13.5px] leading-6 text-[#B0C4CC]">
                  <li>· Responde únicamente sobre el curso en el que estás.</li>
                  <li>· Tiene un límite de uso por día, así que aprovechalo bien.</li>
                  <li>· Puede equivocarse: contrastá siempre con el material y con tu profe.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── PASO 7 · MEDALLAS ──────────────────────────────────────── */}
          <section
            id="medallas"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border border-[#D4B86A]/20 bg-[#070707] p-6 sm:p-9"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4B86A]/45 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,184,106,0.07),transparent_55%)]" />
            <div className="pointer-events-none absolute -bottom-24 -right-28 opacity-[0.05]">
              <OrbitalIcon size={420} animate={false} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4B86A]/45 bg-[#D4B86A]/10 text-base font-semibold tabular-nums text-[#D4B86A]">
                  7
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4B86A]">
                    Tu prueba de avance
                  </p>
                  <h2 className="mt-0.5 type-display-sm text-white">
                    Sumá tus medallas
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
                <p>
                  Cuando completás todos los módulos de un curso, desbloqueás su{" "}
                  <span className="text-[#D4B86A]">credencial digital</span>. La
                  vas a ver en la sección «Tus medallas» del panel, y podés
                  descargarla para compartirla —por ejemplo en LinkedIn— como
                  prueba real de lo que dominás.
                </p>
                <p>
                  Cada medalla es también un escalón: marca que estás listo para
                  el siguiente curso del camino.
                </p>
              </div>
            </div>
          </section>

          {/* ── PASO 8 · SIGUIENTE ESCALÓN ─────────────────────────────── */}
          <section
            id="siguiente"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border border-[#D4B86A]/25 bg-[#070707] p-6 sm:p-9"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4B86A]/45 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,184,106,0.08),transparent_55%)]" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4B86A]/45 bg-[#D4B86A]/10 text-base font-semibold tabular-nums text-[#D4B86A]">
                  8
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4B86A]">
                    El camino continúa
                  </p>
                  <h2 className="mt-0.5 type-display-sm text-white">
                    Subí al siguiente escalón
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-[15px] leading-7 text-[#CCCCCC]">
                <p>
                  Terminar un curso no es el final: es el permiso para subir. Una
                  vez que cerrás tu curso base, avanzás al nivel más avanzado del
                  mismo camino, y desde ahí al{" "}
                  <span className="text-[#D4B86A]">Inner Circle</span>.
                </p>
              </div>

              {/* Escalera visual */}
              <div className="mt-6 grid items-stretch gap-3 sm:grid-cols-3">
                {/* Escalón 1 · Base */}
                <div className="flex flex-col rounded-xl border border-[#1F1F1F] bg-[#0C0C0C]/60 p-5">
                  <div className="flex items-center justify-between">
                    <span className="type-display-xs leading-none text-[#2C2C2C]">01</span>
                    <span className="rounded-full border border-[#5BB8D4]/35 bg-[#5BB8D4]/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-[#5BB8D4]">
                      Base
                    </span>
                  </div>
                  <div className="mt-5 space-y-2.5">
                    <p className="flex items-center gap-2.5 text-[14px] text-[#D4D4D4]">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#5BB8D4]" />
                      Kickstart Investment
                    </p>
                    <p className="flex items-center gap-2.5 text-[14px] text-[#D4D4D4]">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7DD4C0]" />
                      Kickstart Trading
                    </p>
                  </div>
                </div>

                {/* Escalón 2 · Avanzado */}
                <div className="flex flex-col rounded-xl border border-[#1F1F1F] bg-[#0C0C0C]/60 p-5">
                  <div className="flex items-center justify-between">
                    <span className="type-display-xs leading-none text-[#2C2C2C]">02</span>
                    <span className="rounded-full border border-[#7DD4C0]/35 bg-[#7DD4C0]/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-[#7DD4C0]">
                      Avanzado
                    </span>
                  </div>
                  <div className="mt-5 space-y-2.5">
                    <p className="flex items-center gap-2.5 text-[14px] text-[#D4D4D4]">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#5BB8D4]" />
                      Expert Investment
                    </p>
                    <p className="flex items-center gap-2.5 text-[14px] text-[#D4D4D4]">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7DD4C0]" />
                      Trading Lab
                    </p>
                  </div>
                </div>

                {/* Escalón 3 · Cima */}
                <div className="relative flex flex-col overflow-hidden rounded-xl border border-[#D4B86A]/30 bg-[#D4B86A]/[0.05] p-5">
                  <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-[0.07]">
                    <OrbitalIcon size={150} animate={false} />
                  </div>
                  <div className="relative flex items-center justify-between">
                    <span className="type-display-xs leading-none text-[#D4B86A]/30">03</span>
                    <span className="rounded-full border border-[#D4B86A]/55 bg-[#080808] px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-[#D4B86A]">
                      Cima
                    </span>
                  </div>
                  <div className="relative mt-5 flex flex-1 flex-col justify-end">
                    <p className="flex items-center gap-2 text-[15px] font-medium text-[#E8D7A0]">
                      <Medal size={16} className="text-[#D4B86A]" />
                      Inner Circle
                    </p>
                    <p className="mt-1.5 text-[12px] leading-5 text-[#9A8E72]">
                      El acompañamiento más cercano de Flowdex.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[13.5px] leading-7 text-[#9A8E72]">
                El Inner Circle se desbloquea cuando completás un camino entero
                (los dos cursos de inversión o los dos de trading). No hace falta
                terminar los dos caminos: con uno alcanza para entrar.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#E2CB82] via-[#D4B86A] to-[#B8964A] px-6 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#1A1408] transition-all hover:from-[#E8D391] hover:to-[#C2A052] hover:shadow-[0_8px_24px_-6px_rgba(212,184,106,0.45)]"
                >
                  Ir a mi panel
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
                <a
                  href="#filosofia"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-[#2A2A2A] px-5 text-sm text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white"
                >
                  Volver al inicio de la guía
                </a>
              </div>
            </div>
          </section>

        </div>
      </section>
    </main>
  )
}
