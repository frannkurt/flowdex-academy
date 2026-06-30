"use client"

// Panel de Métricas del /admin. Reemplaza el viejo tab "Caja" absorbiendo
// los KPIs financieros (ingresos, ticket promedio, top cursos) y sumando
// 4 bloques nuevos:
//
//   Bloque 1 — KPIs (MRR, ingresos del período, alumnos activos, postulaciones)
//   Bloque 2 — Salud del producto (tasa de finalización + distribución de progreso)
//   Bloque 3 — Retención IC (grupos por antigüedad) + alumnos en riesgo
//   Bloque 4 — Evolución temporal (ingresos por semana + postulaciones por día)
//   Bloque 5 — Top cursos por revenue + top alumnos por engagement
//
// El componente es client porque el dropdown de período recalcula todo en
// memoria, y queremos UX instantánea sin round-trip al server. Toda la
// data llega pre-cargada desde el Server Component padre.
//
// Triada de colores:
//   Inversión #5BB8D4 (azul) · Trading #7DD4C0 (teal) · IC #D4B86A (dorado)

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { getTotalModulesBySlug, countCompletedModules } from "@/lib/courses/module-counts"

// ---------- Tipos de input ----------

export type MetricsOrderRow = {
  id: string
  user_id: string
  course_id: string
  amount_usd: number
  status: string
  created_at: string
}

export type MetricsCourseRow = {
  id: string
  name: string
  slug: string
  price: number
}

export type MetricsUserCourseRow = {
  user_id: string
  course_id: string
  granted_at: string
  expires_at: string | null
  is_active: boolean
  // grant_type discrimina compras reales ('paid') de cortesías/manuales
  // ('free', 'manual'). Sin esto inflamos el MRR y los funnels de
  // conversión con accesos regalados, que no son señal de mercado.
  grant_type: string | null
  amount_paid: number | null
}

export type MetricsCourseProgressRow = {
  user_id: string
  course_id: string
  completed_modules: unknown
}

export type MetricsApplicationRow = {
  id: string
  created_at: string
  status: string
}

export type MetricsUserSummary = {
  id: string
  email: string
  fullName: string | null
  lastSignInAt: string | null
}

export type MetricsClassBookingRow = {
  id: string
  start_at: string | null
  status: string
}

export interface MetricsPanelProps {
  orders: MetricsOrderRow[]
  courses: MetricsCourseRow[]
  userCourses: MetricsUserCourseRow[]
  courseProgress: MetricsCourseProgressRow[]
  applications: MetricsApplicationRow[]
  users: MetricsUserSummary[]
  classBookings: MetricsClassBookingRow[]
}

// ---------- Constantes visuales ----------

// Color por slug para que las barras y badges sean consistentes con la
// triada de colores por programa que se aplica en el resto del sitio.
function colorForSlug(slug: string): string {
  if (slug.includes("trading")) return "#7DD4C0"
  if (slug.includes("inner-circle") || slug === "inner-circle") return "#D4B86A"
  if (slug === "membresia") return "#D4B86A"
  return "#5BB8D4"
}

type Period = "7d" | "30d" | "90d" | "year" | "all"

const PERIOD_LABELS: Record<Period, string> = {
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  "90d": "Últimos 90 días",
  year: "Este año",
  all: "Todo el tiempo",
}

function periodStart(period: Period): Date | null {
  if (period === "all") return null
  const now = new Date()
  if (period === "year") return new Date(now.getFullYear(), 0, 1)
  const daysMap: Record<Exclude<Period, "all" | "year">, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  }
  const date = new Date()
  date.setDate(date.getDate() - daysMap[period as "7d" | "30d" | "90d"])
  return date
}

function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
}

function formatDateShort(value: string): string {
  return new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  })
}

// ---------- Componente principal ----------

