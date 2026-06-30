import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ShieldCheck, Trophy, Calendar, Wallet, TrendingDown, AlertTriangle, Scale, Clock, Ban } from "lucide-react"
import { OrbitalIcon } from "@/components/OrbitalIcon"

export const metadata: Metadata = {
  title: "Track Record: Evaluaciones Aprobadas en Prop Firms",
  description:
    "Acreditación pública de las evaluaciones aprobadas en prop firms (My Funded Futures, Apex Trader Funded, Topstep y otras) durante el último año. Sin rentabilidades, sin payouts, sin promesas: solo la prueba auditable de que la metodología Flowdex pasa el filtro de las firmas más exigentes.",
  alternates: { canonical: "/track-record" },
  keywords: [
    "prop firms",
    "Apex Trader Funded",
    "Topstep",
    "My Funded Futures",
    "trader fondeado",
    "evaluación prop firm",
    "track record verificado",
  ],
  openGraph: {
    title: "Track Record: Evaluaciones Aprobadas en Prop Firms | Flowdex",
    description:
      "Evaluaciones aprobadas en Apex, Topstep, My Funded Futures y otras prop firms durante el último año. Acreditación pública del método Flowdex.",
    type: "article",
    url: "https://flowdex.com.ar/track-record",
  },
}

const propFirms = [
  {
    name: "My Funded Futures",
    slug: "mffu",
    logo: "/MFFU.jpg",
    count: 34,
    accountSizes: "Core / Core Normal / Starter / Starter Plus · $50K",
    period: "Mayo 2025 — Diciembre 2025",
  },
  {
    name: "Topstep",
    slug: "topstep",
    logo: "/topstep2.jpeg",
    count: 5,
    accountSizes: "Trading Combine · cuentas financiadas",
    period: "Febrero 2025 — Enero 2026",
  },
  {
    name: "Apex Trader Funding",
    slug: "apex",
    logo: "/apex.jpeg",
    count: 5,
    accountSizes: "Apex Funded · $50K Rithmic Account",
    period: "Abril 2025 — 2026",
  },
  {
    name: "Tradeify",
    slug: "tradeify",
    logo: "/tradeify.jpg",
    count: 1,
    accountSizes: "Select Flex · $50K",
    period: "Marzo 2026",
  },
  {
    name: "Lucid Trading",
    slug: "lucid",
    logo: "/Lucid.jpg",
    count: 1,
    accountSizes: "LucidFlex · $25K",
    period: "Abril 2026",
  },
]

const totalEvaluaciones = propFirms.reduce((acc, firm) => acc + firm.count, 0)

const stats = [
  { icon: Trophy, value: String(totalEvaluaciones), label: "Evaluaciones aprobadas" },
  { icon: ShieldCheck, value: String(propFirms.length), label: "Prop firms distintas" },
  { icon: Calendar, value: "15+", label: "Meses cubiertos" },
  { icon: Wallet, value: "$25K-50K", label: "Tamaños de cuenta" },
]

