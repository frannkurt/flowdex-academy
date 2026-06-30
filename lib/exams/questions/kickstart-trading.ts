// Preguntas del examen de Kickstart Trading, organizadas por módulo.
//
// Este archivo es SERVER-ONLY: se importa exclusivamente desde server
// components y route handlers (lib/exams/server.ts y la API /api/exams/submit).
// Nunca se importa desde un componente "use client", así que el
// `correct_option_index` y la `explanation` jamás llegan al bundle del cliente.
//
// Reglas para sumar preguntas nuevas:
// - El `id` tiene que ser único y estable. Convención: `<curso>-m<modulo>-q<n>`.
// - Las opciones son 4. La correcta puede estar en cualquier posición; el
//   server-side shuffler las mezcla antes de enviarlas al cliente.
// - La `explanation` solo se muestra cuando el alumno reprueba (lista de
//   respuestas a revisar).

import type { ExamQuestionRaw } from "@/lib/exams/types"

const COURSE_SLUG = "kickstart-trading"

const module1: ExamQuestionRaw[] = [
  {
    id: "kt-m1-q1",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Cuál es la diferencia central entre tradear e invertir?",
    options: [
      "Son lo mismo, son sinónimos",
      "El trading busca ganar con el movimiento del precio en plazos cortos; la inversión busca el valor a largo plazo",
      "El trading solo opera futuros y la inversión solo acciones",
      "El trading nunca tiene ganancias, solo la inversión sí",
    ],
    correct_option_index: 1,
    explanation:
      "La diferencia central no es el activo ni el riesgo: es el plazo y el tipo de análisis. Trading mira precio en corto plazo; inversión mira valor en largo plazo.",
  },
  {
    id: "kt-m1-q2",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué hace distinto al 10% de traders retail que gana?",
    options: [
      "Operan con plan, arriesgan poco por trade, registran todo y se especializan",
      "Tienen más capital y mejor tecnología que el resto",
      "Aciertan más trades que el promedio del retail",
      "Tienen información privilegiada de las instituciones",
    ],
    correct_option_index: 0,
    explanation:
      "No es talento ni recursos: es proceso. Plan escrito, gestión de riesgo, journal y especialización en pocos instrumentos.",
  },
  {
    id: "kt-m1-q3",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué es el bid?",
    options: [
      "El último precio operado en el mercado",
      "El costo de comisión del broker",
      "El mejor precio al que alguien está dispuesto a vender ahora",
      "El mejor precio al que alguien está dispuesto a pagar ahora",
    ],
    correct_option_index: 3,
    explanation:
      "Bid es el precio al que alguien quiere comprar AHORA. El ask es donde alguien quiere vender. La diferencia entre ambos es el spread.",
  },
  {
    id: "kt-m1-q4",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "Cuando el precio sube, ¿qué está pasando en el mercado?",
    options: [
      "Hay más compradores que vendedores en total",
      "Los compradores agresivos aceptan pagar el ask, dominando sobre los vendedores agresivos",
      "Los bancos centrales están comprando",
      "Hay noticias positivas en ese momento",
    ],
    correct_option_index: 1,
    explanation:
      "No es el conteo de participantes lo que mueve el precio, es la agresividad direccional: quien acepta pagar el ask empuja arriba; quien acepta vender al bid empuja abajo.",
  },
  {
    id: "kt-m1-q5",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Cuál es la actitud correcta del trader retail frente a las instituciones?",
    options: [
      "Competir directamente usando análisis más refinado",
      "Operar siempre en horarios donde no estén activas",
      "Ignorarlas porque no afectan al retail",
      "Acompañar el flujo que las instituciones generan",
    ],
    correct_option_index: 3,
    explanation:
      "El retail no compite mano a mano con las instituciones (capital, info, tecnología). La estrategia es leer dónde están operando y acompañar.",
  },
  {
    id: "kt-m1-q6",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Por qué el módulo recomienda especializarse en pocos instrumentos al inicio?",
    options: [
      "Porque otros mercados están cerrados al retail",
      "Porque dominar dos contratos es más útil que conocer veinte por encima",
      "Porque solo MES y MNQ tienen Paper Trading",
      "Porque los gurúes lo recomiendan",
    ],
    correct_option_index: 1,
    explanation:
      "Especializarse da control y repetición. Aprender muchos contratos a la vez disuelve la atención y deja vacíos pedagógicos.",
  },
  {
    id: "kt-m1-q7",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "Según el módulo, ¿cuál es la proporción aproximada entre técnica y mentalidad en el trading?",
    options: [
      "20% técnica y 80% mentalidad",
      "50% técnica y 50% mentalidad",
      "80% técnica y 20% mentalidad",
      "100% técnica si tenés buena estrategia",
    ],
    correct_option_index: 0,
    explanation:
      "Las herramientas técnicas se aprenden en meses. La mentalidad correcta toma años y es lo que realmente sostiene la consistencia.",
  },
  {
    id: "kt-m1-q8",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué necesitás para ser rentable si solo ganás la mitad de tus trades (50% de winrate)?",
    options: [
      "Aumentar el apalancamiento",
      "Operar mucho más volumen para compensar",
      "Cambiar de estrategia hasta tener winrate alto",
      "Que el promedio de tus ganancias supere al promedio de tus pérdidas (R:R favorable)",
    ],
    correct_option_index: 3,
    explanation:
      "Con 50% de winrate seguís siendo rentable si tu R:R es favorable: perdés poco cuando perdés y ganás más cuando ganás. La asimetría hace la rentabilidad, no el winrate.",
  },
  {
    id: "kt-m1-q9",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Cuáles son los tres errores fatales del primer mes según el módulo?",
    options: [
      "Operar sin stop loss, no llevar journal, no estudiar",
      "Sizing exagerado, revenge trading, abandonar el plan por una racha",
      "Operar fuera de horario, usar mucho apalancamiento, no diversificar",
      "Operar con emoción, sin gráfico, sin broker regulado",
    ],
    correct_option_index: 1,
    explanation:
      "Los tres patrones que liquidan cuentas en el primer mes: subir el tamaño por certeza subjetiva, operar para recuperar lo perdido, y cambiar el plan después de una racha mala.",
  },
  {
    id: "kt-m1-q10",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué es el revenge trading?",
    options: [
      "Abrir un trade inmediatamente después de perder para recuperar lo perdido",
      "Operar contra la tendencia del mercado",
      "Tradear durante noticias económicas importantes",
      "Aumentar el tamaño de posición después de ganar",
    ],
    correct_option_index: 0,
    explanation:
      "Es la operación que responde a una emoción (recuperar lo perdido), no a un setup técnico. Una pérdida chica se convierte en cuatro pérdidas seguidas.",
  },
  {
    id: "kt-m1-q11",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Por qué Flowdex eligió futuros como mercado base del curso?",
    options: [
      "Porque son los más rentables",
      "Porque son centralizados, regulados y todos ven el mismo precio y volumen al mismo tiempo",
      "Porque están abiertos 24/7 sin pausas",
      "Porque tienen el menor capital de entrada de todos los mercados",
    ],
    correct_option_index: 1,
    explanation:
      "La centralización permite leer comportamiento real del mercado sin filtros de un broker o exchange particular. Datos confiables para aprender lectura institucional.",
  },
  {
    id: "kt-m1-q12",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué es un tick?",
    options: [
      "La unidad mínima de movimiento del precio en un contrato",
      "Una vela japonesa de 1 minuto",
      "Un grupo de 4 puntos",
      "El intervalo de tiempo entre dos operaciones",
    ],
    correct_option_index: 0,
    explanation:
      "Un tick es el escalón mínimo de movimiento del precio. Si el precio puede pasar de 4500.00 a 4500.25 pero no a 4500.10, el tick es 0.25.",
  },
  {
    id: "kt-m1-q13",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "En el MES y el MNQ, ¿cuántos ticks equivalen a 1 punto?",
    options: ["1 tick", "2 ticks", "4 ticks", "10 ticks"],
    correct_option_index: 2,
    explanation:
      "En MES y MNQ, 1 punto equivale a 4 ticks. Si el precio se mueve 1 punto, se movió 4 ticks.",
  },
  {
    id: "kt-m1-q14",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Cuál es la diferencia operativa entre MES y MNQ?",
    options: [
      "MES sigue el Nasdaq y MNQ sigue el S&P 500",
      "MES es más volátil que MNQ",
      "MES sigue al S&P 500 (más estable); MNQ sigue al Nasdaq (más rápido y volátil)",
      "MES y MNQ son el mismo contrato con distinto broker",
    ],
    correct_option_index: 2,
    explanation:
      "MES (Micro E-mini S&P 500) sigue las 500 empresas más grandes de USA, más estable. MNQ (Micro E-mini Nasdaq) sigue al índice tecnológico, más rápido intradía.",
  },
  {
    id: "kt-m1-q15",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Por qué arrancar operando con micro contratos en lugar de minis?",
    options: [
      "Porque los micros tienen comisiones más bajas",
      "Porque los minis no están disponibles para retail",
      "Porque los micros se mueven más rápido y aprendés más",
      "Porque permiten entrenar ejecución y gestión emocional sin la misma presión financiera",
    ],
    correct_option_index: 3,
    explanation:
      "Los micros tienen menor exposición por tick, lo que permite practicar sin presión emocional desproporcionada. Base para escalar después.",
  },
  {
    id: "kt-m1-q16",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Cuál es la mejor señal para aumentar la cantidad de contratos operados?",
    options: [
      "Haber ganado tres trades seguidos",
      "Tener más capital disponible en la cuenta",
      "Poder ver el P&L moverse rápido sin que te active emocionalmente",
      "Cuando se acerca una noticia importante con alta volatilidad",
    ],
    correct_option_index: 2,
    explanation:
      "La señal real es fisiológica: si todavía sentís pánico con 1 contrato, no es momento de pasar a más. El cuerpo te marca el ritmo, no la ambición.",
  },
  {
    id: "kt-m1-q17",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Cuál es la ventana operativa más activa para los futuros del curso?",
    options: [
      "Apertura asiática",
      "Apertura europea (Londres)",
      "Cierre del viernes",
      "Apertura de USA (10:30 hora referencia del programa)",
    ],
    correct_option_index: 3,
    explanation:
      "La apertura de USA concentra la mayor cantidad de capital institucional del día. Movimientos más rápidos, amplios y sostenidos.",
  },
  {
    id: "kt-m1-q18",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Cuántas horas concentradas frente al chart sugiere el módulo para un trader retail serio?",
    options: [
      "1 a 2 horas concentradas en ventanas clave, más pre y post mercado",
      "8 horas al día siguiendo el mercado en vivo",
      "Las que aguantes mentalmente, cuantas más mejor",
      "Solo durante noticias importantes",
    ],
    correct_option_index: 0,
    explanation:
      "Operar bien se parece más a un cirujano que a un cajero: pocas horas concentradas con alta precisión, mucho de preparación y revisión.",
  },
  {
    id: "kt-m1-q19",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué actividad concreta separa al alumno que mejora del que repite errores durante años?",
    options: [
      "Operar más horas por día siguiendo el chart",
      "Registrar cada trade en un journal con entrada, salida, motivo y emoción",
      "Cambiar de estrategia hasta encontrar la ganadora",
      "Aumentar el capital de la cuenta",
    ],
    correct_option_index: 1,
    explanation:
      "El journal de post-mercado es lo que diferencia al alumno que mejora del que repite errores durante años. Sin registro no hay aprendizaje.",
  },
  {
    id: "kt-m1-q20",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Cuál es la lógica del \"resultado vs decisión\" en trading?",
    options: [
      "Un buen trader siempre tiene buenos resultados",
      "El resultado de un trade individual determina si la decisión fue correcta",
      "Una decisión buena puede perder por azar y una mala puede ganar por azar; se evalúa por series, no por trade único",
      "Hay que ignorar los resultados y enfocarse solo en el proceso",
    ],
    correct_option_index: 2,
    explanation:
      "Resultado y calidad de decisión no siempre coinciden en una operación aislada. La evaluación correcta es por series largas, no por trade único.",
  },
]

