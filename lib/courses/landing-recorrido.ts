/**
 * Datos para la sección "Recorrido del programa" de cada página de curso.
 *
 * Esta sección es independiente del "Temario completo" lateral. Acá cada módulo
 * tiene su propio card con: badge (PRE / M1 / M2…), título, subtítulo, ícono
 * principal y una lista de secciones internas con mini ícono + descripción
 * persuasiva opcional.
 *
 * Filosofía editorial:
 * - Mostrar la ESTRUCTURA y el VALOR de cada módulo (qué se ve, por qué importa).
 * - NO revelar el cómo pedagógico ni el detalle técnico que un competidor pueda copiar.
 * - Usar íconos profesionales de Lucide, nunca emojis (mantiene seriedad).
 */
import {
  BookOpen,
  Compass,
  Globe2,
  GraduationCap,
  Layers,
  Coins,
  Map,
  PieChart,
  Target,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Brain,
  Briefcase,
  Banknote,
  Building2,
  LineChart,
  ScrollText,
  Sparkles,
  Activity,
  Calculator,
  Award,
  BarChart3,
  CandlestickChart,
  Zap,
  Clock,
  type LucideIcon,
} from "lucide-react"

export type RecorridoSection = {
  label: string
  icon: LucideIcon
  /** Mini descripción persuasiva. Opcional: si falta, el card lo muestra como chip simple. */
  description?: string
}

export type RecorridoModule = {
  /** Etiqueta corta: "PRE", "M1", "M2", "M3", "M4" */
  badge: string
  title: string
  subtitle: string
  icon: LucideIcon
  sections: RecorridoSection[]
  /** Opcional: bloque "Qué te llevás" al final del card. */
  takeaway?: string
  /**
   * Carga académica estimada del módulo en horas. Incluye lectura del material
   * pedagógico + práctica asociada + estudio del examen del módulo. NO incluye
   * las clases grupales en vivo (que son transversales al programa y se suman
   * aparte en el total). Si todos los módulos del curso definen `hours`, la
   * sección "Recorrido del programa" muestra automáticamente la carga total
   * estimada del programa en el subtítulo.
   */
  hours?: number
}

