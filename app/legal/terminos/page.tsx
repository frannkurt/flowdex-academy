import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Términos y Condiciones | FLOWDEX",
  description:
    "Términos y Condiciones de uso de la plataforma educativa Flowdex.",
}

export default function TerminosPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2 not-prose">
        <p className="text-xs uppercase tracking-[0.3em] text-[#5BB8D4]">
          Información legal
        </p>
        <h1 className="text-4xl sm:text-5xl font-display tracking-wide text-white">
          Términos y Condiciones
        </h1>
        <p className="text-sm text-[#888888]">
          Última actualización: mayo de 2026
        </p>
      </header>

      <section>
        <h2>1. Identificación del titular</h2>
        <p>
          La plataforma <strong>FLOWDEX</strong> (en adelante, &quot;la Plataforma&quot;
          o &quot;Flowdex&quot;) es operada por{" "}
          <strong>Franco Escudero</strong>, persona física,
          CUIT <strong>20-35014589-4</strong>, con domicilio en{" "}
          <strong>Florencio Sánchez 2464</strong>, República Argentina (en adelante,
          &quot;el Titular&quot;).
        </p>
        <p>
          Para cualquier consulta, reclamo o notificación legal, el medio de
          contacto válido es:{" "}
          <strong>flowdexacademy@flowdex.com.ar</strong>
        </p>
      </section>

      <section>
        <h2>2. Aceptación de los Términos</h2>
        <p>
          El acceso, navegación, registro o adquisición de cualquier servicio
          en la Plataforma implica la aceptación plena, expresa y sin reservas
          de los presentes Términos y Condiciones, así como de la{" "}
          <a href="/legal/privacidad">Política de Privacidad</a> y la{" "}
          <a href="/legal/reembolsos">Política de Reembolsos</a>. Si el usuario
          no está de acuerdo con alguno de los términos, debe abstenerse de
          usar la Plataforma.
        </p>
      </section>

      <section>
        <h2>3. Objeto del servicio</h2>
        <p>
          Flowdex es una <strong>plataforma de educación financiera</strong>{" "}
          que comercializa cursos digitales sobre inversiones, trading,
          análisis técnico, análisis fundamental y desarrollo personal aplicado
          al ámbito financiero.
        </p>
        <p>
          <strong>
            El contenido tiene carácter exclusivamente educativo e informativo.
            No constituye asesoramiento financiero, recomendación de compra o
            venta de instrumentos financieros, ni garantía de rendimiento.
          </strong>{" "}
          Los rendimientos pasados no garantizan rendimientos futuros. Operar
          en mercados financieros conlleva riesgo de pérdida total del capital.
          Antes de tomar decisiones de inversión, el usuario debe consultar a
          un asesor financiero registrado en la Comisión Nacional de Valores
          (CNV) o en el organismo regulador correspondiente a su jurisdicción.
        </p>
      </section>

      <section>
        <h2>4. Registro de usuario</h2>
        <p>
          Para acceder a los cursos pagos, el usuario debe registrarse
          proporcionando información veraz, completa y actualizada. El usuario
          es responsable de mantener la confidencialidad de sus credenciales y
          de toda actividad realizada bajo su cuenta.
        </p>
        <p>
          Flowdex se reserva el derecho de suspender o cancelar cuentas que
          infrinjan estos términos, compartan credenciales con terceros, o
          incurran en uso fraudulento.
        </p>
      </section>

      <section>
        <h2>5. Cursos y plazos de acceso</h2>
        <p>
          Cada curso tiene un plazo de acceso definido contado desde la fecha
          de habilitación de la cuenta de cada alumno:
        </p>
        <ul>
          <li>
            <strong>Kickstart Investment:</strong> 4 (cuatro) meses de acceso al
            contenido y a las clases en vivo agendadas.
          </li>
          <li>
            <strong>Kickstart Trading:</strong> 4 (cuatro) meses de acceso al
            contenido y a las clases en vivo agendadas.
          </li>
          <li>
            <strong>Expert Investment:</strong> 4 (cuatro) meses de acceso al
            contenido.
          </li>
          <li>
            <strong>Trading Lab:</strong> 4 (cuatro) meses de acceso al
            contenido.
          </li>
          <li>
            <strong>Inner Circle &mdash; La Obra Interior:</strong> 12 (doce)
            meses de acceso al contenido.
          </li>
        </ul>
        <p>
          Vencido el plazo, el acceso a los materiales del curso se interrumpe
          automáticamente. El usuario es responsable de consumir, descargar (en
          los casos permitidos) y aplicar el material dentro del plazo
          contratado.
        </p>
      </section>

      <section>
        <h2>6. Pagos y medios de cobro</h2>
        <p>
          Los precios están publicados en la Plataforma e incluyen los
          impuestos aplicables. Flowdex acepta pagos a través de los siguientes
          medios:
        </p>
        <ul>
          <li>
            <strong>MercadoPago</strong> (tarjetas de crédito, débito,
            transferencia bancaria y otros medios disponibles en la pasarela).
          </li>
          <li>
            <strong>NowPayments</strong> (pagos en criptomonedas habilitadas).
          </li>
        </ul>
        <p>
          La habilitación del acceso al curso ocurre una vez confirmada la
          acreditación del pago por parte de la pasarela correspondiente. El
          usuario reconoce que los tiempos de acreditación pueden variar según
          el medio elegido.
        </p>
      </section>

      <section>
        <h2>7. Política de reembolsos</h2>
        <p>
          La política de reembolsos de Flowdex se rige por lo establecido en
          el artículo 34 de la Ley 24.240 (Defensa del Consumidor) y se detalla
          en la <a href="/legal/reembolsos">Política de Reembolsos</a>. En
          términos generales:
        </p>
        <ul>
          <li>
            El usuario tiene derecho a revocar la compra dentro de los{" "}
            <strong>10 (diez) días corridos</strong> contados desde la fecha de
            adquisición, siempre que <strong>no haya accedido al contenido del
            curso</strong>.
          </li>
          <li>
            Una vez que el usuario accede al contenido (visualiza módulos,
            descarga material o consume cualquier sección del curso), se
            considera que el servicio fue prestado y no aplica reembolso.
          </li>
        </ul>
      </section>

      <section>
        <h2>8. Propiedad intelectual</h2>
        <p>
          Todo el contenido publicado en la Plataforma (textos, gráficos,
          videos, código, imágenes, marcas, indicadores, plantillas, ejercicios
          y cualquier otro material) es propiedad exclusiva del Titular o de
          terceros que han autorizado su uso, y está protegido por las leyes
          argentinas e internacionales sobre propiedad intelectual y derechos
          de autor (en particular, la <strong>Ley 11.723</strong> y la{" "}
          <strong>Ley 24.766 de Confidencialidad</strong>).
        </p>
        <p>
          Sin perjuicio de los términos generales, se deja expresa constancia
          de que el <strong>método pedagógico Flowdex</strong> —la secuencia
          didáctica, la progresión Kickstart → Avanzado → Inner Circle, los
          sistemas propios <strong>FPM</strong> (Flowdex Position Method) y{" "}
          <strong>ORB</strong> (Opening Range Breakout Flowdex), los manuales
          de comunidad y todo material no publicado al público general— tiene
          el carácter de <strong>know-how y secreto comercial</strong> del
          Titular. El detalle exhaustivo de la protección está disponible en
          el aviso de{" "}
          <a href="/legal/propiedad-intelectual">Propiedad Intelectual</a>.
        </p>
        <p>
          El acceso al contenido se otorga al usuario en forma{" "}
          <strong>personal, intransferible, no exclusiva y revocable</strong>,
          únicamente para fines educativos personales. El usuario se
          compromete a:
        </p>
        <ul>
          <li>
            No copiar, reproducir, distribuir, retransmitir, publicar o
            comercializar el contenido por cualquier medio.
          </li>
          <li>
            <strong>No compartir sus credenciales de acceso</strong> ni dar
            acceso a su cuenta a terceros. La cuenta es estrictamente
            personal. Compartir credenciales habilita la cancelación inmediata
            de la cuenta <strong>sin derecho a reembolso</strong> por el
            período no consumido.
          </li>
          <li>
            No grabar, capturar pantalla, transmitir en vivo ni registrar de
            cualquier forma las clases en vivo, las sesiones del Inner Circle
            ni las interacciones con el Titular o sus colaboradores.
          </li>
          <li>
            No crear obras derivadas, resúmenes pagos, cursos paralelos ni
            material formativo basado en el método Flowdex sin licencia
            expresa y por escrito del Titular.
          </li>
          <li>
            No realizar ingeniería inversa del contenido ni del código de la
            Plataforma, ni eludir las medidas técnicas de protección
            implementadas (bloqueo de copia, avisos legales, restricciones de
            acceso).
          </li>
        </ul>
        <p>
          El incumplimiento de estas obligaciones autoriza a Flowdex a
          cancelar la cuenta del usuario sin derecho a reembolso, e iniciar
          las acciones legales civiles y penales que correspondan, incluidas
          las previstas en los <strong>artículos 71 a 78 de la Ley 11.723</strong>,
          que prevén penas de un mes a seis años de prisión para quien
          defraude los derechos de propiedad intelectual.
        </p>
      </section>

      <section>
        <h2>9. Uso permitido y prohibido</h2>
        <p>El usuario se compromete a:</p>
        <ul>
          <li>
            Usar la Plataforma con fines personales y educativos, no
            comerciales ni con fines de reventa.
          </li>
          <li>
            No utilizar la Plataforma para actividades ilegales, fraudulentas o
            que vulneren los derechos de terceros.
          </li>
          <li>
            No intentar vulnerar la seguridad de la Plataforma ni acceder a
            áreas restringidas.
          </li>
          <li>
            No usar el contenido para asesoramiento financiero a terceros sin
            la habilitación correspondiente de la CNV.
          </li>
        </ul>
      </section>

      <section>
        <h2>10. Limitación de responsabilidad</h2>
        <p>
          Flowdex provee educación financiera y herramientas pedagógicas. En
          ningún caso Flowdex, su Titular, colaboradores o asociados serán
          responsables por:
        </p>
        <ul>
          <li>
            Pérdidas, daños directos o indirectos derivados de decisiones de
            inversión tomadas por el usuario, ya sea con base en el contenido
            del curso, ejemplos pedagógicos o cualquier información obtenida en
            la Plataforma.
          </li>
          <li>
            Resultados financieros que no se ajusten a las expectativas del
            usuario.
          </li>
          <li>
            Interrupciones del servicio causadas por terceros (Vercel,
            Supabase, MercadoPago, NowPayments, Resend u otros proveedores de
            infraestructura).
          </li>
          <li>
            Pérdida de datos del usuario por causas ajenas a un dolo o culpa
            grave de Flowdex.
          </li>
        </ul>
        <p>
          La responsabilidad máxima de Flowdex frente al usuario, en cualquier
          caso, queda limitada al monto efectivamente abonado por el usuario en
          los últimos 12 (doce) meses por el servicio sobre el cual se reclama.
        </p>
      </section>

      <section>
        <h2>11. Modificación de los Términos</h2>
        <p>
          Flowdex se reserva el derecho de modificar estos Términos y
          Condiciones en cualquier momento. Las modificaciones se notificarán a
          través de la Plataforma con al menos 10 (diez) días de anticipación a
          su entrada en vigencia. Si el usuario no está de acuerdo, debe
          abstenerse de seguir usando la Plataforma.
        </p>
      </section>

      <section>
        <h2>12. Resolución de disputas y jurisdicción</h2>
        <p>
          Para cualquier reclamo o disputa, el usuario debe contactarse
          previamente con Flowdex al email{" "}
          <strong>flowdexacademy@flowdex.com.ar</strong>. Las partes intentarán resolver el
          conflicto de buena fe.
        </p>
        <p>
          En caso de no llegar a un acuerdo, el usuario puede acudir al{" "}
          <strong>Servicio de Conciliación Previa en las Relaciones de
          Consumo (COPREC)</strong> conforme a la Ley 26.993, o a las vías
          administrativas y judiciales que correspondan según la Ley 24.240 de
          Defensa del Consumidor.
        </p>
        <p>
          Para cuestiones no comprendidas en derechos del consumidor, las
          partes se someten a la jurisdicción de los Tribunales Ordinarios con
          competencia en{" "}
          <strong>Posadas, Provincia de Misiones</strong>,
          República Argentina, con renuncia expresa a cualquier otro fuero o
          jurisdicción que pudiera corresponder.
        </p>
      </section>

      <section>
        <h2>13. Contacto</h2>
        <p>
          Para cualquier consulta sobre estos Términos:
        </p>
        <ul>
          <li>
            Email: <strong>flowdexacademy@flowdex.com.ar</strong>
          </li>
          <li>
            Titular: <strong>Franco Escudero</strong>
          </li>
          <li>
            CUIT: <strong>20-35014589-4</strong>
          </li>
          <li>
            Domicilio: <strong>Florencio Sánchez 2464</strong>
          </li>
        </ul>
      </section>

      <section className="not-prose mt-12 rounded-xl border border-[#2A2A2A] bg-[#101010] p-6">
        <p className="text-xs text-[#888888] leading-relaxed">
          <strong className="text-white">Aviso final:</strong> al adquirir
          cualquier curso de Flowdex, el usuario declara haber leído,
          comprendido y aceptado estos Términos y Condiciones, la Política de
          Privacidad y la Política de Reembolsos.
        </p>
      </section>
    </article>
  )
}