const module2: ExamQuestionRaw[] = [
  {
    id: "kt-m2-q1",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué significa el sufijo `1!` en TradingView (ej. MES1!)?",
    options: [
      "Es el contrato continuo, siempre el más activo del momento",
      "Es el primer contrato vencido",
      "Indica timeframe de 1 minuto",
      "Es la primera operación del día",
    ],
    correct_option_index: 0,
    explanation:
      "El sufijo `1!` carga el contrato continuo (front month), siempre el más activo del momento. Evita tener que cambiar manualmente cuando rota el vencimiento.",
  },
  {
    id: "kt-m2-q2",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Cuál es el objetivo principal del Paper Trading?",
    options: [
      "Ganar plata virtual para llevar al ranking",
      "Practicar la mecánica de la plataforma sin riesgo real",
      "Reemplazar el dinero real definitivamente",
      "Probar estrategias automatizadas",
    ],
    correct_option_index: 1,
    explanation:
      "Paper Trading es un simulador con dinero virtual. Sirve para practicar ejecución, timing y gestión emocional sin poner capital real en riesgo.",
  },
  {
    id: "kt-m2-q3",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Cuál es el objetivo de la primera práctica de buy/sell en TradingView?",
    options: [
      "Ganar la mayor cantidad de dinero virtual posible",
      "Probar todas las estrategias del módulo",
      "Familiarizarte con la plataforma y tocar botones con confianza",
      "Encontrar tu estilo definitivo de trading",
    ],
    correct_option_index: 2,
    explanation:
      "La primera práctica es de familiarización: que tu mano, tu vista y tu cabeza se amiguen con TradingView. No medimos ganancia ni gestión todavía: solo confianza con los botones.",
  },
  {
    id: "kt-m2-q4",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "El análisis técnico (velas, estructura, soportes, resistencias) ¿en qué mercados funciona?",
    options: [
      "Solo en futuros, no en Forex o cripto",
      "Solo en mercados centralizados",
      "Solo en MES y MNQ",
      "En cualquier mercado con gráfico de precio: futuros, Forex, acciones, cripto",
    ],
    correct_option_index: 3,
    explanation:
      "El análisis técnico es universal. Funciona igual en futuros, Forex, acciones, cripto y cualquier mercado con gráfico. Cambia el terreno, no la habilidad.",
  },
  {
    id: "kt-m2-q5",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué cuatro datos contiene una vela japonesa?",
    options: [
      "Compradores, vendedores, volumen, volatilidad",
      "Apertura, cierre, máximo, mínimo",
      "Bid, ask, spread, tick",
      "High, low, promedio, mediana",
    ],
    correct_option_index: 1,
    explanation:
      "Cada vela contiene cuatro datos: apertura (open), cierre (close), máximo (high) y mínimo (low). Es la forma más eficiente de representar el comportamiento del precio en un período.",
  },
  {
    id: "kt-m2-q6",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Cuándo una vela es alcista?",
    options: [
      "Cuando el cuerpo es grande",
      "Cuando tiene mecha inferior larga",
      "Cuando el cierre es mayor que la apertura",
      "Cuando aparece en un soporte",
    ],
    correct_option_index: 2,
    explanation:
      "Una vela es alcista cuando el cierre es mayor que la apertura. En TradingView por defecto aparece en verde o blanco.",
  },
  {
    id: "kt-m2-q7",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué indica una vela con cuerpo grande y mechas cortas?",
    options: [
      "Indecisión del mercado",
      "Una posible reversión",
      "Volumen bajo",
      "Convicción del movimiento",
    ],
    correct_option_index: 3,
    explanation:
      "Cuerpo grande con mechas cortas indica convicción direccional: el precio se movió decidido sin ser rechazado en los extremos.",
  },
  {
    id: "kt-m2-q8",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué es un Doji?",
    options: [
      "Una vela con apertura y cierre casi iguales, indica indecisión",
      "Una vela alcista con mecha superior larga",
      "Un patrón de tres velas consecutivas",
      "Una vela de cierre semanal",
    ],
    correct_option_index: 0,
    explanation:
      "Doji es una vela donde apertura y cierre son casi iguales. El precio no pudo decidir dirección. Su peso depende del contexto donde aparece.",
  },
  {
    id: "kt-m2-q9",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué patrón de vela tiene cuerpo chico arriba y mecha inferior larga?",
    options: ["Shooting Star", "Pin Bar bajista", "Hammer (martillo)", "Inside Bar"],
    correct_option_index: 2,
    explanation:
      "Hammer (martillo): cuerpo chico arriba con mecha inferior larga. Los vendedores intentaron bajar el precio pero los compradores recuperaron terreno. Posible piso en zona de soporte.",
  },
  {
    id: "kt-m2-q10",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué confirma una tendencia alcista en términos estructurales?",
    options: [
      "Higher Highs (HH) y Higher Lows (HL)",
      "Velas verdes consecutivas",
      "Mucho volumen comprador",
      "Una sola vela grande de impulso",
    ],
    correct_option_index: 0,
    explanation:
      "Una tendencia alcista activa se confirma con la secuencia de Higher Highs (máximos más altos) y Higher Lows (mínimos más altos). El precio hace escalones hacia arriba.",
  },
  {
    id: "kt-m2-q11",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Cómo se identifica un mercado en rango?",
    options: [
      "El precio hace HH y HL constantemente",
      "El precio cae bajo el mínimo anterior",
      "El precio oscila entre dos extremos sin definir tendencia clara",
      "Aparecen muchas velas Doji seguidas",
    ],
    correct_option_index: 2,
    explanation:
      "En rango, el precio oscila entre dos niveles sin definir una tendencia. No hay new highs ni new lows relevantes: los extremos se repiten.",
  },
  {
    id: "kt-m2-q12",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué es un soporte?",
    options: [
      "Una línea exacta donde el precio nunca cae",
      "Una zona donde la demanda superó a la oferta y el precio rebotó hacia arriba",
      "El nivel del último cierre del día",
      "El precio promedio del día",
    ],
    correct_option_index: 1,
    explanation:
      "Un soporte es una zona donde la demanda superó a la oferta en el pasado y el precio rebotó. No es una línea exacta: es un área de interés.",
  },
  {
    id: "kt-m2-q13",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Por qué se piensa en zonas y no en líneas exactas para marcar soportes y resistencias?",
    options: [
      "Porque las líneas exactas son más subjetivas",
      "Porque las zonas son más fáciles de dibujar",
      "Porque las líneas exactas solo se usan en cripto",
      "Porque el precio reacciona en áreas, no en puntos exactos",
    ],
    correct_option_index: 3,
    explanation:
      "El precio no rebota en el pixel exacto: rebota en un área donde el mercado ha reaccionado antes. Pensar en zonas reduce errores de ejecución.",
  },
  {
    id: "kt-m2-q14",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué es el role reversal?",
    options: [
      "Cambiar la dirección del trade en medio de la operación",
      "Cuando un soporte roto se convierte en resistencia (o viceversa)",
      "Operar contra la tendencia principal",
      "Rotar entre largo y corto en el mismo día",
    ],
    correct_option_index: 1,
    explanation:
      "Role reversal: un soporte roto se convierte en potencial resistencia (y viceversa). El mercado lo recuerda y suele reaccionar ahí.",
  },
  {
    id: "kt-m2-q15",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "En el análisis top-down, ¿qué timeframe se usa para definir el contexto general del mercado?",
    options: ["1M o 5M", "15M o 30M", "1H", "4H o Daily"],
    correct_option_index: 3,
    explanation:
      "El timeframe alto (4H o Daily) define dirección y mapa general: tendencia, rango, zonas macro y niveles de mayor jerarquía. Es donde arranca el top-down.",
  },
  {
    id: "kt-m2-q16",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "Si el timeframe alto está en tendencia alcista pero el 5M muestra una señal aislada de venta, ¿cuál tiene mayor peso o validez?",
    options: [
      "Manda el timeframe mayor (alto)",
      "Manda la señal de 5M porque es más reciente",
      "Hay que entrar mitad largo y mitad corto",
      "Se evita operar ese día",
    ],
    correct_option_index: 0,
    explanation:
      "Si los timeframes se contradicen, manda el timeframe mayor. Operar contra el contexto alto por una señal aislada de 5M es la forma más rápida de comerse stops.",
  },
  {
    id: "kt-m2-q17",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué se entiende por \"confluencia\" en análisis técnico?",
    options: [
      "Cuando varios indicadores coinciden en una compra",
      "Cuando dos brokers muestran el mismo precio",
      "Cuando varios timeframes y factores apuntan a la misma zona",
      "Cuando hay convergencia de medias móviles",
    ],
    correct_option_index: 2,
    explanation:
      "Confluencia es cuando varios timeframes y factores (estructura, niveles, role reversal) apuntan a la misma zona. Menos impulsos, más criterio.",
  },
  {
    id: "kt-m2-q18",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué hace que un nivel sea relevante para operar?",
    options: [
      "Aparecer solo en el timeframe diario",
      "Coincidir con el cierre del día anterior",
      "Ser dibujado por un trader institucional",
      "Tener al menos dos toques con reacción visible y coherencia con la estructura mayor",
    ],
    correct_option_index: 3,
    explanation:
      "Un nivel vale si tuvo al menos dos toques, generó una reacción observable y es coherente con la estructura mayor. Menos es más: 3 niveles bien marcados superan a 20 confusos.",
  },
  {
    id: "kt-m2-q19",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Cuál es el error más común al armar el plan operativo en timeframes?",
    options: [
      "Mirar demasiados activos a la vez",
      "Empezar por 1M/5M y buscar justificativo después en el timeframe alto",
      "Usar TradingView en lugar de otra plataforma",
      "No usar las drawing tools",
    ],
    correct_option_index: 1,
    explanation:
      "El orden correcto es de arriba hacia abajo: TF alto define contexto, TF medio valida, TF bajo ejecuta. Arrancar por 1M/5M es operar primero y justificar después.",
  },
  {
    id: "kt-m2-q20",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué pasa con un patrón de vela (ej. un Hammer) cuando aparece \"en el aire\", sin nivel relevante ni estructura que lo acompañe?",
    options: [
      "Pierde peso operativo y no debería tomarse como señal",
      "Sigue siendo igual de fuerte",
      "Indica un giro de mercado anticipado",
      "Es la entrada más segura del día",
    ],
    correct_option_index: 0,
    explanation:
      "Un Hammer en el aire no vale nada. El mismo patrón en un soporte validado, con volumen y estructura alcista, sí tiene peso operativo real. El contexto es lo que da fuerza.",
  },
]

