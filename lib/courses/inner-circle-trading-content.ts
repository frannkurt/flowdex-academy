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
  | { type: "exercise"; title: string; blocks: Block[] }
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

export const innerCircleTradingContent: Module[] = [
  {
    number: 1,
    title: "Estrategia ORB Breakout",
    subtitle:
      "Sistema propietario desarrollado por Franco para Flowdex. Indicador exclusivo en TradingView.",
    color: "teal",
    sections: [
      {
        title: "Por qué ORB",
        blocks: [
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Sun Tzu",
            source: "El arte de la guerra, capítulo III · siglo V a.C.",
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
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Idea central",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "callout",
            label: "Cómo leer esta sección",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Opening Range adaptativo",
        icon: "◎",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/ORB_Breakout_adaptativo_trading_%E2%80%A6_202605101914.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Tipo de apertura", "Vela ORB que usamos", "Cuándo aparece"],
            rows: [
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
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
            type: "callout",
            label: "Regla de adaptación",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "list",
            items: [
              {
                label: "Checklist pre-entrada",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Consistencia",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Registro",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El que vuelve cada noche",
          },
        ],
      },
      {
        title: "La vela inicial dicta la tendencia",
        icon: "△",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Candlesticks_dictate_trend_infog%E2%80%A6_202605101916.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "Cuerpo alcista grande, mecha inferior chica",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Cuerpo bajista grande, mecha superior chica",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Mechas largas en ambos lados, cuerpo chico",
                text: "Contenido del curso (privado).",
              },
              {
                label: "ORB extremadamente pequeña respecto al ATR",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Por qué funciona",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Confluencias y validación del breakout",
        icon: "○",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Confluencia_de_validaci%C3%B3n_M%C3%BAltip%E2%80%A6_202605101918.jpeg",
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
              {
                label: "Soportes y resistencias",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Volume Profile",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Fair Value Gaps",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "Escala de calidad",
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
        title: "Volume Profile aplicado al ORB",
        icon: "□",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Volume_Profile_applied_trading_202605101922.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Área", "Significado", "Uso dentro del ORB"],
            rows: [
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Por qué no usamos POC como entrada directa",
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
              {
                label: "Si el cierre previo está sobre el POC",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Si el cierre previo está bajo el POC",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Si el cierre previo está exactamente en VAH o VAL",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "Lectura combinada",
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
        title: "Stops, contratos y microgestión",
        icon: "01",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Si venís de Kickstart Trading o Trading Lab",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Escenario", "Distancia al stop", "Contratos MES", "Riesgo total (USD 5/punto)"],
            rows: [
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
            type: "list",
            items: [
              {
                label: "Breakeven progresivo",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Toma de parcial",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Runner",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Cambio de paradigma",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "callout",
            label: "Disciplina de salida",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "callout",
            label: "Error frecuente",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
        ],
      },
      {
        title: "Cuándo NO operar ORB",
        icon: "02",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                text: "Contenido del curso (privado).",
              },
              {
                text: "Contenido del curso (privado).",
              },
              {
                text: "Contenido del curso (privado).",
              },
              {
                text: "Contenido del curso (privado).",
              },
              {
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "exercise",
            title: "Ejercicio del módulo",
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
                type: "paragraph",
                text: "Contenido del curso (privado).",
              },
            ],
          },
        ],
      },
      {
        title: "Caso guiado completo (Módulo 1)",
        icon: "03",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "Paso 1",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Paso 2",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Paso 3",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Paso 4",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Paso 5",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Paso 6",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "Qué se entrena acá",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Glosario operativo del módulo 1",
        icon: "04",
        blocks: [
          {
            type: "table",
            headers: ["Sigla", "Significado", "Uso práctico dentro del sistema"],
            rows: [
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "reference",
            targetCourse: "Inner Circle · Obra Maestra",
            targetModule: "Módulo 1 — Mindset Fundacional",
            reason: "Contenido del curso (privado).",
          },
        ],
      },
    ],
  },
  {
    number: 2,
    title: "Operativa intradía en sesión NY",
    subtitle:
      "Cómo ejecutar ORB en el día a día con multi-timeframe real, microgestión y límites de disciplina.",
    color: "blue",
    sections: [
      {
        title: "Por qué solo Nueva York",
        blocks: [
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Erasmo de Rotterdam",
            source: "Adagia, 1500 · recogiendo un proverbio griego anterior",
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
              {
                label: "Volumen institucional",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Direccionalidad clara",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Liquidez",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "Especialización",
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
        title: "Top-down preapertura",
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
            label: "Qué significa \"top-down\"",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "table",
            headers: ["Timeframe", "Para qué sirve", "Tiempo de lectura"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "list",
            items: [
              {
                label: "4h",
                text: "Contenido del curso (privado).",
              },
              {
                label: "1h",
                text: "Contenido del curso (privado).",
              },
              {
                label: "15 min",
                text: "Contenido del curso (privado).",
              },
              {
                label: "5 min",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Regla simple de sesgo",
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
        title: "Lectura de vela ORB y ejecución MTF",
        icon: "01",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Matriz_de_decisi%C3%B3n_operativa_cru%E2%80%A6_202605101919.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "Cuerpo alcista grande + mecha inferior chica",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Cuerpo bajista grande + mecha superior chica",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Mechas largas en ambos lados",
                text: "Contenido del curso (privado).",
              },
              {
                label: "ORB extremadamente pequeña",
                text: "Contenido del curso (privado).",
              },
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
            type: "callout",
            label: "Error de principiante",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Microgestión real",
        icon: "02",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Momento", "Decisión", "Por qué"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "+9 puntos (50 %)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "+14 puntos (78 %)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "+18 puntos (objetivo VAH)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "+25 puntos (extensión)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Final del trade",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "Lectura de impulso",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "callout",
            label: "Disciplina dura",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El Aprendiz",
          },
        ],
      },
      {
        title: "Cuándo cerrar el día con ganancia",
        icon: "03",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "Después de un trade en +2R o más",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Después de capturar tu objetivo diario",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Cuando el mercado entra en consolidación post-NY",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "Regla pragmática",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Caso guiado de sesión NY (Módulo 2)",
        icon: "04",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "Preapertura (9:10 EST)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Apertura (9:30 EST)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Post-entrada (9:45-10:30 EST)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Mid-sesión (10:30-12:00 EST)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Control de daño",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "Mensaje clave",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Glosario operativo del módulo 2",
        icon: "05",
        blocks: [
          {
            type: "table",
            headers: ["Término / Sigla", "Significado", "Aplicación concreta"],
            rows: [
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Ejercicio del módulo",
        icon: "06",
        blocks: [
          {
            type: "exercise",
            title: "Diez sesiones de validación",
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
                type: "highlight",
                text: "Contenido del curso (privado).",
              },
              {
                type: "callout",
                label: "Criterio de aprobación",
                text: "Contenido del curso (privado).",
                variant: "key",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    number: 3,
    title: "Correlación dinámica y DXY como contexto",
    subtitle:
      "Leer dólar y activos correlacionados para definir entorno operativo. No entra al setup, entra al contexto.",
    color: "gold",
    sections: [
      {
        title: "Para qué sirve la correlación",
        blocks: [
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Heráclito",
            source: "según Platón, Crátilo 402a · siglo V a.C.",
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
            label: "Uso correcto",
            text: "Contenido del curso (privado).",
            variant: "key",
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
            src: "/ultima%20generacion%20de%20imagenes/Correlaciones_operativas_multi-p%E2%80%A6_202605190227.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "DXY e implicancia en índices",
        icon: "◎",
        blocks: [
          {
            type: "table",
            headers: ["DXY", "Implicancia típica para índices US"],
            rows: [
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Marco mental",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Matriz de correlaciones útiles",
        icon: "01",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "NQ vs US10Y",
                text: "Contenido del curso (privado).",
              },
              {
                label: "NQ vs oro",
                text: "Contenido del curso (privado).",
              },
              {
                label: "ES vs NQ",
                text: "Contenido del curso (privado).",
              },
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
        ],
      },
      {
        title: "Rutina práctica de 3 minutos",
        icon: "02",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "1",
                text: "Contenido del curso (privado).",
              },
              {
                label: "2",
                text: "Contenido del curso (privado).",
              },
              {
                label: "3",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "table",
            headers: ["Output", "Acción"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "callout",
            label: "Resultado esperado",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "callout",
            label: "Aplicación inmediata",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Caso guiado de lectura contextual (Módulo 3)",
        icon: "03",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "Decisión prudente",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Decisión agresiva",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Aprendizaje",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "Objetivo pedagógico",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Glosario operativo del módulo 3",
        icon: "04",
        blocks: [
          {
            type: "table",
            headers: ["Sigla / Término", "Significado", "Cómo impacta operativa ORB"],
            rows: [
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Ejercicio del módulo",
        icon: "05",
        blocks: [
          {
            type: "exercise",
            title: "Una semana de calibración contextual",
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
            ],
          },
        ],
      },
    ],
  },
  {
    number: 4,
    title: "Monitoreo de mercado y noticias de impacto operativo",
    subtitle:
      "Calendario económico aplicado para definir zonas de operación y zonas de no-operación.",
    color: "teal",
    sections: [
      {
        title: "El calendario es parte del sistema",
        blocks: [
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Aristóteles",
            source: "paráfrasis de Ética a Nicómaco, Libro II",
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
            label: "Lectura profesional",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Tier 1 vs Tier 2",
        icon: "◎",
        blocks: [
          {
            type: "image",
            src: "/ultima%20generacion%20de%20imagenes/tier%20de%20noticias.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Tier", "Eventos", "Política Flowdex"],
            rows: [
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Evento", "Frecuencia", "Rango típico MES (puntos)", "Rango típico MNQ (puntos)"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "callout",
            label: "Cómo leer esta tabla",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Metáfora operativa",
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
        title: "Pre-evento y post-evento",
        icon: "01",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "Pre-evento opción 1 (recomendada)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Pre-evento opción 2",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Pre-evento opción 3",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "Cuenta de fondeo",
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
            type: "callout",
            label: "Objetivo de la pausa",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Calendario semanal Flowdex",
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
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Checklist semanal",
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
        title: "Caso guiado de semana operativa (Módulo 4)",
        icon: "03",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "Lunes",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Martes (CPI)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Miércoles",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Jueves (speech Fed)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Viernes (NFP)",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "Resultado esperado",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Glosario operativo del módulo 4",
        icon: "04",
        blocks: [
          {
            type: "table",
            headers: ["Sigla", "Significado", "Relevancia operativa"],
            rows: [
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Ejercicio del módulo",
        icon: "05",
        blocks: [
          {
            type: "exercise",
            title: "Un mes de auditoría de noticias",
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
            ],
          },
        ],
      },
    ],
  },
  {
    number: 5,
    title: "Gestión de riesgo profesional aplicada",
    subtitle:
      "Tamaño de posición, stop dinámico, drawdown y protocolo para cuenta propia y fondeo.",
    color: "blue",
    sections: [
      {
        title: "La verdad incómoda",
        blocks: [
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Epicteto",
            source: "Enquiridión, §21",
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
            label: "Propósito del riesgo",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Si venís de Kickstart Trading o Trading Lab",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Cuenta propia vs fondeo",
        icon: "◎",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Concepto", "Cuenta propia", "Cuenta de fondeo"],
            rows: [
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Diferencia clave",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Cuenta de fondeo: la regla del 10 % del drawdown",
        icon: "01",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: [
              "Cuenta",
              "Drawdown total",
              "Pérdida diaria máxima",
              "Riesgo por trade (start)",
              "Riesgo por trade (con colchón)",
            ],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "El primer trade del día con colchón",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Cálculo de tamaño en MES y MNQ",
        icon: "02",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "MES (S&P 500 micro)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "MNQ (Nasdaq micro)",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "table",
            headers: ["Setup", "Stop estructural", "Riesgo día (5 %)", "Contratos MES"],
            rows: [
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
            type: "callout",
            label: "Regla de no-trade",
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
        title: "Gestión del drawdown",
        icon: "03",
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
            label: "El ejemplo que lo explica todo",
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
            type: "image",
            src: "/ultima%20generacion%20de%20imagenes/Drawdown_asymmetry_mathematical_%E2%80%A6_202605190225.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/ultima%20generacion%20de%20imagenes/Drawdown_ladder_protocol_visuali%E2%80%A6_202605190222.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Drawdown desde último pico", "Estado", "Acción"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
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
            type: "list",
            items: [
              { text: "Contenido del curso (privado)." },
              { text: "Contenido del curso (privado)." },
              {
                text: "Contenido del curso (privado).",
              },
              { text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Reflejo profesional",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "callout",
            label: "Error crítico",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
        ],
      },
      {
        title: "Check-in psicológico",
        icon: "04",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "1", text: "Contenido del curso (privado)." },
              { label: "2", text: "Contenido del curso (privado)." },
              { label: "3", text: "Contenido del curso (privado)." },
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
        ],
      },
      {
        title: "Caso integral de sizing y supervivencia (Módulo 5)",
        icon: "05",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "Escenario A (reactivo)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Escenario B (profesional)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Conclusión",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "Entrenamiento real",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Glosario operativo del módulo 5",
        icon: "06",
        blocks: [
          {
            type: "table",
            headers: ["Término", "Significado", "Uso práctico"],
            rows: [
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
              [
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
                "Contenido del curso (privado).",
              ],
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Ejercicio integrador",
        icon: "07",
        blocks: [
          {
            type: "exercise",
            title: "Treinta sesiones de auditoría completa",
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
                type: "paragraph",
                text: "Contenido del curso (privado).",
              },
            ],
          },
        ],
      },
      {
        title: "Cierre · sistema integrado",
        icon: "08",
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
            author: "Platón",
            source: "La República, Libro VIII",
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
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Cierre de disciplina",
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
