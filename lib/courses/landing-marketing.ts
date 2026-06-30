// Copy de marketing por curso para las landings públicas /cursos/[slug].
//
// Concentra: keywords del research SEO, copy del hero, mentor, precios ancla,
// mastery criterion ("Sabés que lo lográs cuando..."), notFor ("No es para vos
// si..."), pilares de la metodología, outcomes y FAQ general para JSON-LD.
// Separado de landing-syllabus.ts (que tiene el contenido pedagógico).

import { getCourseBySlug } from "@/lib/courses/catalog"

export type MentorRef = {
  slug: "franco" | "augusto"
  name: string
  role: string
  photo: string
  // Link al track record (Franco) o sección del home (Augusto).
  href: string
  bio: string
  specialties: string[]
  // Insignia destacada con número grande + descripción corta (alimenta una pill
  // visual en la mentor card). Para Franco: total evaluaciones aprobadas. Para
  // Augusto: autoría del método propio.
  badge: { value: string; label: string }
  quote: string
  // CTA del botón con borde dentro de la mentor card.
  ctaLabel: string
}

export const MENTORS: Record<"franco" | "augusto", MentorRef> = {
  franco: {
    slug: "franco",
    name: "Franco Escudero",
    role: "Trader Profesional · Desarrollador de la Estrategia ORB Breakout",
    photo: "/francoblancoynegro.jpg",
    href: "/track-record",
    bio: "Más de 10 años operando con método propio sobre futuros US. Lidera el programa de Trading de Flowdex y desarrolla los sistemas que se enseñan adentro. Resultados consistentes y verificables en prop firms con evaluaciones aprobadas y payouts cobrados.",
    specialties: [
      "Estrategia ORB Breakout · método propio sobre futuros US",
      "Operativa intradía sobre MES y MNQ",
      "FVG, Volume Profile y lectura de liquidez institucional",
      "Prop Firms: evaluación, gestión de drawdown y payout",
    ],
    badge: { value: "46+", label: "Evaluaciones aprobadas en prop firms" },
    quote: "El mercado premia la constancia y castiga la impaciencia.",
    ctaLabel: "Ver track record verificable",
  },
  augusto: {
    slug: "augusto",
    name: "Augusto Holman",
    role: "Director de Inversiones · Creador del Flowdex Portfolio Method",
    photo: "/augustoblancoynegro.jpg",
    href: "/#mentors",
    bio: "Cinco años formando inversores que llegan exclusivamente por recomendación, sin redes ni publicidad. Combina análisis fundamental, lectura macroeconómica y disciplina de capital para construir carteras que se sostienen en el tiempo.",
    specialties: [
      "Análisis Fundamental Avanzado · WACC, ROIC y MOAT",
      "Flowdex Portfolio Method · construcción y gestión de portafolios",
      "Estrategias clásicas: Value, Growth, All Weather, CAN SLIM",
      "Lectura macroeconómica aplicada a decisiones de capital",
    ],
    badge: { value: "FPM", label: "Creador del Flowdex Portfolio Method" },
    quote: "La diferencia entre perder y ganar está en el proceso, no en la suerte.",
    ctaLabel: "Conocer al equipo",
  },
}

export type HeroStat = {
  value: string
  label: string
}

export type Pillar = {
  title: string
  description: string
}

