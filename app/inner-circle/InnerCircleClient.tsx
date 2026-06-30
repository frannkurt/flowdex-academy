"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState, type ComponentType, type MouseEvent } from "react"
import {
  Download,
  Globe,
  Lightbulb,
  Newspaper,
  Search,
  Target,
  TrendingUp,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { OrbitalIcon } from "@/components/OrbitalIcon"

type TrackItem = {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  featured?: boolean
}

type InnerCircleClientProps = {
  price: number
}

function formatUsd(value: number) {
  return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)} USD`
}

const sneakPeek = [
  {
    question: "¿Por qué cierro trades ganadores antes de tiempo?",
    answer:
      'Es una de las 7 creencias limitantes que vemos en operadores que se sabotean sin saberlo. El subtexto es: "no merezco más". Adentro las identificás todas y las desactivás.',
  },
  {
    question:
      "¿Por qué dos personas con el mismo plan terminan con resultados radicalmente distintos?",
    answer:
      "No es la inteligencia. No es la disciplina. Es la relación que cada uno tiene con el dinero. Adentro trabajamos lo que aprendiste antes de los 7 años y todavía opera tu cuenta.",
  },
  {
    question: "¿Cómo se siente operar cuando estás regulado?",
    answer:
      "Cuando dejás de operar como si cada trade fuera tu última chance, empezás a operar como un profesional. Adentro vemos los frameworks profesionales para que tu cabeza no decida sola.",
  },
  {
    question: "¿Quién voy a ser dentro de 10 años?",
    answer:
      "El último ejercicio de la obra. Una hora, hojas blancas, lapicera. 10 preguntas que definen tu próxima década. Lo que escribas hoy te alinea por años.",
  },
]

const modules = [
  {
    number: "01",
    title: "Mindset Fundacional",
    subtitle: "La diferencia que se construye antes de cualquier técnica",
  },
  {
    number: "02",
    title: "Tu Relación con el Dinero",
    subtitle:
      "Cómo aparece en cada trade lo que no terminaste de sanar",
  },
  {
    number: "03",
    title: "Las 6 Emociones Maestras",
    subtitle:
      "Las que te visitan en cada operación, las quieras o no",
  },
  {
    number: "04",
    title: "Sesgos Cognitivos",
    subtitle: "Las trampas mentales que cuestan plata sin que las veas",
  },
  {
    number: "05",
    title: "El Observador Interno",
    subtitle: "La práctica más poderosa y la menos enseñada",
  },
  {
    number: "06",
    title: "El Cuerpo del Operador",
    subtitle: "El primer activo, el que casi nadie cuida",
  },
  {
    number: "07",
    title: "Estrés y Burnout",
    subtitle: "Detectarlo a tiempo, regularlo, recuperarse",
  },
  {
    number: "08",
    title: "Rutinas y Rituales",
    subtitle:
      "Lo que hace que la disciplina deje de depender de la motivación",
  },
  {
    number: "09",
    title: "Decisiones Bajo Presión",
    subtitle:
      "Frameworks profesionales para que tu cabeza no decida sola",
  },
  {
    number: "10",
    title: "Filosofía Aplicada y Visión 10 Años",
    subtitle: "El cierre. Donde la obra se vuelve carrera, y la carrera, vida.",
  },
]

const annexes = [
  "Workbook de 30 Días — Un prompt diario para escribir a mano",
  "Auditoría Kit — 5 plantillas profesionales (pre-sesión, post-sesión, journal psicológico, revisión semanal y mensual)",
  "Cartas a tu Yo del Año que Viene — Dos cartas que se abren dentro de un año",
  "Tracker Visual de Progreso — El camino tachado, impreso",
  "20 Lecturas Esenciales — Los libros que cada operador serio debería leer",
  "Glosario Filosófico Aplicado — 30 conceptos del estoicismo, behavioral finance y deportes de élite",
  "Self-Assessment Inicial y Final — 25 preguntas, una al empezar otra al cerrar. La transformación medida con datos propios.",
]

const investmentItems: TrackItem[] = [
  {
    icon: Target,
    title: "Sistema FPM · Flowdex Portfolio Method",
    description:
      "Metodología propia de Flowdex para estructurar portafolios profesionales. Reglas claras de construcción, simulación previa y gestión activa. Solo se enseña en Inner Circle.",
    featured: true,
  },
  {
    icon: TrendingUp,
    title: "Gestión dinámica del portafolio",
    description:
      "Identificación de zonas de compra, toma de ganancias y rebalanceo a lo largo del tiempo. Tu cartera no es estática, la trabajamos viva.",
  },
  {
    icon: Search,
    title: "Análisis fundamental y valuación de empresas",
    description:
      "Métricas financieras clave (P/E, ROE, deuda, márgenes). Cómo detectar empresas con fundamentos sólidos antes de que el mercado las descubra.",
  },
  {
    icon: Globe,
    title: "Lectura macroeconómica y sectorial",
    description:
      "Tendencias macro, ciclos económicos y sectores con potencial de crecimiento. Aprendés a leer el contexto que mueve a las empresas.",
  },
  {
    icon: Newspaper,
    title: "Sistema de monitoreo de noticias y catalizadores",
    description:
      "Cómo filtrar el ruido y detectar las noticias económicas globales que realmente mueven precios.",
  },
]

const tradingItems: TrackItem[] = [
  {
    icon: Target,
    title: "Estrategia ORB Breakout · desarrollada por Franco para Flowdex",
    description:
      "Sistema propio con indicador exclusivo en TradingView. Reglas claras de entrada, gestión y salida. No se enseña en ningún otro nivel.",
    featured: true,
  },
  {
    icon: TrendingUp,
    title: "Sistema de scalping aplicado en H1 / M15",
    description:
      "Operativa intradía con marco temporal corto. Setup, ejecución y gestión activa en tiempo real sobre tus propias operaciones.",
  },
  {
    icon: Search,
    title: "Correlación dinámica entre pares y DXY",
    description:
      "Cómo leer el contexto del dólar y las correlaciones cruzadas para entrar con la mano del mercado, no contra ella.",
  },
  {
    icon: Globe,
    title: "Monitoreo de mercado y noticias de impacto operativo",
    description:
      "Calendario económico aplicado, eventos que mueven precio, cómo posicionarte antes y después de news clave.",
  },
  {
    icon: Newspaper,
    title: "Gestión de riesgo profesional aplicada",
    description:
      "Tamaño de posición, stop dinámico, manejo de drawdown. La diferencia entre el que sobrevive y el que vuela la cuenta.",
  },
]

const faqs = [
  {
    q: "¿Tengo que elegir entre Inversiones o Trading?",
    a: "No. Cuando entrás al Inner Circle, accedés al material completo de las dos disciplinas + Obra Maestra completa. Tu camino base te orienta por dónde empezar, pero el contenido está disponible íntegro.",
  },
  {
    q: "¿Qué es Obra Maestra?",
    a: "10 módulos profundos de transformación del operador: estoicismo, behavioral finance, deportes de élite y filosofía aplicada al trading. Incluye 7 anexos descargables (workbooks, plantillas, lecturas esenciales). Es lo que diferencia a un trader que sostiene consistencia de uno que vuela la cuenta.",
  },
  {
    q: "¿Me conviene completar también el otro camino base?",
    a: "Te lo recomendamos. Si entraste por Trading, completar Inversiones (Kickstart + Expert) te da el marco macro y de portafolio que potencia tu operativa. Lo mismo al revés. No es obligatorio, pero le saca más jugo al Inner Circle.",
  },
  {
    q: "¿Cómo se valida que completé los cursos previos?",
    a: "Validamos automáticamente al momento de la compra. Si tenés alguna duda con la verificación, te contactamos por email para confirmar tu acceso.",
  },
  {
    q: "¿Qué pasa después de pagar?",
    a: "Recibís acceso inmediato a Obra Maestra, las dos disciplinas técnicas, los anexos descargables, las invitaciones a las comunidades privadas y el primer mes de la membresía mensual sin costo (la membresía es opcional a partir del segundo mes y la podés cancelar cuando quieras).",
  },
  {
    q: "¿La membresía mensual se cobra automáticamente?",
    a: "El primer mes va incluido sin costo cuando comprás el Inner Circle. A partir del segundo mes, $50 USD mensuales por el acompañamiento semanal a tu desarrollo como operador, que llevamos personalmente Franco y Augusto. Cancelable cuando quieras, sin trámite.",
  },
  {
    q: "¿Puedo cancelar la membresía cuando quiera?",
    a: "Sí, cuando quieras. Si cancelás, mantenés acceso al material del Inner Circle (Obra Maestra + disciplinas técnicas) por los 12 meses de acceso y seguís en el canal de tu disciplina base (Trading o Inversiones) para debatir entre pares y resolver dudas pedagógicas. Lo que se pausa es todo el canal privado del Inner Circle: reviews, sesiones grupales y acompañamiento directo de Franco y Augusto. Cuando renovás la membresía, recuperás el acceso completo al círculo.",
  },
  {
    q: "¿Por qué los cupos son limitados?",
    a: "Porque acompañamos a cada alumno de manera personal. La cantidad de operadores a los que podemos darles seguimiento real tiene un techo natural. Cuando ese techo se acerca, abrimos lista de espera para la próxima edición en lugar de bajar la calidad del acompañamiento.",
  },
]

function DisciplineCard({
  tag,
  title,
  subtitle,
  items,
  orbitalSide = "right",
}: {
  tag: string
  title: string
  subtitle: string
  items: TrackItem[]
  orbitalSide?: "left" | "right"
}) {
  return (
    <article className="rounded-2xl border border-[#2A2A2A] bg-gradient-to-b from-[#141414] to-[#0F0F0F] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#5BB8D4]/70 via-[#7DD4C0]/70 to-transparent" />
      <div
        className={`pointer-events-none absolute -bottom-12 hidden opacity-[0.11] lg:block ${
          orbitalSide === "right" ? "-right-12" : "-left-12"
        }`}
      >
        <div className="relative h-36 w-36">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-wezMvzAr3Fzh5ipueR6RLesjCBS8sf.png"
            alt=""
            fill
            sizes="144px"
            className="object-contain"
            style={{ filter: "drop-shadow(0 0 16px rgba(125, 212, 192, 0.2))" }}
          />
        </div>
      </div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#7DD4C0] font-semibold mb-2">
        {tag}
      </p>
      <h3 className="type-headline text-white mb-1.5">
        {title}
      </h3>
      <p className="text-[#A6A6A6] italic mb-5">{subtitle}</p>
      <div className="h-px bg-gradient-to-r from-[#5BB8D4]/45 via-[#7DD4C0]/35 to-transparent mb-5" />

      <div className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className={`rounded-xl border px-3.5 py-3 ${
                item.featured
                  ? "border-[#5BB8D4]/50 bg-[#11242C] shadow-[inset_0_0_0_1px_rgba(125,212,192,0.08)] relative overflow-hidden"
                  : "border-[#242424] bg-[#0E0E0E]"
              }`}
            >
              {item.featured && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5BB8D4] to-[#7DD4C0]" />
              )}
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 rounded-md bg-[#1A1A1A] p-1.5 border border-[#2A2A2A]">
                  <Icon className="w-4 h-4 text-[#7DD4C0]" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#E9E9E9] leading-snug">
                    {item.title}
                  </p>
                  <p className="text-[13px] text-[#A5A5A5] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default function InnerCircleClient({ price }: InnerCircleClientProps) {
  const [imageError, setImageError] = useState(false)
  const [showStickyCta, setShowStickyCta] = useState(false)
  const topSentinelRef = useRef<HTMLDivElement | null>(null)
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null)
  const priceLabel = formatUsd(price)

  const scrollToObraMaestra = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const section = document.getElementById("obra-maestra")
    section?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Sticky CTA solo en la zona media: aparece cuando el CTA del hero sale del viewport,
  // desaparece cuando se acerca el final (legales/footer). En desktop no se monta.
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(min-width: 640px)").matches) return

    let pastHero = false
    let nearBottom = false

    const update = () => setShowStickyCta(pastHero && !nearBottom)

    const topObserver = new IntersectionObserver(
      ([entry]) => {
        // Está "después del hero" cuando el sentinel ya no es visible y quedó arriba.
        pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0
        update()
      },
      { threshold: 0 },
    )

    const bottomObserver = new IntersectionObserver(
      ([entry]) => {
        nearBottom = entry.isIntersecting
        update()
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    )

    if (topSentinelRef.current) topObserver.observe(topSentinelRef.current)
    if (bottomSentinelRef.current) bottomObserver.observe(bottomSentinelRef.current)

    return () => {
      topObserver.disconnect()
      bottomObserver.disconnect()
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden pb-24 sm:pb-0">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[820px] h-[420px] bg-[radial-gradient(ellipse_at_center,rgba(91,184,212,0.14),transparent_65%)]" />
          <div className="absolute top-[28rem] -left-32 w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(125,212,192,0.1),transparent_62%)]" />
          <div className="absolute top-[72rem] -right-28 w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(91,184,212,0.1),transparent_62%)]" />
        </div>

        <div className="pt-24 sm:pt-28 relative z-10">
          <section className="py-12 sm:py-14 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
                <div className="rounded-3xl border border-[#242424] bg-[linear-gradient(180deg,rgba(18,18,18,0.95),rgba(12,12,12,0.95))] p-5 sm:p-7 lg:p-8 shadow-[0_20px_55px_rgba(0,0,0,0.35)] relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#5BB8D4]/70 via-[#7DD4C0]/70 to-transparent" />
                  <div className="pointer-events-none absolute -right-24 -bottom-24 opacity-[0.05]">
                    <OrbitalIcon size={480} animate={false} />
                  </div>
                  <p className="relative text-xs uppercase tracking-[0.18em] text-[#7DD4C0] font-semibold mb-2">
                    NIVEL INNER CIRCLE
                  </p>
                  <p className="text-sm text-[#90A4AA] mb-5">
                    Cupos limitados · Acceso por requisitos previos
                  </p>

                  <div className="h-px w-28 bg-gradient-to-r from-[#5BB8D4] to-[#7DD4C0] mb-5" />

                  <h1 className="type-display-lg mb-2.5">
                    FLOWDEX INNER CIRCLE
                  </h1>
                  <h2 className="text-xl sm:text-2xl text-[#DDEFF2] mb-4.5">
                    Donde tu operativa deja de ser intuición y empieza a ser método.
                  </h2>

                  <p className="text-[#A9A9A9] leading-relaxed text-[15px] sm:text-[17px] mb-5.5 max-w-2xl">
                    Tres cursos avanzados con acompañamiento de Franco y Augusto: dos disciplinas técnicas (Inversiones + Trading) y la Obra Maestra (10 módulos de desarrollo personal y psicología del operador).
                    Pago único por el material; primer mes de membresía mensual incluido.
                  </p>

                  <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                    <span className="type-stat-md text-[#7DD4C0]">
                      {priceLabel}
                    </span>
                  </div>
                  <p className="text-sm text-[#A5E6D6] mb-5">
                    Incluye el primer mes de membresía mensual ($50/mes)
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
                    <Link
                      href="/checkout/inner-circle"
                      className="inline-flex items-center justify-center py-3.5 px-8 text-base font-semibold text-[#0A0A0A] rounded-xl shadow-[0_10px_28px_rgba(91,184,212,0.28)]"
                      style={{
                        background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)",
                      }}
                    >
                      APLICAR AHORA
                    </Link>
                    <a
                      href="#obra-maestra"
                      onClick={scrollToObraMaestra}
                      className="text-sm font-medium text-[#8FCFDB] hover:text-[#BCEAF3] transition-colors"
                    >
                      Ver contenido completo ↓
                    </a>
                  </div>
                  {/* Sentinel: marca el final del CTA del hero (mobile sticky logic) */}
                  <div ref={topSentinelRef} aria-hidden className="h-px w-px" />
                </div>

                <div className="rounded-3xl border border-[#242424] bg-[linear-gradient(180deg,rgba(18,18,18,0.95),rgba(12,12,12,0.95))] overflow-hidden shadow-[0_20px_55px_rgba(0,0,0,0.35)] relative flex flex-col">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#5BB8D4]/70 via-[#7DD4C0]/70 to-transparent" />
                  <div className="relative aspect-video bg-[#111111] flex-shrink-0">
                    {!imageError ? (
                      <Image
                        src="/orb-strategy.png"
                        alt="Estrategia ORB Breakout en TradingView – Indicador exclusivo desarrollado por Franco para Flowdex"
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="absolute inset-0 object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                        <p className="text-sm text-[#8A8A8A]">
                          Estrategia ORB · imagen pendiente
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="px-5 sm:px-6 py-4 border-t border-[#232323] bg-[#0F1112]">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#7DD4C0] font-semibold mb-1">
                      Estrategia exclusiva · ORB Breakout
                    </p>
                    <p className="text-sm text-[#C8D2D7] leading-relaxed">
                      Indicador propio desarrollado por Franco para Flowdex. La estrategia que usamos en cada sesión del círculo.
                    </p>
                  </div>
                  <div className="px-5 sm:px-6 py-6 sm:py-7 border-t border-[#1F1F1F] bg-gradient-to-b from-[#0E1418] to-[#0A0F12] flex-1 flex items-center">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-3 w-full text-center divide-y sm:divide-y-0 sm:divide-x divide-[#1F2E33]">
                      <div className="px-1 sm:px-2">
                        <p className="type-stat-md text-[#7DD4C0]">3</p>
                        <p className="text-[10px] uppercase tracking-wide text-[#8FA9B1] mt-2.5">Cursos avanzados</p>
                      </div>
                      <div className="px-1 sm:px-2">
                        <p className="type-stat-md text-[#7DD4C0]">20</p>
                        <p className="text-[10px] uppercase tracking-wide text-[#8FA9B1] mt-2.5">Módulos en total</p>
                      </div>
                      <div className="px-1 sm:px-2 pt-5 sm:pt-0">
                        <p className="type-stat-md text-[#7DD4C0]">4</p>
                        <p className="text-[10px] uppercase tracking-wide text-[#8FA9B1] mt-2.5">Sesiones/mes</p>
                      </div>
                      <div className="px-1 sm:px-2 pt-5 sm:pt-0">
                        <p className="type-stat-md text-[#7DD4C0]">7</p>
                        <p className="text-[10px] uppercase tracking-wide text-[#8FA9B1] mt-2.5">Anexos descargables</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-11 sm:py-13 lg:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="type-display-sm mb-6">
                ¿ESTO ES PARA VOS?
              </h2>

              <div className="grid md:grid-cols-2 gap-3.5 sm:gap-4">
                <article className="rounded-2xl border border-[#2A2A2A] bg-[linear-gradient(180deg,#141414,#101010)] p-5 sm:p-6 shadow-[0_12px_28px_rgba(0,0,0,0.2)] relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5BB8D4] to-[#7DD4C0]" />
                  <h3 className="text-lg font-semibold text-[#7DD4C0] mb-4">✓ ESTO ES PARA VOS SI...</h3>
                  <ul className="space-y-2.5 text-[#C7C7C7] text-sm sm:text-base">
                    <li className="flex items-start gap-2"><span className="text-[#7DD4C0] mt-0.5">•</span><span>Ya completaste tu camino base (Inversiones o Trading)</span></li>
                    <li className="flex items-start gap-2"><span className="text-[#7DD4C0] mt-0.5">•</span><span>Querés profesionalizar tu operativa con criterio real</span></li>
                    <li className="flex items-start gap-2"><span className="text-[#7DD4C0] mt-0.5">•</span><span>Buscás revisión técnica seria sobre tus operaciones, en grupo o individual según el caso</span></li>
                    <li className="flex items-start gap-2"><span className="text-[#7DD4C0] mt-0.5">•</span><span>Aceptás criterio aplicado del método sin tomarlo personal</span></li>
                  </ul>
                </article>

                <article className="rounded-2xl border border-[#2A2A2A] bg-[linear-gradient(180deg,#141414,#101010)] p-5 sm:p-6 shadow-[0_12px_28px_rgba(0,0,0,0.2)] relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5BB8D4]/80 to-[#355764]" />
                  <h3 className="text-lg font-semibold text-[#5BB8D4] mb-4">✗ ESTO NO ES PARA VOS SI...</h3>
                  <ul className="space-y-2.5 text-[#C7C7C7] text-sm sm:text-base">
                    <li className="flex items-start gap-2"><span className="text-[#5BB8D4] mt-0.5">•</span><span>Buscás señales para copiar sin entender el porqué</span></li>
                    <li className="flex items-start gap-2"><span className="text-[#5BB8D4] mt-0.5">•</span><span>Esperás resultados sin poner horas frente al gráfico</span></li>
                    <li className="flex items-start gap-2"><span className="text-[#5BB8D4] mt-0.5">•</span><span>Querés una promesa de rentabilidad mensual</span></li>
                    <li className="flex items-start gap-2"><span className="text-[#5BB8D4] mt-0.5">•</span><span>No estás dispuesto a recibir feedback duro</span></li>
                  </ul>
                </article>
              </div>
            </div>
          </section>

          <section id="obra-maestra" className="py-15 sm:py-18 lg:py-20 bg-[radial-gradient(ellipse_at_top,rgba(125,212,192,0.09),transparent_45%),#0C0C0C] border-y border-[#1F1F1F] relative overflow-hidden">
            <div className="pointer-events-none absolute -right-32 top-12 opacity-[0.04]">
              <OrbitalIcon size={560} animate={false} />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="max-w-4xl mb-9 sm:mb-11">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7DD4C0] font-semibold mb-2">
                  CURSO DE DESARROLLO PERSONAL Y PSICOLOGÍA
                </p>
                <h2 className="type-display-md mb-2">
                  OBRA MAESTRA
                </h2>
                <p className="text-lg sm:text-xl text-[#7DD4C0]">
                  10 módulos · 7 anexos descargables · Una transformación
                </p>
              </div>

              <blockquote className="rounded-2xl border border-[#2A2A2A] bg-[linear-gradient(180deg,#141414,#0F0F0F)] p-5 sm:p-6 mb-8 shadow-[0_16px_35px_rgba(0,0,0,0.28)]">
                <p className="type-headline text-[#ECF7FA] max-w-4xl">
                  "Si te dieran a elegir entre tener el mejor sistema técnico del mundo con la cabeza promedio, o un sistema mediocre con la cabeza de un profesional, deberías elegir lo segundo."
                </p>
                <p className="text-[#9CB0B7] mt-3 text-sm">
                  El sistema técnico se aprende en meses. La cabeza profesional se construye en años.
                </p>
              </blockquote>

              <p className="text-[#B1B1B1] text-[15px] sm:text-[17px] leading-relaxed max-w-4xl mb-9">
                Obra Maestra no trata de motivación vacía. Integra estoicismo, behavioral finance y principios de rendimiento de élite para formar criterio real. Son 10 módulos profundos, poco comunes en formación de trading.
              </p>

              <div className="mb-10 sm:mb-11">
                <h3 className="text-sm uppercase tracking-[0.18em] font-semibold text-[#7DD4C0] mb-4">
                  ALGUNAS DE LAS PREGUNTAS QUE VAS A RESPONDER ADENTRO
                </h3>

                <div className="grid md:grid-cols-2 gap-3.5 sm:gap-4">
                  {sneakPeek.map((item) => (
                    <article
                      key={item.question}
                      className="rounded-2xl border border-[#2A2A2A] bg-[linear-gradient(180deg,#131313,#0F0F0F)] p-5"
                    >
                      <p className="text-lg sm:text-xl font-semibold text-[#EAF8FC] leading-snug">
                        ❝{item.question}❞
                      </p>
                      <div className="h-px bg-gradient-to-r from-[#5BB8D4]/70 via-[#7DD4C0]/55 to-transparent my-4" />
                      <p className="text-[#A8A8A8] leading-relaxed text-sm sm:text-base">
                        {item.answer}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mb-10 sm:mb-11">
                <h3 className="text-sm uppercase tracking-[0.18em] font-semibold text-[#7DD4C0] mb-4">
                  EL RECORRIDO COMPLETO
                </h3>

                <div className="grid md:grid-cols-2 gap-3 sm:gap-3.5">
                  {modules.map((module) => (
                    <article
                      key={module.number}
                      className="rounded-xl border border-[#252525] bg-[linear-gradient(180deg,#141414,#101010)] px-4 py-3.5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl font-[var(--font-mono)] text-[#7DD4C0] leading-none rounded-md px-1.5 py-0.5 bg-[#122128] border border-[#27414A]">
                          {module.number}
                        </span>
                        <div>
                          <p className="text-[15px] font-semibold text-[#EFEFEF] leading-snug">
                            {module.title}
                          </p>
                          <p className="text-[13px] text-[#9A9A9A] mt-1 leading-relaxed">
                            {module.subtitle}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-[0.18em] font-semibold text-[#7DD4C0] mb-4">
                  + 7 ANEXOS DESCARGABLES · TE LOS LLEVÁS A CASA
                </h3>

                <div className="space-y-2.5">
                  {annexes.map((annex) => (
                    <div
                      key={annex}
                      className="rounded-xl border border-[#252525] bg-[linear-gradient(180deg,#131313,#101010)] px-4 py-3 flex items-start gap-3"
                    >
                      <div className="rounded-md border border-[#2A2A2A] bg-[#171717] p-1.5 mt-0.5">
                        <Download className="w-4 h-4 text-[#7DD4C0]" />
                      </div>
                      <p className="text-sm text-[#B6B6B6] leading-relaxed">{annex}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-12 sm:py-14 lg:py-15">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="type-display-sm mb-3">
                DETALLE DE LAS DOS DISCIPLINAS TÉCNICAS
              </h2>
              <p className="text-[#A8A8A8] text-base sm:text-lg max-w-4xl mb-6">
                Cuando entrás al Inner Circle, también accedés al material completo de
                Inversiones Y Trading. No tenés que elegir.
              </p>

              <div className="grid lg:grid-cols-2 gap-3.5 sm:gap-4">
                <DisciplineCard
                  tag="DISCIPLINA INVERSIONES"
                  title="INNER CIRCLE · INVERSIONES"
                  subtitle="Construir un portafolio gestionado con criterio profesional."
                  items={investmentItems}
                  orbitalSide="right"
                />
                <DisciplineCard
                  tag="DISCIPLINA TRADING"
                  title="INNER CIRCLE · TRADING"
                  subtitle="Ejecutar con sistema profesional, no con intuición."
                  items={tradingItems}
                  orbitalSide="left"
                />
              </div>

              <div className="mt-3.5 rounded-2xl border border-[#2A2A2A] bg-[#10171A] p-4 sm:p-5 flex items-start gap-3">
                <div className="rounded-md border border-[#2A2A2A] bg-[#152126] p-1.5 mt-0.5">
                  <Lightbulb className="w-4 h-4 text-[#7DD4C0]" />
                </div>
                <p className="text-sm sm:text-base text-[#BAD2D8] leading-relaxed">
                  ¿Entraste por un solo camino base? Te recomendamos completar también
                  el otro (Inversiones o Trading) para aprovechar al máximo el material
                  del círculo. No es obligatorio, pero potencia tu progreso.
                </p>
              </div>
            </div>
          </section>

          <section className="py-12 sm:py-14 lg:py-15">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="type-display-sm mb-6">
                ACCESO Y REQUISITOS
              </h2>

              <article className="rounded-2xl border border-[#2A2A2A] bg-[linear-gradient(180deg,#141414,#101010)] p-5 sm:p-6 mb-4">
                <h3 className="type-headline mb-2">
                  REQUISITOS PREVIOS
                </h3>
                <p className="text-[#AAAAAA] mb-4 leading-relaxed">
                  Para acceder al Inner Circle necesitás haber completado UNO de estos dos caminos base:
                </p>
                <div className="grid md:grid-cols-2 gap-3 sm:gap-4 mb-3">
                  <div className="rounded-xl border border-[#2A2A2A] bg-[#0E0E0E] px-4 py-3.5 text-sm text-[#D0D0D0]">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#7DD4C0] font-semibold mb-1.5">
                      Inversiones
                    </p>
                    Kickstart Investment + Expert Investment
                  </div>
                  <div className="rounded-xl border border-[#2A2A2A] bg-[#0E0E0E] px-4 py-3.5 text-sm text-[#D0D0D0]">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#7DD4C0] font-semibold mb-1.5">
                      Trading
                    </p>
                    Kickstart Trading + Trading Lab
                  </div>
                </div>
                <p className="text-xs text-[#7E7E7E]">
                  Recomendado: completar también el otro camino para aprovechar al máximo el material del círculo.
                </p>
              </article>

              <article className="rounded-2xl border border-[#5BB8D4]/35 bg-[linear-gradient(180deg,#132229,#101A1E)] p-5 sm:p-6 shadow-[0_14px_35px_rgba(7,23,28,0.35)]">
                <p className="text-xs uppercase tracking-[0.18em] text-[#7DD4C0] font-semibold mb-2">
                  Cómo funciona el acceso al Inner Circle
                </p>
                <p className="text-[#CFE4EA] text-sm mb-5 leading-relaxed">
                  Tres momentos, claros y sin letra chica.
                </p>

                <div className="grid md:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div className="rounded-xl border border-[#7DD4C0]/30 bg-[#0E1A1E] p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#7DD4C0] font-bold mb-1.5">
                      Paso 1 · Comprás el Inner Circle
                    </p>
                    <p className="text-[#E5F6FA] text-sm font-semibold mb-2">
                      Pago único · 12 meses de acceso a los 3 cursos
                    </p>
                    <ul className="text-[#CFE4EA] text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-[#7DD4C0] mt-0.5">•</span>
                        <span>Inversiones · Flowdex Portfolio Method</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7DD4C0] mt-0.5">•</span>
                        <span>Trading · ORB Breakout (con indicador propio en TradingView)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7DD4C0] mt-0.5">•</span>
                        <span>Obra Maestra · 10 módulos de desarrollo personal y psicología (+ 7 anexos descargables)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7DD4C0] mt-0.5">•</span>
                        <span>Primer mes de membresía mensual activado automáticamente</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-[#7DD4C0]/30 bg-[#0E1A1E] p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#7DD4C0] font-bold mb-1.5">
                      Paso 2 · Activás la membresía mensual ($50/mes)
                    </p>
                    <p className="text-[#E5F6FA] text-sm font-semibold mb-2">
                      Acceso completo al canal privado del Inner Circle
                    </p>
                    <ul className="text-[#CFE4EA] text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-[#7DD4C0] mt-0.5">•</span>
                        <span>Subís tus trades y recibís feedback rápido del equipo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7DD4C0] mt-0.5">•</span>
                        <span>12 sesiones grupales mensuales en vivo con Franco y Augusto (3 por semana)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7DD4C0] mt-0.5">•</span>
                        <span>Revisión personal 1 a 1 cuando el caso lo amerita</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7DD4C0] mt-0.5">•</span>
                        <span>Primer mes sin costo · Cancelable cuando quieras</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-[#284852] bg-[#0B1417] p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#8FA9B1] font-bold mb-1.5">
                      Si pausás la membresía
                    </p>
                    <p className="text-[#CFE4EA] text-sm mb-3">
                      Conservás lo del Paso 1, perdés lo del Paso 2.
                    </p>
                    <ul className="text-[#A7BCC2] text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-[#7DD4C0] mt-0.5">✓</span>
                        <span>Mantenés acceso al material del Inner Circle por los 12 meses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#7DD4C0] mt-0.5">✓</span>
                        <span>Seguís en el canal de tu disciplina base (Trading o Inversiones)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#8FA9B1] mt-0.5">✗</span>
                        <span>Sin acceso al canal del Inner Circle ni a sus reviews y sesiones</span>
                      </li>
                    </ul>
                    <p className="text-[11px] text-[#7B969F] mt-3 leading-relaxed">
                      Cuando renovás la membresía, recuperás el acceso completo al círculo sin trámite.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#7B969F]">
                  Pago seguro vía Mercado Pago y criptomonedas
                </p>
              </article>
            </div>
          </section>

          <section className="py-12 sm:py-14 lg:py-15">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="type-display-sm mb-6 text-center">
                PREGUNTAS FRECUENTES
              </h2>

              <div className="rounded-2xl border border-[#2A2A2A] bg-[linear-gradient(180deg,#131313,#101010)] px-5 sm:px-6 shadow-[0_14px_30px_rgba(0,0,0,0.22)]">
                <Accordion type="single" collapsible>
                  {faqs.map((faq) => (
                    <AccordionItem key={faq.q} value={faq.q} className="border-[#2A2A2A]">
                      <AccordionTrigger className="text-white text-left hover:no-underline py-5 text-base">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-[#A8A8A8] leading-relaxed pb-5">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          <section className="py-14 sm:py-18">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(180deg,#131313,#0E0E0E)] p-8 sm:p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.35)] relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#5BB8D4]/75 via-[#7DD4C0]/70 to-transparent" />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
                  <OrbitalIcon size={520} animate={false} />
                </div>
                <h2 className="relative type-display-sm mb-3">
                  Aplicación Inner Circle
                </h2>
                <p className="text-[#A7BFC6] text-base sm:text-lg mb-2">
                  Cupos limitados para sostener el seguimiento personalizado
                </p>
                <p className="text-[#7B969F] text-sm sm:text-base mb-6 max-w-2xl mx-auto leading-relaxed">
                  Las reviews y sesiones in-depth las hacemos personalmente Franco y Augusto. Sin moderadores intermedios.
                </p>

                <Link
                  href="/checkout/inner-circle"
                  className="inline-flex items-center justify-center py-3.5 px-8 text-base font-semibold text-[#0A0A0A] rounded-xl shadow-[0_10px_28px_rgba(91,184,212,0.28)]"
                  style={{
                    background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)",
                  }}
                >
                  ACTIVAR MI ACCESO
                </Link>

                <p className="text-xs text-[#7B7B7B] mt-3.5">
                  Ingresás si cumplís requisitos y hay lugar en la edición activa
                </p>
              </div>
          </div>
          {/* Sentinel: marca el final del contenido (mobile sticky se oculta al entrar) */}
          <div ref={bottomSentinelRef} aria-hidden className="h-px w-px" />
        </section>
      </div>

      <div
        aria-hidden={!showStickyCta}
        className={`fixed bottom-4 left-4 right-4 z-40 sm:hidden transition-opacity duration-300 ${
          showStickyCta ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <Link
          href="/checkout/inner-circle"
          tabIndex={showStickyCta ? 0 : -1}
          className="flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-[#0A0A0A] shadow-[0_10px_28px_rgba(91,184,212,0.35)]"
          style={{
            background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)",
          }}
        >
          Aplicar ahora
        </Link>
      </div>
    </main>
  )
}