const module3: ExamQuestionRaw[] = [
  {
    id: "kt-m3-q1",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Cuál es el origen histórico de los contratos de futuros?",
    options: [
      "Cobertura de productores agrícolas (Chicago, 1848) que querían fijar precio futuro",
      "La especulación de Wall Street en los 80",
      "Las criptomonedas del 2009",
      "El mercado de divisas de la posguerra",
    ],
    correct_option_index: 0,
    explanation:
      "Los futuros nacieron en Chicago (1848) como instrumento de cobertura: productores agrícolas y compradores industriales fijaban precio para una entrega futura, eliminando incertidumbre. La especulación vino después.",
  },
  {
    id: "kt-m3-q2",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "Si operás futuros como trader retail, ¿qué pasa cuando se acerca la fecha de vencimiento del contrato?",
    options: [
      "Cerrás la posición antes del vencimiento o rotás al contrato del próximo trimestre",
      "Recibís físicamente el activo (barriles, soja, etc.)",
      "El broker te cobra una multa por cierre forzoso",
      "Tu posición queda congelada hasta el próximo trimestre",
    ],
    correct_option_index: 0,
    explanation:
      "El 99% de los futuros se cierran antes del vencimiento. Como trader retail nunca llegás al vencimiento: cerrás la posición o rotás al siguiente contrato (rolling).",
  },
  {
    id: "kt-m3-q3",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Cuánto vale 1 tick en el contrato MES (Micro E-mini S&P 500)?",
    options: ["USD 1.25", "USD 5", "USD 12.50", "USD 50"],
    correct_option_index: 0,
    explanation:
      "En MES, 1 tick equivale a 0.25 puntos = USD 1.25. En el ES (contrato regular), 1 tick = USD 12.50. El micro es exactamente 10x más chico que el mini.",
  },
  {
    id: "kt-m3-q4",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "Si el ES sube 10 ticks y tenés 1 contrato comprado, ¿cuánto ganaste?",
    options: ["USD 50", "USD 100", "USD 200", "USD 125"],
    correct_option_index: 3,
    explanation:
      "Ganancia = ticks × valor del tick × contratos = 10 × 12.50 × 1 = USD 125. Si fueran 3 contratos serían USD 375; si fuera MES en lugar de ES, serían USD 12.50 con 1 contrato.",
  },
  {
    id: "kt-m3-q5",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "En contratos de equity (ES, NQ, MES, MNQ), ¿a cuántos ticks equivale 1 punto?",
    options: ["1 tick", "4 ticks", "10 ticks", "100 ticks"],
    correct_option_index: 1,
    explanation:
      "En equity (ES, NQ, MES, MNQ), 1 punto = 4 ticks. En commodities como CL la estructura cambia: 1 punto = 100 ticks. Por eso CL pega tanto por punto.",
  },
  {
    id: "kt-m3-q6",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Qué es el margen inicial en futuros?",
    options: [
      "Un costo no recuperable que cobra el broker",
      "La garantía que el broker pide para abrir una posición; no es tu riesgo real",
      "Lo mismo que el spread",
      "La comisión por contrato",
    ],
    correct_option_index: 1,
    explanation:
      "El margen es la garantía que pide el broker para abrir. No es un costo ni tu riesgo: vuelve a tu cuenta al cerrar (ajustado por ganancia/pérdida). Tu riesgo real lo definís vos con el stop loss.",
  },
  {
    id: "kt-m3-q7",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Cuál es la fórmula correcta para calcular el tamaño de posición en futuros con la regla del 2%?",
    options: [
      "Cuenta dividido por cantidad de contratos",
      "(Stop en ticks × Valor del tick) × Apalancamiento",
      "(Capital × 2%) / (Stop en ticks × Valor del tick)",
      "Capital × Apalancamiento del broker",
    ],
    correct_option_index: 2,
    explanation:
      "Tamaño = (Capital × % de riesgo) / (Stop en ticks × Valor del tick). Ejemplo: cuenta USD 10.000, riesgo 2% (USD 200), stop 12 ticks en MES (USD 15/contrato): 200/15 = 13 contratos.",
  },
  {
    id: "kt-m3-q8",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "Si la fórmula te da 6.4 contratos como tamaño correcto, ¿qué hacés?",
    options: [
      "Subís a 7 contratos para no perder oportunidad",
      "Redondeás hacia abajo a 6 contratos para no exceder el 2%",
      "Lo dejás en 6.4 si la plataforma lo permite",
      "Esperás a tener una cuenta donde el cálculo dé entero",
    ],
    correct_option_index: 1,
    explanation:
      "Siempre redondear hacia abajo. Subir el tamaño excede tu límite del 2%; bajarlo nunca rompe la regla. En futuros no podés operar fracciones de contrato.",
  },
  {
    id: "kt-m3-q9",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Por qué se recomienda usar el sufijo `1!` en TradingView (ej. ES1!)?",
    options: [
      "Porque muestra histórico de 1 año",
      "Porque es la opción más barata",
      "Porque solo funciona en Paper Trading",
      "Porque carga el contrato continuo, siempre el más activo del momento (front month)",
    ],
    correct_option_index: 3,
    explanation:
      "El sufijo `1!` apunta al front month (el contrato más activo). Evita que quedes mirando un contrato con baja liquidez después de rotación del vencimiento.",
  },
  {
    id: "kt-m3-q10",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Qué se mantiene igual al pasar de operar futuros a operar Forex en términos de análisis técnico?",
    options: [
      "Las velas significan cosas distintas en cada mercado",
      "Los timeframes funcionan al revés en Forex",
      "El análisis técnico (velas, estructura, soportes, top-down) funciona idéntico en ambos",
      "Soportes y resistencias solo aplican en futuros",
    ],
    correct_option_index: 2,
    explanation:
      "El análisis técnico es universal: la herramienta se mantiene, cambia el instrumento. Lo que aprendiste del M2 aplica idéntico en futuros, Forex, acciones y cripto.",
  },
  {
    id: "kt-m3-q11",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Qué significa que Forex sea un mercado OTC?",
    options: [
      "Que es descentralizado: cada broker tiene su propia cotización, no hay bolsa central",
      "Que está cerrado para traders retail",
      "Que opera solo 8 horas al día",
      "Que está regulado por el CME",
    ],
    correct_option_index: 0,
    explanation:
      "OTC (Over The Counter) = descentralizado. No hay bolsa central como en futuros. Cada broker tiene su propio order book, así que el precio que ves puede diferir levemente entre brokers.",
  },
  {
    id: "kt-m3-q12",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "Cuando ves la cotización EUR/USD = 1.0850, ¿qué significa exactamente?",
    options: [
      "Que el euro vale 0.0850 dólares",
      "Que necesitás USD 1.0850 para comprar 1 EUR",
      "Que el dólar subió 10.85% en el día",
      "Que el par está sobrecomprado",
    ],
    correct_option_index: 1,
    explanation:
      "El precio del par te dice cuántas unidades de la divisa cotizada (USD) necesitás para comprar 1 unidad de la divisa base (EUR). Subir el par = euro se fortalece respecto al dólar.",
  },
  {
    id: "kt-m3-q13",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Qué tipo de par es EUR/USD?",
    options: [
      "Par menor (cross)",
      "Par exótico",
      "Par sintético",
      "Par mayor (major)",
    ],
    correct_option_index: 3,
    explanation:
      "EUR/USD es un par mayor: incluye al USD y es uno de los más operados del mundo. Liquidez extrema, spread bajo, movimientos más predecibles. Ideal para arrancar.",
  },
  {
    id: "kt-m3-q14",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Cuál es la mejor ventana operativa del día para un trader Forex en Argentina (UTC-3)?",
    options: [
      "Sesión asiática en madrugada argentina",
      "Cierre de NY a las 18:00 ARG",
      "Solapamiento Londres + Nueva York (09:00 a 13:00 ARG)",
      "Apertura de Sydney a las 20:00 ARG",
    ],
    correct_option_index: 2,
    explanation:
      "El solapamiento Londres + NY (08:00-12:00 ET = 09:00-13:00 ARG) concentra el mayor volumen del día Forex. Spreads más bajos, movimientos más limpios. Es la franja de mayor calidad técnica.",
  },
  {
    id: "kt-m3-q15",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "En el par EUR/USD, ¿qué es 1 pip?",
    options: [
      "El primer decimal del precio",
      "El movimiento de 1% del precio",
      "El tipo de cambio promedio del día",
      "El cuarto decimal del precio",
    ],
    correct_option_index: 3,
    explanation:
      "En la mayoría de pares el pip es el cuarto decimal. EUR/USD pasando de 1.0850 a 1.0851 es 1 pip. Excepción: pares con JPY usan el segundo decimal.",
  },
  {
    id: "kt-m3-q16",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Cuánto vale 1 pip operando 1 mini lote (10.000 unidades) en EUR/USD?",
    options: ["USD 0.10", "USD 1", "USD 10", "USD 100"],
    correct_option_index: 1,
    explanation:
      "1 pip por mini lote = USD 1. Por lote estándar (100.000 unidades) = USD 10. Por micro lote (1.000 unidades) = USD 0.10. La escala es 10x entre cada tipo.",
  },
  {
    id: "kt-m3-q17",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Cuál es el lote recomendado para arrancar en Forex con cuenta chica?",
    options: [
      "Lote estándar (100.000 unidades)",
      "Mini lote (10.000 unidades)",
      "Micro lote (1.000 unidades)",
      "Lote institucional reservado a bancos",
    ],
    correct_option_index: 2,
    explanation:
      "Los micro lotes (1 pip = USD 0.10) te permiten aprender con margen psicológico: un movimiento de 100 pips te genera USD 10. Se sube a mini lotes después de 100+ trades de experiencia.",
  },
  {
    id: "kt-m3-q18",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Cuál es el factor más importante que mueve el precio de una divisa en el largo plazo?",
    options: [
      "Las tasas de interés del banco central",
      "El sentimiento de Twitter",
      "Los rumores de analistas",
      "El volumen de operaciones del broker",
    ],
    correct_option_index: 0,
    explanation:
      "Las tasas de interés son el factor #1. Cuando un banco central sube tasas, su divisa se fortalece; cuando las baja, se debilita. El diferencial de tasas entre dos países es el motor de fondo del par.",
  },
  {
    id: "kt-m3-q19",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Por qué se recomienda no tener posición abierta durante un reporte económico de alto impacto (NFP, FOMC)?",
    options: [
      "Porque el broker cierra el mercado en esos minutos",
      "Porque las plataformas dejan de funcionar",
      "Porque la regulación lo prohíbe",
      "Porque los movimientos pueden ser de 50-200 pips en segundos y el slippage se dispara",
    ],
    correct_option_index: 3,
    explanation:
      "Los reportes de alto impacto generan movimientos de 50-200 pips en segundos. Una posición abierta puede pasar de ganancia chica a pérdida grande en un instante, con spread inflado y slippage negativo brutal.",
  },
  {
    id: "kt-m3-q20",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Qué tienen en común futuros y Forex respecto al análisis técnico?",
    options: [
      "Los timeframes se interpretan al revés",
      "Las velas significan cosas diferentes en cada mercado",
      "El análisis técnico (velas, estructura, soportes, top-down) funciona idéntico en ambos",
      "En Forex no se usan soportes ni resistencias",
    ],
    correct_option_index: 2,
    explanation:
      "La habilidad es la misma. Lo que cambia son las particularidades del instrumento (spread, sesiones, valor de la unidad), no las herramientas de análisis.",
  },
]

