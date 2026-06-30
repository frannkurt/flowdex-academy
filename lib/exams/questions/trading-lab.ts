// Preguntas del examen de Trading Lab, organizadas por módulo.
//
// Server-only: se importa desde lib/exams/server.ts y la API
// /api/exams/submit. Nunca desde un componente "use client".

import type { ExamQuestionRaw } from "@/lib/exams/types"

const COURSE_SLUG = "trading-lab"

const module1: ExamQuestionRaw[] = [
  {
    id: "tl-m1-q1",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué significa la frase \"el precio sube buscando vendedores\"?",
    options: [
      "Significa que el precio sube cuando baja el volumen",
      "Significa que los bancos centrales están comprando masivamente",
      "Que los compradores agresivos consumen toda la oferta disponible y obligan a los vendedores a levantar el precio",
      "Que el precio sube por azar",
    ],
    correct_option_index: 2,
    explanation:
      "El precio sube porque los compradores agresivos aceptan pagar el ask actual y agotan la oferta. Para encontrar más oferta, los vendedores tienen que subir el precio. Es mecánica literal del libro de órdenes.",
  },
  {
    id: "tl-m1-q2",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿En qué se diferencia el modo balance (relax) del modo carrera (imbalance)?",
    options: [
      "En balance el precio rebota en un rango sin definir; en carrera se mueve fuerte en una dirección con convicción institucional",
      "Balance solo aparece de noche y carrera durante el día",
      "Balance es bajista y carrera es alcista",
      "No hay diferencia operativa entre ambos",
    ],
    correct_option_index: 0,
    explanation:
      "Confundir el modo cuesta caro: vas a operar reversión cuando había que ir con la tendencia, o al revés. Identificarlo en los primeros minutos del día es media batalla ganada.",
  },
  {
    id: "tl-m1-q3",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué hace un comprador agresivo?",
    options: [
      "Coloca una orden de compra en el bid y espera",
      "Acepta el ask inmediatamente para tener la posición ya",
      "Solo compra cuando hay noticias",
      "Acepta el bid para ahorrar spread",
    ],
    correct_option_index: 1,
    explanation:
      "El comprador agresivo paga el ask para entrar sin esperar. Consume la liquidez disponible del lado vendedor. Por eso una vela alcista con cuerpo grande es la huella visible de muchos compradores agresivos seguidos.",
  },
  {
    id: "tl-m1-q4",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "Según el módulo, ¿qué rol cumple típicamente el trader retail en el mercado?",
    options: [
      "Marca la tendencia principal del día",
      "Decide los movimientos de mediano plazo",
      "Domina la sesión de USA por su volumen agregado",
      "Pone los stops en los lugares más obvios del chart, que son la \"nafta\" que el mercado va a buscar",
    ],
    correct_option_index: 3,
    explanation:
      "Los stops retail en zonas obvias son liquidez para el dinero grande. El objetivo del curso es dejar de ser el que provee esa nafta y empezar a ser el que la usa.",
  },
  {
    id: "tl-m1-q5",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué es un Fair Value Gap (FVG)?",
    options: [
      "Una vela bajista con mecha larga",
      "Un indicador técnico de medias móviles",
      "Un hueco de precio que deja el mercado al moverse demasiado rápido, identificado en tres velas (la del medio es el impulso)",
      "Un nivel de Fibonacci automático",
    ],
    correct_option_index: 2,
    explanation:
      "Un FVG es ineficiencia del mercado: el impulso fue tan fuerte que pasó sin terminar la operativa en ese rango. La mecha de la vela 1 y la mecha de la vela 3 ni se tocan, dejando el hueco en el medio.",
  },
  {
    id: "tl-m1-q6",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué es el displacement en la formación de un FVG?",
    options: [
      "La vela 2 del medio, con cuerpo grande y poca mecha, que crea el hueco entre las velas 1 y 3",
      "La distancia entre dos máximos del chart",
      "El cambio de timeframe en el análisis",
      "La rotación entre largo y corto en un mismo trade",
    ],
    correct_option_index: 0,
    explanation:
      "Sin displacement (movimiento fuerte cuerpo grande, mecha mínima), el FVG es débil y se rellena rápido. Es la huella de muchos agresivos seguidos en una sola vela.",
  },
  {
    id: "tl-m1-q7",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué es la mitigación de un FVG?",
    options: [
      "Cuando el FVG se cancela por noticias",
      "Cuando el precio vuelve a visitar la zona del hueco, ofreciendo una segunda chance de entrada",
      "Cuando se borra automáticamente el FVG del gráfico",
      "Cuando otro FVG aparece encima del anterior",
    ],
    correct_option_index: 1,
    explanation:
      "La mitigación es la \"deuda\" que el mercado paga: vuelve al rango donde no terminó de ejecutar para completar la operativa pendiente. Esa vuelta es tu chance de entrar con el viento a favor.",
  },
  {
    id: "tl-m1-q8",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿A qué se le llama CE (Consequent Encroachment) en un FVG?",
    options: [
      "Al límite superior del hueco",
      "Al límite inferior del hueco",
      "Al punto medio del FVG (50%), donde se ejecuta la mayoría del dinero profesional",
      "A la última vela que cerró el FVG",
    ],
    correct_option_index: 2,
    explanation:
      "CE = 50% del hueco. Es el equilibrio perfecto entre probabilidad y potencial de ganancia, y es donde la mayoría de los setups profesionales de FVG se ejecutan.",
  },
  {
    id: "tl-m1-q9",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "Si el precio cubre el 100% del FVG sin rebotar, ¿qué pasa con la idea?",
    options: [
      "El FVG se duplica en fuerza",
      "El FVG cambia de dirección",
      "El FVG mantiene su validez para un siguiente intento",
      "El FVG muere: pierde validez como nivel y, si tenías posición, asumís la pérdida y seguís",
    ],
    correct_option_index: 3,
    explanation:
      "Cuando el precio cierra el hueco al 100%, ya no hay nada pendiente de ejecución institucional. El FVG deja de funcionar como nivel. Sin racionalizar, asumís la pérdida.",
  },
  {
    id: "tl-m1-q10",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Cuál de los siguientes es el FVG con mayor probabilidad según el módulo?",
    options: [
      "El FVG dentro de FVG por sí solo",
      "Cualquier FVG en cripto",
      "El FVG de reversión, cuando coincide con un barrido de liquidez previo y el sesgo del gráfico grande está alineado",
      "Un FVG ya visitado dos o tres veces",
    ],
    correct_option_index: 2,
    explanation:
      "FVG de reversión + barrido de liquidez previo + sesgo del gráfico grande alineado = la confluencia de tres factores que produce el setup de máxima probabilidad de toda la metodología.",
  },
  {
    id: "tl-m1-q11",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "Según el módulo, ¿por qué importa que el FVG esté virgen (sin visita previa) antes de operarlo?",
    options: [
      "Porque los FVG ya visitados se vuelven más rentables",
      "Porque los FVG solo se forman en mercado bajista",
      "No importa cuántas visitas tuvo previamente",
      "Porque cada visita le saca energía al FVG: uno ya visitado dos o tres veces tiene poca probabilidad de reacción",
    ],
    correct_option_index: 3,
    explanation:
      "El ideal es entrar en la primera visita al FVG, cuando todavía tiene toda su carga de órdenes institucionales sin ejecutar. Visitas previas drenan su poder de reacción.",
  },
  {
    id: "tl-m1-q12",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Dónde se coloca el stop loss al operar un FVG?",
    options: [
      "Afuera del FVG, nunca adentro",
      "Adentro del FVG, justo en el CE",
      "En el POC del día anterior",
      "No hace falta stop si el setup es fuerte",
    ],
    correct_option_index: 0,
    explanation:
      "El stop va siempre afuera del FVG. Si el precio cubre todo el hueco, tu idea estaba mal y asumís la pérdida. Stop adentro del FVG es ruido autoinflingido.",
  },
  {
    id: "tl-m1-q13",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué es el POC (Point of Control) en el Volume Profile?",
    options: [
      "El precio donde más se operó durante la sesión; funciona como imán para el precio",
      "El precio máximo del día",
      "El cierre semanal del activo",
      "El nivel donde menos volumen hubo",
    ],
    correct_option_index: 0,
    explanation:
      "El POC es el \"local más visitado del shopping\". Es el nivel donde compradores y vendedores estuvieron más en equilibrio, y el precio tiende a volver ahí.",
  },
  {
    id: "tl-m1-q14",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué porcentaje del volumen total de la sesión cubre el Value Area?",
    options: ["30%", "50%", "70%", "100%"],
    correct_option_index: 2,
    explanation:
      "El Value Area cubre el 70% del volumen total. Es la zona donde el mercado se sintió cómodo. Adentro estás en terreno equilibrado; afuera, en terreno de extensión.",
  },
  {
    id: "tl-m1-q15",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué diferencia hay entre un HVN y un LVN en el Volume Profile?",
    options: [
      "HVN es alta volatilidad y LVN baja volatilidad",
      "HVN es zona con mucho volumen donde el mercado se siente cómodo; LVN es zona con poco volumen que el precio atraviesa rápido",
      "HVN es para Forex y LVN para futuros",
      "HVN es solo alcista, LVN solo bajista",
    ],
    correct_option_index: 1,
    explanation:
      "HVN funciona como soporte/resistencia (el mercado se siente cómodo y vuelve). LVN funciona como autopista (el mercado se incomoda y la atraviesa rápido). Útil para calcular targets.",
  },
  {
    id: "tl-m1-q16",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué indica un perfil de día tipo P según el módulo?",
    options: [
      "Día tranquilo en rango",
      "Distribución bajista con cola arriba",
      "Doble distribución partida en dos mitades",
      "Acumulación alcista (cabeza ancha arriba y cola hacia abajo); señal alcista para el día siguiente",
    ],
    correct_option_index: 3,
    explanation:
      "Tipo P: el día empezó cayendo, los compradores grandes acumularon en el piso y el precio subió. El volumen quedó arriba = señal alcista para el siguiente día.",
  },
  {
    id: "tl-m1-q17",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué es el Initial Balance (IB)?",
    options: [
      "El rango de la primera hora de operativa, que sirve de brújula para el resto del día",
      "El balance de tu cuenta al inicio del día",
      "El POC de la semana anterior",
      "El stop loss inicial del trade",
    ],
    correct_option_index: 0,
    explanation:
      "Si el precio rompe el IB con volumen, el día tiende en esa dirección. Si no rompe, día lateral. El IB es la brújula que define el sesgo intradía.",
  },
  {
    id: "tl-m1-q18",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Qué es un Open Drive (OD) según la clasificación de Dalton?",
    options: [
      "Una apertura sin convicción que rota cerca del open",
      "Una apertura donde el precio sale disparado desde el open en una dirección y no vuelve, con convicción institucional",
      "Una apertura donde el precio prueba un lado, falla y gira al contrario",
      "Un día de doble distribución partido por una noticia",
    ],
    correct_option_index: 1,
    explanation:
      "Open Drive: la apertura más clara. Convicción institucional desde el primer minuto. Lo más probable es un día tendencial; ir contra OD suele costar caro.",
  },
  {
    id: "tl-m1-q19",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "¿Cuál es la diferencia entre el Volume Profile y el indicador de volumen estándar?",
    options: [
      "No hay diferencia, son sinónimos",
      "El Volume Profile dice a qué PRECIO se operó; el indicador estándar dice CUÁNTO se operó en cada vela de tiempo",
      "El Volume Profile solo sirve en cripto",
      "El indicador estándar es más confiable",
    ],
    correct_option_index: 1,
    explanation:
      "El indicador estándar te dice cuánto volumen hubo en cada vela (eje temporal). El Volume Profile te dice a qué PRECIO se operó ese volumen (eje precio). Cambia cómo leés el mercado.",
  },
  {
    id: "tl-m1-q20",
    course_slug: COURSE_SLUG,
    module_number: 1,
    question_text: "Según el módulo, ¿qué confluencia es la de mayor probabilidad de toda la metodología?",
    options: [
      "Dos medias móviles cruzándose en el chart",
      "Tres velas verdes seguidas en cualquier timeframe",
      "Que aparezca RSI sobrecomprado en daily",
      "FVG sin tocar + nivel del Volume Profile + barrido de liquidez previo, todo alineado con el sesgo del gráfico grande",
    ],
    correct_option_index: 3,
    explanation:
      "Esa triple confluencia es lo que más se acerca a un setup de alta probabilidad. La idea de fondo: nunca un solo factor; siempre tres o más diciendo lo mismo.",
  },
]

