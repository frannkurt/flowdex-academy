"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Lora } from "next/font/google"
import { AnimatePresence, m as motion } from "framer-motion"
import Lenis from "lenis"
import { MusicToggle } from "@/components/la-dama/MusicToggle"

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
})

function Divider() {
  return (
    <div className="flex justify-center py-6" aria-hidden>
      <span className="text-xl text-[#D4B86A]/40">—</span>
    </div>
  )
}

export function LaDamaPageClient() {
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    if (!hasEntered) return

    const lenis = new Lenis({
      duration: 1.35,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 0.95,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    })

    let frameId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frameId = window.requestAnimationFrame(raf)
    }

    frameId = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [hasEntered])

  const handleEnter = () => {
    setHasEntered(true)
  }

  return (
    <main
      className={`relative isolate min-h-screen overflow-x-hidden bg-[#0A0A0A] text-[#E8E8E8] ${lora.className}`}
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/la-dama/hero.jpeg')" }}
        />
        <div className="absolute inset-0 bg-[#040404]/52" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 28%, rgba(10,10,10,0.04) 0%, rgba(10,10,10,0.48) 58%, rgba(10,10,10,0.8) 100%)",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!hasEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/95 px-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto flex max-w-lg flex-col items-center text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-[#D4B86A]/60">
                Flowdex · Descubrimiento
              </p>
              <h2 className="mt-4 text-4xl italic text-white sm:text-5xl">
                Encontraste a La Dama
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#BDBDBD] sm:text-base">
                Nunca terminas de conocerla. Se deja leer con el tiempo.
              </p>
              <button
                type="button"
                onClick={handleEnter}
                className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-[#D4B86A]/45 bg-[#111111]/85 px-6 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#E5E5E5] transition-all duration-300 hover:border-[#D4B86A]/80 hover:bg-[#181818] hover:text-white"
              >
                Entrar
              </button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

      <Link
        href="/"
        aria-label="Volver"
        className="fixed top-6 left-6 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#0A0A0A]/60 text-[#888888] backdrop-blur-md transition hover:border-[#5BB8D4]/40 hover:text-[#E8E8E8] sm:top-8 sm:left-8"
      >
        <ArrowLeft size={16} />
      </Link>

      <section className="relative z-10 flex h-[78vh] min-h-[520px] w-full items-end justify-center pb-16 sm:pb-20">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center"
        >
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#D4B86A]/80">
            Flowdex · Buenos Aires
          </p>
          <h1 className="text-5xl font-normal italic text-white sm:text-7xl">
            La dama
          </h1>
          <div className="mx-auto mt-7 h-px w-12 bg-[#D4B86A]/30" />
          <div className="mt-7 flex justify-center">
            <MusicToggle />
          </div>
        </motion.div>
      </section>

      <article className="relative z-10 mx-auto max-w-[640px] px-6 pb-32 pt-8 sm:px-8 sm:pt-12">
        <div className="space-y-6 text-[17px] leading-[1.85] text-[#D5D5D5] sm:text-[18px] sm:leading-[1.9]">
          <p>
            A los que recién la conocen, el mercado les parece un animal. Un
            toro o un oso, según el día. Algo a domar.
          </p>
          <p>
            Con el tiempo — si la suerte les llega antes que se cansen de
            pelear — entienden que no es un animal. Es una dama. Y al mercado
            no se lo doma. Se baila con ella.
          </p>
          <p>
            Es el baile más largo del mundo. Empieza cuando uno entra y
            termina cuando uno se va, no antes. Suena un bandoneón que nadie
            compuso, salido de un fondo invisible. Las luces son tibias,
            bajas, casi de vela. El piso de madera, pulido por años de pasos,
            brilla apagado bajo los zapatos. Ella no espera al otro lado de
            la pista ni hay que cruzar un salón para encontrarla — ella es
            la pista, es el bandoneón, es el baile mismo. Uno se acomoda la
            corbata y entra.
          </p>
          <p>
            Y desde el primer instante uno la siente. Hay algo en el aire del
            salón — una densidad — que no estaba antes de cruzar la puerta.
            No es belleza en el sentido común. Es la atracción que viene del
            enigma: la sensación, casi inmediata, de que adentro hay algo
            que vale la pena entender.
          </p>
          <p>
            La primera vez uno la abraza torpe, sin saber dónde van las
            manos. Marca una figura con apuro, sin compás, antes de escuchar
            el bandoneón. Le pisa los pies sin darse cuenta. No es maldad —
            es no saber. Ella no se enoja. Ella nunca se enoja. Lo deja
            seguir.
          </p>
          <p>
            Porque la dama es eterna. Antes que uno naciera, antes que
            nacieran sus padres, antes que nacieran los padres de sus padres,
            ya estaba ella sonando ese bandoneón, marcando ese compás. Y
            lleva todos esos años bailando despacio, para que algún día — si
            alguien aprende — pueda seguirle el paso.
          </p>
          <p>
            Con el tiempo las cosas se acomodan. El ritmo empieza a
            ofrecerse en vez de imponerse. La pausa deja de parecer silencio
            y se vuelve parte de la figura. El abrazo aprende a sostenerse
            aunque ella se aleje un paso. Uno mira el piso de a ratos no
            para guiarse, sino para escucharlo. La próxima figura no se
            adivina — se espera.
          </p>
          <p>
            Ella nunca corrige en voz alta. No hace falta. Cuando uno pisa
            mal, lo siente uno. Cuando uno entra a destiempo, lo siente uno.
            Cuando uno quiere llevarla a una figura que no es para esta
            canción, lo siente uno. Ella sigue. Lo demás se acomoda solo,
            adentro, en el silencio entre un compás y el otro.
          </p>
          <p>
            Ella no está ahí para enseñar. Está para bailar. El que quiera
            aprender, aprende afuera — con un maestro, con horas, con
            espejo, con paciencia. Cuando uno vuelve al baile, ella sigue.
            Igual que siempre. No se fue. Nunca se va.
          </p>

          <Divider />

          <p>Hay años que no se cuentan.</p>
          <p>
            Años en los que uno entra al salón cada noche, abraza a la dama,
            intenta seguirla, y sale derrotado. No con la derrota grande del
            que pierde todo — con la chica, la silenciosa, la que duele más:
            la del que sigue creyendo que la próxima canción va a ser distinta.
          </p>
          <p>
            Hay noches en que uno se queda después del último compás. Ella
            sigue ahí — nunca se va. Uno la ve bailar sola, despacito, sin
            nadie con quien bailar, y la estudia desde lejos. Hay madrugadas
            en que repasa figura por figura buscando el momento en que se
            equivocó. Hay días en que responde{" "}
            <em className="text-[#BBBBBB]">
              &ldquo;ahí, leyendo, mejorando&rdquo;
            </em>{" "}
            a la gente que pregunta cómo va. Y se acuesta sabiendo que el
            progreso, hasta ahora, fue una historia que se contó a sí mismo.
          </p>
          <p>
            Hay noches en que uno no la puede sacar de la cabeza. Le habla en
            silencio cuando todos duermen. Le promete cosas que no va a poder
            cumplir. Hay madrugadas en que uno llora sin saber bien si por
            ella o por uno mismo. Y hay momentos en que uno se mira al espejo
            y entiende, con la claridad que da el agotamiento, que esto no es
            para uno. Que se está engañando. Que debería cerrar la puerta del
            salón y no volver.
          </p>
          <p>
            Pero al día siguiente uno está de vuelta. Con la corbata acomodada.
            Como si la decisión nunca se hubiera tomado.
          </p>
          <p>
            Lo único que no se puede hacer es irse del todo. Porque algo
            adentro de uno entendió, sin poder explicarlo, que hay algo más en
            ella. Que no es lo que parece. Que su misterio atrae más de lo que
            su rechazo aleja.
          </p>
          <p>Y se sigue. Se sigue año tras año.</p>
          <p>
            Hasta que llega una noche. Para algunos llega temprano, para otros
            tarde, para muchos no llega nunca. Pero a los que les llega les
            pasa lo mismo.
          </p>
          <p>
            Esa noche uno se queda solo después de que el salón se vacía. Y
            se pone, agachado, a leer las marcas que dejaron sus movimientos
            en las tablas del piso. Las marcas profundas son las figuras que
            más repite. Las tenues son los lugares por donde a veces pasa
            pero no termina. Si uno mira con paciencia, las marcas dicen
            cosas. Dónde se detiene. Dónde da la vuelta. Cuándo va a volver.
          </p>
          <p>
            Y mientras uno está ahí, agachado, leyendo las marcas, algo se
            acomoda adentro. Uno deja de pedirle respuestas a la dama y
            empieza a hacerse las preguntas a sí mismo.
          </p>
          <p>
            Esa noche es el comienzo de bailar de verdad. Todo lo anterior
            fue mover los pies.
          </p>
          <p>
            Y lo que se entiende esa noche es que es ella la que lleva el
            ritmo. Aunque uno crea que la marca es suya, aunque uno crea que
            elige la próxima figura, el compás lo pone ella. La pausa, la
            aceleración, el silencio antes del próximo paso — todo viene de
            su lado. Lo único que uno hace, en realidad, es entrar en su
            tiempo. Los que entran en su tiempo bailan. Los que insisten en
            imponer el suyo se gastan los años intentando dominar lo que
            solo se acompaña.
          </p>
          <p>
            Y se entiende también que la dama no es difícil. La parte difícil
            es uno. El apuro. La necesidad de mostrarse. La memoria de la
            última vez que algo salió mal. La cabeza en otra parte. Cuando
            uno se aquieta, la habitación se aquieta. La dama es la misma,
            el bandoneón es el mismo. Pero ya no hay pelea con nada. Hay
            baile.
          </p>
          <p>
            Por eso los buenos no parecen hacer gran cosa cuando uno los ve
            bailar. Caminan. Hacen pausas. A veces se quedan quietos un
            compás entero, escuchando. Y al despedirse de la dama, ella los
            saluda con una inclinación apenas, sugiriendo que no se va a ir,
            que va a seguir ahí, que bastará con que uno vuelva. Y uno sabe,
            en el fondo, que ella va a estar eternamente en la pista
            bailando.
          </p>
          <p>
            Los que se van sin entender no se van enojados con ella. Al
            tiempo se dan cuenta. Vuelven en otra estación, con más años en
            el cuerpo, con menos apuro en los pies, dispuestos a empezar de
            nuevo desde el primer paso. Y ella los recibe sin preguntarles
            dónde estuvieron. Como si nunca se hubieran ido.
          </p>

          <Divider />

          <p className="text-center italic text-[#888888]">
            El bandoneón está arrancando.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.45 }}
            className="pt-8"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#programas"
                className="inline-flex h-10 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#111111]/80 px-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D7D7D7] transition-all duration-300 hover:border-[#5BB8D4]/45 hover:bg-white/5 hover:text-white"
              >
                Ver cursos
              </Link>
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#111111]/80 px-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D7D7D7] transition-all duration-300 hover:border-[#7DD4C0]/45 hover:bg-white/5 hover:text-white"
              >
                Volver al universo
              </Link>
            </div>
            <p className="mx-auto mt-5 max-w-md text-center text-xs leading-relaxed text-[#7F7F7F]">
              La encontraste. Ahora podés seguir el compás o volver al resto del universo Flowdex.
            </p>
          </motion.div>
        </div>

        <div className="mt-20 flex flex-col items-center gap-4">
          <div className="h-px w-12 bg-[#D4B86A]/30" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#D4B86A]/60">
            Flowdex · Buenos Aires
          </p>
        </div>
      </article>
    </main>
  )
}