"use client"

import { useState, useMemo } from "react"
import { getTotalModulesBySlug, countCompletedModules } from "@/lib/courses/module-counts"

type ProfileRow = {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  role: string
  signup_source?: string | null
}

// wa.me requiere solo dígitos (sin +, espacios ni símbolos).
function toWhatsappDigits(phone: string): string {
  return phone.replace(/\D/g, "")
}

type CourseRow = {
  id: string
  name: string
  slug: string
  price: number
  discount_price: number | null
}

type UserCourseRow = {
  user_id: string
  course_id: string
  granted_at: string
  expires_at: string | null
  is_active: boolean
  grant_type: string | null
  amount_paid: number | null
  grant_notes: string | null
}

type OrderRow = {
  id: string
  user_id: string
  course_id: string
  amount_usd: number
  amount_ars: number | null
  provider: string
  provider_reference: string | null
  status: string
  created_at: string
}

// Progreso de módulos por curso. completed_modules es jsonb en Supabase,
// normalmente array de números (los módulos completados). Lo tipamos
// como unknown y lo normalizamos con countCompletedModules.
type CourseProgressRow = {
  user_id: string
  course_id: string
  completed_modules: unknown
}

// Reservas de Cal.com matcheadas por email del alumno (no por user_id
// porque Cal no conoce nuestros user_ids). Si el alumno agendó con un
// email distinto al de Flowdex, no aparece — limitación conocida.
type ClassBookingRow = {
  id: string
  user_email: string | null
  event_type: string | null
  start_at: string | null
  status: string
}

type Props = {
  users: ProfileRow[]
  courses: CourseRow[]
  assignments: UserCourseRow[]
  orders: OrderRow[]
  courseProgress: CourseProgressRow[]
  classBookings: ClassBookingRow[]
  initialSelectedUserId?: string | null
  grantCourseAction: (formData: FormData) => Promise<void>
  revokeCourseAction: (formData: FormData) => Promise<void>
  setTemporaryPasswordAction: (formData: FormData) => Promise<void>
}

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-[#7DD4C0]/15 text-[#7DD4C0]",
  pending: "bg-[#D4B87D]/15 text-[#D4B87D]",
  failed: "bg-[#7A2A2A]/20 text-[#F2B3B3]",
  expired: "bg-[#333]/30 text-[#888888]",
  refunded: "bg-[#5B8ED4]/15 text-[#90B8F2]",
}

const STATUS_LABELS: Record<string, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  failed: "Fallido",
  expired: "Expirado",
  refunded: "Reembolsado",
}

const GRANT_TYPE_LABELS: Record<string, string> = {
  free: "Gratis",
  manual: "Manual",
  paid: "Pagado",
}