const module4: ExamQuestionRaw[] = [
  {
    id: "kt-m4-q1",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué es una Market Order?",
    options: [
      "Se ejecuta inmediatamente al mejor precio disponible: garantiza ejecución pero NO precio",
      "Solo ejecuta a un precio específico que vos definís",
      "Se activa solo cuando el precio llega a un nivel determinado",
      "Es la única orden gratuita del broker",
    ],
    correct_option_index: 0,
    explanation:
      "Market Order ejecuta al mejor precio disponible al instante. Garantiza que entrás o salís, pero no te garantiza el precio exacto que veías al apretar.",
  },
  {
    id: "kt-m4-q2",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Cuál es la diferencia clave entre Market Order y Limit Order?",
    options: [
      "Las dos garantizan ejecución y precio al mismo tiempo",
      "Limit Order solo se usa en futuros",
      "Market es más cara que Limit",
      "Market garantiza ejecución pero no precio; Limit garantiza precio pero no ejecución",
    ],
    correct_option_index: 3,
    explanation:
      "La ejecución garantizada (Market) tiene costo en precio. La seguridad de precio (Limit) tiene costo en ejecución. Elegís según tu prioridad en cada situación.",
  },
  {
    id: "kt-m4-q3",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Para qué sirve principalmente un Stop Loss?",
    options: [
      "Para entrar al mercado",
      "Para limitar la pérdida si el precio se mueve en tu contra",
      "Para ajustar el spread del broker",
      "Para multiplicar la ganancia",
    ],
    correct_option_index: 1,
    explanation:
      "El stop loss se activa al tocar tu nivel y se convierte en Market Order. Limita la pérdida; bajo baja liquidez puede ejecutarse peor de lo esperado, pero el principio es contener el riesgo.",
  },
  {
    id: "kt-m4-q4",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Cuál es la regla central del Risk per Trade según el módulo?",
    options: [
      "Nunca arriesgar más del 2% de la cuenta en una sola operación",
      "Arriesgar todo lo disponible en cada trade",
      "No usar stop loss en operaciones rentables",
      "Operar siempre el mismo monto fijo en dólares",
    ],
    correct_option_index: 0,
    explanation:
      "El 2% no es magia: es matemática de supervivencia. Permite sobrevivir rachas de 10 perdedores con drawdown manejable (~18%) y dejar margen psicológico para seguir operando.",
  },
  {
    id: "kt-m4-q5",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "Si arriesgás 2% por trade y tenés 10 perdedores seguidos, ¿qué drawdown aproximado tenés?",
    options: ["50%", "Cerca del 18%", "80%", "100%"],
    correct_option_index: 1,
    explanation:
      "Con 2% por trade, 10 perdedores seguidos te dejan ~18% de drawdown. Recuperable. Con 10% por trade el mismo escenario te lleva a 65% de drawdown, que pedagógicamente es game over.",
  },
  {
    id: "kt-m4-q6",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "Si tu cuenta sufre un drawdown del 50%, ¿qué retorno necesitás para recuperar lo perdido?",
    options: ["25%", "50%", "75%", "100%"],
    correct_option_index: 3,
    explanation:
      "Si perdés 50% (de 100 a 50), necesitás +100% sobre 50 para volver a 100. La asimetría entre pérdida y recuperación es brutal: por eso el 2% por trade es vital.",
  },
  {
    id: "kt-m4-q7",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué es el slippage negativo?",
    options: [
      "La diferencia entre el precio esperado y el precio realmente ejecutado, cuando ejecuta peor",
      "Una ganancia inesperada del broker",
      "El spread normal del broker",
      "Una comisión adicional por horario",
    ],
    correct_option_index: 0,
    explanation:
      "Slippage negativo: compraste más caro o vendiste más barato de lo que querías. Pasa con baja liquidez o volatilidad extrema. Regla: asumir 1-2 ticks de slippage en el cálculo de riesgo real.",
  },
  {
    id: "kt-m4-q8",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿En qué situación es más probable que aparezca slippage negativo?",
    options: [
      "Mercado tranquilo de mediodía",
      "Durante el solapamiento Londres-NY",
      "En la sesión asiática estable",
      "Reportes económicos importantes o momentos de baja liquidez",
    ],
    correct_option_index: 3,
    explanation:
      "A mayor volatilidad o menor liquidez, mayor el riesgo de slippage negativo. Los días de FOMC/NFP el slippage se multiplica. Tenelo en cuenta al planear entradas con Market Order.",
  },
  {
    id: "kt-m4-q9",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Cuál es el Risk:Reward mínimo recomendado para una estrategia rentable?",
    options: [
      "1:0.5",
      "2:1 (arriesgar más de lo que se busca ganar)",
      "1:1 (riesgo igual a ganancia objetivo)",
      "5:1",
    ],
    correct_option_index: 2,
    explanation:
      "R:R 1:1 es el piso. Con 50% de winrate rompés tablas. Si vas a R:R 2:1 (arriesgar más que la ganancia), necesitás 67% de winrate solo para empatar, lo cual es muy difícil de sostener.",
  },
  {
    id: "kt-m4-q10",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "Con Risk:Reward 2:1 (arriesgar 200 para ganar 100), ¿qué winrate necesitás solo para empatar?",
    options: ["25%", "50%", "67%", "33%"],
    correct_option_index: 2,
    explanation:
      "Por eso 2:1 se evita: matemáticamente exige acertar 67% de los trades solo para no perder plata. Es una asimetría que castiga incluso a traders consistentes.",
  },
  {
    id: "kt-m4-q11",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué es el breakeven management?",
    options: [
      "Cerrar el trade cuando ganaste el doble del riesgo",
      "Mover el stop a precio de entrada cuando ya ganaste lo equivalente a tu stop, dejando el trade en riesgo cero",
      "Cambiar la dirección del trade en medio de la operación",
      "Dejar el trade abierto sin objetivo definido",
    ],
    correct_option_index: 1,
    explanation:
      "Breakeven: una vez que el precio te dio una ganancia equivalente a tu stop, movés el stop al precio de entrada. A partir de ahí, el trade no puede generar pérdida.",
  },
  {
    id: "kt-m4-q12",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "Según el módulo, ¿cuál es la regla de oro del stop loss?",
    options: [
      "Moverlo si esperás que el precio se recupere",
      "Solo usarlo en cuentas grandes",
      "Es tu palabra de honor: si diste la orden para salir en X precio, salís en X precio sin debate",
      "Cancelarlo si querés evitar la pérdida",
    ],
    correct_option_index: 2,
    explanation:
      "El stop loss es inviolable. Moverlo esperando que el precio se recupere es uno de los errores más caros del trader retail. Sin disciplina del stop, no hay gestión de riesgo posible.",
  },
  {
    id: "kt-m4-q13",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Cuál de estos es uno de los errores más críticos en gestión de órdenes?",
    options: [
      "Usar Risk:Reward 1:2",
      "Llevar journal de cada trade",
      "Cerrar en el objetivo planeado",
      "Mover el stop loss porque \"esperás que el precio se recupere\"",
    ],
    correct_option_index: 3,
    explanation:
      "\"Moving the stop\" es el camino a la ruina: cambiás el stop porque emocionalmente esperás que el precio vuelva. Es la versión más cara del autoengaño en trading.",
  },
  {
    id: "kt-m4-q14",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué significa \"agregar perdedores\"?",
    options: [
      "Entrar de nuevo cuando ya estabas en rojo, esperando recuperar lo perdido",
      "Cerrar la posición cuando vas perdiendo",
      "Reducir el tamaño de la posición a la mitad",
      "Activar trailing stop después de una pérdida",
    ],
    correct_option_index: 0,
    explanation:
      "Agregar perdedores: doblás la apuesta cuando ya estás en rojo, esperando que el precio vuelva. Multiplica el riesgo, no la probabilidad. Es uno de los patrones que liquidan cuentas.",
  },
  {
    id: "kt-m4-q15",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué es una Prop Firm?",
    options: [
      "Un broker común con spreads más bajos",
      "Una empresa que da capital a traders que demuestran disciplina y comparte ganancias (típicamente 80/20 o 90/10)",
      "Un fondo de pensión para jubilados",
      "Un curso de trading avanzado",
    ],
    correct_option_index: 1,
    explanation:
      "Prop Firm: te da capital después de pasar un challenge demostrando disciplina. Las ganancias se reparten (vos 80-90%, ellos 10-20%). Es el puente entre Paper Trading y capital propio.",
  },
  {
    id: "kt-m4-q16",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Cuál es el camino natural de progresión que propone el módulo?",
    options: [
      "Capital propio directo sin pasar por Paper Trading",
      "Solo Paper Trading toda la vida",
      "Kickstart → Trading Lab → Prop Firm → capital propio",
      "Empezar con cuenta real grande desde el día uno",
    ],
    correct_option_index: 2,
    explanation:
      "El camino: Kickstart (aprender), Trading Lab (refinar y simular presión real), Prop Firm (capital ajeno con reglas), capital propio (libertad total con riesgo total).",
  },
  {
    id: "kt-m4-q17",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Cuál es el hábito que el módulo plantea como el que \"separa al amateur del profesional\"?",
    options: [
      "Llevar un journal del trader registrando cada trade con plan, ejecución y emoción",
      "Operar más horas por día siguiendo el chart",
      "Tener más capital en la cuenta",
      "Usar más indicadores técnicos",
    ],
    correct_option_index: 0,
    explanation:
      "Sin journal no hay mejora medible. Lo que se registra se puede optimizar; lo que solo queda en la cabeza se distorsiona. Es la herramienta que separa al que mejora año tras año del que repite errores.",
  },
  {
    id: "kt-m4-q18",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Cuál es la estructura recomendada del journal en cuanto a momentos del día?",
    options: [
      "Solo cuando hay ganancia",
      "Solo registrar pérdidas",
      "Solo escribir al final del mes",
      "Pre-sesión, durante la sesión y post-sesión",
    ],
    correct_option_index: 3,
    explanation:
      "Pre-sesión: planeás activo, horario, objetivo. Durante: ejecutás y registrás sensaciones. Post: anotás qué hiciste bien, qué repetiste mal, qué corregir. Tres minutos antes, tres minutos después.",
  },
  {
    id: "kt-m4-q19",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Cuál es el objetivo de registrar emociones en el journal?",
    options: [
      "Para impresionar a otros traders",
      "Identificar patrones emocionales que preceden a las pérdidas y corregirlos",
      "Solo cumplir el formato establecido",
      "Sustituir la terapia psicológica",
    ],
    correct_option_index: 1,
    explanation:
      "Registrar emociones permite ver qué estados mentales preceden a tus peores trades. Esa información no la podés deducir sin registro; vivís el patrón pero no lo ves hasta que lo escribís.",
  },
  {
    id: "kt-m4-q20",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "Según el módulo, ¿cómo debe usarse el journal?",
    options: [
      "Como castigo cuando perdés un trade",
      "Como herramienta de juicio severo sobre vos mismo",
      "Como espejo para entenderte, no para juzgarte",
      "Como entrega obligatoria para el broker",
    ],
    correct_option_index: 2,
    explanation:
      "Si usás el journal como castigo, lo abandonás. Si lo usás como espejo, te transforma. Es la diferencia entre el trader que aprende y el que solo opera sin reflexionar.",
  },
]

// Los 4 módulos de Kickstart Trading completos.
export const kickstartTradingQuestions: Record<number, ExamQuestionRaw[]> = {
  1: module1,
  2: module2,
  3: module3,
  4: module4,
}
