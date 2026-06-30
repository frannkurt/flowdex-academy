// Preguntas de examen para Kickstart Investment
// Módulo 1 — Mercados
// Formato: Array de ExamQuestionRaw[] por módulo
import type { ExamQuestionRaw } from "@/lib/exams/types"

export const kickstartInvestmentQuestions: Record<number, ExamQuestionRaw[]> = {
  1: [
    {
      id: "ki-m1-q1",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Cuál es el objetivo principal de la Apertura Estratégica antes de invertir?",
      options: [
        "Aprender a operar futuros y derivados complejos.",
        "Construir una base sólida de finanzas personales, colchón de emergencia y mentalidad antes de entrar a los mercados.",
        "Memorizar todos los términos técnicos del mercado.",
        "Obtener rendimientos rápidos en el menor tiempo posible."
      ],
      correct_option_index: 1,
      explanation: "La Apertura Estratégica busca que el alumno tenga orden financiero, control de deudas y mentalidad adecuada antes de invertir, para evitar que los mercados multipliquen problemas."
    },
    {
      id: "ki-m1-q2",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Qué representa el concepto de ‘colchón de emergencia’?",
      options: [
        "Un fondo para invertir en oportunidades de corto plazo.",
        "Una reserva de dinero destinada exclusivamente a cubrir imprevistos y evitar liquidar inversiones en mal momento.",
        "Un seguro de vida obligatorio para inversores.",
        "Un préstamo bancario para emergencias."
      ],
      correct_option_index: 1,
      explanation: "El colchón de emergencia es una reserva líquida y segura para afrontar imprevistos sin afectar inversiones ni endeudarse."
    },
    {
      id: "ki-m1-q3",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Cuál es la diferencia clave entre ingresos activos y pasivos?",
      options: [
        "Los ingresos activos provienen de inversiones, los pasivos de gastos.",
        "Los ingresos activos requieren trabajo directo y los pasivos se generan sin intervención constante.",
        "Los ingresos pasivos son ilegales.",
        "No existe diferencia, ambos son lo mismo."
      ],
      correct_option_index: 1,
      explanation: "Los ingresos activos dependen del trabajo (sueldo, honorarios), los pasivos (alquileres, dividendos) no requieren trabajo constante."
    },
    {
      id: "ki-m1-q4",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Qué indica el ratio gasto/ingreso en finanzas personales?",
      options: [
        "El porcentaje de ingresos que se ahorra cada mes.",
        "El porcentaje de lo que ganás que estás consumiendo; si supera el 80%, el margen de ahorro es crítico.",
        "El nivel de endeudamiento permitido.",
        "El monto máximo para invertir en acciones."
      ],
      correct_option_index: 1,
      explanation: "El ratio gasto/ingreso muestra qué parte de tus ingresos se consume; un valor alto indica poco margen para ahorrar o invertir."
    },
    {
      id: "ki-m1-q5",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Cuál es la regla fundamental sobre el ahorro según el módulo?",
      options: [
        "Ahorrar solo si sobra dinero a fin de mes.",
        "Primero se ahorra, después se gasta.",
        "Ahorrar es innecesario si se invierte bien.",
        "El ahorro debe ser siempre en dólares."
      ],
      correct_option_index: 1,
      explanation: "El ahorro debe ser una prioridad y automatizarse antes de gastar, no depender de lo que sobre."
    },
    {
      id: "ki-m1-q6",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Qué caracteriza a una ‘deuda buena’?",
      options: [
        "Financia consumos sin retorno.",
        "Genera valor o ingresos, como educación o herramientas de trabajo.",
        "Tiene tasas de interés muy altas.",
        "Es siempre en moneda extranjera."
      ],
      correct_option_index: 1,
      explanation: "La deuda buena se usa para adquirir activos que generan ingresos o valor, no para consumo."
    },
    {
      id: "ki-m1-q7",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Qué es la tasa de rendimiento?",
      options: [
        "El monto total invertido en un año.",
        "El porcentaje que crece o decrece tu dinero en un período de tiempo.",
        "El interés que cobra el banco por un préstamo.",
        "El valor nominal de una acción."
      ],
      correct_option_index: 1,
      explanation: "La tasa de rendimiento mide el crecimiento porcentual del capital en un período determinado."
    },
    {
      id: "ki-m1-q8",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Por qué es importante distinguir entre tasa nominal y tasa real?",
      options: [
        "Porque la tasa nominal siempre es mayor.",
        "Porque la tasa real descuenta la inflación y muestra el crecimiento efectivo del poder de compra.",
        "Porque la tasa real solo aplica a plazos fijos.",
        "Porque la tasa nominal no existe en Argentina."
      ],
      correct_option_index: 1,
      explanation: "La tasa real refleja el crecimiento descontando inflación, mostrando el verdadero avance financiero."
    },
    {
      id: "ki-m1-q9",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Cuál es el factor más determinante en el interés compuesto?",
      options: [
        "El monto inicial.",
        "El tiempo.",
        "El tipo de activo.",
        "El país donde se invierte."
      ],
      correct_option_index: 1,
      explanation: "El tiempo es el factor clave: cuanto antes se empieza, mayor es el efecto del interés compuesto."
    },
    {
      id: "ki-m1-q10",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Por qué es fundamental separar el colchón de emergencia del capital de inversión?",
      options: [
        "Para poder invertirlo en oportunidades de alto riesgo.",
        "Para evitar usarlo en gastos corrientes y asegurar liquidez ante imprevistos.",
        "Porque el banco lo exige.",
        "Para obtener mejores tasas de interés."
      ],
      correct_option_index: 1,
      explanation: "El colchón debe estar separado para no tentarse a usarlo y tener liquidez inmediata ante emergencias."
    },
    {
      id: "ki-m1-q11",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Qué actitud mental diferencia al inversor que dura del que se quema rápido?",
      options: [
        "Buscar rendimientos extraordinarios en poco tiempo.",
        "Aprender un proceso, aplicarlo con paciencia y no abandonar el plan ante caídas.",
        "Cambiar de estrategia ante cada noticia.",
        "Operar solo por intuición."
      ],
      correct_option_index: 1,
      explanation: "La paciencia, el proceso y la disciplina son claves para sostenerse en el tiempo."
    },
    {
      id: "ki-m1-q12",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Qué significa ‘drawdown’ en el contexto de inversiones?",
      options: [
        "El monto total invertido en acciones.",
        "La caída desde el máximo histórico de tu cartera.",
        "El interés que paga un bono.",
        "El costo de operar en el mercado."
      ],
      correct_option_index: 1,
      explanation: "El drawdown mide la caída máxima desde el pico de valor de la cartera, clave para evaluar tolerancia al riesgo."
    },
    {
      id: "ki-m1-q13",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Cuál es el error más común al estimar el propio perfil de riesgo?",
      options: [
        "Subestimar la importancia de la diversificación.",
        "Sobreestimarse en mercados alcistas y volverse conservador en caídas.",
        "No invertir en renta fija.",
        "No usar apalancamiento."
      ],
      correct_option_index: 1,
      explanation: "Muchos creen ser agresivos cuando todo sube, pero no toleran caídas fuertes y cambian su perfil real."
    },
    {
      id: "ki-m1-q14",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Qué es la diversificación en una cartera de inversiones?",
      options: [
        "Comprar solo acciones tecnológicas.",
        "Distribuir el capital en distintos activos, sectores y geografías para reducir el riesgo específico.",
        "Invertir todo en un solo activo seguro.",
        "Cambiar de estrategia cada mes."
      ],
      correct_option_index: 1,
      explanation: "Diversificar es repartir el riesgo para evitar que una sola mala decisión afecte todo el patrimonio."
    },
    {
      id: "ki-m1-q15",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Qué función cumple el ‘rebalanceo’ en una cartera?",
      options: [
        "Aumentar la exposición a activos de moda.",
        "Volver a las proporciones objetivo vendiendo lo sobreponderado y reforzando lo rezagado.",
        "Vender todo ante la primera caída.",
        "Comprar solo cuando hay euforia."
      ],
      correct_option_index: 1,
      explanation: "El rebalanceo mantiene la estrategia y el riesgo bajo control, ajustando la cartera periódicamente."
    },
    {
      id: "ki-m1-q16",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Por qué conviene especializarse en uno o dos mercados al principio?",
      options: [
        "Porque operar todos los mercados es ilegal.",
        "Porque cada mercado tiene su lógica, riesgo y herramientas, y es mejor dominar pocos que dispersarse.",
        "Porque los brokers lo exigen.",
        "Porque así se obtienen rendimientos garantizados."
      ],
      correct_option_index: 1,
      explanation: "Es más efectivo conocer bien pocos mercados que intentar operar todos superficialmente."
    },
    {
      id: "ki-m1-q17",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Qué es el ‘spread’ en el mercado Forex?",
      options: [
        "El horario de operación del mercado.",
        "La diferencia entre el precio de compra (ask) y el de venta (bid), que representa el costo real de operar.",
        "El monto mínimo para operar.",
        "El tipo de cambio oficial."
      ],
      correct_option_index: 1,
      explanation: "El spread es el costo oculto de cada operación, clave en mercados líquidos y exóticos."
    },
    {
      id: "ki-m1-q18",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Qué caracteriza a las acciones como instrumento de inversión?",
      options: [
        "Son préstamos al Estado.",
        "Representan una fracción de propiedad de una empresa y permiten participar de sus ganancias y patrimonio.",
        "Son instrumentos de renta fija.",
        "No generan ningún tipo de ingreso."
      ],
      correct_option_index: 1,
      explanation: "Las acciones otorgan derechos sobre la empresa y su evolución económica."
    },
    {
      id: "ki-m1-q19",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Por qué es importante la mentalidad del inversor según el módulo?",
      options: [
        "Porque determina la capacidad de sostener el plan ante volatilidad y caídas, más allá de la técnica.",
        "Porque permite adivinar el mercado.",
        "Porque evita la necesidad de diversificar.",
        "Porque garantiza rendimientos altos."
      ],
      correct_option_index: 0,
      explanation: "La mentalidad y la paciencia son más importantes que la técnica para sostenerse en el tiempo."
    },
    {
      id: "ki-m1-q20",
      course_slug: "kickstart-investment",
      module_number: 1,
      question_text: "¿Cuál es la función principal del módulo ‘Mercados’ en Kickstart Investment?",
      options: [
        "Enseñar a operar con apalancamiento extremo.",
        "Presentar los seis grandes mercados donde se mueve el capital del mundo y sus características.",
        "Explicar cómo obtener rendimientos garantizados.",
        "Fomentar la especulación a corto plazo."
      ],
      correct_option_index: 1,
      explanation: "El módulo busca que el alumno conozca los mercados principales y entienda sus diferencias para invertir con criterio."
    }
  ],
 2: [
    {
      id: "ki-m2-q1",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Cuál es la diferencia fundamental entre invertir y especular?",
      options: [
        "Invertir busca ganancias rápidas; especular, crecimiento a largo plazo.",
        "Invertir implica análisis y objetivos claros; especular es buscar ganancias rápidas sin fundamentos sólidos.",
        "Especular requiere más capital que invertir.",
        "No existe diferencia, ambos conceptos son equivalentes."
      ],
      correct_option_index: 1,
      explanation: "Invertir se basa en análisis, objetivos y horizonte de largo plazo; especular es buscar ganancias rápidas sin fundamentos sólidos."
    },
    {
      id: "ki-m2-q2",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Qué pregunta clave debe hacerse antes de elegir un instrumento de inversión?",
      options: [
        "¿Cuánto rinde el año pasado?",
        "¿Qué tan rápido puedo venderlo?",
        "¿Qué significa realmente invertir y en qué se diferencia de especular?",
        "¿Cuántos amigos lo recomiendan?"
      ],
      correct_option_index: 2,
      explanation: "Antes de elegir instrumento, es fundamental entender qué es invertir y cómo se diferencia de especular."
    },
    {
      id: "ki-m2-q3",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Cuál de los siguientes NO es un factor a considerar al invertir?",
      options: [
        "Rentabilidad esperada",
        "Plazo",
        "Color del logo del instrumento",
        "Riesgos asociados"
      ],
      correct_option_index: 2,
      explanation: "El color del logo no influye en la decisión de inversión; los otros factores sí."
    },
    {
      id: "ki-m2-q4",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Por qué invertir es una necesidad en países con alta inflación?",
      options: [
        "Porque todos lo hacen",
        "Porque no invertir equivale a perder poder adquisitivo año a año",
        "Porque es obligatorio por ley",
        "Porque es la única forma de ganar dinero"
      ],
      correct_option_index: 1,
      explanation: "En contextos inflacionarios, no invertir implica perder valor real del dinero."
    },
    {
      id: "ki-m2-q5",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Qué caracteriza a un inversor según el módulo?",
      options: [
        "Busca ganancias rápidas y actúa por impulso",
        "Define objetivos, analiza y asume riesgos calculados",
        "Opera solo en criptomonedas",
        "No acepta ningún tipo de riesgo"
      ],
      correct_option_index: 1,
      explanation: "El inversor actúa con análisis, objetivos y riesgos calculados."
    },
    {
      id: "ki-m2-q6",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Cuál es la principal diferencia entre ahorro e inversión?",
      options: [
        "El ahorro implica riesgo, la inversión no",
        "El ahorro conserva capital sin riesgo, la inversión busca crecimiento asumiendo incertidumbre",
        "El ahorro es solo en dólares",
        "No hay diferencia"
      ],
      correct_option_index: 1,
      explanation: "El ahorro es conservar capital; la inversión implica riesgo y busca crecimiento."
    },
    {
      id: "ki-m2-q7",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Qué es la liquidez en una inversión?",
      options: [
        "La cantidad de agua que tiene el activo",
        "La facilidad para convertir el activo en efectivo rápidamente",
        "El color del billete",
        "El plazo mínimo de la inversión"
      ],
      correct_option_index: 1,
      explanation: "Liquidez es la facilidad para vender un activo y obtener efectivo."
    },
    {
      id: "ki-m2-q8",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Cuál de los siguientes es un riesgo asociado a la inversión?",
      options: [
        "Inflación",
        "Riesgo de mercado",
        "Riesgo de liquidez",
        "Todas las anteriores"
      ],
      correct_option_index: 3,
      explanation: "Todos son riesgos que pueden afectar una inversión."
    },
    {
      id: "ki-m2-q9",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Qué busca el especulador según el módulo?",
      options: [
        "Construir patrimonio a largo plazo",
        "Ganancias rápidas aprovechando fluctuaciones de mercado",
        "Diversificar su portafolio",
        "Minimizar riesgos"
      ],
      correct_option_index: 1,
      explanation: "El especulador busca ganancias rápidas, muchas veces guiado por la emoción."
    },
    {
      id: "ki-m2-q10",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Por qué es importante definir el plazo de una inversión?",
      options: [
        "Porque determina cuándo se puede gastar la ganancia",
        "Porque afecta la rentabilidad esperada y el tipo de instrumento adecuado",
        "Porque lo exige el banco",
        "Porque así lo dice la ley"
      ],
      correct_option_index: 1,
      explanation: "El plazo influye en la elección del instrumento y la rentabilidad esperada."
    },
    {
      id: "ki-m2-q11",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Qué significa “rentabilidad esperada”?",
      options: [
        "El monto exacto que se ganará",
        "El porcentaje estimado de ganancia sobre el capital invertido",
        "El plazo de la inversión",
        "El riesgo asumido"
      ],
      correct_option_index: 1,
      explanation: "Es el porcentaje estimado de ganancia que se espera obtener."
    },
    {
      id: "ki-m2-q12",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Cuál es el principal objetivo de invertir según el módulo?",
      options: [
        "Ganar dinero rápido",
        "Protegerse de la inflación y construir patrimonio a largo plazo",
        "Seguir modas del mercado",
        "Operar todos los días"
      ],
      correct_option_index: 1,
      explanation: "El objetivo es protegerse de la inflación y construir patrimonio sostenido."
    },
    {
      id: "ki-m2-q13",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Qué instrumento es más adecuado para un perfil conservador?",
      options: [
        "Acciones tecnológicas volátiles",
        "Bonos o instrumentos de renta fija",
        "Criptomonedas alternativas",
        "Futuros apalancados"
      ],
      correct_option_index: 1,
      explanation: "Los bonos y renta fija son más adecuados para perfiles conservadores."
    },
    {
      id: "ki-m2-q14",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Qué implica la diversificación en inversiones?",
      options: [
        "Poner todo el capital en un solo activo",
        "Distribuir el capital en distintos activos para reducir riesgo",
        "Operar solo en el mercado local",
        "Comprar solo instrumentos de moda"
      ],
      correct_option_index: 1,
      explanation: "Diversificar reduce el riesgo específico de cada activo."
    },
    {
      id: "ki-m2-q15",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Por qué es importante la liquidez en una inversión?",
      options: [
        "Permite salir rápidamente ante una necesidad",
        "Aumenta el riesgo",
        "Reduce la rentabilidad",
        "No tiene importancia"
      ],
      correct_option_index: 0,
      explanation: "La liquidez permite convertir el activo en efectivo ante imprevistos."
    },
    {
      id: "ki-m2-q16",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Qué es el horizonte temporal en una inversión?",
      options: [
        "El día de la semana en que se invierte",
        "El período durante el cual se espera mantener la inversión",
        "El tipo de instrumento elegido",
        "El monto invertido"
      ],
      correct_option_index: 1,
      explanation: "Es el tiempo que se planea mantener la inversión antes de retirarla."
    },
    {
      id: "ki-m2-q17",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Qué sucede si se invierte sin analizar riesgos?",
      options: [
        "Se garantiza ganancia",
        "Se expone a pérdidas inesperadas",
        "No hay consecuencias",
        "Se obtiene liquidez inmediata"
      ],
      correct_option_index: 1,
      explanation: "No analizar riesgos puede llevar a pérdidas imprevistas."
    },
    {
      id: "ki-m2-q18",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Cuál es la función de la planificación en la inversión?",
      options: [
        "Elegir instrumentos al azar",
        "Definir objetivos, plazos y estrategias para alcanzar metas financieras",
        "Operar solo en criptomonedas",
        "Evitar la diversificación"
      ],
      correct_option_index: 1,
      explanation: "La planificación permite definir objetivos y estrategias para invertir con criterio."
    },
    {
      id: "ki-m2-q19",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Qué es un instrumento financiero?",
      options: [
        "Cualquier objeto que se pueda vender",
        "Un activo o contrato que permite invertir o transferir riesgo",
        "Solo acciones y bonos",
        "Un billete de lotería"
      ],
      correct_option_index: 1,
      explanation: "Un instrumento financiero es un activo o contrato para invertir o transferir riesgo."
    },
    {
      id: "ki-m2-q20",
      course_slug: "kickstart-investment",
      module_number: 2,
      question_text: "¿Por qué la educación financiera es clave antes de invertir?",
      options: [
        "Porque evita errores costosos y permite tomar decisiones informadas",
        "Porque es obligatoria por ley",
        "Porque garantiza ganancias",
        "Porque lo recomiendan los bancos"
      ],
      correct_option_index: 0,
      explanation: "La educación financiera ayuda a evitar errores y tomar mejores decisiones de inversión."
    }
  ],
  3: [
    {
      id: "ki-m3-q1",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué es el staking en el contexto cripto?",
      options: [
        "Comprar acciones de empresas tecnológicas",
        "Bloquear criptomonedas para validar transacciones y recibir recompensas",
        "Vender criptomonedas en exchanges",
        "Hacer trading diario con stablecoins"
      ],
      correct_option_index: 1,
      explanation: "El staking consiste en bloquear criptomonedas para participar en la validación de una red y recibir recompensas."
    },
    {
      id: "ki-m3-q2",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Cuál es la principal diferencia entre staking y un plazo fijo bancario?",
      options: [
        "El staking tiene garantía estatal",
        "El staking no tiene garantía estatal y el riesgo depende de la plataforma y la cripto",
        "El plazo fijo paga en criptomonedas",
        "El staking solo se hace en bancos"
      ],
      correct_option_index: 1,
      explanation: "El staking no tiene garantía estatal; el riesgo depende de la plataforma y la moneda utilizada."
    },
    {
      id: "ki-m3-q3",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué instrumento permite diversificar con poco capital y gestión profesional?",
      options: [
        "Acciones individuales",
        "Fondos Comunes de Inversión (FCI)",
        "Plazos fijos tradicionales",
        "Trading de futuros"
      ],
      correct_option_index: 1,
      explanation: "Los FCI permiten diversificar y acceder a gestión profesional con bajo monto inicial."
    },
    {
      id: "ki-m3-q4",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué es un CEDEAR?",
      options: [
        "Un bono emitido por el Estado argentino",
        "Un certificado que replica acciones extranjeras y se compra en pesos",
        "Una criptomoneda estable",
        "Un fondo de inversión en dólares"
      ],
      correct_option_index: 1,
      explanation: "El CEDEAR replica acciones extranjeras y se opera en pesos, ajustándose al tipo de cambio."
    },
    {
      id: "ki-m3-q5",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Cuál es el principal beneficio de los CEDEARs para el inversor argentino?",
      options: [
        "Permiten operar solo en el mercado local",
        "Exposición global y cobertura cambiaria desde una cuenta local",
        "Garantizan rendimientos fijos",
        "No tienen riesgo de mercado"
      ],
      correct_option_index: 1,
      explanation: "Los CEDEARs permiten invertir en acciones globales y cubrirse del riesgo cambiario."
    },
    {
      id: "ki-m3-q6",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué riesgo principal tiene el staking de stablecoins?",
      options: [
        "Volatilidad del dólar",
        "Riesgo de la plataforma y de la propia criptomoneda",
        "Inflación en pesos",
        "Falta de liquidez bancaria"
      ],
      correct_option_index: 1,
      explanation: "El riesgo está en la plataforma y en la moneda utilizada, no hay garantía estatal."
    },
    {
      id: "ki-m3-q7",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué característica distingue a los FCI Money Market?",
      options: [
        "Alta volatilidad y riesgo",
        "Liquidez casi inmediata y bajo riesgo",
        "Solo invierten en acciones tecnológicas",
        "Pagan dividendos trimestrales"
      ],
      correct_option_index: 1,
      explanation: "Los FCI Money Market ofrecen liquidez rápida y bajo riesgo, ideales para estacionar fondos."
    },
    {
      id: "ki-m3-q8",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué función cumple el staking en una red blockchain?",
      options: [
        "Facilitar préstamos bancarios",
        "Validar transacciones y asegurar la red",
        "Emitir nuevas monedas fiduciarias",
        "Garantizar precios fijos"
      ],
      correct_option_index: 1,
      explanation: "El staking ayuda a validar transacciones y mantener la seguridad de la red."
    },
    {
      id: "ki-m3-q9",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué ventaja tiene invertir en un ETF respecto a acciones individuales?",
      options: [
        "Mayor riesgo",
        "Diversificación automática y bajas comisiones",
        "Solo se puede operar en dólares",
        "Garantía de ganancias"
      ],
      correct_option_index: 1,
      explanation: "Los ETFs permiten diversificar y suelen tener comisiones bajas."
    },
    {
      id: "ki-m3-q10",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué ocurre si la plataforma de staking sufre un hackeo?",
      options: [
        "El Estado garantiza la devolución",
        "El usuario puede perder parte o la totalidad de sus fondos",
        "No hay consecuencias",
        "Se reciben intereses dobles"
      ],
      correct_option_index: 1,
      explanation: "No hay garantía estatal; el usuario asume el riesgo de la plataforma."
    },
    {
      id: "ki-m3-q11",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué instrumento permite dolarizar ahorros sin abrir cuenta en el exterior?",
      options: [
        "Plazo fijo UVA",
        "CEDEARs",
        "Bonos en pesos",
        "FCI Money Market"
      ],
      correct_option_index: 1,
      explanation: "Los CEDEARs permiten exposición en dólares desde una cuenta local."
    },
    {
      id: "ki-m3-q12",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Cuál es la principal función de un FCI?",
      options: [
        "Permitir trading apalancado",
        "Reunir capital de muchos inversores y diversificarlo según una estrategia",
        "Garantizar rentabilidad fija",
        "Operar solo en criptomonedas"
      ],
      correct_option_index: 1,
      explanation: "El FCI reúne capital y lo invierte diversificadamente según una estrategia."
    },
    {
      id: "ki-m3-q13",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué característica tienen los instrumentos del mercado monetario?",
      options: [
        "Alto riesgo y baja liquidez",
        "Muy corto plazo, alta liquidez y bajo riesgo",
        "Solo se operan en dólares",
        "Pagan dividendos anuales"
      ],
      correct_option_index: 1,
      explanation: "Son instrumentos de corto plazo, alta liquidez y bajo riesgo."
    },
    {
      id: "ki-m3-q14",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué es un ETF?",
      options: [
        "Un fondo cotizado en bolsa que replica un índice o sector",
        "Un bono corporativo",
        "Una acción de empresa argentina",
        "Un derivado financiero complejo"
      ],
      correct_option_index: 0,
      explanation: "El ETF es un fondo cotizado que replica índices o sectores y se opera como acción."
    },
    {
      id: "ki-m3-q15",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué ventaja tiene el staking con stablecoins frente a otras criptos?",
      options: [
        "Menor volatilidad de capital",
        "Mayor riesgo de default",
        "Solo se puede hacer en bancos",
        "Garantía estatal"
      ],
      correct_option_index: 0,
      explanation: "Las stablecoins mantienen paridad con el dólar, reduciendo volatilidad."
    },
    {
      id: "ki-m3-q16",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué sucede si el emisor de un bono en dólares entra en default?",
      options: [
        "El inversor recibe igual los intereses",
        "El inversor puede perder parte o todo el capital e intereses",
        "No hay consecuencias",
        "El Estado argentino cubre la pérdida"
      ],
      correct_option_index: 1,
      explanation: "El default implica riesgo de perder capital e intereses."
    },
    {
      id: "ki-m3-q17",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué instrumento permite exposición global y cobertura cambiaria automática?",
      options: [
        "Plazo fijo tradicional",
        "CEDEARs",
        "FCI Money Market",
        "Bonos en pesos"
      ],
      correct_option_index: 1,
      explanation: "Los CEDEARs permiten ambas cosas desde una cuenta local."
    },
    {
      id: "ki-m3-q18",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué es una obligación negociable (ON)?",
      options: [
        "Un bono emitido por el Estado",
        "Un bono emitido por una empresa privada, muchas veces en dólares",
        "Un fondo de inversión",
        "Una acción extranjera"
      ],
      correct_option_index: 1,
      explanation: "Las ON son bonos de empresas privadas, muchas veces en dólares."
    },
    {
      id: "ki-m3-q19",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Qué riesgo NO cubre un FCI Money Market?",
      options: [
        "Riesgo de liquidez",
        "Riesgo de mercado extremo o default sistémico",
        "Riesgo de inflación",
        "Riesgo de tipo de cambio"
      ],
      correct_option_index: 1,
      explanation: "Un evento sistémico extremo puede afectar incluso a los instrumentos más líquidos."
    },
    {
      id: "ki-m3-q20",
      course_slug: "kickstart-investment",
      module_number: 3,
      question_text: "¿Por qué es clave combinar instrumentos en el portafolio?",
      options: [
        "Para maximizar el riesgo",
        "Para asignar un trabajo a cada peso y diversificar según objetivo, plazo y perfil",
        "Para operar solo en un mercado",
        "Para evitar la diversificación"
      ],
      correct_option_index: 1,
      explanation: "Combinar instrumentos permite diversificar y asignar roles claros según objetivo y perfil."
    }
  ],
 4: [
    {
      id: "ki-m4-q1",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Qué es el interés compuesto y por qué es tan poderoso en la inversión a largo plazo?",
      options: [
        "El interés que se paga por préstamos bancarios.",
        "La acumulación de intereses sobre intereses, lo que acelera el crecimiento del capital con el tiempo.",
        "Un tipo de impuesto sobre inversiones.",
        "Un bono especial emitido por el Estado."
      ],
      correct_option_index: 1,
      explanation: "El interés compuesto permite que los intereses generen nuevos intereses, acelerando el crecimiento del capital a largo plazo."
    },
    {
      id: "ki-m4-q2",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Por qué es importante comenzar a invertir lo antes posible?",
      options: [
        "Porque así se puede especular más.",
        "Porque el tiempo potencia el efecto del interés compuesto y permite aprovechar mejor el crecimiento del capital.",
        "Porque los mercados siempre suben.",
        "Porque es obligatorio por ley."
      ],
      correct_option_index: 1,
      explanation: "El tiempo es el factor más importante en el interés compuesto; cuanto antes se empieza, mayor es el crecimiento potencial."
    },
    {
      id: "ki-m4-q3",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Qué significa diversificar en el contexto de inversiones?",
      options: [
        "Poner todo el dinero en un solo activo.",
        "Distribuir el capital en diferentes activos, sectores o geografías para reducir el riesgo.",
        "Invertir solo en criptomonedas.",
        "Comprar solo acciones tecnológicas."
      ],
      correct_option_index: 1,
      explanation: "Diversificar reduce el riesgo de que una sola mala inversión afecte todo el portafolio."
    },
    {
      id: "ki-m4-q4",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Cuál es el principal riesgo de no diversificar?",
      options: [
        "Obtener mayores rendimientos.",
        "Que una sola inversión salga mal y afecte todo el capital.",
        "Pagar más impuestos.",
        "No poder operar en el mercado local."
      ],
      correct_option_index: 1,
      explanation: "No diversificar expone el capital a riesgos innecesarios si una inversión falla."
    },
    {
      id: "ki-m4-q5",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Qué es el rebalanceo de cartera y por qué es útil?",
      options: [
        "Vender todo ante la primera caída.",
        "Ajustar periódicamente la distribución de activos para mantener el riesgo y la estrategia definidos.",
        "Comprar solo activos de moda.",
        "Invertir solo en el mercado local."
      ],
      correct_option_index: 1,
      explanation: "El rebalanceo ayuda a mantener la estrategia y el perfil de riesgo, evitando desvíos por movimientos de mercado."
    },
    {
      id: "ki-m4-q6",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Por qué es importante conocer el propio perfil de riesgo?",
      options: [
        "Para copiar estrategias de otros inversores.",
        "Para elegir instrumentos y estrategias acordes a la tolerancia personal a las pérdidas y volatilidad.",
        "Para invertir solo en renta fija.",
        "Para evitar la diversificación."
      ],
      correct_option_index: 1,
      explanation: "El perfil de riesgo determina qué instrumentos y estrategias son adecuados para cada persona."
    },
    {
      id: "ki-m4-q7",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Qué es un horizonte temporal en inversiones?",
      options: [
        "El día de la semana en que se invierte.",
        "El período durante el cual se espera mantener la inversión antes de necesitar el dinero.",
        "El tipo de instrumento elegido.",
        "El monto invertido."
      ],
      correct_option_index: 1,
      explanation: "El horizonte temporal ayuda a definir qué instrumentos son adecuados según cuándo se necesitará el dinero."
    },
    {
      id: "ki-m4-q8",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Qué es la liquidez en una inversión?",
      options: [
        "La cantidad de agua que tiene el activo.",
        "La facilidad para convertir el activo en efectivo rápidamente sin perder valor.",
        "El color del billete.",
        "El plazo mínimo de la inversión."
      ],
      correct_option_index: 1,
      explanation: "La liquidez es clave para poder disponer del dinero ante imprevistos sin grandes pérdidas."
    },
    {
      id: "ki-m4-q9",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Por qué es importante la educación financiera antes de invertir?",
      options: [
        "Porque evita errores costosos y permite tomar decisiones informadas.",
        "Porque es obligatoria por ley.",
        "Porque garantiza ganancias.",
        "Porque lo recomiendan los bancos."
      ],
      correct_option_index: 0,
      explanation: "La educación financiera ayuda a evitar errores y tomar mejores decisiones de inversión."
    },
    {
      id: "ki-m4-q10",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Qué es un instrumento financiero?",
      options: [
        "Cualquier objeto que se pueda vender.",
        "Un activo o contrato que permite invertir o transferir riesgo.",
        "Solo acciones y bonos.",
        "Un billete de lotería."
      ],
      correct_option_index: 1,
      explanation: "Un instrumento financiero es un activo o contrato para invertir o transferir riesgo."
    },
    {
      id: "ki-m4-q11",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Qué es el riesgo de mercado?",
      options: [
        "El riesgo de perder el trabajo.",
        "La posibilidad de que el valor de los activos fluctúe por factores externos.",
        "El riesgo de inflación.",
        "El riesgo de liquidez."
      ],
      correct_option_index: 1,
      explanation: "El riesgo de mercado es la posibilidad de que los precios cambien por factores económicos, políticos o globales."
    },
    {
      id: "ki-m4-q12",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Por qué conviene automatizar el ahorro e inversión?",
      options: [
        "Para olvidarse del dinero.",
        "Para asegurar la constancia y evitar depender de la fuerza de voluntad cada mes.",
        "Para especular más.",
        "Para evitar la diversificación."
      ],
      correct_option_index: 1,
      explanation: "Automatizar ayuda a mantener la disciplina y aprovechar el interés compuesto."
    },
    {
      id: "ki-m4-q13",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Qué es el drawdown en inversiones?",
      options: [
        "El monto total invertido en acciones.",
        "La caída desde el máximo histórico de tu cartera.",
        "El interés que paga un bono.",
        "El costo de operar en el mercado."
      ],
      correct_option_index: 1,
      explanation: "El drawdown mide la caída máxima desde el pico de valor de la cartera, clave para evaluar tolerancia al riesgo."
    },
    {
      id: "ki-m4-q14",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Qué función cumple el rebalanceo en una cartera?",
      options: [
        "Aumentar la exposición a activos de moda.",
        "Volver a las proporciones objetivo vendiendo lo sobreponderado y reforzando lo rezagado.",
        "Vender todo ante la primera caída.",
        "Comprar solo cuando hay euforia."
      ],
      correct_option_index: 1,
      explanation: "El rebalanceo mantiene la estrategia y el riesgo bajo control, ajustando la cartera periódicamente."
    },
    {
      id: "ki-m4-q15",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Por qué conviene especializarse en uno o dos mercados al principio?",
      options: [
        "Porque operar todos los mercados es ilegal.",
        "Porque cada mercado tiene su lógica, riesgo y herramientas, y es mejor dominar pocos que dispersarse.",
        "Porque los brokers lo exigen.",
        "Porque así se obtienen rendimientos garantizados."
      ],
      correct_option_index: 1,
      explanation: "Es más efectivo conocer bien pocos mercados que intentar operar todos superficialmente."
    },
    {
      id: "ki-m4-q16",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Qué es el spread en el mercado Forex?",
      options: [
        "El horario de operación del mercado.",
        "La diferencia entre el precio de compra (ask) y el de venta (bid), que representa el costo real de operar.",
        "El monto mínimo para operar.",
        "El tipo de cambio oficial."
      ],
      correct_option_index: 1,
      explanation: "El spread es el costo oculto de cada operación, clave en mercados líquidos y exóticos."
    },
    {
      id: "ki-m4-q17",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Qué caracteriza a las acciones como instrumento de inversión?",
      options: [
        "Son préstamos al Estado.",
        "Representan una fracción de propiedad de una empresa y permiten participar de sus ganancias y patrimonio.",
        "Son instrumentos de renta fija.",
        "No generan ningún tipo de ingreso."
      ],
      correct_option_index: 1,
      explanation: "Las acciones otorgan derechos sobre la empresa y su evolución económica."
    },
    {
      id: "ki-m4-q18",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Por qué es importante la mentalidad del inversor según el módulo?",
      options: [
        "Porque determina la capacidad de sostener el plan ante volatilidad y caídas, más allá de la técnica.",
        "Porque permite adivinar el mercado.",
        "Porque evita la necesidad de diversificar.",
        "Porque garantiza rendimientos altos."
      ],
      correct_option_index: 0,
      explanation: "La mentalidad y la paciencia son más importantes que la técnica para sostenerse en el tiempo."
    },
    {
      id: "ki-m4-q19",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Qué es la tasa real en una inversión?",
      options: [
        "La tasa nominal sin descuentos.",
        "La tasa de crecimiento descontando la inflación, que muestra el avance real del poder adquisitivo.",
        "La tasa que paga el banco.",
        "La tasa de interés de un préstamo."
      ],
      correct_option_index: 1,
      explanation: "La tasa real descuenta la inflación y muestra el crecimiento efectivo del capital."
    },
    {
      id: "ki-m4-q20",
      course_slug: "kickstart-investment",
      module_number: 4,
      question_text: "¿Cuál es la función principal del módulo 4 en Kickstart Investment?",
      options: [
        "Enseñar a operar con apalancamiento extremo.",
        "Profundizar en la importancia del interés compuesto, diversificación, rebalanceo y mentalidad para el éxito a largo plazo.",
        "Explicar cómo obtener rendimientos garantizados.",
        "Fomentar la especulación a corto plazo."
      ],
      correct_option_index: 1,
      explanation: "El módulo 4 busca que el alumno comprenda los pilares para sostener y potenciar su crecimiento financiero a largo plazo."
    }
  ]
};