export type CourseLandingMarketing = {
  slug: string
  intent: "principiante" | "intermedio" | "avanzado"
  // SEO
  seoTitle: string
  seoDescription: string
  primaryKeyword: string
  secondaryKeywords: string[]
  // Hero
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  // Mentor del curso
  mentor: "franco" | "augusto"
  // Honestidad anti-hype
  notFor: string
  // Criterio de éxito mensurable
  masteryCriterion: string
  // Stats numéricos del hero (4 chips)
  heroStats: HeroStat[]
  // Listas largas
  forWhom: string[]
  includes: string[]
  outcomes: string[]
  // Pilares de por qué funciona la metodología (3-4)
  pillars: Pillar[]
  // Si este curso es Kickstart con upgrade real al curso avanzado (paga solo
  // diferencia de $200). Solo Kickstart Trading y Kickstart Investment lo
  // tienen — Trading Lab / Expert Investment NO tienen upgrade equivalente
  // a Inner Circle (este último se compra full price).
  hasUpgradeOffer?: boolean
  // Próximo nivel
  nextLevel?: { slug: string; name: string; pitch: string }
  // Nivel anterior (si aplica) para CTA "vení desde acá"
  previousLevel?: { slug: string; name: string; pitch: string }
  // Meta final (Inner Circle) — solo en los Kickstart, para mostrar el camino
  // completo de tres niveles. En los avanzados, el nextLevel ya es IC, así
  // que este campo queda vacío.
  finalGoal?: { slug: string; name: string; pitch: string }
  // Colores principales de la marca del curso
  brandColor: { from: string; to: string; accent: string }
}

