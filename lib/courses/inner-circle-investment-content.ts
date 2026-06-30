export type ListItem = {
  label?: string
  text: string
}

export type Block =
  | { type: "intro"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: ListItem[] }
  | { type: "highlight"; text: string }
  | { type: "callout"; label: string; text: string; variant?: "warning" | "key" | "info" }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "reference"; targetCourse: string; targetModule: string; reason: string; href?: string }
  | { type: "lore_quote"; text: string; speaker: string; mythReference?: string }
  | { type: "philosophy_quote"; text: string; author: string; source?: string }

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

export const innerCircleInvestmentContent: Module[] = [
  {
    number: 1,
    title: "Sistema FPM (Flowdex Portfolio Method)",
    subtitle: "El framework completo para construir, simular y gestionar un portafolio profesional.",
    color: "teal",
    sections: [
      {
        title: "Por qué necesitás un sistema",
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
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Aristóteles",
            source: "paráfrasis tradicional de Ética a Nicómaco, Libro II",
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
            type: "callout",
            label: "Principio central",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El que se fue y volvió",
            mythReference: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Las cinco fases del FPM",
        icon: "◎",
        blocks: [
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Infographic__5_Fases_FPM.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Fase", "Pregunta que responde", "Output"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "callout",
            label: "Principio FPM",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Fase 1 · Diagnóstico",
        icon: "01",
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
            label: "Qué es el \"mandato escrito\"",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "list",
            items: [
              { label: "Capital base", text: "Contenido del curso (privado)." },
              { label: "Horizonte", text: "Contenido del curso (privado)." },
              { label: "Tolerancia a drawdown", text: "Contenido del curso (privado)." },
              { label: "Objetivo dominante", text: "Contenido del curso (privado)." },
              { label: "Restricciones operativas", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Ejemplo de mandato real",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Documento clave",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Fase 2 · Universo de activos",
        icon: "02",
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
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Por qué cinco años cotizando como mínimo",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "callout",
            label: "Por qué cripto solo BTC y ETH (cuando entra)",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "callout",
            label: "Regla del universo",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Fase 3 · Construcción por capas",
        icon: "03",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Anatom%C3%ADa_del_portafolio_FPM_202605101900.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Capa", "Rol", "Peso", "Activos"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
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
            type: "callout",
            label: "Sobre los rangos de peso",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "callout",
            label: "Regla de cordura",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Fase 4 · Simulación previa",
        icon: "04",
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
              { label: "Setup", text: "Contenido del curso (privado)." },
              { label: "Tesis", text: "Contenido del curso (privado)." },
              { label: "Journal diario", text: "Contenido del curso (privado)." },
              { label: "Revisión semanal", text: "Contenido del curso (privado)." },
              { label: "Cierre", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Criterio de paso",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Fase 5 · Gestión activa",
        icon: "05",
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
              { label: "Rebalanceo por bandas", text: "Contenido del curso (privado)." },
              { label: "Revisión mensual", text: "Contenido del curso (privado)." },
              { label: "Log de decisiones", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
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
            type: "callout",
            label: "Cierre del módulo",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
    ],
  },
  {
    number: 2,
    title: "Gestión dinámica del portafolio",
    subtitle: "Identificación de zonas de compra, toma de ganancias y rebalanceo a lo largo del tiempo. Tu cartera no es estática.",
    color: "blue",
    sections: [
      {
        title: "Por qué un portafolio vivo",
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
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Heráclito",
            source: "fragmento 91, según Plutarco · siglo V a.C.",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Idea fuerza",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Las tres operaciones",
        icon: "△",
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
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El Maestro",
            mythReference: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Zonas de compra",
        icon: "◎",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Tipo", "Disparador", "Ejemplo"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Regla de registro",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Toma de ganancias",
        icon: "⊞",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Regla del techo", text: "Contenido del curso (privado)." },
              { label: "Regla de la doble", text: "Contenido del curso (privado)." },
              { label: "Regla del cambio de tesis", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Ejemplo numérico de la regla del techo",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "callout",
            label: "Ejemplo numérico de la regla de la doble",
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
            type: "callout",
            label: "Clave psicológica",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Rebalanceo por bandas + calendario de revisión",
        icon: "⚑",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Si venís de Kickstart Inversiones",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Rebalanceo_por_bandas_infographic_202605102144.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Escenario", "% actual", "Acción"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Es gestión", "NO es gestión"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "table",
            headers: ["Frecuencia", "Duración", "Foco"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Conclusión del módulo",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
    ],
  },
  {
    number: 3,
    title: "Análisis fundamental y valuación de empresas",
    subtitle: "Métricas financieras clave para detectar empresas con fundamentos sólidos antes de que el mercado las descubra.",
    color: "gold",
    sections: [
      {
        title: "Análisis fundamental aplicado",
        blocks: [
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Warren Buffett",
            source: "Carta a los accionistas de Berkshire Hathaway, 2008",
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
            type: "callout",
            label: "Marco realista",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Las cinco lentes del análisis FPM",
        icon: "◧",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/ultima%20generacion%20de%20imagenes/An%C3%A1lisis_FPM_5_lentes_202605190231.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Lente", "Pregunta clave", "Métricas centrales"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
        ],
      },
      {
        title: "Lentes 1 y 2 · Rentabilidad + Eficiencia",
        icon: "01",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El que mira de afuera",
          },
          {
            type: "list",
            items: [
              { label: "Margen neto", text: "Contenido del curso (privado)." },
              { label: "Margen operativo", text: "Contenido del curso (privado)." },
              { label: "Free Cash Flow margin", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Atajo útil",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "callout",
            label: "Ejemplo numérico de las tres métricas",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "list",
            items: [
              { label: "ROE", text: "Contenido del curso (privado)." },
              { label: "ROIC", text: "Contenido del curso (privado)." },
              { label: "ROA", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
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
        ],
      },
      {
        title: "Lentes 3 y 4 · Solidez + Crecimiento",
        icon: "02",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Deuda/EBITDA", text: "Contenido del curso (privado)." },
              { label: "Current ratio", text: "Contenido del curso (privado)." },
              { label: "Interest coverage", text: "Contenido del curso (privado)." },
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
        ],
      },
      {
        title: "Lente 5 · Valuación + edge de mercado",
        icon: "03",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Métrica", "Para qué sirve", "Sesgo"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Regla de valuación",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Empresa y sector", text: "Contenido del curso (privado)." },
              { label: "Por qué entra al universo", text: "Contenido del curso (privado)." },
              { label: "Score por las cinco lentes", text: "Contenido del curso (privado)." },
              { label: "La tesis en una frase", text: "Contenido del curso (privado)." },
              { label: "Catalizadores esperados", text: "Contenido del curso (privado)." },
              { label: "Condiciones de salida", text: "Contenido del curso (privado)." },
              { label: "Peso objetivo", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "table",
            headers: ["Red flag", "Por qué importa"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "callout",
            label: "Ejercicio del módulo",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "reference",
            targetCourse: "Inner Circle · Obra Maestra",
            targetModule: "Módulo 2 — Tu Relación con el Dinero",
            reason: "Contenido del curso (privado).",
          },
        ],
      },
    ],
  },
  {
    number: 4,
    title: "Lectura macroeconómica y sectorial",
    subtitle: "Tendencias macro, ciclos económicos y sectores con potencial de crecimiento. Aprendés a leer el contexto que mueve a las empresas.",
    color: "teal",
    sections: [
      {
        title: "Las empresas no flotan en el vacío",
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
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Sócrates",
            source: "atribuida según Apología de Platón",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Frase clave",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Los cuatro ejes de la lectura macro",
        icon: "◌",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Eje", "Pregunta", "Indicadores", "Lectura cuando suben"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "callout",
            label: "Cómo usar esta tabla",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Tasas, crecimiento, inflación y liquidez",
        icon: "01",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Tasa de la Fed", text: "Contenido del curso (privado)." },
              { label: "Curva de rendimientos", text: "Contenido del curso (privado)." },
              { label: "Tasa real", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Error típico",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
          {
            type: "list",
            items: [
              { label: "PIB", text: "Contenido del curso (privado)." },
              { label: "PMI / ISM", text: "Contenido del curso (privado)." },
              { label: "Empleo no agrícola", text: "Contenido del curso (privado)." },
              { label: "CPI / PCE core", text: "Contenido del curso (privado)." },
              { label: "Expectativas a 5 años", text: "Contenido del curso (privado)." },
              { label: "Balance de la Fed y M2", text: "Contenido del curso (privado)." },
            ],
          },
        ],
      },
      {
        title: "Ciclos económicos y aplicación al FPM",
        icon: "02",
        blocks: [
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Economic_cycles_FPM_layers_202605101912.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Fase", "Características", "Sectores favorecidos"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "callout",
            label: "Objetivo real",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Miramos", "Ignoramos"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Ejercicio del módulo",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
    ],
  },
  {
    number: 5,
    title: "Sistema de monitoreo de noticias y catalizadores",
    subtitle: "Cómo filtrar el ruido y detectar las noticias económicas globales que realmente mueven precios.",
    color: "blue",
    sections: [
      {
        title: "El problema del exceso de información",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Séneca",
            source: "paráfrasis de Cartas a Lucilio, Carta II",
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
            type: "callout",
            label: "Principio de consumo",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Las tres categorías de noticias",
        icon: "◴",
        blocks: [
          {
            type: "image",
            src: "/ultima%20generacion%20de%20imagenes/Flujo_de_informaci%C3%B3n_profesional_202605190234.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Calendario_de_eventos_macroecon%C3%B3%E2%80%A6_202605102149.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Categoría", "Definición", "Acción FPM"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Sistema de filtrado por fuentes",
        icon: "01",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Tipo de fuente", "Ejemplos", "Confiabilidad"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "callout",
            label: "Dieta informativa",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Capa primaria · 30 min/semana", text: "Contenido del curso (privado)." },
              { label: "Capa secundaria · 60 min/semana", text: "Contenido del curso (privado)." },
              { label: "Capa terciaria · 30 min/mes", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Regla del corte total",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Catalizadores y regla de la espera",
        icon: "02",
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
              { text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "list",
            items: [
              { label: "1", text: "Contenido del curso (privado)." },
              { label: "2", text: "Contenido del curso (privado)." },
              { label: "3", text: "Contenido del curso (privado)." },
              { label: "4", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Regla de la espera",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El que vuelve cada noche",
            mythReference: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Calendario de eventos, rutina y cierre de disciplina",
        icon: "03",
        blocks: [
          {
            type: "table",
            headers: ["Evento", "Frecuencia", "Por qué importa"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "list",
            items: [
              { label: "Lunes 30 min", text: "Contenido del curso (privado)." },
              { label: "Miércoles 20 min", text: "Contenido del curso (privado)." },
              { label: "Viernes 30 min", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Ejercicio del módulo",
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
            type: "callout",
            label: "Cierre de la disciplina",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "reference",
            targetCourse: "Inner Circle · Obra Maestra",
            targetModule: "Módulo 1 — Mindset Fundacional",
            reason: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Aviso legal y educativo",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
    ],
  },
]