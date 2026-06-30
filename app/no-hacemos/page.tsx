import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { OrbitalIcon } from "@/components/OrbitalIcon"

export const metadata: Metadata = {
  title: "Lo que no hacemos: Manifiesto de Flowdex",
  description:
    "Manifiesto público de Flowdex: no vendemos señales, no usamos afiliados, no fabricamos urgencia, no prometemos rentabilidades. Las decisiones de no-hacer que definen una academia de trading e inversión honesta.",
  alternates: { canonical: "/no-hacemos" },
  keywords: [
    "academia de trading honesta",
    "no señales de trading",
    "academia sin afiliados",
    "manifiesto Flowdex",
    "educación financiera transparente",
  ],
  openGraph: {
    title: "Lo que no hacemos | Manifiesto de Flowdex",
    description:
      "Las decisiones de no-hacer que sostienen una academia de trading e inversión honesta. No señales, no afiliados, no urgencia, no promesas.",
    type: "article",
    url: "https://flowdex.com.ar/no-hacemos",
  },
}

const declaraciones = [
  {
    number: "01",
    title: "No tenemos programa de afiliados.",
    body: "Si alguien te recomienda Flowdex, lo hace por convicción. No hay comisión por traerte. Eso filtra la recomendación desde el origen: solo llega de quien tuvo experiencia real con el material y decidió, por su cuenta, que valía la pena pasarlo. Lo opuesto del modelo del rubro, donde el incentivo de vender se confunde con el incentivo de enseñar.",
  },
  {
    number: "02",
    title: "No vendemos señales.",
    body: "Las señales generan dependencia, no criterio. Si te decimos qué operar, te quitamos exactamente lo que vinimos a darte: la capacidad de leer el mercado por vos mismo y decidir con cabeza propia. Cuando termines un curso, vas a saber por qué hacés lo que hacés. No vas a esperar que alguien te avise.",
  },
  {
    number: "03",
    title: "No competimos por SEO ni publicidad pagada.",
    body: "Crecemos lento, por método y por recomendación. El que llega acá llega porque alguien le habló, porque buscó algo serio y lo encontró, o porque leyó algo que le hizo click. No porque un algoritmo le tiró un anuncio. Es más caro de construir y más resistente en el tiempo, pero es la única forma honesta de que la marca diga la verdad sobre lo que entrega.",
  },
  {
    number: "04",
    title: "No prometemos rentabilidad.",
    body: "Cualquiera que te prometa porcentajes mensuales o te diga cuánto vas a ganar te está mintiendo, o no entiende lo que enseña. Nosotros vendemos método, criterio, disciplina y herramientas. El resultado financiero depende de vos, del mercado y de cómo aplicás lo aprendido durante meses. Esa honestidad puede asustar al impulsivo. Es exactamente el filtro que buscamos.",
  },
  {
    number: "05",
    title: "No tenemos descuentos relámpago ni urgencia fabricada.",
    body: "No vas a ver contadores artificiales, frases tipo 'últimas tres plazas' que duran tres semanas, ni precios que vuelven a subir mágicamente cuando vence un timer. Los precios cambian cuando cambia la realidad del producto (más contenido, más capacidad, más equipo), no cuando un script de marketing te aprieta para decidir hoy. Si necesitamos manipular tu sentido del tiempo para vender, vendemos mal.",
  },
  {
    number: "06",
    title: "No copiamos el formato de los gurúes.",
    body: "Ni testimonios sin nombre que pueden ser de cualquiera, ni capturas selectivas de cuentas que no se pueden verificar, ni fotos de autos prestados, ni ostentación de bienes ajenos. El estatus de marca no se compra con accesorios. Lo que mostramos, lo mostramos completo y verificable. Lo que no se puede mostrar honestamente, no se muestra.",
  },
  {
    number: "07",
    title: "No vendemos cursos que no haríamos nosotros mismos.",
    body: "Cada material del catálogo es el que aplicamos en nuestra operativa diaria. Las estrategias técnicas son las que usamos. Los indicadores son los que tenemos en nuestros propios charts. El método de portafolio es el que sostiene nuestras decisiones de capital. Si dejáramos de usarlo, lo bajaríamos del catálogo. Vender lo que vos mismo no usás es la línea más fácil de cruzar y la más difícil de revertir.",
  },
]