export function UserPanel({
  users,
  courses,
  assignments,
  orders,
  courseProgress,
  classBookings,
  initialSelectedUserId = null,
  grantCourseAction,
  revokeCourseAction,
  setTemporaryPasswordAction,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialSelectedUserId)
  const [grantType, setGrantType] = useState("manual")

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return users.filter(
      (u) =>
        (u.email || "").toLowerCase().includes(q) ||
        (u.full_name || "").toLowerCase().includes(q)
    )
  }, [users, searchQuery])

  const selectedUser = users.find((u) => u.id === selectedUserId) ?? null

  const courseById = useMemo(
    () => courses.reduce<Record<string, CourseRow>>((acc, c) => { acc[c.id] = c; return acc }, {}),
    [courses]
  )

  const nowTs = Date.now()

  const userAssignments = useMemo(() => {
    if (!selectedUserId) return []
    return assignments.filter(
      (a) =>
        a.user_id === selectedUserId &&
        a.is_active &&
        (!a.expires_at || new Date(a.expires_at).getTime() > nowTs)
    )
  }, [assignments, selectedUserId, nowTs])

  const assignedCourseIds = new Set(userAssignments.map((a) => a.course_id))
  const availableCourses = courses.filter((c) => !assignedCourseIds.has(c.id))

  const userOrders = useMemo(() => {
    if (!selectedUserId) return []
    return orders.filter((o) => o.user_id === selectedUserId)
  }, [orders, selectedUserId])

  // Progreso por curso activo del alumno. Para cada acceso activo, vemos
  // si tiene una fila en course_progress y calculamos cuántos módulos
  // tiene completados sobre el total real del curso (de module-counts).
  // Cursos sin módulos numerados (membresía) los excluimos del cálculo.
  const userCourseProgress = useMemo(() => {
    if (!selectedUserId) return []
    return userAssignments
      .map((a) => {
        const course = courseById[a.course_id]
        if (!course) return null
        const total = getTotalModulesBySlug(course.slug)
        if (total === 0) return null
        const prog = courseProgress.find(
          (p) => p.user_id === selectedUserId && p.course_id === a.course_id
        )
        const completed = prog ? countCompletedModules(prog.completed_modules, total) : 0
        return {
          courseId: a.course_id,
          courseName: course.name,
          slug: course.slug,
          completed,
          total,
          pct: total > 0 ? (completed / total) * 100 : 0,
        }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
  }, [selectedUserId, userAssignments, courseById, courseProgress])

  // Reservas Cal.com del alumno. Matcheamos por email lowercase porque Cal
  // a veces envía con mayúsculas. Si el alumno usó otro email para Cal, no
  // aparece — caso conocido, lo mencionamos en la UI.
  const userBookings = useMemo(() => {
    if (!selectedUser?.email) return []
    const emailLower = selectedUser.email.toLowerCase()
    return classBookings
      .filter((b) => b.user_email?.toLowerCase() === emailLower)
      .sort((a, b) => {
        const ta = a.start_at ? new Date(a.start_at).getTime() : 0
        const tb = b.start_at ? new Date(b.start_at).getTime() : 0
        return tb - ta
      })
  }, [selectedUser, classBookings])

  function selectUser(userId: string) {
    setSelectedUserId(userId)
    setSearchQuery("")
    setGrantType("manual")
  }

  return (
    <div className="relative z-10 glass-card rounded-2xl p-6 sm:p-8">
      <h2 className=" text-3xl tracking-tight text-white">Gestión de usuarios</h2>
      <p className="mt-2 text-sm text-[#888888]">
        Buscá un usuario para ver y gestionar sus accesos, credenciales y órdenes.
      </p>

      {/* Buscador */}
      <div className="relative mt-6">
        <input
          type="text"
          placeholder="Buscar usuario por email o nombre..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setSelectedUserId(null)
          }}
          className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111]/80 px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
        />

        {/* Dropdown de resultados */}
        {searchQuery && !selectedUser && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#161616] shadow-xl">
            {filteredUsers.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#888888]">No se encontraron usuarios</p>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => selectUser(user.id)}
                  className="w-full border-b border-[#2A2A2A] px-4 py-3 text-left transition-colors last:border-0 hover:bg-[#1E1E1E]"
                >
                  <p className="text-sm text-white">{user.full_name || "Sin nombre"}</p>
                  <p className="text-xs text-[#888888]">{user.email}</p>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Ficha del usuario seleccionado */}
      {selectedUser && (
        <div className="mt-5">
          {/* Header usuario */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4">
            <div>
              <p className="font-semibold text-white">{selectedUser.full_name || "Sin nombre"}</p>
              <p className="text-sm text-[#888888]">{selectedUser.email}</p>
              {selectedUser.phone ? (
                <p className="mt-1 text-sm text-[#888888]">
                  <span className="text-[#666666]">Tel:</span>{" "}
                  <a
                    href={`https://wa.me/${toWhatsappDigits(selectedUser.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7DD4C0] hover:text-[#AEEBDB]"
                  >
                    {selectedUser.phone}
                  </a>
                </p>
              ) : (
                <p className="mt-1 text-xs text-[#666666]">Sin teléfono cargado</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  selectedUser.signup_source === "desk"
                    ? "bg-[#5BB8D4]/15 text-[#5BB8D4]"
                    : "bg-[#333] text-[#888]"
                }`}
                title="Origen de la cuenta"
              >
                {selectedUser.signup_source === "desk" ? "Desk" : "Academy"}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  selectedUser.role === "admin"
                    ? "bg-[#7DD4C0]/15 text-[#7DD4C0]"
                    : "bg-[#333] text-[#888]"
                }`}
              >
                {selectedUser.role}
              </span>
              <button
                type="button"
                onClick={() => { setSelectedUserId(null); setGrantType("manual") }}
                className="rounded-lg border border-[#2A2A2A] px-3 py-1.5 text-xs text-[#888888] transition-colors hover:text-white"
              >
                Cambiar usuario
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {/* Columna izquierda: accesos + asignar + contraseña */}
            <div className="space-y-4">

              {/* Accesos activos */}
              <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4">
                <h3 className=" text-xl tracking-tight text-white">Accesos activos</h3>
                {userAssignments.length === 0 ? (
                  <p className="mt-3 text-sm text-[#888888]">Sin accesos activos.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {userAssignments.map((a) => {
                      const course = courseById[a.course_id]
                      return (
                        <div
                          key={a.course_id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-[#2A2A2A] bg-[#0D0D0D] p-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm text-white">{course?.name || a.course_id}</p>
                            <p className="text-xs text-[#888888]">
                              {a.expires_at
                                ? `Vence ${new Date(a.expires_at).toLocaleDateString("es-AR")}`
                                : "Sin vencimiento"}
                              {a.grant_type && (
                                <span className="ml-2 text-[#7DD4C0]">
                                  {GRANT_TYPE_LABELS[a.grant_type] ?? a.grant_type}
                                </span>
                              )}
                              {a.amount_paid != null && (
                                <span className="ml-1 text-[#AAAAAA]">
                                  ${Number(a.amount_paid).toFixed(2)}
                                </span>
                              )}
                            </p>
                            {a.grant_notes && (
                              <p className="mt-0.5 truncate text-xs text-[#666666]">{a.grant_notes}</p>
                            )}
                          </div>
                          <form action={revokeCourseAction} className="shrink-0">
                            <input type="hidden" name="targetUserId" value={selectedUser.id} />
                            <input type="hidden" name="courseId" value={a.course_id} />
                            <input type="hidden" name="returnTab" value="usuarios" />
                            <input type="hidden" name="returnUserId" value={selectedUser.id} />
                            <button
                              type="submit"
                              className="rounded-lg border border-[#7A2A2A] bg-[#2A1111] px-3 py-1.5 text-xs font-semibold text-[#F2B3B3] transition-colors hover:bg-[#341414]"
                            >
                              Revocar
                            </button>
                          </form>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Asignar curso */}
              <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4">
                <h3 className=" text-xl tracking-tight text-white">Asignar curso</h3>
                {availableCourses.length === 0 ? (
                  <p className="mt-3 text-sm text-[#888888]">El usuario ya tiene todos los cursos activos.</p>
                ) : (
                  <form action={grantCourseAction} className="mt-3 space-y-3">
                    <input type="hidden" name="targetUserId" value={selectedUser.id} />
                    <input type="hidden" name="returnTab" value="usuarios" />
                    <input type="hidden" name="returnUserId" value={selectedUser.id} />

                    <label className="block text-xs text-[#AAAAAA]">
                      Curso
                      <select
                        name="courseId"
                        required
                        className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]"
                      >
                        <option value="">Seleccionar curso</option>
                        {availableCourses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} — ${Number(c.price).toFixed(0)} USD
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block text-xs text-[#AAAAAA]">
                      Tipo de acceso
                      <select
                        name="grantType"
                        value={grantType}
                        onChange={(e) => setGrantType(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]"
                      >
                        <option value="free">Gratis (gift / cortesía)</option>
                        <option value="manual">Manual (sin info de pago)</option>
                        <option value="paid">Pagado (registrar monto)</option>
                      </select>
                    </label>

                    {grantType === "paid" && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        <label className="block text-xs text-[#AAAAAA]">
                          Monto cobrado (USD)
                          <input
                            type="number"
                            name="amountPaid"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]"
                          />
                        </label>
                        <label className="block text-xs text-[#AAAAAA]">
                          Descuento aplicado (USD)
                          <input
                            type="number"
                            name="discountApplied"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#7DD4C0]"
                          />
                        </label>
                      </div>
                    )}

                    <label className="block text-xs text-[#AAAAAA]">
                      Notas (opcional)
                      <input
                        type="text"
                        name="grantNotes"
                        placeholder="Ej: pago por transferencia, ganó sorteo..."
                        className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-[#555] focus:border-[#7DD4C0]"
                      />
                    </label>

                    <button
                      type="submit"
                      className="w-full rounded-lg px-4 py-2 text-sm font-semibold text-[#0A0A0A] transition-all hover:scale-[1.01]"
                      style={{ background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)" }}
                    >
                      Asignar curso
                    </button>
                  </form>
                )}
              </div>

              {/* Contraseña temporal */}
              <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4">
                <h3 className=" text-xl tracking-tight text-white">Contraseña temporal</h3>
                <form action={setTemporaryPasswordAction} className="mt-3 space-y-3">
                  <input type="hidden" name="targetUserId" value={selectedUser.id} />
                  <input type="hidden" name="returnTab" value="usuarios" />
                  <input type="hidden" name="returnUserId" value={selectedUser.id} />
                  <label className="block text-xs text-[#AAAAAA]">
                    Nueva contraseña
                    <input
                      type="password"
                      name="temporaryPassword"
                      minLength={6}
                      required
                      placeholder="Mínimo 6 caracteres"
                      className="mt-1 w-full rounded-lg border border-[#2A2A2A] bg-[#111111]/80 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-[#555] focus:border-[#7DD4C0]"
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full rounded-lg border border-[#2A2A2A] bg-[#151515] px-4 py-2 text-sm font-semibold text-[#CCCCCC] transition-colors hover:border-[#7DD4C0]/60 hover:text-white"
                  >
                    Guardar contraseña temporal
                  </button>
                </form>
              </div>
            </div>

            {/* Columna derecha: órdenes del usuario */}
            <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4">
              <h3 className=" text-xl tracking-tight text-white">Órdenes</h3>
              {userOrders.length === 0 ? (
                <p className="mt-3 text-sm text-[#888888]">Sin órdenes registradas.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {userOrders.map((order) => {
                    const course = courseById[order.course_id]
                    return (
                      <div key={order.id} className="rounded-lg border border-[#2A2A2A] bg-[#0D0D0D] p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm text-white">{course?.name || order.course_id}</p>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                              STATUS_COLORS[order.status] ?? "bg-[#333] text-[#888]"
                            }`}
                          >
                            {STATUS_LABELS[order.status] ?? order.status}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-[#888888]">
                          <span>${Number(order.amount_usd).toFixed(2)} USD</span>
                          {order.amount_ars && <span>${Number(order.amount_ars).toFixed(0)} ARS</span>}
                          <span className="capitalize">{order.provider}</span>
                          <span>{new Date(order.created_at).toLocaleDateString("es-AR")}</span>
                        </div>
                        {order.provider_reference && (
                          <p className="mt-1 truncate font-mono text-xs text-[#555]">
                            {order.provider_reference}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Segunda fila: progreso por curso + clases agendadas. Va abajo
              porque son señales de estado (lectura), no acciones — el grid
              de arriba es operativo (revoke, asignar, contraseña, órdenes). */}
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {/* Progreso por curso del alumno */}
            <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4">
              <h3 className=" text-xl tracking-tight text-white">
                Progreso por curso
              </h3>
              <p className="mt-1 text-xs text-[#666666]">
                Módulos completados sobre el total. No incluye membresía ni Inner Circle
                (no se miden por módulos en esta vista).
              </p>
              {userCourseProgress.length === 0 ? (
                <p className="mt-3 text-sm text-[#888888]">Sin cursos con módulos asignados.</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {userCourseProgress.map((p) => (
                    <div key={p.courseId}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="truncate text-[#CCCCCC]">{p.courseName}</span>
                        <span className="text-[#888888]">
                          <span className="font-semibold text-white">{p.completed}</span>
                          <span className="text-[#666666]">/{p.total}</span>
                          <span className="ml-2 text-[10px] text-[#666666]">
                            {p.pct.toFixed(0)}%
                          </span>
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#1A1A1A]">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${p.pct}%`,
                            backgroundColor: p.slug.includes("trading") ? "#7DD4C0" : "#5BB8D4",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clases agendadas en Cal.com */}
            <div className="rounded-xl border border-[#2A2A2A] bg-[#111111]/70 p-4">
              <h3 className=" text-xl tracking-tight text-white">
                Clases agendadas
              </h3>
              <p className="mt-1 text-xs text-[#666666]">
                Reservas en Cal.com matcheadas por email. Si el alumno agendó con otro
                email, no aparece acá (limitación de Cal — no conoce nuestros user_id).
              </p>
              {userBookings.length === 0 ? (
                <p className="mt-3 text-sm text-[#888888]">Sin clases agendadas.</p>
              ) : (
                <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
                  {userBookings.slice(0, 30).map((b) => (
                    <div
                      key={b.id}
                      className="rounded-lg border border-[#2A2A2A] bg-[#0D0D0D] p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm text-white">
                          {b.event_type || "Sesión"}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                            b.status === "confirmed" || b.status === "rescheduled"
                              ? "bg-[#7DD4C0]/15 text-[#7DD4C0]"
                              : b.status === "cancelled"
                              ? "bg-[#7A2A2A]/20 text-[#F2B3B3]"
                              : "bg-[#333] text-[#888]"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      {b.start_at && (
                        <p className="mt-1 text-xs text-[#888888]">
                          {new Date(b.start_at).toLocaleString("es-AR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
