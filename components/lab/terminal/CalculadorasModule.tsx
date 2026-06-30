"use client"

import { useEffect, useMemo, useState } from "react"
import { fetchDolares, fetchInflacion, fmt, type Dolar, type SerieValor } from "@/lib/terminal"
import { AZUL, Card, DOWN, Eyebrow, Field, inputCls, TEAL } from "./ui"

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

function nombreMes(fecha: string) {
  const [y, m] = fecha.split("-")
  return `${MESES[Number(m) - 1]} ${y}`
}

// ---------- Conversor de dólar ----------

function ConversorDolar() {
  const [dolares, setDolares] = useState<Dolar[]>([])
  const [monto, setMonto] = useState("100000")
  const [modo, setModo] = useState<"comprar" | "vender">("comprar")

  useEffect(() => {
    fetchDolares().then(setDolares).catch(() => {})
  }, [])

  const n = Number(monto.replace(/[^\d.]/g, "")) || 0
  // Excluimos mayorista (no es para retail) y tarjeta (no se compra ni se vende:
  // es la tasa nocional de gastos con tarjeta en el exterior).
  const casas = dolares.filter((d) => d.casa !== "mayorista" && d.casa !== "tarjeta")

  const filas = useMemo(() => {
    const r = casas.map((d) => {
      // comprar USD: con pesos → usd = pesos / venta
      // vender USD: tengo usd → pesos = usd * compra
      const resultado = modo === "comprar" ? n / d.venta : n * d.compra
      return { nombre: d.nombre, casa: d.casa, resultado }
    })
    r.sort((a, b) => b.resultado - a.resultado) // mayor resultado = mejor para el usuario
    return r
  }, [casas, n, modo])

  const mejor = filas[0]
  const peor = filas[filas.length - 1]
  const dif = mejor && peor && peor.resultado > 0 ? (mejor.resultado / peor.resultado - 1) * 100 : 0

  return (
    <Card>
      <Eyebrow accent={TEAL}>Conversor de dólar</Eyebrow>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label={modo === "comprar" ? "Tengo (ARS)" : "Tengo (USD)"}>
          <input className={inputCls} inputMode="numeric" value={monto} onChange={(e) => setMonto(e.target.value)} />
        </Field>
        <Field label="Operación">
          <div className="inline-flex w-full rounded-lg border border-[#2A2A2A] bg-[#0A0D14] p-1">
            {(["comprar", "vender"] as const).map((m) => {
              const c = m === "comprar" ? TEAL : DOWN
              return (
                <button
                  key={m}
                  onClick={() => setModo(m)}
                  className="flex-1 rounded-md px-3 py-1.5 text-sm font-semibold transition-all"
                  style={modo === m ? { background: `${c}26`, color: "#fff", boxShadow: `inset 0 0 0 1px ${c}99` } : { color: "#7E8898" }}
                >
                  {m === "comprar" ? "Comprar USD" : "Vender USD"}
                </button>
              )
            })}
          </div>
        </Field>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[12.5px]">
          <thead>
            <tr>
              {["Casa", modo === "comprar" ? "Recibís (USD)" : "Recibís (ARS)", ""].map((h, i) => (
                <th key={i} className={`border-b border-[#2A2A2A] px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wide text-[#7E8898] ${i === 0 ? "text-left" : "text-right"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={f.casa} className="border-b border-[#ffffff08]">
                <td className="px-3 py-2.5 text-left text-white">{f.nombre}</td>
                <td className="px-3 py-2.5 text-right text-white">
                  {modo === "comprar" ? "US$ " : "$ "}
                  {fmt(f.resultado, modo === "comprar" ? 2 : 0)}
                </td>
                <td className="px-3 py-2.5 text-right">
                  {i === 0 && <span className="rounded-md px-2 py-0.5 text-[10px] font-bold" style={{ background: `${TEAL}1F`, color: TEAL }}>MEJOR</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mejor && peor && dif > 0.05 && (
        <p className="mt-3 text-[11px] text-[#98A1B5]">
          Diferencia entre la mejor ({mejor.nombre}) y la peor ({peor.nombre}) opción:{" "}
          <b className="text-white">{fmt(dif, 1)}%</b>.
        </p>
      )}
    </Card>
  )
}

// ---------- Calculadora de inflación ----------

function CalcInflacion() {
  const [serie, setSerie] = useState<SerieValor[]>([])
  const [monto, setMonto] = useState("100000")
  const [desdeIdx, setDesdeIdx] = useState<number>(-1)

  useEffect(() => {
    fetchInflacion()
      .then((s) => {
        setSerie(s)
        // default: hace 12 meses
        setDesdeIdx(Math.max(0, s.length - 13))
      })
      .catch(() => {})
  }, [])

  const opciones = useMemo(() => serie.slice(-240), [serie]) // últimos 20 años
  const offset = serie.length - opciones.length

  const n = Number(monto.replace(/[^\d.]/g, "")) || 0

  const calc = useMemo(() => {
    if (!serie.length || desdeIdx < 0 || desdeIdx >= serie.length) return null
    // acumula la inflación de los meses POSTERIORES al elegido, hasta el último
    let factor = 1
    for (let i = desdeIdx + 1; i < serie.length; i++) factor *= 1 + serie[i].valor / 100
    const equivalente = n * factor
    const acum = (factor - 1) * 100
    const ultimo = serie[serie.length - 1]
    return { equivalente, acum, desde: serie[desdeIdx], hasta: ultimo }
  }, [serie, desdeIdx, n])

  return (
    <Card>
      <Eyebrow accent={AZUL}>Calculadora de inflación</Eyebrow>
      <p className="mt-2 text-[11px] text-[#98A1B5]">Cuánto valdría hoy una cantidad de pesos de un mes pasado, según el IPC.</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Monto (ARS)">
          <input className={inputCls} inputMode="numeric" value={monto} onChange={(e) => setMonto(e.target.value)} />
        </Field>
        <Field label="Desde el mes">
          <select
            className={inputCls}
            value={desdeIdx}
            onChange={(e) => setDesdeIdx(Number(e.target.value))}
          >
            {opciones.map((o, i) => (
              <option key={o.fecha} value={offset + i} className="bg-[#0A0D14]">
                {nombreMes(o.fecha)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {calc && (
        <div className="mt-4 rounded-2xl border border-[#2A2A2A] bg-[#0A0D14] p-4">
          <div className="text-[11px] uppercase tracking-wide text-[#98A1B5]">
            ${fmt(n, 0)} de {nombreMes(calc.desde.fecha)} equivalen hoy a
          </div>
          <div className="mt-1 font-mono text-3xl font-bold" style={{ color: AZUL }}>
            ${fmt(calc.equivalente, 0)}
          </div>
          <div className="mt-1 font-mono text-[12px] text-[#7E8898]">
            Inflación acumulada {nombreMes(calc.desde.fecha)} → {nombreMes(calc.hasta.fecha)}:{" "}
            <b className="text-white">{fmt(calc.acum, 1)}%</b>
          </div>
        </div>
      )}
    </Card>
  )
}

export function CalculadorasModule() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <ConversorDolar />
      <CalcInflacion />
    </div>
  )
}
