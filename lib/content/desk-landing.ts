// Contenido de la landing de venta de Flowdex Desk (/desk para visitantes).
// Separado del JSX para poder iterar copy, precios y FAQ sin tocar componentes.

export const deskLanding = {
  hero: {
    eyebrow: "Flowdex Desk",
    headline: "La lectura completa de un activo, en minutos.",
    subheadline:
      "Un equipo de analistas de IA examina fundamentals, técnico, macro y noticias, debate la tesis y la verifica. El resultado es un tablero claro con el porqué auditable — la decisión sigue siendo tuya.",
    ctaText: "Probar gratis",
    ctaHref: "https://desk.flowdex.com.ar/?registro=1",
    loginText: "¿Ya tenés cuenta? Iniciá sesión",
    loginHref: "https://desk.flowdex.com.ar",
    trustSignal: "2 análisis gratis para probar · Sin tarjeta · Sin suscripción",
    trustBadges: ["2 análisis gratis", "Sin tarjeta", "Sin suscripción"],
  },

  stats: [
    { value: "15", label: "agentes por análisis" },
    { value: "200+", label: "activos cubiertos" },
    { value: "6", label: "clases de activo" },
    { value: "5", label: "lentes del método" },
  ],

  problem: {
    eyebrow: "El problema",
    title: "Analizar bien un activo hoy es un trabajo de mesa entera.",
    scenarios: [
      "Tenés cinco pestañas abiertas — el gráfico, las noticias, un screener, el dólar — y la decisión final sigue dependiendo de tu intuición del momento.",
      "El balance dice una cosa, el gráfico otra y los titulares una tercera. Nadie te ordena las tres en una misma lectura.",
      "Si el activo es argentino, todo se complica: pesos, CCL, brecha, inflación. Las plataformas globales no entienden ese contexto.",
    ],
  },

  solution: {
    eyebrow: "La solución",
    title: "Tu mesa de research personal.",
    description:
      "Flowdex Desk aplica el método Flowdex — los mismos criterios que se enseñan en la Academy — a cualquier activo que elijas, y te muestra el proceso completo mientras sucede.",
    steps: [
      {
        title: "Elegís el activo",
        text: "Acciones argentinas y globales, CEDEARs, índices, ETFs, divisas, futuros o cripto. Más de 200 activos en 6 clases.",
      },
      {
        title: "La mesa trabaja en vivo",
        text: "Ves a cada analista razonar en tiempo real: datos, noticias, debate alcista contra bajista, comité de riesgo y verificación.",
      },
      {
        title: "Recibís la Lectura Flowdex",
        text: "Un tablero de estado: tres ejes, fuerza de la lectura y cinco lentes con semáforo, cada una con su porqué. Nunca una orden de compra.",
      },
    ],
  },

  features: {
    eyebrow: "Qué hay adentro",
    title: "Una mesa completa, no un indicador más.",
    items: [
      {
        id: "agentes",
        icon: "users",
        title: "Un equipo que debate, no una respuesta única",
        description:
          "Analistas de macro, fundamentals, técnico y noticias; una tesis alcista contra una bajista; un comité de riesgo. La lectura sale de la discusión, no de un prompt.",
      },
      {
        id: "lectura",
        icon: "gauge",
        title: "Lectura Flowdex, no señales",
        description:
          "Tres ejes, cinco lentes con semáforo y la fuerza de la lectura. Te dice qué ES el activo según el método — qué hacer con eso lo decidís vos.",
      },
      {
        id: "verificador",
        icon: "shield",
        title: "Verificación anti-alucinación",
        description:
          "Un control final caza números que no cierran con el precio real y contradicciones entre analistas, antes de que la lectura llegue a tus ojos.",
      },
      {
        id: "argentina",
        icon: "map",
        title: "Entiende el mercado argentino de verdad",
        description:
          "CCL implícito por activo, brecha, dólares en vivo, bonos, riesgo país e inflación. Para nombres argentinos, todo se mide en dólares, no en pesos nominales.",
      },
      {
        id: "historial",
        icon: "history",
        title: "Historial y track record auditable",
        description:
          "Cada lectura queda guardada con fecha y precio. Podés volver, contrastarla con lo que pasó después y medir el criterio — el tuyo y el de la mesa.",
      },
      {
        id: "paneles",
        icon: "layout",
        title: "Paneles de mercado en vivo",
        description:
          "Mercados globales, movers del día, panel de dislocación del CCL, radar de dividendos, curva CER y calendario económico. Todo en una pantalla.",
      },
    ],
  },

  radar: {
    eyebrow: "Radar de Dividendos",
    title: "Cuando una empresa recorta el dividendo, ya es tarde. El Radar lo ve antes.",
    description:
      "El yield alto no te avisa — muchas veces es una trampa por caída del precio, justo antes de un recorte. El Radar juzga la CALIDAD de cada dividendo: si lo viene subiendo, si nunca lo cortó, y si el payout y la deuda lo sostienen. Más de 220 pagadores del mundo, clasificados — con una calculadora de renta a interés compuesto.",
    points: [
      "Clasificación de seguridad por activo: SÓLIDO · EN OBSERVACIÓN · FRÁGIL.",
      "Calculadora de ingreso: cuánto te renta tu capital, reinvirtiendo o cobrando.",
      "Alertas de ex-date y de cambios en la calidad del dividendo.",
    ],
    thesis: "El yield más alto de la lista es el más frágil. Por eso no alcanza con mirar el yield.",
    lockNote: "Tu cartera completa, los 220 activos y la calculadora están adentro.",
    includedNote: "Incluido en el pack Premium. También disponible como pase suelto desde USD 19.",
    unlockText: "¿Solo querés el Radar de Dividendos?",
    unlockSub: "Cada pagador, clasificado por la calidad de su dividendo. Un pase por tiempo, sin suscripción — el pack Premium ya lo incluye 90 días.",
    states: [
      { label: "SÓLIDO", color: "#3fb950" },
      { label: "EN OBSERVACIÓN", color: "#d4a017" },
      { label: "FRÁGIL", color: "#f85149" },
    ],
    passes: [
      { label: "30 días", price: "USD 19", href: "/desk/checkout?pack=radar30" },
      { label: "90 días", price: "USD 49", best: true, href: "/desk/checkout?pack=radar90" },
      { label: "1 año", price: "USD 149", bonus: "+10 análisis", href: "/desk/checkout?pack=radar365" },
    ],
    ctaText: "Ver los planes",
    ctaHref: "#desk-pricing",
  },

  socialProof: {
    eyebrow: "De dónde viene",
    title: "Construido por la casa que enseña el método.",
    text: "El Desk nace de la misma casa que enseña el método: las cinco lentes de fundamentals, la lectura en dólares y la disciplina de proceso que se estudian en los programas de Flowdex. Y hereda sus reglas públicas: sin señales, sin promesas de rentabilidad, sin urgencia inventada.",
    linkText: "Conocé Flowdex Academy",
    linkHref: "https://flowdex.com.ar",
  },

  pricing: {
    eyebrow: "Precio",
    title: "Pagás por análisis, no por suscripción.",
    note: "Sin membresía, sin renovación automática. Empezás gratis y comprás un pack solo cuando lo necesitás.",
    plans: [
      {
        id: "free",
        name: "Prueba",
        price: "USD 0",
        detail: "2 análisis completos",
        features: [
          "Los 15 agentes de IA por análisis",
          "200+ activos en 6 clases",
          "Paneles de mercado en vivo",
        ],
        ctaText: "Probar gratis",
        ctaHref: "https://desk.flowdex.com.ar/?registro=1",
        highlight: false,
      },
      {
        id: "inicial",
        name: "Inicial",
        price: "USD 12",
        detail: "5 análisis · USD 2,40 c/u",
        features: [
          "Los 15 agentes de IA por análisis",
          "200+ activos en 6 clases",
          "Verificación anti-alucinación",
        ],
        ctaText: "Comprar pack",
        ctaHref: "/desk/checkout?pack=inicial",
        highlight: false,
      },
      {
        id: "pro",
        name: "Pro",
        price: "USD 39",
        detail: "20 análisis · USD 1,95 c/u",
        features: [
          "Los 15 agentes de IA por análisis",
          "200+ activos en 6 clases",
          "Verificación anti-alucinación",
        ],
        ctaText: "Comprar pack",
        ctaHref: "/desk/checkout?pack=pro",
        highlight: true,
        badge: "Más elegido",
      },
      {
        id: "intensivo",
        name: "Premium",
        price: "USD 99",
        detail: "30 análisis · USD 3,30 c/u",
        features: [
          "Los 15 agentes de IA por análisis",
          "200+ activos en 6 clases",
        ],
        radarLine: "Radar de Dividendos · 90 días",
        ctaText: "Comprar pack",
        ctaHref: "/desk/checkout?pack=intensivo",
        highlight: false,
        badge: "Todo incluido",
      },
    ],
  },

  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Lo que vas a querer saber antes de entrar.",
    items: [
      {
        question: "¿Necesito experiencia técnica para usarlo?",
        answer:
          "No. La lectura sale en español claro y cada lente explica su porqué en una frase. Si pasaste por la Academy vas a reconocer el método; si no, el Desk es una buena puerta de entrada para verlo aplicado.",
      },
      {
        question: "¿Me dice qué comprar o vender?",
        answer:
          "No, y es deliberado. El Desk te entrega un tablero de estado con el razonamiento completo a la vista; la decisión es tuya. Las señales generan dependencia, no criterio — y eso va contra todo lo que hace Flowdex.",
      },
      {
        question: "¿En qué se diferencia de TradingView o de un screener?",
        answer:
          "Esas plataformas te muestran datos y gráficos; ordenarlos y leerlos sigue siendo tu trabajo. El Desk hace esa segunda parte: cruza fundamentals, técnico, macro y noticias, los hace debatir y te entrega una lectura verificada. Además entiende el mercado argentino — CCL, brecha, bonos — que las herramientas globales ignoran.",
      },
      {
        question: "¿Sirve para activos argentinos o solo para mercados grandes?",
        answer:
          "Para los dos. Cubre acciones argentinas (ADRs y panel local), CEDEARs, bonos y dólares, y también acciones de EE.UU., índices, ETFs, divisas, futuros y cripto. Para los nombres argentinos mide todo en dólares, que es donde se ve la verdad.",
      },
      {
        question: "¿Qué pasa cuando se me acaban los análisis?",
        answer:
          "Tenés 2 análisis gratis para arrancar. Si necesitás más, comprás un pack de 5, 20 o 30 análisis (el de 30 incluye el Radar de Dividendos) — sin suscripción ni renovación automática, y los créditos te duran 3 meses. Nadie te cobra de nuevo sin que lo pidas.",
      },
    ],
  },

  finalCta: {
    headline: "Tu próxima decisión, con una mesa de research atrás.",
    subheadline: "2 análisis gratis, completos. Sin tarjeta, sin suscripción.",
    ctaText: "Probar gratis",
    ctaHref: "https://desk.flowdex.com.ar/?registro=1",
  },
} as const

export type DeskLandingContent = typeof deskLanding
