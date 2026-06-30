import type { ExamQuestionRaw } from "@/lib/exams/types";

// Preguntas de examen para Inner Circle Inversiones
// Formato: Array de ExamQuestionRaw[] por módulo

export const innerCircleInversionesQuestions: Record<number, ExamQuestionRaw[]> = {
  1: [
    {
      id: "ici-m1-q1",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Cuál es el objetivo principal del Sistema FPM?",
      options: [
        "Evitar toda pérdida en el mercado.",
        "Proveer un protocolo repetible para construir y gestionar portafolios profesionales.",
        "Maximizar el retorno en el corto plazo.",
        "Operar solo acciones tecnológicas."
      ],
      correct_option_index: 1,
      explanation: "El FPM es un proceso sistemático para la gestión profesional de portafolios."
    },
    {
      id: "ici-m1-q2",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Por qué la diferencia entre comprar acciones y construir un portafolio se nota en mercados bajistas?",
      options: [
        "Porque solo importa el análisis técnico.",
        "Porque el portafolio siempre gana.",
        "Porque sin sistema, las decisiones las toma el miedo y no una regla escrita.",
        "Porque en mercados alcistas todos ganan igual."
      ],
      correct_option_index: 2,
      explanation: "El sistema protege de decisiones emocionales en caídas de mercado."
    },
    {
      id: "ici-m1-q3",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Qué asegura el FPM respecto a las pérdidas?",
      options: [
        "Que nunca existan pérdidas.",
        "Que siempre se gane en el largo plazo.",
        "Que el portafolio sea inmune a caídas.",
        "Que no sean por improvisación, sino por riesgo controlado."
      ],
      correct_option_index: 3,
      explanation: "El FPM no garantiza ganancias, pero sí elimina la improvisación como causa de pérdida."
    },
    {
      id: "ici-m1-q4",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Qué muestra la investigación de Dalbar sobre el inversor minorista?",
      options: [
        "Que rinde sistemáticamente por debajo de los índices por mala gestión emocional del timing.",
        "Que siempre supera al mercado.",
        "Que elige mal los activos.",
        "Que opera solo en mercados alcistas."
      ],
      correct_option_index: 0,
      explanation: "El inversor promedio pierde por mal timing emocional, no por mala selección de activos."
    },
    {
      id: "ici-m1-q5",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Cuál es el principio central del FPM?",
      options: [
        "Operar solo en mercados alcistas.",
        "Un sistema no garantiza ganancia, pero sí que las pérdidas no sean por improvisación.",
        "Garantizar siempre ganancias.",
        "Evitar toda exposición al riesgo."
      ],
      correct_option_index: 1,
      explanation: "El sistema protege de la improvisación, no de la pérdida inherente al riesgo."
    },
    {
      id: "ici-m1-q6",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Qué diferencia a la virtud ética de la intelectual según Aristóteles?",
      options: [
        "La intelectual se forma por repetición.",
        "No hay diferencia relevante.",
        "La ética se forma repitiendo, la intelectual razonando.",
        "La ética se aprende en libros."
      ],
      correct_option_index: 2,
      explanation: "La inversión profesional es una virtud ética: se forma por repetición disciplinada."
    },
    {
      id: "ici-m1-q7",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Por qué el inversor consistente no depende de inteligencia superior?",
      options: [
        "Porque tiene mejor información.",
        "Porque opera solo en mercados alcistas.",
        "Porque improvisa mejor.",
        "Porque sostiene su consistencia por haber repetido el mismo protocolo cientos de veces."
      ],
      correct_option_index: 3,
      explanation: "La consistencia viene de la repetición disciplinada del sistema, no de la inteligencia."
    },
    {
      id: "ici-m1-q8",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Qué busca neutralizar el sistema FPM?",
      options: [
        "El gap entre el retorno del activo y el del inversor causado por mala gestión emocional.",
        "La volatilidad del mercado.",
        "El riesgo de default.",
        "El impacto de los impuestos."
      ],
      correct_option_index: 0,
      explanation: "El FPM existe para neutralizar el gap de rendimiento por mala gestión emocional."
    },
    {
      id: "ici-m1-q9",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Qué representa la cita de Quirón en el módulo?",
      options: [
        "Que solo importa la teoría.",
        "La sabiduría del sistema viene de la experiencia y el error, no solo del libro.",
        "Que el sistema es infalible.",
        "Que la intuición es suficiente."
      ],
      correct_option_index: 1,
      explanation: "La experiencia y el error son la base de la sabiduría del sistema."
    },
    {
      id: "ici-m1-q10",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Por qué el FPM es un protocolo y no una receta?",
      options: [
        "Porque solo sirve para acciones.",
        "Porque evita toda exposición al riesgo.",
        "Porque es un proceso de fases que se ejecuta siempre en el mismo orden, adaptándose a cada situación.",
        "Porque garantiza siempre el mismo resultado."
      ],
      correct_option_index: 2,
      explanation: "El FPM es un proceso adaptable, no una receta rígida."
    },
    {
      id: "ici-m1-q11",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Qué problema común tiene el inversor sin sistema según el módulo?",
      options: [
        "Opera solo una acción.",
        "Siempre gana en el largo plazo.",
        "Evita toda exposición al riesgo.",
        "Opera muchas ideas al mismo tiempo sin filtro, generando confusión y resultados aleatorios."
      ],
      correct_option_index: 3,
      explanation: "La falta de filtro y sistema lleva a confusión y resultados aleatorios."
    },
    {
      id: "ici-m1-q12",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Qué asegura la repetición disciplinada del FPM?",
      options: [
        "Que las decisiones correctas se vuelvan reflejo y no dependan del estado de ánimo.",
        "Que nunca existan pérdidas.",
        "Que siempre se gane en el corto plazo.",
        "Que el portafolio sea inmune a caídas."
      ],
      correct_option_index: 0,
      explanation: "La repetición disciplinada convierte las buenas decisiones en reflejo."
    },
    {
      id: "ici-m1-q13",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Por qué el FPM no depende del estado de ánimo del inversor?",
      options: [
        "Porque evita toda exposición al riesgo.",
        "Porque las reglas se escriben en frío, antes de que el mercado presione emocionalmente.",
        "Porque el sistema es infalible.",
        "Porque solo importa la intuición."
      ],
      correct_option_index: 1,
      explanation: "Las reglas del FPM se definen antes, no bajo presión emocional."
    },
    {
      id: "ici-m1-q14",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Qué rol cumple la fase de simulación en el FPM?",
      options: [
        "Evita toda exposición al riesgo.",
        "Solo sirve para acciones tecnológicas.",
        "Permite anticipar escenarios y validar la robustez del portafolio antes de invertir real.",
        "Garantiza siempre ganancias."
      ],
      correct_option_index: 2,
      explanation: "La simulación es clave para validar el sistema antes de ejecutarlo con dinero real."
    },
    {
      id: "ici-m1-q15",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Por qué es importante la gestión emocional en el FPM?",
      options: [
        "Porque la emoción siempre ayuda.",
        "Porque solo importa el análisis técnico.",
        "Porque el portafolio siempre gana.",
        "Porque el mayor riesgo es tomar decisiones impulsivas en momentos de estrés de mercado."
      ],
      correct_option_index: 3,
      explanation: "La gestión emocional es clave para evitar errores de timing y decisiones impulsivas."
    },
    {
      id: "ici-m1-q16",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Qué enseña la experiencia de Quirón según el módulo?",
      options: [
        "Que la sabiduría del sistema viene de la cicatriz, no solo del libro.",
        "Que el sistema es infalible.",
        "Que la intuición es suficiente.",
        "Que solo importa la teoría."
      ],
      correct_option_index: 0,
      explanation: "La experiencia y el error son la base de la sabiduría del sistema."
    },
    {
      id: "ici-m1-q17",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Por qué el FPM es útil en mercados bajistas?",
      options: [
        "Porque el portafolio siempre gana.",
        "Porque permite tomar decisiones racionales y no emocionales bajo presión.",
        "Porque garantiza siempre ganancias.",
        "Porque solo importa el análisis técnico."
      ],
      correct_option_index: 1,
      explanation: "El sistema protege de decisiones emocionales en caídas de mercado."
    },
    {
      id: "ici-m1-q18",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Qué diferencia a un portafolio gestionado con FPM de uno improvisado?",
      options: [
        "No hay diferencia relevante.",
        "El FPM solo sirve para acciones tecnológicas.",
        "El gestionado con FPM sigue un proceso claro y repetible, el improvisado depende del ánimo y la intuición.",
        "El improvisado siempre gana más."
      ],
      correct_option_index: 2,
      explanation: "El FPM aporta proceso y repetibilidad, el improvisado depende de la emoción."
    },
    {
      id: "ici-m1-q19",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Qué asegura la fase de gestión en el FPM?",
      options: [
        "Que nunca existan pérdidas.",
        "Que siempre se gane en el corto plazo.",
        "Que el portafolio sea inmune a caídas.",
        "Que el portafolio se ajuste a cambios de contexto sin perder la disciplina del sistema."
      ],
      correct_option_index: 3,
      explanation: "La gestión permite adaptar el portafolio sin perder la disciplina del sistema."
    },
    {
      id: "ici-m1-q20",
      course_slug: "inner-circle-inversiones",
      module_number: 1,
      question_text: "¿Cuál es la función principal del módulo 1 de Inner Circle Inversiones?",
      options: [
        "Dominar el Sistema FPM y su aplicación profesional para construir y gestionar portafolios.",
        "Aprender a operar solo con indicadores automáticos.",
        "Evitar toda exposición al riesgo.",
        "Buscar patrones de velas japonesas exclusivamente."
      ],
      correct_option_index: 0,
      explanation: "El módulo 1 busca que el alumno domine el FPM y su aplicación profesional."
    }
  ],
  2: [
    {
      id: "ici-m2-q1",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Cuántas fases componen el Sistema FPM?",
      options: [
        "Seis.",
        "Cinco.",
        "Tres.",
        "Cuatro."
      ],
      correct_option_index: 1,
      explanation: "El FPM está compuesto por cinco fases secuenciales."
    },
    {
      id: "ici-m2-q2",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Cuál es la primera fase del FPM?",
      options: [
        "Construcción.",
        "Simulación.",
        "Diagnóstico.",
        "Universo."
      ],
      correct_option_index: 2,
      explanation: "La primera fase es el Diagnóstico: definir quién sos como inversor."
    },
    {
      id: "ici-m2-q3",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Qué pregunta responde la fase de Diagnóstico?",
      options: [
        "¿Qué activos pueden formar parte?",
        "¿Cómo se distribuye el capital?",
        "¿Cuándo y cómo se modifica el portafolio?",
        "¿Qué clase de inversor sos hoy?"
      ],
      correct_option_index: 3,
      explanation: "El Diagnóstico define tu perfil real como inversor."
    },
    {
      id: "ici-m2-q4",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Cuál es el output de la fase de Diagnóstico?",
      options: [
        "Mandato escrito.",
        "Lista de activos.",
        "Portafolio en cuatro capas.",
        "Reglas de rebalanceo."
      ],
      correct_option_index: 0,
      explanation: "El Diagnóstico produce un mandato escrito que guía todas las decisiones futuras."
    },
    {
      id: "ici-m2-q5",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Qué información debe contener el mandato escrito?",
      options: [
        "Solo el objetivo dominante.",
        "Capital base, horizonte mínimo, drawdown máximo tolerable, objetivo dominante y tres restricciones operativas.",
        "Solo el capital base y el horizonte.",
        "Lista de activos y brokers."
      ],
      correct_option_index: 1,
      explanation: "El mandato debe incluir todos esos elementos para ser completo y útil."
    },
    {
      id: "ici-m2-q6",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Por qué es importante definir el horizonte mínimo en el mandato?",
      options: [
        "Porque reduce los impuestos.",
        "Porque permite operar con menos capital.",
        "Porque cuanto más largo el horizonte, más capacidad de sostener un drawdown sin vender en pánico.",
        "Porque determina el tipo de broker."
      ],
      correct_option_index: 2,
      explanation: "El horizonte largo ayuda a resistir la volatilidad y evitar ventas impulsivas."
    },
    {
      id: "ici-m2-q7",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Qué es el drawdown máximo tolerable?",
      options: [
        "El máximo capital invertido.",
        "El retorno esperado anual.",
        "La cantidad de activos en cartera.",
        "La caída transitoria que podés soportar sin vender."
      ],
      correct_option_index: 3,
      explanation: "El drawdown tolerable es clave para definir tu perfil de riesgo real."
    },
    {
      id: "ici-m2-q8",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Qué sucede si una decisión futura contradice el mandato escrito?",
      options: [
        "No se toma la decisión sin reescribir el mandato primero.",
        "Se ignora el mandato.",
        "Se consulta al mercado.",
        "Se ajusta el portafolio automáticamente."
      ],
      correct_option_index: 0,
      explanation: "El mandato solo se modifica en frío, no para justificar decisiones impulsivas."
    },
    {
      id: "ici-m2-q9",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Cuál es el objetivo dominante en el mandato?",
      options: [
        "Solo dividendos.",
        "Preservación, crecimiento, dividendos o mix (uno solo).",
        "Tener dos objetivos principales.",
        "Solo crecimiento."
      ],
      correct_option_index: 1,
      explanation: "El mandato debe tener un solo objetivo dominante para evitar contradicciones."
    },
    {
      id: "ici-m2-q10",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Qué representan las restricciones operativas en el mandato?",
      options: [
        "Solo la jurisdicción.",
        "No son relevantes.",
        "Jurisdicción, broker, costos, impuestos, etc.",
        "Solo el broker."
      ],
      correct_option_index: 2,
      explanation: "Las restricciones operativas afectan la ejecución real del portafolio."
    },
    {
      id: "ici-m2-q11",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Por qué el capital con vencimiento corto no debe incluirse en el capital base?",
      options: [
        "Porque genera más retorno.",
        "Porque reduce el drawdown.",
        "Porque aumenta la diversificación.",
        "Porque no es capital de inversión, sino ahorro con disfraz."
      ],
      correct_option_index: 3,
      explanation: "El capital que se necesita pronto no debe arriesgarse en inversiones."
    },
    {
      id: "ici-m2-q12",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Qué debe hacer un inversor si su tolerancia real a drawdown es menor al 20%?",
      options: [
        "Ajustar el mandato antes de empezar, no después.",
        "Ignorar la tolerancia y operar igual.",
        "Aumentar el horizonte.",
        "Reducir el capital base."
      ],
      correct_option_index: 0,
      explanation: "La tolerancia debe ser realista y ajustada antes de invertir."
    },
    {
      id: "ici-m2-q13",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Por qué tener dos objetivos dominantes es problemático?",
      options: [
        "Porque simplifica la gestión.",
        "Porque las decisiones diarias se vuelven contradictorias y el portafolio pierde convicción.",
        "Porque aumenta el retorno.",
        "Porque reduce el riesgo."
      ],
      correct_option_index: 1,
      explanation: "Un solo objetivo dominante da claridad y coherencia al portafolio."
    },
    {
      id: "ici-m2-q14",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Qué debe hacer el inversor con el mandato escrito?",
      options: [
        "Compartirlo en redes sociales.",
        "Ignorarlo después de la primera inversión.",
        "Guardarlo en un lugar físico o digital y releerlo antes de tomar decisiones importantes.",
        "Tirarlo después de escribirlo."
      ],
      correct_option_index: 2,
      explanation: "El mandato es la referencia constante para todas las decisiones futuras."
    },
    {
      id: "ici-m2-q15",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Cuándo debe modificarse el mandato?",
      options: [
        "Cada vez que el mercado cambia.",
        "Cuando surge una oportunidad de inversión.",
        "Nunca debe modificarse.",
        "Solo en frío, durante revisiones periódicas, no para justificar un trade puntual."
      ],
      correct_option_index: 3,
      explanation: "El mandato se revisa periódicamente, no por impulsos emocionales."
    },
    {
      id: "ici-m2-q16",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Qué función cumple el mandato en la gestión del portafolio?",
      options: [
        "Es el documento clave contra el cual se contrasta cada decisión futura.",
        "Sirve solo como referencia teórica.",
        "No tiene función relevante.",
        "Solo define el broker a usar."
      ],
      correct_option_index: 0,
      explanation: "El mandato es la base de toda decisión de gestión."
    },
    {
      id: "ici-m2-q17",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Qué sucede si el impulso de modificar el mandato aparece para justificar un trade puntual?",
      options: [
        "No afecta el portafolio.",
        "Eso no es revisión, es racionalización emocional disfrazada.",
        "Es una revisión válida.",
        "Debe modificarse igual."
      ],
      correct_option_index: 1,
      explanation: "Modificar el mandato por impulso es un error de gestión emocional."
    },
    {
      id: "ici-m2-q18",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Por qué el mandato no es un documento legal?",
      options: [
        "Porque no se firma ante escribano.",
        "Porque no lo exige la ley.",
        "Porque es una guía personal y operativa, no un contrato formal.",
        "Porque no tiene validez fiscal."
      ],
      correct_option_index: 2,
      explanation: "El mandato es una herramienta personal, no un contrato legal."
    },
    {
      id: "ici-m2-q19",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Qué debe hacer el inversor antes de comprar un solo activo según el FPM?",
      options: [
        "Elegir el broker.",
        "Seleccionar los activos.",
        "Definir el horizonte de inversión.",
        "Contestar quién es como inversor hoy, no quién quiere ser."
      ],
      correct_option_index: 3,
      explanation: "El autodiagnóstico es el primer paso antes de cualquier inversión."
    },
    {
      id: "ici-m2-q20",
      course_slug: "inner-circle-inversiones",
      module_number: 2,
      question_text: "¿Cuál es la función principal del módulo 2 de Inner Circle Inversiones?",
      options: [
        "Dominar el diagnóstico y la elaboración del mandato escrito para una gestión profesional.",
        "Aprender a operar con indicadores automáticos.",
        "Evitar toda exposición al riesgo.",
        "Buscar patrones de velas japonesas exclusivamente."
      ],
      correct_option_index: 0,
      explanation: "El módulo 2 busca que el alumno domine el diagnóstico y el mandato como base del FPM."
    }
  ],
  3: [
    {
      id: "ici-m3-q1",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Cuál es el objetivo de definir el 'universo elegible' antes de construir el portafolio?",
      options: [
        "Seleccionar activos por intuición.",
        "Obligar a definir criterios objetivos antes de elegir activos específicos.",
        "Reducir la cantidad de activos a cero.",
        "Evitar toda exposición al riesgo."
      ],
      correct_option_index: 1,
      explanation: "El universo elegible filtra activos con criterios objetivos antes de enamorarse de uno específico."
    },
    {
      id: "ici-m3-q2",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Cuáles son los tres filtros para que un activo entre al universo elegible?",
      options: [
        "Popularidad, precio y tendencia.",
        "Tamaño, país y sector.",
        "Categoría, liquidez y costo.",
        "Rentabilidad, moda y marketing."
      ],
      correct_option_index: 2,
      explanation: "Los tres filtros son: categoría, liquidez y costo."
    },
    {
      id: "ici-m3-q3",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Qué activos suelen quedar fuera del universo elegible?",
      options: [
        "ETFs diversificados.",
        "Bonos soberanos líquidos.",
        "Cash en moneda fuerte.",
        "Activos sin liquidez, con poco historial o recomendados en grupos de señales."
      ],
      correct_option_index: 3,
      explanation: "Quedan fuera los activos sin liquidez, poco historial o recomendados sin análisis."
    },
    {
      id: "ici-m3-q4",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Por qué se exige un mínimo de cinco años cotizando para acciones en el universo elegible?",
      options: [
        "Porque no han atravesado un ciclo económico completo y su supervivencia es menos probable.",
        "Porque son más rentables.",
        "Porque tienen menos comisiones.",
        "Porque son más populares."
      ],
      correct_option_index: 0,
      explanation: "Cinco años cotizando asegura experiencia en distintos ciclos económicos."
    },
    {
      id: "ici-m3-q5",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Por qué solo BTC y ETH pueden entrar al universo cripto del FPM?",
      options: [
        "Por recomendación de grupos.",
        "Por su liquidez y capitalización, y porque concentran la mayor parte del sector.",
        "Porque son las únicas que suben.",
        "Por su bajo costo de transacción."
      ],
      correct_option_index: 1,
      explanation: "BTC y ETH tienen liquidez y capitalización suficiente para el sistema."
    },
    {
      id: "ici-m3-q6",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Qué sucede si un activo no pasa alguno de los tres filtros del universo?",
      options: [
        "Se revisa cada semana.",
        "Se compra en pequeña cantidad.",
        "No entra al universo y, por lo tanto, no entra al portafolio.",
        "Se incluye igual si es popular."
      ],
      correct_option_index: 2,
      explanation: "Si falla un filtro, el activo queda fuera del universo y del portafolio."
    },
    {
      id: "ici-m3-q7",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Qué ventaja aporta reducir el universo implícito de 60 a 15-20 activos?",
      options: [
        "Reduce la rentabilidad.",
        "Aumenta la complejidad.",
        "Disminuye la diversificación.",
        "Aporta claridad operativa y permite conocer a fondo los candidatos."
      ],
      correct_option_index: 3,
      explanation: "Menos activos, mejor análisis y claridad operativa."
    },
    {
      id: "ici-m3-q8",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Cuál es el objetivo de la construcción por capas en el FPM?",
      options: [
        "Diversificar funciones y roles de los activos, no solo la cantidad.",
        "Tener la mayor cantidad de activos posible.",
        "Maximizar el peso de la capa asimétrica.",
        "Evitar la defensiva."
      ],
      correct_option_index: 0,
      explanation: "La diversificación real es por función, no solo por cantidad."
    },
    {
      id: "ici-m3-q9",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Cuántas capas tiene el portafolio FPM?",
      options: [
        "Dos: núcleo y satélite.",
        "Cuatro: núcleo, satélite, defensiva y asimétrica.",
        "Tres: núcleo, satélite y defensiva.",
        "Cinco: núcleo, satélite, defensiva, asimétrica y especulativa."
      ],
      correct_option_index: 1,
      explanation: "El FPM tiene cuatro capas bien definidas."
    },
    {
      id: "ici-m3-q10",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Cuál es el rango de peso recomendado para la capa núcleo?",
      options: [
        "0-10 % del portafolio.",
        "20-30 % del portafolio.",
        "55-65 % del portafolio.",
        "10-15 % del portafolio."
      ],
      correct_option_index: 2,
      explanation: "El núcleo debe ser la mayor parte del portafolio según estudios académicos."
    },
    {
      id: "ici-m3-q11",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Qué función cumple la capa satélite?",
      options: [
        "Aportar estabilidad.",
        "Reducir la volatilidad.",
        "Aportar liquidez.",
        "Capturar alfa por selección informada de acciones individuales."
      ],
      correct_option_index: 3,
      explanation: "La satélite busca superar el retorno del núcleo con análisis individual."
    },
    {
      id: "ici-m3-q12",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Por qué la capa defensiva es fundamental aunque no genere retorno?",
      options: [
        "Permite tener liquidez para comprar en caídas y reducir la volatilidad.",
        "Porque aumenta el riesgo.",
        "Porque maximiza el alfa.",
        "Porque es opcional."
      ],
      correct_option_index: 0,
      explanation: "La defensiva es la única capa que permite aprovechar caídas del mercado."
    },
    {
      id: "ici-m3-q13",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Qué caracteriza a la capa asimétrica?",
      options: [
        "No tiene límite de peso.",
        "Es opcional, busca oportunidades de upside desproporcionado y requiere madurez emocional.",
        "Es obligatoria y de bajo riesgo.",
        "Solo incluye cash."
      ],
      correct_option_index: 1,
      explanation: "La asimétrica es para oportunidades de alto potencial y requiere madurez."
    },
    {
      id: "ici-m3-q14",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Qué sucede si la capa defensiva es 0 %?",
      options: [
        "Reduce el riesgo.",
        "Mejora la diversificación.",
        "No es un portafolio, es una apuesta.",
        "Aumenta la rentabilidad."
      ],
      correct_option_index: 2,
      explanation: "Sin defensiva, el portafolio pierde su capacidad de resistir caídas."
    },
    {
      id: "ici-m3-q15",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Por qué no es recomendable un portafolio 100% núcleo para el alumno del FPM?",
      options: [
        "Maximiza la simplicidad.",
        "Reduce el riesgo a cero.",
        "Aumenta el retorno esperado.",
        "Desperdicia el aprendizaje de análisis individual, la capacidad de aprovechar caídas y la posibilidad de tesis de alta convicción."
      ],
      correct_option_index: 3,
      explanation: "El portafolio 100% núcleo no aprovecha las ventajas de las otras capas."
    },
    {
      id: "ici-m3-q16",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Qué función cumple la simulación previa en el FPM?",
      options: [
        "Detectar errores estructurales y medir la tolerancia real a la volatilidad antes de invertir capital real.",
        "Aumentar la rentabilidad.",
        "Reducir el número de activos.",
        "Evitar la diversificación."
      ],
      correct_option_index: 0,
      explanation: "La simulación permite ajustar el portafolio antes de arriesgar dinero real."
    },
    {
      id: "ici-m3-q17",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Qué porcentaje de alumnos descubre en simulación que su mandato declarado no es realista?",
      options: [
        "5%.",
        "Cerca del 40%.",
        "10%.",
        "70%."
      ],
      correct_option_index: 1,
      explanation: "El 40% ajusta su mandato tras la simulación."
    },
    {
      id: "ici-m3-q18",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Qué debe incluir la revisión semanal durante la simulación?",
      options: [
        "Revisión de noticias globales.",
        "Ajuste de comisiones.",
        "Análisis por capa, no por activo individual.",
        "Solo análisis de precios."
      ],
      correct_option_index: 2,
      explanation: "La revisión semanal se enfoca en el comportamiento de cada capa."
    },
    {
      id: "ici-m3-q19",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Qué función cumple el journal diario en la simulación?",
      options: [
        "Solo registrar precios.",
        "Aumentar la frecuencia de operaciones.",
        "Reducir la volatilidad.",
        "Registrar movimientos, noticias y reacciones emocionales para calibrar el mandato real."
      ],
      correct_option_index: 3,
      explanation: "El journal diario ayuda a ajustar el mandato a la realidad emocional."
    },
    {
      id: "ici-m3-q20",
      course_slug: "inner-circle-inversiones",
      module_number: 3,
      question_text: "¿Cuál es la función principal del módulo 3 de Inner Circle Inversiones?",
      options: [
        "Dominar la construcción por capas, la simulación y la gestión activa del portafolio.",
        "Aprender a operar con indicadores automáticos.",
        "Evitar toda exposición al riesgo.",
        "Buscar patrones de velas japonesas exclusivamente."
      ],
      correct_option_index: 0,
      explanation: "El módulo 3 busca que el alumno domine la construcción, simulación y gestión profesional."
    }
  ],
  4: [
    {
      id: "ici-m4-q1",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Por qué el portafolio FPM no se construye una vez y se deja?",
      options: [
        "Porque solo importa el rebalanceo.",
        "Porque debe gestionarse dinámicamente, ajustando lo que cambió y sosteniendo lo que sigue funcionando.",
        "Porque pierde valor automáticamente.",
        "Porque requiere cambios diarios."
      ],
      correct_option_index: 1,
      explanation: "El portafolio debe adaptarse a los cambios del mercado y del inversor."
    },
    {
      id: "ici-m4-q2",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Qué significa gestión dinámica en el FPM?",
      options: [
        "No intervenir nunca.",
        "Cambiar todo el portafolio cada mes.",
        "Operar mejor, en momentos definidos y con criterios escritos.",
        "Operar todos los días."
      ],
      correct_option_index: 2,
      explanation: "La gestión dinámica es operar poco, pero con propósito y reglas claras."
    },
    {
      id: "ici-m4-q3",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Cuáles son las tres operaciones clave de la gestión dinámica?",
      options: [
        "Comprar y mantener.",
        "Vender por miedo, comprar por FOMO y rebalancear.",
        "Solo rebalancear.",
        "Identificar zonas de compra, tomar ganancias y rebalancear."
      ],
      correct_option_index: 3,
      explanation: "Las tres operaciones clave son: comprar, tomar ganancias y rebalancear."
    },
    {
      id: "ici-m4-q4",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Qué debe hacerse con cualquier operación fuera del sistema (por miedo, FOMO, etc.)?",
      options: [
        "Anotarla en el log con luz roja.",
        "Ignorarla.",
        "Repetirla frecuentemente.",
        "Considerarla como gestión dinámica."
      ],
      correct_option_index: 0,
      explanation: "Las operaciones fuera del sistema deben registrarse como errores."
    },
    {
      id: "ici-m4-q5",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Por qué mirar el portafolio todos los días es un anti-patrón?",
      options: [
        "Porque permite detectar oportunidades.",
        "Porque aumenta la ansiedad y empeora el rendimiento.",
        "Porque mejora la gestión.",
        "Porque reduce la volatilidad."
      ],
      correct_option_index: 1,
      explanation: "Mirar el portafolio a diario activa el sistema emocional y lleva a malas decisiones."
    },
    {
      id: "ici-m4-q6",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Qué correlación muestran los estudios de behavioral finance sobre la frecuencia de chequeo del portafolio?",
      options: [
        "No hay correlación.",
        "Solo afecta a inversores novatos.",
        "A mayor frecuencia de chequeo, peor rendimiento.",
        "A mayor frecuencia, mejor rendimiento."
      ],
      correct_option_index: 2,
      explanation: "Mirar el portafolio frecuentemente empeora el rendimiento."
    },
    {
      id: "ici-m4-q7",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Cuál es la cadencia recomendada para la gestión FPM?",
      options: [
        "Diaria.",
        "Semanal.",
        "Trimestral.",
        "Mensual, no diaria."
      ],
      correct_option_index: 3,
      explanation: "La gestión FPM recomienda una revisión mensual."
    },
    {
      id: "ici-m4-q8",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Por qué la lentitud del FPM protege el capital?",
      options: [
        "Porque obliga a trabajar antes de operar y anticipa drawdowns.",
        "Porque evita toda pérdida.",
        "Porque permite operar más.",
        "Porque reduce la diversificación."
      ],
      correct_option_index: 0,
      explanation: "La lentitud permite anticipar y resistir drawdowns sin actuar impulsivamente."
    },
    {
      id: "ici-m4-q9",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Qué debe escribir el alumno antes de avanzar al Módulo 2?",
      options: [
        "Solo el calendario de gestión.",
        "Su mandato, universo elegible, portafolio en cuatro capas, plan de simulación y calendario de gestión.",
        "Solo el mandato.",
        "Solo el universo elegible."
      ],
      correct_option_index: 1,
      explanation: "El cierre del módulo exige documentar todo el proceso."
    },
    {
      id: "ici-m4-q10",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Por qué un portafolio vivo tiene más tiempo de no hacer nada que de hacer algo?",
      options: [
        "Porque el mercado no cambia.",
        "Porque la gestión pasiva es mejor.",
        "Porque lo aburrido es lo rentable en gestión dinámica.",
        "Porque así se evitan errores."
      ],
      correct_option_index: 2,
      explanation: "La gestión dinámica rentable implica pocas intervenciones bien planificadas."
    },
    {
      id: "ici-m4-q11",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Qué error cometen los inversores que operan mucho creyendo que operan bien?",
      options: [
        "Maximizan el retorno.",
        "Reducen el riesgo.",
        "Aumentan la diversificación.",
        "Obtienen el peor rendimiento por sobreoperar."
      ],
      correct_option_index: 3,
      explanation: "La sobreoperación lleva a peores resultados."
    },
    {
      id: "ici-m4-q12",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Qué error cometen los inversores que nunca operan creyendo que la pasividad es virtud?",
      options: [
        "También obtienen bajo rendimiento por inercia.",
        "Maximizan el retorno.",
        "Reducen el riesgo.",
        "Aumentan la diversificación."
      ],
      correct_option_index: 0,
      explanation: "La inercia total también lleva a bajo rendimiento."
    },
    {
      id: "ici-m4-q13",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Cuál es el rango recomendado de intervenciones anuales en gestión dinámica FPM?",
      options: [
        "Doce intervenciones por año.",
        "Cuatro a seis intervenciones por año.",
        "Cuarenta intervenciones por año.",
        "Una intervención por año."
      ],
      correct_option_index: 1,
      explanation: "El FPM recomienda pocas intervenciones, pero bien planificadas."
    },
    {
      id: "ici-m4-q14",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Qué significa rebalancear en el FPM?",
      options: [
        "Vender todo el portafolio.",
        "Aumentar la capa asimétrica.",
        "Devolver los pesos de las capas a sus rangos objetivo cuando salen de banda.",
        "Comprar más activos."
      ],
      correct_option_index: 2,
      explanation: "El rebalanceo es devolver los pesos a los rangos definidos, no por fechas sino por bandas."
    },
    {
      id: "ici-m4-q15",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Por qué el rebalanceo por bandas es preferible al rebalanceo por fechas?",
      options: [
        "Porque es más frecuente.",
        "Porque reduce la diversificación.",
        "Porque es más fácil de ejecutar.",
        "Porque capta automáticamente la lógica de vender lo que subió y comprar lo que bajó."
      ],
      correct_option_index: 3,
      explanation: "El rebalanceo por bandas responde a movimientos reales del portafolio."
    },
    {
      id: "ici-m4-q16",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Qué función cumple la revisión mensual en la gestión FPM?",
      options: [
        "Permite detectar cambios estructurales antes de que sean obvios y evitar la microgestión.",
        "Aumentar la frecuencia de operaciones.",
        "Reducir la volatilidad.",
        "Maximizar el alfa."
      ],
      correct_option_index: 0,
      explanation: "La revisión mensual es suficiente para ajustar el portafolio sin caer en microgestión."
    },
    {
      id: "ici-m4-q17",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Qué debe incluir el log de decisiones en la gestión FPM?",
      options: [
        "Solo la revisión trimestral.",
        "Fecha, monto, motivo, resultado esperado y revisión trimestral.",
        "Solo el monto y la fecha.",
        "Solo el motivo."
      ],
      correct_option_index: 1,
      explanation: "El log completo permite detectar patrones y errores de gestión."
    },
    {
      id: "ici-m4-q18",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Por qué la gestión FPM recomienda no mirar el portafolio diariamente?",
      options: [
        "Porque reduce la volatilidad.",
        "Porque mejora la diversificación.",
        "Porque cada chequeo activa el sistema emocional y aumenta la tentación de actuar impulsivamente.",
        "Porque así se gana más."
      ],
      correct_option_index: 2,
      explanation: "Mirar el portafolio a diario lleva a malas decisiones emocionales."
    },
    {
      id: "ici-m4-q19",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Qué diferencia a la gestión profesional de la amateur según el FPM?",
      options: [
        "El profesional opera más.",
        "El amateur nunca interviene.",
        "No hay diferencia relevante.",
        "El profesional ejecuta reglas predefinidas, el amateur reacciona a cada movimiento del mercado."
      ],
      correct_option_index: 3,
      explanation: "La gestión profesional es proactiva y basada en reglas, no reactiva."
    },
    {
      id: "ici-m4-q20",
      course_slug: "inner-circle-inversiones",
      module_number: 4,
      question_text: "¿Cuál es la función principal del módulo 4 de Inner Circle Inversiones?",
      options: [
        "Dominar la gestión dinámica, el rebalanceo y la toma de decisiones profesional.",
        "Aprender a operar con indicadores automáticos.",
        "Evitar toda exposición al riesgo.",
        "Buscar patrones de velas japonesas exclusivamente."
      ],
      correct_option_index: 0,
      explanation: "El módulo 4 busca que el alumno domine la gestión dinámica y profesional del portafolio."
    }
  ],
  5: [
    {
      id: "ici-m5-q1",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Cuál es la diferencia clave entre operar y gestionar en el contexto del FPM?",
      options: [
        "Operar es solo para profesionales.",
        "Operar es tomar decisiones nuevas cada vez; gestionar es aplicar reglas predefinidas cuando se cumplen condiciones.",
        "Operar y gestionar son lo mismo.",
        "Gestionar implica cambiar el portafolio todos los días."
      ],
      correct_option_index: 1,
      explanation: "La gestión profesional aplica reglas ya definidas, no improvisa en cada movimiento del mercado."
    },
    {
      id: "ici-m5-q2",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Qué es el rebalanceo por bandas en el FPM?",
      options: [
        "Vender todo cuando el mercado cae.",
        "Comprar solo cuando hay euforia.",
        "Rebalancear solo cuando una capa sale de su rango de tolerancia, no por fechas fijas.",
        "Rebalancear el portafolio cada semana."
      ],
      correct_option_index: 2,
      explanation: "El rebalanceo por bandas es una regla profesional que evita la microgestión y captura la lógica de vender lo que subió y comprar lo que bajó."
    },
    {
      id: "ici-m5-q3",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Cuál es la cadencia recomendada para la revisión completa del portafolio según el FPM?",
      options: [
        "Diaria.",
        "Semanal.",
        "Solo cuando hay crisis.",
        "Mensual."
      ],
      correct_option_index: 3,
      explanation: "La revisión mensual permite detectar cambios estructurales sin caer en la ansiedad de la microgestión."
    },
    {
      id: "ici-m5-q4",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Qué función cumple el log de decisiones en la gestión activa?",
      options: [
        "Registrar cada compra, venta o cambio de tesis con fecha, monto y motivo.",
        "Solo sirve para principiantes.",
        "No tiene utilidad real.",
        "Aumenta la cantidad de trades diarios."
      ],
      correct_option_index: 0,
      explanation: "El log permite auditar patrones y mejorar la toma de decisiones a largo plazo."
    },
    {
      id: "ici-m5-q5",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Por qué mirar el portafolio todos los días es un anti-patrón según el FPM?",
      options: [
        "Mejora la gestión.",
        "Aumenta la ansiedad y lleva a malas decisiones.",
        "Permite detectar oportunidades únicas.",
        "Reduce la volatilidad."
      ],
      correct_option_index: 1,
      explanation: "Mirar el portafolio a diario activa el sistema emocional y empeora el rendimiento."
    },
    {
      id: "ici-m5-q6",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Qué acción recomienda el FPM cuando una capa del portafolio sale de su banda de tolerancia?",
      options: [
        "Vender todo el portafolio.",
        "No hacer nada.",
        "Rebalancear hasta volver al objetivo.",
        "Esperar a la próxima revisión anual."
      ],
      correct_option_index: 2,
      explanation: "El rebalanceo por bandas se ejecuta solo cuando una capa sale de rango, no por calendario."
    },
    {
      id: "ici-m5-q7",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Qué frecuencia recomienda el FPM para la auditoría completa del portafolio?",
      options: [
        "Diaria.",
        "Semanal.",
        "Solo cuando hay crisis.",
        "Anual."
      ],
      correct_option_index: 3,
      explanation: "La auditoría anual permite revisar el mandato, el log y ajustar bandas si corresponde."
    },
    {
      id: "ici-m5-q8",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Qué actitud debe tomar el inversor ante la tentación de intervenir fuera de las revisiones programadas?",
      options: [
        "Respetar la cadencia y registrar cualquier intervención fuera de sistema en el log.",
        "Intervenir siempre que haya una noticia.",
        "Cambiar el portafolio cada semana.",
        "No registrar nada."
      ],
      correct_option_index: 0,
      explanation: "La disciplina en la cadencia es clave para evitar la microgestión y el sesgo emocional."
    },
    {
      id: "ici-m5-q9",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Qué función cumple la revisión trimestral en el FPM?",
      options: [
        "No tiene utilidad real.",
        "Relectura del mandato, evaluación del log y ajuste de bandas si corresponde.",
        "Rebalancear todo el portafolio.",
        "Vender todas las posiciones."
      ],
      correct_option_index: 1,
      explanation: "La revisión trimestral permite ajustar el sistema sin caer en la ansiedad de la microgestión."
    },
    {
      id: "ici-m5-q10",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Por qué el FPM recomienda bloquear fechas de revisión en la agenda real?",
      options: [
        "Para aumentar la cantidad de trades.",
        "No tiene impacto real.",
        "Porque si no está en la agenda, no existe y no se cumple.",
        "Para operar más seguido."
      ],
      correct_option_index: 2,
      explanation: "La gestión profesional requiere disciplina en la revisión y seguimiento del sistema."
    },
    {
      id: "ici-m5-q11",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Qué actitud debe tomar el inversor si una revisión mensual detecta que una tesis ya no se sostiene?",
      options: [
        "Esperar a ver si mejora.",
        "Aumentar la posición.",
        "No hacer nada.",
        "Vender la posición según la regla del cambio de tesis."
      ],
      correct_option_index: 3,
      explanation: "El sistema exige vender cuando la tesis original ya no se sostiene."
    },
    {
      id: "ici-m5-q12",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Qué función cumple la revisión semanal en el FPM?",
      options: [
        "Chequeo rápido de bandas y noticias relevantes, sin microgestión.",
        "Rebalancear todo el portafolio.",
        "Vender todas las posiciones.",
        "No tiene utilidad real."
      ],
      correct_option_index: 0,
      explanation: "La revisión semanal es breve y solo busca detectar desvíos importantes."
    },
    {
      id: "ici-m5-q13",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Qué actitud debe tomar el inversor si una capa defensiva cae a 0 %?",
      options: [
        "Vender todo el núcleo.",
        "Rebalancear y reponer defensiva, ya que sin ella el portafolio es una apuesta.",
        "No hacer nada.",
        "Aumentar la exposición a satélite."
      ],
      correct_option_index: 1,
      explanation: "La defensiva es esencial para la robustez del portafolio."
    },
    {
      id: "ici-m5-q14",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Qué función cumple el ejercicio de cierre del módulo 5?",
      options: [
        "Aumentar la cantidad de trades.",
        "No tiene utilidad real.",
        "Registrar en una página el mandato, universo, portafolio, plan de simulación y calendario de gestión.",
        "Operar todos los días."
      ],
      correct_option_index: 2,
      explanation: "El ejercicio de cierre integra todo el sistema FPM en un solo documento operativo."
    },
    {
      id: "ici-m5-q15",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Cuál es el objetivo final de la gestión activa según el FPM?",
      options: [
        "Maximizar el retorno en cada trade.",
        "Operar solo en mercados alcistas.",
        "Buscar la mayor cantidad de trades posibles.",
        "Sostener el portafolio en el tiempo aplicando reglas y disciplina, no improvisación."
      ],
      correct_option_index: 3,
      explanation: "El objetivo es la sostenibilidad y la disciplina, no la ganancia puntual."
    },
    {
      id: "ici-m5-q16",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Qué actitud muestra el inversor profesional ante la tentación de intervenir por impulso?",
      options: [
        "Registra la intervención en el log y revisa si fue justificada.",
        "Ignora el sistema.",
        "Opera más seguido.",
        "No hace nada."
      ],
      correct_option_index: 0,
      explanation: "El registro de intervenciones fuera de sistema permite auditar y corregir sesgos emocionales."
    },
    {
      id: "ici-m5-q17",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Por qué la gestión FPM enfatiza la lentitud antes de operar?",
      options: [
        "No tiene impacto real.",
        "La lentitud protege el capital y permite que el sistema funcione en drawdowns.",
        "Para perder menos oportunidades.",
        "Para operar más trades."
      ],
      correct_option_index: 1,
      explanation: "La lentitud deliberada es una barrera contra la impulsividad y la improvisación."
    },
    {
      id: "ici-m5-q18",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Qué actitud debe tomar el inversor si el portafolio resiste un drawdown grande sin intervención?",
      options: [
        "Aumentar la exposición a asimétrica.",
        "No hacer nada.",
        "Releer el mandato, revisar bandas y sostener el sistema.",
        "Vender todo inmediatamente."
      ],
      correct_option_index: 2,
      explanation: "El sistema está diseñado para resistir drawdowns sin intervención emocional."
    },
    {
      id: "ici-m5-q19",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Qué función cumple la disciplina en la gestión activa del FPM?",
      options: [
        "Aumenta la cantidad de trades.",
        "No tiene utilidad real.",
        "Solo sirve para principiantes.",
        "Permite sostener el sistema en el tiempo y evitar la improvisación."
      ],
      correct_option_index: 3,
      explanation: "La disciplina es la base de la gestión activa profesional."
    },
    {
      id: "ici-m5-q20",
      course_slug: "inner-circle-inversiones",
      module_number: 5,
      question_text: "¿Cuál es la función principal del módulo 5 de Inner Circle Inversiones?",
      options: [
        "Dominar la gestión activa profesional: rebalanceo, revisión, log, disciplina y cierre del sistema FPM.",
        "Aprender a operar solo con indicadores automáticos.",
        "Evitar operar durante la apertura.",
        "Buscar la mayor cantidad de trades posibles."
      ],
      correct_option_index: 0,
      explanation: "El módulo 5 busca que el alumno domine la gestión activa y la disciplina profesional."
    }
  ]
}
