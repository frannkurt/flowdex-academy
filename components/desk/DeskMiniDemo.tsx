"use client"

// Mini demo en vivo del Desk para el hero de la landing: réplica 1:1 del
// Terminal real (misma paleta, chrome, wordmark, relojes de sesión, tabs y
// paneles) con datos HARDCODEADOS que se animan — precios que laten, el
// análisis corriendo etapa por etapa con texto que se escribe, la Lectura
// Flowdex como resultado y los paneles de CCL / movers abajo. Loop infinito.
// Sin red, sin backend: es una maqueta fiel, no la app.

import { useEffect, useRef, useState } from "react"

/* ── Paleta del Terminal real (webui/index.html) ── */
const C = {
  bg: "#0a0a0a",
  panel: "#0d0d0d",
  panel2: "#171717",
  border: "#262626",
  text: "#cdcdcd",
  muted: "#6e6e6e",
  accent: "#5BB8D4",
  accent2: "#D4B86A",
  buy: "#33b157",
  hold: "#d8a21e",
  sell: "#e6483a",
  rich: "#e8821e",
  cheap: "#2bb6c4",
  fair: "#7a7a7a",
}
const MONO = '"SF Mono", ui-monospace, Menlo, Consolas, "Cascadia Code", monospace'
const SEM: Record<string, string> = { verde: C.buy, amarillo: C.hold, rojo: C.sell }

/* ── Relojes de sesión (countdown REAL por mercado, como el Terminal) ── */
const WEEK = 7 * 24 * 3600
const mk = (d: number, h: number, m = 0) => (d * 24 + h) * 3600 + m * 60
// intervalos semanales [apertura, cierre) en segundos de semana (Dom=0)
const MARKETS: { name: string; tz: string; iv: [number, number][] }[] = [
  {
    name: "GLOBEX",
    tz: "America/Chicago",
    iv: [
      [mk(0, 17), mk(1, 0)],
      ...[1, 2, 3, 4].flatMap((d): [number, number][] => [
        [mk(d, 0), mk(d, 16)],
        [mk(d, 17), mk(d + 1, 0)],
      ]),
      [mk(5, 0), mk(5, 16)],
    ],
  },
  { name: "TOKIO", tz: "Asia/Tokyo", iv: [1, 2, 3, 4, 5].map((d): [number, number] => [mk(d, 9), mk(d, 15)]) },
  { name: "LONDRES", tz: "Europe/London", iv: [1, 2, 3, 4, 5].map((d): [number, number] => [mk(d, 8), mk(d, 16, 30)]) },
  { name: "NY", tz: "America/New_York", iv: [1, 2, 3, 4, 5].map((d): [number, number] => [mk(d, 9, 30), mk(d, 16)]) },
  { name: "BYMA", tz: "America/Argentina/Buenos_Aires", iv: [1, 2, 3, 4, 5].map((d): [number, number] => [mk(d, 11), mk(d, 17)]) },
]
const DAY_IDX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

function weekSec(tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, weekday: "short", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0"
  const d = DAY_IDX[get("weekday")] ?? 0
  const h = Number(get("hour")) % 24
  return ((d * 24 + h) * 60 + Number(get("minute"))) * 60 + Number(get("second"))
}

function sessionStatus(m: (typeof MARKETS)[number]): { open: boolean; secs: number } {
  const now = weekSec(m.tz)
  for (const [a, b] of m.iv) if (now >= a && now < b) return { open: true, secs: b - now }
  let best = WEEK
  for (const [a] of m.iv) best = Math.min(best, (a - now + WEEK) % WEEK)
  return { open: false, secs: best }
}

function fmtDur(s: number): string {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60
  return h > 0 ? `${h}h ${m}m ${ss}s` : `${m}m ${ss}s`
}

/* ── Escenarios del análisis (rotación) ── */
type Scenario = {
  ticker: string
  name: string
  board: string
  lines: { tag: string; text: string }[]
  ejes: { label: string; state: string; color: string }[]
  fuerza: number
  lectura: string
}