const module2: ExamQuestionRaw[] = [
  {
    id: "tl-m2-q1",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué es la liquidez en el contexto del mercado?",
    options: [
      "La plata que tenés en la cuenta del broker",
      "El volumen diario total operado",
      "La cantidad de órdenes pendientes (stops, limit orders, take profits) que hay a un precio determinado",
      "El apalancamiento que ofrece el broker",
    ],
    correct_option_index: 2,
    explanation:
      "Liquidez es órdenes pendientes esperando ejecución a un precio. Los stops de protección son el tipo más visible y por eso son los más buscados por el dinero grande para generar movimiento.",
  },
  {
    id: "tl-m2-q2",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué son los equal highs y equal lows?",
    options: [
      "Niveles tocados varias veces al mismo precio, donde se acumulan grandes cantidades de stops",
      "Niveles donde el precio nunca llega",
      "Indicadores técnicos basados en medias móviles",
      "Soportes y resistencias clásicos que siempre protegen al precio",
    ],
    correct_option_index: 0,
    explanation:
      "Cuantos más toques tiene un nivel sin romperse, más stops se acumulan arriba o abajo. Para el dinero grande, esos niveles son carteles luminosos de liquidez disponible.",
  },
  {
    id: "tl-m2-q3",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué es un sweep o barrido de liquidez?",
    options: [
      "Una ruptura definitiva del nivel",
      "Un cambio de timeframe del análisis",
      "Una operación cancelada por el broker",
      "El movimiento donde el precio rompe ligeramente un nivel, captura los stops acumulados y vuelve",
    ],
    correct_option_index: 3,
    explanation:
      "El sweep es la jugada más típica del mercado. El precio perfora apenas un nivel, captura los stops como combustible y se mueve en serio en la dirección opuesta.",
  },
  {
    id: "tl-m2-q4",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Cuál es la señal clave para identificar un barrido (y no una ruptura real)?",
    options: [
      "Que el precio simplemente rompa el nivel",
      "Que rompa el nivel y la vela cierre del lado contrario (mecha sobresaliendo, cuerpo dentro del rango previo)",
      "Que aparezca un Doji después",
      "Que el volumen sea bajo en la ruptura",
    ],
    correct_option_index: 1,
    explanation:
      "Si rompe y cierra afuera: ruptura real. Si rompe y vuelve (mecha sobresaliendo, cuerpo dentro del rango previo): fue un barrido y probablemente hay entrada en sentido contrario.",
  },
  {
    id: "tl-m2-q5",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué es BSL (Buy-Side Liquidity)?",
    options: [
      "Stops de los que están en posición corta (arriba del precio), visibles como equal highs y máximos previos",
      "Stops de los que están en posición larga",
      "El precio promedio del día",
      "El POC del Volume Profile",
    ],
    correct_option_index: 0,
    explanation:
      "BSL = liquidez arriba del precio. Los que vendieron corto tienen sus stops por encima del entry, esperando ser activados con una compra forzosa.",
  },
  {
    id: "tl-m2-q6",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué es SSL (Sell-Side Liquidity)?",
    options: [
      "Stops de los traders cortos arriba del precio",
      "El cierre semanal del activo",
      "Stops de los que están en posición larga (abajo del precio), visibles como equal lows y mínimos previos",
      "Una zona específica del Volume Profile",
    ],
    correct_option_index: 2,
    explanation:
      "SSL = liquidez debajo del precio. Los compradores largos tienen sus stops por debajo del entry; cuando el precio baja a buscarlos, se activan ventas forzosas que son combustible para el dinero grande.",
  },
  {
    id: "tl-m2-q7",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué es el inducement?",
    options: [
      "Un indicador automático de TradingView",
      "Una ruptura confirmada del precio",
      "Una sesión específica del día Forex",
      "Una trampa de liquidez falsa que crea el mercado antes del nivel real, para barrer los stops del falso y usar ese combustible para el movimiento verdadero",
    ],
    correct_option_index: 3,
    explanation:
      "Inducement es la \"trampa de la trampa\": el mercado crea un nivel falso para que pongas tu stop ahí, lo barre, y recién entonces busca el nivel verdadero. Doble combustible.",
  },
  {
    id: "tl-m2-q8",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Cómo te protegés del inducement según el módulo?",
    options: [
      "Marcando primero los niveles del semanal y diario, y operando zonas que coincidan con esos niveles grandes",
      "Operando solo en cripto",
      "Usando solo timeframes chicos (5m)",
      "Ignorando todos los stops",
    ],
    correct_option_index: 0,
    explanation:
      "El inducement vive en los timeframes chicos. Si tu nivel de entrada viene del gráfico grande (semanal o diario), es mucho más difícil que sea una trampa.",
  },
  {
    id: "tl-m2-q9",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué pregunta responde el Volume Profile dentro de la metodología?",
    options: [
      "¿DÓNDE está el valor? ¿Dónde se concentró la actividad?",
      "¿CUÁNDO entrar exactamente?",
      "¿POR QUÉ el mercado se va a mover hacia ese nivel?",
      "¿CUÁNTO arriesgar por trade?",
    ],
    correct_option_index: 0,
    explanation:
      "Volume Profile contesta DÓNDE: dónde se concentró la actividad y dónde el mercado va a buscar equilibrio. Es el mapa de valor.",
  },
  {
    id: "tl-m2-q10",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué pregunta responde el FVG dentro de la metodología?",
    options: [
      "¿DÓNDE está el valor del mercado?",
      "¿POR QUÉ el mercado se va a mover hacia ese nivel?",
      "¿CUÁNDO entrar exactamente, con qué stop y qué objetivo?",
      "¿CUÁNTO capital invertir en el trade?",
    ],
    correct_option_index: 2,
    explanation:
      "FVG contesta CUÁNDO: el nivel exacto de entrada, dónde va el stop y cuál es el objetivo. Es el timing operativo del setup.",
  },
  {
    id: "tl-m2-q11",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Cuál es el orden correcto del análisis multi-timeframe según el módulo?",
    options: [
      "De 5 minutos hacia arriba buscando justificación",
      "De lo grande a lo chico: semanal/mensual → diario → 4h/1h → 15m/5m",
      "Solo el gráfico diario",
      "Solo el 1 hora",
    ],
    correct_option_index: 1,
    explanation:
      "Top-down siempre. Semanal y mensual dan humor general; diario da sesgo del día; 4h/1h da la zona operativa; 15m/5m da el timing. Arrancar al revés es justificar ideas, no operar.",
  },
  {
    id: "tl-m2-q12",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "Si venís de Kickstart Trading y arrancás Trading Lab, ¿qué pasa con la gestión del riesgo?",
    options: [
      "Pasás a arriesgar más por trade porque ya tenés método probado",
      "Sacás todos los stops porque ya leés mejor el mercado",
      "La base se mantiene (2% por trade); en Trading Lab se SUMAN capas de protección (topes diarios, semanales, mensuales, R/R mínimo más estricto y pausas obligatorias tras rachas)",
      "Bajás el riesgo por trade a la mitad porque sos más avanzado",
    ],
    correct_option_index: 2,
    explanation:
      "La base del 2% por trade se mantiene. Avanzar pedagógicamente no es bajar el riesgo por trade, es sumar capas alrededor: topes diarios/semanales/mensuales, R/R 1:2 mínimo, pausas obligatorias.",
  },
  {
    id: "tl-m2-q13",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Cuál es el tope diario de pérdida recomendado en Trading Lab para capital propio?",
    options: [
      "10%",
      "1%",
      "Máximo 4% (equivalente a 2 trades perdedores netos); si llegás, cerrás la plataforma",
      "No hay tope si tu sistema es bueno",
    ],
    correct_option_index: 2,
    explanation:
      "Tope diario del 4% = 2 perdedores netos como máximo. Si llegás, cerrás. En prop firms las reglas las pone la firm (típicamente 5% daily max), pero para capital propio el tope autoimpuesto es 4%.",
  },
  {
    id: "tl-m2-q14",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Cuál es el Risk:Reward mínimo recomendado en Trading Lab?",
    options: [
      "1:1",
      "1:2 (no entrás trades donde la ganancia potencial sea menor al doble del riesgo)",
      "2:1 a favor del riesgo",
      "5:1 siempre, sin excepciones",
    ],
    correct_option_index: 1,
    explanation:
      "R/R 1:2 mínimo. Si la ganancia potencial es menor que el doble del riesgo, no hay trade. En setups muy claros exigite 1:3 o más.",
  },
  {
    id: "tl-m2-q15",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "Según el módulo, ¿qué hacés tras tres pérdidas seguidas en una sesión?",
    options: [
      "Duplicás el tamaño para recuperar",
      "Cambiás de estrategia inmediatamente",
      "Cerrás la cuenta del broker",
      "Pausa de una hora: cerrás el chart, tomás agua, salís a caminar y reevaluás",
    ],
    correct_option_index: 3,
    explanation:
      "Tres perdedores seguidos = señal fisiológica de algo no anda. Pausa obligatoria de una hora. Después reevaluás si el mercado cambió de modo o si vos estás operando mal.",
  },
  {
    id: "tl-m2-q16",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué es el ChoCH (Change of Character)?",
    options: [
      "Una vela específica japonesa",
      "Un indicador automático de TradingView",
      "Un quiebre en contra de la tendencia previa, señal de posible reversión",
      "El cierre semanal del activo",
    ],
    correct_option_index: 2,
    explanation:
      "ChoCH (Change of Character) es un quiebre estructural en contra de la tendencia anterior. Es la primera señal técnica de que algo está cambiando, antes de que la nueva tendencia se confirme.",
  },
  {
    id: "tl-m2-q17",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué es el VWAP?",
    options: [
      "El stop loss promedio del mercado",
      "El precio promedio ponderado por volumen del día; los fondos lo usan como referencia de ejecución",
      "Un tipo de orden Limit",
      "Una sesión específica de Forex",
    ],
    correct_option_index: 1,
    explanation:
      "VWAP = Volume Weighted Average Price. Los fondos lo usan como benchmark de ejecución. Si el precio está por encima del VWAP, sesgo alcista; por debajo, bajista.",
  },
  {
    id: "tl-m2-q18",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "¿Qué es la SMT (Smart Money Trap / Smart Money Divergence)?",
    options: [
      "Cuando dos activos correlacionados hacen máximos o mínimos distintos simultáneamente; señal de posible barrido falso",
      "Una orden automática del broker",
      "Un FVG pequeño dentro de uno grande",
      "El stop loss fijo del 2%",
    ],
    correct_option_index: 0,
    explanation:
      "SMT: cuando dos activos que deberían moverse juntos hacen máximos o mínimos distintos al mismo tiempo, es señal de que uno de los dos está siendo engañado. Pista de barrido falso.",
  },
  {
    id: "tl-m2-q19",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "Según el módulo, ¿qué tres preguntas tienen que estar respondidas antes de entrar a un trade?",
    options: [
      "\"Quién, qué, cuándo\"",
      "DÓNDE (Volume Profile), POR QUÉ (Liquidez) y CUÁNDO (FVG)",
      "Solo \"cuándo\"",
      "\"Compro o vendo, cuánto, a qué precio\"",
    ],
    correct_option_index: 1,
    explanation:
      "Las tres preguntas que separan operar con criterio de improvisar: DÓNDE está el valor (Volume Profile), POR QUÉ se va a mover (Liquidez), CUÁNDO entrar (FVG). Si falta una, no hay trade.",
  },
  {
    id: "tl-m2-q20",
    course_slug: COURSE_SLUG,
    module_number: 2,
    question_text: "Según el módulo, ¿por qué los traders profesionales NO aumentan el tamaño \"porque el setup está clarísimo\"?",
    options: [
      "Porque la plataforma lo prohíbe técnicamente",
      "Porque el broker cobra comisión extra en trades grandes",
      "Porque no se puede operar con apalancamiento sobre cierto monto",
      "Porque el edge estadístico se mantiene igual independientemente de cuánto te guste el trade: aumentar tamaño en un \"trade claro\" es lo que estalla cuentas",
    ],
    correct_option_index: 3,
    explanation:
      "El edge estadístico es el mismo en cada trade, sin importar cuán seguro te sientas. Las cuentas que estallan no estallan por mala estrategia: estallan por sizing descontrolado en un \"trade claro\" que salió mal.",
  },
]

