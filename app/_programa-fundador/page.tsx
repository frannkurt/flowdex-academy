import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { FounderApplicationForm } from "./FounderApplicationForm"

// Programa cerrado (postulaciones hasta el 30 de mayo de 2026). La página
// queda armada por si reabrimos un programa parecido: poner en true para
// reactivarla tal cual está.
const PROGRAMA_ABIERTO = false

export const metadata: Metadata = {
  title: "Programa Fundador · 20 cuentas | Flowdex",
  description:
    "Abrimos 20 cuentas gratuitas del programa fundador de Flowdex: 10 Kickstart Investment y 10 Kickstart Trading. Postulaciones abiertas hasta el sábado 30 de mayo. No es por orden de llegada — elegimos los 20 perfiles que mejor encajen.",
  alternates: { canonical: "/programa-fundador" },
  openGraph: {
    title: "Programa Fundador · 20 cuentas | Flowdex",
    description:
      "10 cuentas Kickstart Investment + 10 Kickstart Trading. Postulate hasta el 30 de mayo. Elegimos los perfiles que mejor encajen.",
    type: "article",
    url: "https://flowdex.com.ar/programa-fundador",
  },
  // No queremos que indexen esta página específica de campaña hasta que decidamos
  robots: { index: false, follow: true },
}

const PROGRAMS = [
  {
    eyebrow: "Kickstart Investment",
    accent: "#5BB8D4",
    tagline: "Para armar tu primera cartera con criterio, sin haber invertido nunca.",
    learn: [
      "Finanzas personales, colchón de emergencia, deudas, interés compuesto y mentalidad del inversor.",
      "Los seis mercados globales y la diferencia real entre invertir y especular.",
      "Instrumentos: renta fija, renta variable, fondos, derivados y mercado monetario.",
      "Staking, FCIs y CEDEARs: dolarizar y acceder al mercado global desde una cuenta local.",
      "Tu perfil de inversor, leer una empresa por dentro y análisis técnico básico.",
    ],
  },
  {
    eyebrow: "Kickstart Trading",
    accent: "#7DD4C0",
    tagline: "Para operar futuros US con plan y gestión de riesgo desde el día uno.",
    learn: [
      "Qué es el trading, identidad operativa y expectativas reales del primer año.",
      "Análisis técnico aplicado en TradingView y práctica con Paper Trading.",
      "Los instrumentos a fondo: Futuros (MES/MNQ) y Forex — tick, margen y apalancamiento.",
      "Gestión de órdenes, riesgo por trade, stop loss y tamaño de posición.",
      "Journal del trader y la entrada a Prop Firms.",
    ],
  },
]

const RECEIVES = [
    "Comunidad cerrada en Telegram y Discord con asistencia pedagógica.",
  "Clases en vivo grupales con Franco o Augusto, según programa (varios días y horarios).",
  "Tutor IA entrenado con el contenido del curso.",
  "Journal del operador, sistema de exámenes y dashboard de progreso.",
]

const EXPECTATIONS = [
  "Que asistas a las clases en vivo y mantengas presencia en la comunidad.",
  "Que digas lo que pensás, sin filtros, cuando algo no te cierre.",
  "Que respondas las encuestas cortas que vamos a mandar para iterar el producto.",
  "Que te involucres de verdad. Estás entrando como fundador, no como invitado.",
]