const SCENARIOS: Scenario[] = [
  {
    ticker: "VIST",
    name: "Vista Energy",
    board: "EMPRESA",
    lines: [
      { tag: "Técnico", text: "Precio sobre SMA50 y SMA200. RSI14 61, tendencia firme sin sobrecompra." },
      { tag: "Fundamentals", text: "Producción y FCF creciendo; márgenes altos y deuda neta/EBITDA baja." },
      { tag: "Macro/CCL", text: "CCL implícito estable; la brecha no presiona la posición en dólares." },
    ],
    ejes: [
      { label: "NEGOCIO", state: "SÓLIDO", color: "verde" },
      { label: "VALUACIÓN", state: "CON MARGEN", color: "verde" },
      { label: "RIESGO", state: "MEDIO", color: "amarillo" },
    ],
    fuerza: 4,
    lectura: "Crecimiento real con caja y valuación razonable; el riesgo es macro, no del negocio.",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA",
    board: "EMPRESA",
    lines: [
      { tag: "Técnico", text: "Tendencia alcista intacta: ADX 31, precio en el tercio alto del rango 12m." },
      { tag: "Fundamentals", text: "Márgenes y FCF excepcionales; la valuación exige ejecución perfecta." },
      { tag: "Noticias", text: "Titulares de demanda de datacenter sostienen la narrativa del semestre." },
    ],
    ejes: [
      { label: "NEGOCIO", state: "SÓLIDO", color: "verde" },
      { label: "VALUACIÓN", state: "EXIGENTE", color: "rojo" },
      { label: "RIESGO", state: "MEDIO", color: "amarillo" },
    ],
    fuerza: 4,
    lectura: "Calidad excepcional a precio exigente: la lectura es clara, el margen no.",
  },
  {
    ticker: "BTC-USD",
    name: "Bitcoin",
    board: "CRIPTO",
    lines: [
      { tag: "Técnico", text: "Precio sobre SMA200; estocástico neutro, sin euforia en el rango." },
      { tag: "Tokenómica", text: "94% del supply emitido; emisión anual baja sostiene la escasez." },
      { tag: "Macro", text: "Tasas reales estables y dólar lateral: viento neutro para el ciclo." },
    ],
    ejes: [
      { label: "RED", state: "SÓLIDO", color: "verde" },
      { label: "VALUACIÓN", state: "EN PRECIO", color: "amarillo" },
      { label: "RIESGO", state: "ALTO", color: "rojo" },
    ],
    fuerza: 3,
    lectura: "Red sana y escasez intacta; la volatilidad propia de la clase manda el tamaño.",
  },
]

/* ── Datos hardcodeados de los paneles ── */
const TAPE_BASE = [
  { s: "VIST", p: 52.1 },
  { s: "^GSPC", p: 7378.2 },
  { s: "^IXIC", p: 25638.4 },
  { s: "BTC-USD", p: 112450 },
  { s: "EURUSD", p: 1.0842 },
  { s: "GC=F", p: 4195.7 },
  { s: "YPF", p: 38.91 },
]

const TABS = ["DASHBOARD", "MERCADOS", "DIVIDENDOS", "MOVERS", "HISTORIAL", "⚗ LAB"]

const CCL_ROWS = [
  { t: "IRS", sec: "Real Estate", d: "+1.41%", st: "RICH" },
  { t: "LOMA", sec: "Materiales", d: "+1.36%", st: "RICH" },
  { t: "GGAL", sec: "Bancos", d: "+0.21%", st: "FAIR" },
  { t: "TGS", sec: "Energía", d: "-0.31%", st: "FAIR" },
]
const ST_COLOR: Record<string, string> = { RICH: C.rich, CHEAP: C.cheap, FAIR: C.fair }

const MOVERS_UP = [
  { t: "HOOD", n: "Robinhood", d: "+8.43%" },
  { t: "KLAC", n: "KLA Corp", d: "+6.95%" },
  { t: "AMAT", n: "Applied Mat.", d: "+6.03%" },
]
const MOVERS_DN = [
  { t: "SMCI", n: "Super Micro", d: "-11.88%" },
  { t: "SHIB-USD", n: "Shiba Inu", d: "-5.40%" },
  { t: "INJ-USD", n: "Injective", d: "-5.30%" },
]

const STEPS = [
  "Recolectando datos de mercado...",
  "Analistas trabajando...",
  "Debate alcista vs bajista...",
  "Comité de riesgo evaluando...",
  "Armando la Lectura Flowdex...",
  "Verificando coherencia...",
]

