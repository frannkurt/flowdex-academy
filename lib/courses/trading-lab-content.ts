import type { Module } from "@/lib/courses/kickstart-investment-content"

export const tradingLabContent: Module[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 1 — Cómo piensa el mercado y los Fair Value Gaps
  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 1,
    title: "Cómo piensa el mercado y los Fair Value Gaps",
    subtitle: "La lógica detrás del precio y los huecos que deja al moverse rápido",
    color: "blue",
    sections: [
      // ── PARTE I: Cómo piensa el mercado ──────────────────────────────────
      {
        title: "Empecemos por una imagen simple",
        icon: "◎",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Si venís de Kickstart Trading",
            text: "Contenido del curso (privado).",
            variant: "info",
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
            type: "callout",
            label: "La idea base",
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
        ],
      },
      {
        title: "Los dos modos del mercado: relax y carrera",
        icon: "⇄",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "Modo relax (balance)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Modo carrera (imbalance)",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "image",
            src: "/Trading lab imagenes/placeholder 1.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "Regla práctica",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Comprador agresivo vs comprador pasivo",
        icon: "⇉",
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
              { label: "Comprador agresivo", text: "Contenido del curso (privado)." },
              { label: "Comprador pasivo", text: "Contenido del curso (privado)." },
              { label: "Lo mismo del lado vendedor", text: "Contenido del curso (privado)." },
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
            label: "Lectura del chart",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Quién está del otro lado de tu trade",
        icon: "◈",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              {
                label: "Bancos y fondos grandes",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Algoritmos rápidos (HFT)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Fondos de pensión",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Trader retail",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      // ── PARTE II: Fair Value Gaps ─────────────────────────────────────────
      {
        title: "¿Qué es un Fair Value Gap?",
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
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Vela 1", text: "Contenido del curso (privado)." },
              {
                label: "Vela 2 — el impulso",
                text: "Contenido del curso (privado).",
              },
              { label: "Vela 3", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "image",
            src: "/Trading lab imagenes/placeholder 2 fvg.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "tv_widget",
            widget: "advanced_chart",
            symbol: "FOREXCOM:NSXUSD",
            label: "Ejercicio · cazá y marcá un FVG",
            caption: "Contenido del curso (privado).",
            height: 500,
          },
          {
            type: "list",
            items: [
              { label: "Paso 1", text: "Contenido del curso (privado)." },
              { label: "Paso 2", text: "Contenido del curso (privado)." },
              { label: "Paso 3", text: "Contenido del curso (privado)." },
              { label: "Paso 4", text: "Contenido del curso (privado)." },
            ],
          },
        ],
      },
      {
        title: "¿Por qué el mercado vuelve al hueco?",
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
            type: "callout",
            label: "Por qué funciona",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El Maestro",
          },
        ],
      },
      {
        title: "Las tres formas en que el precio visita el FVG",
        icon: "◷",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Antes de las tres visitas: qué es la validez de un FVG",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "example",
            items: [
              {
                label: "Visita parcial",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Visita al punto medio — CE",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Visita completa",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "concept",
            label: "CE — Consequent Encroachment",
            text: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "No todos los FVG son iguales — los cuatro tipos",
        icon: "◈",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "FVG de impulso",
                text: "Contenido del curso (privado).",
              },
              {
                label: "FVG de continuación",
                text: "Contenido del curso (privado).",
              },
              {
                label: "FVG de reversión",
                text: "Contenido del curso (privado).",
              },
              {
                label: "FVG dentro de FVG",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Cómo se opera un FVG — los cuatro requisitos",
        icon: "✓",
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
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Dónde entrar, dónde poner el stop y cuál es el objetivo",
        icon: "⇒",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              {
                label: "Agresivo — primer toque",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Estándar — el CE (50%)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Conservador — confirmación",
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
            label: "Tip de gestión",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Checklist completo del FVG",
        icon: "◎",
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
            type: "reference",
            targetCourse: "Inner Circle · Trading",
            targetModule: "Módulo 1 — Estrategia ORB Breakout",
            reason: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "El detector de FVG de Flowdex",
        icon: "💠",
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
            src: "/FVGIFVG.jpg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Detección automática", text: "Contenido del curso (privado)." },
              { label: "Proyección multi-timeframe", text: "Contenido del curso (privado)." },
              { label: "Alertas por etapas", text: "Contenido del curso (privado)." },
              { label: "Panel de stats", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "Un acelerador, no una muleta",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "tool",
            eyebrow: "Indicador Flowdex · gratis",
            toolName: "Detector FLOWDEX FVG / IFVG",
            description: "Contenido del curso (privado).",
            href: "https://www.tradingview.com/script/QNrtOsSP-FLOWDEX-FVG-IFVG-ICT-Fair-Value-Gap-Inverse-FVG-Detector/",
            ctaLabel: "Abrir el indicador en TradingView",
          },
        ],
      },
      // ── PARTE II: Volume Profile ──────────────────────────────────────────
      {
        title: "Volume Profile: una analogía para arrancar",
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
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Las cuatro siglas que tenés que dominar",
        icon: "◈",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              {
                label: "POC — Point of Control",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Value Area",
                text: "Contenido del curso (privado).",
              },
              {
                label: "VAH — Value Area High",
                text: "Contenido del curso (privado).",
              },
              {
                label: "VAL — Value Area Low",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "list",
            items: [
              {
                label: "HVN — High Volume Node",
                text: "Contenido del curso (privado).",
              },
              {
                label: "LVN — Low Volume Node",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Displacement (bonus)",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "image",
            src: "/Trading lab imagenes/Perfil_de_volumen_POC_VAH_ placeholder 5.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Cinco tipos de día según la forma del perfil",
        icon: "◷",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              {
                label: "Tipo D — Día tranquilo",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Tipo P — Acumulación alcista",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Tipo b — Distribución bajista",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Doble distribución",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "image",
            src: "/Trading lab imagenes/placeholder 6 tipos de fvg.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Perfil de sesión vs perfil compuesto",
        icon: "▥",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              {
                label: "Perfil de una sesión",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Perfil de una semana",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Perfil de un mes o más",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "concept",
            label: "POC semanal",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Tres setups que aparecen casi todos los días",
        icon: "◉",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "Vender en VAH, comprar en VAL",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Continuación tras ruptura del Value Area",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Vuelta al POC semanal",
                text: "Contenido del curso (privado).",
              },
            ],
          },
        ],
      },
      {
        title: "Cómo abre el día — las 4 categorías de Dalton",
        icon: "⇒",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              {
                label: "Apertura con impulso — OD (Open Drive)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Test fallido + impulso — OTD (Open Test Drive)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Rechazo y vuelta — ORR (Open Rejection Reverse)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Sin convicción — OA (Open Auction)",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "concept",
            label: "Initial Balance (IB)",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Checklist del Volume Profile",
        icon: "✓",
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
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 2 — Liquidez, el plan completo y glosario
  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 2,
    title: "Liquidez, el plan de trading y glosario",
    subtitle: "Por qué el mercado se mueve a esos niveles — y cómo juntarlo todo en un plan real",
    color: "teal",
    sections: [
      // ── PARTE IV: Liquidez ────────────────────────────────────────────────
      {
        title: "Liquidez: la palabra que lo explica todo",
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
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "El click mental que cambia todo",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Equal highs y equal lows: donde se acumulan los stops",
        icon: "⇄",
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
            type: "image",
            src: "/Trading lab imagenes/placeholder 8.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "El barrido de liquidez — la jugada más típica del mercado",
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
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
          {
            type: "lore_quote",
            text: "Contenido del curso (privado).",
            speaker: "El Aprendiz",
            mythReference: "Contenido del curso (privado).",
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
        title: "Sweep, stop hunt y falsa ruptura — las diferencias",
        icon: "▥",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              {
                label: "Sweep (barrido institucional)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Stop hunt",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Falsa ruptura",
                text: "Contenido del curso (privado).",
              },
            ],
          },
        ],
      },
      {
        title: "Dónde está la liquidez en el chart",
        icon: "◷",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "BSL — Buy-Side Liquidity (arriba del precio)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "SSL — Sell-Side Liquidity (abajo del precio)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Liquidez interna (INT)",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "image",
            src: "/Trading lab imagenes/placeholder 10 liquidez semanal.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "La trampa de la trampa: inducement",
        icon: "⚠",
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
            type: "concept",
            label: "Cómo te protegés del inducement",
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
      // ── PARTE V: Juntando todo ────────────────────────────────────────────
      {
        title: "Juntando todo — cada herramienta responde una pregunta",
        icon: "◉",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              {
                label: "Volume Profile",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Liquidez",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Fair Value Gap",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "Resumen mental",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Cómo analizar el mercado: siempre de lo grande a lo chico",
        icon: "⇒",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              {
                label: "Semanal y mensual",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Diario",
                text: "Contenido del curso (privado).",
              },
              {
                label: "4 horas y 1 hora",
                text: "Contenido del curso (privado).",
              },
              {
                label: "15 minutos y 5 minutos",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "reference",
            targetCourse: "Inner Circle · Trading",
            targetModule: "Módulo 2 — Operativa intradía en sesión NY",
            reason: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "El plan del día en cuatro momentos",
        icon: "◷",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "tool",
            toolName: "Calendario económico",
            description: "Contenido del curso (privado).",
            href: "/herramientas/noticias#calendario",
            ctaLabel: "Abrir calendario económico en pestaña nueva",
          },
          {
            type: "list",
            items: [
              {
                label: "1. Antes de abrir (10-30 minutos antes)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "2. La primera hora — observar más que operar",
                text: "Contenido del curso (privado).",
              },
              {
                label: "3. La sesión — esperás la confluencia",
                text: "Contenido del curso (privado).",
              },
              {
                label: "4. Al cerrar — anotás en el journal",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "tool",
            toolName: "Journal del trader",
            description: "Contenido del curso (privado).",
            href: "/journal",
            ctaLabel: "Abrir el journal en pestaña nueva",
          },
        ],
      },
      {
        title: "Gestión del dinero — las reglas que no se discuten",
        icon: "⚠",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "Si venís de Kickstart Trading",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "list",
            items: [
              {
                label: "Riesgo por trade",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Tope diario",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Tope semanal",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Tope mensual",
                text: "Contenido del curso (privado).",
              },
              {
                label: "R/R mínimo",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Tres pérdidas seguidas",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "Capital propio vs prop firm",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "La regla de oro",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      // ── GLOSARIO ─────────────────────────────────────────────────────────
      {
        title: "Glosario completo",
        icon: "◈",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              {
                label: "Auction theory",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Balance / Imbalance",
                text: "Contenido del curso (privado).",
              },
              {
                label: "BoS / ChoCH / MSS",
                text: "Contenido del curso (privado).",
              },
              {
                label: "BSL / SSL",
                text: "Contenido del curso (privado).",
              },
              {
                label: "CE — Consequent Encroachment",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Composite profile",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Displacement",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Equal highs / Equal lows",
                text: "Contenido del curso (privado).",
              },
              {
                label: "FVG — Fair Value Gap",
                text: "Contenido del curso (privado).",
              },
              {
                label: "HVN / LVN",
                text: "Contenido del curso (privado).",
              },
              {
                label: "IB / RTH / ETH",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Inducement",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Mitigación",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Open type",
                text: "Contenido del curso (privado).",
              },
              {
                label: "POC / VAH / VAL",
                text: "Contenido del curso (privado).",
              },
              {
                label: "SMT — Smart Money Trap",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Sweep / Stop hunt",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Trend day",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Value area",
                text: "Contenido del curso (privado).",
              },
              {
                label: "VWAP",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "list",
            items: [
              {
                label: "Mind Over Markets y Markets in Profile — Jim Dalton",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Trading in the Zone — Mark Douglas",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Steidlmayer on Markets",
                text: "Contenido del curso (privado).",
              },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 3 — Gestión avanzada y Prop Firms
  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 3,
    title: "Gestión avanzada y Prop Firms",
    subtitle: "R:R asimétrico, drawdown, sizing profesional y cómo operar con capital de terceros",
    color: "blue",
    sections: [
      // ── PARTE I: Gestión de riesgo avanzada ──────────────────────────────
      {
        title: "Lo único que realmente controlás",
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
            type: "callout",
            label: "La frase para tatuarte",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "R:R asimétrico — ganar más cuando ganás, perder menos cuando perdés",
        icon: "⇄",
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
            type: "example",
            items: [
              { label: "R:R 1:1", text: "Contenido del curso (privado)." },
              { label: "R:R 1:2", text: "Contenido del curso (privado)." },
              { label: "R:R 1:3", text: "Contenido del curso (privado)." },
              { label: "R:R 1:5", text: "Contenido del curso (privado)." },
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
                label: "Stop ajustado, no escondido",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Objetivo realista",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Mínimo 1:2",
                text: "Contenido del curso (privado).",
              },
            ],
          },
        ],
      },
      {
        title: "Drawdown — el enemigo silencioso",
        icon: "◈",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "callout",
            label: "La asimetría que duele",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "example",
            items: [
              { label: "Drawdown 5%", text: "Contenido del curso (privado)." },
              { label: "Drawdown 10%", text: "Contenido del curso (privado)." },
              { label: "Drawdown 20%", text: "Contenido del curso (privado)." },
              { label: "Drawdown 30%", text: "Contenido del curso (privado)." },
              { label: "Drawdown 50%", text: "Contenido del curso (privado)." },
              { label: "Drawdown 70%", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "image",
            src: "/Trading lab imagenes/Trading_drawdown_asymmetry_educa…_202605051531.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Sizing avanzado — cuántos contratos tomar de verdad",
        icon: "▥",
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
            type: "list",
            items: [
              {
                label: "1 — Sizing por volatilidad",
                text: "Contenido del curso (privado).",
              },
              {
                label: "2 — Sizing por calidad del setup",
                text: "Contenido del curso (privado).",
              },
              {
                label: "3 — Sizing escalonado en la gestión",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "El secreto que casi nadie aplica",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      {
        title: "Checklist de gestión avanzada",
        icon: "✓",
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
        ],
      },
      // ── PARTE II: Prop Firms ──────────────────────────────────────────────
      {
        title: "Qué es una prop firm y para qué te sirve",
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
            type: "list",
            items: [
              {
                label: "Fase 1 — Evaluación",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Fase 2 — Funded",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "concept",
            label: "El modelo de negocio de las prop firms",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Las dos lógicas de drawdown que tenés que entender",
        icon: "⚠",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              {
                label: "Daily drawdown",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Trailing drawdown",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Max drawdown total",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "image",
            src: "/Trading lab imagenes/Dos_lógicas_de_drawdown_trading_202605051536.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "La estrategia para pasar la evaluación",
        icon: "⇒",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "1 — Conservador en los primeros días",
                text: "Contenido del curso (privado).",
              },
              {
                label: "2 — Solo setups A",
                text: "Contenido del curso (privado).",
              },
              {
                label: "3 — Stop diario autoimpuesto más conservador que el de la firma",
                text: "Contenido del curso (privado).",
              },
              {
                label: "4 — Apuntar al target de a poco",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "La paradoja de las prop firms",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
          {
            type: "image",
            src: "/Trading lab imagenes/Trading_equity_curve_evaluation_…_202605051540.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "La estrategia para mantener la cuenta funded",
        icon: "◷",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "Reducí tamaño la primera semana",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Sacá dinero apenas puedas",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Operá menos, no más",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Diversificá entre prop firms",
                text: "Contenido del curso (privado).",
              },
            ],
          },
        ],
      },
      {
        title: "Errores típicos que hacen perder la cuenta",
        icon: "⚠",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              {
                label: "Aumentar tamaño después de un día bueno",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Operar noticias",
                text: "Contenido del curso (privado).",
              },
              {
                label: "No leer la letra chica",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Revenge trading después de una pérdida",
                text: "Contenido del curso (privado).",
              },
            ],
          },
        ],
      },
      {
        title: "Checklist Prop Firms",
        icon: "✓",
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
            ],
          },
          {
            type: "tool",
            toolName: "Journal del trader",
            description: "Contenido del curso (privado).",
            href: "/journal",
            ctaLabel: "Abrir el journal en pestaña nueva",
          },
          {
            type: "tool",
            toolName: "Calendario económico",
            description: "Contenido del curso (privado).",
            href: "/herramientas/noticias#calendario",
            ctaLabel: "Abrir calendario económico en pestaña nueva",
          },
          {
            type: "highlight",
            text: "Contenido del curso (privado).",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MÓDULO 4 — Disciplina operativa y gestión emocional aplicada
  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 4,
    title: "Disciplina operativa y gestión emocional aplicada",
    subtitle: "La técnica te lleva al setup. La cabeza te lleva a ejecutarlo.",
    color: "gold",
    sections: [
      // ── INTRO ─────────────────────────────────────────────────────────────
      {
        title: "Antes de arrancar: el módulo más importante",
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
            type: "callout",
            label: "La verdad incómoda",
            text: "Contenido del curso (privado).",
            variant: "info",
          },
          {
            type: "image",
            src: "/Trading lab imagenes/Head_silhouette_with_market_elem…_ psicologia placeholder1.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
        ],
      },
      // ── PARTE I: Emociones y sesgos ───────────────────────────────────────
      {
        title: "Los cuatro jinetes emocionales",
        icon: "⚠",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              {
                label: "Miedo",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Codicia",
                text: "Contenido del curso (privado).",
              },
              {
                label: "FOMO",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Frustración",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "concept",
            label: "La técnica más simple y más efectiva: nombrarlas",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Los sesgos cognitivos: cuando la cabeza te miente sin que te des cuenta",
        icon: "◈",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "Revenge trading",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Overconfidence",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Recency bias",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Sesgo de confirmación",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Anclaje",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "Cómo te protegés",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
        ],
      },
      // ── PARTE II: Rutinas y pérdidas ──────────────────────────────────────
      {
        title: "El trader profesional es repetitivo. Eso es lo bueno",
        icon: "◷",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              {
                label: "Rutina pre-mercado (15 a 30 minutos antes)",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Rutina post-mercado (5 a 15 minutos después de cerrar)",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Manejo de pérdidas: el momento donde se separan",
        icon: "⇄",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              {
                label: "1 pérdida",
                text: "Contenido del curso (privado).",
              },
              {
                label: "2 pérdidas seguidas",
                text: "Contenido del curso (privado).",
              },
              {
                label: "3 pérdidas seguidas",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Día completo perdedor",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "callout",
            label: "El círculo vicioso del revenge trading",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
        ],
      },
      // ── PARTE III: Identidad y mentalidad ────────────────────────────────
      {
        title: "El cambio que casi nadie nota",
        icon: "◉",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "example",
            items: [
              { label: "Mentalidad retail", text: "Contenido del curso (privado)." },
              { label: "Mentalidad profesional", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "image",
            src: "/Trading lab imagenes/Trading_de_retail_a_profesional_202605051615.jpeg",
            alt: "Contenido del curso (privado).",
            caption: "Contenido del curso (privado).",
          },
        ],
      },
      {
        title: "Pensar en proceso, no en resultado",
        icon: "▥",
        blocks: [
          {
            type: "paragraph",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Bueno y ganador", text: "Contenido del curso (privado)." },
              { label: "Bueno y perdedor", text: "Contenido del curso (privado)." },
              { label: "Malo y ganador", text: "Contenido del curso (privado)." },
              { label: "Malo y perdedor", text: "Contenido del curso (privado)." },
            ],
          },
          {
            type: "callout",
            label: "La gran inversión mental",
            text: "Contenido del curso (privado).",
            variant: "key",
          },
          {
            type: "concept",
            label: "Operar menos, no más",
            text: "Contenido del curso (privado).",
          },
        ],
      },
      // ── PARTE IV: Equilibrio ──────────────────────────────────────────────
      {
        title: "Tu cabeza es tu único activo",
        icon: "◎",
        blocks: [
          {
            type: "intro",
            text: "Contenido del curso (privado).",
          },
          {
            type: "list",
            items: [
              { label: "Sueño", text: "Contenido del curso (privado)." },
              { label: "Movimiento", text: "Contenido del curso (privado)." },
              { label: "Comida", text: "Contenido del curso (privado)." },
              { label: "Hidratación", text: "Contenido del curso (privado)." },
              { label: "Pausa real al mediodía", text: "Contenido del curso (privado)." },
            ],
          },
        ],
      },
      {
        title: "Límites de pantalla y vida fuera del trading",
        icon: "⇒",
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
            type: "callout",
            label: "Señales de alerta",
            text: "Contenido del curso (privado).",
            variant: "warning",
          },
        ],
      },
      // ── PARTE V: Auto-análisis y cierre ───────────────────────────────────
      {
        title: "Auto-análisis de cierre del curso",
        icon: "✓",
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
          {
            type: "image",
            src: "/Trading lab imagenes/ultimo placeholder el viaje acaba de empezar.jpeg",
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
        title: "¿Y ahora qué?",
        icon: "◉",
        blocks: [
          {
            type: "callout",
            label: "Una cosa antes de cerrar",
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
                label: "Franco revisa tus operaciones personalmente",
                text: "Contenido del curso (privado).",
              },
              {
                label: "La estrategia ORB — la nueva joya del sistema",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Qué prop firm usar y por qué",
                text: "Contenido del curso (privado).",
              },
              {
                label: "Seguimiento de cuentas de fondeo en vivo",
                text: "Contenido del curso (privado).",
              },
              {
                label: "La comunidad que no para",
                text: "Contenido del curso (privado).",
              },
            ],
          },
          {
            type: "concept",
            label: "La diferencia entre saber y hacer",
            text: "Contenido del curso (privado).",
          },
        ],
      },
    ],
  },
]