export const COURSE_LANDING_MARKETING: Record<string, CourseLandingMarketing> = {
  "kickstart-trading": {
    slug: "kickstart-trading",
    intent: "principiante",
    seoTitle: "Curso de Trading desde Cero | Kickstart Trading Flowdex",
    seoDescription:
      "Curso de trading desde cero con clases en vivo y mentor real. Aprendé estructura de mercado, gestión de riesgo y operación de futuros US con metodología Flowdex.",
    primaryKeyword: "curso de trading desde cero",
    secondaryKeywords: [
      "trading desde cero",
      "aprender trading desde cero",
      "trading para principiantes",
      "curso de trading online",
      "cómo empezar a hacer trading",
      "curso de trading con mentoría",
      "broker trading",
    ],
    heroEyebrow: "Nivel Inicial · Trading",
    heroTitle: "Curso de Trading desde Cero",
    heroSubtitle:
      "La base completa para operar futuros US con criterio profesional desde el día uno. Clases en vivo, mentor que te corrige antes de que pierdas dinero y una metodología clara que no depende de gurúes.",
    mentor: "franco",
    notFor:
      "buscás ganancias rápidas sin estudiar proceso, riesgo ni disciplina, o esperás señales para copiar.",
    masteryCriterion:
      "Operás una semana entera siguiendo tu plan escrito, calculás riesgo antes de cada entrada y tu journal del trader cierra sin huecos.",
    heroStats: [
      { value: "4", label: "Módulos pedagógicos" },
      { value: "EN VIVO", label: "Clases grupales semanales" },
      { value: "EXAMEN", label: "Validación por módulo" },
      { value: "DISCORD", label: "Comunidad privada" },
    ],
    forWhom: [
      "Nunca operaste y querés arrancar sin caer en los errores del 90% que pierde el primer año.",
      "Tradeás por impulso. Necesitás pasar de la improvisación a la operativa profesional con proceso y método.",
      "Probaste cursos gratuitos de YouTube y te quedaste con piezas sueltas que no se conectan.",
      "Buscás rumbo claro hacia operar una prop firm (Apex, Topstep, MFFU) con criterio profesional.",
    ],
    includes: [
      "4 módulos pedagógicos en plataforma propia, en orden estructurado",
      "Clases en vivo grupales semanales con Franco",
      "Comunidad privada en Discord para dudas y peer learning",
      "Examen final por módulo para validar comprensión antes de avanzar",
      "Setup completo de TradingView, broker y plataforma paso a paso",
      "Journal del trader integrado al sitio para registrar tus operaciones",
    ],
    outcomes: [
      "Entender cómo funcionan los mercados de futuros y Forex sin mitos.",
      "Leer un gráfico con criterio: estructura, soportes, resistencias, velas.",
      "Calcular tu riesgo por trade antes de tocar el botón de comprar o vender.",
      "Armar un plan de trading personal y un journal que mejore con el tiempo.",
      "Saber qué es una prop firm y cómo prepararte para una evaluación.",
    ],
    pillars: [
      {
        title: "Clases en vivo, no video on-demand",
        description:
          "Aprendés con clases grupales semanales con Franco. Preguntás en vivo y resolvés dudas el mismo día, no en un foro asincrónico.",
      },
      {
        title: "Mentor con track record verificable",
        description:
          "Franco no es un gurú anónimo. Tiene track record público de evaluaciones aprobadas en prop firms reales.",
      },
      {
        title: "Metodología completa, no piezas sueltas",
        description:
          "4 módulos diseñados pedagógicamente. Cada bloque construye sobre el anterior, sin saltos ni huecos.",
      },
      {
        title: "Sistema de exámenes para validar",
        description:
          "No avanzás a ciegas. Cada módulo cierra con un examen real que valida que entendiste antes de seguir.",
      },
    ],
    hasUpgradeOffer: true,
    nextLevel: {
      slug: "trading-lab",
      name: "Trading Lab",
      pitch:
        "El siguiente nivel: lectura institucional, Fair Value Gaps, Volume Profile y preparación táctica para prop firms. Si tenés Kickstart, sólo pagás $200 adicionales.",
    },
    finalGoal: {
      slug: "inner-circle",
      name: "Inner Circle",
      pitch:
        "La meta final del camino: programa premium con mentoría intensiva, comunidad cerrada, indicadores propios en TradingView y revisión personalizada de tus trades cada semana.",
    },
    brandColor: { from: "#5BB8D4", to: "#7DD4C0", accent: "#7DD4C0" },
  },
  "trading-lab": {
    slug: "trading-lab",
    intent: "avanzado",
    seoTitle: "Curso de Trading de Futuros US | Trading Lab Flowdex",
    seoDescription:
      "Curso avanzado de trading de futuros US con lectura institucional, Fair Value Gaps, Volume Profile y preparación para prop firms como Apex y Topstep.",
    primaryKeyword: "curso de trading de futuros",
    secondaryKeywords: [
      "trading de futuros S&P 500",
      "trading de futuros Nasdaq",
      "curso de futuros US en español",
      "curso para prop firm",
      "preparación Apex Topstep",
      "trading institucional español",
      "MES MNQ trading",
    ],
    heroEyebrow: "Nivel Avanzado · Trading",
    heroTitle: "Trading Lab: Futuros US con Lectura Institucional",
    heroSubtitle:
      "Para traders que ya saben los fundamentos y quieren operar con enfoque institucional. Fair Value Gaps, Volume Profile, liquidez avanzada y preparación táctica para aprobar evaluaciones de prop firms.",
    mentor: "franco",
    notFor:
      "buscás señales de compra/venta para copiar y operar sin plan propio, o estás arrancando de cero sin base previa.",
    masteryCriterion:
      "Leés el contexto institucional de un activo en multi-timeframe antes de operarlo y aprobás tu primera evaluación de prop firm sin violar reglas.",
    heroStats: [
      { value: "4", label: "Módulos avanzados" },
      { value: "EN VIVO", label: "Clases grupales semanales" },
      { value: "EXAMEN", label: "Validación por módulo" },
      { value: "PROP", label: "Preparación Apex / Topstep" },
    ],
    forWhom: [
      "Ya hiciste Kickstart Trading u otro curso introductorio y necesitás el siguiente paso real.",
      "Operás futuros y querés entender qué hacen las instituciones detrás del precio.",
      "Te estás preparando para una prop firm (Apex, Topstep, MFFU) y buscás método específico.",
      "Tenés plan operativo pero te falta la lectura de contexto que da consistencia.",
    ],
    includes: [
      "4 módulos de contenido institucional avanzado",
      "Clases en vivo grupales semanales con Franco y análisis de mercado en tiempo real",
      "Comunidad privada en Discord para discusión entre pares avanzados",
      "Examen final por módulo para fijar conceptos antes de avanzar",
      "Material de preparación específico para Apex, Topstep y MFFU",
      "Acceso a journal del trader para registrar tu progreso",
    ],
    outcomes: [
      "Identificar Fair Value Gaps de los 4 tipos y operarlos con criterio.",
      "Leer Volume Profile completo: POC, VAH, VAL y los 5 perfiles de Dalton.",
      "Detectar barridos de liquidez, equal highs/lows e inducement institucional.",
      "Construir un Top-Down multi-timeframe que ordene tu decisión de entrada.",
      "Operar una prop firm con conciencia de las dos lógicas de drawdown.",
    ],
    pillars: [
      {
        title: "Lectura institucional real, no retail",
        description:
          "Aprendés lo que mueve el mercado institucional: liquidez, FVG, Volume Profile. No el análisis técnico clásico que ya está en cualquier video de YouTube.",
      },
      {
        title: "Foco en futuros US (MES, MNQ)",
        description:
          "Los activos que se operan en prop firms. Sesiones grupales en vivo con análisis real del mercado aplicando el método.",
      },
      {
        title: "Preparación específica para evaluación",
        description:
          "Material puntual sobre las dos lógicas de drawdown (Apex vs Topstep) y cómo gestionar cada una sin fallar.",
      },
      {
        title: "Sistema de exámenes por módulo",
        description:
          "Cada bloque cierra con un examen real que valida que entendiste antes de avanzar al siguiente. No se progresa a ciegas.",
      },
    ],
    nextLevel: {
      slug: "inner-circle",
      name: "Inner Circle",
      pitch:
        "El programa premium: mentoría intensiva, comunidad cerrada, indicadores propios en TradingView y revisión personalizada de tus trades cada semana.",
    },
    previousLevel: {
      slug: "kickstart-trading",
      name: "Kickstart Trading",
      pitch:
        "Si recién arrancás, este es el punto natural de entrada antes de Trading Lab. 4 módulos con clases en vivo semanales con Franco para armar tu plan operativo y la base de gestión de riesgo.",
    },
    brandColor: { from: "#7DD4C0", to: "#D4B86A", accent: "#7DD4C0" },
  },
  "kickstart-investment": {
    slug: "kickstart-investment",
    intent: "principiante",
    seoTitle: "Curso de Inversión desde Cero | Kickstart Investment Flowdex",
    seoDescription:
      "Curso de inversión desde cero en español. Aprendé a armar tu primera cartera con criterio, evaluar bonos, ETFs, CEDEARs y acciones, sin promesas vacías.",
    primaryKeyword: "curso de inversión desde cero",
    secondaryKeywords: [
      "aprender a invertir desde cero",
      "cómo empezar a invertir",
      "fondos de inversión",
      "fondos indexados",
      "ETFs para principiantes",
      "invertir en bolsa principiantes",
      "curso de inversiones online",
    ],
    heroEyebrow: "Nivel Inicial · Inversión",
    heroTitle: "Curso de Inversión desde Cero",
    heroSubtitle:
      "Para personas que nunca invirtieron o que invierten por impulso. Aprendé a armar tu primera cartera con criterio, sin gurúes, sin atajos. Con clases en vivo y un mentor que te ayuda a ordenar el patrimonio antes de mover el primer peso.",
    mentor: "augusto",
    notFor:
      "buscás picks calientes para hacer dinero rápido sin entender el riesgo, o esperás recomendaciones para copiar sin construir criterio propio.",
    masteryCriterion:
      "Pasás una semana sin mirar el mercado y tu plan sigue teniendo sentido. Justificás cada activo de tu cartera en una frase.",
    heroStats: [
      { value: "4 + 1", label: "Módulos + Apertura" },
      { value: "EN VIVO", label: "Clases grupales semanales" },
      { value: "EXAMEN", label: "Validación por módulo" },
      { value: "DISCORD", label: "Comunidad privada" },
    ],
    forWhom: [
      "Nunca invertiste y no querés perder dinero con la primera decisión.",
      "Tenés ahorros parados que pierden contra inflación y no sabés por dónde empezar.",
      "Invertís por recomendaciones de amigos o influencers y querés tomar decisiones propias.",
      "Querés ordenar tus finanzas personales antes de mover el primer peso al mercado.",
    ],
    includes: [
      "4 módulos pedagógicos + Apertura Estratégica en plataforma propia",
      "Clases en vivo grupales semanales con Augusto",
      "Comunidad privada en Discord para consultas entre pares",
      "Setup de cuenta en broker e instrumentos paso a paso",
      "Examen final por módulo para validar comprensión antes de avanzar",
      "Hoja de ruta para armar tu primera cartera real",
    ],
    outcomes: [
      "Tener tus finanzas personales ordenadas antes de invertir.",
      "Conocer tu perfil de inversor real y qué instrumentos te calzan.",
      "Entender el ecosistema argentino (BYMA, CEDEARs, FCIs) y el global (NYSE, NASDAQ, S&P 500, ETFs).",
      "Distinguir renta fija de renta variable y elegir según tu horizonte.",
      "Tomar tu primera decisión de inversión con criterio propio.",
    ],
    pillars: [
      {
        title: "Orden patrimonial antes de invertir",
        description:
          "El curso arranca por finanzas personales, fondo de emergencia y perfil de inversor. No te tiramos al mercado sin red.",
      },
      {
        title: "Argentina + mundo, no solo uno",
        description:
          "Cubrimos el ecosistema local (BYMA, CEDEARs, FCIs) y el global (NYSE, NASDAQ, S&P 500, ETFs). Vos elegís dónde armar tu cartera.",
      },
      {
        title: "Mentor que pregunta antes de responder",
        description:
          "Augusto no te da picks. Te ayuda a construir el criterio para que vos decidas con fundamentos.",
      },
      {
        title: "Sistema de exámenes para validar",
        description:
          "Cada módulo cierra con un examen real. No avanzás a ciegas: validás que entendiste antes de pasar al siguiente.",
      },
    ],
    hasUpgradeOffer: true,
    nextLevel: {
      slug: "expert-investment",
      name: "Expert Investment",
      pitch:
        "El siguiente nivel: análisis fundamental, valuación, dividendos, REITs y construcción profesional de cartera. Si tenés Kickstart, sólo pagás $200 adicionales.",
    },
    finalGoal: {
      slug: "inner-circle",
      name: "Inner Circle",
      pitch:
        "La meta final del camino: programa premium con mentoría intensiva, doble acceso (Inversiones + Trading) y revisión personalizada de tu cartera.",
    },
    brandColor: { from: "#5BB8D4", to: "#A9B8FF", accent: "#5BB8D4" },
  },
  "expert-investment": {
    slug: "expert-investment",
    intent: "avanzado",
    seoTitle: "Curso de Estrategias de Inversión y Construcción de Cartera | Flowdex",
    seoDescription:
      "Curso avanzado de estrategias de inversión: análisis fundamental, las 7 estrategias clásicas (All Weather, Value, Growth), valuación, dividendos, REITs y construcción profesional de cartera.",
    primaryKeyword: "estrategias de inversión",
    secondaryKeywords: [
      "curso de construcción de cartera",
      "cartera de inversión",
      "cómo armar una cartera de inversión",
      "asset allocation curso español",
      "curso de análisis fundamental",
      "curso de inversión avanzado",
      "All Weather Buy and Hold Value",
    ],
    heroEyebrow: "Nivel Avanzado · Inversión",
    heroTitle: "Curso de Estrategias de Inversión: las 7 que funcionan hace décadas",
    heroSubtitle:
      "Pasá de invertir por intuición a construir cartera con método. Análisis fundamental real, asset allocation y las siete estrategias clásicas que validan inversores institucionales hace generaciones.",
    mentor: "augusto",
    notFor:
      "querés copiar picks sin entender fundamentos ni construir criterio propio, o esperás un atajo para hacer dinero rápido.",
    masteryCriterion:
      "Leés un balance, un earnings report y un escenario macro para armar una tesis defendible en una página. Validás picks ajenos en vez de copiarlos.",
    heroStats: [
      { value: "4", label: "Módulos avanzados" },
      { value: "EN VIVO", label: "Clases grupales semanales" },
      { value: "EXAMEN", label: "Validación por módulo" },
      { value: "7", label: "Estrategias clásicas" },
    ],
    forWhom: [
      "Ya hiciste Kickstart Investment u otro curso inicial y querés profundizar.",
      "Invertís con cartera propia pero te falta criterio para evaluar empresas individuales.",
      "Querés entender cómo construir una cartera robusta para el largo plazo.",
      "Te interesan estrategias profesionales como All Weather, Value Investing o Magic Formula.",
    ],
    includes: [
      "4 módulos avanzados en plataforma propia",
      "Clases en vivo grupales semanales con Augusto y casos reales del mercado",
      "Comunidad privada en Discord para discusión entre pares avanzados",
      "Examen final por módulo para fijar conceptos antes de avanzar",
      "Lectura de Earnings y análisis fundamental aplicado a empresas reales",
      "Material sobre las 7 estrategias clásicas validadas por inversores institucionales",
    ],
    outcomes: [
      "Hacer análisis fundamental real: estados financieros, ratios, valuación.",
      "Calcular WACC y ROIC para evaluar la calidad de una empresa.",
      "Leer reportes de Earnings y la guía forward de empresas listadas.",
      "Construir y rebalancear una cartera con correlación y ponderación adecuadas.",
      "Identificar y desactivar sesgos cognitivos en decisiones de capital.",
    ],
    pillars: [
      {
        title: "Las 7 estrategias clásicas validadas",
        description:
          "All Weather, Buy & Hold, Value, Growth, Magic Formula, Piotroski, CAN SLIM. Estrategias usadas por inversores institucionales hace décadas, explicadas y aplicadas.",
      },
      {
        title: "Análisis fundamental real",
        description:
          "Estados financieros, ratios, WACC, ROIC, MOAT. No solo teoría: cómo aplicarlo para tomar decisiones reales.",
      },
      {
        title: "Construcción y rebalanceo de cartera",
        description:
          "Cómo armar el portfolio con correlación y ponderación adecuadas. Cuándo rebalancear sin sobrerreaccionar al ruido del mercado.",
      },
      {
        title: "Disciplina mental aplicada al capital",
        description:
          "Sesgos cognitivos, decisiones bajo incertidumbre, gestión emocional de la cartera. Lo que separa al inversor del especulador.",
      },
    ],
    nextLevel: {
      slug: "inner-circle",
      name: "Inner Circle",
      pitch:
        "El programa premium con mentoría intensiva, doble acceso (Inversiones + Trading) y revisión personalizada de tu cartera.",
    },
    previousLevel: {
      slug: "kickstart-investment",
      name: "Kickstart Investment",
      pitch:
        "Si recién arrancás con inversiones, este es el punto natural de entrada antes de Expert Investment. 4 módulos con clases en vivo semanales con Augusto y la hoja de ruta para armar tu primera cartera con criterio.",
    },
    brandColor: { from: "#5BB8D4", to: "#D4B86A", accent: "#5BB8D4" },
  },
}

