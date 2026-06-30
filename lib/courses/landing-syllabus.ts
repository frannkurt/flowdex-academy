export type SyllabusGroup = { title: string; items: string[] }
export type SyllabusContent = string[] | SyllabusGroup[]

function isGrouped(s: SyllabusContent): s is SyllabusGroup[] {
  return Array.isArray(s) && s.length > 0 && typeof s[0] === "object" && "items" in (s[0] as SyllabusGroup)
}

export { isGrouped }

export const LANDING_COURSE_SYLLABUS: Record<string, SyllabusContent> = {
  "kickstart-investment": [
    {
      title: "Base personal",
      items: [
        "Finanzas Personales: presupuesto, fondo de emergencia y orden patrimonial",
        "Tipos de Inversor: perfil, horizonte temporal y match con cada instrumento",
      ],
    },
    {
      title: "Mercados y arquitectura",
      items: [
        "Mercados Globales y Locales: NYSE, NASDAQ, S&P 500, BYMA y rol de cada uno",
        "Renta Fija vs Renta Variable: diferencias, riesgos y rendimientos",
      ],
    },
    {
      title: "Instrumentos prácticos",
      items: [
        "Bonos, FCIs y Plazos Fijos: instrumentos conservadores y cómo evaluarlos",
        "Staking, CEDEARs y ETFs: ecosistema argentino e internacional",
        "Acciones: lógica de inversión y primeras reglas de gestión de capital",
      ],
    },
  ],
  "expert-investment": [
    {
      title: "Fundamentos",
      items: [
        "Análisis Fundamental: estados financieros, ratios y valuación",
        "Análisis Fundamental Avanzado: WACC, ROIC y construcción de MOAT",
        "Lectura de Earnings y guía forward de empresas",
      ],
    },
    {
      title: "Contexto e instrumentos",
      items: [
        "Macroeconomía: tasas, inflación e impacto en activos",
        "Dividendos, REITs y ETFs: ingreso pasivo y diversificación profesional",
      ],
    },
    {
      title: "Portafolio y estrategia",
      items: [
        "7 Estrategias Clásicas: All Weather, Buy & Hold, Value, Growth, Magic Formula, Piotroski, CAN SLIM",
        "Construcción y Rebalanceo: correlación, ponderación y ajustes",
        "Sesgos cognitivos y disciplina en decisiones de capital",
      ],
    },
  ],
  "kickstart-trading": [
    {
      title: "Mentalidad y setup",
      items: [
        "Mentalidad Profesional: qué es realmente el trading y qué no es",
        "Setup Profesional: TradingView, broker, plataforma de ejecución y journal",
      ],
    },
    {
      title: "Análisis técnico",
      items: [
        "Velas Japonesas y Estructura de Mercado: tendencias, rangos y patrones",
        "Soportes, Resistencias y Análisis Técnico aplicado por timeframe",
        "Futuros y Forex en profundidad: contratos, márgenes, sesiones",
      ],
    },
    {
      title: "Ejecución y riesgo",
      items: [
        "Gestión de Órdenes: Market, Limit, Stop y cálculo de tamaño de posición",
        "Risk per Trade: cómo protege tu capital y por qué define al trader serio",
        "Introducción a Prop Firms: qué son, cómo funcionan y por qué importan",
      ],
    },
  ],
  "trading-lab": [
    {
      title: "Lectura institucional",
      items: [
        "Cómo piensa el mercado: lógica institucional detrás del precio",
        "Fair Value Gaps (FVG): 4 tipos, 4 requisitos y operativa táctica",
        "Volume Profile completo: POC, VAH, VAL, VAS y los 5 perfiles de Dalton",
        "Liquidez avanzada: barridos, equal highs/lows, inducement y trampas",
      ],
    },
    {
      title: "Ejecución y plan",
      items: [
        "Top-Down multi-timeframe: contexto, zona, confirmación y ejecución",
        "Plan de Trading y glosario operativo profesional",
      ],
    },
    {
      title: "Prop firms y disciplina",
      items: [
        "Prop Firms: dos lógicas de drawdown, gestión y mantenimiento de cuenta",
        "Disciplina operativa y gestión emocional aplicada al método",
      ],
    },
  ],
}

export const INNER_CIRCLE_LANDING_SYLLABUS = {
  title: "Que trabajamos adentro",
  items: [
    "Doble acceso: FPM (Inversiones) + ORB Breakout (Trading)",
    "Obra Maestra · 10 módulos del operador",
    "Revisión personalizada de tus trades",
    "Indicadores Propios Flowdex",
    "Membresía mensual + comunidad privada",
  ],
}