const module3: ExamQuestionRaw[] = [
  {
    id: "tl-m3-q1",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "Según el módulo, ¿qué es lo único que controlás 100% en cada trade?",
    options: [
      "Cuánto arriesgás",
      "Si el trade gana o pierde",
      "Cómo se va a mover el mercado",
      "Las noticias que aparecen durante la sesión",
    ],
    correct_option_index: 0,
    explanation:
      "Lo único que controlás del 100% al 100% es cuánto arriesgás. El resto (resultado, dirección del mercado, noticias) está fuera de tu alcance. Por eso la gestión del riesgo es la única parte del juego que garantiza seguir vivo el año siguiente.",
  },
  {
    id: "tl-m3-q2",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "Con un R:R de 1:2, ¿qué winrate necesitás para no perder plata?",
    options: [
      "50%",
      "67%",
      "34% (con acertar 1 de cada 3 trades, no perdés)",
      "75%",
    ],
    correct_option_index: 2,
    explanation:
      "Con R:R 1:2, ganás el doble cuando acertás. Acertando 1 de cada 3 (34%) ya no perdés plata: la ganancia de 1 acierto compensa las 2 pérdidas. Esa es la magia del R:R asimétrico.",
  },
  {
    id: "tl-m3-q3",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "Con un R:R de 1:5, ¿qué winrate aproximado necesitás para seguir siendo rentable?",
    options: [
      "50%",
      "25%",
      "67%",
      "17% (con acertar 1 de cada 6 ya alcanza)",
    ],
    correct_option_index: 3,
    explanation:
      "Cuanto más asimétrico es tu R:R, menos trades necesitás acertar. R:R 1:5 te permite seguir ganando incluso acertando solo 17%. Por eso los profesionales buscan setups donde, cuando ganan, ganan mucho.",
  },
  {
    id: "tl-m3-q4",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Qué dice la \"asimetría del drawdown\"?",
    options: [
      "Que perder y ganar requieren el mismo porcentaje",
      "Que cuanto más caés, más cuesta volver: para recuperar una pérdida del 50% necesitás ganar 100%",
      "Que el drawdown solo cuenta en sesión USA",
      "Que perder 10% o 50% da lo mismo matemáticamente",
    ],
    correct_option_index: 1,
    explanation:
      "Para recuperar 10% necesitás 11%; para 20% necesitás 25%; para 50% necesitás 100%; para 70% necesitás 233%. La curva se vuelve exponencial. Cuidar el drawdown es cuidar la posibilidad de volver.",
  },
  {
    id: "tl-m3-q5",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Qué porcentaje de ganancia necesitás para recuperarte de un drawdown del 50%?",
    options: [
      "100% (duplicar la cuenta desde la mitad)",
      "50%",
      "25%",
      "200%",
    ],
    correct_option_index: 0,
    explanation:
      "Si caés a la mitad, necesitás duplicar para volver al punto inicial. No es 50% más: es 100%. Esa asimetría es lo que hace que el drawdown profundo sea tan peligroso para la psicología.",
  },
  {
    id: "tl-m3-q6",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Qué ajuste de \"sizing por volatilidad\" sugiere el módulo?",
    options: [
      "Operar siempre el mismo número de contratos sin mirar el contexto",
      "Multiplicar el sizing por el ATR del día",
      "Si el ATR de hoy es el doble de lo normal, tu stop tiene que ser más amplio y tu tamaño la mitad",
      "Operar más cuando hay menos volatilidad",
    ],
    correct_option_index: 2,
    explanation:
      "Mismo riesgo en plata, distinto tamaño en contratos. Si el día está más volátil, el stop tiene que ser más amplio para no ser barrido por ruido; eso obliga a reducir el tamaño para mantener el mismo riesgo.",
  },
  {
    id: "tl-m3-q7",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "Según el módulo, ¿cuáles son los tres ajustes que mejoran la fórmula base de sizing en Trading Lab?",
    options: [
      "Por horario operativo, por broker y por país de residencia",
      "Por R:R, por stop loss y por target",
      "Por tipo de cuenta, por timeframe usado y por activo operado",
      "Por volatilidad (ATR), por calidad del setup, y escalonado en la gestión",
    ],
    correct_option_index: 3,
    explanation:
      "Los tres ajustes que separan al amateur del profesional consistente: ajustar por volatilidad (ATR), por calidad del setup (A/B/C) y escalado adentro del trade (parciales + breakeven + runner).",
  },
  {
    id: "tl-m3-q8",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Qué es el \"sizing escalonado en la gestión\"?",
    options: [
      "Subir el tamaño cada vez que ganás trades consecutivos",
      "1/3 sale en el primer obstáculo, 1R llega a breakeven, el último tercio corre hasta el objetivo principal",
      "Reducir el tamaño cada vez que perdés un trade",
      "Operar con apalancamiento variable según el día",
    ],
    correct_option_index: 1,
    explanation:
      "Es la gestión adentro del trade: aseguro algo con el primer parcial, llevo a riesgo cero en 1R, dejo correr el runner. Transforma un edge promedio 1:2 en uno 1:3 sostenido en el tiempo.",
  },
  {
    id: "tl-m3-q9",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "Según el módulo, ¿dónde se coloca el stop loss correctamente?",
    options: [
      "En el punto exacto donde tu idea queda invalidada, ni más cerca ni más lejos",
      "Lo más lejos posible \"por las dudas\"",
      "En el último mínimo del día",
      "En el medio del FVG",
    ],
    correct_option_index: 0,
    explanation:
      "Si lo ponés muy lejos te baja el R:R y mata la rentabilidad. Si lo ponés muy cerca te saca por ruido. Punto exacto de invalidación: donde tu idea técnica deja de tener sentido.",
  },
  {
    id: "tl-m3-q10",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Cuál es el R:R mínimo del Checklist de gestión avanzada?",
    options: [
      "1:1",
      "2:1 a favor del riesgo",
      "1:2 (no entrás trades donde la ganancia potencial sea menor al doble del riesgo)",
      "5:1 obligatorio",
    ],
    correct_option_index: 2,
    explanation:
      "R:R mínimo 1:2. Si no llega calculando stop en invalidación y target en zona realista, no hay trade. En setups muy claros exigite 1:3 o más.",
  },
  {
    id: "tl-m3-q11",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Qué es una prop firm?",
    options: [
      "Un broker tradicional con menos comisiones",
      "Un curso de trading avanzado pago",
      "Un fondo de pensión para jubilados",
      "Una empresa que te presta su capital para operar y comparte las ganancias con vos",
    ],
    correct_option_index: 3,
    explanation:
      "Te dan capital tras pasar una evaluación; las ganancias se reparten (vos 80-90%, ellos 10-20%). Es la forma más accesible que existe hoy para operar con capital grande sin tenerlo.",
  },
  {
    id: "tl-m3-q12",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "En una evaluación típica de prop firm, ¿qué porcentaje de objetivo de ganancia se exige habitualmente?",
    options: [
      "30% al mes",
      "Entre 8% y 10%",
      "50% en una semana",
      "Sin objetivo de ganancia",
    ],
    correct_option_index: 1,
    explanation:
      "El objetivo estándar de la fase de evaluación es 8-10% en un período estipulado, sin romper las reglas de drawdown. Si llega rápido, mejor; pero apurarse es la forma más cara de no pasar nunca.",
  },
  {
    id: "tl-m3-q13",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Qué porcentaje de las ganancias suele cobrar el trader en una cuenta funded?",
    options: [
      "Entre el 80% y el 90%",
      "Entre 10% y 20%",
      "El 100% siempre",
      "Solo un fee fijo mensual",
    ],
    correct_option_index: 0,
    explanation:
      "La mayoría de las prop firms reparten 80/20 o 90/10 a favor del trader. La firm gana con su porcentaje sobre tus ganancias y con los fees de evaluación de quienes no pasan.",
  },
  {
    id: "tl-m3-q14",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Qué es el daily drawdown en una prop firm?",
    options: [
      "Un descuento que aplica la firm al pago mensual",
      "Un bonus por buena performance",
      "Un tope de pérdida que se reinicia cada día; si llegás, perdés el día (sin segunda chance hasta mañana)",
      "Un costo fijo por sesión operada",
    ],
    correct_option_index: 2,
    explanation:
      "Daily drawdown: tope diario que se resetea al día siguiente. Si lo tocás, perdiste el día (a veces toda la cuenta, dependiendo de la firm). Es independiente del total accumulated.",
  },
  {
    id: "tl-m3-q15",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Qué es el trailing drawdown?",
    options: [
      "Un tope diario reseteado cada noche",
      "Una comisión variable de la firm",
      "Una orden de Stop loss automática del broker",
      "Un tope que \"sigue\" tu pico de cuenta hacia arriba; si bajás cierto % desde ese pico, te sacan",
    ],
    correct_option_index: 3,
    explanation:
      "El trailing drawdown sube cuando tu cuenta sube. Una corrección normal después de un buen tramo puede eliminarte aunque no hayas perdido dinero respecto al inicio. Es el más traicionero de los tres.",
  },
  {
    id: "tl-m3-q16",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "Según el módulo, ¿cuál es el error más común al operar la evaluación de una prop firm?",
    options: [
      "Tener el calendario económico abierto",
      "Operarla como si fuera tu cuenta real, sin entender que la lógica es distinta",
      "Llevar journal del proceso",
      "Estudiar las reglas antes de pagar el fee",
    ],
    correct_option_index: 1,
    explanation:
      "La cuenta real la hacés crecer en años; la evaluación la pasás en semanas sin romper reglas. Son lógicas distintas. Operar la evaluación con la mentalidad de cuenta real es el camino directo al fallo.",
  },
  {
    id: "tl-m3-q17",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "Según el módulo, ¿cómo conviene operar el sizing durante los primeros días de evaluación?",
    options: [
      "Operás la mitad del tamaño habitual mientras acumulás un colchón pequeño",
      "Operás al doble para adelantar el objetivo",
      "No operás esos días",
      "Igual que en cuenta real, sin ajustes",
    ],
    correct_option_index: 0,
    explanation:
      "Los primeros 3-5 días no conocés cómo responde la cuenta y no tenés colchón. Operar la mitad del tamaño habitual te permite acumular margen sin exponerte a un mal arranque que te complique todo.",
  },
  {
    id: "tl-m3-q18",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "¿Qué hacés con tu tope diario autoimpuesto si la firm te permite perder 3% en un día?",
    options: [
      "Te ponés el mismo 3% que la firm",
      "Te ponés 5% para tener más aire",
      "Te ponés 1,5% (más conservador que el de la firm) para tener margen ante un día difícil",
      "No te ponés tope autoimpuesto",
    ],
    correct_option_index: 2,
    explanation:
      "El tope autoimpuesto siempre tiene que ser más bajo que el de la firm. Ese margen es lo que te da aire para un día difícil sin acercarte al límite real que te liquida la cuenta.",
  },
  {
    id: "tl-m3-q19",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "Después de pasar la evaluación, ¿cómo conviene operar la cuenta funded la primera semana?",
    options: [
      "Aumentar el tamaño porque ya estás funded",
      "Operar el doble de horas",
      "Igual que durante la evaluación, sin cambios",
      "Reducir tamaño al 50% del habitual hasta entender el comportamiento de la cuenta (sobre todo si tiene trailing drawdown)",
    ],
    correct_option_index: 3,
    explanation:
      "Cuenta funded se mantiene operando MÁS conservador que durante la evaluación, no menos. Reducir tamaño la primera semana protege del trailing drawdown y de la euforia post-aprobación.",
  },
  {
    id: "tl-m3-q20",
    course_slug: COURSE_SLUG,
    module_number: 3,
    question_text: "Según el módulo, ¿cuál es uno de los errores más típicos que hacen perder la cuenta funded?",
    options: [
      "Llevar journal de cada trade ejecutado",
      "Aumentar el tamaño después de un día bueno, esperando capitalizar la racha",
      "Leer las reglas de la firm antes de operar",
      "Tomarse días libres cuando no aparecen setups premium",
    ],
    correct_option_index: 1,
    explanation:
      "Aumentar tamaño post-buen-día es trampa clásica: el siguiente día llega una corrección y perdés lo que ganaste más el colchón acumulado. El tamaño es función del capital, no de cómo te fue ayer.",
  },
]

