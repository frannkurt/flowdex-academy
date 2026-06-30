"use client"

// Widget flotante de Tutor IA por curso.
// Se monta dentro de app/courses/[slug]/page.tsx (zona protegida post-pago).
// Recibe el courseSlug y pega contra /api/tutor/[courseSlug].

import { useEffect, useRef, useState } from "react"
import { MessageCircle, Send, X, Sparkles } from "lucide-react"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

// Renderiza el texto de un mensaje convirtiendo URLs en links clickeables.
// Recorta puntuación final del match (".", ",", ")", etc.) para no romper
// frases tipo "ver https://flowdex.com/x." donde el punto no es de la URL.
function renderMessageContent(text: string) {
  const urlRegex = /(https?:\/\/[^\s<>]+)/g
  const trailingPunct = /[.,;:!?)\]]+$/
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let n = 0
  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    let url = match[0]
    let tail = ""
    const m = url.match(trailingPunct)
    if (m) {
      tail = m[0]
      url = url.slice(0, -tail.length)
    }
    nodes.push(
      <a
        key={`u${n++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#7DD4C0] underline underline-offset-2 hover:text-[#5BB8D4] break-all"
      >
        {url}
      </a>,
    )
    if (tail) nodes.push(tail)
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

type CourseTutorProps = {
  courseSlug: string
  courseName: string
}

export function CourseTutor({ courseSlug, courseName }: CourseTutorProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quota, setQuota] = useState<{
    shortRemaining: number
    dailyRemaining: number
    shortLimit: number
    dailyLimit: number
  } | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  // Mensaje de bienvenida cuando se abre por primera vez.
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Hola. Soy el tutor IA de ${courseName}. Preguntame lo que quieras del material del curso y te ayudo a entenderlo. Solo respondo sobre este curso.`,
        },
      ])
    }
  }, [open, messages.length, courseName])

  // Auto-scroll al fondo cuando llegan mensajes nuevos O cuando se reabre
  // el panel (el div se remontea y el scrollTop arranca en 0).
  useEffect(() => {
    if (!open) return
    // requestAnimationFrame: esperar a que el layout termine de pintarse
    // antes de medir scrollHeight, sino mide 0 en el primer render.
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    })
  }, [messages, loading, open])

  // Focus al input cuando se abre el panel.
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  async function sendMessage() {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMessage: ChatMessage = { role: "user", content: trimmed }
    const next = [...messages, userMessage]
    setMessages(next)
    setInput("")
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/tutor/${courseSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data?.error ?? "Algo falló. Probá de nuevo.")
        // Revertir el último mensaje del user si querés que reintente.
        // En su lugar, lo dejamos visible y el user puede reenviar manualmente.
        return
      }

      const reply: string = data?.reply ?? "No pude generar respuesta."
      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
      if (data?.remaining && data?.limits) {
        setQuota({
          shortRemaining: data.remaining.short,
          dailyRemaining: data.remaining.daily,
          shortLimit: data.limits.short,
          dailyLimit: data.limits.daily,
        })
      }
    } catch {
      setError("Error de red. Revisá tu conexión.")
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Botón flotante */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-[#7DD4C0]/40 bg-gradient-to-r from-[#5BB8D4] to-[#7DD4C0] px-4 py-3 text-sm font-semibold text-[#0A0A0A] shadow-[0_0_24px_rgba(125,212,192,0.35)] transition-all hover:scale-[1.03] sm:bottom-6 sm:right-6"
          aria-label="Abrir tutor IA"
        >
          <Sparkles size={16} />
          <span className="hidden sm:inline">Tutor IA</span>
        </button>
      )}

      {/* Panel del chat */}
      {open && (
        <div
          // data-lenis-prevent: el sitio usa Lenis (smooth scroll global) que
          // hijackea wheel events. Sin esto, scrollear sobre el chat mueve
          // la página del curso por detrás en vez del chat.
          data-lenis-prevent
          className="fixed bottom-4 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#0E0E0E]/95 shadow-2xl backdrop-blur-lg sm:bottom-6 sm:right-6"
          style={{ height: "min(620px, calc(100vh - 6rem))" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1E1E1E] bg-[#111111] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg border border-[#7DD4C0]/40 bg-[#7DD4C0]/10 p-1.5">
                <Sparkles size={14} className="text-[#7DD4C0]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7DD4C0]">
                  Tutor IA
                </p>
                <p className="text-[11px] text-[#888888]">{courseName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-[#888888] transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Cerrar tutor"
            >
              <X size={16} />
            </button>
          </div>

          {/* Mensajes.
              - min-h-0 es CRÍTICO: sin esto, un flex item con overflow-y-auto
                se estira al alto del contenido (min-height: auto por defecto)
                y nunca scrollea.
              - overscroll-contain frena el scroll chaining (al llegar al
                tope/fondo, no scrollea la página del curso por detrás). */}
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#5BB8D4]/20 text-white border border-[#5BB8D4]/30"
                      : "bg-[#1A1A1A] text-[#D2E2E6] border border-[#2A2A2A]"
                  }`}
                >
                  {m.role === "assistant" ? renderMessageContent(m.content) : m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-3.5 py-2.5">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7DD4C0]" />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7DD4C0]"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7DD4C0]"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[#1E1E1E] bg-[#0A0A0A] p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Preguntá sobre el curso…"
                rows={1}
                maxLength={2000}
                className="flex-1 resize-none rounded-lg border border-[#2A2A2A] bg-[#111111] px-3 py-2 text-sm text-white placeholder:text-[#666666] focus:border-[#7DD4C0]/50 focus:outline-none"
                style={{ maxHeight: "120px" }}
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-[#5BB8D4] to-[#7DD4C0] text-[#0A0A0A] transition-all hover:scale-[1.05] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Enviar"
              >
                <Send size={14} />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-[#666666]">
              <p className="flex-1 leading-snug">
                El tutor solo responde sobre {courseName}. Puede equivocarse:
                contrastá con el material.
              </p>
              {quota && (
                <p
                  className={`flex-shrink-0 tabular-nums ${
                    quota.dailyRemaining <= 10 || quota.shortRemaining <= 1
                      ? "text-amber-400/80"
                      : "text-[#888888]"
                  }`}
                  title={`Te quedan ${quota.shortRemaining}/${quota.shortLimit} en los próximos 5 min y ${quota.dailyRemaining}/${quota.dailyLimit} hoy`}
                >
                  {quota.dailyRemaining}/{quota.dailyLimit} hoy ·{" "}
                  {quota.shortRemaining}/{quota.shortLimit} ahora
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Pequeño icono que no se usa pero queda exportado por si querés
// trigger desde otro lugar del curso.
export { MessageCircle as TutorIcon }
