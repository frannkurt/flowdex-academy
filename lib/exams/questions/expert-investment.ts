import type { ExamQuestionRaw } from "@/lib/exams/types";

// Preguntas de examen para Expert Investment
// Formato: Array de ExamQuestionRaw[] por módulo

export const expertInvestmentQuestions: Record<number, ExamQuestionRaw[]> = {
  1: [
    {
      id: "ei-m1-q1",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Cuál es el objetivo principal del análisis fundamental?",
      options: [
        "Predecir el precio de una acción a corto plazo.",
        "Determinar el valor real de un activo y detectar oportunidades cuando hay diferencia con el precio de mercado.",
        "Analizar únicamente los gráficos de precios.",
        "Invertir solo en empresas tecnológicas."
      ],
      correct_option_index: 1,
      explanation: "El análisis fundamental busca estimar el valor real de un activo y aprovechar oportunidades cuando el precio de mercado difiere significativamente de ese valor."
    },
    {
      id: "ei-m1-q2",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Qué diferencia al análisis fundamental del análisis técnico?",
      options: [
        "El fundamental analiza la salud económica y el valor, el técnico se enfoca en precio, volumen y patrones del gráfico.",
        "El fundamental solo usa gráficos.",
        "El técnico analiza balances y flujos de caja.",
        "Ambos son exactamente iguales."
      ],
      correct_option_index: 0,
      explanation: "El fundamental estudia la empresa y su valor, el técnico estudia el comportamiento del precio en el mercado."
    },
    {
      id: "ei-m1-q3",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Qué representa el concepto de 'valor intrínseco'?",
      options: [
        "El precio actual de mercado.",
        "La estimación del valor real de un activo basada en sus fundamentos económicos.",
        "El valor sentimental de una acción.",
        "El valor de marca de una empresa."
      ],
      correct_option_index: 1,
      explanation: "El valor intrínseco es la estimación profesional del valor real de un activo, independientemente de su precio de mercado."
    },
    {
      id: "ei-m1-q4",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Cuál de los siguientes NO es un pilar del análisis fundamental?",
      options: [
        "Factores macroeconómicos.",
        "Factores micro y corporativos.",
        "Análisis de patrones de velas.",
        "Valor intrínseco."
      ],
      correct_option_index: 2,
      explanation: "El análisis de patrones de velas es propio del análisis técnico, no del fundamental."
    },
    {
      id: "ei-m1-q5",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Por qué es importante el contexto macroeconómico en el análisis fundamental?",
      options: [
        "Porque define el clima en el que opera la empresa y puede afectar ventas, márgenes y valuaciones.",
        "Solo importa el micro de la empresa.",
        "No tiene ninguna relevancia.",
        "Sirve solo para empresas tecnológicas."
      ],
      correct_option_index: 0,
      explanation: "El entorno macro afecta el costo del capital, la demanda y la valoración de los activos."
    },
    {
      id: "ei-m1-q6",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Qué mide el ratio 'Net Income Margin'?",
      options: [
        "El porcentaje de ingresos que termina como ganancia neta.",
        "El crecimiento de ventas.",
        "La deuda total de la empresa.",
        "El valor de mercado de la empresa."
      ],
      correct_option_index: 0,
      explanation: "El Net Income Margin muestra qué parte de los ingresos se convierte en ganancia neta."
    },
    {
      id: "ei-m1-q7",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Por qué es clave el ROIC en el análisis fundamental?",
      options: [
        "Porque mide cuánto rinde cada dólar invertido en el negocio, sin importar de dónde salió ese dólar.",
        "Porque mide solo la deuda.",
        "Porque es un ratio técnico.",
        "Porque solo aplica a bancos."
      ],
      correct_option_index: 0,
      explanation: "El ROIC es el ratio más importante para medir la eficiencia real del capital invertido."
    },
    {
      id: "ei-m1-q8",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Qué indica un Current Ratio menor a 1?",
      options: [
        "Que la empresa tiene más activos que pasivos de corto plazo.",
        "Que la empresa podría tener problemas para cubrir sus obligaciones de corto plazo.",
        "Que la empresa es muy rentable.",
        "Que la empresa no tiene deuda."
      ],
      correct_option_index: 1,
      explanation: "Un Current Ratio menor a 1 indica posible falta de liquidez para cubrir deudas inmediatas."
    },
    {
      id: "ei-m1-q9",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Cuál es la diferencia entre crecimiento sano y crecimiento tóxico?",
      options: [
        "El sano mantiene o mejora márgenes y caja; el tóxico crece a costa de quemar caja o endeudarse.",
        "El tóxico es siempre en empresas tecnológicas.",
        "No existe diferencia.",
        "El sano solo ocurre en empresas grandes."
      ],
      correct_option_index: 0,
      explanation: "El crecimiento sano es sostenible y rentable; el tóxico destruye valor a largo plazo."
    },
    {
      id: "ei-m1-q10",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Por qué el cash flow es más confiable que la ganancia contable?",
      options: [
        "Porque es más difícil de maquillar y muestra la caja real que entra y sale.",
        "Porque es un ratio técnico.",
        "Porque solo aplica a bancos.",
        "Porque depende de la inflación."
      ],
      correct_option_index: 0,
      explanation: "El cash flow refleja la realidad financiera, mientras que la ganancia contable puede ser manipulada con ajustes."
    },
    {
      id: "ei-m1-q11",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Qué método de valuación es más adecuado para empresas con flujos previsibles?",
      options: [
        "Múltiplos.",
        "DCF (Descuento de Flujos de Caja).",
        "Valor contable ajustado.",
        "PER."
      ],
      correct_option_index: 1,
      explanation: "El DCF es ideal para empresas con flujos de caja estables y previsibles."
    },
    {
      id: "ei-m1-q12",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Qué es el margen de seguridad según Buffett?",
      options: [
        "Comprar solo empresas baratas.",
        "Comprar con descuento respecto al valor estimado para reducir el riesgo de error de análisis.",
        "No invertir nunca en empresas caras.",
        "Invertir solo en empresas conocidas."
      ],
      correct_option_index: 1,
      explanation: "El margen de seguridad es pagar menos de lo que vale una empresa para protegerse de errores de análisis."
    },
    {
      id: "ei-m1-q13",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Por qué es importante tener un proceso profesional paso a paso?",
      options: [
        "Porque filtra la emoción y permite tomar decisiones consistentes.",
        "Porque garantiza ganancias.",
        "Porque es obligatorio por ley.",
        "Porque lo recomienda la CNV."
      ],
      correct_option_index: 0,
      explanation: "El proceso profesional reduce el impacto de la emoción y sistematiza la toma de decisiones."
    },
    {
      id: "ei-m1-q14",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Qué es un scoring en el análisis fundamental?",
      options: [
        "Un sistema de puntaje para comparar oportunidades bajo las mismas reglas.",
        "Un ratio de liquidez.",
        "Un método de análisis técnico.",
        "Un tipo de dividendo."
      ],
      correct_option_index: 0,
      explanation: "El scoring permite comparar empresas de manera objetiva y sistemática."
    },
    {
      id: "ei-m1-q15",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Qué es una red flag en el análisis fundamental?",
      options: [
        "Una señal de alerta que puede anticipar problemas serios en la empresa.",
        "Un ratio de rentabilidad.",
        "Un método de valuación.",
        "Un tipo de dividendo."
      ],
      correct_option_index: 0,
      explanation: "Las red flags son señales de alerta que pueden anticipar deterioro o problemas estructurales."
    },
    {
      id: "ei-m1-q16",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Por qué es clave documentar las decisiones de inversión?",
      options: [
        "Porque permite revisar y aprender de los errores y aciertos.",
        "Porque es obligatorio por ley.",
        "Porque lo exige la CNV.",
        "Porque garantiza ganancias."
      ],
      correct_option_index: 0,
      explanation: "Documentar permite construir criterio acumulable y mejorar el proceso de inversión."
    },
    {
      id: "ei-m1-q17",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Qué significa que una empresa tenga 'solvencia de hierro'?",
      options: [
        "Que tiene un Current Ratio bajo.",
        "Que tiene bajo apalancamiento y puede afrontar deudas sin comprometer su operación.",
        "Que solo invierte en real estate.",
        "Que paga dividendos altos."
      ],
      correct_option_index: 1,
      explanation: "La solvencia de hierro implica bajo apalancamiento y capacidad de afrontar deudas con holgura."
    },
    {
      id: "ei-m1-q18",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Qué es una trampa de valor?",
      options: [
        "Una empresa que parece barata por múltiplos pero tiene problemas estructurales que justifican el precio bajo.",
        "Una empresa con PER alto.",
        "Un REIT con yield bajo.",
        "Un ETF de tecnología."
      ],
      correct_option_index: 0,
      explanation: "La trampa de valor es una empresa que parece barata pero tiene problemas ocultos."
    },
    {
      id: "ei-m1-q19",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Por qué conviene comparar empresas dentro del mismo sector?",
      options: [
        "Porque los múltiplos y ratios varían mucho entre sectores y solo son comparables entre pares.",
        "Porque es obligatorio por ley.",
        "Porque lo exige la CNV.",
        "Porque garantiza ganancias."
      ],
      correct_option_index: 0,
      explanation: "Comparar dentro del mismo sector permite evaluar correctamente múltiplos y ratios."
    },
    {
      id: "ei-m1-q20",
      course_slug: "expert-investment",
      module_number: 1,
      question_text: "¿Cuál es la función principal del módulo 1 de Expert Investment?",
      options: [
        "Profundizar en el análisis fundamental profesional y su aplicación práctica para evaluar empresas y detectar oportunidades reales.",
        "Explicar cómo operar futuros.",
        "Desarrollar estrategias de trading algorítmico.",
        "Fomentar la especulación a corto plazo."
      ],
      correct_option_index: 0,
      explanation: "El módulo 1 busca que el alumno domine el análisis fundamental profesional y lo aplique con criterio en la selección de activos."
    }
  ],
  2: [
    {
      id: "ei-m2-q1",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Cuál es el objetivo principal de invertir en empresas que pagan dividendos?",
      options: [
        "Obtener flujo estable y creciente a largo plazo.",
        "Ganar solo por apreciación de precio.",
        "Evitar la diversificación.",
        "Invertir solo en empresas tecnológicas."
      ],
      correct_option_index: 0,
      explanation: "El enfoque en dividendos prioriza flujo estable, previsibilidad y compounding mediante reinversión."
    },
    {
      id: "ei-m2-q2",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Qué representa el 'yield on cost' en una estrategia de dividendos?",
      options: [
        "El rendimiento sobre el precio de compra histórico, mostrando el efecto del tiempo en carteras de largo plazo.",
        "El rendimiento actual sobre el precio de mercado.",
        "El crecimiento de ventas.",
        "El valor de mercado de la empresa."
      ],
      correct_option_index: 0,
      explanation: "El yield on cost mide el rendimiento sobre el precio de compra original, clave en estrategias de largo plazo."
    },
    {
      id: "ei-m2-q3",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Cuál es la función del payout ratio en la estrategia de dividendos?",
      options: [
        "Indicar qué porcentaje de las ganancias se distribuye en dividendos y medir la sostenibilidad del pago.",
        "Medir el crecimiento de ventas.",
        "Determinar el valor de mercado.",
        "Calcular el PER."
      ],
      correct_option_index: 0,
      explanation: "El payout ratio muestra qué tan apretada está la empresa para pagar dividendos y su sostenibilidad."
    },
    {
      id: "ei-m2-q4",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Por qué es importante el historial de pago de dividendos en una empresa?",
      options: [
        "Porque indica previsibilidad y calidad del flujo a largo plazo.",
        "Porque garantiza ganancias.",
        "Porque lo exige la CNV.",
        "Porque es obligatorio por ley."
      ],
      correct_option_index: 0,
      explanation: "Un historial largo de pago y crecimiento de dividendos es señal de calidad y previsibilidad."
    },
    {
      id: "ei-m2-q5",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Qué es un REIT y cuál es su principal ventaja?",
      options: [
        "Un fondo inmobiliario cotizado que permite invertir en real estate y recibir dividendos altos por estructura regulatoria.",
        "Un ETF de tecnología.",
        "Un ratio de rentabilidad.",
        "Un método de análisis técnico."
      ],
      correct_option_index: 0,
      explanation: "Los REITs permiten invertir en real estate sin comprar propiedades físicas y distribuyen dividendos altos."
    },
    {
      id: "ei-m2-q6",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Por qué el FFO es la métrica central para analizar REITs?",
      options: [
        "Porque ajusta distorsiones contables y muestra el flujo económico real disponible para dividendos.",
        "Porque mide el PER.",
        "Porque solo aplica a bancos.",
        "Porque depende de la inflación."
      ],
      correct_option_index: 0,
      explanation: "El FFO es más útil que la ganancia neta tradicional para analizar la capacidad real de pago de dividendos en REITs."
    },
    {
      id: "ei-m2-q7",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Qué riesgo principal tienen los REITs?",
      options: [
        "Son sensibles a tasas de interés, vacancia, refinanciación de deuda y ciclo económico.",
        "No tienen ningún riesgo.",
        "Solo invierten en tecnología.",
        "Garantizan ganancias."
      ],
      correct_option_index: 0,
      explanation: "Los REITs pueden verse afectados por tasas, vacancia y ciclos económicos adversos."
    },
    {
      id: "ei-m2-q8",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Qué es un ETF y cuál es su principal función en una cartera?",
      options: [
        "Un fondo cotizado que replica índices, sectores o estrategias y permite diversificar con una sola posición.",
        "Un ratio de rentabilidad.",
        "Un método de análisis técnico.",
        "Un tipo de dividendo."
      ],
      correct_option_index: 0,
      explanation: "Los ETFs permiten diversificar de forma eficiente y con bajo costo."
    },
    {
      id: "ei-m2-q9",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Por qué es importante el TER (Total Expense Ratio) en un ETF?",
      options: [
        "Porque el costo compuesto a lo largo de los años impacta fuertemente en el patrimonio final.",
        "Porque mide el crecimiento de ventas.",
        "Porque determina el valor de mercado.",
        "Porque calcula el PER."
      ],
      correct_option_index: 0,
      explanation: "El TER bajo es clave para maximizar el rendimiento neto a largo plazo."
    },
    {
      id: "ei-m2-q10",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Qué es el 'yield trampa' en dividendos?",
      options: [
        "Un yield alto sin crecimiento, sin caja y con payout extremo que suele anticipar recorte de dividendo.",
        "Un yield bajo pero sostenible.",
        "Un método de análisis técnico.",
        "Un tipo de ETF."
      ],
      correct_option_index: 0,
      explanation: "El yield trampa suele anticipar problemas financieros y recortes de dividendo."
    },
    {
      id: "ei-m2-q11",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Por qué conviene combinar dividendos, REITs y ETFs en una cartera?",
      options: [
        "Para diversificar fuentes de ingreso, suavizar el flujo y reducir riesgos específicos.",
        "Para maximizar el riesgo.",
        "Para evitar la diversificación.",
        "Para invertir solo en tecnología."
      ],
      correct_option_index: 0,
      explanation: "La combinación permite construir una cartera más robusta y resiliente."
    },
    {
      id: "ei-m2-q12",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Qué es el 'payout ratio' saludable para una empresa madura?",
      options: [
        "Entre 30% y 60%.",
        "0%-10%.",
        "Más de 90% siempre.",
        "Menos de 10%."
      ],
      correct_option_index: 0,
      explanation: "Un payout ratio entre 30% y 60% suele ser saludable para empresas maduras."
    },
    {
      id: "ei-m2-q13",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Qué es un Dividend Aristocrat?",
      options: [
        "Una empresa que aumentó su dividendo al menos 25 años consecutivos.",
        "Una empresa con yield alto.",
        "Un ETF de tecnología.",
        "Un método de análisis técnico."
      ],
      correct_option_index: 0,
      explanation: "Los Dividend Aristocrats tienen un historial probado de crecimiento de dividendos."
    },
    {
      id: "ei-m2-q14",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Por qué es importante el FCF (Free Cash Flow) en la estrategia de dividendos?",
      options: [
        "Porque el dividendo debe estar cubierto por caja real, no solo por utilidad contable.",
        "Porque mide el PER.",
        "Porque solo aplica a bancos.",
        "Porque depende de la inflación."
      ],
      correct_option_index: 0,
      explanation: "El FCF es la base real para el pago sostenible de dividendos."
    },
    {
      id: "ei-m2-q15",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Qué es un ETF apalancado y por qué es riesgoso?",
      options: [
        "Un ETF que multiplica por 2 o 3 los movimientos del índice, aumentando tanto el potencial de ganancia como el riesgo de grandes caídas.",
        "Un ETF de bajo costo.",
        "Un método de análisis técnico.",
        "Un tipo de dividendo."
      ],
      correct_option_index: 0,
      explanation: "Los ETFs apalancados pueden multiplicar las pérdidas y no son recomendados para largo plazo."
    },
    {
      id: "ei-m2-q16",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Qué es el P/FFO y para qué se usa en REITs?",
      options: [
        "Es el múltiplo precio sobre FFO, útil para comparar valuación relativa entre REITs.",
        "Un ratio de liquidez.",
        "Un método de análisis técnico.",
        "Un tipo de dividendo."
      ],
      correct_option_index: 0,
      explanation: "El P/FFO es el múltiplo correcto para comparar REITs, no el PER tradicional."
    },
    {
      id: "ei-m2-q17",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Por qué es importante comparar REITs dentro del mismo subsector?",
      options: [
        "Porque los múltiplos y riesgos varían mucho entre tipos de REITs y solo son comparables entre pares.",
        "Porque es obligatorio por ley.",
        "Porque lo exige la CNV.",
        "Porque garantiza ganancias."
      ],
      correct_option_index: 0,
      explanation: "Comparar dentro del mismo subsector permite evaluar correctamente múltiplos y riesgos."
    },
    {
      id: "ei-m2-q18",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Qué es el 'dividend growth rate'?",
      options: [
        "El ritmo de crecimiento anual del dividendo, idealmente superior a la inflación.",
        "El crecimiento de ventas.",
        "El valor de mercado de la empresa.",
        "El PER."
      ],
      correct_option_index: 0,
      explanation: "El dividend growth rate mide la capacidad de una empresa para aumentar el pago a lo largo del tiempo."
    },
    {
      id: "ei-m2-q19",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Por qué es clave la calidad del dividendo?",
      options: [
        "Porque un dividendo insostenible puede ser recortado y afectar tanto el flujo como el precio de la acción.",
        "Porque garantiza ganancias.",
        "Porque lo exige la CNV.",
        "Porque es obligatorio por ley."
      ],
      correct_option_index: 0,
      explanation: "La calidad del dividendo protege de recortes y caídas de precio inesperadas."
    },
    {
      id: "ei-m2-q20",
      course_slug: "expert-investment",
      module_number: 2,
      question_text: "¿Cuál es la función principal del módulo 2 de Expert Investment?",
      options: [
        "Profundizar en dividendos, REITs y ETFs como herramientas de flujo pasivo y diversificación inteligente.",
        "Explicar cómo operar futuros.",
        "Desarrollar estrategias de trading algorítmico.",
        "Fomentar la especulación a corto plazo."
      ],
      correct_option_index: 0,
      explanation: "El módulo 2 busca que el alumno domine el uso de dividendos, REITs y ETFs para construir carteras robustas y diversificadas."
    }
  ],
  3: [
    {
      id: "ei-m3-q1",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Qué es el WACC y por qué es importante en valuación?",
      options: [
        "El costo promedio ponderado de capital, clave para descontar flujos en un DCF y estimar el valor real de una empresa.",
        "Un ratio de liquidez.",
        "Un método de análisis técnico.",
        "Un tipo de dividendo."
      ],
      correct_option_index: 0,
      explanation: "El WACC es la tasa que se usa para descontar flujos futuros y calcular el valor presente de una empresa."
    },
    {
      id: "ei-m3-q2",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Qué mide el ROIC y por qué es central en el análisis avanzado?",
      options: [
        "El retorno sobre el capital invertido, clave para medir la eficiencia real del negocio más allá de la estructura contable.",
        "El crecimiento de ventas.",
        "El valor de mercado de la empresa.",
        "El PER."
      ],
      correct_option_index: 0,
      explanation: "El ROIC mide cuánto rinde cada dólar invertido en el negocio, sin importar de dónde salió ese dólar."
    },
    {
      id: "ei-m3-q3",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Qué es el MOAT y cómo impacta en la valuación?",
      options: [
        "La ventaja competitiva sostenible de una empresa, que le permite mantener márgenes y crecimiento por encima de la media.",
        "Un ratio de liquidez.",
        "Un método de análisis técnico.",
        "Un tipo de dividendo."
      ],
      correct_option_index: 0,
      explanation: "El MOAT protege a la empresa de la competencia y justifica valuaciones premium."
    },
    {
      id: "ei-m3-q4",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Por qué es importante analizar la tendencia histórica de los ratios financieros?",
      options: [
        "Porque permite detectar mejoras o deterioros estructurales y comparar contra pares del sector.",
        "Porque garantiza ganancias.",
        "Porque lo exige la CNV.",
        "Porque es obligatorio por ley."
      ],
      correct_option_index: 0,
      explanation: "La tendencia histórica muestra si la empresa mejora o empeora y cómo se compara con sus competidores."
    },
    {
      id: "ei-m3-q5",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Qué es el DCF y para qué tipo de empresas es más útil?",
      options: [
        "El descuento de flujos de caja futuros, ideal para empresas con flujos previsibles y estables.",
        "Un ratio de liquidez.",
        "Un método de análisis técnico.",
        "Un tipo de dividendo."
      ],
      correct_option_index: 0,
      explanation: "El DCF es el método más profundo para valuar empresas con flujos de caja estables."
    },
    {
      id: "ei-m3-q6",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Por qué es clave usar más de un método de valuación?",
      options: [
        "Para reducir el error de análisis y validar la tesis con diferentes enfoques.",
        "Porque garantiza ganancias.",
        "Porque lo exige la CNV.",
        "Porque es obligatorio por ley."
      ],
      correct_option_index: 0,
      explanation: "Usar dos métodos distintos y comparar resultados da mayor fundamento a la valuación."
    },
    {
      id: "ei-m3-q7",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Qué método de valuación es más adecuado para bancos y aseguradoras?",
      options: [
        "P/B (Price-to-Book) y ROE, porque el negocio se mide por patrimonio y no por flujos operativos.",
        "DCF clásico.",
        "Múltiplos de ventas.",
        "PER."
      ],
      correct_option_index: 0,
      explanation: "Para bancos y aseguradoras, el P/B y el ROE son los ratios clave."
    },
    {
      id: "ei-m3-q8",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Por qué es riesgoso usar múltiplos sobre ganancias en empresas cíclicas en el pico del ciclo?",
      options: [
        "Porque el P/E bajo puede ser una trampa de valor si las ganancias están en su máximo histórico.",
        "Porque garantiza ganancias.",
        "Porque lo exige la CNV.",
        "Porque es obligatorio por ley."
      ],
      correct_option_index: 0,
      explanation: "En cíclicas, el P/E bajo en el pico puede ocultar riesgos de caída de ganancias."
    },
    {
      id: "ei-m3-q9",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Qué es el valor contable ajustado y para qué tipo de empresas es más útil?",
      options: [
        "La valuación basada en activos tangibles, útil para real estate, bancos e industrias pesadas.",
        "Un ratio de liquidez.",
        "Un método de análisis técnico.",
        "Un tipo de dividendo."
      ],
      correct_option_index: 0,
      explanation: "El valor contable ajustado es clave en empresas con activos físicos relevantes."
    },
    {
      id: "ei-m3-q10",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Qué es un 'compounder' y por qué es valioso?",
      options: [
        "Una empresa que logra sostener crecimiento y rentabilidad por décadas, generando riqueza acumulada.",
        "Un ratio de liquidez.",
        "Un método de análisis técnico.",
        "Un tipo de dividendo."
      ],
      correct_option_index: 0,
      explanation: "Los compounders son raros y valiosos porque componen capital a largo plazo."
    },
    {
      id: "ei-m3-q11",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Por qué es importante analizar el Capex en empresas de crecimiento?",
      options: [
        "Porque un Capex alto en crecimiento es sano, pero alto solo para mantenerse puede ser señal de alerta.",
        "Porque garantiza ganancias.",
        "Porque lo exige la CNV.",
        "Porque es obligatorio por ley."
      ],
      correct_option_index: 0,
      explanation: "El Capex debe analizarse en contexto: crecimiento vs. mantenimiento."
    },
    {
      id: "ei-m3-q12",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Qué es el 'earnings guidance' y por qué importa?",
      options: [
        "La proyección oficial de resultados futuros que da la empresa, clave para expectativas del mercado.",
        "Un ratio de liquidez.",
        "Un método de análisis técnico.",
        "Un tipo de dividendo."
      ],
      correct_option_index: 0,
      explanation: "El guidance orienta las expectativas y puede impactar fuerte en el precio si se ajusta."
    },
    {
      id: "ei-m3-q13",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Por qué es importante el análisis de riesgos en la valuación profesional?",
      options: [
        "Porque permite anticipar escenarios adversos y definir márgenes de seguridad adecuados.",
        "Porque garantiza ganancias.",
        "Porque lo exige la CNV.",
        "Porque es obligatorio por ley."
      ],
      correct_option_index: 0,
      explanation: "El análisis de riesgos es clave para proteger el capital y ajustar la valuación."
    },
    {
      id: "ei-m3-q14",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Qué es el scoring profesional y cómo se usa en la toma de decisiones?",
      options: [
        "Un sistema de puntaje objetivo para comparar oportunidades y filtrar emociones.",
        "Un ratio de liquidez.",
        "Un método de análisis técnico.",
        "Un tipo de dividendo."
      ],
      correct_option_index: 0,
      explanation: "El scoring profesional sistematiza la comparación y protege de sesgos emocionales."
    },
    {
      id: "ei-m3-q15",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Por qué es clave definir condiciones de salida en una tesis de inversión?",
      options: [
        "Para evitar decisiones impulsivas y tener un plan claro ante cambios de escenario.",
        "Porque garantiza ganancias.",
        "Porque lo exige la CNV.",
        "Porque es obligatorio por ley."
      ],
      correct_option_index: 0,
      explanation: "Definir condiciones de salida protege de la emocionalidad y de cambios bruscos de contexto."
    },
    {
      id: "ei-m3-q16",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Qué es una 'red flag' estructural en empresas maduras?",
      options: [
        "Deterioro sostenido de márgenes, caja o deuda creciente sin mejora operativa.",
        "Un ratio de liquidez.",
        "Un método de análisis técnico.",
        "Un tipo de dividendo."
      ],
      correct_option_index: 0,
      explanation: "Las red flags estructurales anticipan problemas serios en empresas maduras."
    },
    {
      id: "ei-m3-q17",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Por qué es importante el análisis sectorial en la valuación avanzada?",
      options: [
        "Porque los múltiplos y riesgos varían mucho entre sectores y solo son comparables entre pares.",
        "Porque garantiza ganancias.",
        "Porque lo exige la CNV.",
        "Porque es obligatorio por ley."
      ],
      correct_option_index: 0,
      explanation: "El análisis sectorial permite comparar correctamente múltiplos y riesgos."
    },
    {
      id: "ei-m3-q18",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Qué es el 'earnings normalization' en empresas cíclicas?",
      options: [
        "El ajuste de ganancias para reflejar un ciclo completo y evitar trampas de valor en picos o valles.",
        "Un ratio de liquidez.",
        "Un método de análisis técnico.",
        "Un tipo de dividendo."
      ],
      correct_option_index: 0,
      explanation: "La normalización de ganancias evita errores de valuación en empresas cíclicas."
    },
    {
      id: "ei-m3-q19",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Por qué es importante la disciplina en el proceso de análisis profesional?",
      options: [
        "Porque la consistencia en el proceso es lo que construye patrimonio a largo plazo.",
        "Porque garantiza ganancias.",
        "Porque lo exige la CNV.",
        "Porque es obligatorio por ley."
      ],
      correct_option_index: 0,
      explanation: "La disciplina y la repetición sistemática del proceso son la base del éxito a largo plazo."
    },
    {
      id: "ei-m3-q20",
      course_slug: "expert-investment",
      module_number: 3,
      question_text: "¿Cuál es la función principal del módulo 3 de Expert Investment?",
      options: [
        "Profundizar en el análisis fundamental avanzado: WACC, ROIC, MOAT, métodos de valuación y gestión de riesgos.",
        "Explicar cómo operar futuros.",
        "Desarrollar estrategias de trading algorítmico.",
        "Fomentar la especulación a corto plazo."
      ],
      correct_option_index: 0,
      explanation: "El módulo 3 busca que el alumno domine el análisis fundamental avanzado y la gestión profesional de riesgos."
    }
  ],
  4: [
    {
      id: "ei-m4-q1",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Cuál es el objetivo principal de la gestión activa de portafolios?",
      options: [
        "Superar el rendimiento del mercado mediante selección y timing.",
        "Replicar un índice sin cambios.",
        "Evitar cualquier tipo de rebalanceo.",
        "Invertir solo en bonos del Estado."
      ],
      correct_option_index: 0,
      explanation: "La gestión activa busca superar al mercado mediante decisiones activas de selección y timing."
    },
    {
      id: "ei-m4-q2",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Qué caracteriza a la gestión pasiva?",
      options: [
        "Replica un índice de mercado, minimizando costos y rotación.",
        "Busca superar el mercado con análisis técnico.",
        "Opera solo en mercados emergentes.",
        "Evita la diversificación."
      ],
      correct_option_index: 0,
      explanation: "La gestión pasiva replica índices y minimiza costos, sin buscar superar al mercado."
    },
    {
      id: "ei-m4-q3",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Por qué es importante el rebalanceo periódico de una cartera?",
      options: [
        "Permite mantener el perfil de riesgo y aprovechar oportunidades de mercado.",
        "Solo aumenta los costos.",
        "No tiene ningún impacto.",
        "Es obligatorio por ley."
      ],
      correct_option_index: 0,
      explanation: "El rebalanceo mantiene el riesgo bajo control y puede mejorar el rendimiento ajustado por riesgo."
    },
    {
      id: "ei-m4-q4",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Qué es el asset allocation?",
      options: [
        "La distribución estratégica de activos entre distintas clases para optimizar riesgo y retorno.",
        "La compra de solo un tipo de activo.",
        "El análisis técnico de acciones.",
        "La selección de bonos corporativos únicamente."
      ],
      correct_option_index: 0,
      explanation: "El asset allocation es la decisión más importante en la construcción de carteras diversificadas."
    },
    {
      id: "ei-m4-q5",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Por qué es clave la diversificación internacional?",
      options: [
        "Reduce riesgos específicos de un país y amplía el universo de oportunidades.",
        "Aumenta el riesgo de la cartera.",
        "Solo sirve para grandes patrimonios.",
        "No tiene impacto en el rendimiento."
      ],
      correct_option_index: 0,
      explanation: "Diversificar internacionalmente reduce riesgos y mejora el perfil de retorno."
    },
    {
      id: "ei-m4-q6",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Qué es el riesgo sistemático?",
      options: [
        "El riesgo que afecta a todo el mercado y no se puede eliminar con diversificación.",
        "El riesgo propio de una empresa.",
        "El riesgo de liquidez.",
        "El riesgo de crédito."
      ],
      correct_option_index: 0,
      explanation: "El riesgo sistemático es inherente al mercado y no se elimina diversificando."
    },
    {
      id: "ei-m4-q7",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Qué es el riesgo no sistemático?",
      options: [
        "El riesgo específico de una empresa o sector, que sí puede reducirse diversificando.",
        "El riesgo de inflación.",
        "El riesgo de tasas de interés.",
        "El riesgo país."
      ],
      correct_option_index: 0,
      explanation: "El riesgo no sistemático se reduce diversificando entre empresas y sectores."
    },
    {
      id: "ei-m4-q8",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Por qué es importante el control de costos en la gestión de portafolios?",
      options: [
        "Porque los costos compuestos a lo largo del tiempo pueden erosionar significativamente el rendimiento.",
        "Porque no tiene impacto en el resultado.",
        "Solo importa en carteras grandes.",
        "Es irrelevante para el inversor minorista."
      ],
      correct_option_index: 0,
      explanation: "Minimizar costos es clave para maximizar el rendimiento neto a largo plazo."
    },
    {
      id: "ei-m4-q9",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Qué es el tracking error en gestión pasiva?",
      options: [
        "La diferencia entre el rendimiento del fondo y el índice que replica.",
        "El error de análisis fundamental.",
        "La volatilidad de una acción.",
        "El costo de transacción."
      ],
      correct_option_index: 0,
      explanation: "El tracking error mide la precisión con la que un fondo replica su índice de referencia."
    },
    {
      id: "ei-m4-q10",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Por qué es importante definir objetivos claros antes de invertir?",
      options: [
        "Porque los objetivos guían la estrategia, el horizonte y el nivel de riesgo aceptable.",
        "No tiene impacto en la estrategia.",
        "Solo importa para grandes inversores.",
        "Es irrelevante para el inversor minorista."
      ],
      correct_option_index: 0,
      explanation: "Definir objetivos permite construir una cartera alineada con las necesidades y tolerancia al riesgo."
    },
    {
      id: "ei-m4-q11",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Qué es el rebalanceo táctico?",
      options: [
        "Ajustar la cartera en función de oportunidades coyunturales o cambios de escenario.",
        "Rebalancear solo una vez al año.",
        "Evitar cualquier cambio en la cartera.",
        "Invertir solo en renta fija."
      ],
      correct_option_index: 0,
      explanation: "El rebalanceo táctico busca aprovechar oportunidades de corto plazo o cambios de contexto."
    },
    {
      id: "ei-m4-q12",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Por qué es clave la liquidez en la construcción de portafolios?",
      options: [
        "Permite afrontar imprevistos y aprovechar oportunidades sin vender activos a pérdida.",
        "No tiene impacto en la estrategia.",
        "Solo importa para grandes inversores.",
        "Es irrelevante para el inversor minorista."
      ],
      correct_option_index: 0,
      explanation: "La liquidez otorga flexibilidad y protección ante emergencias o cambios de escenario."
    },
    {
      id: "ei-m4-q13",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Qué es el sesgo de home bias?",
      options: [
        "La tendencia a invertir desproporcionadamente en activos del propio país, ignorando oportunidades globales.",
        "El sesgo hacia activos de renta fija.",
        "La preferencia por activos ilíquidos.",
        "El sesgo hacia empresas tecnológicas."
      ],
      correct_option_index: 0,
      explanation: "El home bias limita la diversificación y puede aumentar el riesgo innecesariamente."
    },
    {
      id: "ei-m4-q14",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Por qué es importante la disciplina en la gestión de portafolios?",
      options: [
        "Porque la disciplina permite sostener la estrategia y evitar decisiones impulsivas ante volatilidad o ruido de mercado.",
        "No tiene impacto en el resultado.",
        "Solo importa en carteras grandes.",
        "Es irrelevante para el inversor minorista."
      ],
      correct_option_index: 0,
      explanation: "La disciplina es la base para sostener el rumbo y evitar errores costosos."
    },
    {
      id: "ei-m4-q15",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Qué es el glide path en la gestión de portafolios?",
      options: [
        "La estrategia de ir reduciendo el riesgo a medida que se acerca el objetivo o retiro.",
        "Aumentar el riesgo con el tiempo.",
        "Mantener siempre la misma asignación.",
        "Invertir solo en renta variable."
      ],
      correct_option_index: 0,
      explanation: "El glide path ajusta la asignación de activos para proteger el capital cerca del objetivo."
    },
    {
      id: "ei-m4-q16",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Por qué es importante el horizonte temporal en la construcción de carteras?",
      options: [
        "Define la estrategia, el nivel de riesgo aceptable y la selección de activos.",
        "No tiene impacto en la estrategia.",
        "Solo importa para grandes inversores.",
        "Es irrelevante para el inversor minorista."
      ],
      correct_option_index: 0,
      explanation: "El horizonte temporal determina la estrategia y la tolerancia al riesgo."
    },
    {
      id: "ei-m4-q17",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Qué es el drawdown y por qué debe monitorearse?",
      options: [
        "La caída máxima desde un pico hasta un valle, clave para medir el riesgo real de una cartera.",
        "El crecimiento de ventas.",
        "El valor de mercado de la empresa.",
        "El PER."
      ],
      correct_option_index: 0,
      explanation: "El drawdown mide la pérdida máxima y ayuda a ajustar la tolerancia al riesgo."
    },
    {
      id: "ei-m4-q18",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Por qué es clave la revisión periódica de la estrategia de portafolio?",
      options: [
        "Permite ajustar la cartera ante cambios de contexto, objetivos o tolerancia al riesgo.",
        "No tiene impacto en la estrategia.",
        "Solo importa para grandes inversores.",
        "Es irrelevante para el inversor minorista."
      ],
      correct_option_index: 0,
      explanation: "Revisar la estrategia permite mantener la cartera alineada con los objetivos y el contexto."
    },
    {
      id: "ei-m4-q19",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Qué es el sesgo de recency bias y cómo puede afectar la gestión de portafolios?",
      options: [
        "La tendencia a sobrevalorar eventos recientes y tomar decisiones impulsivas, ignorando el largo plazo.",
        "El sesgo hacia activos de renta fija.",
        "La preferencia por activos ilíquidos.",
        "El sesgo hacia empresas tecnológicas."
      ],
      correct_option_index: 0,
      explanation: "El recency bias puede llevar a errores de timing y desvíos de la estrategia."
    },
    {
      id: "ei-m4-q20",
      course_slug: "expert-investment",
      module_number: 4,
      question_text: "¿Cuál es la función principal del módulo 4 de Expert Investment?",
      options: [
        "Dominar la gestión profesional de portafolios: asset allocation, rebalanceo, control de riesgos y disciplina inversora.",
        "Explicar cómo operar futuros.",
        "Desarrollar estrategias de trading algorítmico.",
        "Fomentar la especulación a corto plazo."
      ],
      correct_option_index: 0,
      explanation: "El módulo 4 busca que el alumno domine la gestión profesional de portafolios y la disciplina inversora."
    }
  ]
};
