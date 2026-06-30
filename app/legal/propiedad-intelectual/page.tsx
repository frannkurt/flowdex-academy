import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Propiedad Intelectual | FLOWDEX",
  description:
    "Aviso de Propiedad Intelectual y reserva de derechos sobre el contenido, metodologia y marca de Flowdex.",
}

export default function PropiedadIntelectualPage() {
  const year = new Date().getFullYear()

  return (
    <article className="space-y-6">
      <header className="space-y-2 not-prose">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4B86A]">
          Información legal
        </p>
        <h1 className="text-4xl sm:text-5xl font-display tracking-wide text-white">
          Propiedad Intelectual
        </h1>
        <p className="text-sm text-[#888888]">
          Última actualización: mayo de {year}
        </p>
      </header>

      <section className="not-prose rounded-2xl border border-[#D4B86A]/30 bg-[#1A1408] p-5 sm:p-6">
        <p className="text-sm text-[#E6DAB6] leading-relaxed">
          <strong className="text-[#D4B86A]">© {year} FLOWDEX™ — Todos los derechos reservados.</strong>
          {" "}Todo el contenido, método, marca, código y universo simbólico
          publicado en esta plataforma es propiedad exclusiva de{" "}
          <strong className="text-white">Franco Escudero</strong> (CUIT
          20-35014589-4) y está protegido por la{" "}
          <strong className="text-white">Ley 11.723 de Propiedad Intelectual</strong>{" "}
          de la República Argentina, los tratados internacionales aplicables
          (Convenio de Berna, OMPI) y la legislación de los países donde se
          comercializa el servicio.
        </p>
      </section>

      <section>
        <h2>1. Alcance de la protección</h2>
        <p>
          La protección de propiedad intelectual de Flowdex alcanza, sin que
          esta enumeración sea taxativa, los siguientes elementos:
        </p>
        <ul>
          <li>
            <strong>Método pedagógico Flowdex:</strong> la secuencia didáctica,
            el orden de los módulos, la progresión Kickstart → Avanzado →
            Inner Circle, y la articulación entre los caminos de Inversiones y
            Trading, en tanto constituyen know-how original desarrollado por
            el Titular.
          </li>
          <li>
            <strong>Sistemas propios:</strong> los modelos de análisis y
            ejecución desarrollados por el Titular, incluyendo —sin agotar la
            enumeración— el sistema <strong>FPM</strong> (Flowdex Position
            Method) y el sistema <strong>ORB</strong> (Opening Range Breakout
            Flowdex), junto con sus reglas, criterios de entrada y salida,
            gestión de riesgo y plantillas asociadas.
          </li>
          <li>
            <strong>Contenido audiovisual y escrito:</strong> videos, clases en
            vivo, grabaciones, presentaciones, textos, transcripciones,
            ejemplos pedagógicos, casos de estudio y cualquier material
            producido por el Titular o por terceros bajo encargo.
          </li>
          <li>
            <strong>Plantillas y anexos:</strong> los workbooks, kits de
            auditoría, trackers, plantillas de journal, glosarios, cartas a
            futuro y demás recursos descargables, incluidos los anexos del
            programa Inner Circle (Anexos A a G).
          </li>
          <li>
            <strong>Código fuente y plataforma:</strong> el código de la
            aplicación web, las integraciones con servicios de pago, la
            arquitectura de datos, los componentes visuales y la
            infraestructura desarrollada por o para el Titular.
          </li>
          <li>
            <strong>Universo simbólico y marca:</strong> el nombre{" "}
            <strong>FLOWDEX</strong>, el logotipo orbital, los nombres de los
            cursos, la tipografía propia, la paleta cromática (turquesa #7DD4C0,
            celeste #5BB8D4, dorado #D4B86A) en su uso característico, los
            personajes y elementos narrativos (incluido el universo de{" "}
            <em>La Dama</em>), y todo signo distintivo que identifique a la
            plataforma.
          </li>
          <li>
            <strong>Comunidades y eventos:</strong> el material producido
            durante las clases en vivo, las reviews semanales, las sesiones de
            Inner Circle, los hilos en canales privados y todo contenido
            generado por el Titular o sus colaboradores en el marco de la
            comunidad Flowdex.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Conductas prohibidas</h2>
        <p>
          El acceso al contenido se otorga al usuario en forma{" "}
          <strong>personal, intransferible, no exclusiva y revocable</strong>,
          únicamente para fines educativos personales. Queda expresamente
          prohibido, sin autorización previa y por escrito del Titular:
        </p>
        <ul>
          <li>
            Copiar, reproducir, modificar, traducir, descompilar, retransmitir,
            distribuir, publicar, exhibir, comercializar o explotar de
            cualquier forma —total o parcialmente— el contenido de Flowdex.
          </li>
          <li>
            Compartir las credenciales de acceso, los enlaces privados o
            cualquier material descargable con terceros, sean estos personas
            físicas, jurídicas, redes sociales, grupos cerrados o canales
            públicos.
          </li>
          <li>
            Grabar, capturar pantalla, transmitir en vivo o registrar de
            cualquier forma las clases en vivo, sesiones del Inner Circle o
            cualquier interacción con el Titular o sus colaboradores.
          </li>
          <li>
            Crear obras derivadas, resúmenes pagos, cursos paralelos o
            material formativo basado en el método Flowdex sin licencia
            expresa del Titular.
          </li>
          <li>
            Utilizar el método, sistemas propios o cualquier elemento
            protegido para fines de asesoramiento financiero a terceros, sin
            la habilitación regulatoria que corresponda según jurisdicción.
          </li>
          <li>
            Usar la marca FLOWDEX, sus signos distintivos o cualquier
            elemento del universo simbólico en productos, servicios,
            publicaciones o redes sociales propias sin autorización escrita.
          </li>
          <li>
            Eludir, desactivar o intentar vulnerar las medidas técnicas de
            protección implementadas en la plataforma (bloqueo de copia,
            avisos legales, restricciones de acceso, marcas de agua).
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Confidencialidad y secreto comercial</h2>
        <p>
          El método pedagógico Flowdex, los sistemas propios (FPM, ORB y
          futuros desarrollos), las plantillas internas, los manuales de
          comunidad y todo material no publicado al público general tienen el
          carácter de <strong>know-how y secreto comercial</strong> del
          Titular, conforme la Ley 24.766 de Confidencialidad. El usuario
          que accede a este material en cualquier programa de Flowdex se
          compromete expresamente a no divulgarlo, ni durante ni después de
          la vigencia del acceso contratado.
        </p>
      </section>

      <section>
        <h2>4. Sanciones por incumplimiento</h2>
        <p>
          El incumplimiento de las obligaciones establecidas en este aviso
          y/o en los Términos y Condiciones generales habilita al Titular,
          sin necesidad de intimación previa, a:
        </p>
        <ul>
          <li>
            Suspender o cancelar la cuenta del usuario infractor,{" "}
            <strong>sin derecho a reembolso</strong> alguno por el período no
            consumido.
          </li>
          <li>
            Iniciar las acciones civiles que correspondan, incluyendo la
            reparación integral del daño moral y patrimonial, lucro cesante
            y daño emergente.
          </li>
          <li>
            Iniciar las acciones penales previstas en los artículos 71 a 78
            de la Ley 11.723, que prevén penas de un mes a seis años de
            prisión para quien defraude los derechos de propiedad intelectual.
          </li>
          <li>
            Solicitar medidas cautelares (secuestro de copias, cese de
            comercialización, prohibición de innovar) ante la justicia
            competente.
          </li>
          <li>
            Reclamar las costas y honorarios profesionales derivados de la
            acción legal.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Uso autorizado</h2>
        <p>
          Sin perjuicio de las prohibiciones anteriores, el usuario puede:
        </p>
        <ul>
          <li>
            Tomar notas personales del contenido, en cuadernos físicos o
            archivos privados, para uso individual.
          </li>
          <li>
            Aplicar el método y los sistemas en su propia operatoria
            personal, con su propio capital y bajo su propio riesgo.
          </li>
          <li>
            Citar a Flowdex como fuente, con mención expresa del autor y
            link a la plataforma, en piezas no comerciales (artículos
            personales, comentarios en redes), siempre que la cita no
            sustituya el contenido original ni exceda lo razonable.
          </li>
          <li>
            Compartir el enlace público de la landing (
            <a href="https://flowdex.com.ar">flowdex.com.ar</a>) y de las
            piezas de comunicación del Instagram oficial.
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Denuncias de infracción</h2>
        <p>
          Si encontrás contenido protegido de Flowdex publicado o
          comercializado sin autorización en cualquier plataforma, podés
          reportarlo al email <strong>flowdexacademy@flowdex.com.ar</strong> con la
          siguiente información:
        </p>
        <ul>
          <li>URL o ubicación del contenido infractor.</li>
          <li>Descripción del material que considerás infringido.</li>
          <li>Fecha y forma en que tomaste conocimiento.</li>
          <li>
            Tus datos de contacto para que el equipo pueda agradecerte y
            mantenerte informado del avance.
          </li>
        </ul>
        <p>
          El equipo legal de Flowdex evaluará el caso e iniciará las
          gestiones correspondientes (intimación, takedown, acción judicial)
          según gravedad.
        </p>
      </section>

      <section>
        <h2>7. Reserva expresa de derechos</h2>
        <p>
          Todos los derechos no expresamente concedidos al usuario en este
          aviso o en los Términos y Condiciones quedan{" "}
          <strong>expresamente reservados</strong> al Titular. Ninguna
          omisión, tolerancia o demora en el ejercicio de un derecho podrá
          interpretarse como renuncia al mismo.
        </p>
      </section>

      <section>
        <h2>8. Contacto</h2>
        <p>Para cualquier consulta, licenciamiento o reporte de infracción:</p>
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
            Domicilio legal:{" "}
            <strong>Florencio Sánchez 2464, Argentina</strong>
          </li>
        </ul>
      </section>

      <section className="not-prose mt-12 rounded-xl border border-[#D4B86A]/30 bg-[#1A1408] p-6">
        <p className="text-xs text-[#E6DAB6] leading-relaxed">
          <strong className="text-[#D4B86A]">Aviso final:</strong> al acceder
          al contenido pago de Flowdex, el usuario declara haber leído,
          comprendido y aceptado el presente Aviso de Propiedad Intelectual
          junto con los Términos y Condiciones. Cualquier uso no autorizado
          del contenido protegido constituye una infracción a la Ley 11.723 y
          habilita las acciones civiles y penales detalladas.
        </p>
      </section>
    </article>
  )
}
