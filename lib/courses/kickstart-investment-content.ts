export type ConceptItem = {
  term: string
  definition: string
}

export type ListItem = {
  label?: string
  text: string
}

export type Block =
  | { type: "intro"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: ListItem[] }
  | { type: "concept"; label: string; text: string }
  | { type: "highlight"; text: string }
  | { type: "example"; items: ListItem[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "callout"; label: string; text: string; variant?: "warning" | "key" | "info" }
  | { type: "reference"; targetCourse: string; targetModule: string; reason: string; href?: string }
  | { type: "tool"; toolName: string; description: string; href: string; ctaLabel?: string; eyebrow?: string }
  | { type: "lore_quote"; text: string; speaker: string; mythReference?: string }
  | {
      type: "tv_widget"
      widget: "advanced_chart" | "symbol_info" | "fundamental_data" | "company_profile" | "technical_analysis"
      symbol: string
      label?: string
      caption?: string
      height?: number
    }

export type Section = {
  title: string
  icon?: string
  blocks: Block[]
}

export type Module = {
  number: number
  title: string
  subtitle: string
  color: "teal" | "blue" | "gold"
  sections: Section[]
}

export const kickstartInvestmentContent: Module[] = [
  {
    number: 0,
    title: "Apertura Estratégica",
    subtitle: "Fundamentos esenciales antes de invertir",
    color: "teal",
    sections: [
      {
        title: "Bienvenida al curso completo",
        icon: "◎",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Apertura Estratégica", text: "Contenido del curso (privado)." },
              { label: "Módulo 1 — Mercados", text: "Contenido del curso (privado)." },
              { label: "Módulo 2 — Inversión e Instrumentos", text: "Contenido del curso (privado)." },
              { label: "Módulo 3 — Staking, FCIs y CEDEARs", text: "Contenido del curso (privado)." },
              { label: "Módulo 4 — Tipos de Inversor, Acciones y Lectura de Gráficos", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Cómo aprovechar este curso",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "concept",
            label: "Lo que NO es este curso",
            text: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Antes de empezar",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Aviso pedagógico antes de empezar",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/expert investment/piramide-finanzas-personales.jpeg",
            alt: "Contenido del curso (privado).",
            caption:
              "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "¿Qué son las finanzas personales?",
        icon: "∆",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Planificación", text: "Contenido del curso (privado)." },
              { label: "Organización", text: "Contenido del curso (privado)." },
              { label: "Control", text: "Contenido del curso (privado)." },
              { label: "Proyección", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Una analogía útil",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "¿Por qué son importantes las finanzas personales?",
        icon: "★",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { text: "Contenido del curso (privado)." },
              { text: "Contenido del curso (privado)." },
              { text: "Contenido del curso (privado)." },
              { text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Vínculo directo con tu inversión",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Ingresos",
        icon: "↑",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Activos", text: "Contenido del curso (privado)." },
              { label: "Pasivos", text: "Contenido del curso (privado)." },
              { label: "Fijos", text: "Contenido del curso (privado)." },
              { label: "Variables", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Juan", text: "Contenido del curso (privado)." },
              { label: "$300.000", text: "Contenido del curso (privado)." },
              { label: "17%", text: "Contenido del curso (privado)." },
              { label: "Meta", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Concepto clave",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Gastos",
        icon: "↓",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Fijos", text: "Contenido del curso (privado)." },
              { label: "Variables", text: "Contenido del curso (privado)." },
              { label: "Esenciales", text: "Contenido del curso (privado)." },
              { label: "Discrecionales", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "$1.000.000", text: "Contenido del curso (privado)." },
              { label: "50%", text: "Contenido del curso (privado)." },
              { label: "30%", text: "Contenido del curso (privado)." },
              { label: "20%", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Indicador importante",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Ahorros",
        icon: "◈",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Corto plazo", text: "Contenido del curso (privado)." },
              { label: "Mediano plazo", text: "Contenido del curso (privado)." },
              { label: "Largo plazo", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Concepto clave",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Deudas",
        icon: "⚖",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Deuda buena", text: "Contenido del curso (privado)." },
              { label: "Deuda mala", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "Deuda buena", text: "Contenido del curso (privado)." },
              { label: "Deuda mala", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "list",
            items: [
              { label: "Tasa de interés", text: "Contenido del curso (privado)." },
              { label: "Interés compuesto", text: "Contenido del curso (privado)." },
              { label: "Apalancamiento", text: "Contenido del curso (privado)." },
              { label: "CFT", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Regla general",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Qué es una tasa de rendimiento",
        icon: "%",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Tasa nominal", text: "Contenido del curso (privado)." },
              { label: "Tasa real", text: "Contenido del curso (privado)." },
              { label: "Período de la tasa", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "Inversión inicial", text: "Contenido del curso (privado)." },
              { label: "Valor al año", text: "Contenido del curso (privado)." },
              { label: "Tasa de rendimiento anual", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Por qué importa",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "El interés compuesto",
        icon: "∞",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/ultima%20generacion%20de%20imagenes/Compound_interest_over_40_years_202605190234.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Ana", text: "Contenido del curso (privado)." },
              { label: "Luis", text: "Contenido del curso (privado)." },
              { label: "Resultado", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "list",
            items: [
              { label: "Capital inicial", text: "Contenido del curso (privado)." },
              { label: "Tasa de rendimiento", text: "Contenido del curso (privado)." },
              { label: "Tiempo", text: "Contenido del curso (privado)." },
              { label: "Frecuencia de capitalización", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Conclusión",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Colchón de emergencia",
        icon: "🛡",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/ultima%20generacion%20de%20imagenes/Colch%C3%B3n_de_emergencia_pir%C3%A1mide_f%E2%80%A6_202605190235.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "La pregunta del miedo",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "list",
            items: [
              { label: "Alta liquidez", text: "Contenido del curso (privado)." },
              { label: "Bajo riesgo", text: "Contenido del curso (privado)." },
              { label: "Separación total", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "list",
            items: [
              { label: "Ingresos estables y empleo seguro", text: "Contenido del curso (privado)." },
              { label: "Ingresos inestables (freelance, comisiones, monotributistas, ventas por proyecto)", text: "Contenido del curso (privado)." },
              { label: "Perfil conservador o con cargas familiares", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "list",
            items: [
              { text: "Contenido del curso (privado)." },
              { text: "Contenido del curso (privado)." },
              { text: "Contenido del curso (privado)." },
              { text: "Contenido del curso (privado)." },
              { text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El que se fue y volvió",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Clave operativa",
            text: "Contenido del curso (privado).",
          },
          {
            type: "reference",
            targetCourse: "Inner Circle · Obra Maestra",
            targetModule: "Módulo 2 — Tu Relación con el Dinero",
            reason: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Mentalidad del inversor",
        icon: "🧠",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Expectativas realistas", text: "Contenido del curso (privado)." },
              { label: "Aceptar los drawdowns", text: "Contenido del curso (privado)." },
              { label: "Disciplina sobre brillantez", text: "Contenido del curso (privado)." },
              { label: "Tiempo en el mercado vence al timing del mercado", text: "Contenido del curso (privado)." },
              { label: "Reconocer al inversor compulsivo", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Frase ancla para todo el curso",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "concept",
            label: "El compromiso mínimo",
            text: "Contenido del curso (privado).",
          },
          {
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El Aprendiz",
          },
        ],
      },
    ],
  },
  {
    number: 1,
    title: "Mercados",
    subtitle: "Conocé los activos donde opera el capital",
    color: "blue",
    sections: [
      {
        title: "Glosario inicial del inversor",
        icon: "📖",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Bloque 1 — Los que usás todos los días",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Activo", text: "Contenido del curso (privado)." },
              { label: "Posición", text: "Contenido del curso (privado)." },
              { label: "Renta fija / Renta variable", text: "Contenido del curso (privado)." },
              { label: "Capitalización bursátil (market cap)", text: "Contenido del curso (privado)." },
              { label: "Dividendo", text: "Contenido del curso (privado)." },
              { label: "Yield (dividendo)", text: "Contenido del curso (privado)." },
              { label: "P/E (Price/Earnings)", text: "Contenido del curso (privado)." },
              { label: "CCL (Contado con Liquidación)", text: "Contenido del curso (privado)." },
              { label: "Diversificación", text: "Contenido del curso (privado)." },
              { label: "Rebalanceo", text: "Contenido del curso (privado)." },
              { label: "Volatilidad", text: "Contenido del curso (privado)." },
              { label: "Drawdown", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Bloque 2 — Los que conviene conocer aunque no uses",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Long / Largo", text: "Contenido del curso (privado)." },
              { label: "Short / Corto", text: "Contenido del curso (privado)." },
              { label: "Broker", text: "Contenido del curso (privado)." },
              { label: "P&L (Profit and Loss)", text: "Contenido del curso (privado)." },
              { label: "Liquidez", text: "Contenido del curso (privado)." },
              { label: "Spread", text: "Contenido del curso (privado)." },
              { label: "Apalancamiento", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Cómo usar este glosario",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Antes de empezar",
        icon: "◎",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Conexión con la Apertura Estratégica",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/expert investment/mapa-mercados-financieros.jpeg",
            alt: "Contenido del curso (privado).",
            caption:
              "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Forex — Divisas",
        icon: "💱",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Par mayor (Major)", text: "Contenido del curso (privado)." },
              { label: "Par menor (Minor)", text: "Contenido del curso (privado)." },
              { label: "Par exótico", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Entrada", text: "Contenido del curso (privado)." },
              { label: "Salida", text: "Contenido del curso (privado)." },
              { label: "Resultado", text: "Contenido del curso (privado)." },
              { label: "Con 10x", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "EUR/USD ask (compra)", text: "Contenido del curso (privado)." },
              { label: "EUR/USD bid (venta)", text: "Contenido del curso (privado)." },
              { label: "Spread", text: "Contenido del curso (privado)." },
              { label: "Lectura", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Por qué importa",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "concept",
            label: "Concepto clave",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Acciones",
        icon: "📈",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Dividendos", text: "Contenido del curso (privado)." },
              { label: "Apreciación de capital", text: "Contenido del curso (privado)." },
              { label: "Derechos de voto", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Crecimiento", text: "Contenido del curso (privado)." },
              { label: "Dividendos", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Idea clave",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Materias Primas",
        icon: "⛏",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Metales preciosos", text: "Contenido del curso (privado)." },
              { label: "Metales industriales", text: "Contenido del curso (privado)." },
              { label: "Energía", text: "Contenido del curso (privado)." },
              { label: "Agrícolas", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Caso 2022", text: "Contenido del curso (privado)." },
              { label: "100% acciones", text: "Contenido del curso (privado)." },
              { label: "Portafolio mixto", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Rol en el portafolio",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Índices",
        icon: "◎",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "S&P 500", text: "Contenido del curso (privado)." },
              { label: "Nasdaq 100", text: "Contenido del curso (privado)." },
              { label: "Dow Jones", text: "Contenido del curso (privado)." },
              { label: "DAX 40", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "La apuesta de Buffett",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "list",
            items: [
              { label: "ETF del índice", text: "Contenido del curso (privado)." },
              { label: "CFD del índice", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Ventaja principal",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Criptomonedas",
        icon: "₿",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Bitcoin (BTC)", text: "Contenido del curso (privado)." },
              { label: "Ethereum (ETH)", text: "Contenido del curso (privado)." },
              { label: "Altcoins", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Para el portafolio",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Futuros y CFD",
        icon: "⇌",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Futuros", text: "Contenido del curso (privado)." },
              { label: "CFD (Contract for Difference)", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Largo (Buy)", text: "Contenido del curso (privado)." },
              { label: "Corto (Sell)", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Atención",
            text: "Contenido del curso (privado).",
          },
          {
            type: "reference",
            targetCourse: "Kickstart Trading",
            targetModule: "Módulo 3 — Los instrumentos",
            reason: "Contenido del curso (privado).",
          },
          {
            type: "reference",
            targetCourse: "Trading Lab",
            targetModule: "Módulo 1 — Cómo piensa el mercado",
            reason: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Portafolio de Inversiones",
        icon: "◉",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Diversificación", text: "Contenido del curso (privado)." },
              { label: "Gestión de riesgo", text: "Contenido del curso (privado)." },
              { label: "Asignación de activos", text: "Contenido del curso (privado)." },
              { label: "Horizonte temporal", text: "Contenido del curso (privado)." },
              { label: "Perfil de riesgo", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "Conservador", text: "Contenido del curso (privado)." },
              { label: "Moderado", text: "Contenido del curso (privado)." },
              { label: "Agresivo", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Inicio", text: "Contenido del curso (privado)." },
              { label: "Desvío", text: "Contenido del curso (privado)." },
              { label: "Acción", text: "Contenido del curso (privado)." },
              { label: "Frecuencia", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Regla de oro",
            text: "Contenido del curso (privado).",
          },
        ],
      },
    ],
  },
  {
    number: 2,
    title: "Inversión e Instrumentos",
    subtitle: "El primer escalón hacia los mercados",
    color: "gold",
    sections: [
      {
        title: "Antes de empezar",
        icon: "◎",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "¿Qué es invertir?",
        icon: "◆",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Una analogía simple",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Rentabilidad esperada", text: "Contenido del curso (privado)." },
              { label: "Plazo", text: "Contenido del curso (privado)." },
              { label: "Riesgos asociados", text: "Contenido del curso (privado)." },
              { label: "Liquidez", text: "Contenido del curso (privado)." },
              { label: "Contexto", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "En definitiva",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Inversión vs. Especulación",
        icon: "⇔",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Inversor", text: "Contenido del curso (privado)." },
              { label: "Especulador", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Pedro", text: "Contenido del curso (privado)." },
              { label: "María", text: "Contenido del curso (privado)." },
              { label: "Diferencia", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "image",
            src: "/expert investment/inversor-vs-especulador.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Regla práctica",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "¿Por qué es importante invertir?",
        icon: "◉",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Protección ante la inflación", text: "Contenido del curso (privado)." },
              { label: "Crecimiento del patrimonio", text: "Contenido del curso (privado)." },
              { label: "Metas financieras", text: "Contenido del curso (privado)." },
              { label: "Independencia", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "Hace 5 años", text: "Contenido del curso (privado)." },
              { label: "Sin invertir", text: "Contenido del curso (privado)." },
              { label: "Con cobertura", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "La conclusión incómoda",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "¿Qué son los instrumentos financieros?",
        icon: "◈",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Una analogía útil",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "image",
            src: "/expert investment/mapa-instrumentos-financieros.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Para recordar",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Renta Fija",
        icon: "—",
        blocks: [
          {
            type: "image",
            src: "/ultima%20generacion%20de%20imagenes/Renta_Fija_vs_Renta_Variable_202605190237.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Bonos soberanos", text: "Contenido del curso (privado)." },
              { label: "Bonos corporativos", text: "Contenido del curso (privado)." },
              { label: "Letras del tesoro", text: "Contenido del curso (privado)." },
              { label: "Obligaciones negociables", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "Compra", text: "Contenido del curso (privado)." },
              { label: "Interés", text: "Contenido del curso (privado)." },
              { label: "Vencimiento", text: "Contenido del curso (privado)." },
              { label: "Total", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Ventaja principal",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Renta Variable",
        icon: "↗",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Ganancias de capital", text: "Contenido del curso (privado)." },
              { label: "Dividendos", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Ejemplo histórico ilustrativo", text: "Contenido del curso (privado)." },
              { label: "Costo de ese rendimiento", text: "Contenido del curso (privado)." },
              { label: "Lección pedagógica", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Clave",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Instrumentos Derivados",
        icon: "⇌",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Futuros", text: "Contenido del curso (privado)." },
              { label: "Opciones", text: "Contenido del curso (privado)." },
              { label: "Swaps", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Cobertura", text: "Contenido del curso (privado)." },
              { label: "Especulación", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Atención",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Fondos de Inversión",
        icon: "◎",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Fondos Comunes de Inversión (FCI)", text: "Contenido del curso (privado)." },
              { label: "ETFs (Exchange Traded Funds)", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "FCI", text: "Contenido del curso (privado)." },
              { label: "ETF", text: "Contenido del curso (privado)." },
              { label: "Caso", text: "Contenido del curso (privado)." },
              { label: "Liquidez", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Mercado Monetario",
        icon: "◌",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Plazos fijos", text: "Contenido del curso (privado)." },
              { label: "Cuentas remuneradas", text: "Contenido del curso (privado)." },
              { label: "Papeles comerciales", text: "Contenido del curso (privado)." },
              { label: "FCI Money Market", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Uso estratégico",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Instrumentos en Moneda Extranjera",
        icon: "💵",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Bonos en dólares", text: "Contenido del curso (privado)." },
              { label: "Obligaciones negociables (ON)", text: "Contenido del curso (privado)." },
              { label: "CEDEARs", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "Compra", text: "Contenido del curso (privado)." },
              { label: "Motor 1", text: "Contenido del curso (privado)." },
              { label: "Motor 2", text: "Contenido del curso (privado)." },
              { label: "Resultado", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Idea clave",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Conclusión del módulo",
        icon: "★",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Cierre",
            text: "Contenido del curso (privado).",
          },
        ],
      },
    ],
  },
  {
    number: 3,
    title: "Staking, FCIs y CEDEARs",
    subtitle: "Instrumentos para el inversor argentino",
    color: "teal",
    sections: [
      {
        title: "Antes de empezar",
        icon: "◎",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "¿Qué es el Staking?",
        icon: "⬡",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Una analogía simple",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Rendimiento actual", text: "Contenido del curso (privado)." },
              { label: "Plazos habituales", text: "Contenido del curso (privado)." },
              { label: "Al vencimiento", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Diferencia clave",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Proof of Stake: cómo funciona",
        icon: "◈",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Proof of Work (PoW)", text: "Contenido del curso (privado)." },
              { label: "Proof of Stake (PoS)", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Una analogía rápida",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Stablecoins: el corazón del staking moderno",
        icon: "💵",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "USDT (Tether)", text: "Contenido del curso (privado)." },
              { label: "USDC (USD Coin)", text: "Contenido del curso (privado)." },
              { label: "DAI", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "Capital inicial", text: "Contenido del curso (privado)." },
              { label: "Tasa", text: "Contenido del curso (privado)." },
              { label: "A 12 meses", text: "Contenido del curso (privado)." },
              { label: "A 5 años", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "list",
            items: [
              { label: "Riesgo de desacople", text: "Contenido del curso (privado)." },
              { label: "Riesgo de plataforma", text: "Contenido del curso (privado)." },
              { label: "Riesgo regulatorio", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Para el inversor argentino",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/expert investment/staking-stablecoins-ciclo.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Fondos Comunes de Inversión (FCI)",
        icon: "◎",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Una analogía útil",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "list",
            items: [
              { label: "Accesibilidad", text: "Contenido del curso (privado)." },
              { label: "Diversificación automática", text: "Contenido del curso (privado)." },
              { label: "Liquidez variable", text: "Contenido del curso (privado)." },
              { label: "Costos", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Tipos de FCI en Argentina",
        icon: "◉",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Money Market (T+0)", text: "Contenido del curso (privado)." },
              { label: "Renta Fija (T+1 o T+2)", text: "Contenido del curso (privado)." },
              { label: "Renta Variable", text: "Contenido del curso (privado)." },
              { label: "Mixtos", text: "Contenido del curso (privado)." },
              { label: "Dólar Linked / Hard Dollar", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "¿Cómo elegir un FCI?",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "CEDEARs: acciones globales desde Argentina",
        icon: "🌐",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Dónde se operan", text: "Contenido del curso (privado)." },
              { label: "Moneda de cotización", text: "Contenido del curso (privado)." },
              { label: "Ratio", text: "Contenido del curso (privado)." },
              { label: "Dividendos", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "AAPL", text: "Contenido del curso (privado)." },
              { label: "CCL", text: "Contenido del curso (privado)." },
              { label: "Accesibilidad", text: "Contenido del curso (privado)." },
            ],
          },
        ],
      },
      {
        title: "¿Por qué CEDEARs en vez de acciones directas?",
        icon: "↗",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Sin cuenta en el exterior", text: "Contenido del curso (privado)." },
              { label: "Sin transferencias internacionales complejas", text: "Contenido del curso (privado)." },
              { label: "Cobertura cambiaria automática", text: "Contenido del curso (privado)." },
              { label: "Accesibilidad por ratios", text: "Contenido del curso (privado)." },
              { label: "Liquidez local", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Desventaja a considerar",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "CEDEARs como cobertura inflacionaria",
        icon: "🛡",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Escenario favorable", text: "Contenido del curso (privado)." },
              { label: "Escenario neutro", text: "Contenido del curso (privado)." },
              { label: "Escenario desfavorable", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "image",
            src: "/expert investment/cedears-escenarios-cobertura.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Conclusión del módulo",
        icon: "★",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Cierre",
            text: "Contenido del curso (privado).",
          },
        ],
      },
    ],
  },
  {
    number: 4,
    title: "Tipos de Inversor e Inversión en Acciones",
    subtitle: "Conocerte a vos mismo para invertir mejor",
    color: "gold",
    sections: [
      {
        title: "Antes de empezar",
        icon: "◎",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Tipos de inversor: marco general",
        icon: "◉",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Una analogía útil",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "concept",
            label: "Clave del módulo",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Según el perfil de riesgo",
        icon: "⚖",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Conservador", text: "Contenido del curso (privado)." },
              { label: "Moderado", text: "Contenido del curso (privado)." },
              { label: "Agresivo", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "Caída de mercado", text: "Contenido del curso (privado)." },
              { label: "Conservador", text: "Contenido del curso (privado)." },
              { label: "Moderado", text: "Contenido del curso (privado)." },
              { label: "Agresivo", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/expert investment/perfiles-inversor.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Según el horizonte temporal",
        icon: "⏳",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Corto plazo", text: "Contenido del curso (privado)." },
              { label: "Mediano plazo", text: "Contenido del curso (privado)." },
              { label: "Largo plazo", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "S&P a 1 día", text: "Contenido del curso (privado)." },
              { label: "S&P a 1 año", text: "Contenido del curso (privado)." },
              { label: "S&P a 10+ años", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Regla práctica",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Según el grado de involucramiento",
        icon: "🧭",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Activo", text: "Contenido del curso (privado)." },
              { label: "Pasivo", text: "Contenido del curso (privado)." },
              { label: "Mixto", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Cómo identificar tu perfil real",
        icon: "✓",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Ingresos y estabilidad", text: "Contenido del curso (privado)." },
              { label: "Fondo de emergencia", text: "Contenido del curso (privado)." },
              { label: "Edad y objetivo", text: "Contenido del curso (privado)." },
              { label: "Tolerancia emocional", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "Auto-test", text: "Contenido del curso (privado)." },
              { label: "Señal clave", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Resultado esperado",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Interés compuesto aplicado a acciones",
        icon: "∞",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Reinvertir dividendos", text: "Contenido del curso (privado)." },
              { label: "Compounders", text: "Contenido del curso (privado)." },
              { label: "Aporte constante", text: "Contenido del curso (privado)." },
            ],
          },
        ],
      },
      {
        title: "Acciones: qué son y por qué importan",
        icon: "📈",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Ganancia por precio", text: "Contenido del curso (privado)." },
              { label: "Ganancia por dividendos", text: "Contenido del curso (privado)." },
              { label: "Derechos políticos", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Dato clave",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Acciones por capitalización bursátil",
        icon: "🏷",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Small Cap", text: "Contenido del curso (privado)." },
              { label: "Mid Cap", text: "Contenido del curso (privado)." },
              { label: "Large Cap", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Acciones por sector económico",
        icon: "🧩",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { text: "Contenido del curso (privado)." },
              { text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "Expansión", text: "Contenido del curso (privado)." },
              { label: "Recesión", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Ejemplo",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Acciones por estilo de inversión",
        icon: "◌",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Growth", text: "Contenido del curso (privado)." },
              { label: "Value", text: "Contenido del curso (privado)." },
              { label: "Cíclicas", text: "Contenido del curso (privado)." },
              { label: "Defensivas", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "image",
            src: "/expert investment/mapa-estilos-inversion.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Cómo leer una empresa: las tres ventanas",
        icon: "▥",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "La idea base",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Primera ventana: el Balance",
        icon: "▦",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Activo", text: "Contenido del curso (privado)." },
              { label: "Pasivo", text: "Contenido del curso (privado)." },
              { label: "Patrimonio neto", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Lácteos del Sur — Balance simplificado", text: "Contenido del curso (privado)." },
              { label: "Lectura", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Lo que el Balance te dice",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Segunda ventana: el Estado de Resultados",
        icon: "▤",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Ingresos (Revenue)", text: "Contenido del curso (privado)." },
              { label: "Costo de los bienes vendidos", text: "Contenido del curso (privado)." },
              { label: "Margen bruto", text: "Contenido del curso (privado)." },
              { label: "Gastos operativos", text: "Contenido del curso (privado)." },
              { label: "Utilidad operativa (EBIT)", text: "Contenido del curso (privado)." },
              { label: "Utilidad neta", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "TechVuela — P&L 2024", text: "Contenido del curso (privado)." },
              { label: "Lectura", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Lo que el Estado de Resultados te dice",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Tercera ventana: el Cash Flow",
        icon: "▣",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Por qué importa",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "list",
            items: [
              { label: "Flujo operativo", text: "Contenido del curso (privado)." },
              { label: "Flujo de inversión", text: "Contenido del curso (privado)." },
              { label: "Flujo de financiamiento", text: "Contenido del curso (privado)." },
              { label: "Free Cash Flow (FCF)", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "AgroGlobal — Cash Flow 2024", text: "Contenido del curso (privado)." },
              { label: "Lectura", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Las tres ventanas juntas",
        icon: "◫",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Caso típico de empresa peligrosa", text: "Contenido del curso (privado)." },
              { label: "Traducción", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Regla práctica",
            text: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Valuación básica de acciones",
        icon: "Σ",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "El concepto base",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "TechVuela", text: "Contenido del curso (privado)." },
              { label: "Lácteos del Sur", text: "Contenido del curso (privado)." },
              { label: "Lectura honesta", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Cuándo el P/E te miente",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Banco Andino", text: "Contenido del curso (privado)." },
              { label: "Cuándo importa", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "list",
            items: [
              { label: "Tech / growth", text: "Contenido del curso (privado)." },
              { label: "Utilities / energía estable", text: "Contenido del curso (privado)." },
              { label: "Bancos", text: "Contenido del curso (privado)." },
              { label: "Consumo defensivo (lácteos, alimentos)", text: "Contenido del curso (privado)." },
              { label: "Cíclicas (commodities, automotrices)", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Principio profesional",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Métricas financieras clave",
        icon: "📊",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Cómo leer esta sección",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "callout",
            label: "Qué profundiza Expert Investment",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "TechVuela", text: "Contenido del curso (privado)." },
              { label: "Lácteos del Sur", text: "Contenido del curso (privado)." },
              { label: "Lectura honesta", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Cálculo TechVuela", text: "Contenido del curso (privado)." },
              { label: "Comparación útil", text: "Contenido del curso (privado)." },
              { label: "Cuándo engaña", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Banco Andino", text: "Contenido del curso (privado)." },
              { label: "Lectura", text: "Contenido del curso (privado)." },
              { label: "Trampa típica", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Cálculo", text: "Contenido del curso (privado)." },
              { label: "Cuándo usarlo", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "AgroGlobal", text: "Contenido del curso (privado)." },
              { label: "Rangos típicos", text: "Contenido del curso (privado)." },
              { label: "Cuándo es señal de alerta", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "EnergíaPampa", text: "Contenido del curso (privado)." },
              { label: "Rango general", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Cálculo", text: "Contenido del curso (privado)." },
              { label: "Por qué importa", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "El secreto que pocos cursos dicen",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Ratios como linterna, no como GPS",
        icon: "✦",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Cuándo los ratios mienten más",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
          {
            type: "list",
            items: [
              { label: "Empresas con ratios feos que fueron grandes inversiones", text: "Contenido del curso (privado)." },
              { label: "Empresas con ratios lindos que terminaron mal", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Principio profesional",
            text: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Riesgos al invertir en acciones",
        icon: "⚠",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Riesgo de mercado", text: "Contenido del curso (privado)." },
              { label: "Riesgo específico", text: "Contenido del curso (privado)." },
              { label: "Riesgo de liquidez", text: "Contenido del curso (privado)." },
              { label: "Riesgo cambiario", text: "Contenido del curso (privado)." },
              { label: "Riesgo conductual", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Regla de protección",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Construcción de cartera profesional",
        icon: "🧱",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Asignación base", text: "Contenido del curso (privado)." },
              { label: "Diversificación", text: "Contenido del curso (privado)." },
              { label: "Posición máxima", text: "Contenido del curso (privado)." },
              { label: "Rebalanceo", text: "Contenido del curso (privado)." },
              { label: "Disciplina", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "40%", text: "Contenido del curso (privado)." },
              { label: "25%", text: "Contenido del curso (privado)." },
              { label: "20%", text: "Contenido del curso (privado)." },
              { label: "15%", text: "Contenido del curso (privado)." },
            ],
          },
        ],
      },
      {
        title: "Checklist antes de invertir",
        icon: "☑",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { text: "Contenido del curso (privado)." },
              { text: "Contenido del curso (privado)." },
              { text: "Contenido del curso (privado)." },
              { text: "Contenido del curso (privado)." },
              { text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "tool",
            toolName: "Journal del trader (también sirve para inversores)",
            description: "Contenido del curso (privado).",
            href: "/journal",
            ctaLabel: "Abrir el journal en pestaña nueva",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Análisis fundamental vs análisis técnico",
        icon: "⇔",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Una analogía simple",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "list",
            items: [
              { label: "Análisis fundamental (AF)", text: "Contenido del curso (privado)." },
              { label: "Análisis técnico (AT)", text: "Contenido del curso (privado)." },
              { label: "Diferencia de plazo", text: "Contenido del curso (privado)." },
              { label: "Diferencia de input", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Por qué un inversor serio usa AMBOS",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "list",
            items: [
              { label: "Trader", text: "Contenido del curso (privado)." },
              { label: "Inversor de largo plazo", text: "Contenido del curso (privado)." },
              { label: "Inversor pasivo (ETF + DCA)", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Lo que viene en las próximas secciones",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Por qué un inversor necesita leer un gráfico",
        icon: "👁",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Mejorar el timing de entrada", text: "Contenido del curso (privado)." },
              { label: "Identificar contexto macro", text: "Contenido del curso (privado)." },
              { label: "Evitar el FOMO inversor", text: "Contenido del curso (privado)." },
              { label: "Reconocer cuándo NO entrar", text: "Contenido del curso (privado)." },
              { label: "Tomar mejores decisiones de salida", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "El inversor ciego",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "La vela japonesa: el bloque básico",
        icon: "🕯",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Vela verde (alcista)", text: "Contenido del curso (privado)." },
              { label: "Vela roja (bajista)", text: "Contenido del curso (privado)." },
              { label: "Cuerpo grande", text: "Contenido del curso (privado)." },
              { label: "Cuerpo chico (doji)", text: "Contenido del curso (privado)." },
              { label: "Mecha larga arriba", text: "Contenido del curso (privado)." },
              { label: "Mecha larga abajo", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "image",
            src: "/Imagen_explicando_anatomía_vela_…_202605042126.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Para el inversor",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "concept",
            label: "Lectura clave",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Tendencia: lo más importante que vas a leer",
        icon: "↗",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Tendencia alcista", text: "Contenido del curso (privado)." },
              { label: "Tendencia bajista", text: "Contenido del curso (privado)." },
              { label: "Tendencia lateral (rango)", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Regla de oro para el inversor",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "image",
            src: "/tendencias.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Caso típico", text: "Contenido del curso (privado)." },
              { label: "Caso opuesto", text: "Contenido del curso (privado)." },
              { label: "Lo difícil", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Para el inversor de largo plazo",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Soportes y resistencias: las zonas que importan",
        icon: "═",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Cómo se identifican", text: "Contenido del curso (privado)." },
              { label: "Soporte como entrada", text: "Contenido del curso (privado)." },
              { label: "Resistencia como precaución", text: "Contenido del curso (privado)." },
              { label: "Soporte roto = nueva resistencia", text: "Contenido del curso (privado)." },
              { label: "Resistencia rota = nuevo soporte", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "image",
            src: "/soportes y resistencias.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Cómo lo aplica un inversor",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "concept",
            label: "Diferencia con el trader",
            text: "Contenido del curso (privado).",
          },
          {
            type: "reference",
            targetCourse: "Kickstart Trading",
            targetModule: "Módulo 2 — Soportes, Resistencias y Análisis Técnico",
            reason: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Multi-timeframe para el inversor",
        icon: "🕒",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Mensual", text: "Contenido del curso (privado)." },
              { label: "Semanal", text: "Contenido del curso (privado)." },
              { label: "Diario", text: "Contenido del curso (privado)." },
              { label: "Lo que NO mirás", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "example",
            items: [
              { label: "Análisis típico de inversor", text: "Contenido del curso (privado)." },
              { label: "Lo que NO hace un inversor", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "concept",
            label: "Regla mental",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "TradingView para el inversor",
        icon: "📊",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Buscar una empresa o CEDEAR", text: "Contenido del curso (privado)." },
              { label: "Cambiar timeframe", text: "Contenido del curso (privado)." },
              { label: "Comparar contra el índice", text: "Contenido del curso (privado)." },
              { label: "Ver fundamentales básicos", text: "Contenido del curso (privado)." },
              { label: "Dibujar zonas", text: "Contenido del curso (privado)." },
              { label: "Watchlist", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Plan gratuito vs pago",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "concept",
            label: "Régimen de uso saludable",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Cuándo SÍ y cuándo NO usar análisis técnico",
        icon: "⚖",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "SÍ usar análisis técnico", text: "Contenido del curso (privado)." },
              { label: "NO usar análisis técnico", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Gestión de riesgo del inversor (distinta del trader)",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Cierre conceptual",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Ejercicio práctico: analizar un CEDEAR paso a paso",
        icon: "✎",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "tv_widget",
            widget: "advanced_chart",
            symbol: "NASDAQ:AAPL",
            label: "Apple · gráfico para practicar",
            caption: "Contenido del curso (privado).",
            height: 480,
          },
          {
            type: "list",
            items: [
              { label: "Paso 1 — Contexto macro", text: "Contenido del curso (privado)." },
              { label: "Paso 2 — Empresa elegida en mensual", text: "Contenido del curso (privado)." },
              { label: "Paso 3 — Marcá soportes y resistencias clave", text: "Contenido del curso (privado)." },
              { label: "Paso 4 — Bajá al semanal", text: "Contenido del curso (privado)." },
              { label: "Paso 5 — Mirá las últimas 4 semanas", text: "Contenido del curso (privado)." },
              { label: "Paso 6 — Decisión informada", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Compromiso del módulo",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Cierre del módulo",
        icon: "★",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "El siguiente paso natural",
            text: "Contenido del curso (privado).",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
    ],
  },
]
