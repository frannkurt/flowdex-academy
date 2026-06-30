import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad | FLOWDEX",
  description:
    "Política de Privacidad y tratamiento de datos personales de Flowdex.",
}

export default function PrivacidadPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2 not-prose">
        <p className="text-xs uppercase tracking-[0.3em] text-[#7DD4C0]">
          Información legal
        </p>
        <h1 className="text-4xl sm:text-5xl font-display tracking-wide text-white">
          Política de Privacidad
        </h1>
        <p className="text-sm text-[#888888]">
          Última actualización: mayo de 2026
        </p>
      </header>

      <section>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          El responsable del tratamiento de los datos personales recopilados a
          través de la plataforma <strong>FLOWDEX</strong> (en adelante, &quot;la
          Plataforma&quot;) es <strong>Franco Escudero</strong>,
          CUIT <strong>20-35014589-4</strong>, con domicilio en{" "}
          <strong>Florencio Sánchez 2464</strong>, República Argentina (en adelante,
          &quot;el Responsable&quot; o &quot;Flowdex&quot;).
        </p>
        <p>
          Esta Política se rige por la <strong>Ley 25.326 de Protección de los
          Datos Personales</strong> de la República Argentina y, cuando aplica,
          por el <strong>Reglamento General de Protección de Datos (GDPR -
          Reglamento UE 2016/679)</strong> para usuarios de la Unión Europea.
        </p>
      </section>

      <section>
        <h2>2. Datos que recolectamos</h2>
        <p>Flowdex recolecta los siguientes datos:</p>
        <ul>
          <li>
            <strong>Datos de registro:</strong> nombre, apellido, dirección de
            correo electrónico, contraseña (almacenada de forma cifrada).
          </li>
          <li>
            <strong>Datos de pago:</strong> los datos de tarjetas o medios de
            pago son procesados directamente por las pasarelas (MercadoPago,
            NowPayments). Flowdex NO almacena datos de tarjetas, números de
            cuentas bancarias ni claves de billeteras crypto.
          </li>
          <li>
            <strong>Datos de uso:</strong> progreso en los cursos, módulos
            completados, fechas de acceso, interacciones con el contenido.
          </li>
          <li>
            <strong>Datos técnicos:</strong> dirección IP, tipo de navegador,
            dispositivo, huella de dispositivo (device fingerprint), sistema
            operativo, páginas visitadas, tiempo de navegación.
          </li>
          <li>
            <strong>Comunicaciones:</strong> contenido de los emails que el
            usuario nos envíe y de las consultas realizadas por canales
            oficiales (Telegram, WhatsApp, formularios).
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Finalidad del tratamiento</h2>
        <p>Tus datos se utilizan para:</p>
        <ul>
          <li>
            Habilitar el acceso a los cursos adquiridos y prestar el servicio
            contratado.
          </li>
          <li>
            Procesar pagos y emitir comprobantes a través de las pasarelas
            correspondientes.
          </li>
          <li>
            Sincronizar el progreso del usuario entre dispositivos.
          </li>
          <li>
            Comunicarte información relevante sobre tu cuenta, cursos
            adquiridos, actualizaciones de contenido, novedades del programa y,
            si optaste por recibirlas, comunicaciones de marketing.
          </li>
          <li>
            Brindar soporte técnico y comercial.
          </li>
          <li>
            Cumplir con obligaciones legales (registros contables,
            requerimientos fiscales y judiciales).
          </li>
          <li>
            Mejorar la calidad del servicio mediante análisis estadísticos
            anonimizados.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Base legal del tratamiento</h2>
        <ul>
          <li>
            <strong>Ejecución del contrato:</strong> el tratamiento es necesario
            para prestarte el servicio que contrataste.
          </li>
          <li>
            <strong>Consentimiento:</strong> para comunicaciones de marketing,
            cookies no esenciales y cualquier tratamiento accesorio. Podés
            revocarlo en cualquier momento.
          </li>
          <li>
            <strong>Obligación legal:</strong> para cumplir requerimientos
            fiscales, contables o judiciales.
          </li>
          <li>
            <strong>Interés legítimo:</strong> para análisis estadísticos
            anonimizados, prevención de fraude y seguridad de la Plataforma,
            incluido el uso de la IP y la huella de dispositivo para evitar el
            uso de múltiples cuentas por una misma persona (anti-multicuenta),
            con retención acotada al plazo necesario para esa finalidad.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Cesión de datos a terceros</h2>
        <p>
          Para prestar el servicio, Flowdex utiliza proveedores de
          infraestructura que pueden tener acceso técnico a parte de los datos.
          Cada uno actúa como <strong>encargado del tratamiento</strong> y está
          obligado contractualmente a tratar los datos según las normas
          aplicables:
        </p>
        <ul>
          <li>
            <strong>Supabase Inc.</strong> (proveedor de base de datos y
            autenticación). Datos: registro, progreso, sesiones. Localización
            de servidores: Estados Unidos / Unión Europea.
          </li>
          <li>
            <strong>Vercel Inc.</strong> (hosting de la Plataforma). Datos:
            logs técnicos, IP, navegación. Localización: red global.
          </li>
          <li>
            <strong>Resend, Inc.</strong> (envío de emails transaccionales y
            de marketing). Datos: email, nombre, contenido del mensaje.
          </li>
          <li>
            <strong>MercadoPago S.R.L.</strong> (procesamiento de pagos en
            Argentina). Datos: nombre, email, datos de la transacción.
            Argentina.
          </li>
          <li>
            <strong>NowPayments OÜ</strong> (procesamiento de pagos en
            criptomonedas). Datos: email, datos de la transacción cripto.
            Estonia / Unión Europea.
          </li>
          <li>
            <strong>Vercel Analytics</strong> (estadísticas anonimizadas de
            uso de la Plataforma).
          </li>
          <li>
            <strong>Google Calendar / Calendly</strong> (agendamiento de clases
            en vivo cuando aplica). Datos: email, nombre, horario.
          </li>
        </ul>
        <p>
          Flowdex <strong>no vende, alquila ni cede tus datos personales a
          terceros con fines comerciales</strong>. Las cesiones a las pasarelas
          de pago y proveedores de infraestructura son las estrictamente
          necesarias para prestar el servicio.
        </p>
      </section>

      <section>
        <h2>6. Transferencias internacionales</h2>
        <p>
          Algunos proveedores (Supabase, Vercel, Resend, NowPayments) tienen
          servidores ubicados fuera de Argentina. Estas transferencias se
          realizan con garantías contractuales que aseguran un nivel adecuado
          de protección, conforme al art. 12 de la Ley 25.326 y, cuando aplica,
          a las cláusulas tipo de la Comisión Europea.
        </p>
      </section>

      <section>
        <h2>7. Cookies y tecnologías similares</h2>
        <p>La Plataforma utiliza cookies con los siguientes fines:</p>
        <ul>
          <li>
            <strong>Cookies estrictamente necesarias:</strong> para mantener la
            sesión iniciada y permitir el funcionamiento básico del sitio. No
            requieren consentimiento.
          </li>
          <li>
            <strong>Cookies de preferencias:</strong> para recordar el idioma
            seleccionado y otras preferencias del usuario.
          </li>
          <li>
            <strong>Cookies analíticas (Vercel Analytics):</strong> para medir
            el uso de la Plataforma de forma anonimizada y mejorar la
            experiencia.
          </li>
        </ul>
        <p>
          El usuario puede configurar su navegador para bloquear cookies, pero
          esto puede afectar el funcionamiento normal de la Plataforma.
        </p>
      </section>

      <section>
        <h2>8. Plazo de conservación</h2>
        <p>
          Conservamos los datos personales por los siguientes plazos:
        </p>
        <ul>
          <li>
            <strong>Datos de la cuenta:</strong> mientras la cuenta esté
            activa, más 5 años después del último acceso, conforme a las
            obligaciones contables y fiscales aplicables.
          </li>
          <li>
            <strong>Datos de pago:</strong> los plazos de retención de las
            pasarelas (típicamente 10 años por exigencia fiscal en Argentina).
          </li>
          <li>
            <strong>Logs técnicos:</strong> hasta 12 meses para fines de
            seguridad y prevención de fraude.
          </li>
          <li>
            <strong>Comunicaciones de marketing:</strong> hasta que el usuario
            revoque el consentimiento.
          </li>
        </ul>
      </section>

      <section>
        <h2>9. Derechos del titular de los datos</h2>
        <p>
          Conforme a la Ley 25.326 (y al GDPR cuando aplica), tenés derecho a:
        </p>
        <ul>
          <li>
            <strong>Acceder</strong> a tus datos personales que tenemos
            almacenados.
          </li>
          <li>
            <strong>Rectificar</strong> datos inexactos o incompletos.
          </li>
          <li>
            <strong>Suprimir</strong> tus datos cuando ya no sean necesarios o
            cuando hayas revocado el consentimiento (derecho al olvido).
          </li>
          <li>
            <strong>Oponerte</strong> al tratamiento por motivos legítimos.
          </li>
          <li>
            <strong>Solicitar la portabilidad</strong> de tus datos a otro
            responsable (cuando sea técnicamente posible).
          </li>
          <li>
            <strong>Revocar el consentimiento</strong> otorgado para
            tratamientos basados en consentimiento.
          </li>
          <li>
            <strong>Presentar reclamos</strong> ante la{" "}
            <strong>Agencia de Acceso a la Información Pública (AAIP)</strong>{" "}
            en Argentina, o ante la autoridad de control de tu país de
            residencia (en el caso de usuarios de la UE).
          </li>
        </ul>
        <p>
          Para ejercer estos derechos, escribinos a{" "}
          <strong>flowdexacademy@flowdex.com.ar</strong>. Te responderemos dentro de los
          plazos legales (10 días hábiles para acceso, 5 días hábiles para
          rectificación o supresión, conforme a la Ley 25.326 art. 14 y 16).
        </p>
      </section>

      <section>
        <h2>10. Seguridad de los datos</h2>
        <p>
          Flowdex implementa medidas técnicas y organizativas para proteger tus
          datos: cifrado en tránsito (HTTPS/TLS), almacenamiento de
          contraseñas mediante hash, autenticación segura mediante Supabase
          Auth, control de accesos basado en roles, monitoreo de actividad y
          backups periódicos.
        </p>
        <p>
          A pesar de estas medidas, ningún sistema es 100% inviolable. En caso
          de detectarse un incidente que comprometa datos personales, Flowdex
          notificará a los usuarios afectados y a la AAIP dentro de los plazos
          legales.
        </p>
      </section>

      <section>
        <h2>11. Menores de edad</h2>
        <p>
          La Plataforma está dirigida a personas mayores de 18 (dieciocho)
          años. No recolectamos intencionalmente datos de menores. Si tomamos
          conocimiento de que un menor se registró sin la autorización de sus
          padres o tutores, eliminaremos sus datos.
        </p>
      </section>

      <section>
        <h2>12. Cambios en esta Política</h2>
        <p>
          Esta Política puede actualizarse periódicamente. Los cambios se
          publicarán en esta misma página con la fecha de la última
          actualización. Si los cambios son sustanciales, se notificará al
          usuario por email con al menos 10 días de anticipación.
        </p>
      </section>

      <section>
        <h2>13. Contacto del responsable</h2>
        <p>
          Para consultas sobre esta Política o para ejercer tus derechos:
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
        <p>
          Autoridad de control en Argentina:{" "}
          <a
            href="https://www.argentina.gob.ar/aaip"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agencia de Acceso a la Información Pública (AAIP)
          </a>
          .
        </p>
      </section>
    </article>
  )
}