export const COURSE_RECORRIDO: Record<string, RecorridoModule[]> = {
  // ============================================================
  // KICKSTART INVESTMENT
  // ============================================================
  // M1 está completamente desarrollado (sections + descripciones).
  // PRE / M2 / M3 / M4 quedan con sus divisiones reales pero sin
  // descripción detallada — se desarrollan en pasadas posteriores.
  "kickstart-investment": [
    {
      badge: "PRE",
      title: "Apertura Estratégica",
      subtitle: "Fundamentos esenciales antes de invertir",
      icon: Compass,
      hours: 5,
      sections: [
        {
          label: "Finanzas personales y orden patrimonial",
          icon: Wallet,
          description: "Ordená tu plata antes de mover el primer peso al mercado.",
        },
        {
          label: "Tasa de rendimiento e interés compuesto",
          icon: TrendingUp,
          description: "El motor matemático que separa al inversor del especulador.",
        },
        {
          label: "Colchón de emergencia y deudas",
          icon: ShieldCheck,
          description: "La red de seguridad que evita que el mercado te haga daño.",
        },
        {
          label: "Mentalidad del inversor",
          icon: Brain,
          description: "Por qué el comportamiento pesa más que la estrategia técnica.",
        },
      ],
    },
    {
      badge: "M1",
      title: "Mercados",
      subtitle: "Conocé los activos donde opera el capital",
      icon: Globe2,
      hours: 5,
      sections: [
        {
          label: "Glosario base del inversor",
          icon: BookOpen,
          description: "Vocabulario que vas a leer y usar todos los días al operar.",
        },
        {
          label: "Los seis mercados globales",
          icon: Map,
          description: "Dónde se mueve el capital y qué se opera en cada uno.",
        },
        {
          label: "Lectura por perfil",
          icon: Target,
          description: "Cuándo conviene cada mercado según tu horizonte y capital.",
        },
        {
          label: "Primer mapa de portafolio",
          icon: PieChart,
          description: "Estructura inicial para diversificar con criterio.",
        },
      ],
    },
    {
      badge: "M2",
      title: "Inversión e Instrumentos",
      subtitle: "El primer escalón hacia los mercados",
      icon: Layers,
      hours: 6,
      sections: [
        {
          label: "Invertir vs. especular",
          icon: Target,
          description: "La diferencia que define tu rumbo y tu nivel de riesgo real.",
        },
        {
          label: "Renta fija y renta variable",
          icon: Banknote,
          description: "Los dos pilares de toda cartera y cómo combinarlos.",
        },
        {
          label: "Derivados, fondos y mercado monetario",
          icon: Briefcase,
          description: "El menú completo de instrumentos disponibles hoy.",
        },
        {
          label: "Instrumentos en moneda extranjera",
          icon: Globe2,
          description: "Cómo dolarizar tu cartera desde una cuenta argentina.",
        },
      ],
    },
    {
      badge: "M3",
      title: "Staking, FCIs y CEDEARs",
      subtitle: "Instrumentos para el inversor argentino",
      icon: Coins,
      hours: 7,
      sections: [
        {
          label: "Staking de stablecoins (Proof of Stake)",
          icon: Coins,
          description: "Rendimiento en dólares digitales con riesgo controlado.",
        },
        {
          label: "Fondos Comunes de Inversión en Argentina",
          icon: Building2,
          description: "Diversificación profesional accesible desde cualquier broker local.",
        },
        {
          label: "CEDEARs: mercado global desde una cuenta local",
          icon: Globe2,
          description: "Las empresas más grandes del mundo, en pesos y desde Argentina.",
        },
        {
          label: "Cobertura inflacionaria con CEDEARs",
          icon: ShieldCheck,
          description: "Cómo proteger tu poder adquisitivo contra la inflación local.",
        },
      ],
    },
    {
      badge: "M4",
      title: "Tipos de Inversor e Inversión en Acciones",
      subtitle: "Conocerte a vos mismo para invertir mejor",
      icon: GraduationCap,
      hours: 10,
      sections: [
        {
          label: "Identificación de tu perfil real",
          icon: Target,
          description: "Qué tipo de inversor sos y qué cartera te corresponde.",
        },
        {
          label: "Clasificación de acciones (capitalización, sector, estilo)",
          icon: Layers,
          description: "Mapa para entender qué hay detrás de cada ticker.",
        },
        {
          label: "Lectura de una empresa: las tres ventanas",
          icon: ScrollText,
          description: "Cómo mirar un balance, resultados y cash flow sin ser contador.",
        },
        {
          label: "Análisis técnico básico aplicado al inversor",
          icon: LineChart,
          description: "Velas, tendencia y soportes para mejorar tu timing de entrada.",
        },
      ],
    },
  ],

  // ============================================================
  // EXPERT INVESTMENT
  // ============================================================
  // Curso avanzado: 4 módulos centrales, sin Apertura previa.
  // Cada módulo profundiza un eje del análisis profesional de
  // empresas y la construcción de cartera con criterio institucional.
  "expert-investment": [
    {
      badge: "M1",
      title: "Análisis Fundamental",
      subtitle: "Evaluación profesional del valor real de un activo",
      icon: BookOpen,
      hours: 8,
      sections: [
        {
          label: "Fundamentos y elementos clave del análisis",
          icon: Compass,
          description: "El método estructurado para evaluar empresas con criterio profesional.",
        },
        {
          label: "Rentabilidad, solvencia, crecimiento y cash flow",
          icon: BarChart3,
          description: "Las cuatro dimensiones que definen si una empresa vale lo que cuesta.",
        },
        {
          label: "Valor intrínseco y métodos de valuación",
          icon: Calculator,
          description: "Determinar si una acción está cara, barata o en su justo precio.",
        },
        {
          label: "Framework de scoring + señales de alerta",
          icon: ShieldCheck,
          description: "Sistema replicable para decidir entradas y detectar trampas a tiempo.",
        },
      ],
    },
    {
      badge: "M2",
      title: "Dividendos, REITs y ETFs",
      subtitle: "Flujo pasivo, calidad de ingresos y diversificación inteligente",
      icon: Banknote,
      hours: 7,
      sections: [
        {
          label: "Dividendos: base, ratios y las 4 fechas clave",
          icon: Coins,
          description: "Cómo evaluar la calidad real de un dividendo y evitar trampas.",
        },
        {
          label: "REITs: inmobiliario cotizado con flujo profesional",
          icon: Building2,
          description: "El instrumento para sumar ingreso pasivo del real estate global.",
        },
        {
          label: "ETFs: diversificación eficiente",
          icon: PieChart,
          description: "Cómo elegir entre miles y armar una columna vertebral de cartera.",
        },
        {
          label: "Estrategia combinada de income",
          icon: Sparkles,
          description: "Cómo encajar dividendos, REITs y ETFs en una sola estrategia coherente.",
        },
      ],
    },
    {
      badge: "M3",
      title: "Análisis Fundamental Avanzado",
      subtitle: "Conectar puntos, aplicar criterio y llegar a una conclusión sobre la empresa",
      icon: Brain,
      hours: 11,
      sections: [
        {
          label: "El embudo: macro, sector, empresa",
          icon: Layers,
          description: "El orden correcto para analizar antes de comprar un solo papel.",
        },
        {
          label: "WACC y ROIC: el costo y retorno real del capital",
          icon: TrendingUp,
          description: "Las dos métricas que separan empresas que crean valor de las que lo destruyen.",
        },
        {
          label: "MOAT: la ventaja competitiva sostenible",
          icon: ShieldCheck,
          description: "Por qué algunas empresas defienden márgenes y otras no.",
        },
        {
          label: "Empresa cara vs sobrevalorada + modelos de valoración",
          icon: Target,
          description: "Distinguir precio alto justificado de burbuja real con criterio profesional.",
        },
      ],
    },
    {
      badge: "M4",
      title: "Armado de Portafolio y Estrategias",
      subtitle: "Diversificación, estrategias clásicas y construcción paso a paso",
      icon: Briefcase,
      hours: 9,
      sections: [
        {
          label: "Diversificación y All Weather Portfolio (Ray Dalio)",
          icon: PieChart,
          description: "Cómo armar una cartera que aguante en cualquier escenario macro.",
        },
        {
          label: "Las 7 estrategias clásicas validadas",
          icon: Award,
          description: "Buy & Hold, Value, Growth, Magic Formula, Piotroski, CAN SLIM y dividendos.",
        },
        {
          label: "Armado de portafolio en 5 pasos",
          icon: Layers,
          description: "Proceso replicable para pasar de cero a una cartera profesional.",
        },
        {
          label: "Riesgo, rebalanceo y sesgos cognitivos",
          icon: Brain,
          description: "Lo que sostiene una cartera en el tiempo: disciplina, no genialidad.",
        },
      ],
    },
  ],

  // ============================================================
  // KICKSTART TRADING
  // ============================================================
  // Curso inicial de trading: 4 módulos centrales sin Apertura
  // previa. Construcción progresiva desde mentalidad y mercados
  // hasta gestión de capital real y primer contacto con prop firms.
  "kickstart-trading": [
    {
      badge: "M1",
      title: "Introducción al trading y los mercados",
      subtitle: "Qué es el trading, cómo funcionan los mercados y panorama de los activos",
      icon: Compass,
      hours: 5,
      sections: [
        {
          label: "Qué es el trading y mentalidad profesional",
          icon: Brain,
          description: "El trading real explicado sin promesas vacías ni atajos.",
        },
        {
          label: "Cómo funcionan los mercados (participantes, subasta, volumen)",
          icon: BarChart3,
          description: "Quién está del otro lado de tus operaciones y por qué importa entenderlo.",
        },
        {
          label: "Futuros US: CME, Globex y activos base (MES, MNQ)",
          icon: TrendingUp,
          description: "Por qué elegimos futuros y cuáles son los contratos ideales para arrancar.",
        },
        {
          label: "Tick, punto, contratos y horarios del trader retail",
          icon: Clock,
          description: "El lenguaje del precio y cómo se estructura el día operativo.",
        },
      ],
    },
    {
      badge: "M2",
      title: "Análisis técnico aplicado y operativa práctica",
      subtitle: "TradingView, Paper Trading, velas, estructura, soportes y resistencias",
      icon: CandlestickChart,
      hours: 11,
      sections: [
        {
          label: "Setup operativo en TradingView + Paper Trading",
          icon: LineChart,
          description: "Tu plataforma armada profesionalmente antes de tocar un solo dólar real.",
        },
        {
          label: "Velas japonesas: anatomía y patrones clave",
          icon: CandlestickChart,
          description: "Cómo leer la intención del mercado vela por vela.",
        },
        {
          label: "Estructura de mercado, soportes y resistencias",
          icon: Activity,
          description: "Las zonas que importan para entrar y salir con criterio.",
        },
        {
          label: "Validación multi-timeframe y marcado de niveles",
          icon: Layers,
          description: "Cómo confirmar una zona antes de poner capital en juego.",
        },
      ],
    },
    {
      badge: "M3",
      title: "Los instrumentos: Futuros y Forex en profundidad",
      subtitle: "Tick, punto, margen, pares, pips, lotes y sesiones globales",
      icon: Globe2,
      hours: 9,
      sections: [
        {
          label: "Futuros: contratos, tick, punto y margen",
          icon: BarChart3,
          description: "Cómo funcionan los futuros US por dentro y qué cuesta cada movimiento.",
        },
        {
          label: "Forex: pares, sesiones, pip y lotes",
          icon: Banknote,
          description: "El mercado de divisas explicado con la matemática real de cada operación.",
        },
        {
          label: "Gestión de riesgo aplicada a cada instrumento",
          icon: ShieldCheck,
          description: "Cuánto exponer, cuándo apalancar y cuándo no tocar el botón.",
        },
        {
          label: "Análisis técnico universal aplicado a ambos mercados",
          icon: Activity,
          description: "El mismo lenguaje gráfico, dos mercados con personalidades distintas.",
        },
      ],
    },
    {
      badge: "M4",
      title: "Gestión de órdenes, riesgo y capital real",
      subtitle: "De la práctica sin reglas a la operación disciplinada con plan",
      icon: ShieldCheck,
      hours: 11,
      sections: [
        {
          label: "Tipos de órdenes (Market, Limit, Stop) y slippage real",
          icon: Zap,
          description: "Cómo entran y salen tus operaciones y por qué Market vs Limit te ahorra dinero.",
        },
        {
          label: "Risk per Trade y Risk:Reward simétrico",
          icon: Calculator,
          description: "El cálculo que separa al trader del apostador antes de cada entrada.",
        },
        {
          label: "Gestión de posición en vivo y errores críticos",
          icon: Target,
          description: "Qué hacer cuando el trade está abierto y el mercado se mueve fuerte.",
        },
        {
          label: "Prop Firms + Journal del trader profesional",
          icon: Award,
          description: "El paso hacia capital ajeno y el hábito que sostiene el progreso.",
        },
      ],
    },
  ],

  // ============================================================
  // TRADING LAB
  // ============================================================
  // Curso avanzado de trading: 4 módulos con lectura institucional.
  // FVG, Volume Profile, liquidez, top-down, prop firms y disciplina
  // operativa. Foco en pasar del retail al criterio institucional.
  "trading-lab": [
    {
      badge: "M1",
      title: "Cómo piensa el mercado y los Fair Value Gaps",
      subtitle: "La lógica detrás del precio y los huecos que deja al moverse rápido",
      icon: Brain,
      hours: 8,
      sections: [
        {
          label: "Cómo realmente piensa el mercado",
          icon: Activity,
          description: "La lógica institucional detrás de cada vela y quién mueve el precio.",
        },
        {
          label: "Fair Value Gaps: qué son y por qué importan",
          icon: Zap,
          description: "El concepto que cambia para siempre cómo leés un gráfico.",
        },
        {
          label: "Los 4 tipos de FVG y cómo se diferencian",
          icon: Layers,
           description: "Diferenciar los válidos de los que solo te van a frustrar.",
        },
        {
          label: "Operativa: entrada, stop, objetivo y checklist",
          icon: Target,
          description: "Sistema replicable para operar FVG con criterio profesional.",
        },
      ],
    },
    {
      badge: "M2",
      title: "Liquidez, el plan de trading y glosario",
      subtitle: "Por qué el mercado se mueve a esos niveles — y cómo juntarlo todo en un plan real",
      icon: BarChart3,
      hours: 9,
      sections: [
        {
          label: "Volume Profile completo (POC, VAH, VAL, VAS)",
          icon: BarChart3,
          description: "Las herramientas que muestran dónde se quedó atrapado el dinero institucional.",
        },
        {
          label: "Liquidez avanzada: barridos, equal highs/lows e inducement",
          icon: Zap,
          description: "Cómo el mercado caza stops y cómo no caer en esas trampas.",
        },
        {
          label: "Top-Down multi-timeframe: del contexto a la entrada",
          icon: Layers,
          description: "Bajar del macro al micro para entrar donde la probabilidad está de tu lado.",
        },
        {
          label: "Plan de trading profesional + glosario operativo",
          icon: ScrollText,
          description: "El sistema escrito que sostiene la operativa cuando la presión aprieta.",
        },
      ],
    },
    {
      badge: "M3",
      title: "Gestión avanzada y Prop Firms",
      subtitle: "R:R asimétrico, drawdown, sizing profesional y capital de terceros",
      icon: Briefcase,
      hours: 7,
      sections: [
        {
          label: "R:R asimétrico, drawdown y sizing profesional",
          icon: Calculator,
          description: "La matemática de ganar más cuando ganás y perder menos cuando perdés.",
        },
        {
          label: "Qué es una prop firm y por qué te conviene",
          icon: Building2,
          description: "El camino para operar con capital ajeno sin arriesgar el tuyo.",
        },
        {
          label: "Las dos lógicas de drawdown (Apex vs Topstep)",
          icon: ShieldCheck,
          description: "El detalle técnico que define si vas a aprobar la evaluación o no.",
        },
        {
          label: "Estrategia para evaluación + mantener la cuenta funded",
          icon: Award,
          description: "El plan completo para pasar la prueba y mantenerte vivo después.",
        },
      ],
    },
    {
      badge: "M4",
      title: "Disciplina operativa y gestión emocional aplicada",
      subtitle: "La técnica te lleva al setup. La cabeza te lleva a ejecutarlo.",
      icon: ShieldCheck,
      hours: 6,
      sections: [
        {
          label: "Los cuatro jinetes emocionales del trader",
          icon: Brain,
          description: "Las emociones que rompen sistemas perfectamente diseñados.",
        },
        {
          label: "Sesgos cognitivos del trader",
          icon: Compass,
          description: "Cómo tu cabeza te miente sin que te des cuenta — y cómo desactivarlo.",
        },
        {
          label: "Manejo profesional de pérdidas y rutina diaria",
          icon: Activity,
          description: "La diferencia entre el que aprende del error y el que se hunde con él.",
        },
        {
          label: "Proceso vs resultado + vida sostenible del trader",
          icon: Sparkles,
          description: "La mentalidad que sostiene una carrera de trading de años, no meses.",
        },
      ],
    },
  ],
}