const STEP_MS = 1500
const RESULT_MS = 5600
const TYPE_MS = 14

function fmt(n: number) {
  return n >= 1000
    ? n.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: n < 10 ? 4 : 2 })
}

export function DeskMiniDemo() {
  const [now, setNow] = useState("")
  const [sessions, setSessions] = useState<{ name: string; open: boolean; secs: number }[]>([])
  const [tape, setTape] = useState(TAPE_BASE.map((t) => ({ ...t, chg: 0 })))
  const [scn, setScn] = useState(0)
  const [step, setStep] = useState(0)
  const [typed, setTyped] = useState(0)
  const [done, setDone] = useState(false)
  const reduced = useRef(false)

  const scenario = SCENARIOS[scn]
  const fullText = scenario.lines.map((l) => `[${l.tag}] ${l.text}`).join("\n")

  /* Reloj + relojes de sesión (countdown real, cada 1s) */
  useEffect(() => {
    const tick = () => {
      setNow(new Date().toLocaleTimeString("es-AR", { hour12: false }))
      setSessions(MARKETS.map((m) => ({ name: m.name, ...sessionStatus(m) })))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  /* Precios que laten (random walk suave) */
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced.current) return
    const id = setInterval(() => {
      setTape((prev) =>
        prev.map((t) => {
          const drift = (Math.random() - 0.5) * 0.004
          return { ...t, p: t.p * (1 + drift), chg: drift }
        }),
      )
    }, 1900)
    return () => clearInterval(id)
  }, [])

  /* Máquina de estados: etapas → tipeo → resultado → siguiente escenario */
  useEffect(() => {
    // El demo siempre anima la lectura y loopea (rota de escenario al terminar),
    // así se ve "leyendo" el activo cada vuelta — no solo el resultado final.
    let stepIdx = 0
    let chars = 0
    let endTimer: ReturnType<typeof setTimeout> | undefined
    setStep(0)
    setTyped(0)
    setDone(false)

    const stepTimer = setInterval(() => {
      stepIdx += 1
      if (stepIdx < STEPS.length) {
        setStep(stepIdx)
      } else {
        clearInterval(stepTimer)
        clearInterval(typeTimer)
        setTyped(fullText.length)
        setDone(true)
        endTimer = setTimeout(() => setScn((s) => (s + 1) % SCENARIOS.length), RESULT_MS)
      }
    }, STEP_MS)

    const typeTimer = setInterval(() => {
      chars += 2
      setTyped((c) => Math.min(fullText.length, Math.max(c, chars)))
    }, TYPE_MS)

    return () => {
      clearInterval(stepTimer)
      clearInterval(typeTimer)
      clearTimeout(endTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scn])

  const progress = done ? 100 : Math.round(((step + 1) / STEPS.length) * 88)

  return (
    <div
      className="overflow-hidden rounded-md shadow-2xl shadow-black/60"
      style={{ background: C.bg, border: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 12, lineHeight: 1.5, color: C.text }}
      aria-label="Demostración del Desk con datos de ejemplo"
    >
      {/* ── Topbar: wordmark real + DESK + LIVE + reloj ── */}
      <div className="flex items-center gap-3 px-3 py-2" style={{ background: "#000", borderBottom: `1px solid ${C.border}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/desk/flowdex-wordmark.png" alt="Flowdex" style={{ height: 15, width: "auto", display: "block" }} />
        <span
          className="text-[11px] font-bold tracking-[2.5px]"
          style={{ color: C.text, borderLeft: `1px solid ${C.border}`, paddingLeft: 11 }}
        >
          DESK
        </span>
        <span className="flex-1" />
        <span className="flex items-center gap-1.5 text-[10.5px] font-bold" style={{ color: C.buy }}>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: C.buy }} />
          LIVE
        </span>
        <span className="text-[10.5px] tabular-nums" style={{ color: C.text }}>
          {now}
        </span>
      </div>

      {/* ── Relojes de sesión por mercado (countdown real) ── */}
      <div
        className="flex gap-4 overflow-hidden whitespace-nowrap px-3 py-[5px] text-[9.8px]"
        style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}
      >
        {sessions.map((s) => (
          <span key={s.name} className="tabular-nums">
            <span style={{ color: s.open ? C.buy : C.muted }}>● </span>
            <span className="font-bold" style={{ color: C.text }}>{s.name}</span>
            <span style={{ color: C.muted }}> {s.open ? "cierra" : "abre"} en {fmtDur(s.secs)}</span>
          </span>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 px-2 text-[9.8px]" style={{ borderBottom: `1px solid ${C.border}`, background: "#000" }}>
        {TABS.map((t, i) => (
          <span
            key={t}
            className="px-2 py-[6px] font-bold tracking-[1.5px]"
            style={
              i === 0
                ? { color: C.accent, borderBottom: `2px solid ${C.accent}` }
                : { color: C.muted, borderBottom: "2px solid transparent" }
            }
          >
            {t}
          </span>
        ))}
      </div>

      {/* ── Cinta de cotizaciones ── */}
      <div className="flex gap-4 overflow-hidden whitespace-nowrap px-3 py-1.5" style={{ borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        {tape.map((t) => (
          <span key={t.s} className="text-[10.5px] tabular-nums">
            <span style={{ color: C.muted }}>{t.s} </span>
            <span style={{ color: t.chg >= 0 ? C.buy : C.sell, transition: "color .4s" }}>
              {fmt(t.p)} {t.chg >= 0 ? "▲" : "▼"}
            </span>
          </span>
        ))}
      </div>

      {/* ── Cuerpo: análisis multi-agente ── */}
      <div className="px-3.5 py-3" style={{ background: C.panel }}>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[1.5px]" style={{ color: C.accent }}>
            ▸ Análisis multi-agente
          </span>
          <span className="rounded-[3px] px-1.5 py-0.5 text-[9.5px] tracking-wide" style={{ border: `1px solid ${C.border}`, color: C.muted }}>
            demo · datos de ejemplo
          </span>
        </div>

        <div className="mb-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[15px] font-extrabold text-white">{scenario.ticker}</span>
          <span className="text-[11px]" style={{ color: C.muted }}>
            {scenario.name}
          </span>
          <span className="rounded-[3px] px-1.5 text-[9.5px] tracking-widest" style={{ border: `1px solid ${C.border}`, color: C.text }}>
            {scenario.board}
          </span>
        </div>

        {/* Estado + barra de progreso */}
        <div className="mb-1 flex items-center justify-between text-[10.5px]" style={{ color: done ? C.buy : C.accent }}>
          <span>{done ? "✓ Lectura lista — verificada" : `⠿ ${STEPS[step]}`}</span>
          <span style={{ color: C.muted }}>{done ? "15/15" : `Paso ${Math.min(15, Math.round(((step + 1) * 15) / STEPS.length))}/15`}</span>
        </div>
        <div className="mb-3 h-[3px] w-full overflow-hidden rounded-full" style={{ background: C.panel2 }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: done ? C.buy : C.accent }} />
        </div>

        {/* Texto de análisis tipeándose */}
        <div
          className="mb-3 h-[118px] overflow-hidden whitespace-pre-wrap rounded-[3px] px-2.5 py-2 text-[10.8px] leading-relaxed"
          style={{ background: C.panel2, border: `1px solid ${C.border}`, color: C.text }}
        >
          {fullText.slice(0, typed).split("\n").map((ln, i) => {
            const m = ln.match(/^\[([^\]]+)\]\s?(.*)$/)
            return (
              <div key={i}>
                {m ? (
                  <>
                    <span style={{ color: C.accent2 }}>[{m[1]}]</span> <span>{m[2]}</span>
                  </>
                ) : (
                  ln
                )}
              </div>
            )
          })}
          {!done && <span className="animate-pulse" style={{ color: C.accent }}>▌</span>}
        </div>

        {/* Resultado: la Lectura Flowdex */}
        <div className="transition-opacity duration-700" style={{ opacity: done ? 1 : 0.18 }}>
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[1.5px]" style={{ color: C.accent }}>
            ▸ Lectura Flowdex
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {scenario.ejes.map((e) => (
              <div key={e.label} className="rounded-[3px] px-2 py-1.5" style={{ background: C.panel2, border: `1px solid ${C.border}` }}>
                <div className="text-[9px] tracking-[1.5px]" style={{ color: C.muted }}>
                  {e.label}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-bold" style={{ color: SEM[e.color] }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: SEM[e.color], boxShadow: done ? `0 0 6px ${SEM[e.color]}66` : "none" }} />
                  {e.state}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px]" style={{ color: C.muted }}>
            <span className="tracking-[1.5px]">FUERZA</span>
            <span className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: i <= scenario.fuerza ? C.accent : C.panel2, border: `1px solid ${i <= scenario.fuerza ? C.accent : C.border}` }}
                />
              ))}
            </span>
            <span className="tabular-nums">{scenario.fuerza}/5</span>
          </div>
          <p className="mt-2 border-l-2 pl-2.5 text-[10.8px] italic leading-relaxed" style={{ borderColor: C.accent, color: C.text, minHeight: 36 }}>
            {scenario.lectura}
          </p>
        </div>
      </div>

      {/* ── Paneles inferiores: CCL + Top movers (como el dashboard real) ── */}
      <div className="grid grid-cols-2 gap-px" style={{ background: C.border, borderTop: `1px solid ${C.border}` }}>
        {/* Mercados · CCL */}
        <div className="px-3 py-2.5" style={{ background: C.panel }}>
          <div className="mb-1.5 text-[9.5px] font-bold uppercase tracking-[1.5px]" style={{ color: C.accent }}>
            ▸ Mercados · CCL
          </div>
          <div className="mb-1.5 flex items-baseline gap-2">
            <span className="text-[13px] font-extrabold tabular-nums" style={{ color: C.accent }}>1.494,1</span>
            <span className="text-[9px]" style={{ color: C.muted }}>DÓLAR CONSENSO · DISP. 0.70%</span>
          </div>
          {CCL_ROWS.map((r) => (
            <div key={r.t} className="flex items-center justify-between py-[3px] text-[10px]" style={{ borderTop: `1px solid ${C.panel2}` }}>
              <span>
                <b style={{ color: C.text }}>{r.t}</b> <span style={{ color: C.muted }}>{r.sec}</span>
              </span>
              <span className="flex items-center gap-1.5 tabular-nums">
                <span style={{ color: r.d.startsWith("-") ? C.cheap : C.rich }}>{r.d}</span>
                <span
                  className="rounded-[2px] px-1 text-[8.5px] font-bold"
                  style={{ color: "#000", background: ST_COLOR[r.st] }}
                >
                  {r.st}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Top movers */}
        <div className="px-3 py-2.5" style={{ background: C.panel }}>
          <div className="mb-1.5 text-[9.5px] font-bold uppercase tracking-[1.5px]" style={{ color: C.accent }}>
            ▸ Top movers · Global
          </div>
          <div className="text-[9px] font-bold tracking-[1px]" style={{ color: C.buy }}>▲ SUBEN</div>
          {MOVERS_UP.map((r) => (
            <div key={r.t} className="flex items-center justify-between py-[2.5px] text-[10px]" style={{ borderTop: `1px solid ${C.panel2}` }}>
              <span><b style={{ color: C.text }}>{r.t}</b> <span style={{ color: C.muted }}>{r.n}</span></span>
              <span className="tabular-nums" style={{ color: C.buy }}>{r.d}</span>
            </div>
          ))}
          <div className="mt-1.5 text-[9px] font-bold tracking-[1px]" style={{ color: C.sell }}>▼ BAJAN</div>
          {MOVERS_DN.map((r) => (
            <div key={r.t} className="flex items-center justify-between py-[2.5px] text-[10px]" style={{ borderTop: `1px solid ${C.panel2}` }}>
              <span><b style={{ color: C.text }}>{r.t}</b> <span style={{ color: C.muted }}>{r.n}</span></span>
              <span className="tabular-nums" style={{ color: C.sell }}>{r.d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Statusbar ── */}
      <div
        className="flex items-center justify-between px-3 py-[5px] text-[9px]"
        style={{ background: "#000", borderTop: `1px solid ${C.border}`, color: C.muted }}
      >
        <span>⚖ Análisis con el método Flowdex. No es recomendación — la decisión la tomás vos.</span>
        <span className="hidden sm:inline">desk · demo</span>
      </div>
    </div>
  )
}