export default function TrackRecordPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(91,184,212,0.10),transparent_65%)]" />
        <div className="absolute top-1/3 -left-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(125,212,192,0.07),transparent_62%)]" />
      </div>

      <div className="relative z-10 pt-24 sm:pt-28">
        {/* HERO */}
        <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
          <div className="pointer-events-none absolute right-[8%] top-12 opacity-[0.05] hidden lg:block">
            <OrbitalIcon size={420} animate={false} />
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#8FA4AB] hover:text-[#7DD4C0] transition-colors mb-8"
            >
              <ArrowLeft size={14} /> Volver al inicio
            </Link>

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#7DD4C0]">
              Track Record · Verificable
            </p>
            <h1 className="type-display-lg">
              Lo que sí se puede mostrar.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-[#CCCCCC] leading-relaxed">
              Acreditación pública de las evaluaciones aprobadas por Franco en prop firms de futuros,
              bajo reglas estrictas de gestión de riesgo,
              <span className="text-[#7DD4C0] font-semibold"> en el último año</span>.
              Documentación emitida por terceros, no por nosotros.
            </p>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#2A2A2A] bg-[#0E0E0E]/80 p-5 sm:p-6 text-left space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4B86A] mb-2">
                  Por qué solo el último año
                </p>
                <p className="text-sm sm:text-base text-[#B0B0B0] leading-relaxed">
                  Los mercados cambian. Los regímenes de volatilidad de hace dos o tres años no son los de
                  hoy, y lo que funcionaba en 2022 puede ser irrelevante en 2026. Mostrar evidencia de
                  ciclos viejos sería vender un método actual con contexto caducado.
                  <span className="text-white"> Esta página cubre el último año</span> — el horizonte que
                  mejor representa lo que un alumno va a operar hoy.
                </p>
                <p className="mt-3 text-sm sm:text-base text-[#B0B0B0] leading-relaxed">
                  Estamos en estudio y adaptación constante. Lo que ves acá lo construimos con
                  <span className="text-white"> las mismas herramientas, el mismo método y los mismos
                  indicadores</span> que se enseñan adentro de Flowdex.
                </p>
              </div>

              <div className="border-t border-[#1F1F1F] pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4B86A] mb-2">
                  Por qué no mostramos dinero
                </p>
                <p className="text-sm sm:text-base text-[#B0B0B0] leading-relaxed">
                  Decidimos no exhibir rentabilidades, payouts ni ganancias por tres motivos:
                  <span className="text-white"> seguridad personal</span>,
                  <span className="text-white"> integridad moral</span>, y para
                  <span className="text-white"> no generar falsas expectativas</span> en alumnos que
                  pueden asociar resultados ajenos con los propios.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-8 sm:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-center backdrop-blur-sm"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#5BB8D4]/10 mb-3">
                      <Icon className="h-5 w-5 text-[#7DD4C0]" />
                    </div>
                    <p className="type-stat-md text-[#7DD4C0]">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[#8FA9B1]">
                      {stat.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CONTEXTO DE LA INDUSTRIA */}
        <section className="py-8 sm:py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-[#2A2A2A] bg-gradient-to-b from-[#0E1418] to-[#0A0F12] p-6 sm:p-8 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-3">
                Contexto de la industria
              </p>
              <p className="type-display-sm text-white">
                <span className="text-[#7DD4C0]">9 de cada 10</span> traders no pasan
                <br className="hidden sm:block" /> la evaluación de una prop firm.
              </p>
              <p className="mt-4 text-sm sm:text-base text-[#888888] leading-relaxed max-w-2xl mx-auto">
                Reglas estrictas de gestión, drawdown diario y consistencia. Según las tasas de aprobación
                que publican las propias firmas, aprueba entre el 4% y el 10% según la firma.
              </p>

              <div className="mt-6 rounded-xl border border-[#7DD4C0]/30 bg-[#0E1A1E] p-5 max-w-2xl mx-auto">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#7DD4C0] font-semibold mb-2">
                  Lo que esto significa
                </p>
                <p className="type-subheadline text-white">
                  En condiciones donde el <span className="text-[#7DD4C0]">90% del mercado falla</span>,
                  aprobar <span className="text-[#7DD4C0]">{totalEvaluaciones} evaluaciones</span> en{" "}
                  <span className="text-[#7DD4C0]">{propFirms.length} firmas distintas</span> no es suerte.
                  Es método sostenido.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PROP FIRMS CARDS */}
        <section className="py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="type-display-sm text-center mb-3">
              Por firma evaluadora
            </h2>
            <p className="text-center text-sm sm:text-base text-[#888888] mb-10 max-w-2xl mx-auto">
              Cada certificado fue emitido por la prop firm correspondiente al completar su proceso de evaluación
              bajo sus propias reglas de gestión de riesgo y consistencia.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {propFirms.map((firm) => (
                <article
                  key={firm.slug}
                  className="rounded-2xl border border-[#2A2A2A] bg-[#0D0D0D] overflow-hidden hover:border-[#7DD4C0]/30 transition-colors"
                >
                  <div className="flex items-stretch">
                    <div className="w-[110px] flex-shrink-0 bg-gradient-to-br from-[#111111] to-[#0A0A0A] relative">
                      <Image
                        src={firm.logo}
                        alt={firm.name}
                        fill
                        sizes="110px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-5">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#7DD4C0] font-semibold mb-2">
                        Firma evaluadora
                      </p>
                      <h3 className="type-subheadline text-white mb-1">
                        {firm.name}
                      </h3>
                      <p className="text-xs text-[#888888] mb-3">{firm.period}</p>

                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="type-stat-md text-[#7DD4C0]">
                          {firm.count}
                        </span>
                        <span className="text-[11px] uppercase tracking-wider text-[#8FA9B1]">
                          {firm.count === 1 ? "evaluación aprobada" : "evaluaciones aprobadas"}
                        </span>
                      </div>
                      <p className="text-xs text-[#A8A8A8] leading-relaxed">{firm.accountSizes}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* REGLAS TÍPICAS DE EVALUACIONES */}
        <section className="py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-3">
                Por qué el 90% falla
              </p>
              <h2 className="type-display-sm text-white">
                Las reglas están diseñadas para que pierdas, no para que apruebes.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#888888] max-w-2xl mx-auto leading-relaxed">
                Estas son condiciones típicas de las evaluaciones de prop firms. Una sola infracción
                cancela toda la cuenta y hay que volver a empezar.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <article className="rounded-xl border border-[#2A2A2A] bg-[#0D0D0D] p-5 flex items-start gap-4">
                <div className="rounded-lg bg-[#D4B86A]/10 p-2.5 flex-shrink-0">
                  <TrendingDown className="h-5 w-5 text-[#D4B86A]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">Drawdown diario máximo</h3>
                  <p className="text-sm text-[#A8A8A8] leading-relaxed">
                    Si tu cuenta cae entre 3% y 5% en un solo día, evaluación cancelada.
                    No importa cuánto te recuperes después.
                  </p>
                </div>
              </article>

              <article className="rounded-xl border border-[#2A2A2A] bg-[#0D0D0D] p-5 flex items-start gap-4">
                <div className="rounded-lg bg-[#D4B86A]/10 p-2.5 flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-[#D4B86A]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">Drawdown total máximo</h3>
                  <p className="text-sm text-[#A8A8A8] leading-relaxed">
                    Entre 6% y 10% de caída acumulada desde el balance inicial elimina la cuenta.
                    Una sola racha mala te saca.
                  </p>
                </div>
              </article>

              <article className="rounded-xl border border-[#2A2A2A] bg-[#0D0D0D] p-5 flex items-start gap-4">
                <div className="rounded-lg bg-[#D4B86A]/10 p-2.5 flex-shrink-0">
                  <Scale className="h-5 w-5 text-[#D4B86A]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">Regla de consistencia</h3>
                  <p className="text-sm text-[#A8A8A8] leading-relaxed">
                    Si un solo día representa más del 50% de tus ganancias totales, perdés la cuenta.
                    El éxito puntual te penaliza.
                  </p>
                </div>
              </article>

              <article className="rounded-xl border border-[#2A2A2A] bg-[#0D0D0D] p-5 flex items-start gap-4">
                <div className="rounded-lg bg-[#D4B86A]/10 p-2.5 flex-shrink-0">
                  <Clock className="h-5 w-5 text-[#D4B86A]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">Días mínimos de operación</h3>
                  <p className="text-sm text-[#A8A8A8] leading-relaxed">
                    Hay un piso de 10 a 15 días en el mercado. No podés ganar rápido y salir;
                    tenés que sostener disciplina en el tiempo.
                  </p>
                </div>
              </article>

              <article className="rounded-xl border border-[#2A2A2A] bg-[#0D0D0D] p-5 flex items-start gap-4 sm:col-span-2">
                <div className="rounded-lg bg-[#D4B86A]/10 p-2.5 flex-shrink-0">
                  <Ban className="h-5 w-5 text-[#D4B86A]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">Restricciones operativas</h3>
                  <p className="text-sm text-[#A8A8A8] leading-relaxed">
                    Prohibición de operar en eventos macro de alto impacto, restricciones de hold
                    overnight, límites de tamaño de posición, prohibición de estrategias de cobertura
                    o martingala. La lista varía por firma, pero la lógica es la misma.
                  </p>
                </div>
              </article>
            </div>

            <p className="mt-8 text-center text-sm text-[#7DD4C0] font-medium max-w-2xl mx-auto leading-relaxed">
              Es el modelo de negocio de las prop firms: viven de las cuotas de inscripción de los que no
              pasan. Por eso buscan que pierdas.
            </p>
          </div>
        </section>

        {/* CIERRE EXPLICATIVO */}
        <section className="py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-[#2A2A2A] bg-gradient-to-b from-[#111111] to-[#0A0A0A] p-7 sm:p-9">
              <h3 className="type-headline text-white mb-4">
                Qué significa esto, y qué no.
              </h3>
              <ul className="space-y-3 text-sm sm:text-base text-[#B5B5B5] leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-[#7DD4C0] mt-1 flex-shrink-0">✓</span>
                  <span>
                    Acreditación de que se cumplieron las reglas de gestión, consistencia y disciplina exigidas
                    por cada prop firm para acceder a una cuenta financiada.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#7DD4C0] mt-1 flex-shrink-0">✓</span>
                  <span>
                    Documentación emitida por terceros (las prop firms), no por Flowdex. Verificable contra
                    cada firma con el número de certificado correspondiente.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#7DD4C0] mt-1 flex-shrink-0">✓</span>
                  <span>
                    Cubre solo el último año porque los regímenes de mercado cambian: mostrar evidencia
                    de ciclos viejos para vender un método que se opera hoy no sería honesto.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#8FA9B1] mt-1 flex-shrink-0">✗</span>
                  <span>
                    No mostramos rentabilidades, payouts ni ganancias. Por seguridad personal, por integridad
                    moral, y para no generar falsas expectativas en quien lo lea.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#8FA9B1] mt-1 flex-shrink-0">✗</span>
                  <span>
                    No es una promesa de resultados ni una garantía de rentabilidad. Cada paso depende
                    del trabajo, la disciplina y la gestión de cada trader.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#8FA9B1] mt-1 flex-shrink-0">✗</span>
                  <span>
                    No replica resultados pasados ni asegura que la metodología funcione para todo el mundo.
                    Cada alumno depende de su propio trabajo, su disciplina y su gestión.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#8FA9B1] mt-1 flex-shrink-0">✗</span>
                  <span>
                    No tenemos relación de afiliación, comisión ni acuerdo de referidos con ninguna de estas
                    firmas. No ganamos nada si rendís una evaluación. Las nombramos solo como prueba
                    verificable, igual que está escrito en <Link href="/no-hacemos" className="text-[#7DD4C0] hover:underline">lo que no hacemos</Link>.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECCIÓN EDUCATIVA SEO — "Qué es una prop firm"
            Captura tráfico informacional de queries: "qué es una prop firm",
            "cómo funciona Apex", "Topstep en español", "trader fondeado".
            Texto natural sin keyword stuffing, headings semánticos. */}
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#0D0D0D] p-7 sm:p-10 space-y-8">
              <header>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7DD4C0] mb-3">
                  Glosario rápido
                </p>
                <h2 className="type-display-sm text-white">
                  ¿Qué es una prop firm y cómo funciona?
                </h2>
                <p className="mt-4 text-sm sm:text-base text-[#B0B0B0] leading-relaxed">
                  Una prop firm (proprietary trading firm) es una empresa que financia con su propio
                  capital a traders que pasan un proceso de evaluación. El trader opera con dinero de
                  la firma siguiendo reglas estrictas de gestión, y se queda con la mayoría de las
                  ganancias generadas. En español también se las llama firmas de trading propietario
                  o, coloquialmente, &ldquo;cuentas fondeadas&rdquo;.
                </p>
              </header>

              <div>
                <h3 className="type-subheadline text-white mb-3">
                  Cómo funcionan, en breve
                </h3>
                <p className="text-sm sm:text-base text-[#B0B0B0] leading-relaxed">
                  El esquema es parecido en casi todas: pagás una evaluación de cuota mensual, operás
                  un balance simulado siguiendo reglas de drawdown diario y máximo, y al cumplir el
                  objetivo accedés a una cuenta financiada. Entre las que figuran en este track record
                  están Topstep y Lucid Trading, cada una con sus propias reglas, niveles de cuenta y
                  estructura de payouts. Las nombramos a título informativo, sin links ni
                  recomendación: la firma puntual importa menos que la disciplina con la que se opera.
                </p>
              </div>

              <div>
                <h3 className="type-subheadline text-white mb-3">
                  Qué significa &ldquo;pasar la evaluación&rdquo;
                </h3>
                <p className="text-sm sm:text-base text-[#B0B0B0] leading-relaxed">
                  Pasar una evaluación significa cumplir el objetivo de ganancia que pone cada firma
                  sin violar ni una sola de las reglas: drawdown diario máximo, drawdown total
                  máximo, regla de consistencia, días mínimos en mercado y restricciones operativas.
                  Una sola infracción cancela toda la cuenta y obliga a empezar de nuevo (con la
                  cuota correspondiente). Por eso la tasa de aprobación de la industria está entre
                  el 4% y el 10% según la firma, y por eso un track record sostenido de evaluaciones
                  aprobadas no es suerte: es método.
                </p>
              </div>

              <div>
                <h3 className="type-subheadline text-white mb-3">
                  Para qué sirven, y sus límites
                </h3>
                <p className="text-sm sm:text-base text-[#B0B0B0] leading-relaxed">
                  Una prop firm es, sobre todo, una herramienta de aprendizaje. Operar bajo reglas
                  estrictas de gestión, drawdown y consistencia te obliga a madurar como trader: sumás
                  disciplina, contexto y experiencia bajo presión. Ese es su valor real —un banco de
                  pruebas para dar después el paso a operar capital propio, que es el destino que
                  perseguimos.
                </p>
                <div className="mt-5 rounded-xl border border-[#D4B86A]/40 bg-[#D4B86A]/[0.06] p-5 flex items-start gap-3.5">
                  <div className="rounded-lg bg-[#D4B86A]/15 p-2 flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[#D4B86A]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A] mb-1.5">
                      Advertencia
                    </p>
                    <p className="text-sm sm:text-base text-[#D8D8D8] leading-relaxed">
                      Es una industria joven y poco supervisada: no hay un ente externo que la controle
                      como ocurre en los mercados regulados, y muchas firmas cambian sus reglas con
                      frecuencia, varias veces sin aviso previo. Su modelo está cada vez más
                      cuestionado. Por eso en Flowdex las usamos como escalón de formación, nunca como
                      meta: el objetivo no es vivir de pasar evaluaciones, es formar un trader capaz de
                      sostener su propio capital.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#1F1F1F] pt-6">
                <p className="text-sm text-[#7DD4C0] font-medium leading-relaxed">
                  En Flowdex Trading Lab profundizamos cómo preparar y operar evaluaciones de prop
                  firms con criterio. En Kickstart Trading sentamos las bases que después permiten
                  rendir una evaluación con disciplina.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-14 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="type-display-sm text-white mb-4">
              El método detrás de estas evaluaciones se enseña desde el principio.
            </h2>
            <p className="text-base sm:text-lg text-[#888888] mb-8 max-w-2xl mx-auto">
              El camino arranca con Kickstart Trading: fundamentos, gestión y disciplina desde el día uno.
              El resto del camino se construye paso por paso desde ahí.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/cursos/kickstart-trading"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-[#0A0A0A] rounded-xl shadow-[0_10px_28px_rgba(91,184,212,0.28)]"
                style={{
                  background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)",
                }}
              >
                Empezar por Kickstart Trading
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-medium rounded-xl border border-[#2A2A2A] text-[#CCCCCC] hover:border-[#7DD4C0]/50 hover:text-white transition-all duration-300"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
