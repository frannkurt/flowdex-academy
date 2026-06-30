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
  | { type: "columns"; left: { title: string; items: ListItem[] }; right: { title: string; items: ListItem[] }; invertColors?: boolean }
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

export type InnerCircleModule = {
  number: number
  title: string
  subtitle: string
  color: "teal" | "blue" | "gold"
  sections: Section[]
}

export type Annex = {
  id: string
  letter: string
  title: string
  description: string
  applicableToModules: number[]
  downloadFileName: string
  type: "workbook" | "template" | "reference" | "test"
}

export const annexes: Annex[] = [
  {
    id: "workbook-30-days",
    letter: "A",
    title: "Workbook de 30 Días",
    description: "Contenido del curso (privado).",
    applicableToModules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    downloadFileName: "Anexo_A_Workbook_30_Dias.pdf",
    type: "workbook",
  },
  {
    id: "auditoria-kit",
    letter: "B",
    title: "Auditoría Kit",
    description: "Contenido del curso (privado).",
    applicableToModules: [6, 8, 9],
    downloadFileName: "Anexo_B_Auditoria_Kit.pdf",
    type: "template",
  },
  {
    id: "cartas-yo-futuro",
    letter: "C",
    title: "Cartas a tu Yo del Año que Viene",
    description: "Contenido del curso (privado).",
    applicableToModules: [0, 10],
    downloadFileName: "Anexo_C_Cartas_Yo_Futuro.pdf",
    type: "template",
  },
  {
    id: "tracker-progreso",
    letter: "D",
    title: "Tracker Visual de Progreso",
    description: "Contenido del curso (privado).",
    applicableToModules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    downloadFileName: "Anexo_D_Tracker_Progreso.pdf",
    type: "template",
  },
  {
    id: "lecturas-curadas",
    letter: "E",
    title: "20 Lecturas Esenciales",
    description: "Contenido del curso (privado).",
    applicableToModules: [10],
    downloadFileName: "Anexo_E_Lecturas_Curadas.pdf",
    type: "reference",
  },
  {
    id: "glosario-filosofico",
    letter: "F",
    title: "Glosario Filosófico Aplicado",
    description: "Contenido del curso (privado).",
    applicableToModules: [10],
    downloadFileName: "Anexo_F_Glosario_Filosofico.pdf",
    type: "reference",
  },
  {
    id: "self-assessment",
    letter: "G",
    title: "Self-Assessment Inicial y Final",
    description: "Contenido del curso (privado).",
    applicableToModules: [0, 10],
    downloadFileName: "Anexo_G_Self_Assessment.pdf",
    type: "test",
  },
]

