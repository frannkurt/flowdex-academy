import React from "react"

type InnerCircleManifiestoProps = {
  signatureName?: string
  signatureDate?: string
}

export function InnerCircleManifiesto({
  signatureName = "Tu firma",
  signatureDate = "",
}: InnerCircleManifiestoProps) {
  return (
    <div className="w-full">
      {/* Cover */}
      <div className="mb-8 border-b border-[#2A2A2A] py-8 text-center sm:py-9">
        <div className="mb-1.5 text-xs font-bold tracking-widest text-[#5BB8D4]">FLOWDEX · INNER CIRCLE</div>
        <div className="mb-1.5 bg-gradient-to-r from-[#5BB8D4] to-[#7DD4C0] bg-clip-text text-[46px] font-black leading-none text-transparent sm:text-[52px]">00</div>
        <h1 className="mb-2 text-3xl font-extrabold text-white sm:text-4xl">EL UMBRAL</h1>
        <div className="text-base font-medium text-[#7DD4C0] sm:text-lg">Manifiesto · Cómo estudiar · Cómo funciona el Inner Circle</div>
      </div>

      {/* Cómo estudiar esta obra (ahora arriba) */}
      <h2 className="text-2xl font-bold text-white border-l-4 border-[#5BB8D4] pl-4 mb-4 uppercase">Cómo estudiar esta obra</h2>
      <div className="text-[#BBBBBB] mb-8">
        <p className="mb-2">Hay una diferencia enorme entre <span className="font-bold text-[#5BB8D4]">leer</span> un curso y <span className="font-bold text-[#5BB8D4]">estudiarlo</span>. La mayoría de las personas leen, no estudian. Por eso la mayoría no se transforma.</p>
        <p className="mb-2">Lo que sigue es la metodología que recomendamos para sacarle el jugo a esta obra. No es la única, pero es la que probamos y funciona. Si la seguís, en tres meses sos otra persona. Literalmente.</p>
        <ol className="list-decimal pl-6 space-y-2 mt-4">
          <li><span className="font-bold text-[#7DD4C0]">Primera pasada:</span> lectura rápida. Leé el módulo entero sin pausas. No tomes notas. No subrayes. Solo dejá que el contenido entre.</li>
          <li><span className="font-bold text-[#7DD4C0]">Segunda pasada:</span> lectura profunda con marcador. Subrayá lo que te resuena. Anotá lo que te incomoda. Lo que te incomoda es lo que tenés que trabajar.</li>
          <li><span className="font-bold text-[#7DD4C0]">Aplicación:</span> 7 días con el ejercicio. Cada módulo termina con un ejercicio práctico. No es opcional. Es el módulo.</li>
          <li><span className="font-bold text-[#7DD4C0]">Workbook diario:</span> desde el día uno, hacé tu prompt diario del workbook. Escrito a mano si podés. Treinta días seguidos sin saltearte ninguno.</li>
          <li><span className="font-bold text-[#7DD4C0]">Avance:</span> solo cuando completaste los pasos anteriores, pasá al siguiente módulo.</li>
          <li><span className="font-bold text-[#7DD4C0]">Revisión mensual:</span> al final de cada mes, hacé una revisión completa. Releé tus subrayados, tus notas, tus auto-revisiones.</li>
        </ol>
        <div className="bg-[#7DD4C0]/10 border-l-4 border-[#7DD4C0] p-4 mt-6 rounded-lg">
          <span className="block text-xs text-[#7DD4C0] font-bold uppercase mb-2">Un pequeño pero importante</span>
          <span>Si en algún momento sentís que querés acelerar y leer todo de corrido, esa señal es importante: probablemente tu cerebro está buscando consumir contenido sin compromiso. Esta obra <span className="font-bold text-[#5BB8D4]">no se consume</span>. Se aplica. Una página aplicada vale más que cien páginas leídas.</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white border-l-4 border-[#5BB8D4] pl-4 mb-4 uppercase">Cómo funciona en paralelo con el Inner Circle</h2>
      <div className="text-[#BBBBBB] mb-8 space-y-2">
        <p>El Inner Circle tiene dos capas que se potencian entre sí.</p>
        <p><span className="font-bold text-[#7DD4C0]">Capa externa:</span> revisiones técnicas grupales, reviews, sesiones en vivo, indicadores y comunidad.</p>
        <p><span className="font-bold text-[#7DD4C0]">Capa interna:</span> esta obra. El trabajo de identidad, sesgos, emociones, cuerpo y filosofía.</p>
        <p>Si hacés solo la capa externa, mejorás ejecución pero sin base psicológica estable. Si hacés solo la capa interna, entendés mucho pero aplicás poco. Juntas producen transformación real.</p>
      </div>

      {/* Manifiesto (ahora abajo) */}
      <h2 className="text-2xl font-bold text-white border-l-4 border-[#5BB8D4] pl-4 mb-4 uppercase">El Manifiesto</h2>
      <div className="text-[#BBBBBB] mb-6">
        <p className="mb-2 italic text-[#7DD4C0]">Antes de entrar a un dojo, los aprendices se inclinan. Antes de entrar a un quirófano, los cirujanos se lavan las manos. No es ritual vacío: es la forma en que la mente cruza un umbral. Esta página es tu umbral.</p>
        <p className="mb-2">Léelo despacio. Si lo querés, imprimilo y firmalo. Si no, leelo dos veces. Pero leelo entero, sin saltearte. Lo que firmás (con tu firma o con tu palabra) es contigo.</p>
        <div className="bg-gradient-to-b from-[#5BB8D4]/10 to-[#7DD4C0]/5 border border-[#2A2A2A] rounded-xl p-6 my-6">
          <p className="mb-2">Yo entro a esta obra sabiendo que el trabajo más importante de mi vida como operador no se hace en pantalla, sino acá adentro.</p>
          <p className="mb-2">Reconozco que durante años busqué afuera lo que solo puede construirse adentro. Indicadores nuevos, estrategias nuevas, mentores nuevos. Y entiendo, ahora, que ningún sistema externo va a corregir lo que en mí está descalibrado.</p>
          <p className="mb-2">Acepto que esta obra no me va a hacer rico de la noche a la mañana. No me va a dar la próxima entrada ganadora. No me va a salvar de la próxima caída del mercado. Lo que va a hacer es transformarme a mí, lentamente, módulo por módulo, día por día. Y eso, con el tiempo, hace todo lo demás posible.</p>
          <p className="mb-2">Me comprometo a leer con honestidad. A no saltearme las preguntas que me incomoden, porque ahí están las respuestas. A escribir cuando se pide, aunque me parezca tonto. A hacer las pausas cuando se piden, aunque me cueste. A volver a leer un módulo cuando sienta que algo no entró del todo.</p>
          <p className="mb-2">Reconozco que nadie está mirando. Esta obra es solo entre yo y yo. Por eso, si me miento, solo me estoy lastimando. Y si me digo la verdad, solo me estoy salvando.</p>
          <p className="mb-2">Acepto que la transformación lleva tiempo. Tres meses para recorrer la obra. Otros nueve para que se asiente. Quizás dos años para que ya no haya vuelta atrás. Y esto está bien. No estoy compitiendo con nadie, ni siquiera conmigo mismo. Estoy construyendo algo que dure.</p>
          <p className="mb-2">Sé que en algún punto del camino voy a querer abandonar. Voy a sentir que esto no es para mí. Voy a inventar excusas elegantes para volver a la vieja forma. Cuando ese momento llegue, este manifiesto va a estar acá. Y voy a recordar por qué empecé.</p>
          <p className="mb-2 font-bold text-[#7DD4C0]">Empiezo hoy.</p>
          <div className="text-right italic text-[#888] mt-4">— El operador que decidió dejar de ser amateur.</div>
        </div>
        <div className="flex flex-col gap-1 mt-4 mb-2">
          <span className="text-xs text-[#7DD4C0] uppercase font-bold">Tu firma · Fecha</span>
          <p className="text-sm text-[#DDEEEF]">
            {signatureName}
            {signatureDate ? ` · ${signatureDate}` : ""}
          </p>
          <div className="border-b border-[#2A2A2A] h-7 w-1/3 mx-auto" />
        </div>
        <div className="bg-[#5BB8D4]/10 border border-[#2A2A2A] rounded-lg p-4 mt-6 text-sm">
          <span className="block text-xs text-[#5BB8D4] font-bold uppercase mb-2">Compromiso mínimo operativo</span>
          <span>Durante las próximas 4 semanas, sostené tres reglas: estudiar sin apuro, aplicar cada ejercicio y registrar por escrito lo que observás en vos. Sin registro no hay evidencia. Sin evidencia no hay evolución consciente.</span>
        </div>
        <div className="w-full flex justify-center mb-4 mt-2">
          <div className="border-b border-[#222] w-1/4" />
        </div>
      </div>
    </div>
  )
}