/** Helper: ¿existe contenido de recorrido para este slug? */
export function hasRecorrido(slug: string): boolean {
  return Array.isArray(COURSE_RECORRIDO[slug]) && COURSE_RECORRIDO[slug].length > 0
}

// ============================================================
// ÍCONOS PARA "QUÉ TE LLEVÁS" (outcomes)
// ============================================================
// El array de outcomes en landing-marketing.ts es solo texto.
// Acá mapeamos slug → array de íconos en el MISMO orden.
// Si falta el ícono para un curso, se hace fallback a Check.
//
// Mantiene la coherencia visual de la página: cada outcome lleva un
// ícono temático en color accent, no un checkmark genérico.
// ============================================================

export const COURSE_OUTCOME_ICONS: Record<string, LucideIcon[]> = {
  "kickstart-investment": [
    Wallet,      // "Tener tus finanzas personales ordenadas antes de invertir."
    Target,      // "Conocer tu perfil de inversor real y qué instrumentos te calzan."
    Globe2,      // "Entender el ecosistema argentino (BYMA, CEDEARs, FCIs) y el global..."
    Layers,      // "Distinguir renta fija de renta variable y elegir según tu horizonte."
    Sparkles,    // "Tomar tu primera decisión de inversión con criterio propio."
  ],
  "expert-investment": [
    BookOpen,    // "Hacer análisis fundamental real: estados financieros, ratios, valuación."
    Calculator,  // "Calcular WACC y ROIC para evaluar la calidad de una empresa."
    ScrollText,  // "Leer reportes de Earnings y la guía forward de empresas listadas."
    PieChart,    // "Construir y rebalancear una cartera con correlación y ponderación adecuadas."
    Brain,       // "Identificar y desactivar sesgos cognitivos en decisiones de capital."
  ],
  "kickstart-trading": [
    BarChart3,        // "Entender cómo funcionan los mercados de futuros y Forex sin mitos."
    CandlestickChart, // "Leer un gráfico con criterio: estructura, soportes, resistencias, velas."
    Calculator,       // "Calcular tu riesgo por trade antes de tocar el botón..."
    ScrollText,       // "Armar un plan de trading personal y un journal que mejore con el tiempo."
    Award,            // "Saber qué es una prop firm y cómo prepararte para una evaluación."
  ],
  "trading-lab": [
    Zap,         // "Identificar Fair Value Gaps de los 4 tipos y operarlos con criterio."
    BarChart3,   // "Leer Volume Profile completo: POC, VAH, VAL y los 5 perfiles de Dalton."
    Activity,    // "Detectar barridos de liquidez, equal highs/lows e inducement institucional."
    Layers,      // "Construir un Top-Down multi-timeframe que ordene tu decisión de entrada."
    Award,       // "Operar una prop firm con conciencia de las dos lógicas de drawdown."
  ],
}

/** Devuelve el ícono para un outcome dado por índice, con fallback. */
export function getOutcomeIcon(slug: string, index: number, fallback: LucideIcon): LucideIcon {
  const arr = COURSE_OUTCOME_ICONS[slug]
  if (arr && arr[index]) return arr[index]
  return fallback
}
