import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Reembolsos | FLOWDEX",
  description:
    "Política de reembolsos y derecho de revocación de la plataforma educativa Flowdex.",
}

export default function ReembolsosPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2 not-prose">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4B86A]">
          Información legal
        </p>
        <h1 className="text-4xl sm:text-5xl font-display tracking-wide text-white">
          Política de Reembolsos
        </h1>
        <p className="text-sm text-[#888888]">
          Última actualización: mayo de 2026
        </p>
      </header>

      <section>
        <h2>1. Marco legal</h2>
        <p>
          Esta política se rige por la <strong>Ley 24.240 de Defensa del
          Consumidor</strong> de la República Argentina, en particular su{" "}
          <strong>artículo 34</strong>, que establece el derecho de revocación
          en operaciones celebradas a distancia. Esta política es parte
          integrante de los{" "}
          <a href="/legal/terminos">Términos y Condiciones</a> y debe leerse en
          conjunto con ellos.
        </p>
      </section>

      <section>
        <h2>2. Naturaleza del producto</h2>
        <p>
          Flowdex comercializa <strong>contenido digital de descarga
          inmediata y prestación instantánea</strong> (cursos online, material
          educativo, acceso a clases en vivo). Una vez que el usuario habilita
          su cuenta y accede al contenido, el servicio se considera prestado
          desde el primer minuto en que se consume parte del material.
        </p>
      </section>

      <section>
        <h2>3. Derecho de revocación (10 días corridos)</h2>
        <p>
          Conforme al art. 34 de la Ley 24.240, el usuario tiene derecho a{" "}
          <strong>revocar la compra dentro de los 10 (diez) días corridos</strong>{" "}
          contados desde la fecha de adquisición o desde la fecha de
          habilitación de la cuenta, lo que ocurra después,{" "}
          <strong>siempre que no haya accedido al contenido del curso</strong>.
        </p>
        <p>
          Para que aplique la revocación:
        </p>
        <ul>
          <li>
            La solicitud debe enviarse dentro del plazo de 10 días corridos.
          </li>
          <li>
            El usuario <strong>no debe haber accedido al contenido</strong> del
            curso (no haber visualizado módulos, no haber descargado material,
            no haber asistido a clases en vivo, no haber utilizado funciones
            premium del curso).
          </li>
          <li>
            La solicitud debe enviarse al email{" "}
            <strong>flowdexacademy@flowdex.com.ar</strong> incluyendo: nombre, apellido,
            email registrado, curso adquirido y fecha de compra.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Casos en que NO aplica reembolso</h2>
        <p>
          Por la naturaleza digital y de prestación inmediata del servicio,{" "}
          <strong>no aplica reembolso en los siguientes casos</strong>:
        </p>
        <ul>
          <li>
            Cuando el usuario haya <strong>accedido al contenido del curso</strong>{" "}
            (visualizar al menos un módulo o sección, descargar material,
            asistir a una clase en vivo, etc.).
          </li>
          <li>
            Cuando hayan transcurrido los 10 días corridos desde la fecha de
            compra o habilitación de la cuenta.
          </li>
          <li>
            Cuando el motivo del reembolso sea la falta de resultados
            financieros, dado que Flowdex es educación y no garantiza
            rendimientos.
          </li>
          <li>
            Cuando el usuario haya violado los Términos y Condiciones
            (compartir credenciales, redistribuir contenido, etc.).
          </li>
          <li>
            Cuando el usuario haya completado el curso o consumido la mayoría
            de su contenido.
          </li>
        </ul>
        <p>
          Esta política se justifica en que el contenido digital es de
          consumo inmediato y, una vez accedido, su valor económico se
          transfiere al usuario aunque no continúe consumiéndolo. Es la práctica
          estándar en plataformas de cursos digitales (consistente con el art.
          34 LDC, que excepciona los productos consumidos del derecho de
          revocación).
        </p>
      </section>

      <section>
        <h2>5. Proceso de solicitud</h2>
        <p>Para solicitar un reembolso:</p>
        <ol>
          <li>
            Enviá un email a <strong>flowdexacademy@flowdex.com.ar</strong> con asunto{" "}
            <em>&quot;Solicitud de revocación de compra&quot;</em>.
          </li>
          <li>
            Incluí: nombre completo, email de la cuenta, curso adquirido,
            fecha de compra y medio de pago utilizado.
          </li>
          <li>
            Flowdex te confirmará la recepción dentro de los 2 días hábiles.
          </li>
          <li>
            Si la solicitud cumple los requisitos del punto 3, el reembolso se
            procesará dentro de los <strong>10 días hábiles</strong> contados
            desde la confirmación de procedencia.
          </li>
          <li>
            El reembolso se realizará por el mismo medio de pago utilizado en
            la compra. Los tiempos de acreditación efectiva dependen del
            proveedor (MercadoPago, banco emisor, exchange de criptomonedas).
          </li>
        </ol>
      </section>

      <section>
        <h2>6. Reembolsos en pagos con criptomonedas</h2>
        <p>
          En el caso de pagos realizados a través de NowPayments (criptomonedas):
        </p>
        <ul>
          <li>
            El reembolso se realizará en la misma criptomoneda originalmente
            utilizada.
          </li>
          <li>
            El monto reembolsado será equivalente al valor en USD pagado al
            momento de la compra, no al valor de la criptomoneda al momento
            del reembolso.
          </li>
          <li>
            Las comisiones de red (gas fees) de la blockchain corren por cuenta
            del usuario y se descuentan del monto reembolsado.
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Casos excepcionales</h2>
        <p>
          Flowdex evaluará caso por caso situaciones excepcionales que no
          estén contempladas en esta política. Algunos ejemplos en los que
          podríamos otorgar reembolso o crédito en cuenta a discreción:
        </p>
        <ul>
          <li>
            Errores técnicos imputables a Flowdex que hayan impedido el acceso
            al contenido durante un período significativo.
          </li>
          <li>
            Doble cobro por error de la pasarela.
          </li>
          <li>
            Compra accidental que el usuario reporte dentro de las 48 horas y
            sin acceso al contenido.
          </li>
        </ul>
      </section>

      <section>
        <h2>8. Reclamos ante autoridades de defensa del consumidor</h2>
        <p>
          Si considerás que tu reclamo no fue resuelto adecuadamente, podés
          recurrir a:
        </p>
        <ul>
          <li>
            <strong>Servicio de Conciliación Previa en las Relaciones de
            Consumo (COPREC)</strong>, conforme a la Ley 26.993.{" "}
            <a
              href="https://www.argentina.gob.ar/produccion/defensadelconsumidor"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sitio oficial
            </a>
            .
          </li>
          <li>
            <strong>Dirección de Defensa al Consumidor</strong> de tu
            jurisdicción provincial o municipal.
          </li>
          <li>
            <strong>Justicia ordinaria</strong> con competencia en el domicilio
            del consumidor (art. 36 Ley 24.240).
          </li>
        </ul>
      </section>

      <section>
        <h2>9. Contacto</h2>
        <p>
          Para cualquier consulta sobre esta política o para iniciar una
          solicitud:
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
        </ul>
      </section>

      <section className="not-prose mt-12 rounded-xl border border-[#2A2A2A] bg-[#101010] p-6">
        <p className="text-xs text-[#888888] leading-relaxed">
          <strong className="text-white">Resumen:</strong> tenés 10 días
          corridos desde la compra para arrepentirte si NO accediste al
          contenido. Una vez que entrás a un módulo, descargás material o
          empezás a consumir el curso, el servicio se considera prestado y no
          aplica reembolso. Esto es estándar en la industria de cursos
          digitales y está alineado con la Ley 24.240 de Defensa del Consumidor.
        </p>
      </section>
    </article>
  )
}
