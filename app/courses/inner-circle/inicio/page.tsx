// Página de inicio del Inner Circle: Mapa General + Manifiesto
import React from "react";
import Link from "next/link";
import { ProtectedContent } from "@/components/ProtectedContent";

export default function InnerCircleInicio() {
  const currentYear = new Date().getFullYear();
  return (
    <main className="min-h-screen bg-[#0A0A0A] py-8 px-2">
      <ProtectedContent year={currentYear}>
      <div className="max-w-4xl mx-auto">
        {/* Portada y título */}
        <section className="text-center py-12 border-b border-[#2A2A2A] mb-12">
          <div className="font-mono tracking-widest text-[#5BB8D4] text-xs mb-4 uppercase">FLOWDEX · INNER CIRCLE</div>
          <h1 className=" text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-[#5BB8D4] to-[#7DD4C0] bg-clip-text text-transparent mb-2">LA OBRA INTERIOR</h1>
          <div className="text-xl text-[#888] mb-2 font-light">El curso interno que separa al amateur del profesional</div>
          <div className="text-xs text-[#7DD4C0] tracking-widest mt-6 uppercase">Mapa general · Curso de desarrollo personal</div>
        </section>

        {/* Mapa General */}
        <section className="mb-16">
          <h2 className=" text-2xl sm:text-3xl border-l-4 border-[#5BB8D4] pl-4 mb-6 uppercase">Bienvenido al Inner Circle</h2>
          <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-8 mb-8 text-base text-[#fff] leading-relaxed">
            <p>Lo que tenés en tus manos no es un curso más. Es <b>la obra interior</b> del Inner Circle: el trabajo silencioso, profundo y personal que ningún mentor puede hacer por vos.</p>
            <p>Nos hicimos cargo del afuera. Las herramientas técnicas, la auditoría de tus operaciones, los reviews diarios y las sesiones grupales semanales, la comunidad, los indicadores premium, las clases en vivo. Todo eso es tu acompañamiento. Esta obra, en cambio, es <b>solo tuya</b>.</p>
            <p>Está pensada para el trader y para el inversor por igual, porque la psicología detrás de ambos roles es exactamente la misma: gente que toma decisiones bajo incertidumbre con plata real. La diferencia es solo la velocidad.</p>
          </div>

          {/* Cómo funciona */}
          <h2 className=" text-2xl sm:text-3xl border-l-4 border-[#5BB8D4] pl-4 mb-6 uppercase">Cómo funciona el Inner Circle</h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-6">
              <h3 className="text-[#5BB8D4] text-lg font-bold uppercase mb-2">El acompañamiento online</h3>
              <ul className="text-[#888] text-sm list-disc pl-5 space-y-1">
                <li>Revisión técnica grupal de operaciones (traés capturas y se analizan en grupo aplicando el método)</li>
                <li>Reviews y Q&amp;A en vivo (grupales)</li>
                <li>Comunidad activa de operadores</li>
                <li>Acceso a indicadores premium Flowdex</li>
                <li>Estrategia ORB con indicador propio</li>
                <li>Psicotrading aplicado al método</li>
              </ul>
            </div>
            <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-6">
              <h3 className="text-[#7DD4C0] text-lg font-bold uppercase mb-2">La obra interior</h3>
              <ul className="text-[#888] text-sm list-disc pl-5 space-y-1">
                <li>10 módulos de desarrollo personal + módulo de inicio</li>
                <li>Workbook diario de 30 días</li>
                <li>Auditoría Kit con plantillas imprimibles</li>
                <li>Self-assessment inicial y final</li>
                <li>Lecturas esenciales y glosario filosófico</li>
                <li>Cartas a tu yo del año que viene</li>
              </ul>
            </div>
          </div>
          <div className="bg-[#111] border-l-4 border-[#5BB8D4] rounded-r-xl p-6 mb-8">
            <div className="text-xs font-bold text-[#5BB8D4] uppercase mb-2">¿Por qué no hay clase en vivo de esta parte?</div>
            <div className="text-[#fff] text-sm">Porque este trabajo es único e intransferible. Nadie puede sentarse en tu cabeza y hacerlo por vos. Por eso lo curamos para que lo hagas a tu ritmo, en privado, con la profundidad que cada uno necesita. Los conceptos son universales; la transformación es individual.</div>
          </div>

          {/* Módulos */}
          <h2 className=" text-2xl sm:text-3xl border-l-4 border-[#5BB8D4] pl-4 mb-6 uppercase">Los 10 módulos de la obra (+ módulo de inicio)</h2>
          <div className="mb-8 text-[#888] text-sm">Recorridos en orden, te llevan de afuera hacia adentro: del mindset general a la filosofía aplicada. Cada módulo es independiente, pero la fuerza está en el conjunto.</div>
          <div className="grid gap-4 mb-8">
            {/* Bloque I */}
            <div>
              <div className="text-[#7DD4C0] text-xs uppercase tracking-widest mb-2">Bloque I · Fundación</div>
              <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 mb-2 flex items-center">
                <span className="text-2xl font-bold text-[#5BB8D4] mr-4">00</span>
                <div>
                  <div className="font-bold text-white uppercase">Manifiesto · Cómo estudiar · Cómo funciona</div>
                  <div className="text-[#888] text-xs">El rito de entrada. Lo que firmás cuando empezás esta obra. La metodología de estudio recomendada y la integración con el Inner Circle online.</div>
                </div>
              </div>
              <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 mb-2 flex items-center">
                <span className="text-2xl font-bold text-[#5BB8D4] mr-4">01</span>
                <div>
                  <div className="font-bold text-white uppercase">Mindset Fundacional</div>
                  <div className="text-[#888] text-xs">La diferencia mental entre amateur y profesional. La identidad del operador: no sos lo que hacés, sos lo que sostenés. Proceso versus resultado.</div>
                </div>
              </div>
              <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 mb-2 flex items-center">
                <span className="text-2xl font-bold text-[#5BB8D4] mr-4">02</span>
                <div>
                  <div className="font-bold text-white uppercase">Tu Relación con el Dinero</div>
                  <div className="text-[#888] text-xs">Heridas, creencias limitantes y mitos heredados. Cómo te criaron pensando en plata y cómo eso aparece en cada decisión. Abundancia versus escasez sin caer en lo new age.</div>
                </div>
              </div>
            </div>
            {/* Bloque II */}
            <div>
              <div className="text-[#7DD4C0] text-xs uppercase tracking-widest mb-2">Bloque II · Dominio Interno</div>
              <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 mb-2 flex items-center">
                <span className="text-2xl font-bold text-[#5BB8D4] mr-4">03</span>
                <div>
                  <div className="font-bold text-white uppercase">Las 6 Emociones Maestras</div>
                  <div className="text-[#888] text-xs">Miedo, codicia, ego, esperanza, frustración, euforia. Cuándo aparecen, cómo se sienten en el cuerpo, cómo se traducen en pantalla, técnicas para gestionarlas en tiempo real.</div>
                </div>
              </div>
              <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 mb-2 flex items-center">
                <span className="text-2xl font-bold text-[#5BB8D4] mr-4">04</span>
                <div>
                  <div className="font-bold text-white uppercase">Sesgos Cognitivos del Operador</div>
                  <div className="text-[#888] text-xs">Los 15 sesgos que más cuestan plata. Revenge trading, anclaje, recency, confirmación, sobreconfianza y otros, con ejemplos concretos y antídotos prácticos.</div>
                </div>
              </div>
              <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 mb-2 flex items-center">
                <span className="text-2xl font-bold text-[#5BB8D4] mr-4">05</span>
                <div>
                  <div className="font-bold text-white uppercase">El Observador Interno</div>
                  <div className="text-[#888] text-xs">La técnica de desidentificación. Aprender a separar al operador del observador del operador. La práctica más poderosa y la menos enseñada.</div>
                </div>
              </div>
            </div>
            {/* Bloque III */}
            <div>
              <div className="text-[#7DD4C0] text-xs uppercase tracking-widest mb-2">Bloque III · Cuerpo y Energía</div>
              <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 mb-2 flex items-center">
                <span className="text-2xl font-bold text-[#5BB8D4] mr-4">06</span>
                <div>
                  <div className="font-bold text-white uppercase">El Cuerpo del Operador</div>
                  <div className="text-[#888] text-xs">Sueño, ejercicio, alimentación, hidratación, luz solar, respiración. La biología detrás del rendimiento mental. Por qué el cuerpo es el primer activo.</div>
                </div>
              </div>
              <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 mb-2 flex items-center">
                <span className="text-2xl font-bold text-[#5BB8D4] mr-4">07</span>
                <div>
                  <div className="font-bold text-white uppercase">Manejo del Estrés y Burnout</div>
                  <div className="text-[#888] text-xs">Detección temprana, técnicas concretas de regulación, recuperación activa. Cuándo parar. La diferencia entre presión y estrés crónico.</div>
                </div>
              </div>
            </div>
            {/* Bloque IV */}
            <div>
              <div className="text-[#7DD4C0] text-xs uppercase tracking-widest mb-2">Bloque IV · Sistemas y Filosofía</div>
              <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 mb-2 flex items-center">
                <span className="text-2xl font-bold text-[#5BB8D4] mr-4">08</span>
                <div>
                  <div className="font-bold text-white uppercase">Rutinas y Rituales</div>
                  <div className="text-[#888] text-xs">Pre-mercado, durante, post-mercado. Habit stacking aplicado. El protocolo de auditoría diaria. Cómo construir disciplina cuando no tenés ganas.</div>
                </div>
              </div>
              <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 mb-2 flex items-center">
                <span className="text-2xl font-bold text-[#5BB8D4] mr-4">09</span>
                <div>
                  <div className="font-bold text-white uppercase">Decisiones Bajo Presión</div>
                  <div className="text-[#888] text-xs">Frameworks profesionales: pre-mortem, checklist, regla de las 24 horas, second opinion. Cómo decide tu cerebro bajo estrés y cómo blindarte.</div>
                </div>
              </div>
              <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 mb-2 flex items-center">
                <span className="text-2xl font-bold text-[#5BB8D4] mr-4">10</span>
                <div>
                  <div className="font-bold text-white uppercase">Filosofía Aplicada y Visión 10 Años</div>
                  <div className="text-[#888] text-xs">Estoicismo para operadores aplicado al chart. El memento mori del trader. Propósito más allá del dinero. Tu vida a 10 años.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Anexos */}
          <h2 className=" text-2xl sm:text-3xl border-l-4 border-[#5BB8D4] pl-4 mb-6 uppercase">Los 7 anexos de la obra</h2>
          <div className="mb-8 text-[#888] text-sm">Lo que transforma la teoría en hábito. Cada anexo está pensado para usarse, no para leerse.</div>
          <div className="grid gap-3 mb-8 sm:grid-cols-2">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
              <div className="text-[#7DD4C0] font-bold text-base mb-1">A — Workbook de 30 días</div>
              <div className="text-[#888] text-xs">Un prompt diario para escribir a mano durante un mes. Convierte la lectura en práctica.</div>
            </div>
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
              <div className="text-[#7DD4C0] font-bold text-base mb-1">B — Auditoría Kit (5 plantillas imprimibles)</div>
              <div className="text-[#888] text-xs">Pre-sesión, post-sesión, revisión semanal, revisión mensual y journal psicológico.</div>
            </div>
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
              <div className="text-[#7DD4C0] font-bold text-base mb-1">C — Cartas a tu yo del año que viene</div>
              <div className="text-[#888] text-xs">Dos cartas que escribís y abrís. La herramienta más simple y más reveladora del curso.</div>
            </div>
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
              <div className="text-[#7DD4C0] font-bold text-base mb-1">D — Tracker visual de progreso</div>
              <div className="text-[#888] text-xs">Una hoja imprimible para tachar tu camino. Motivación visual sostenida.</div>
            </div>
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
              <div className="text-[#7DD4C0] font-bold text-base mb-1">E — 20 Lecturas Esenciales</div>
              <div className="text-[#888] text-xs">Los libros que cada operador serio debería leer. Con qué tomar de cada uno y cuál saltarse si vas con poco tiempo.</div>
            </div>
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
              <div className="text-[#7DD4C0] font-bold text-base mb-1">F — Glosario filosófico aplicado</div>
              <div className="text-[#888] text-xs">30 términos del estoicismo, behavioral finance y deportes de élite traducidos al lenguaje del operador.</div>
            </div>
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4">
              <div className="text-[#7DD4C0] font-bold text-base mb-1">G — Self-assessment inicial y final</div>
              <div className="text-[#888] text-xs">Cuestionario de 25 preguntas para responder al empezar y al terminar el curso. Mide la transformación real.</div>
            </div>
          </div>

          {/* Ritmo recomendado */}
          <h2 className=" text-2xl sm:text-3xl border-l-4 border-[#5BB8D4] pl-4 mb-6 uppercase">Ritmo recomendado</h2>
          <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-8 mb-8 text-base text-[#fff] leading-relaxed">
            <p>La obra completa está pensada para recorrerse en <b>3 meses</b>, a un ritmo de <b>un módulo cada 7 a 10 días</b>. Ese tiempo no es para leer: es para <b>aplicar</b>.</p>
            <p>El workbook diario corre en paralelo desde el día uno. No esperés a "terminar de leer" para empezar la práctica. La práctica es la lectura.</p>
            <p className="text-[#888] text-xs">Si vas más rápido, perdés profundidad. Si vas más lento, perdés inercia. El ritmo importa.</p>
          </div>
          <div className="bg-[#111] border-l-4 border-[#5BB8D4] rounded-r-xl p-6 mb-8">
            <div className="text-xs font-bold text-[#5BB8D4] uppercase mb-2">Un aviso antes de empezar</div>
            <div className="text-[#fff] text-sm">Esta obra te va a confrontar. Va a poner espejo donde no querías mirar. Si en algún punto sentís resistencia, eso es exactamente la señal de que estás en el lugar correcto. La transformación pasa por ahí, no por la zona cómoda.</div>
          </div>
        </section>

        {/* Módulo 0: Manifiesto */}
        <section className="mt-20">
          <div className="text-center mb-10">
            <div className="font-mono tracking-widest text-[#5BB8D4] text-xs mb-2 uppercase">MÓDULO 00</div>
            <h2 className=" text-4xl sm:text-5xl font-extrabold text-white mb-2">EL UMBRAL</h2>
            <div className="text-lg text-[#888] mb-2 font-light">Manifiesto · Cómo estudiar · Cómo funciona el Inner Circle</div>
          </div>
          <div className="bg-gradient-to-b from-[#10191c] to-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
            <h3 className=" text-2xl text-white mb-4 border-l-4 border-[#5BB8D4] pl-4 uppercase">El Manifiesto</h3>
            <div className="prose prose-invert max-w-none text-lg leading-relaxed mb-8">
              <p className="italic text-[#7DD4C0]">Antes de entrar a un dojo, los aprendices se inclinan. Antes de entrar a un quirófano, los cirujanos se lavan las manos. No es ritual vacío: es la forma en que la mente cruza un umbral. Esta página es tu umbral.</p>
              <p className="italic text-[#7DD4C0]">Léelo despacio. Si lo querés, imprimilo y firmalo. Si no, leelo dos veces. Pero leelo entero, sin saltearte. Lo que firmás (con tu firma o con tu palabra) es contigo.</p>
              <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-6 my-6">
                <p>Yo entro a esta obra sabiendo que el trabajo más importante de mi vida como operador no se hace en pantalla, sino acá adentro.</p>
                <p>Reconozco que durante años busqué afuera lo que solo puede construirse adentro. Indicadores nuevos, estrategias nuevas, mentores nuevos. Y entiendo, ahora, que ningún sistema externo va a corregir lo que en mí está descalibrado.</p>
                <p>Acepto que esta obra no me va a hacer rico de la noche a la mañana. No me va a dar la próxima entrada ganadora. No me va a salvar de la próxima caída del mercado. Lo que va a hacer es transformarme a mí, lentamente, módulo por módulo, día por día. Y eso, con el tiempo, hace todo lo demás posible.</p>
                <p>Me comprometo a leer con honestidad. A no saltearme las preguntas que me incomoden, porque ahí están las respuestas. A escribir cuando se pide, aunque me parezca tonto. A hacer las pausas cuando se piden, aunque me cueste. A volver a leer un módulo cuando sienta que algo no entró del todo.</p>
                <p>Reconozco que nadie está mirando. Esta obra es solo entre yo y yo. Por eso, si me miento, solo me estoy lastimando. Y si me digo la verdad, solo me estoy salvando.</p>
                <p>Acepto que la transformación lleva tiempo. Tres meses para recorrer la obra. Otros nueve para que se asiente. Quizás dos años para que ya no haya vuelta atrás. Y esto está bien. No estoy compitiendo con nadie, ni siquiera conmigo mismo. Estoy construyendo algo que dure.</p>
                <p>Sé que en algún punto del camino voy a querer abandonar. Voy a sentir que esto no es para mí. Voy a inventar excusas elegantes para volver a la vieja forma. Cuando ese momento llegue, este manifiesto va a estar acá. Y voy a recordar por qué empecé.</p>
                <p>Empiezo hoy.</p>
                <div className="text-right text-[#888] italic mt-4">— El operador que decidió dejar de ser amateur.</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-8">
              <div className="border-b border-dashed border-[#7DD4C0] h-8 mb-2"></div>
              <div className="border-b border-dashed border-[#7DD4C0] h-8 mb-2"></div>
              <div className="text-xs text-[#7DD4C0] uppercase tracking-widest">Tu firma · Fecha</div>
            </div>
          </div>
        </section>

        <div className="mt-12 rounded-xl border border-[#D4B86A]/20 bg-[#1A1408]/40 px-4 py-3 text-center max-w-3xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4B86A]/80">
            © Flowdex {currentYear} — Material protegido por Ley 11.723
          </p>
          <p className="mt-1 text-[10px] text-[#9A8E6E]">
            Reproducción, distribución o uso comercial no autorizado de este contenido está expresamente prohibido.{" "}
            <Link href="/legal/propiedad-intelectual" className="text-[#D4B86A] hover:text-[#E6DAB6] underline-offset-2 hover:underline">
              Aviso de Propiedad Intelectual
            </Link>
          </p>
        </div>
      </div>
      </ProtectedContent>
    </main>
  );
}