export default function MetricsPanel({
  orders,
  courses,
  userCourses,
  courseProgress,
  applications,
  users,
  classBookings,
}: MetricsPanelProps) {
  const [period, setPeriod] = useState<Period>("30d")
  // Toggles "Ver todos" para las listas que pueden crecer mucho. Defaults
  // conservadores (top 5 / 20) y al expandir saltamos a (top 20 / 100)
  // que cubre 99% de los casos sin overflow de UI.
  const [expandedTopStudents, setExpandedTopStudents] = useState(false)
  const [expandedAtRisk, setExpandedAtRisk] = useState(false)
  const [expandedTopCourses, setExpandedTopCourses] = useState(false)

  const courseById = useMemo(() => {
    const map: Record<string, MetricsCourseRow> = {}
    for (const c of courses) map[c.id] = c
    return map
  }, [courses])

  const userById = useMemo(() => {
    const map: Record<string, MetricsUserSummary> = {}
    for (const u of users) map[u.id] = u
    return map
  }, [users])

  // ---------- Cálculos derivados ----------

  const from = useMemo(() => periodStart(period), [period])
  // nowTs se congela al momento en que el componente monta. Si lo
  // recalculáramos en cada render (Date.now() directo), TODAS las useMemos
  // que dependen de nowTs se invalidarían en cada render — el panel queda
  // recomputando bloques pesados (atRiskStudents O(N·M), funnel, cohortes)
  // sin razón. Para refrescar los "hace X días" basta con recargar la
  // página, momento en que también se re-fetchea la data del server.
  const nowTs = useMemo(() => Date.now(), [])

  // Orders pagas dentro del período seleccionado. Filtramos también las
  // que tienen amount_usd 0 (cortesías que pasaron por el flow de orders
  // pero no movieron caja). Sin esto inflamos count de ventas sin razón.
  const paidOrdersInPeriod = useMemo(() => {
    return orders.filter((o) => {
      if (o.status !== "paid") return false
      if (Number(o.amount_usd) <= 0) return false
      if (!from) return true
      return new Date(o.created_at).getTime() >= from.getTime()
    })
  }, [orders, from])

  const totalRevenue = useMemo(
    () => paidOrdersInPeriod.reduce((sum, o) => sum + Number(o.amount_usd), 0),
    [paidOrdersInPeriod]
  )

  const avgTicket =
    paidOrdersInPeriod.length > 0 ? totalRevenue / paidOrdersInPeriod.length : 0

  // MRR de membresía: solo cuenta membresías pagas activas hoy. Las
  // cortesías y los meses gratis que vienen con IC NO suman al MRR porque
  // son ingresos que nunca cobraste (un mes gratis incluido en IC vence
  // sin renovación si el alumno no paga). Métrica de estado, no de flujo.
  const mrr = useMemo(() => {
    const membresiaCourse = courses.find((c) => c.slug === "membresia")
    if (!membresiaCourse) return { count: 0, total: 0 }
    const activeMembers = userCourses.filter((uc) => {
      if (uc.course_id !== membresiaCourse.id) return false
      if (!uc.is_active) return false
      if (uc.expires_at && new Date(uc.expires_at).getTime() <= nowTs) return false
      // Solo pagos reales: descartamos gratis, manuales sin pago, y los
      // accesos donde amount_paid es 0/null (cortesías).
      if (uc.grant_type !== "paid") return false
      if (uc.amount_paid === null || Number(uc.amount_paid) <= 0) return false
      return true
    })
    return {
      count: activeMembers.length,
      total: activeMembers.length * Number(membresiaCourse.price),
    }
  }, [courses, userCourses, nowTs])

  // Alumnos activos en el período: usuarios con last_sign_in_at dentro de
  // la ventana. Si no hay período (all), contamos los que alguna vez
  // ingresaron al sitio post-registro.
  const activeUsers = useMemo(() => {
    return users.filter((u) => {
      if (!u.lastSignInAt) return false
      if (!from) return true
      return new Date(u.lastSignInAt).getTime() >= from.getTime()
    })
  }, [users, from])

  // Postulaciones del período por estado.
  const applicationsInPeriod = useMemo(() => {
    return applications.filter((a) => {
      if (!from) return true
      return new Date(a.created_at).getTime() >= from.getTime()
    })
  }, [applications, from])

  const applicationsByStatus = useMemo(() => {
    const buckets: Record<string, number> = {}
    for (const a of applicationsInPeriod) {
      buckets[a.status] = (buckets[a.status] ?? 0) + 1
    }
    return buckets
  }, [applicationsInPeriod])

  // ---------- BLOQUE 2: Salud del producto ----------

  // Orden fijo definido por Franco para que el panel siempre cuente la
  // misma historia: arranca Investment (más entry-level), después Trading
  // (más técnico), cierra con IC (premium). IC aparece con placeholder
  // hasta que tengamos métrica de asistencia desde Cal.com webhook.
  const COURSE_ORDER_IN_HEALTH = [
    "kickstart-investment",
    "expert-investment",
    "kickstart-trading",
    "trading-lab",
    "inner-circle",
  ]

  const courseHealth = useMemo(() => {
    const bySlug = new Map(courses.map((c) => [c.slug, c]))

    return COURSE_ORDER_IN_HEALTH.map((slug) => {
      const course = bySlug.get(slug)
      if (!course) return null

      const total = getTotalModulesBySlug(course.slug)

      // Si no se mide por módulos (caso IC), devolvemos un shape distinto
      // con flag `placeholder: true` para que el render muestre el card
      // de "métricas pendientes" en lugar de barras vacías.
      if (total === 0) {
        return {
          slug: course.slug,
          name: course.name,
          color: colorForSlug(course.slug),
          placeholder: true as const,
        }
      }

      const progressRows = courseProgress.filter((p) => p.course_id === course.id)
      const totalUsersWithAccess = userCourses.filter(
        (uc) => uc.course_id === course.id && uc.is_active
      ).length

      // Distribución por tramos de progreso entre alumnos con acceso activo
      // (no entre todos los que tienen progress row, porque puede haber gente
      // vieja revocada). El 100% se separa en su propio tramo (`done`) para que
      // NO se solape con "67-99%": así la barra apilada cuenta una sola historia
      // y el tramo final ES la tasa de finalización, sin números que compitan.
      const buckets = { b0: 0, b1: 0, b2: 0, b3: 0 } // 0% · 1-33% · 34-66% · 67-99%
      let done = 0 // 100%
      const activeAssignmentsForCourse = userCourses.filter(
        (uc) => uc.course_id === course.id && uc.is_active
      )
      for (const uc of activeAssignmentsForCourse) {
        const userProgress = progressRows.find((p) => p.user_id === uc.user_id)
        const completed = userProgress
          ? countCompletedModules(userProgress.completed_modules, total)
          : 0
        const pct = (completed / total) * 100
        if (pct >= 100) done++
        else if (pct === 0) buckets.b0++
        else if (pct <= 33) buckets.b1++
        else if (pct <= 66) buckets.b2++
        else buckets.b3++
      }

      const completionRate =
        totalUsersWithAccess > 0 ? (done / totalUsersWithAccess) * 100 : 0

      return {
        slug: course.slug,
        name: course.name,
        color: colorForSlug(course.slug),
        totalModules: total,
        totalUsersWithAccess,
        done,
        completionRate,
        buckets,
        placeholder: false as const,
      }
    }).filter((x): x is NonNullable<typeof x> => x !== null)
  }, [courses, courseProgress, userCourses])

  // ---------- Métricas de Cal.com (reservas globales) ----------
  //
  // Conteo agregado de clases reservadas. No se asocia a curso porque las
  // sesiones de Cal cubren cualquier tema y no podemos discriminar. Sirve
  // como señal de uso global del servicio de mentoría: ¿la gente lo está
  // aprovechando o solo paga y nunca agenda?
  const classBookingsStats = useMemo(() => {
    const now = new Date()
    const in7Days = new Date(now)
    in7Days.setDate(in7Days.getDate() + 7)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const confirmed = classBookings.filter((b) => b.status === "confirmed" || b.status === "rescheduled")

    const upcoming7d = confirmed.filter((b) => {
      if (!b.start_at) return false
      const t = new Date(b.start_at).getTime()
      return t >= now.getTime() && t <= in7Days.getTime()
    }).length

    const monthToDate = confirmed.filter((b) => {
      if (!b.start_at) return false
      const t = new Date(b.start_at).getTime()
      // Clases que ya pasaron este mes (asistencia teórica, status confirmed
      // no implica que hayan asistido pero es lo más cerca que llegamos sin
      // un webhook de meeting_ended de Cal).
      return t >= startOfMonth.getTime() && t <= now.getTime()
    }).length

    const cancelledLast30 = classBookings.filter((b) => {
      if (b.status !== "cancelled") return false
      if (!b.start_at) return false
      const t = new Date(b.start_at).getTime()
      return t >= now.getTime() - 30 * 24 * 60 * 60 * 1000
    }).length

    return { upcoming7d, monthToDate, cancelledLast30, total: classBookings.length }
  }, [classBookings])

  // ---------- IC: sub-barras de progreso por disciplina interna ----------
  //
  // El Inner Circle se compone de 3 sub-disciplinas con módulos separados
  // persistidos en course_progress con slugs distintos:
  //   - Obra Maestra              → slug `inner-circle`           (10 módulos)
  //   - IC Inversiones (interno)  → slug `inner-circle-inversiones` (5 módulos)
  //   - IC Trading (interno)      → slug `inner-circle-trading`     (5 módulos)
  //
  // Para cada sub-disciplina calculamos % de finalización entre alumnos con
  // acceso activo al IC principal (no entre todos los que tienen ese curso
  // interno asignado, porque siempre se asigna en paquete con el IC).
  const innerCircleSubBars = useMemo(() => {
    const icCourse = courses.find((c) => c.slug === "inner-circle")
    if (!icCourse) return null

    const icActiveUserIds = new Set(
      userCourses
        .filter(
          (uc) =>
            uc.course_id === icCourse.id &&
            uc.is_active &&
            (!uc.expires_at || new Date(uc.expires_at).getTime() > nowTs)
        )
        .map((uc) => uc.user_id)
    )

    const subDisciplines = [
      { slug: "inner-circle", label: "Obra Maestra", totalModules: 10 },
      { slug: "inner-circle-inversiones", label: "IC Inversiones", totalModules: 5 },
      { slug: "inner-circle-trading", label: "IC Trading", totalModules: 5 },
    ]

    return subDisciplines.map((sd) => {
      const course = courses.find((c) => c.slug === sd.slug)
      if (!course) {
        return { ...sd, completed100: 0, completionRate: 0, totalUsers: icActiveUserIds.size }
      }

      const progressRows = courseProgress.filter(
        (p) => p.course_id === course.id && icActiveUserIds.has(p.user_id)
      )
      const completed100 = progressRows.filter(
        (p) => countCompletedModules(p.completed_modules, sd.totalModules) >= sd.totalModules
      ).length

      const completionRate =
        icActiveUserIds.size > 0 ? (completed100 / icActiveUserIds.size) * 100 : 0

      return {
        ...sd,
        completed100,
        completionRate,
        totalUsers: icActiveUserIds.size,
      }
    })
  }, [courses, userCourses, courseProgress, nowTs])

  // ---------- Retención de Membresía (métrica separada) ----------
  //
  // La salud del IC NO se mide por logueos (eso es engagement general).
  // La verdadera retención del IC = ¿siguen pagando la membresía mensual?
  // Renovaron = pagaron al menos un mes después del primer mes gratis.
  //
  // Computamos:
  //   - active: cantidad de membresías PAGAS vigentes hoy (es el cliente
  //     que decidió pagar después del primer mes gratis del IC).
  //   - lapsed: alumnos que tuvieron membresía paga alguna vez y hoy
  //     no tienen ninguna activa (dejaron caer).
  //   - retentionRate: active / (active + lapsed).
  //
  // No mezclamos grupos IC (que se mide aparte). Esta es métrica directa
  // del producto Membresía.
  const membershipRetention = useMemo(() => {
    const membresiaCourse = courses.find((c) => c.slug === "membresia")
    if (!membresiaCourse) return null

    const membresiaRows = userCourses.filter((uc) => uc.course_id === membresiaCourse.id)

    // Alumnos que pagaron alguna membresía (grant_type=paid + amount>0).
    // Las membresías gratis (incluidas con IC) NO entran en el denominador.
    const everPaidUserIds = new Set(
      membresiaRows
        .filter(
          (uc) =>
            uc.grant_type === "paid" &&
            uc.amount_paid !== null &&
            Number(uc.amount_paid) > 0
        )
        .map((uc) => uc.user_id)
    )

    // De esos, cuáles tienen una membresía paga ACTIVA hoy (no expirada).
    const activePayingUserIds = new Set(
      membresiaRows
        .filter((uc) => {
          if (!everPaidUserIds.has(uc.user_id)) return false
          if (!uc.is_active) return false
          if (uc.expires_at && new Date(uc.expires_at).getTime() <= nowTs) return false
          if (uc.grant_type !== "paid") return false
          if (uc.amount_paid === null || Number(uc.amount_paid) <= 0) return false
          return true
        })
        .map((uc) => uc.user_id)
    )

    const active = activePayingUserIds.size
    const lapsed = everPaidUserIds.size - active
    const totalEver = everPaidUserIds.size
    const retentionRate = totalEver > 0 ? (active / totalEver) * 100 : 0

    // Renovaciones del último mes: membresías pagas con granted_at en los
    // últimos 30 días. Como cada mes se persiste una row nueva (granted_at
    // nuevo), esto cuenta cuántas mensualidades cobramos en el último mes.
    const last30 = nowTs - 30 * 24 * 60 * 60 * 1000
    const renewalsLast30 = membresiaRows.filter(
      (uc) =>
        uc.grant_type === "paid" &&
        uc.amount_paid !== null &&
        Number(uc.amount_paid) > 0 &&
        new Date(uc.granted_at).getTime() >= last30
    ).length

    // Lista de últimos que dejaron caer (para acción comercial): membresía
    // paga más reciente venció en últimos 60 días y no hay nueva activa.
    const lapsedRecent = [...everPaidUserIds]
      .map((uid) => {
        if (activePayingUserIds.has(uid)) return null
        const userPaidRows = membresiaRows.filter(
          (uc) =>
            uc.user_id === uid &&
            uc.grant_type === "paid" &&
            uc.amount_paid !== null &&
            Number(uc.amount_paid) > 0
        )
        if (userPaidRows.length === 0) return null
        const lastExpiry = userPaidRows
          .map((uc) => (uc.expires_at ? new Date(uc.expires_at).getTime() : 0))
          .reduce((a, b) => Math.max(a, b), 0)
        if (lastExpiry === 0) return null
        const daysAgo = Math.floor((nowTs - lastExpiry) / (1000 * 60 * 60 * 24))
        if (daysAgo < 0 || daysAgo > 60) return null
        const u = userById[uid]
        if (!u) return null
        return { id: uid, email: u.email, fullName: u.fullName, daysAgo }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => a.daysAgo - b.daysAgo)

    return {
      active,
      lapsed,
      totalEver,
      retentionRate,
      renewalsLast30,
      lapsedRecent,
    }
  }, [courses, userCourses, userById, nowTs])

  // ---------- BLOQUE 3: Retención IC + alumnos en riesgo ----------

  const icRetention = useMemo(() => {
    const ic = courses.find((c) => c.slug === "inner-circle")
    if (!ic) return null

    const buckets = [
      { label: "30 días", days: 30 },
      { label: "60 días", days: 60 },
      { label: "90 días", days: 90 },
      { label: "180 días", days: 180 },
      { label: "365 días", days: 365 },
    ]

    return buckets.map((b) => {
      // Alumnos que entraron al IC hace al menos `days` días.
      const group = userCourses.filter((uc) => {
        if (uc.course_id !== ic.id) return false
        const grantedAt = new Date(uc.granted_at).getTime()
        return nowTs - grantedAt >= b.days * 24 * 60 * 60 * 1000
      })

      // De ese grupo, cuántos siguen logueándose en los últimos 14 días.
      const stillActive = group.filter((uc) => {
        const user = userById[uc.user_id]
        if (!user?.lastSignInAt) return false
        return nowTs - new Date(user.lastSignInAt).getTime() <= 14 * 24 * 60 * 60 * 1000
      })

      return {
        label: b.label,
        groupSize: group.length,
        stillActive: stillActive.length,
        retentionPct: group.length > 0 ? (stillActive.length / group.length) * 100 : 0,
      }
    })
  }, [courses, userCourses, userById, nowTs])

  // Índice user_id -> UserCourse[] activos no expirados.
  // Se calcula UNA vez por cambio en userCourses en lugar de filtrar el
  // array entero N veces (una por cada user que evaluemos abajo). Con N
  // users y M userCourses, este index baja atRiskStudents de O(N·M) a
  // O(N + M). Con 2000 alumnos no se nota la diferencia, con 20.000
  // la pestaña freezea sin index.
  const activeUserCoursesByUserId = useMemo(() => {
    const map = new Map<string, typeof userCourses>()
    for (const uc of userCourses) {
      if (!uc.is_active) continue
      if (uc.expires_at && new Date(uc.expires_at).getTime() <= nowTs) continue
      const bucket = map.get(uc.user_id)
      if (bucket) bucket.push(uc)
      else map.set(uc.user_id, [uc])
    }
    return map
  }, [userCourses, nowTs])

  // Alumnos en riesgo: tienen al menos un curso activo y no entran hace
  // 14+ días. Ordenados por días sin entrar descendente.
  const atRiskStudents = useMemo(() => {
    return users
      .filter((u) => activeUserCoursesByUserId.has(u.id))
      .map((u) => {
        const daysAgo = u.lastSignInAt
          ? Math.floor(
              (nowTs - new Date(u.lastSignInAt).getTime()) / (1000 * 60 * 60 * 24)
            )
          : null
        const userActiveCourses = activeUserCoursesByUserId.get(u.id) ?? []
        return {
          id: u.id,
          email: u.email,
          fullName: u.fullName,
          daysAgo,
          activeCourses: userActiveCourses
            .map((uc) => courseById[uc.course_id]?.name ?? "—")
            .filter((n) => n !== "—"),
        }
      })
      // En riesgo = nunca entró (daysAgo null) o hace 14+ días.
      .filter((u) => u.daysAgo === null || u.daysAgo >= 14)
      .sort((a, b) => {
        if (a.daysAgo === null) return -1
        if (b.daysAgo === null) return 1
        return b.daysAgo - a.daysAgo
      })
  }, [users, activeUserCoursesByUserId, courseById, nowTs])

  // ---------- BLOQUE 6: Funnel escalera (Kickstart → Expert → IC) ----------
  //
  // El corazón del modelo de negocio: el alumno debería avanzar Kickstart →
  // Expert/Lab → Inner Circle. Este funnel mide si la escalera está
  // funcionando como conversor o si la gente se queda en Kickstart.
  //
  // Conta solo accesos pagos reales (descartamos free/manual/cortesía) para
  // que el % refleje conversión de mercado, no regalos. IC tampoco lo
  // contamos si fue free (ej. invitaciones para alumnos viejos).
  const stairFunnel = useMemo(() => {
    const idBySlug: Record<string, string | undefined> = {}
    for (const c of courses) {
      idBySlug[c.slug] = c.id
    }

    const isPaidAccess = (uc: MetricsUserCourseRow) => {
      if (uc.grant_type !== "paid") return false
      if (uc.amount_paid === null || Number(uc.amount_paid) <= 0) return false
      return true
    }

    const usersWithPaidCourse = (slug: string): Set<string> => {
      const courseId = idBySlug[slug]
      if (!courseId) return new Set()
      return new Set(
        userCourses
          .filter((uc) => uc.course_id === courseId && isPaidAccess(uc))
          .map((uc) => uc.user_id)
      )
    }

    const paths = [
      {
        key: "investment" as const,
        label: "Inversión",
        color: "#5BB8D4",
        steps: [
          { slug: "kickstart-investment", label: "Kickstart Investment" },
          { slug: "expert-investment", label: "Expert Investment" },
          { slug: "inner-circle", label: "Inner Circle" },
        ],
      },
      {
        key: "trading" as const,
        label: "Trading",
        color: "#7DD4C0",
        steps: [
          { slug: "kickstart-trading", label: "Kickstart Trading" },
          { slug: "trading-lab", label: "Trading Lab" },
          { slug: "inner-circle", label: "Inner Circle" },
        ],
      },
    ]

    return paths.map((path) => {
      const buyersBySlug = path.steps.map((s) => usersWithPaidCourse(s.slug))

      // Funnel acumulativo: cada paso requiere haber pasado por todos los
      // anteriores. Sin esto contaríamos a un alumno que compró IC directo
      // sin Kickstart como "conversión", lo cual ensucia la narrativa.
      const cumulative: Set<string>[] = []
      buyersBySlug.forEach((set, i) => {
        if (i === 0) {
          cumulative.push(new Set(set))
        } else {
          const prev = cumulative[i - 1]
          const intersect = new Set([...set].filter((u) => prev.has(u)))
          cumulative.push(intersect)
        }
      })

      const stepStats = path.steps.map((s, i) => {
        const count = cumulative[i].size
        const prevCount = i === 0 ? count : cumulative[i - 1].size
        const conversionPct = prevCount > 0 ? (count / prevCount) * 100 : 0
        return {
          slug: s.slug,
          label: s.label,
          count,
          conversionPct: i === 0 ? 100 : conversionPct,
        }
      })

      return {
        key: path.key,
        label: path.label,
        color: path.color,
        stepStats,
        totalKickstart: cumulative[0].size,
        reachedIC: cumulative[cumulative.length - 1].size,
      }
    })
  }, [courses, userCourses])

  // ---------- BLOQUE 4: Evolución temporal ----------

  // Ingresos por semana, últimas 12 semanas (siempre, no depende del period
  // dropdown porque la idea es ver tendencia larga).
  const revenueByWeek = useMemo(() => {
    const weeks: Array<{ label: string; total: number }> = []
    const now = new Date()
    // Llevamos a lunes de la semana actual.
    const startOfThisWeek = new Date(now)
    const day = startOfThisWeek.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    startOfThisWeek.setDate(startOfThisWeek.getDate() + diffToMonday)
    startOfThisWeek.setHours(0, 0, 0, 0)

    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(startOfThisWeek)
      weekStart.setDate(weekStart.getDate() - i * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)

      const total = orders
        .filter((o) => {
          if (o.status !== "paid") return false
          const t = new Date(o.created_at).getTime()
          return t >= weekStart.getTime() && t < weekEnd.getTime()
        })
        .reduce((sum, o) => sum + Number(o.amount_usd), 0)

      weeks.push({
        label: formatDateShort(weekStart.toISOString()),
        total,
      })
    }
    return weeks
  }, [orders])

  // Postulaciones por día, últimos 30 días.
  const applicationsByDay = useMemo(() => {
    const days: Array<{ label: string; count: number }> = []
    const now = new Date()
    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)

    for (let i = 29; i >= 0; i--) {
      const dayStart = new Date(startOfToday)
      dayStart.setDate(dayStart.getDate() - i)
      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayEnd.getDate() + 1)

      const count = applications.filter((a) => {
        const t = new Date(a.created_at).getTime()
        return t >= dayStart.getTime() && t < dayEnd.getTime()
      }).length

      days.push({
        label: dayStart.toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
        }),
        count,
      })
    }
    return days
  }, [applications])

  // ---------- BLOQUE 5: Top cursos y alumnos ----------

  const topCoursesByRevenue = useMemo(() => {
    // Reutilizamos paidOrdersInPeriod que ya filtra status=paid, amount>0 y
    // ventana de tiempo. Así nos aseguramos consistencia con el KPI de
    // ingresos: lo que muestra esta tarjeta tiene que sumar a lo que dice
    // el KPI principal.
    const totals: Record<string, { name: string; slug: string; total: number; count: number }> = {}
    for (const o of paidOrdersInPeriod) {
      const course = courseById[o.course_id]
      if (!course) continue
      if (!totals[o.course_id]) {
        totals[o.course_id] = { name: course.name, slug: course.slug, total: 0, count: 0 }
      }
      totals[o.course_id].total += Number(o.amount_usd)
      totals[o.course_id].count++
    }
    return Object.values(totals).sort((a, b) => b.total - a.total)
  }, [paidOrdersInPeriod, courseById])

  const topStudentsByEngagement = useMemo(() => {
    // Engagement = suma de módulos completados (capeada por totalModules
    // de cada curso para no inflar por basura vieja en localStorage).
    // Inner Circle y Membresía no aportan al puntaje hasta que tengamos
    // métrica de asistencia a clases (pendiente Cal.com webhook).
    const totals: Record<string, { id: string; fullName: string | null; email: string; modules: number }> = {}

    for (const p of courseProgress) {
      const course = courseById[p.course_id]
      if (!course) continue
      const max = getTotalModulesBySlug(course.slug)
      if (max === 0) continue
      const count = countCompletedModules(p.completed_modules, max)
      if (count === 0) continue

      const user = userById[p.user_id]
      if (!user) continue

      if (!totals[p.user_id]) {
        totals[p.user_id] = { id: p.user_id, fullName: user.fullName, email: user.email, modules: 0 }
      }
      totals[p.user_id].modules += count
    }
    return Object.values(totals).sort((a, b) => b.modules - a.modules)
  }, [courseProgress, courseById, userById])

  // ---------- Render ----------

  return (
    <div className="space-y-6">
      {/* Encabezado con dropdown de período. El período afecta KPIs, top
          cursos y postulaciones, pero NO retención (siempre actual), MRR
          (siempre actual), gráficos de evolución (ventanas fijas), ni la
          lista de alumnos en riesgo. */}
      <div className="glass-card flex flex-wrap items-end justify-between gap-3 rounded-2xl p-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#7DD4C0]">Período</p>
          <h2 className="mt-1  text-2xl tracking-tight text-white">
            {PERIOD_LABELS[period]}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-all ${
                period === p
                  ? "bg-[#1E1E1E] text-[#7DD4C0]"
                  : "border border-[#2A2A2A] text-[#888888] hover:text-[#CCCCCC]"
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- BLOQUE 1: KPIs ---------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          eyebrow="MRR Membresía"
          value={formatUsd(mrr.total)}
          sub={`${mrr.count} activos · $50/mes`}
          accent="#D4B86A"
        />
        <KpiCard
          eyebrow={`Ingresos · ${PERIOD_LABELS[period]}`}
          value={formatUsd(totalRevenue)}
          sub={`${paidOrdersInPeriod.length} ventas · ticket ${formatUsd(avgTicket)}`}
          accent="#7DD4C0"
        />
        <KpiCard
          eyebrow={`Alumnos activos · ${PERIOD_LABELS[period]}`}
          value={String(activeUsers.length)}
          sub={`de ${users.length} totales`}
          accent="#5BB8D4"
        />
        <KpiCard
          eyebrow={`Postulaciones · ${PERIOD_LABELS[period]}`}
          value={String(applicationsInPeriod.length)}
          sub={Object.entries(applicationsByStatus)
            .map(([k, v]) => `${v} ${k}`)
            .join(" · ")}
          accent="#D4B86A"
        />
      </div>

      {/* ---------- BLOQUE 2: Salud del producto ---------- */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h2 className=" text-2xl tracking-tight text-white">
          Salud del producto
        </h2>
        <p className="mt-1 text-sm text-[#888888]">
          Tasa de finalización (100% módulos completados) y distribución de progreso
          entre alumnos con acceso activo. No incluye Inner Circle ni Membresía.
        </p>

        {courseHealth.length === 0 ? (
          <p className="mt-6 text-sm text-[#666666]">Sin datos suficientes todavía.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {courseHealth.map((c) =>
              c.placeholder ? (
                <div
                  key={c.slug}
                  className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4"
                >
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="text-lg tracking-tight" style={{ color: c.color }}>
                        {c.name}
                      </h3>
                    </div>
                    {innerCircleSubBars && (
                      <span className="text-xs text-[#888888]">
                        {innerCircleSubBars[0]?.totalUsers ?? 0} alumnos activos
                      </span>
                    )}
                  </div>

                  {innerCircleSubBars && innerCircleSubBars[0]?.totalUsers > 0 ? (
                    <div className="mt-4 space-y-3">
                      {innerCircleSubBars.map((sd) => (
                        <div key={sd.slug}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#CCCCCC]">
                              {sd.label}
                              <span className="ml-2 text-[#666666]">
                                {sd.totalModules} mods
                              </span>
                            </span>
                            <span className="text-[#888888]">
                              <span className="font-semibold text-white">
                                {sd.completionRate.toFixed(0)}%
                              </span>
                              <span className="ml-2 text-[10px] text-[#666666]">
                                {sd.completed100}/{sd.totalUsers} terminaron
                              </span>
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#1A1A1A]">
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${sd.completionRate}%`,
                                backgroundColor: c.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-[#666666]">
                      Sin alumnos IC activos todavía.
                    </p>
                  )}
                </div>
              ) : (
                <div
                  key={c.slug}
                  className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4"
                >
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="text-lg tracking-tight" style={{ color: c.color }}>
                        {c.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-white">
                        {c.completionRate.toFixed(0)}%
                      </p>
                      <p className="text-xs text-[#888888]">
                        {c.done}/{c.totalUsersWithAccess} terminaron el curso
                      </p>
                    </div>
                  </div>

                  {/* Distribución de avance: una sola barra apilada que reparte
                      a los alumnos con acceso activo por tramo de progreso. Se
                      lee de un vistazo qué proporción no arrancó, está en curso
                      o terminó. La leyenda de abajo da los conteos exactos. */}
                  <ProgressDistribution
                    total={c.totalUsersWithAccess}
                    buckets={c.buckets}
                    done={c.done}
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ---------- BLOQUE 6: Funnel escalera ---------- */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h2 className=" text-2xl tracking-tight text-white">
          Conversión del modelo escalera
        </h2>
        <p className="mt-1 text-sm text-[#888888]">
          Cuánta gente del Kickstart sigue subiendo hasta Inner Circle. Solo accesos pagos
          reales (cortesías y gratis excluidos). Conversión acumulativa por paso.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {stairFunnel.map((path) => (
            <div
              key={path.key}
              className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4"
            >
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: path.color }}
                  >
                    Path
                  </p>
                  <h3 className="mt-0.5  text-xl tracking-tight text-white">
                    {path.label}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-white">
                    {path.totalKickstart > 0
                      ? ((path.reachedIC / path.totalKickstart) * 100).toFixed(0)
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-[#888888]">llegó a IC</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {path.stepStats.map((step, i) => {
                  // El ancho de la barra de cada paso se calcula sobre el total
                  // del primer paso (Kickstart). Así la pérdida visual entre
                  // pasos es proporcional al funnel real.
                  const widthPct =
                    path.totalKickstart > 0 ? (step.count / path.totalKickstart) * 100 : 0
                  return (
                    <div key={step.slug}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#CCCCCC]">{step.label}</span>
                        <span className="text-[#888888]">
                          <span className="font-semibold text-white">{step.count}</span>{" "}
                          {i > 0 && (
                            <span className="ml-2 text-[10px] text-[#666666]">
                              {step.conversionPct.toFixed(0)}% del paso anterior
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#1A1A1A]">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${widthPct}%`,
                            backgroundColor: path.color,
                            opacity: 1 - i * 0.2,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Retención de Membresía (métrica separada) ---------- */}
      {membershipRetention && (
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className=" text-2xl tracking-tight text-white">
                Retención de Membresía
              </h2>
              <p className="mt-1 text-sm text-[#888888]">
                Quiénes siguen pagando los $50/mes después del primer mes gratis incluido
                con IC. Cortesías y meses regalados no cuentan.
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold text-white">
                {membershipRetention.retentionRate.toFixed(0)}%
              </p>
              <p className="text-xs text-[#888888]">tasa de retención</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3 text-center">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4B86A]">
                Activas hoy
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {membershipRetention.active}
              </p>
            </div>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3 text-center">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#F2B3B3]">
                Dejaron caer
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {membershipRetention.lapsed}
              </p>
            </div>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3 text-center">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#7DD4C0]">
                Renov. últimos 30d
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {membershipRetention.renewalsLast30}
              </p>
            </div>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3 text-center">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#888888]">
                Total históricos
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {membershipRetention.totalEver}
              </p>
            </div>
          </div>

          {membershipRetention.lapsedRecent.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-[0.15em] text-[#888888]">
                Dejaron caer en últimos 60 días — candidatos a reactivación
              </h3>
              <div className="mt-3 space-y-2">
                {membershipRetention.lapsedRecent.slice(0, 10).map((u) => (
                  <Link
                    key={u.id}
                    href={`/admin?tab=usuarios&userId=${u.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3 transition-colors hover:border-[#7DD4C0]/40 hover:bg-[#141414]"
                  >
                    <span className="truncate text-sm text-[#CCCCCC]">
                      {u.fullName || u.email}
                    </span>
                    <span className="shrink-0 text-xs text-[#888888]">
                      venció hace <span className="font-semibold text-[#F2B3B3]">{u.daysAgo}d</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------- BLOQUE 3: Retención IC + alumnos en riesgo ---------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <h2 className=" text-2xl tracking-tight text-white">
            Retención Inner Circle
          </h2>
          <p className="mt-1 text-sm text-[#888888]">
            % de alumnos de cada grupo que sigue ingresando en los últimos 14 días.
            Complementa la retención de membresía: mide engagement, no pago.
          </p>

          {icRetention === null ? (
            <p className="mt-6 text-sm text-[#666666]">No hay curso Inner Circle configurado.</p>
          ) : (
            <div className="mt-6 space-y-3">
              {icRetention.map((b) => (
                <div key={b.label} className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#CCCCCC]">{b.label}</span>
                    <span className="text-[#888888]">
                      {b.stillActive}/{b.groupSize}{" "}
                      <span className="text-white font-semibold">
                        {b.retentionPct.toFixed(0)}%
                      </span>
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#1A1A1A]">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${b.retentionPct}%`,
                        backgroundColor: "#D4B86A",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <h2 className=" text-2xl tracking-tight text-white">
            Alumnos en riesgo
          </h2>
          <p className="mt-1 text-sm text-[#888888]">
            Con curso activo y sin entrar hace 14+ días. Click en el alumno para gestionar.
          </p>

          {atRiskStudents.length === 0 ? (
            <p className="mt-6 text-sm text-[#666666]">Nadie en riesgo ahora mismo.</p>
          ) : (
            <>
              <div className="mt-6 max-h-96 space-y-2 overflow-y-auto pr-1">
                {atRiskStudents
                  .slice(0, expandedAtRisk ? 100 : 20)
                  .map((s) => (
                    <Link
                      key={s.id}
                      href={`/admin?tab=usuarios&userId=${s.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3 transition-colors hover:border-[#7DD4C0]/40 hover:bg-[#141414]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-[#CCCCCC]">
                          {s.fullName || s.email}
                        </p>
                        <p className="truncate text-xs text-[#888888]">
                          {s.activeCourses.join(" · ") || "sin cursos"}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-[#F2B3B3]">
                          {s.daysAgo === null ? "nunca" : `${s.daysAgo}d`}
                        </p>
                        <p className="text-[10px] text-[#666666]">sin entrar</p>
                      </div>
                    </Link>
                  ))}
              </div>
              {atRiskStudents.length > 20 && (
                <button
                  type="button"
                  onClick={() => setExpandedAtRisk((v) => !v)}
                  className="mt-3 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/40 px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#888888] transition-colors hover:border-[#7DD4C0]/60 hover:text-white"
                >
                  {expandedAtRisk ? "Mostrar menos" : `Ver todos (${atRiskStudents.length})`}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ---------- BLOQUE 5: Top cursos + top alumnos ---------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <h2 className=" text-2xl tracking-tight text-white">
            Top cursos · {PERIOD_LABELS[period]}
          </h2>
          <p className="mt-1 text-sm text-[#888888]">Por ingresos generados.</p>

          {topCoursesByRevenue.length === 0 ? (
            <p className="mt-6 text-sm text-[#666666]">Sin ventas en este período.</p>
          ) : (
            <>
              <div className="mt-6 space-y-2">
                {topCoursesByRevenue
                  .slice(0, expandedTopCourses ? 20 : 5)
                  .map((c, i) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="text-xs text-[#666666]">#{i + 1}</span>
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: colorForSlug(c.slug) }}
                        />
                        <span className="truncate text-sm text-[#CCCCCC]">{c.name}</span>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-white">{formatUsd(c.total)}</p>
                        <p className="text-[10px] text-[#666666]">{c.count} ventas</p>
                      </div>
                    </div>
                  ))}
              </div>
              {topCoursesByRevenue.length > 5 && (
                <button
                  type="button"
                  onClick={() => setExpandedTopCourses((v) => !v)}
                  className="mt-3 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/40 px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#888888] transition-colors hover:border-[#7DD4C0]/60 hover:text-white"
                >
                  {expandedTopCourses ? "Mostrar menos" : `Ver todos (${topCoursesByRevenue.length})`}
                </button>
              )}
            </>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <h2 className=" text-2xl tracking-tight text-white">
            Top alumnos · engagement
          </h2>
          <p className="mt-1 text-sm text-[#888888]">
            Por suma de módulos completados (capeada por total real de cada curso).
          </p>

          {topStudentsByEngagement.length === 0 ? (
            <p className="mt-6 text-sm text-[#666666]">Sin progreso registrado todavía.</p>
          ) : (
            <>
              <div className="mt-6 space-y-2">
                {topStudentsByEngagement
                  .slice(0, expandedTopStudents ? 20 : 5)
                  .map((s, i) => (
                    <Link
                      key={s.id}
                      href={`/admin?tab=usuarios&userId=${s.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3 transition-colors hover:border-[#7DD4C0]/40 hover:bg-[#141414]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="text-xs text-[#666666]">#{i + 1}</span>
                        <span className="truncate text-sm text-[#CCCCCC]">
                          {s.fullName || s.email}
                        </span>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-[#7DD4C0]">{s.modules}</p>
                        <p className="text-[10px] text-[#666666]">módulos</p>
                      </div>
                    </Link>
                  ))}
              </div>
              {topStudentsByEngagement.length > 5 && (
                <button
                  type="button"
                  onClick={() => setExpandedTopStudents((v) => !v)}
                  className="mt-3 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/40 px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#888888] transition-colors hover:border-[#7DD4C0]/60 hover:text-white"
                >
                  {expandedTopStudents ? "Mostrar menos" : `Ver todos (${topStudentsByEngagement.length})`}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ---------- BLOQUE 4: Evolución temporal ---------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <h2 className=" text-2xl tracking-tight text-white">
            Ingresos por semana
          </h2>
          <p className="mt-1 text-sm text-[#888888]">Últimas 12 semanas.</p>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByWeek} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="label" stroke="#666666" fontSize={11} tick={{ fill: "#888888" }} />
                <YAxis stroke="#666666" fontSize={11} tick={{ fill: "#888888" }} tickFormatter={formatUsd} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111111", border: "1px solid #2A2A2A", borderRadius: 8 }}
                  labelStyle={{ color: "#CCCCCC" }}
                  formatter={(value: number) => [formatUsd(value), "Ingresos"]}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#7DD4C0"
                  strokeWidth={2}
                  dot={{ fill: "#7DD4C0", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <h2 className=" text-2xl tracking-tight text-white">
            Postulaciones por día
          </h2>
          <p className="mt-1 text-sm text-[#888888]">Últimos 30 días.</p>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationsByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="label" stroke="#666666" fontSize={10} tick={{ fill: "#888888" }} />
                <YAxis stroke="#666666" fontSize={11} tick={{ fill: "#888888" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111111", border: "1px solid #2A2A2A", borderRadius: 8 }}
                  labelStyle={{ color: "#CCCCCC" }}
                />
                <Bar dataKey="count" fill="#D4B86A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ---------- Reservas de clases (Cal.com) — al final, métrica complementaria ---------- */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className=" text-2xl tracking-tight text-white">
              Clases de mentoría · Cal.com
            </h2>
            <p className="mt-1 text-sm text-[#888888]">
              Reservas globales del servicio de mentoría. Cubre todos los cursos sin
              discriminar (Cal no mapea a curso específico). Señal de uso real del servicio.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#7DD4C0]">
              Próximas 7 días
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {classBookingsStats.upcoming7d}
            </p>
          </div>
          <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#5BB8D4]">
              Dadas este mes
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {classBookingsStats.monthToDate}
            </p>
          </div>
          <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#F2B3B3]">
              Canceladas 30d
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {classBookingsStats.cancelledLast30}
            </p>
          </div>
          <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#888888]">
              Total históricas
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {classBookingsStats.total}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- Subcomponentes ----------

function KpiCard({
  eyebrow,
  value,
  sub,
  accent,
}: {
  eyebrow: string
  value: string
  sub: string
  accent: string
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <p
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: accent }}
      >
        {eyebrow}
      </p>
      <p className="mt-2  text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-[#888888]">{sub}</p>
    </div>
  )
}

function ProgressDistribution({
  total,
  buckets,
  done,
}: {
  total: number
  buckets: { b0: number; b1: number; b2: number; b3: number }
  done: number
}) {
  // Tramos de izquierda (no arrancó) a derecha (terminó). El gris de "No
  // arrancó" es visible a propósito: es el cohorte más importante de detectar,
  // no algo "apagado". El resto sube por una rampa fija cian → teal → menta
  // (cada tramo distinguible del anterior), terminando en el más brillante.
  const segments = [
    { key: "b0", label: "No arrancó", value: buckets.b0, color: "#4A4A4A" },
    { key: "b1", label: "1-33%", value: buckets.b1, color: "#2F6E84" },
    { key: "b2", label: "34-66%", value: buckets.b2, color: "#5BB8D4" },
    { key: "b3", label: "67-99%", value: buckets.b3, color: "#7DD4C0" },
    { key: "done", label: "Terminó", value: done, color: "#A8E8D8" },
  ]

  if (total === 0) {
    return <p className="mt-3 text-xs text-[#666666]">Sin alumnos con acceso activo todavía.</p>
  }

  return (
    <div className="mt-4">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#1A1A1A]">
        {segments.map((s) =>
          s.value > 0 ? (
            <div
              key={s.key}
              className="h-full"
              style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
              title={`${s.label}: ${s.value}`}
            />
          ) : null
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5 text-xs">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[#888888]">{s.label}</span>
            <span className="font-semibold tabular-nums text-white">{s.value}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
