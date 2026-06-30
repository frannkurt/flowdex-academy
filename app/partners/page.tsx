import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Flowdex for Partners",
  description:
    "Flowdex for Partners: la propuesta de colaboración de Flowdex para instituciones, universidades, exchanges y medios que quieran llegar al mercado hispanohablante con un estándar a la altura.",
  alternates: { canonical: "/partners" },
  keywords: [
    "Flowdex partners",
    "alianzas educación financiera",
    "partnership educación financiera",
    "educación financiera en español institucional",
  ],
  openGraph: {
    title: "Flowdex for Partners",
    description:
      "No construimos Flowdex para vender más cursos. Lo construimos para elevar el estándar. La propuesta de colaboración para instituciones que comparten esa ambición.",
    type: "article",
    url: "https://flowdex.com.ar/partners",
  },
}

const desarrollos = [
  {
    n: "01",
    title: "Plataforma propia",
    body: "Desarrollada íntegramente de forma interna y preparada para escalar a decenas de miles de alumnos sin perder calidad.",
    accent: "#5BB8D4",
  },
  {
    n: "02",
    title: "Pedagogía en vivo",
    body: "Clases en español, no contenido grabado y olvidado: seguimiento personal, evaluación por módulos y comunidad cuidada.",
    accent: "#7DD4C0",
  },
  {
    n: "03",
    title: "Método estructurado",
    body: "Sistemas y criterios propios que llevan al alumno desde cero hasta operar con un plan claro y disciplina real.",
    accent: "#D4B86A",
  },
  {
    n: "04",
    title: "Una línea ética escrita",
    body: "Una filosofía pública que define con precisión lo que hacemos y lo que no. El estándar antes que la venta.",
    accent: "#5BB8D4",
  },
]