const module4: ExamQuestionRaw[] = [
  {
    id: "tl-m4-q1",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Por qué el módulo 4 es considerado el más importante del curso?",
    options: [
      "Porque enseña técnicas nuevas que no se ven en ningún otro módulo, lo que permite operar con ventaja sobre el resto de los traders.",
      "Porque la gestión emocional y la disciplina son lo que determina si realmente ejecutás el plan bajo presión; la técnica sola no alcanza si la cabeza no acompaña.",
      "Porque es el último módulo y sirve como repaso general de todo lo aprendido, sin aportar herramientas nuevas.",
      "Porque se presentan herramientas adicionales que pueden usarse solo en situaciones excepcionales, pero no son centrales para el día a día.",
    ],
    correct_option_index: 1,
    explanation: "La técnica te lleva al setup, pero la cabeza te lleva a ejecutarlo. La gestión emocional es el verdadero desafío.",
  },
  {
    id: "tl-m4-q2",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Cuál es la emoción que aparece después de una pérdida y puede llevarte a no entrar en un trade válido?",
    options: [
      "Codicia: después de perder, el trader busca recuperar lo perdido aumentando el tamaño de la posición, convencido de que la próxima será la buena.",
      "FOMO: tras una pérdida, el miedo a quedarse afuera de un movimiento fuerte lleva a entrar tarde y sin plan, solo por no perderse la oportunidad.",
      "Miedo: tras una pérdida, el trader duda de su criterio y evita ejecutar setups válidos, aunque cumplan todas las condiciones, por temor a volver a equivocarse.",
      "Frustración: la acumulación de pequeñas pérdidas genera enojo y lleva a operar por impulso, sin respetar el plan ni el análisis previo.",
    ],
    correct_option_index: 2,
    explanation: "El miedo surge tras una pérdida o ante un setup importante, y puede hacerte dudar de ejecutar el plan.",
  },
  {
    id: "tl-m4-q3",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué emoción suele aparecer tras una racha ganadora y puede llevarte a aumentar el tamaño de tus posiciones?",
    options: [
      "FOMO: después de una serie de trades exitosos, el trader siente que no puede perderse el próximo movimiento y entra sin esperar el setup.",
      "Codicia: tras varias ganancias seguidas, el trader siente que está en racha y aumenta el tamaño de la posición, convencido de que va a seguir ganando.",
      "Frustración: el trader se enoja por no haber ganado más y busca compensar en el siguiente trade.",
      "Miedo: el trader duda de su capacidad y reduce el tamaño de la posición, aunque el setup sea válido.",
    ],
    correct_option_index: 1,
    explanation: "La codicia aparece después de ganar varias veces y puede llevarte a romper el plan.",
  },
  {
    id: "tl-m4-q4",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué emoción te impulsa a entrar tarde en el mercado, persiguiendo el precio?",
    options: [
      "Frustración: después de varios días sin oportunidades, el trader entra en cualquier setup solo por operar, sin esperar la señal correcta.",
      "Codicia: tras una ganancia, el trader busca repetir el resultado y entra sin esperar confirmación.",
      "FOMO: al ver un movimiento fuerte sin estar adentro, el trader entra tarde, sin setup, solo por miedo a quedarse afuera, generalmente justo antes del giro.",
      "Miedo: el trader evita entrar aunque el setup sea válido, por temor a perder de nuevo.",
    ],
    correct_option_index: 2,
    explanation: "El FOMO (Fear Of Missing Out) aparece cuando sentís que te estás perdiendo un movimiento.",
  },
  {
    id: "tl-m4-q5",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Cuál es la mejor técnica para gestionar una emoción en el trading según el módulo?",
    options: [
      "Ignorarla y operar igual, confiando en que la experiencia la va a eliminar con el tiempo.",
      "Nombrarla en voz alta, identificando exactamente qué emoción está presente antes de tomar una decisión, para desactivarla y recuperar el control.",
      "Operar igual pero con menor tamaño, para minimizar el impacto si sale mal.",
      "Cambiar de estrategia cada vez que aparece una emoción fuerte, buscando evitar el malestar.",
    ],
    correct_option_index: 1,
    explanation: "Nombrar la emoción en voz alta ayuda a desactivarla y tomar control.",
  },
  {
    id: "tl-m4-q6",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué es el revenge trading?",
    options: [
      "Operar con más análisis y esperar confirmaciones adicionales antes de entrar.",
      "Operar para recuperar una pérdida reciente, entrando de inmediato y sin setup claro, generalmente aumentando el tamaño para compensar.",
      "Operar solo cuando hay noticias importantes, para aprovechar la volatilidad.",
      "Operar con menos riesgo después de una pérdida, para evitar caer en el círculo vicioso.",
    ],
    correct_option_index: 1,
    explanation: "El revenge trading es entrar de nuevo para “recuperar” lo perdido, generalmente sin plan.",
  },
  {
    id: "tl-m4-q7",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué recomienda el módulo después de una pérdida?",
    options: [
      "Seguir operando inmediatamente, ya que la mejor forma de superar una mala racha es no perder el ritmo y buscar revancha en el siguiente trade.",
      "Aumentar el tamaño de la posición para recuperar lo perdido rápidamente, confiando en que la estadística se va a equilibrar a favor.",
      "Pausa mínima de 30 minutos, revisar el journal y analizar si la pérdida fue por error de sistema o de ejecución, antes de volver a operar.",
      "Cambiar de mercado o instrumento, buscando oportunidades en otro lado para evitar la frustración del trade perdido.",
    ],
    correct_option_index: 2,
    explanation: "Después de una pérdida, se recomienda pausar para evitar operar bajo emociones.",
  },
  {
    id: "tl-m4-q8",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué sesgo te hace operar setups de menor calidad tras una racha ganadora?",
    options: [
      "Recency bias: después de varios días tendenciales, el trader asume que el siguiente también lo será y baja la exigencia de sus setups.",
      "Overconfidence: tras una serie de trades ganadores, el trader se siente invencible y empieza a operar setups B y C, convencido de que todo va a salir bien.",
      "Anclaje: el trader se queda fijado en un precio anterior y busca operar alrededor de ese nivel, aunque el contexto haya cambiado.",
      "Sesgo de confirmación: el trader solo busca señales que confirmen su idea y descarta las que la contradicen, bajando la calidad de sus entradas.",
    ],
    correct_option_index: 1,
    explanation: "El exceso de confianza (overconfidence) te hace creer que podés ganar siempre.",
  },
  {
    id: "tl-m4-q9",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué es el recency bias?",
    options: [
      "Darle demasiado peso a lo que pasó recientemente, creyendo que el mercado va a repetir el mismo comportamiento solo porque ocurrió en las últimas sesiones.",
      "Operar solo en tendencias, ignorando los días laterales.",
      "Ignorar el plan y operar por intuición, sin revisar el contexto general.",
      "Operar solo en rangos, evitando los días de alta volatilidad.",
    ],
    correct_option_index: 0,
    explanation: "El recency bias es el sesgo de pensar que lo que pasó en las últimas sesiones se va a repetir.",
  },
  {
    id: "tl-m4-q10",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Cómo se combate el sesgo de confirmación?",
    options: [
      "Operando más, para acumular experiencia y confiar en la intuición.",
      "Escribiendo el plan antes de operar, definiendo el sesgo y los niveles clave fuera de pantalla, para evitar que la emoción influya en la lectura del mercado.",
      "Cambiando de estrategia durante la sesión si el mercado no confirma la idea inicial.",
      "No usando checklist, para mantener la flexibilidad ante cambios de contexto.",
    ],
    correct_option_index: 1,
    explanation: "El plan se escribe antes de operar para evitar que el sesgo de confirmación influya en la lectura del mercado.",
  },
  {
    id: "tl-m4-q11",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué es el anclaje en trading?",
    options: [
      "Quedarse atado a un precio visto antes, creyendo que el mercado debe volver ahí aunque el contexto haya cambiado y el nivel ya no sea relevante.",
      "Operar solo en apertura, evitando el resto de la sesión.",
      "No usar stop loss, confiando en que el mercado va a volver siempre a tu favor.",
      "Operar solo en demo para evitar el estrés de la cuenta real.",
    ],
    correct_option_index: 0,
    explanation: "El anclaje es quedarse fijado en un precio, aunque el mercado ya no lo respete.",
  },
  {
    id: "tl-m4-q12",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Cuál es la función principal de la rutina pre-mercado?",
    options: [
      "Elegir el instrumento a operar según el humor del día, sin un criterio fijo.",
      "Liberar energía mental para operar mejor, automatizando los pasos previos y dejando la cabeza libre para ejecutar el plan con disciplina.",
      "Buscar noticias de último momento para ajustar el plan sobre la marcha.",
      "Operar más rápido, entrando en el mercado apenas abre sin preparación previa.",
    ],
    correct_option_index: 1,
    explanation: "La rutina libera energía mental y prepara al trader para ejecutar el plan.",
  },
  {
    id: "tl-m4-q13",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué incluye la rutina post-mercado?",
    options: [
      "Operar en otro mercado para compensar si el día fue malo.",
      "Anotar los trades y emociones en el journal, marcando el mejor y el peor trade, y cerrando la plataforma para desconectar de verdad.",
      "Buscar nuevos setups para el día siguiente, sin analizar los errores del día actual.",
      "Operar en demo para practicar sin presión después de la sesión real.",
    ],
    correct_option_index: 1,
    explanation: "Registrar los trades y emociones ayuda a aprender de la sesión.",
  },
  {
    id: "tl-m4-q14",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué debe hacer un trader profesional después de tres pérdidas seguidas?",
    options: [
      "Seguir operando, confiando en que la racha se va a revertir si insiste lo suficiente.",
      "Aumentar el tamaño de la posición para recuperar lo perdido en el siguiente trade.",
      "Cerrar la plataforma y descansar, aceptando que el día no es el ideal y que seguir operando solo aumenta el riesgo de caer en el círculo vicioso de pérdidas.",
      "Cambiar de instrumento para buscar oportunidades en otro mercado y evitar la frustración.",
    ],
    correct_option_index: 2,
    explanation: "El profesional sabe cuándo parar para evitar el círculo vicioso de pérdidas.",
  },
  {
    id: "tl-m4-q15",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué diferencia la mentalidad retail de la profesional?",
    options: [
      "El profesional busca ganar todos los días, mientras que el retail acepta perder cuando el mercado no da oportunidades.",
      "El retail opera por emoción, reaccionando a cada movimiento del mercado; el profesional sigue el sistema y acepta que no operar también es operar.",
      "El retail nunca pierde porque siempre opera en demo; el profesional asume riesgos calculados.",
      "El profesional no usa plan, confiando en la experiencia acumulada.",
    ],
    correct_option_index: 1,
    explanation: "El profesional sigue el sistema y acepta que no operar también es operar.",
  },
  {
    id: "tl-m4-q16",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Cuál es el círculo vicioso del revenge trading?",
    options: [
      "Ganancia → confianza → más ganancia, lo que lleva a operar setups de menor calidad.",
      "Pérdida → frustración → trade impulsivo → más pérdida, entrando en un ciclo donde cada error alimenta el siguiente.",
      "Operar menos → menos errores, lo que lleva a perder oportunidades importantes.",
      "Operar en demo → operar en real, sin transición ni aprendizaje de los errores.",
    ],
    correct_option_index: 1,
    explanation: "El círculo vicioso es perder, frustrarse, operar impulsivamente y perder más.",
  },
  {
    id: "tl-m4-q17",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué herramienta ayuda a identificar patrones emocionales en el trading?",
    options: [
      "El journal del trader, donde se registran no solo los resultados sino también las emociones y errores de cada sesión, permitiendo detectar patrones y mejorar la gestión emocional.",
      "El calendario económico, para anticipar eventos de alta volatilidad.",
      "El volumen profile, para identificar zonas de interés institucional.",
      "El indicador de tendencia, para definir el sesgo del día.",
    ],
    correct_option_index: 0,
    explanation: "El journal permite registrar emociones y errores para mejorar.",
  },
  {
    id: "tl-m4-q18",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Por qué la rutina es importante en el trading?",
    options: [
      "Porque ahorra tiempo y permite operar más cantidad de trades en menos horas.",
      "Porque evita decisiones impulsivas, automatizando los pasos previos y posteriores a la operativa para reducir el margen de error emocional.",
      "Porque permite operar más, aumentando la exposición al mercado y las oportunidades de ganancia.",
      "Porque ayuda a ganar siempre, independientemente del contexto del mercado.",
    ],
    correct_option_index: 1,
    explanation: "La rutina estructura el día y reduce el margen de error emocional.",
  },
  {
    id: "tl-m4-q19",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Qué actitud muestra la mentalidad profesional ante un día perdedor?",
    options: [
      "Se obsesiona con recuperar lo perdido, operando más y aumentando el riesgo para equilibrar la balanza rápidamente.",
      "Apaga la plataforma y reflexiona sobre lo ocurrido, aceptando el resultado y buscando aprender para mejorar en la próxima sesión.",
      "Cambia de estrategia constantemente, buscando una fórmula mágica que evite las pérdidas.",
      "Opera en demo para recuperar la confianza antes de volver a la cuenta real.",
    ],
    correct_option_index: 1,
    explanation: "El profesional acepta el día y aprende de él, no busca recuperar impulsivamente.",
  },
  {
    id: "tl-m4-q20",
    course_slug: COURSE_SLUG,
    module_number: 4,
    question_text: "¿Cuál es el cambio clave que ocurre cuando alguien pasa de “operador” a “trader”?",
    options: [
      "Aprende una nueva técnica que le permite ganar en cualquier contexto de mercado, sin importar las condiciones externas.",
      "Cambia su identidad y mentalidad: deja de verse como alguien que prueba suerte y empieza a operar con disciplina, registro y enfoque profesional, alineando todas sus acciones con el objetivo de largo plazo.",
      "Opera más instrumentos para diversificar y aumentar las oportunidades de ganancia.",
      "Deja de usar journal porque ya no lo necesita, confiando solo en la experiencia acumulada.",
    ],
    correct_option_index: 1,
    explanation: "El cambio de identidad es lo que alinea todas las acciones y resultados.",
  },
]

export const tradingLabQuestions: Record<number, ExamQuestionRaw[]> = {
  1: module1,
  2: module2,
  3: module3,
  4: module4,
}
