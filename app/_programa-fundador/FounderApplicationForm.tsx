"use client"

import { useActionState, useRef, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { submitFounderApplicationAction, type SubmitFounderApplicationState } from "./actions"

const initialState: SubmitFounderApplicationState = { status: "idle" }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)",
        boxShadow: "0 10px 28px rgba(91,184,212,0.28)",
      }}
    >
      {pending ? "Enviando…" : "Enviar postulación"}
    </button>
  )
}

export function FounderApplicationForm() {
  const [state, formAction] = useActionState(submitFounderApplicationAction, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.status === "ok") {
      // Limpiamos el form si fue exitoso y scrolleamos al banner de éxito
      formRef.current?.reset()
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    } else if (state.status === "error" || state.status === "duplicate" || state.status === "rate_limited") {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [state.status])

  const fieldClass =
    "mt-1.5 w-full rounded-lg border border-[#2A2A2A] bg-[#0E0E0E] px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#555] focus:border-[#7DD4C0]"
  const labelClass = "block text-xs font-semibold uppercase tracking-[0.14em] text-[#9AA3AE]"

  return (
    <div ref={topRef}>
      {/* Banners de estado */}
      {state.status === "ok" && (
        <div className="mb-8 rounded-2xl border border-[#7DD4C0]/40 bg-gradient-to-br from-[#7DD4C0]/10 to-transparent p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7DD4C0]">Postulación recibida</p>
          <p className="mt-2 text-[15px] leading-relaxed text-white">{state.message}</p>
          <p className="mt-3 text-xs text-[#A8B4BA]">Si no te llega el email de confirmación en los próximos minutos, chequeá la carpeta de spam.</p>
        </div>
      )}

      {state.status === "error" && (
        <div className="mb-6 rounded-xl border border-[#7A2A2A] bg-[#2A1111]/70 px-4 py-3 text-sm text-[#F2B3B3]">
          {state.message}
        </div>
      )}

      {state.status === "duplicate" && (
        <div className="mb-6 rounded-xl border border-[#D4B86A]/40 bg-[#1F1A0E]/70 px-4 py-3 text-sm text-[#E8D6A4]">
          {state.message}
        </div>
      )}

      {state.status === "rate_limited" && (
        <div className="mb-6 rounded-xl border border-[#7A2A2A] bg-[#2A1111]/70 px-4 py-3 text-sm text-[#F2B3B3]">
          {state.message}
        </div>
      )}

      {state.status !== "ok" && (
        <form ref={formRef} action={formAction} className="space-y-7">
          {/* ── Identidad ── */}
          <fieldset className="space-y-4">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A]">
              Quién sos
            </legend>

            <div>
              <label htmlFor="full_name" className={labelClass}>
                Nombre completo
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                maxLength={120}
                autoComplete="name"
                className={fieldClass}
                placeholder="Juan Pérez"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  autoComplete="email"
                  className={fieldClass}
                  placeholder="juan@email.com"
                />
              </div>

              <div>
                <label htmlFor="age" className={labelClass}>
                  Edad
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min={14}
                  max={99}
                  className={fieldClass}
                  placeholder="28"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="country" className={labelClass}>
                  País
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  maxLength={80}
                  autoComplete="country-name"
                  className={fieldClass}
                  placeholder="Argentina"
                />
              </div>

              <div>
                <label htmlFor="city" className={labelClass}>
                  Ciudad
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  maxLength={80}
                  className={fieldClass}
                  placeholder="Buenos Aires"
                />
              </div>
            </div>

            <div>
              <label htmlFor="occupation" className={labelClass}>
                Ocupación
              </label>
              <input
                id="occupation"
                name="occupation"
                type="text"
                maxLength={160}
                className={fieldClass}
                placeholder="A qué te dedicás hoy"
              />
            </div>
          </fieldset>

          {/* ── Programa ── */}
          <fieldset className="space-y-4">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A]">
              A qué programa te postulás
            </legend>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="relative flex cursor-pointer flex-col gap-1 rounded-xl border border-[#2A2A2A] bg-[#0E0E0E] p-4 transition-colors has-[:checked]:border-[#5BB8D4] has-[:checked]:bg-[#5BB8D4]/8">
                <input type="radio" name="program_choice" value="kickstart-investment" required className="peer sr-only" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5BB8D4]">Inversión</span>
                <span className="text-sm font-semibold text-white">Kickstart Investment</span>
                <span className="text-xs text-[#888]">10 cuentas disponibles</span>
              </label>

              <label className="relative flex cursor-pointer flex-col gap-1 rounded-xl border border-[#2A2A2A] bg-[#0E0E0E] p-4 transition-colors has-[:checked]:border-[#7DD4C0] has-[:checked]:bg-[#7DD4C0]/8">
                <input type="radio" name="program_choice" value="kickstart-trading" className="peer sr-only" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7DD4C0]">Trading</span>
                <span className="text-sm font-semibold text-white">Kickstart Trading</span>
                <span className="text-xs text-[#888]">10 cuentas disponibles</span>
              </label>

              <label className="relative flex cursor-pointer flex-col gap-1 rounded-xl border border-[#2A2A2A] bg-[#0E0E0E] p-4 transition-colors has-[:checked]:border-[#D4B86A] has-[:checked]:bg-[#D4B86A]/8">
                <input type="radio" name="program_choice" value="either" className="peer sr-only" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4B86A]">Cualquiera</span>
                <span className="text-sm font-semibold text-white">Elegí ustedes</span>
                <span className="text-xs text-[#888]">Según mi perfil</span>
              </label>
            </div>
          </fieldset>

          {/* ── Perfil ── */}
          <fieldset className="space-y-4">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A]">
              Tu perfil
            </legend>

            <div>
              <label htmlFor="experience_level" className={labelClass}>
                Experiencia previa en inversiones o trading
              </label>
              <select
                id="experience_level"
                name="experience_level"
                required
                defaultValue=""
                className={fieldClass}
              >
                <option value="" disabled>Elegí una opción</option>
                <option value="zero">Cero · nunca invertí ni operé</option>
                <option value="some">Algo · probé algunas cosas sueltas</option>
                <option value="intermediate">Intermedio · tengo base, pero sin método claro</option>
                <option value="advanced">Avanzado · llevo tiempo y busco refinar</option>
              </select>
            </div>

            <div>
              <label htmlFor="motivation" className={labelClass}>
                Por qué querés entrar a Flowdex específicamente
              </label>
              <textarea
                id="motivation"
                name="motivation"
                required
                minLength={40}
                maxLength={800}
                rows={4}
                className={`${fieldClass} resize-y`}
                placeholder="Contanos en pocas líneas. Lo leemos uno por uno."
              />
              <p className="mt-1.5 text-[11px] text-[#666]">Mínimo 40 caracteres. Máximo 800.</p>
            </div>

            <div>
              <label htmlFor="goals_6m" className={labelClass}>
                Qué esperás aprender o cambiar en los próximos 6 meses
              </label>
              <textarea
                id="goals_6m"
                name="goals_6m"
                required
                minLength={30}
                maxLength={800}
                rows={3}
                className={`${fieldClass} resize-y`}
                placeholder="Sé concreto. ¿Operar tu primer instrumento? ¿Armar tu primera cartera? ¿Pasar una prop firm?"
              />
              <p className="mt-1.5 text-[11px] text-[#666]">Mínimo 30 caracteres. Máximo 800.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="weekly_hours"
                  className={`${labelClass} flex min-h-[2.75rem] items-start leading-snug`}
                >
                  Horas semanales que podés dedicar (realista)
                </label>
                <input
                  id="weekly_hours"
                  name="weekly_hours"
                  type="number"
                  min={1}
                  max={50}
                  className={fieldClass}
                  placeholder="5"
                />
                <p className="mt-1.5 text-[11px] text-[#666]">
                  No lo usamos para anunciar nada. Lo usamos para entender si vas a sostener.
                </p>
              </div>

              <div>
                <label
                  htmlFor="referral_source"
                  className={`${labelClass} flex min-h-[2.75rem] items-start leading-snug`}
                >
                  Cómo llegaste a Flowdex
                </label>
                <input
                  id="referral_source"
                  name="referral_source"
                  type="text"
                  maxLength={200}
                  className={fieldClass}
                  placeholder="Instagram, X, recomendación, Google, otro"
                />
                <p className="mt-1.5 text-[11px] text-[#666] invisible" aria-hidden="true">
                  No lo usamos para anunciar nada. Lo usamos para entender si vas a sostener.
                </p>
              </div>
            </div>
          </fieldset>

          {/* ── Logística ── */}
          <fieldset className="space-y-4">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4B86A]">
              Logística
            </legend>

            <div>
              <p className={labelClass}>Qué plataformas de chat usás (podés marcar las dos)</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#2A2A2A] bg-[#0E0E0E] px-4 py-2.5 has-[:checked]:border-[#7DD4C0]/60 has-[:checked]:bg-[#7DD4C0]/8">
                  <input type="checkbox" name="chat_platforms" value="telegram" className="h-4 w-4 accent-[#7DD4C0]" />
                  <span className="text-sm text-white">Telegram</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#2A2A2A] bg-[#0E0E0E] px-4 py-2.5 has-[:checked]:border-[#7DD4C0]/60 has-[:checked]:bg-[#7DD4C0]/8">
                  <input type="checkbox" name="chat_platforms" value="discord" className="h-4 w-4 accent-[#7DD4C0]" />
                  <span className="text-sm text-white">Discord</span>
                </label>
              </div>
            </div>

            <div className="space-y-2.5 rounded-xl border border-[#2A2A2A] bg-[#0E0E0E]/60 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="accepts_feedback"
                  required
                  className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#7DD4C0]"
                />
                <span className="text-sm text-[#DDD]">
                  Acepto dar feedback estructurado durante el programa (encuestas cortas y comentarios honestos).
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="accepts_participation"
                  required
                  className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#7DD4C0]"
                />
                <span className="text-sm text-[#DDD]">
                  Acepto participar activamente en la comunidad (mínimo un mensaje por semana).
                </span>
              </label>
            </div>

            <div>
              <label htmlFor="additional_notes" className={labelClass}>
                Algo más que quieras decirnos (opcional)
              </label>
              <textarea
                id="additional_notes"
                name="additional_notes"
                maxLength={1000}
                rows={3}
                className={`${fieldClass} resize-y`}
                placeholder="Cualquier cosa que sume contexto sobre tu situación o expectativa."
              />
            </div>
          </fieldset>

          <SubmitButton />

          <p className="text-center text-[11px] text-[#666]">
            Al postularte aceptás nuestros{" "}
            <a href="/legal/terminos" target="_blank" rel="noopener noreferrer" className="text-[#9AA3AE] hover:text-white underline underline-offset-2">
              Términos
            </a>{" "}
            y{" "}
            <a href="/legal/privacidad" target="_blank" rel="noopener noreferrer" className="text-[#9AA3AE] hover:text-white underline underline-offset-2">
              Política de Privacidad
            </a>
            .
          </p>
        </form>
      )}
    </div>
  )
}