export default function ProgramaFundadorPage() {
  if (!PROGRAMA_ABIERTO) {
    redirect("/")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      {/* Glows ambientales. En mobile el blur grande (filtro GPU caro) se
          reemplaza por un radial-gradient estático equivalente. Desktop intacto. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-[#5BB8D4]/8 blur-[120px] max-sm:bg-transparent max-sm:blur-none max-sm:[background-image:radial-gradient(circle,rgba(91,184,212,0.08),transparent_72%)]" />
        <div className="absolute right-[6%] top-[40%] h-80 w-80 rounded-full bg-[#7DD4C0]/8 blur-[140px] max-sm:bg-transparent max-sm:blur-none max-sm:[background-image:radial-gradient(circle,rgba(125,212,192,0.08),transparent_72%)]" />
        <div className="absolute left-1/2 top-[80%] h-72 w-[34rem] -translate-x-1/2 rounded-full bg-[#D4B86A]/8 blur-[150px] max-sm:bg-transparent max-sm:blur-none max-sm:[background-image:radial-gradient(circle,rgba(212,184,106,0.08),transparent_72%)]" />
      </div>

      <div className="relative z-10 pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* ── HERO ── */}
        <section className="px-4 sm:px-6 lg:px-8 relative">
          <div className="pointer-events-none absolute right-[6%] top-0 opacity-[0.08] hidden lg:block">
            <OrbitalIcon size={380} animate={false} />
          </div>

          <div className="max-w-3xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4B86A]/30 bg-[#D4B86A]/8 px-4 py-1.5 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4B86A]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A]">
                Programa fundador · 20 cuentas
              </span>
            </div>

            <h1 className="type-display-lg">
              Postulate al{" "}
              <span className="text-[#D4B86A]">programa fundador</span>{" "}
              de Flowdex.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-[#CCCCCC] leading-relaxed">
              Convocamos a 20 personas para el grupo fundador.{" "}
              <span className="text-white font-semibold">20 cuentas gratuitas</span>:{" "}
              <span className="text-white font-semibold">10 Kickstart Investment</span> y{" "}
              <span className="text-white font-semibold">10 Kickstart Trading</span>.
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[#A0A8AE] leading-relaxed">
              Si no quedás seleccionado, quedás en la lista para futuras promociones y oportunidades.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-[0.2em] text-[#888]">
              <span><span className="text-[#7DD4C0]">Abre</span> · martes 26 mayo</span>
              <span><span className="text-[#D4B86A]">Cierra</span> · sábado 30 mayo, 23:59</span>
              <span><span className="text-[#5BB8D4]">Anuncio</span> · lunes 1 junio</span>
            </div>
          </div>
        </section>

        {/* ── LOS DOS PROGRAMAS ── */}
        <section className="px-4 sm:px-6 lg:px-8 mt-24 sm:mt-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#888]">
                Los dos programas
              </p>
              <h2 className="mt-3 type-display-sm text-white">
                Qué vas a aprender en cada uno.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-[#A0A8AE] leading-relaxed">
                Postulás a uno de los dos. Cada cuenta es el curso completo, con sus clases en vivo y su comunidad.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {PROGRAMS.map((program) => (
                <article
                  key={program.eyebrow}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0E0E0E]/60 p-7 sm:p-8 transition-colors duration-300 hover:border-white/20"
                  style={{ ["--accent" as string]: program.accent }}
                >
                  {/* Glow superior por programa */}
                  <div
                    className="pointer-events-none absolute -top-20 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full opacity-20 blur-[90px] transition-opacity duration-300 group-hover:opacity-40"
                    style={{ background: program.accent }}
                  />
                  {/* Línea de acento superior */}
                  <div
                    className="absolute inset-x-0 top-0 h-px opacity-60"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${program.accent}, transparent)`,
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: program.accent, boxShadow: `0 0 12px ${program.accent}` }}
                      />
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                        style={{ color: program.accent }}
                      >
                        {program.eyebrow}
                      </p>
                    </div>

                    <p className="mt-4 text-base sm:text-lg text-white font-medium leading-snug">
                      {program.tagline}
                    </p>

                    <div className="my-6 h-px w-full bg-white/8" />

                    <ul className="space-y-3">
                      {program.learn.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm text-[#C8C8C8] leading-relaxed"
                        >
                          <span
                            className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full"
                            style={{ background: program.accent }}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUÉ RECIBÍS / QUÉ ESPERAMOS ── */}
        <section className="px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24">
          <div className="max-w-5xl mx-auto grid gap-5 lg:grid-cols-2">
            {/* Qué recibís */}
            <article
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0E0E0E]/60 p-7 sm:p-8 transition-colors duration-300 hover:border-white/20"
            >
              <div
                className="pointer-events-none absolute -top-20 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full opacity-20 blur-[90px] transition-opacity duration-300 group-hover:opacity-40"
                style={{ background: "#7DD4C0" }}
              />
              <div
                className="absolute inset-x-0 top-0 h-px opacity-60"
                style={{ background: "linear-gradient(90deg, transparent, #7DD4C0, transparent)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: "#7DD4C0", boxShadow: "0 0 12px #7DD4C0" }}
                  />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7DD4C0]">
                    Qué recibís
                  </p>
                </div>
                <h2 className="mt-4 type-headline text-white">
                  Acceso completo durante 4 meses.
                </h2>
                <div className="my-6 h-px w-full bg-white/8" />
                <ul className="space-y-3">
                  {RECEIVES.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#C8C8C8] leading-relaxed">
                      <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#7DD4C0]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {/* Qué esperamos */}
            <article
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0E0E0E]/60 p-7 sm:p-8 transition-colors duration-300 hover:border-white/20"
            >
              <div
                className="pointer-events-none absolute -top-20 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full opacity-20 blur-[90px] transition-opacity duration-300 group-hover:opacity-40"
                style={{ background: "#D4B86A" }}
              />
              <div
                className="absolute inset-x-0 top-0 h-px opacity-60"
                style={{ background: "linear-gradient(90deg, transparent, #D4B86A, transparent)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: "#D4B86A", boxShadow: "0 0 12px #D4B86A" }}
                  />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A]">
                    Qué esperamos de vos
                  </p>
                </div>
                <h2 className="mt-4 type-headline text-white">
                  Que te tomes el camino en serio.
                </h2>
                <div className="my-6 h-px w-full bg-white/8" />
                <ul className="space-y-3">
                  {EXPECTATIONS.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#C8C8C8] leading-relaxed">
                      <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4B86A]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </section>

        {/* ── FORMULARIO ── */}
        <section className="px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-3">
                Formulario de postulación
              </p>
              <h2 className="type-display-sm text-white">
                Contanos quién sos.
              </h2>
              <p className="mt-3 text-sm text-[#888] max-w-md mx-auto leading-relaxed">
                Vamos a leer cada postulación. Respondé con honestidad — eso es lo que mejor te posiciona.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0E0E0E]/80 p-6 sm:p-8 transition-colors duration-300 hover:border-white/20">
              <div
                className="pointer-events-none absolute -top-24 left-1/2 h-56 w-96 -translate-x-1/2 rounded-full opacity-15 blur-[100px]"
                style={{ background: "#D4B86A" }}
              />
              <div
                className="absolute inset-x-0 top-0 h-px opacity-60"
                style={{ background: "linear-gradient(90deg, transparent, #D4B86A, transparent)" }}
              />
              <div className="relative">
                <FounderApplicationForm />
              </div>
            </div>
          </div>
        </section>

        {/* ── CIERRE ── */}
        <section className="px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm sm:text-base text-[#888] leading-relaxed">
              Cualquier duda concreta, escribinos por{" "}
              <a
                href="https://wa.me/message/WD3RGNGTSPFYA1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7DD4C0] hover:text-white underline underline-offset-2 transition-colors"
              >
                WhatsApp
              </a>
              . Te contestamos rápido.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
