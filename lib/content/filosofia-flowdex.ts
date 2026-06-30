export type FilosofiaFlowdex = {
  carta: {
    etiqueta: string
    titulo: string
    parrafos: string[]
    firma: {
      nombre: string
      rol: string
    }
  }
  marca: {
    kicker: string
    titulo: string
    bajada: string
  }
  secciones: Array<{
    id: string
    etiqueta: string
    titulo: string
    parrafos: string[]
  }>
  comoTrabajamos: Array<{
    titulo: string
    body: string
  }>
  loQueNoHacemos: Array<{
    titulo: string
    body: string
  }>
  tiempo: Array<{
    label: string
    text: string
  }>
  comoDecidimos: {
    no: string[]
    si: string[]
    cierre: string
    lema: string
  }
  cierre: {
    titulo: string
    parrafos: string[]
  }
  paraVos: {
    titulo: string
    parrafos: string[]
    gracias: string[]
    firma: {
      nombre: string
      rol: string
    }
  }
}

export const filosofiaFlowdex: FilosofiaFlowdex = {
  carta: {
    etiqueta: "Documento interno · Sólo para alumnos",
    titulo: "Antes de empezar",
    parrafos: [
      "Te escribo esta carta antes de que abras los módulos.",
      "Este documento no está en nuestro landing. No es marketing. Lo guardamos solo para los que ya entraron, y por eso lo estás leyendo: porque ya sos parte.",
      "No te conozco, pero sé algo: no llegaste acá por casualidad. Investigaste, comparaste, dudaste, y al final elegiste esto. Ya hiciste la parte difícil de cualquier formación seria, que es decidir empezar.",
      "Lo que vas a leer es la filosofía con la que construimos Flowdex desde el primer día, lo que pienso del rubro, y la forma en que decidimos cada cosa que entregamos.",
      "Unos minutos de lectura. Después seguimos con los módulos.",
    ],
    firma: {
      nombre: "Franco Escudero",
      rol: "Fundador, Flowdex",
    },
  },
  marca: {
    kicker: "FLOWDEX",
    titulo: "Filosofía Flowdex",
    bajada:
      "Que cuando alguien decida formarse financieramente en serio, Flowdex sea la única respuesta razonable.",
  },
  secciones: [
    {
      id: "problema",
      etiqueta: "01",
      titulo: "El problema que vemos",
      parrafos: [
        "El mercado de la educación financiera en español está saturado de promesas. Cursos que aseguran libertad financiera en noventa días. Capturas selectivas en redes que prometen replicar resultados imposibles. Salas privadas donde se cobran señales que su propio autor no aplica con su capital. Programas de motivación disfrazados de formación.",
        "La consecuencia es una generación entera que confunde consumo con aprendizaje y entusiasmo con criterio. Gente que pasa años saltando de promesa en promesa sin construir nada que la sostenga cuando el mercado se pone serio.",
        "Flowdex existe en respuesta a ese ruido. No para sumarse. Para diferenciarse en silencio.",
      ],
    },
    {
      id: "lo-que-somos",
      etiqueta: "02",
      titulo: "Lo que somos",
      parrafos: [
        "Una plataforma de educación financiera seria, construida desde Argentina y pensada para el mundo.",
        "No somos una academia de motivación. No somos un canal de señales. No somos un curso de YouTube reempaquetado. No somos la traducción al español de un programa extranjero.",
        "Somos un sistema pedagógico progresivo: cinco niveles que van desde finanzas personales hasta operativa profesional, con una capa de obra interior que pocos ofrecen y nadie iguala. El método se aplica sobre instrumentos reales —futuros, Forex, acciones, CEDEARs, FCI, cripto— y se sostiene con disciplina diaria, no con entusiasmo de fin de semana.",
      ],
    },
    {
      id: "a-quien-servimos",
      etiqueta: "04",
      titulo: "A quién servimos",
      parrafos: [
        "Servimos al que decide en serio. Al que ya intentó atajos y volvió. Al que entiende que la formación financiera real es un proceso, no un producto. Al que está dispuesto a sostener compromiso durante meses, no días.",
        "No servimos al que busca hacerse rico rápido. No por elitismo: por honestidad. Sería deshonesto venderle algo que no le va a funcionar.",
        "Esa distinción es nuestro filtro de entrada y nuestra forma de respeto al que sí está listo.",
      ],
    },
    {
      id: "la-barra",
      etiqueta: "06",
      titulo: "La barra",
      parrafos: [
        "Hoy es más fácil que nunca armar un curso de trading o inversión. Cualquiera con un micrófono y una cuenta de Hotmart puede competir. Esa es nuestra realidad de mercado, y no la peleamos.",
        "Nuestro trabajo es hacer Flowdex tan bueno que el resto deje de ser comparable. Que cuando alguien decida formarse en serio, no encuentre alternativa. No por marketing: por método.",
        "No competimos. Subimos la barra.",
      ],
    },
    {
      id: "alumno-protagonista",
      etiqueta: "07",
      titulo: "El alumno como protagonista",
      parrafos: [
        "En Flowdex el héroe no somos nosotros. Es el alumno.",
        "Nosotros somos el método, las herramientas, el sistema. El que cambia es él. El que sostiene la disciplina es él. El que aplica durante meses cuando ya no hay novedad es él.",
        "Esa distinción importa. Los que prometen se ponen al centro de su narrativa: ellos te transforman, ellos te llevan, ellos te rescatan. Nosotros nos corremos al costado: vos te transformás aplicando lo que entregamos.",
        "Es una diferencia de ego, pero también de honestidad operativa.",
      ],
    },
    {
      id: "lo-que-si-prometemos",
      etiqueta: "09",
      titulo: "Lo que sí prometemos",
      parrafos: [
        "No prometemos hacer rico a nadie. Eso lo decidirán el mercado, la disciplina del alumno, sus circunstancias personales y la suerte que ningún programa controla.",
        "Prometemos enseñar a operar con criterio profesional. A leer mercados sin ilusiones. A gestionar riesgo como gente que entendió que el capital es escaso y la disciplina rentable. A construir hábitos que sostengan la operativa cuando la novedad pase.",
        "Esa es nuestra promesa. Y es la única honesta que existe en este rubro.",
      ],
    },
  ],
  comoTrabajamos: [
    {
      titulo: "Entregamos método, no motivación.",
      body: "La motivación dura tres semanas. El método sostenido durante un año cambia operativas. Dos años cambian carreras. Cinco años cambian vidas. Esa secuencia no se acelera con consignas: se sostiene con sistemas.",
    },
    {
      titulo: "Enseñamos lo aburrido.",
      body: "Lo aburrido es lo rentable. Journal, repetición, gestión del dos por ciento, top-down analysis, Risk:Reward, registro de cada decisión. Si alguien vino a Flowdex buscando emoción, vino al lugar equivocado. La emoción la pone el mercado. Nosotros ponemos el método.",
    },
    {
      titulo: "No reemplazamos al alumno.",
      body: "Ningún programa transforma a quien viene a consumir contenido. Transforma a quien viene a aplicarlo. Nuestro éxito se mide por compromiso de aplicación, no por horas de video reproducidas.",
    },
    {
      titulo: "Filtramos cada decisión por una sola pregunta.",
      body: "¿Esto hace a Flowdex superior, o solo nos iguala al ruido del mercado?\n\nSi la respuesta es \"iguala\", no se hace. Aunque venda. Aunque escale. Aunque otros lo hagan.",
    },
  ],
  loQueNoHacemos: [
    {
      titulo: "No prometemos retornos.",
      body: "Porque sería mentira. Los rendimientos pasados no garantizan rendimientos futuros, y cualquiera que diga lo contrario está confundiendo o estafando.",
    },
    {
      titulo: "No competimos por precio.",
      body: "Porque la educación financiera no es una commodity. Bajar el precio para escalar termina degradando el contenido. Preferimos servir bien a cien alumnos serios que mal a diez mil entusiastas pasajeros.",
    },
    {
      titulo: "No regalamos contenido por marketing.",
      body: "Porque eso comunica que el contenido no vale. Lo que entregamos vale. Su precio refleja su profundidad y la disciplina con la que se construyó.",
    },
    {
      titulo: "No usamos testimonios manipulados ni capturas selectivas.",
      body: "Porque ese es el truco más viejo del rubro y porque arruinaría exactamente lo que construimos: confianza basada en realidad.",
    },
    {
      titulo: "No replicamos lo que hacen los que prometen.",
      body: "Aun cuando les funcione comercialmente. Especialmente cuando les funciona comercialmente. Cada concesión a esa lógica nos aleja de lo que somos.",
    },
  ],
  tiempo: [
    { label: "6 meses", text: "Conoce los fundamentos." },
    { label: "12 meses", text: "Opera con criterio básico." },
    {
      label: "24 meses",
      text: "Construye operativa propia con resultados consistentes.",
    },
    {
      label: "36 meses",
      text: "Podría considerar pasar a capital significativo.",
    },
  ],
  comoDecidimos: {
    no: [
      "¿Suena a gurú?",
      "¿Promete sin exigir compromiso del alumno?",
      "¿Baja la barra para escalar más rápido?",
      "¿Engaña al alumno, aunque sea sutilmente?",
    ],
    si: [
      "¿Eleva el método?",
      "¿Dignifica al alumno?",
      "¿Hace a Flowdex superior, no solo más grande?",
    ],
    cierre:
      "Cada feature, cada módulo, cada decisión de precio, cada copy, cada comunicación pasa por esas siete preguntas antes de salir.",
    lema: "Lo demás es ruido.",
  },
  cierre: {
    titulo: "Cierre",
    parrafos: [
      "Flowdex no es para todos. No tiene que serlo. Tiene que ser para los pocos que entienden que la formación financiera real es un trabajo de años, no un evento de fin de semana, y que están dispuestos a hacer ese trabajo con un método serio detrás.",
      "A esos alumnos los vamos a servir mejor que cualquier otra plataforma del rubro. No por mérito personal: por sistema.",
      "Y mientras los demás compiten por captar la atención del que busca atajos, nosotros vamos a estar acá: construyendo el método, refinando la pedagogía, escribiendo el contenido que debería existir y casi nadie escribe.",
      "Esa es nuestra contribución al mercado. Esa es nuestra ventaja competitiva real. Esa es nuestra forma de hacer empresa desde Argentina hacia el resto del mundo, con la seriedad que el rubro merece.",
    ],
  },
  paraVos: {
    titulo: "Para vos",
    parrafos: [
      "Bienvenido al lado serio de la educación financiera.",
      "Lo que sigue depende de vos: aplicar, sostener, volver a empezar cuando haga falta.",
      "Estamos para acompañar el método. El trabajo lo ponés vos.",
      "Y cuando dudes, releé este documento. Cuando lo apliques con honestidad, vas a entender por qué lo guardamos solo para alumnos.",
    ],
    gracias: [
      "Gracias por leer hasta acá.",
      "Gracias por elegir formarte con seriedad.",
      "Gracias por confiar en este método.",
    ],
    firma: {
      nombre: "Franco Escudero - Augusto Holman",
      rol: "Fundadores",
    },
  },
}