export const innerCircleContent: InnerCircleModule[] = [
  {
    number: 1,
    title: "Mindset Fundacional",
    subtitle: "La diferencia que se construye antes de cualquier técnica",
    color: "teal",
    sections: [
      {
        title: "Por qué empezamos por acá",
        blocks: [
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/ESTATUA_ESTOICA_CON_LAPTOP_logo%20inicio%20curso.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Marco Aurelio",
            source: "Meditaciones, Libro V",
          },
          {
            type: "intro",
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
            label: "La promesa de este módulo",
            text: "Contenido del curso (privado).",
            variant: "key",
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
        ],
      },
      {
        title: "Amateur vs Profesional",
        icon: "△",
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
            type: "columns",
            left: {
              title: "EL AMATEUR",
              items: [
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
              ],
            },
            right: {
              title: "EL PROFESIONAL",
              items: [
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
              ],
            },
          },
          {
            type: "callout",
            label: "La trampa que querés evitar",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Epicteto",
            source: "Enchiridion, c. 125 d.C.",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "La identidad del operador",
        icon: "◎",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/DE_OPERAR_A_SER_OPERADOR_202605062303.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
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
              { label: "\"Yo opero\"", text: "Contenido del curso (privado)." },
              { label: "\"Yo soy operador\"", text: "Contenido del curso (privado)." },
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
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Aristóteles",
            source: "Ética a Nicómaco, Libro II",
          },
          {
            type: "callout",
            label: "El cambio que no se ve pero define todo",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "callout",
            label: "Para llevarte",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Proceso versus resultado",
        icon: "⊞",
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
            type: "table",
            headers: ["Combinación", "Qué pasó", "Lectura"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "callout",
            label: "La regla que te puede doler",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Epicteto",
            source: "Enchiridion, capítulo I (dicotomía del control)",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Por qué es tan difícil adoptarlo",
        icon: "⚡",
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
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Operar menos, no más",
        icon: "−",
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
            label: "Un indicador práctico",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Sun Tzu",
            source: "El Arte de la Guerra, capítulo IV",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Lo que vas a notar estas próximas semanas",
        icon: "→",
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
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Ejercicio práctico · 7 días",
        icon: "✦",
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
              { label: "4", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Acción para hoy",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Lo que viene en el M2",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
    ],
  },
  {
    number: 2,
    title: "Tu Relación con el Dinero",
    subtitle: "Cómo aparece en cada trade lo que no terminaste de sanar",
    color: "blue",
    sections: [
      {
        title: "Por qué este módulo",
        blocks: [
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Inscripción del Oráculo de Delfos",
            source: "atribuida a varios sabios griegos, c. siglo VI a.C.",
          },
          {
            type: "intro",
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
            label: "Un aviso antes de empezar",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Cómo te criaron pensando en plata",
        icon: "⌂",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Estatua_estoica_con_laptop_y_202605062306.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Lo que escuchabas en casa", text: "Contenido del curso (privado)." },
              { label: "Lo que veías sin que te lo dijeran", text: "Contenido del curso (privado)." },
              { label: "Lo que te tocó vivir directamente", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Para observar",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Antes de la tabla, una observación",
        icon: "◯",
        blocks: [
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
        title: "Las 7 creencias limitantes más comunes",
        icon: "7",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Creencia", "Cómo se nota en la Pista", "Antídoto en el Baile"],
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
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El que se fue y volvió",
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
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Séneca",
            source: "Cartas a Lucilio, Carta LXXI",
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
        title: "Abundancia vs Escasez (sin caer en lo new age)",
        icon: "∞",
        blocks: [
          {
            type: "columns",
            left: {
              title: "MENTALIDAD DE ESCASEZ",
              items: [
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
              ],
            },
            right: {
              title: "MENTALIDAD DE ABUNDANCIA",
              items: [
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
              ],
            },
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Cómo se traduce en pantalla",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Séneca",
            source: "Cartas a Lucilio, Carta II",
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
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El que mira de afuera",
            mythReference: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "El dinero como herramienta, no como objetivo",
        icon: "⚒",
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
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Aristóteles",
            source: "Ética a Nicómaco, Libro I",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Una prueba sencilla",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "callout",
            label: "Frase guía",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Antes del ejercicio",
        icon: "◈",
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
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Y hay otro",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
        ],
      },
      {
        title: "Ejercicio práctico · 7 días",
        icon: "✦",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Día 1", text: "Contenido del curso (privado)." },
              { label: "Día 2", text: "Contenido del curso (privado)." },
              { label: "Día 3", text: "Contenido del curso (privado)." },
              { label: "Día 4", text: "Contenido del curso (privado)." },
              { label: "Día 5", text: "Contenido del curso (privado)." },
              { label: "Día 6", text: "Contenido del curso (privado)." },
              { label: "Día 7", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Acción para hoy",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Para llevarte",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Lo que viene en el M3",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
    ],
  },
  {
    number: 3,
    title: "Las 6 Emociones Maestras",
    subtitle: "Las que te visitan en cada operación, las quieras o no",
    color: "gold",
    sections: [
      {
        title: "Por qué este módulo",
        blocks: [
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Epicteto",
            source: "Enquiridión, §5",
          },
          {
            type: "intro",
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
            label: "Cómo está armado este módulo",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "El principio básico: nombrarlas las desactiva",
        icon: "◉",
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
            author: "Lao Tsé",
            source: "Tao Te King, capítulo 33",
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
            label: "Micro-regla operativa",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Las 6 emociones, una por una",
        icon: "6",
        blocks: [
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/las%206%20emociones%20maestras.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Emoción", "Cuándo aparece", "Cómo se traduce en pantalla", "Cómo se gestiona"],
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
            label: "Frase guía",
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
        title: "Miedo",
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
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Séneca",
            source: "Cartas a Lucilio, Carta XIII",
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
            label: "Antídoto en vivo",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Codicia",
        icon: "02",
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
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Horacio",
            source: "Carmina, Libro III, oda 16",
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
            label: "Fricción útil",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Ego",
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
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Sócrates",
            source: "según los diálogos de Platón",
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
            label: "Pregunta de corte",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Esperanza",
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
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Francis Bacon",
            source: "Apophthegms New and Old, 1625",
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
            label: "Regla de protección",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Frustración",
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
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Aristóteles",
            source: "atribuida, repetida en la tradición peripatética",
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
            label: "Disciplina emocional",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Euforia",
        icon: "06",
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
            author: "Anónimo (esclavo romano del triunfo)",
            source: "tradición del Triunfo romano, según Tertuliano",
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
            label: "Contrapeso obligatorio",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "El patrón común a las 6",
        icon: "∿",
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
              { label: "Señales de cuerpo", text: "Contenido del curso (privado)." },
              { label: "Señales mentales", text: "Contenido del curso (privado)." },
              { label: "Señales conductuales", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Atajo mental útil",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Lo que no vamos a intentar",
        icon: "×",
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
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Ejercicio práctico · 7 días",
        icon: "✦",
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
              { label: "4", text: "Contenido del curso (privado)." },
              { label: "5", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Acción para hoy",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Métrica mínima",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "callout",
            label: "Para llevarte",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Lo que viene en el M4",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
    ],
  },
  {
    number: 4,
    title: "Sesgos Cognitivos",
    subtitle: "Las trampas mentales que cuestan plata sin que las veas",
    color: "teal",
    sections: [
      {
        title: "Por qué este módulo",
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
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Marco Aurelio",
            source: "Meditaciones, Libro XI",
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
            label: "Cita complementaria",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Los 15 sesgos que más cuestan plata",
        icon: "15",
        blocks: [
          {
            type: "table",
            headers: ["Sesgo", "Qué pasa", "Antídoto operativo"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
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
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/sesgos%20que%20cuestan%20dinero.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "El patrón común",
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
        title: "Cómo se desactivan los sesgos",
        icon: "⚙",
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
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Ejercicio práctico · 7 días",
        icon: "✦",
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
              { label: "4", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Acción para hoy",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Para llevarte",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Conexión con el M8",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "callout",
            label: "Lo que viene en el M5",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
    ],
  },
  {
    number: 5,
    title: "El Observador Interno",
    subtitle: "La práctica más poderosa y la menos enseñada",
    color: "blue",
    sections: [
      {
        title: "Por qué este módulo",
        blocks: [
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Sócrates",
            source: "Apología de Sócrates, según Platón",
          },
          {
            type: "intro",
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
            label: "Clave",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Yo soy / Yo tengo",
        icon: "↔",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "columns",
            left: {
              title: "YO SOY MIEDO",
              items: [
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
              ],
            },
            right: {
              title: "YO TENGO MIEDO",
              items: [
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
              ],
            },
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
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Estatua_zen_con_nubes_flotantes_202605062319.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Chequeo rápido",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Metacognición: pensar sobre tu pensamiento",
        icon: "◎",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Sin observador", text: "Contenido del curso (privado)." },
              { label: "Con observador", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Diferencia crítica",
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
        title: "La técnica de la desidentificación",
        icon: "△",
        blocks: [
          {
            type: "list",
            items: [
              { label: "1. Notar", text: "Contenido del curso (privado)." },
              { label: "2. Nombrar", text: "Contenido del curso (privado)." },
              { label: "3. Permitir sin obedecer", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Lenguaje útil", text: "Contenido del curso (privado)." },
              { label: "Lenguaje a evitar", text: "Contenido del curso (privado)." },
              { label: "Objetivo", text: "Contenido del curso (privado)." },
            ],
          },
        ],
      },
      {
        title: "Meditación aplicada al trading (10 minutos)",
        icon: "⏱",
        blocks: [
          {
            type: "table",
            headers: ["Bloque", "Duración", "Objetivo"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado).", "Contenido del curso (privado)."],
            ],
          },
          {
            type: "callout",
            label: "Regla",
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
        title: "Uso en tiempo real en pantalla",
        icon: "⚡",
        blocks: [
          {
            type: "list",
            items: [
              { label: "Antes", text: "Contenido del curso (privado)." },
              { label: "Durante", text: "Contenido del curso (privado)." },
              { label: "Después", text: "Contenido del curso (privado)." },
              { label: "Cierre del día", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Señal de progreso",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "callout",
            label: "Regla de emergencia",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
        ],
      },
      {
        title: "Ejercicio práctico · 30 días",
        icon: "✦",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Nota 1", text: "Contenido del curso (privado)." },
              { label: "Nota 2", text: "Contenido del curso (privado)." },
              { label: "Nota 3", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Acción para hoy",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Para llevarte",
            text: "Contenido del curso (privado).",
          },
          {
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El Maestro",
            mythReference: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Lo que viene en el M6",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
    ],
  },
  {
    number: 6,
    title: "El Cuerpo del Operador",
    subtitle: "El primer activo, el que casi nadie cuida",
    color: "gold",
    sections: [
      {
        title: "Por qué este módulo",
        blocks: [
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Juvenal",
            source: "Sátira X, c. siglo II d.C.",
          },
          {
            type: "intro",
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
            label: "Prioridad",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Los seis pilares del cuerpo operativo",
        icon: "6",
        blocks: [
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Estatua_estoica_con_seis_pilares_del%20cuerpo.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Pilar", "Riesgo de descuidarlo", "Práctica operativa"],
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
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Punto crítico",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Rutina diaria optimizada",
        icon: "☼",
        blocks: [
          {
            type: "table",
            headers: ["Hora", "Actividad"],
            rows: [
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
              ["Contenido del curso (privado).", "Contenido del curso (privado)."],
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
            label: "Error común",
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
        title: "Señales de alarma fisiológica",
        icon: "!",
        blocks: [
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
            type: "callout",
            label: "Lectura correcta",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "La estación de trabajo del operador",
        icon: "▦",
        blocks: [
          {
            type: "image",
            src: "/ultima%20generacion%20de%20imagenes/Operator_station_ancient_discipline_202605190242.jpeg",
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
              { label: "Silla", text: "Contenido del curso (privado)." },
              { label: "Monitor", text: "Contenido del curso (privado)." },
              { label: "Teclado y mouse", text: "Contenido del curso (privado)." },
              { label: "Iluminación", text: "Contenido del curso (privado)." },
              { label: "Aire y temperatura", text: "Contenido del curso (privado)." },
              { label: "Ruido", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Regla del cuerpo en silla",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Café y cortisol",
        icon: "☕",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "El error de la primera taza", text: "Contenido del curso (privado)." },
              { label: "La trampa del rendimiento", text: "Contenido del curso (privado)." },
              { label: "Cafeína y stop tardío", text: "Contenido del curso (privado)." },
              { label: "Alternativas mejores", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Test simple",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
        ],
      },
      {
        title: "Alcohol y trading",
        icon: "🍷",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "El sueño se degrada", text: "Contenido del curso (privado)." },
              { label: "La impulsividad sube", text: "Contenido del curso (privado)." },
              { label: "Glucosa inestable", text: "Contenido del curso (privado)." },
              { label: "El efecto acumulativo", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Regla del operador serio",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Qué notás cuando la base está bien",
        icon: "↑",
        blocks: [
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
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Ejercicio práctico · 30 días",
        icon: "✦",
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
              { label: "4", text: "Contenido del curso (privado)." },
              { label: "5", text: "Contenido del curso (privado)." },
              { label: "6", text: "Contenido del curso (privado)." },
              { label: "7", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Acción para hoy",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Para llevarte",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Lo que viene en el M7",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
    ],
  },
  {
    number: 7,
    title: "Estrés y Burnout",
    subtitle: "Detectarlo a tiempo, regularlo, recuperarse",
    color: "teal",
    sections: [
      {
        title: "Por qué este módulo",
        blocks: [
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Epicteto",
            source: "Enquiridión, §20",
          },
          {
            type: "intro",
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
            label: "Lectura complementaria",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Presión vs Estrés Crónico",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El que se fue y no volvió",
            mythReference: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Two_statues_healthy_stress_202605101936.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "columns",
            invertColors: true,
            left: {
              title: "PRESIÓN",
              items: [
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
              ],
            },
            right: {
              title: "ESTRÉS CRÓNICO",
              items: [
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
                { text: "Contenido del curso (privado)." },
              ],
            },
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Las 10 señales de que el estrés se acumuló",
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
            label: "UN AVISO IMPORTANTE",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
        ],
      },
      {
        title: "Las 5 técnicas de regulación rápida",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "exercise",
            title: "01 · RESPIRACIÓN 4-7-8",
            blocks: [
              {
                type: "paragraph",
                text: "Contenido del curso (privado).",
              },
              {
                type: "callout",
                label: "Cómo",
                text: "Contenido del curso (privado).",
                variant: "info",
              },
            ],
          },
          {
            type: "exercise",
            title: "02 · EXPOSICIÓN AL FRÍO",
            blocks: [
              {
                type: "paragraph",
                text: "Contenido del curso (privado).",
              },
              {
                type: "callout",
                label: "Cómo",
                text: "Contenido del curso (privado).",
                variant: "info",
              },
            ],
          },
          {
            type: "exercise",
            title: "03 · CAMINATA SIN TELÉFONO",
            blocks: [
              {
                type: "paragraph",
                text: "Contenido del curso (privado).",
              },
              {
                type: "callout",
                label: "Cómo",
                text: "Contenido del curso (privado).",
                variant: "info",
              },
            ],
          },
          {
            type: "exercise",
            title: "04 · DESCARGA DE ESCRITURA",
            blocks: [
              {
                type: "paragraph",
                text: "Contenido del curso (privado).",
              },
              {
                type: "callout",
                label: "Cómo",
                text: "Contenido del curso (privado).",
                variant: "info",
              },
            ],
          },
          {
            type: "exercise",
            title: "05 · CONTACTO HUMANO REAL",
            blocks: [
              {
                type: "paragraph",
                text: "Contenido del curso (privado).",
              },
              {
                type: "callout",
                label: "Cómo",
                text: "Contenido del curso (privado).",
                variant: "info",
              },
            ],
          },
        ],
      },
      {
        title: "Burnout: Las tres fases",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/ultima%20generacion%20de%20imagenes/Three_phases_of_burnout_202605190242.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "table",
            headers: ["Fase", "Señales", "Qué hacer"],
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
            type: "callout",
            label: "Cuándo buscar ayuda profesional",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
        ],
      },
      {
        title: "El descanso como protocolo",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Descanso diario", text: "Contenido del curso (privado)." },
              { label: "Descanso semanal", text: "Contenido del curso (privado)." },
              { label: "Descanso trimestral", text: "Contenido del curso (privado)." },
              { label: "Vacaciones anuales", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Ejercicio práctico · 7 días",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "1. Diagnóstico inicial", text: "Contenido del curso (privado)." },
              { label: "2. Cada día", text: "Contenido del curso (privado)." },
              { label: "3. Diagnóstico final", text: "Contenido del curso (privado)." },
              { label: "4. Programá tu descanso", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Si tu diagnóstico inicial fue 6+",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
          {
            type: "callout",
            label: "ACCIÓN PARA HOY",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "PARA LLEVARTE",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Lo que viene en el M8",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
    ],
  },
  {
    number: 8,
    title: "Rutinas y Rituales",
    subtitle: "Lo que hace que la disciplina deje de depender de la motivación",
    color: "blue",
    sections: [
      {
        title: "Por qué este módulo",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Operador_profesional_ciclo_diari%E2%80%A6_202605101938.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
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
            type: "callout",
            label: "Lectura complementaria",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Por qué las rutinas funcionan",
        blocks: [
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
        title: "El ritual pre-mercado",
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
              { label: "1. Hidratación", text: "Contenido del curso (privado)." },
              { label: "2. Respiración consciente", text: "Contenido del curso (privado)." },
              { label: "3. Calendario económico", text: "Contenido del curso (privado)." },
              { label: "4. Niveles HTF", text: "Contenido del curso (privado)." },
              { label: "5. Bias del día por escrito", text: "Contenido del curso (privado)." },
              { label: "6. Tope diario en plata", text: "Contenido del curso (privado)." },
              { label: "7. Estado mental", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "EL CHEQUEO DE BANDERAS ROJAS",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
        ],
      },
      {
        title: "El ritual durante el mercado",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "1. Antes de cada trade", text: "Contenido del curso (privado)." },
              { label: "2. Pausa cada 90 minutos", text: "Contenido del curso (privado)." },
              { label: "3. Después de cada trade ganador", text: "Contenido del curso (privado)." },
              { label: "4. Después de una pérdida", text: "Contenido del curso (privado)." },
              { label: "5. Si llegás al tope diario", text: "Contenido del curso (privado)." },
              { label: "6. Comida del mediodía", text: "Contenido del curso (privado)." },
            ],
          },
        ],
      },
      {
        title: "El ritual post-mercado",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "1. Cerrar la plataforma", text: "Contenido del curso (privado)." },
              { label: "2. Journal técnico", text: "Contenido del curso (privado)." },
              { label: "3. Journal psicológico", text: "Contenido del curso (privado)." },
              { label: "4. Marca de día", text: "Contenido del curso (privado)." },
              { label: "5. Bias para mañana", text: "Contenido del curso (privado)." },
              { label: "6. Cierre físico", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "EL HÁBITO QUE NADIE LLEVA Y QUE TODO PROFESIONAL LLEVA",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "callout",
            label: "Journal técnico del sitio",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
      {
        title: "Ritual semanal y mensual",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "exercise",
            title: "Ritual semanal (domingo a la noche, 30 minutos)",
            blocks: [
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
            ],
          },
          {
            type: "exercise",
            title: "Ritual mensual (1er domingo del mes, 60 minutos)",
            blocks: [
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
            ],
          },
        ],
      },
      {
        title: "Cómo construir la rutina si nunca tuviste una",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Primera etapa", text: "Contenido del curso (privado)." },
              { label: "Segunda etapa", text: "Contenido del curso (privado)." },
              { label: "Tercera etapa", text: "Contenido del curso (privado)." },
              { label: "Cuarta etapa", text: "Contenido del curso (privado)." },
              { label: "Quinta etapa", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Ejercicio práctico · 14 días",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "1. Cada día operativo", text: "Contenido del curso (privado)." },
              { label: "2. Llevá un mini-tracker", text: "Contenido del curso (privado)." },
              { label: "3. A los 14 días", text: "Contenido del curso (privado)." },
              { label: "4. Sin rituales = no operás", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "ACCIÓN PARA HOY",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "PARA LLEVARTE",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Lo que viene en el M9",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
    ],
  },
  {
    number: 9,
    title: "Decisiones Bajo Presión",
    subtitle: "Frameworks profesionales para que tu cabeza no decida sola",
    color: "gold",
    sections: [
      {
        title: "Por qué este módulo",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/El_espacio_entre_est%C3%ADmulo_202605101940.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Arquíloco",
            source: "atribuida, tradición griega arcaica · siglo VII a.C.",
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
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El Maestro",
            mythReference: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Cómo decide tu cerebro bajo estrés",
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
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Los 5 frameworks profesionales",
        blocks: [
          {
            type: "image",
            src: "/ultima%20generacion%20de%20imagenes/Cinco_frameworks_profesionales_d%E2%80%A6_202605190244.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "exercise",
            title: "01 · EL PRE-MORTEM",
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
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                ],
              },
            ],
          },
          {
            type: "exercise",
            title: "02 · LA REGLA DE LAS 24 HORAS",
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
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                ],
              },
            ],
          },
          {
            type: "exercise",
            title: "03 · EL CHECKLIST OBLIGATORIO",
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
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                ],
              },
            ],
          },
          {
            type: "exercise",
            title: "04 · LA SEGUNDA OPINIÓN",
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
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                ],
              },
            ],
          },
          {
            type: "exercise",
            title: "05 · EL \"WORST CASE\" DEFINIDO",
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
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                  { text: "Contenido del curso (privado)." },
                ],
              },
            ],
          },
          {
            type: "callout",
            label: "EL ATAJO MENTAL DE LOS 5 FRAMEWORKS",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "El arte de no decidir",
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
            label: "CUÁNDO ACTIVAR LA NO-DECISIÓN",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
        ],
      },
      {
        title: "El diario de decisiones",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Decisiones tomadas esta semana", text: "Contenido del curso (privado)." },
              { label: "Decisiones que evité tomar", text: "Contenido del curso (privado)." },
              { label: "Aprendizajes", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Ejercicio práctico · 14 días",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Semana 1", text: "Contenido del curso (privado)." },
              { label: "Semana 2", text: "Contenido del curso (privado)." },
              { label: "Al final de los 14 días", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "ACCIÓN PARA HOY",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "PARA LLEVARTE",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Lo que viene en el M10 — el cierre",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
    ],
  },
  {
    number: 10,
    title: "Filosofía Aplicada y Visión 10 Años",
    subtitle: "El cierre. Donde la obra se vuelve carrera, y la carrera, vida.",
    color: "teal",
    sections: [
      {
        title: "Por qué este módulo es el último",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/inner%20circle%20imagenes%20y%20placeholders/Statue_with_roots_and_tree_202605101942.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
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
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Epicteto",
            source: "esclavo, después filósofo, después libre · Enquiridión",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Los 6 principios filosóficos para el operador",
        blocks: [
          {
            type: "exercise",
            title: "AMOR FATI",
            blocks: [
              {
                type: "paragraph",
                text: "Contenido del curso (privado).",
              },
              {
                type: "callout",
                label: "APLICACIÓN AL OPERADOR",
                text: "Contenido del curso (privado).",
                variant: "info",
              },
            ],
          },
          {
            type: "exercise",
            title: "MEMENTO MORI",
            blocks: [
              {
                type: "paragraph",
                text: "Contenido del curso (privado).",
              },
              {
                type: "callout",
                label: "APLICACIÓN AL OPERADOR",
                text: "Contenido del curso (privado).",
                variant: "info",
              },
            ],
          },
          {
            type: "exercise",
            title: "DICOTOMÍA DEL CONTROL",
            blocks: [
              {
                type: "paragraph",
                text: "Contenido del curso (privado).",
              },
              {
                type: "callout",
                label: "APLICACIÓN AL OPERADOR",
                text: "Contenido del curso (privado).",
                variant: "info",
              },
            ],
          },
          {
            type: "exercise",
            title: "PREMEDITATIO MALORUM",
            blocks: [
              {
                type: "paragraph",
                text: "Contenido del curso (privado).",
              },
              {
                type: "callout",
                label: "APLICACIÓN AL OPERADOR",
                text: "Contenido del curso (privado).",
                variant: "info",
              },
            ],
          },
          {
            type: "exercise",
            title: "VIEW FROM ABOVE",
            blocks: [
              {
                type: "paragraph",
                text: "Contenido del curso (privado).",
              },
              {
                type: "callout",
                label: "APLICACIÓN AL OPERADOR",
                text: "Contenido del curso (privado).",
                variant: "info",
              },
            ],
          },
          {
            type: "exercise",
            title: "FOCUS ON THE PROCESS",
            blocks: [
              {
                type: "paragraph",
                text: "Contenido del curso (privado).",
              },
              {
                type: "callout",
                label: "APLICACIÓN AL OPERADOR",
                text: "Contenido del curso (privado).",
                variant: "info",
              },
            ],
          },
        ],
      },
      {
        title: "El operador sabio",
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
              { label: "Acepta sin resignarse", text: "Contenido del curso (privado)." },
              { label: "Recuerda su finitud", text: "Contenido del curso (privado)." },
              { label: "Distingue control de no-control", text: "Contenido del curso (privado)." },
              { label: "Visualiza lo peor", text: "Contenido del curso (privado)." },
              { label: "Mantiene la perspectiva", text: "Contenido del curso (privado)." },
              { label: "Vive en el proceso", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
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
        title: "Visión 10 Años",
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
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Marco Aurelio",
            source: "Meditaciones, Libro IV, §17",
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
        title: "Ejercicio Final · La Visión 10 Años",
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
              { label: "4", text: "Contenido del curso (privado)." },
              { label: "5", text: "Contenido del curso (privado)." },
              { label: "6", text: "Contenido del curso (privado)." },
              { label: "7", text: "Contenido del curso (privado)." },
              { label: "8", text: "Contenido del curso (privado)." },
              { label: "9", text: "Contenido del curso (privado)." },
              { label: "10", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "EL DETALLE QUE CAMBIA TODO",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "El cierre de la obra",
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
            type: "philosophy_quote",
            text: "Contenido del curso (privado).",
            author: "Friedrich Nietzsche",
            source: "El ocaso de los ídolos, 1888",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Manifiesto de cierre",
        icon: "✦",
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
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Lectura ritual",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El que vuelve cada noche",
          },
        ],
      },
      {
        title: "Ejercicio Final · 7 Días",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Lunes", text: "Contenido del curso (privado)." },
              { label: "Martes", text: "Contenido del curso (privado)." },
              { label: "Miércoles", text: "Contenido del curso (privado)." },
              { label: "Jueves", text: "Contenido del curso (privado)." },
              { label: "Viernes", text: "Contenido del curso (privado)." },
              { label: "Sábado", text: "Contenido del curso (privado)." },
              { label: "Domingo", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "ACCIÓN PARA HOY · LA ÚLTIMA",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "EL CIERRE",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
        ],
      },
    ],
  },
]