const preguntasNo = [
  "¿Suena a gurú?",
  "¿Promete sin exigir compromiso del alumno?",
  "¿Baja la barra para escalar más rápido?",
  "¿Engaña al alumno, aunque sea sutilmente?",
]

const preguntasSi = [
  "¿Eleva el método?",
  "¿Dignifica al alumno?",
  "¿Hace a Flowdex superior, no solo más grande?",
]

export default function NoHacemosPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,184,106,0.08),transparent_65%)]" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(125,212,192,0.06),transparent_62%)]" />
        <div className="absolute bottom-0 -left-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(91,184,212,0.06),transparent_62%)]" />
      </div>

      <div className="relative z-10 pt-24 sm:pt-28">
        {/* HERO */}
        <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
          <div className="pointer-events-none absolute right-[8%] top-12 opacity-[0.05] hidden lg:block">
            <OrbitalIcon size={420} animate={false} />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#8FA4AB] hover:text-[#D4B86A] transition-colors mb-8"
            >
              <ArrowLeft size={14} /> Volver al inicio
            </Link>

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#D4B86A]">
              Decisiones de no-hacer
            </p>
            <h1 className="type-display-lg">
              LO QUE NO HACEMOS.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-[#CCCCCC] leading-relaxed">
              Las decisiones que nos definen están escritas en negativo. Acá las dejamos públicas
              para que cualquiera las pueda chequear contra lo que ofrecemos.
            </p>
          </div>
        </section>

        {/* INTRO: POR QUÉ DEJARLO PÚBLICO */}
        <section className="py-10 sm:py-14 relative overflow-hidden">
          <div className="pointer-events-none absolute -left-32 top-12 opacity-[0.04] hidden lg:block">
            <OrbitalIcon size={360} animate={false} />
          </div>

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-[#2A2A2A] bg-[linear-gradient(180deg,#101010,#0A0A0A)] p-7 sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-4">
                Por qué dejamos esto público
              </p>
              <h2 className="type-display-sm text-white mb-5">
                Las decisiones de no-hacer pesan tanto como las que sí tomamos.
              </h2>
              <div className="space-y-4 text-[15px] sm:text-base text-[#B0B0B0] leading-relaxed">
                <p>
                  En el rubro hay un manual conocido: testimonios anónimos, escasez fabricada, promesas
                  de retorno, afiliados que se llenan los bolsillos por recomendar. Es eficaz a corto plazo
                  y deja huella a largo plazo. Nosotros elegimos otro camino, y cada decisión de no-hacer
                  pasó por un filtro interno antes de quedar firme.
                </p>
                <p>
                  Hacerlo público tiene un costo: pierde flexibilidad para el día que la tentación llegue
                  fuerte. Y tiene un beneficio: el alumno puede medirnos contra nuestras propias palabras.
                  Si en algún momento traicionamos alguna de estas declaraciones, la página queda como
                  evidencia. Es exactamente el incentivo correcto.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DECLARACIONES */}
        <section className="py-8 sm:py-12 relative overflow-hidden">
          <div className="pointer-events-none absolute right-[5%] top-[20%] opacity-[0.03] hidden lg:block">
            <OrbitalIcon size={520} animate={false} />
          </div>

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-3 sm:space-y-4">
              {declaraciones.map((decl) => (
                <article
                  key={decl.number}
                  className="rounded-2xl border border-[#2A2A2A] bg-[linear-gradient(180deg,#111111,#0A0A0A)] p-5 sm:p-7 hover:border-[#D4B86A]/30 transition-colors"
                >
                  <div className="flex items-baseline gap-3 sm:gap-4 mb-3">
                    <span className="font-[var(--font-mono)] text-sm sm:text-base font-bold text-[#D4B86A] tabular-nums leading-none flex-shrink-0">
                      {decl.number}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-[#D4B86A]/30 to-transparent self-center" />
                    <h2 className="type-headline text-white">
                      {decl.title}
                    </h2>
                  </div>
                  <p className="text-[14px] sm:text-[15px] text-[#A8A8A8] leading-relaxed">
                    {decl.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* LAS SIETE PREGUNTAS */}
        <section className="py-16 sm:py-20 bg-[#080808] border-y border-[#1F1F1F] mt-12 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-32 top-12 opacity-[0.04]">
            <OrbitalIcon size={560} animate={false} />
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-3">
                Cómo filtramos cada decisión
              </p>
              <h2 className="type-display-md text-white">
                Las siete preguntas que pasan antes de un sí.
              </h2>
              <p className="mt-5 text-sm sm:text-base text-[#888888] max-w-2xl mx-auto leading-relaxed">
                Cada producto, cada cambio de precio, cada acción de marketing, cada feature nueva pasa por estas
                siete preguntas internas. Cuatro tienen que dar NO. Tres tienen que dar SÍ. Si alguna falla, no
                avanza.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-[#2A2A2A] bg-[#0E0E0E] p-6 sm:p-7">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#5BB8D4] font-semibold mb-5">
                  Tienen que responderse NO
                </p>
                <ul className="space-y-4">
                  {preguntasNo.map((pregunta, index) => (
                    <li key={pregunta} className="flex items-start gap-4">
                      <span className="font-[var(--font-mono)] text-sm text-[#5BB8D4]/70 flex-shrink-0 mt-1">
                        0{index + 1}
                      </span>
                      <span className="text-[15px] sm:text-base text-[#D8D8D8] leading-relaxed">{pregunta}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[#2A2A2A] bg-[#0E0E0E] p-6 sm:p-7">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#7DD4C0] font-semibold mb-5">
                  Tienen que responderse SÍ
                </p>
                <ul className="space-y-4">
                  {preguntasSi.map((pregunta, index) => (
                    <li key={pregunta} className="flex items-start gap-4">
                      <span className="font-[var(--font-mono)] text-sm text-[#7DD4C0]/70 flex-shrink-0 mt-1">
                        0{index + 5}
                      </span>
                      <span className="text-[15px] sm:text-base text-[#D8D8D8] leading-relaxed">{pregunta}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mx-auto mt-10 max-w-2xl text-center text-sm sm:text-base text-[#888888] leading-relaxed italic">
              Si tropieza con alguna negativa o falla en alguna positiva, descartamos. Punto.
            </p>
          </div>
        </section>

        {/* CIERRE FILOSÓFICO */}
        <section className="py-16 sm:py-20 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]">
            <OrbitalIcon size={580} animate={false} />
          </div>

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <blockquote className="type-display-sm text-white">
              <span className="text-[#D4B86A]">&ldquo;</span>
              Lo que decidimos no hacer
              <br className="hidden sm:block" />{" "}
              <span className="text-[#D4B86A]">dice tanto como lo que sí hacemos.</span>
              <span className="text-[#D4B86A]">&rdquo;</span>
            </blockquote>
            <p className="mx-auto mt-7 max-w-2xl text-sm sm:text-base text-[#888888] leading-relaxed">
              Por eso lo declaramos. Por eso lo dejamos público. Por eso lo vas a poder chequear cada vez
              que decidas confiar en algo de lo que sí hacemos.
            </p>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-14 sm:py-18">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-[#0A0A0A] rounded-xl shadow-[0_10px_28px_rgba(91,184,212,0.28)]"
                style={{
                  background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)",
                }}
              >
                Volver al inicio
              </Link>
              <Link
                href="/track-record"
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-medium rounded-xl border border-[#2A2A2A] text-[#CCCCCC] hover:border-[#D4B86A]/50 hover:text-white transition-all duration-300"
              >
                Ver track record
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