export default function PartnersPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      {/* Ambiente de fondo: glows de la tríada, muy sutiles */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,184,106,0.10),transparent_65%)]" />
        <div className="absolute top-[28%] -right-40 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(91,184,212,0.07),transparent_62%)]" />
        <div className="absolute top-[60%] -left-40 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(125,212,192,0.06),transparent_62%)]" />
        <div className="absolute bottom-0 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_bottom,rgba(212,184,106,0.06),transparent_70%)]" />
      </div>

      <div className="relative z-10 pt-24 sm:pt-28">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden py-12 sm:py-14">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]">
            <Image src="/logo-orbital.svg" alt="" width={560} height={560} className="select-none" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#8FA4AB] hover:text-[#D4B86A] transition-colors mb-9"
            >
              <ArrowLeft size={14} /> Volver al inicio
            </Link>

            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#D4B86A]/70" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#D4B86A]">
                Partnerships
              </p>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#D4B86A]/70" />
            </div>

            <h1 className="type-display-md text-balance leading-[1.05]">
              No construimos Flowdex para vender más cursos. Lo construimos para{" "}
              <span className="text-[#D4B86A]">elevar el estándar.</span>
            </h1>

            <div className="mx-auto mt-8 h-[3px] w-40 rounded-full bg-gradient-to-r from-[#5BB8D4] via-[#7DD4C0] to-[#D4B86A]" />

            <p className="mx-auto mt-8 max-w-2xl text-base sm:text-lg text-[#C4CDD1] leading-relaxed">
              Una mirada a lo que somos y al mercado que representamos, para quienes comparten esa
              ambición.
            </p>
          </div>
        </section>

        {/* ============ QUIÉNES SOMOS ============ */}
        <section className="relative py-8 sm:py-10">
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-[#222] bg-[linear-gradient(180deg,#101216,#0A0B0D)] p-8 sm:p-11">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5BB8D4]/50 to-transparent" />
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-7 bg-[#5BB8D4]/70" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5BB8D4]">
                  Quiénes somos
                </p>
              </div>
              <div className="space-y-4 text-[15px] sm:text-base text-[#B6C0C5] leading-relaxed">
                <p>
                  Flowdex es una compañía de educación financiera para el mundo hispanohablante. Nació de
                  una convicción simple y poco frecuente en el sector: que la formación financiera en
                  español puede tener el mismo rigor, la misma seriedad y el mismo cuidado que la mejor
                  educación del mundo, sin perder la claridad que la vuelve verdaderamente útil.
                </p>
                <p>
                  Todo lo que existe en Flowdex está construido sobre ese principio: la plataforma, el
                  método, las clases en vivo, la comunidad y, sobre todo, una línea ética que no se
                  negocia. No es una academia más; es un intento serio de subir la vara de toda una
                  categoría.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ LO QUE BUSCAMOS ============ */}
        <section className="relative py-8 sm:py-12">
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-7 bg-[#7DD4C0]/70" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7DD4C0]">
                Lo que buscamos
              </p>
            </div>
            <div className="space-y-4 text-[15px] sm:text-base text-[#B8C2C6] leading-relaxed">
              <p>
                Esta página no busca un acuerdo comercial. No nos mueve el ingreso que pueda dejar un
                socio, sino la posibilidad de asociarnos con instituciones cuya trayectoria refuerce el
                trabajo serio, y a las que nosotros, a la vez, podamos aportarles algo genuino.
              </p>
              <p>
                Nos interesa la legitimidad mutua: la clase de colaboración que eleva a las dos partes.
                Una universidad, un exchange, un medio o una institución que comparta el estándar y quiera
                llegar al mercado hispanohablante de una forma que esté a la altura.
              </p>
            </div>
          </div>
        </section>

        {/* ============ LO QUE DESARROLLAMOS ============ */}
        <section className="relative py-10 sm:py-14 overflow-hidden">
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#D4B86A]/70" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D4B86A]">
                Lo que desarrollamos
              </p>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#D4B86A]/70" />
            </div>
            <h2 className="type-display-xs text-white text-center mb-10">Lo que ya está construido.</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {desarrollos.map((item) => (
                <article
                  key={item.n}
                  className="group relative overflow-hidden rounded-2xl border border-[#222] bg-[linear-gradient(180deg,#101216,#0A0B0D)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/15"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px opacity-70"
                    style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }}
                  />
                  <div className="flex items-baseline gap-3 mb-2.5">
                    <span className="text-sm font-bold tabular-nums" style={{ color: item.accent }}>
                      {item.n}
                    </span>
                    <h3 className="type-subheadline text-white">{item.title}</h3>
                  </div>
                  <p className="pl-8 text-sm text-[#A6ACB2] leading-relaxed">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ NUESTRA DIFERENCIA / CÓMO ENSEÑAMOS ============ */}
        <section className="relative py-10 sm:py-14 overflow-hidden">
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-7 bg-[#D4B86A]/70" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D4B86A]">
                Nuestra diferencia
              </p>
            </div>
            <h2 className="type-display-xs text-white mb-6">Lo complejo, explicado para que se entienda.</h2>
            <div className="space-y-4 text-[15px] sm:text-base text-[#B8C2C6] leading-relaxed">
              <p>
                El conocimiento financiero existe, pero casi siempre llega envuelto en tecnicismos. Para
                el hispanohablante promedio eso es una pared: cerca del 70% de los adultos de la región no
                domina conceptos financieros básicos como el interés compuesto, la inflación o la
                diversificación del riesgo. Cuando el material da por sentado lo que la mayoría no tiene,
                no educa: expulsa.
              </p>
              <p>
                A eso se suma un patrón conocido de la educación online: la enorme mayoría de quienes
                empiezan un curso nunca lo termina —las tasas de finalización rondan apenas el 10%—, y una
                de las causas principales es, justamente, contenido que no se entiende.
              </p>
              <p className="text-white">
                La metodología de Flowdex ataca exactamente ese problema. Traducimos lo complejo a un
                lenguaje claro, sin perder rigor, con una pedagogía pensada para quien arranca de cero. No
                bajamos el nivel del contenido: bajamos la barrera de entrada. Es la diferencia entre
                material técnicamente correcto y material que la gente efectivamente termina y aplica.
              </p>
            </div>

            <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative overflow-hidden rounded-2xl border border-[#222] bg-[linear-gradient(180deg,#14110A,#0B0A07)] p-5 text-center">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4B86A]/60 to-transparent" />
                <p className="type-stat-md text-[#D4B86A]">~70%</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-[#9AA7AD] leading-relaxed">
                  de los adultos de la región no domina conceptos financieros básicos
                </p>
                <p className="mt-2 text-[10px] text-[#6A6A6A]">S&amp;P Global FinLit Survey</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-[#222] bg-[linear-gradient(180deg,#0B1413,#070B0A)] p-5 text-center">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7DD4C0]/60 to-transparent" />
                <p className="type-stat-md text-[#7DD4C0]">~10%</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-[#9AA7AD] leading-relaxed">
                  tasa típica de finalización de un curso online: la mayoría abandona
                </p>
                <p className="mt-2 text-[10px] text-[#6A6A6A]">Estudios de educación online (MOOCs)</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ EL MERCADO ============ */}
        <section className="relative overflow-hidden border-y border-[#1A1A1A] bg-[#080808] py-12 sm:py-16 mt-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,184,212,0.05),transparent_70%)]" />

          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-7 bg-[#5BB8D4]/70" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5BB8D4]">
                El mercado que representamos
              </p>
            </div>
            <div className="space-y-4 text-[15px] sm:text-base text-[#B8C2C6] leading-relaxed">
              <p>
                El mundo hispanohablante supera los 600 millones de personas, con un mercado retail en
                plena expansión en Argentina, México y Brasil. Y, sin embargo, la educación estructurada
                —en español, en vivo y sobre los mercados regulados de futuros más relevantes del mundo—
                sigue siendo casi inexistente. Quien busca formarse en serio choca con la barrera del
                idioma apenas supera lo más básico.
              </p>
              <p className="text-lg sm:text-xl text-white font-medium leading-relaxed">
                Ese vacío es, a la vez, el espacio donde trabajamos y una oportunidad que cualquier
                actor serio puede ver. No hace falta señalarla: está ahí.
              </p>
            </div>
          </div>
        </section>

        {/* ============ CÓMO TRABAJAMOS ============ */}
        <section className="relative py-8 sm:py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-[#222] bg-[linear-gradient(180deg,#14110A,#0A0907)] p-8 sm:p-10">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4B86A]/55 to-transparent" />
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-7 bg-[#D4B86A]/70" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D4B86A]">
                  Cómo trabajamos
                </p>
              </div>
              <p className="text-[15px] sm:text-base text-[#B6C0C5] leading-relaxed">
                Sin programas de afiliados. Sin señales. Sin promesas de rentabilidad. El producto por
                encima de la venta. No es una postura de comunicación: está escrito y es público en{" "}
                <Link href="/no-hacemos" className="text-[#D4B86A] underline-offset-4 hover:underline">
                  lo que no hacemos
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* ============ SIN PERDER EL EJE ============ */}
        <section className="relative py-8 sm:py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-7 bg-[#D4B86A]/70" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D4B86A]">
                Sin perder el eje
              </p>
            </div>
            <h2 className="type-display-xs text-white mb-5">
              Una buena alianza potencia, no transforma.
            </h2>
            <p className="text-[15px] sm:text-base text-[#B8C2C6] leading-relaxed">
              Flowdex tiene un eje, una identidad y una forma de hacer las cosas que no están en la mesa
              de negociación. Colaboramos desde lo que somos, no a cambio de dejar de serlo. Una alianza
              que respeta ese eje nos potencia; una que nos pide moverlo, no es para nosotros. Preferimos
              crecer más lento siendo fieles a esto que rápido dejando de serlo.
            </p>
          </div>
        </section>

        {/* ============ CIERRE / CONTACTO ============ */}
        <section className="relative overflow-hidden py-12 sm:py-16">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]">
            <Image src="/logo-orbital.svg" alt="" width={460} height={460} className="select-none" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="type-display-sm text-white text-balance">
              Si compartimos el mismo estándar, la puerta está abierta.
            </h2>
            <div className="mx-auto mt-8 h-[3px] w-28 rounded-full bg-gradient-to-r from-[#5BB8D4] via-[#7DD4C0] to-[#D4B86A]" />
            <a
              href="mailto:flowdexacademy@flowdex.com.ar?subject=Flowdex%20for%20Partners"
              className="mt-9 inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-base font-semibold text-[#0A0A0A] shadow-[0_10px_30px_rgba(212,184,106,0.25)] transition-transform hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #D4B86A, #E2CE92)" }}
            >
              Conversemos
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
