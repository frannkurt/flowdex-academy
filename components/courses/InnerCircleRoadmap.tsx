import React from "react";

export function InnerCircleRoadmap() {
  return (
    <section className="w-full mb-12">
      {/* Título y subtítulo */}
      <div className="text-center py-10 border-b border-[#2A2A2A] mb-10">
        <div className="text-xs tracking-widest text-[#5BB8D4] font-bold mb-2">FLOWDEX · INNER CIRCLE</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Mapa General de la Obra</h1>
        <div className="text-base text-[#7DD4C0] font-medium">Cómo funciona · Qué esperar · Roadmap de módulos</div>
      </div>

      {/* Roadmap visual */}
      <div className="flex flex-col gap-8">
        {/* Paso 1: Cómo funciona el Inner Circle */}
        <div className="rounded-2xl border border-[#1E1E1E] bg-[#111111]/80 p-6">
          <h2 className="text-lg font-bold text-white border-l-4 border-[#5BB8D4] pl-4 mb-2 uppercase">¿Cómo funciona el Inner Circle?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-5">
              <h3 className="text-[#5BB8D4] font-bold uppercase text-sm mb-2">Acompañamiento online</h3>
              <ul className="text-[#BBBBBB] text-sm list-disc pl-5 space-y-1">
                <li><span className="font-bold text-[#7DD4C0]">Revisión técnica grupal de operaciones:</span> traés capturas y las analizamos en grupo aplicando el método del curso. Salen aprendizajes pedagógicos que solo aparecen al revisar casos reales con otros operadores.</li>
                <li><span className="font-bold text-[#7DD4C0]">Reviews y Q&A en vivo:</span> sesiones grupales donde se trabajan ejemplos de operaciones reales con criterio del método y se responden dudas pedagógicas.</li>
                <li><span className="font-bold text-[#7DD4C0]">Estrategia ORB e indicadores premium:</span> herramientas exclusivas que se enseñan y se ajustan en vivo.</li>
                <li><span className="font-bold text-[#7DD4C0]">Comunidad de operadores:</span> el grupo donde sostener el camino con otros que entienden lo que estás haciendo.</li>
                <li><span className="font-bold text-[#7DD4C0]">Psicotrading aplicado al método:</span> trabajamos los sesgos psicológicos sobre ejemplos concretos de operaciones, no solo en teoría.</li>
              </ul>
            </div>
            <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-5">
              <h3 className="text-[#5BB8D4] font-bold uppercase text-sm mb-2">La obra interior</h3>
              <ul className="text-[#BBBBBB] text-sm list-disc pl-5 space-y-1">
                <li><span className="font-bold text-[#7DD4C0]">10 módulos de desarrollo personal + módulo de inicio:</span> mindset, emociones, sesgos, cuerpo, rutinas, filosofía.</li>
                <li><span className="font-bold text-[#7DD4C0]">Workbook de 30 días:</span> un prompt diario para escribir a mano y aplicar.</li>
                <li><span className="font-bold text-[#7DD4C0]">Auditoría Kit:</span> 5 plantillas imprimibles para tu rutina personal.</li>
                <li><span className="font-bold text-[#7DD4C0]">Self-assessment inicial y final:</span> medís tu transformación con datos.</li>
                <li><span className="font-bold text-[#7DD4C0]">Cartas a tu yo del año que viene:</span> compromiso escrito que se abre al final.</li>
                <li><span className="font-bold text-[#7DD4C0]">Lecturas esenciales + glosario filosófico:</span> la profundidad cultural que te falta para pensar como un profesional.</li>
              </ul>
            </div>
          </div>
          <div className="bg-[#7DD4C0]/10 border-l-4 border-[#7DD4C0] p-4 mt-6 rounded-lg">
            <span className="block text-xs text-[#7DD4C0] font-bold uppercase mb-2">¿Cómo se complementan?</span>
            <span className="text-[#BBBBBB]">Lo online te da <span className="font-bold text-[#5BB8D4]">feedback externo</span>: alguien que te mira desde afuera, te pone espejo, te corrige a tiempo. La obra interior te da <span className="font-bold text-[#5BB8D4]">desarrollo interno</span>: vos te hacés cargo del trabajo silencioso que nadie puede hacer por vos. Sin lo online, te quedás solo con la teoría. Sin la obra, lo online no encuentra base donde apoyarse. Las dos juntas son lo que justifica el Inner Circle.</span>
          </div>
        </div>

        {/* Paso 2: Qué esperar */}
        <div className="rounded-2xl border border-[#1E1E1E] bg-[#111111]/80 p-6">
          <h2 className="text-lg font-bold text-white border-l-4 border-[#5BB8D4] pl-4 mb-2 uppercase">¿Qué esperar (y qué no)?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="text-[#5BB8D4] font-bold uppercase text-sm mb-2">Lo que sí vas a obtener</h3>
              <ul className="text-[#BBBBBB] text-sm list-disc pl-5 space-y-1">
                <li>Una identidad de operador <span className="font-bold text-[#7DD4C0]">construida desde adentro</span>, no copiada de un mentor.</li>
                <li>Un sistema mental para sostener tu plan cuando el mercado te empuja a romperlo.</li>
                <li>Un marco filosófico para entender <span className="font-bold text-[#7DD4C0]">por qué</span> hacés lo que hacés, no solo <span className="font-bold text-[#7DD4C0]">cómo</span> lo hacés.</li>
                <li>Herramientas concretas (rutinas, plantillas, frameworks) para usar todos los días.</li>
                <li>Una transformación real, medible, que empieza a notarse alrededor del segundo mes.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#5BB8D4] font-bold uppercase text-sm mb-2">Lo que no vas a obtener</h3>
              <ul className="text-[#BBBBBB] text-sm list-disc pl-5 space-y-1">
                <li>Una estrategia ganadora "secreta". Eso lo trabajamos en lo online del Inner Circle.</li>
                <li>Resultados inmediatos. La transformación interna toma tiempo. No hay atajos.</li>
                <li>Validación externa. Esto es trabajo solitario. El reconocimiento, si llega, llega después.</li>
                <li>Una salida fácil cuando te incomode. Si abandonás cuando aparece la resistencia, no transformás nada.</li>
              </ul>
            </div>
          </div>
          <div className="bg-[#5BB8D4]/10 border-l-4 border-[#5BB8D4] p-4 mt-6 rounded-lg">
            <span className="block text-xs text-[#5BB8D4] font-bold uppercase mb-2">Si llegaste hasta acá</span>
            <span className="text-[#BBBBBB]">Y todavía sentís que esto es para vos, entonces sí, es para vos. Pasá la página y empezá con el Módulo 1. Si dudás, mejor cerrá esto y volvé en seis meses cuando estés listo. Esta obra <span className="font-bold text-[#7DD4C0]">requiere compromiso</span> de tu parte. No se completa por accidente.</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#1E1E1E] bg-[#111111]/80 p-6">
          <h2 className="text-lg font-bold text-white border-l-4 border-[#5BB8D4] pl-4 mb-2 uppercase">Ritmo recomendado</h2>
          <div className="text-[#BBBBBB] text-sm space-y-2 mt-4">
            <p>La obra está pensada para recorrerse en <span className="font-bold text-[#7DD4C0]">3 meses</span>, a un ritmo de <span className="font-bold text-[#7DD4C0]">un módulo cada 7 a 10 días</span>.</p>
            <p>Ese tiempo no es para leer en diagonal: es para aplicar, observar y auditarte.</p>
            <p>Si vas demasiado rápido, perdés profundidad. Si vas demasiado lento, perdés inercia. El ritmo importa.</p>
          </div>
          <div className="bg-[#7DD4C0]/10 border-l-4 border-[#7DD4C0] p-4 mt-6 rounded-lg">
            <span className="block text-xs text-[#7DD4C0] font-bold uppercase mb-2">Regla simple</span>
            <span className="text-[#BBBBBB]">El workbook diario corre en paralelo desde el día uno. No esperes terminar de leer para empezar a practicar. Acá la práctica es la lectura.</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#1E1E1E] bg-[#111111]/80 p-6">
          <h2 className="text-lg font-bold text-white border-l-4 border-[#5BB8D4] pl-4 mb-2 uppercase">Anexos que completan la obra</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
            <div className="rounded-xl border border-[#2A2A2A] bg-[#181818] p-4 text-[#BBBBBB]"><span className="font-bold text-[#7DD4C0]">A · Workbook 30 días:</span> un prompt diario para transformar lectura en práctica.</div>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#181818] p-4 text-[#BBBBBB]"><span className="font-bold text-[#7DD4C0]">B · Auditoría Kit:</span> plantillas imprimibles para pre, post y revisión semanal/mensual.</div>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#181818] p-4 text-[#BBBBBB]"><span className="font-bold text-[#7DD4C0]">C · Cartas al yo futuro:</span> compromiso escrito para sostener dirección en el tiempo.</div>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#181818] p-4 text-[#BBBBBB]"><span className="font-bold text-[#7DD4C0]">D · Tracker visual:</span> hoja de progreso para mantener tracción.</div>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#181818] p-4 text-[#BBBBBB]"><span className="font-bold text-[#7DD4C0]">E · Lecturas esenciales:</span> selección para profundizar criterio y marco mental.</div>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#181818] p-4 text-[#BBBBBB]"><span className="font-bold text-[#7DD4C0]">F/G · Glosario + Self-assessment:</span> lenguaje común y medición objetiva de transformación.</div>
          </div>
        </div>
      </div>
    </section>
  );
}