/**
 * FAQ general de Flowdex aplicable a todas las landings de cursos. Las
 * preguntas son las mismas que rendea <FAQ /> en la home (definidas en
 * lib/language-context.tsx). Las duplicamos acá para poder generar JSON-LD
 * FAQPage server-side sin meter "use client" al componente.
 */
export const GENERAL_FAQ_QA: Array<{ q: string; a: string }> = [
  {
    q: "¿Necesito experiencia previa para empezar?",
    a: "No, nuestros cursos Kickstart están diseñados para principiantes absolutos. Te guiamos paso a paso desde los fundamentos.",
  },
  {
    q: "¿Cuál es la diferencia entre Inversión y Trading?",
    a: "Inversión construye patrimonio a largo plazo con análisis fundamental y gestión de portafolios. Trading opera mercados en marcos temporales cortos con sistemas estructurados y gestión profesional de riesgo.",
  },
  {
    q: "¿Puedo hacer upgrade entre niveles?",
    a: "Sí, si compraste Kickstart podés hacer upgrade al nivel avanzado pagando solo la diferencia ($200 USD).",
  },
  {
    q: "¿Cómo accedo al contenido después de pagar?",
    a: "Recibís acceso inmediato al contenido completo en la plataforma. En Telegram vas a encontrar contenido adicional, novedades y extras para alumnos.",
  },
  {
    q: "¿Los precios están en USD? ¿Puedo pagar en pesos?",
    a: "Sí, los precios están en USD. MercadoPago te muestra el equivalente en pesos al momento del pago. También aceptamos pagos en criptomonedas a través de NowPayments.",
  },
  {
    q: "¿Qué plataformas necesito para el curso de Trading?",
    a: "Necesitás TradingView (versión gratuita funciona) y un broker. Te enseñamos a configurar todo en el curso.",
  },
]

