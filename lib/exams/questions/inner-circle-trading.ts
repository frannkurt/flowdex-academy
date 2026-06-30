import type { ExamQuestionRaw } from "@/lib/exams/types";

// Preguntas de examen para Inner Circle Trading
// Formato: Array de ExamQuestionRaw[] por módulo

export const innerCircleTradingQuestions: Record<number, ExamQuestionRaw[]> = {
  1: [
    {
      id: "ict-m1-q1",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Cuál es el objetivo principal de la estrategia ORB Breakout?",
      options: [
        "Buscar patrones de velas japonesas exclusivamente.",
        "Capturar movimientos direccionales fuertes tras la apertura mediante la ruptura de un rango inicial.",
        "Operar solo en rangos laterales.",
        "Evitar operar durante la apertura."
      ],
      correct_option_index: 1,
      explanation: "El ORB Breakout busca aprovechar el movimiento direccional que suele ocurrir tras la ruptura del rango inicial de la apertura."
    },
    {
      id: "ict-m1-q2",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Qué significa ORB?",
      options: [
        "Overnight Range Breakout",
        "Open Risk Breakout",
        "Opening Range Breakout",
        "Order Range Balance"
      ],
      correct_option_index: 2,
      explanation: "ORB significa Opening Range Breakout, es decir, ruptura del rango de apertura."
    },
    {
      id: "ict-m1-q3",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Por qué es importante definir la caja ORB antes de operar?",
      options: [
        "Porque así se evita operar en cualquier momento del día.",
        "Porque el ORB solo funciona en mercados asiáticos.",
        "Porque el tamaño de la caja no afecta la operativa.",
        "Porque la caja define el rango clave donde se concentran los stops y la intención institucional."
      ],
      correct_option_index: 3,
      explanation: "La caja ORB concentra la atención institucional y los stops, y su ruptura suele generar movimiento fuerte."
    },
    {
      id: "ict-m1-q4",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Qué diferencia al ORB Flowdex del ORB tradicional?",
      options: [
        "El ORB Flowdex adapta la caja al comportamiento real de la apertura, no usa un timeframe fijo.",
        "El ORB Flowdex solo opera en 5 minutos.",
        "El ORB tradicional usa confluencias técnicas.",
        "No hay diferencia relevante."
      ],
      correct_option_index: 0,
      explanation: "El ORB Flowdex adapta la caja según el contexto, mientras que el tradicional usa una caja fija."
    },
    {
      id: "ict-m1-q5",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Qué evento institucional ocurre típicamente durante la apertura?",
      options: [
        "No ocurre nada relevante.",
        "Se digieren posiciones overnight y se define el sesgo del día.",
        "Se cierran todos los mercados globales.",
        "Solo operan traders minoristas."
      ],
      correct_option_index: 1,
      explanation: "Durante la apertura, el mercado digiere posiciones overnight y define el sesgo institucional del día."
    },
    {
      id: "ict-m1-q6",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Qué indica una vela inicial de cuerpo alcista grande y mecha inferior chica?",
      options: [
        "Día de rango lateral.",
        "Alta volatilidad sin dirección clara.",
        "Probable sesgo alcista para el día.",
        "Probable sesgo bajista."
      ],
      correct_option_index: 2,
      explanation: "Una vela inicial alcista suele anticipar un sesgo alcista para la jornada."
    },
    {
      id: "ict-m1-q7",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Qué debe hacer el trader si la vela inicial es extremadamente grande respecto al ATR?",
      options: [
        "Operar igual sin cambios.",
        "Reducir el tamaño de la posición.",
        "Ignorar la apertura.",
        "Subir a un timeframe mayor para definir la caja ORB."
      ],
      correct_option_index: 3,
      explanation: "Si la vela inicial es desproporcionada, se sube a 15m o 1h para definir la caja."
    },
    {
      id: "ict-m1-q8",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Qué confluencias técnicas se consideran clave en el ORB Flowdex?",
      options: [
        "Soportes/resistencias, áreas de Volume Profile y Fair Value Gaps.",
        "Solo medias móviles.",
        "Únicamente RSI y MACD.",
        "Ninguna, solo la caja ORB."
      ],
      correct_option_index: 0,
      explanation: "Las confluencias aumentan la probabilidad de éxito del breakout."
    },
    {
      id: "ict-m1-q9",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Por qué es importante guardar un screenshot de la caja ORB elegida?",
      options: [
        "Solo sirve para principiantes.",
        "Para validar luego si la selección fue correcta y mejorar el proceso.",
        "Para compartir en redes sociales.",
        "No tiene importancia real."
      ],
      correct_option_index: 1,
      explanation: "El registro visual ayuda a revisar y mejorar la toma de decisiones."
    },
    {
      id: "ict-m1-q10",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Qué ocurre cuando el precio rompe la caja ORB con convicción?",
      options: [
        "No tiene impacto en la operativa.",
        "Solo afecta a traders minoristas.",
        "Suele extender en la dirección de la ruptura.",
        "Siempre revierte inmediatamente."
      ],
      correct_option_index: 2,
      explanation: "Una ruptura genuina suele extenderse rápidamente por la ejecución de stops y nuevas órdenes."
    },
    {
      id: "ict-m1-q11",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Qué debe hacer el trader si la ruptura del ORB es falsa?",
      options: [
        "Mantener la posición esperando que vuelva.",
        "Aumentar el tamaño de la posición.",
        "Ignorar la señal.",
        "Salir rápido: la invalidación es parte del sistema."
      ],
      correct_option_index: 3,
      explanation: "El sistema ORB permite invalidación rápida para limitar pérdidas."
    },
    {
      id: "ict-m1-q12",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Qué rol cumplen los stops ubicados al otro lado de la caja ORB?",
      options: [
        "Funcionan como combustible para el movimiento tras la ruptura.",
        "No tienen impacto en el precio.",
        "Solo afectan a traders institucionales.",
        "Sirven para definir el ATR."
      ],
      correct_option_index: 0,
      explanation: "Los stops ejecutados tras la ruptura alimentan el movimiento direccional."
    },
    {
      id: "ict-m1-q13",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Qué actitud debe tener el trader respecto a la adaptación del sistema?",
      options: [
        "Solo se adapta en mercados bajistas.",
        "El sistema se adapta al mercado, no al revés.",
        "El trader debe forzar la misma regla todos los días.",
        "No es necesario adaptar nada."
      ],
      correct_option_index: 1,
      explanation: "La flexibilidad y adaptación son claves en el ORB Flowdex."
    },
    {
      id: "ict-m1-q14",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Qué error común cometen los alumnos la primera semana aplicando ORB adaptativo?",
      options: [
        "Operar solo en 1h.",
        "No usar confluencias técnicas.",
        "Equivocarse en la elección del timeframe de la caja en un 30-40%.",
        "No operar ningún día."
      ],
      correct_option_index: 2,
      explanation: "La curva de aprendizaje incluye errores en la elección del timeframe, que disminuyen con la práctica."
    },
    {
      id: "ict-m1-q15",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Qué indica una vela inicial con mechas largas y cuerpo chico?",
      options: [
        "Sesgo alcista fuerte.",
        "Sesgo bajista fuerte.",
        "Día de alta volatilidad y tendencia clara.",
        "Indecisión institucional, día de rango."
      ],
      correct_option_index: 3,
      explanation: "Mechas largas y cuerpo chico indican indecisión y probabilidad de rango."
    },
    {
      id: "ict-m1-q16",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Qué debe hacer el trader en días de ORB extremadamente pequeño respecto al ATR?",
      options: [
        "Reducir contratos o pasar el día.",
        "Aumentar el tamaño de la posición.",
        "Operar igual que siempre.",
        "Buscar solo rupturas falsas."
      ],
      correct_option_index: 0,
      explanation: "Días de baja volatilidad requieren reducir exposición o no operar."
    },
    {
      id: "ict-m1-q17",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Por qué es clave la disciplina en la ejecución del ORB?",
      options: [
        "Solo importa en mercados alcistas.",
        "Permite operar solo cuando todo alinea y evitar operar por ansiedad o FOMO.",
        "Permite operar más trades por día.",
        "No tiene impacto en los resultados."
      ],
      correct_option_index: 1,
      explanation: "La disciplina es fundamental para filtrar operaciones de baja probabilidad."
    },
    {
      id: "ict-m1-q18",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Qué función cumple el checklist pre-entrada en el ORB Flowdex?",
      options: [
        "No tiene utilidad real.",
        "Solo se usa en mercados volátiles.",
        "Asegura que se cumplan todos los requisitos antes de operar.",
        "Sirve solo para principiantes."
      ],
      correct_option_index: 2,
      explanation: "El checklist ayuda a mantener la consistencia y evitar errores por ansiedad."
    },
    {
      id: "ict-m1-q19",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Por qué la paciencia es considerada el único secreto en la operativa profesional del ORB?",
      options: [
        "Porque operar más trades siempre da mejores resultados.",
        "Porque el mercado premia la impulsividad.",
        "Porque la paciencia solo importa en mercados bajistas.",
        "Porque la disciplina para esperar la alineación de factores es lo que separa al profesional del amateur."
      ],
      correct_option_index: 3,
      explanation: "La paciencia para esperar la confluencia de factores es clave en el éxito del ORB."
    },
    {
      id: "ict-m1-q20",
      course_slug: "inner-circle-trading",
      module_number: 1,
      question_text: "¿Cuál es la función principal del módulo 1 de Inner Circle Trading?",
      options: [
        "Dominar la estrategia ORB Breakout adaptativa, su checklist y la validación profesional de rupturas.",
        "Aprender a operar solo con indicadores automáticos.",
        "Evitar operar durante la apertura.",
        "Buscar patrones de velas japonesas exclusivamente."
      ],
      correct_option_index: 0,
      explanation: "El módulo 1 busca que el alumno domine la estrategia ORB Breakout y su validación profesional."
    }
  ],
  2: [
    {
      id: "ict-m2-q1",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Cuál es la función principal del Volume Profile en el sistema ORB Flowdex?",
      options: [
        "Definir el tamaño de la caja ORB.",
        "Enmarcar el evento del ORB y definir zonas de aceptación, rechazo y objetivos.",
        "Determinar el horario de entrada.",
        "Calcular el ATR diario."
      ],
      correct_option_index: 1,
      explanation: "El Volume Profile enmarca el ORB y ayuda a validar rupturas y definir objetivos."
    },
    {
      id: "ict-m2-q2",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Qué representa la VAH (Value Area High) en el Volume Profile?",
      options: [
        "El borde inferior del 70% del volumen.",
        "Una zona de bajo volumen.",
        "El borde superior del 70% del volumen del día previo.",
        "El precio con mayor volumen del día previo."
      ],
      correct_option_index: 2,
      explanation: "La VAH es el límite superior del área de valor, zona de resistencia natural."
    },
    {
      id: "ict-m2-q3",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Qué uso tiene el POC (Point of Control) en la operativa ORB?",
      options: [
        "Se usa solo para definir stops.",
        "Sirve como señal de entrada inmediata.",
        "No tiene relevancia en el sistema.",
        "Funciona como imán de precio y objetivo, no como confluencia de entrada directa."
      ],
      correct_option_index: 3,
      explanation: "El POC es zona de equilibrio y objetivo, no de entrada directa."
    },
    {
      id: "ict-m2-q4",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Qué indica un HVN (High Volume Node) cercano a la ruptura del ORB?",
      options: [
        "Probable pausa o reversión del movimiento.",
        "Aceleración del precio.",
        "Zona de bajo volumen.",
        "No tiene impacto."
      ],
      correct_option_index: 0,
      explanation: "El HVN suele frenar el movimiento y puede generar consolidación o reversión."
    },
    {
      id: "ict-m2-q5",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Qué ocurre si la ruptura del ORB encuentra un LVN (Low Volume Node)?",
      options: [
        "Sirve solo como stop loss.",
        "Suele acelerar a través de él, es confluencia potente para runners.",
        "El precio se detiene inmediatamente.",
        "No tiene impacto en la operativa."
      ],
      correct_option_index: 1,
      explanation: "El LVN es zona de paso rápido, ideal para extensiones."
    },
    {
      id: "ict-m2-q6",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Qué pregunta clave responde el Volume Profile antes de la apertura?",
      options: [
        "¿Qué indicador automático usar?",
        "¿Cuántos contratos operar?",
        "¿Qué zonas el precio probablemente va a buscar o evitar tras la ruptura del ORB?",
        "¿Cuál es el mejor horario para operar?"
      ],
      correct_option_index: 2,
      explanation: "El VP ayuda a anticipar zonas de extensión o freno tras la ruptura."
    },
    {
      id: "ict-m2-q7",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Qué significa si el cierre previo está sobre el POC?",
      options: [
        "Sesgo bajista contextual.",
        "Día de rango lateral.",
        "No tiene impacto en la operativa.",
        "Sesgo alcista contextual, rupturas alcistas del ORB tienen viento a favor."
      ],
      correct_option_index: 3,
      explanation: "Sobre el POC, el contexto favorece rupturas alcistas."
    },
    {
      id: "ict-m2-q8",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Por qué no se usa el POC como entrada directa en el ORB Flowdex?",
      options: [
        "Porque es zona de equilibrio, no de dirección. El precio tiende a volver, no a salir con fuerza.",
        "Porque es zona de alta volatilidad.",
        "Porque solo sirve en mercados bajistas.",
        "Porque es un nivel irrelevante."
      ],
      correct_option_index: 0,
      explanation: "El POC es objetivo, no señal de entrada."
    },
    {
      id: "ict-m2-q9",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Qué rutina se recomienda antes de la apertura respecto al Volume Profile?",
      options: [
        "Operar sin mirar el contexto.",
        "Dibujar el VP del día anterior, identificar VAH, VAL, HVN, LVN y POC, y anticipar zonas clave.",
        "Solo mirar el gráfico de 1 minuto.",
        "Esperar la ruptura sin análisis previo."
      ],
      correct_option_index: 1,
      explanation: "La rutina de análisis previo calibra la lectura y mejora la toma de decisiones."
    },
    {
      id: "ict-m2-q10",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Qué significa que el precio esté exactamente en VAH o VAL al cierre previo?",
      options: [
        "No tiene impacto en la operativa.",
        "Solo importa en mercados alcistas.",
        "Día de decisión, el primer movimiento post-apertura suele definir la jornada.",
        "Día de rango lateral asegurado."
      ],
      correct_option_index: 2,
      explanation: "En VAH o VAL, el mercado está en zona de decisión clave."
    },
    {
      id: "ict-m2-q11",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Por qué conviene practicar la lectura del Volume Profile sin operar primero?",
      options: [
        "Para operar más trades por día.",
        "No tiene utilidad real.",
        "Solo sirve para principiantes.",
        "Para calibrar el ojo y mejorar la interpretación sin presión de ejecución."
      ],
      correct_option_index: 3,
      explanation: "La práctica sin operar mejora la lectura objetiva del contexto."
    },
    {
      id: "ict-m2-q12",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Dónde se coloca el stop en el sistema ORB Flowdex?",
      options: [
        "Al otro lado de la caja ORB, según la estructura del día.",
        "En un valor fijo de puntos.",
        "Siempre en el POC.",
        "En el máximo histórico."
      ],
      correct_option_index: 0,
      explanation: "El stop se define por la estructura de la caja, no por un valor fijo."
    },
    {
      id: "ict-m2-q13",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Cómo se ajusta el tamaño de la posición en el ORB Flowdex?",
      options: [
        "No se ajusta nunca.",
        "Se ajusta al stop: a mayor distancia, menor tamaño; a menor distancia, mayor tamaño.",
        "Siempre se opera el mismo tamaño.",
        "Se ajusta al ATR semanal."
      ],
      correct_option_index: 1,
      explanation: "El tamaño de la posición depende de la distancia al stop para mantener el riesgo constante."
    },
    {
      id: "ict-m2-q14",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Qué es el breakeven progresivo en la gestión de la operación?",
      options: [
        "No mover nunca el stop.",
        "Cerrar toda la posición al primer objetivo.",
        "Mover el stop a entrada o +1 punto solo cuando el precio recorre 3/4 del primer objetivo.",
        "Mover el stop apenas entra en ganancia."
      ],
      correct_option_index: 2,
      explanation: "El breakeven progresivo protege la operación sin asfixiarla prematuramente."
    },
    {
      id: "ict-m2-q15",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Cómo se decide la toma de parcial en el ORB Flowdex?",
      options: [
        "Siempre se toma el 100% al primer objetivo.",
        "No se toma parcial nunca.",
        "Solo se toma parcial en días de alta volatilidad.",
        "Depende de la fortaleza del impulso y la cantidad de contratos."
      ],
      correct_option_index: 3,
      explanation: "La toma de parcial se ajusta según el contexto y la fuerza del movimiento."
    },
    {
      id: "ict-m2-q16",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Qué es un runner en la gestión de la operación?",
      options: [
        "La parte de la posición que se deja correr siguiendo la estructura intradiaria.",
        "Un contrato adicional para operar más trades.",
        "Un stop loss alternativo.",
        "Un objetivo fijo de puntos."
      ],
      correct_option_index: 0,
      explanation: "El runner permite capturar movimientos extendidos siguiendo la tendencia."
    },
    {
      id: "ict-m2-q17",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Por qué no se usa un R:R objetivo predefinido en el ORB Flowdex?",
      options: [
        "Porque solo se opera en mercados alcistas.",
        "Porque el sistema es adaptativo: el stop y el objetivo emergen de la estructura y las confluencias, no de un ratio fijo.",
        "Porque no importa el riesgo.",
        "Porque siempre se busca 1:1."
      ],
      correct_option_index: 1,
      explanation: "El edge del ORB Flowdex está en la estructura adaptativa, no en un ratio fijo."
    },
    {
      id: "ict-m2-q18",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Qué diferencia al sizing profesional del amateur en el ORB Flowdex?",
      options: [
        "El profesional solo opera en 1h.",
        "No hay diferencia relevante.",
        "El profesional ajusta el tamaño según la estructura y el riesgo, el amateur opera siempre igual.",
        "El amateur nunca toma parciales."
      ],
      correct_option_index: 2,
      explanation: "El sizing profesional es flexible y adaptativo al contexto."
    },
    {
      id: "ict-m2-q19",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Qué función cumple la práctica de dibujar el Volume Profile cada mañana?",
      options: [
        "Aumentar la cantidad de trades diarios.",
        "No tiene utilidad real.",
        "Solo sirve para principiantes.",
        "Mejorar la anticipación de zonas clave y calibrar la lectura del contexto."
      ],
      correct_option_index: 3,
      explanation: "La práctica diaria mejora la anticipación y la toma de decisiones."
    },
    {
      id: "ict-m2-q20",
      course_slug: "inner-circle-trading",
      module_number: 2,
      question_text: "¿Cuál es la función principal del módulo 2 de Inner Circle Trading?",
      options: [
        "Dominar el uso del Volume Profile, la gestión de stops y el sizing adaptativo en la operativa ORB.",
        "Aprender a operar solo con indicadores automáticos.",
        "Evitar operar durante la apertura.",
        "Buscar patrones de velas japonesas exclusivamente."
      ],
      correct_option_index: 0,
      explanation: "El módulo 2 busca que el alumno domine el Volume Profile y la gestión profesional de stops y tamaño."
    }
  ],
  3: [
    {
      id: "ict-m3-q1",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Cuál es la principal señal para NO operar el ORB según el sistema?",
      options: [
        "Rango estrecho en el pre-market.",
        "Falta de estructura clara en la primera hora de mercado.",
        "Presencia de un FVG cerca del precio.",
        "Coincidencia de VAH y VAL."
      ],
      correct_option_index: 1,
      explanation: "Si la primera hora no genera estructura clara, no se opera el ORB ese día."
    },
    {
      id: "ict-m3-q2",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué días se recomienda no operar 30 min antes ni 60 min después de la apertura?",
      options: [
        "Días con cierre plano.",
        "Días con gap pequeño.",
        "Días con FOMC, NFP o CPI publicados durante sesión NY.",
        "Días con baja volatilidad."
      ],
      correct_option_index: 2,
      explanation: "Eventos macro importantes alteran la estructura y el edge estadístico del ORB."
    },
    {
      id: "ict-m3-q3",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué hacer tras dos pérdidas consecutivas según el sistema?",
      options: [
        "Aumentar el tamaño para recuperar.",
        "Buscar un nuevo setup inmediatamente.",
        "Operar solo con contratos mínimos.",
        "Parar de operar, sin importar el gráfico."
      ],
      correct_option_index: 3,
      explanation: "La estadística muestra que la tercera operación tras dos pérdidas suele ser la peor."
    },
    {
      id: "ict-m3-q4",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Por qué es importante registrar cada sesión y microgestión en una hoja de control?",
      options: [
        "Para medir si se sigue el proceso y detectar mejoras o errores.",
        "Para compartir en redes sociales.",
        "No tiene utilidad real.",
        "Solo sirve para principiantes."
      ],
      correct_option_index: 0,
      explanation: "El registro permite objetivar el proceso y mejorar la disciplina."
    },
    {
      id: "ict-m3-q5",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué objetivo pedagógico tiene el ejercicio de registrar 20 sesiones?",
      options: [
        "Reducir el riesgo a la mitad.",
        "Demostrar con datos propios si se sigue proceso o impulso.",
        "Aumentar la cantidad de trades diarios.",
        "Operar más contratos."
      ],
      correct_option_index: 1,
      explanation: "El objetivo es contrastar la realidad con la percepción y mejorar la adherencia al sistema."
    },
    {
      id: "ict-m3-q6",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué mide la fortaleza del impulso según el módulo?",
      options: [
        "Solo el tamaño de la caja ORB.",
        "La cantidad de contratos operados.",
        "Cuerpo de la vela igual o mayor al 70% del rango, volumen creciente y ausencia de mecha significativa contra la posición.",
        "Solo el volumen."
      ],
      correct_option_index: 2,
      explanation: "Dos de esas tres condiciones indican impulso fuerte."
    },
    {
      id: "ict-m3-q7",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué error frecuente destruye la ventaja estadística del sistema?",
      options: [
        "No tomar parciales.",
        "Operar solo en 1h.",
        "No usar Volume Profile.",
        "Mover el stop por miedo antes de tiempo."
      ],
      correct_option_index: 3,
      explanation: "La salida se ejecuta por regla, no por sensación del momento."
    },
    {
      id: "ict-m3-q8",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué diferencia la disciplina de salida profesional de la amateur?",
      options: [
        "El profesional toma lo justo y deja al menos un contrato correr.",
        "El amateur nunca toma parciales.",
        "El profesional cierra todo en el primer parcial.",
        "No hay diferencia relevante."
      ],
      correct_option_index: 0,
      explanation: "El profesional gestiona runners para capturar movimientos extendidos."
    },
    {
      id: "ict-m3-q9",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Cuál es la secuencia mental profesional recomendada en el caso guiado?",
      options: [
        "Dimensionar, clasificar, ejecutar, validar, gestionar.",
        "Clasificar, validar, dimensionar, ejecutar, gestionar.",
        "Ejecutar, validar, clasificar, gestionar, dimensionar.",
        "Gestionar, ejecutar, validar, clasificar, dimensionar."
      ],
      correct_option_index: 1,
      explanation: "El orden profesional es: clasificar, validar, dimensionar, ejecutar, gestionar."
    },
    {
      id: "ict-m3-q10",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué significa la escala de calidad de confluencias (amarillo, verde claro, verde pleno)?",
      options: [
        "Verde pleno es para principiantes.",
        "No tiene impacto en la operativa.",
        "Una confluencia es operable, dos es buen setup, tres es trade de día.",
        "Solo se opera con tres confluencias."
      ],
      correct_option_index: 2,
      explanation: "La escala ayuda a dimensionar la convicción y el tamaño de la posición."
    },
    {
      id: "ict-m3-q11",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué debe hacer el trader si el mercado está emocionalmente comprometido?",
      options: [
        "Aumentar el tamaño de la posición.",
        "Buscar un nuevo setup inmediatamente.",
        "Operar solo con contratos mínimos.",
        "No operar ese día."
      ],
      correct_option_index: 3,
      explanation: "La fatiga, frustración o presión externa son enemigos invisibles del sistema."
    },
    {
      id: "ict-m3-q12",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué indica un Volume Profile extremadamente plano el día anterior?",
      options: [
        "El mercado está en consolidación profunda y los breakouts del ORB pierden poder estadístico.",
        "Alta volatilidad asegurada.",
        "Día ideal para operar.",
        "No tiene impacto en la operativa."
      ],
      correct_option_index: 0,
      explanation: "Consolidación profunda reduce la probabilidad de éxito del ORB."
    },
    {
      id: "ict-m3-q13",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué debe hacer el trader si la ruptura del ORB ocurre sin confluencias?",
      options: [
        "Operar solo con contratos mínimos.",
        "No operar, solo operar rupturas con 2-3 confluencias.",
        "Entrar igual por si acaso.",
        "Aumentar el tamaño de la posición."
      ],
      correct_option_index: 1,
      explanation: "La validación con confluencias es clave para filtrar operaciones de baja probabilidad."
    },
    {
      id: "ict-m3-q14",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué significa que el stop 'sale del mercado'?",
      options: [
        "Siempre se usa el mismo stop.",
        "El stop se ajusta al ATR semanal.",
        "El stop se define por la estructura del día, no por un valor fijo.",
        "El stop se decide antes de ver el mercado."
      ],
      correct_option_index: 2,
      explanation: "El stop emerge de la estructura de la caja ORB y el contexto."
    },
    {
      id: "ict-m3-q15",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué debe hacer el trader si la caja ORB es grande?",
      options: [
        "Operar igual que siempre.",
        "Aumentar el riesgo.",
        "No operar ese día.",
        "Ajustar el tamaño de la posición para mantener el riesgo constante."
      ],
      correct_option_index: 3,
      explanation: "El tamaño de la posición se ajusta a la distancia al stop."
    },
    {
      id: "ict-m3-q16",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué debe hacer el trader si la caja ORB es chica?",
      options: [
        "Puede operar mayor tamaño manteniendo el riesgo constante.",
        "No operar ese día.",
        "Aumentar el riesgo.",
        "Operar igual que siempre."
      ],
      correct_option_index: 0,
      explanation: "Caja chica permite mayor tamaño con el mismo riesgo."
    },
    {
      id: "ict-m3-q17",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué debe hacer el trader si no respeta su propio sistema en menos de 18 de 20 sesiones?",
      options: [
        "No tiene impacto en la operativa.",
        "No está operando ORB, sino intuición disfrazada de ORB.",
        "Debe operar más contratos.",
        "Debe cambiar de sistema."
      ],
      correct_option_index: 1,
      explanation: "La adherencia al sistema es clave para el edge estadístico."
    },
    {
      id: "ict-m3-q18",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué debe hacer el trader si el pre-market viene con rango moderado y sin dato macro inmediato?",
      options: [
        "Esperar a la segunda hora para operar.",
        "No operar ese día.",
        "Clasificar la apertura y definir la caja ORB según la estructura inicial.",
        "Entrar rápido en la primera ruptura."
      ],
      correct_option_index: 2,
      explanation: "La clasificación de la apertura es el primer paso profesional."
    },
    {
      id: "ict-m3-q19",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Qué función cumple la microgestión en la operativa ORB?",
      options: [
        "Solo sirve para principiantes.",
        "No tiene utilidad real.",
        "Aumenta el riesgo innecesariamente.",
        "Permite ajustar stops, tomar parciales y dejar runners según la evolución del trade."
      ],
      correct_option_index: 3,
      explanation: "La microgestión profesionaliza la gestión de la operación."
    },
    {
      id: "ict-m3-q20",
      course_slug: "inner-circle-trading",
      module_number: 3,
      question_text: "¿Cuál es la función principal del módulo 3 de Inner Circle Trading?",
      options: [
        "Dominar la gestión avanzada: cuándo no operar, disciplina, microgestión y adherencia profesional al sistema.",
        "Aprender a operar solo con indicadores automáticos.",
        "Evitar operar durante la apertura.",
        "Buscar patrones de velas japonesas exclusivamente."
      ],
      correct_option_index: 0,
      explanation: "El módulo 3 busca que el alumno domine la gestión avanzada y la disciplina profesional."
    }
  ],
  4: [
    {
      id: "ict-m4-q1",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Por qué el sistema ORB Flowdex se especializa en la sesión de Nueva York?",
      options: [
        "Porque solo funciona en mercados alcistas.",
        "Por volumen institucional, direccionalidad clara y liquidez óptima.",
        "Porque es la única sesión con volatilidad.",
        "Por preferencia personal del autor."
      ],
      correct_option_index: 1,
      explanation: "NY concentra el volumen, la direccionalidad y la liquidez necesarias para el edge del sistema."
    },
    {
      id: "ict-m4-q2",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Qué significa la especialización por sesión en trading?",
      options: [
        "Buscar oportunidades 24/7.",
        "Solo operar en mercados alcistas.",
        "Renunciar a operar fuera del horario elegido para proteger la calidad de ejecución.",
        "Operar todas las sesiones para diversificar."
      ],
      correct_option_index: 2,
      explanation: "La especialización protege la calidad y el edge operativo."
    },
    {
      id: "ict-m4-q3",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Cuál es el primer paso del análisis top-down preapertura?",
      options: [
        "Buscar un setup en 5m.",
        "Operar sin contexto.",
        "Solo mirar el gráfico diario.",
        "Mirar el gráfico de 4h para definir la tendencia macro."
      ],
      correct_option_index: 3,
      explanation: "El 4h da el contexto macro para la jornada."
    },
    {
      id: "ict-m4-q4",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Qué error comete el trader que usa enfoque bottom-up?",
      options: [
        "Arranca desde 5m buscando setup y sube solo para justificar una idea emocional.",
        "Siempre opera a favor de la tendencia.",
        "Nunca usa Volume Profile.",
        "Solo opera en mercados bajistas."
      ],
      correct_option_index: 0,
      explanation: "El bottom-up lleva a operar contra la tendencia macro sin contexto."
    },
    {
      id: "ict-m4-q5",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Qué pregunta responde el timeframe de 1h en el análisis top-down?",
      options: [
        "Gestión de liquidez.",
        "Estructura del día anterior y niveles clave.",
        "Timing de entrada.",
        "Tendencia macro semanal."
      ],
      correct_option_index: 1,
      explanation: "El 1h ayuda a identificar niveles y estructura relevante para la sesión."
    },
    {
      id: "ict-m4-q6",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Qué aporta el timeframe de 15m en el análisis top-down?",
      options: [
        "Solo timing de entrada.",
        "Gestión emocional.",
        "S/R, FVG y áreas de Volume Profile.",
        "Tendencia macro semanal."
      ],
      correct_option_index: 2,
      explanation: "El 15m refina zonas operativas y confluencias técnicas."
    },
    {
      id: "ict-m4-q7",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Cuál es la función del timeframe de 5m en el análisis top-down?",
      options: [
        "Definir la tendencia macro.",
        "Identificar niveles clave.",
        "Gestión de liquidez.",
        "Ejecución, no planificación."
      ],
      correct_option_index: 3,
      explanation: "El 5m se usa para ejecutar, no para planificar la jornada."
    },
    {
      id: "ict-m4-q8",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Por qué es clave la gestión de liquidez en la sesión NY?",
      options: [
        "Porque los spreads son mínimos y el volumen institucional define los niveles relevantes.",
        "Porque solo importa en mercados alcistas.",
        "Porque la volatilidad es baja.",
        "Porque el horario es irrelevante."
      ],
      correct_option_index: 0,
      explanation: "La liquidez óptima en NY permite operar con menor costo y mayor edge."
    },
    {
      id: "ict-m4-q9",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Qué actitud diferencia al profesional del amateur respecto al horario de operativa?",
      options: [
        "No hay diferencia relevante.",
        "El profesional opera 4-6 horas concretas y descansa el resto.",
        "El amateur opera 24/7 sin descanso.",
        "El profesional busca oportunidades todo el día."
      ],
      correct_option_index: 1,
      explanation: "El profesional protege su edge operando solo en el horario óptimo."
    },
    {
      id: "ict-m4-q10",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Qué función cumple la tabla de timeframes en la rutina preapertura?",
      options: [
        "No tiene utilidad real.",
        "Aumenta la cantidad de trades diarios.",
        "Organiza el análisis y asegura que cada capa de contexto sea revisada.",
        "Solo sirve para principiantes."
      ],
      correct_option_index: 2,
      explanation: "La tabla guía el análisis top-down y evita saltar pasos clave."
    },
    {
      id: "ict-m4-q11",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Por qué es importante definir niveles clave antes de la apertura?",
      options: [
        "Solo sirve para mercados alcistas.",
        "No tiene impacto en la operativa.",
        "Aumenta el riesgo innecesariamente.",
        "Permite anticipar zonas de reacción y planificar la operativa con antelación."
      ],
      correct_option_index: 3,
      explanation: "Definir niveles clave anticipa posibles escenarios y mejora la toma de decisiones."
    },
    {
      id: "ict-m4-q12",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Qué error evita el análisis top-down en la operativa intradía?",
      options: [
        "Operar contra la tendencia macro por falta de contexto.",
        "Operar solo en 5m.",
        "No usar Volume Profile.",
        "Aumentar el tamaño de la posición."
      ],
      correct_option_index: 0,
      explanation: "El top-down filtra el ruido y evita operar contra la tendencia principal."
    },
    {
      id: "ict-m4-q13",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Qué función cumple la especialización en la gestión emocional del trader?",
      options: [
        "Solo sirve para principiantes.",
        "Reduce la fatiga y mejora la calidad de ejecución.",
        "Aumenta la cantidad de trades diarios.",
        "No tiene impacto en la operativa."
      ],
      correct_option_index: 1,
      explanation: "La especialización protege la energía mental y la disciplina."
    },
    {
      id: "ict-m4-q14",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Por qué es importante la rutina preapertura en la sesión NY?",
      options: [
        "No tiene impacto en la operativa.",
        "Aumenta el riesgo innecesariamente.",
        "Automatiza pasos previos y libera energía mental para ejecutar el plan con disciplina.",
        "Solo sirve para mercados alcistas."
      ],
      correct_option_index: 2,
      explanation: "La rutina preapertura prepara al trader para ejecutar con disciplina y foco."
    },
    {
      id: "ict-m4-q15",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Qué función cumple el checklist en la operativa intradía?",
      options: [
        "Solo sirve para principiantes.",
        "No tiene utilidad real.",
        "Aumenta la cantidad de trades diarios.",
        "Asegura que se cumplan todos los requisitos antes de operar y filtra operaciones impulsivas."
      ],
      correct_option_index: 3,
      explanation: "El checklist mantiene la consistencia y disciplina operativa."
    },
    {
      id: "ict-m4-q16",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Qué actitud debe tener el trader profesional respecto a la cantidad de horas operadas?",
      options: [
        "Operar solo en el horario óptimo y descansar el resto.",
        "Buscar oportunidades todo el día.",
        "Aumentar la cantidad de trades diarios.",
        "No hay diferencia relevante."
      ],
      correct_option_index: 0,
      explanation: "El profesional protege su edge y energía operando solo en el horario óptimo."
    },
    {
      id: "ict-m4-q17",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Qué función cumple la gestión de liquidez en la operativa profesional?",
      options: [
        "Solo sirve para principiantes.",
        "Permite operar con menor costo y mayor edge, aprovechando el volumen institucional.",
        "Aumenta el riesgo innecesariamente.",
        "No tiene impacto en la operativa."
      ],
      correct_option_index: 1,
      explanation: "La gestión de liquidez optimiza el costo y la calidad de ejecución."
    },
    {
      id: "ict-m4-q18",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Por qué es importante la disciplina en la especialización por sesión?",
      options: [
        "No tiene impacto en la operativa.",
        "Solo sirve para principiantes.",
        "Permite sostener el edge y evitar la fatiga operando solo en el horario óptimo.",
        "Aumenta la cantidad de trades diarios."
      ],
      correct_option_index: 2,
      explanation: "La disciplina en la especialización protege el edge y la energía mental."
    },
    {
      id: "ict-m4-q19",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Qué actitud muestra el profesional ante oportunidades fuera de la sesión elegida?",
      options: [
        "Opera todo el día para no perder oportunidades.",
        "Aumenta la cantidad de trades diarios.",
        "No hay diferencia relevante.",
        "Renuncia a operar fuera del horario para proteger la calidad de ejecución."
      ],
      correct_option_index: 3,
      explanation: "El profesional prioriza la calidad y la consistencia sobre la cantidad."
    },
    {
      id: "ict-m4-q20",
      course_slug: "inner-circle-trading",
      module_number: 4,
      question_text: "¿Cuál es la función principal del módulo 4 de Inner Circle Trading?",
      options: [
        "Dominar la operativa intradía profesional en NY: especialización, top-down, gestión de liquidez y disciplina.",
        "Aprender a operar solo con indicadores automáticos.",
        "Evitar operar durante la apertura.",
        "Buscar patrones de velas japonesas exclusivamente."
      ],
      correct_option_index: 0,
      explanation: "El módulo 4 busca que el alumno domine la operativa profesional y la disciplina en NY."
    }
  ],
  5: [
    {
      id: "ict-m5-q1",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Cuál es el propósito principal de la gestión de riesgo en trading profesional?",
      options: [
        "Evitar el uso de stops en mercados volátiles.",
        "Garantizar la supervivencia de la cuenta a largo plazo.",
        "Maximizar las ganancias en cada operación.",
        "Operar con el mayor apalancamiento posible."
      ],
      correct_option_index: 1,
      explanation: "La gestión de riesgo profesional prioriza la supervivencia y la preservación del capital sobre la ganancia puntual."
    },
    {
      id: "ict-m5-q2",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué porcentaje de riesgo por operación se recomienda en cuenta propia según el protocolo Flowdex?",
      options: [
        "5-10 % del capital.",
        "0,1 % del capital.",
        "1-2 % del capital.",
        "10 % del capital."
      ],
      correct_option_index: 2,
      explanation: "El protocolo Flowdex recomienda arriesgar entre 1 y 2 % del capital por operación en cuenta propia."
    },
    {
      id: "ict-m5-q3",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Cuál es la diferencia clave entre cuenta propia y cuenta de fondeo?",
      options: [
        "En cuenta propia no se usan stops.",
        "En fondeo se puede operar sin límites.",
        "No hay diferencia relevante.",
        "En fondeo, el riesgo diario máximo se calcula sobre el drawdown permitido, no sobre el balance nominal."
      ],
      correct_option_index: 3,
      explanation: "En cuentas de fondeo, el riesgo diario y por operación se calcula sobre el drawdown permitido por la prop firm."
    },
    {
      id: "ict-m5-q4",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué acción indica el protocolo Flowdex ante un drawdown del 10-15 %?",
      options: [
        "Reducir contratos 50 % y pausar 1 día por cada 1 % adicional.",
        "Aumentar el tamaño de la posición para recuperar rápido.",
        "Operar con apalancamiento máximo.",
        "No cambiar nada en la operativa."
      ],
      correct_option_index: 0,
      explanation: "El protocolo exige reducción de size y pausas para evitar profundizar el drawdown."
    },
    {
      id: "ict-m5-q5",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué es un 'circuit breaker' en gestión de riesgo?",
      options: [
        "Un sistema de apalancamiento progresivo.",
        "Una regla de freno automático que corta la escalada de errores emocionales.",
        "Un tipo de stop loss móvil.",
        "Un indicador técnico de tendencia."
      ],
      correct_option_index: 1,
      explanation: "El circuit breaker es una regla que obliga a pausar o reducir exposición tras una racha negativa."
    },
    {
      id: "ict-m5-q6",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué actitud debe tomar el trader tras dos pérdidas consecutivas según el protocolo?",
      options: [
        "Seguir operando sin cambios.",
        "Buscar setups más agresivos.",
        "Pausar al menos una hora antes de volver a operar.",
        "Aumentar el tamaño de la posición para recuperar."
      ],
      correct_option_index: 2,
      explanation: "El protocolo recomienda pausar tras dos pérdidas para evitar la escalada emocional."
    },
    {
      id: "ict-m5-q7",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué ocurre si la cuenta cae un 50 % desde el último pico de equity?",
      options: [
        "Se recupera con solo un 50 % de ganancia.",
        "No hay diferencia en la recuperación.",
        "Solo se necesita un 10 % de ganancia.",
        "Se necesita una ganancia del 100 % para recuperar el capital inicial."
      ],
      correct_option_index: 3,
      explanation: "La asimetría del drawdown implica que recuperar una caída profunda requiere un porcentaje mucho mayor."
    },
    {
      id: "ict-m5-q8",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Cuál es la fórmula para calcular el tamaño de posición en MES según el protocolo?",
      options: [
        "Riesgo total dividido por la distancia al stop multiplicada por el valor del punto.",
        "Solo se calcula por intuición.",
        "Se usa el 10 % del capital siempre.",
        "No se recomienda calcular el tamaño."
      ],
      correct_option_index: 0,
      explanation: "El tamaño de posición se calcula dividiendo el riesgo permitido por la distancia al stop y el valor del punto."
    },
    {
      id: "ict-m5-q9",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué indica el protocolo si con 1 contrato el riesgo excede tu límite operativo?",
      options: [
        "Reducir el objetivo de ganancia.",
        "No operar ese día.",
        "Aumentar el stop.",
        "Operar igual con más contratos."
      ],
      correct_option_index: 1,
      explanation: "Si el riesgo mínimo supera el límite, la regla es no operar."
    },
    {
      id: "ict-m5-q10",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué acción exige el protocolo tras cinco días consecutivos perdedores?",
      options: [
        "Operar solo en mercados alcistas.",
        "No cambiar nada.",
        "Pausar 7 días y hacer revisión integral.",
        "Aumentar el tamaño de la posición."
      ],
      correct_option_index: 2,
      explanation: "La pausa y revisión integral son obligatorias tras una racha negativa prolongada."
    },
    {
      id: "ict-m5-q11",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué es el drawdown en trading?",
      options: [
        "El máximo beneficio alcanzado.",
        "El número de operaciones ganadoras.",
        "El saldo promedio mensual.",
        "La caída desde el último pico de equity."
      ],
      correct_option_index: 3,
      explanation: "El drawdown mide la caída máxima desde el último pico de capital."
    },
    {
      id: "ict-m5-q12",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué actitud debe tomar el trader ante una pérdida diaria mayor al 3 % en cuenta propia?",
      options: [
        "Pausar 2 días antes de volver a operar.",
        "Aumentar el tamaño de la posición.",
        "Seguir operando sin cambios.",
        "Buscar setups más agresivos."
      ],
      correct_option_index: 0,
      explanation: "El protocolo exige pausa tras una pérdida diaria significativa."
    },
    {
      id: "ict-m5-q13",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué mide la 'equity curve' en el contexto de gestión de riesgo?",
      options: [
        "La cantidad de contratos operados.",
        "La evolución del capital a lo largo del tiempo, visualizando estabilidad, drawdown y recuperación.",
        "El número de operaciones ganadoras.",
        "El saldo promedio mensual."
      ],
      correct_option_index: 1,
      explanation: "La equity curve permite visualizar la salud y estabilidad del sistema."
    },
    {
      id: "ict-m5-q14",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué función cumple el 'check-in psicológico' antes de la apertura?",
      options: [
        "No tiene impacto en la operativa.",
        "Solo sirve para principiantes.",
        "Filtrar los días en los que no deberías operar por fatiga, falta de claridad o carga emocional.",
        "Aumentar la cantidad de trades diarios."
      ],
      correct_option_index: 2,
      explanation: "El check-in psicológico previene operar en condiciones mentales desfavorables."
    },
    {
      id: "ict-m5-q15",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué actitud debe tomar el trader si la pregunta 1 o 2 del check-in psicológico da menos de 7?",
      options: [
        "Aumentar el tamaño de la posición.",
        "Operar igual con menos contratos.",
        "Buscar setups más agresivos.",
        "No operar ese día."
      ],
      correct_option_index: 3,
      explanation: "El protocolo exige no operar si el estado físico o mental no es óptimo."
    },
    {
      id: "ict-m5-q16",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué es un 'circuit breaker' y por qué es clave en la gestión de riesgo?",
      options: [
        "Es una regla de freno automático que protege la cuenta de la escalada emocional y de pérdidas.",
        "Un tipo de stop loss móvil.",
        "Un indicador técnico de tendencia.",
        "Un sistema de apalancamiento progresivo."
      ],
      correct_option_index: 0,
      explanation: "El circuit breaker corta la cadena de errores y protege el capital."
    },
    {
      id: "ict-m5-q17",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué actitud muestra el profesional ante la tentación de recuperar rápido tras una racha negativa?",
      options: [
        "No cambia nada en la operativa.",
        "Reduce size, audita y espera antes de volver a operar.",
        "Aumenta el tamaño de la posición para recuperar.",
        "Opera más trades por día."
      ],
      correct_option_index: 1,
      explanation: "El profesional prioriza la preservación del capital y la disciplina sobre la recuperación rápida."
    },
    {
      id: "ict-m5-q18",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Qué función cumple el journal en la gestión de riesgo profesional?",
      options: [
        "No tiene utilidad real.",
        "Aumenta la cantidad de trades diarios.",
        "Convertir lenguaje y reglas en protocolo accionable y auditable.",
        "Solo sirve para principiantes."
      ],
      correct_option_index: 2,
      explanation: "El journal permite auditar y mejorar la disciplina y la gestión de riesgo."
    },
    {
      id: "ict-m5-q19",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Cuál es el objetivo final de la gestión de riesgo profesional según el módulo 5?",
      options: [
        "Maximizar el apalancamiento en cada trade.",
        "Operar solo en mercados alcistas.",
        "Buscar la mayor cantidad de trades posibles.",
        "Sobrevivir el primer año y sostener la disciplina para que el edge estadístico se manifieste."
      ],
      correct_option_index: 3,
      explanation: "La gestión de riesgo profesional busca la supervivencia y la repetición disciplinada."
    },
    {
      id: "ict-m5-q20",
      course_slug: "inner-circle-trading",
      module_number: 5,
      question_text: "¿Cuál es la función principal del módulo 5 de Inner Circle Trading?",
      options: [
        "Dominar la gestión de riesgo profesional: sizing, drawdown, protocolos y disciplina para cuenta propia y fondeo.",
        "Aprender a operar solo con indicadores automáticos.",
        "Evitar operar durante la apertura.",
        "Buscar patrones de velas japonesas exclusivamente."
      ],
      correct_option_index: 0,
      explanation: "El módulo 5 busca que el alumno domine la gestión de riesgo profesional y la disciplina asociada."
    }
  ]
};