/**
 * FAQ adaptada al nivel del curso.
 *
 * Los cursos avanzados (Expert Investment, Trading Lab) requieren base previa,
 * así que la pregunta "¿Necesito experiencia previa?" no puede responderse con
 * el "no" genérico que vale para los Kickstart. Esta función ajusta esa
 * respuesta puntual y, cuando hay un previousLevel definido, lo nombra
 * explícitamente como punto natural de entrada.
 *
 * El resto de las preguntas se mantienen igual para todos los cursos.
 */
export function getCourseFaq(marketing: {
  intent: "principiante" | "intermedio" | "avanzado"
  previousLevel?: { slug: string; name: string; pitch: string }
}): Array<{ q: string; a: string }> {
  const isAdvanced = marketing.intent === "avanzado"
  const prevName = marketing.previousLevel?.name

  const prereqAnswer = !isAdvanced
    ? "No, nuestros cursos Kickstart están diseñados para principiantes absolutos. Te guiamos paso a paso desde los fundamentos."
    : prevName
      ? `Sí, este curso es de nivel avanzado. Te recomendamos haber completado ${prevName} o tener conocimiento equivalente antes de arrancar. Si recién estás empezando, el punto natural de entrada es ${prevName}.`
      : "Sí, este curso es de nivel avanzado y requiere base previa. Te recomendamos haber completado un Kickstart o tener conocimiento equivalente antes de arrancar."

  return GENERAL_FAQ_QA.map((item) =>
    item.q === "¿Necesito experiencia previa para empezar?"
      ? { q: item.q, a: prereqAnswer }
      : item,
  )
}

export function getCourseLandingMarketing(slug: string): CourseLandingMarketing | null {
  return COURSE_LANDING_MARKETING[slug] ?? null
}

export function getPublicCourseSlugs(): string[] {
  return Object.keys(COURSE_LANDING_MARKETING)
}

export function getCourseLandingFullData(slug: string) {
  const marketing = getCourseLandingMarketing(slug)
  const catalog = getCourseBySlug(slug)

  if (!marketing || !catalog) return null

  return {
    ...marketing,
    name: catalog.name,
    price: catalog.price,
    currency: catalog.currency,
    mentorRef: MENTORS[marketing.mentor],
  }
}
