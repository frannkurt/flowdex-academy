type AuditItem = {
  userId: string
  userName: string
  userEmail: string
  courseName: string
  courseSlug: string
  expiresAt: string
  daysRemaining: number
}

type AuditPanelProps = {
  membershipExpiring: AuditItem[]
  materialExpiring: AuditItem[]
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-AR")
}

function ExpiryTable({
  title,
  subtitle,
  rows,
  accent,
}: {
  title: string
  subtitle: string
  rows: AuditItem[]
  accent: "teal" | "gold"
}) {
  const accentText = accent === "teal" ? "text-[#7DD4C0]" : "text-[#D4B86A]"

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#111111]/70 p-5 sm:p-6">
      <h3 className=" text-2xl tracking-tight text-white">{title}</h3>
      <p className="mt-1 text-sm text-[#888888]">{subtitle}</p>

      {rows.length === 0 ? (
        <div className="mt-5 rounded-xl border border-[#2A2A2A] bg-[#0E0E0E] p-4 text-sm text-[#888888]">
          Sin vencimientos en esta ventana.
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Usuario</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Curso</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Vence</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-[#7DD4C0]">Días</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.userId}-${row.courseSlug}-${row.expiresAt}`} className="rounded-xl border border-[#2A2A2A] bg-[#0E0E0E]">
                  <td className="px-3 py-3 text-sm text-[#CCCCCC]">
                    {row.userName}
                    <span className="ml-2 text-xs text-[#888888]">{row.userEmail}</span>
                  </td>
                  <td className="px-3 py-3 text-sm text-[#AAAAAA]">
                    {row.courseName}
                    <span className="ml-2 text-xs text-[#666666]">{row.courseSlug}</span>
                  </td>
                  <td className="px-3 py-3 text-sm text-[#BBBBBB]">{formatDate(row.expiresAt)}</td>
                  <td className={`px-3 py-3 text-sm font-semibold ${accentText}`}>
                    {row.daysRemaining}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function AuditPanel({ membershipExpiring, materialExpiring }: AuditPanelProps) {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h2 className=" text-3xl tracking-tight text-white">Auditoría de vencimientos</h2>
        <p className="mt-2 text-sm text-[#888888]">
          Control operativo de accesos próximos a vencer para membresía y material de cursada.
        </p>
      </div>

      <ExpiryTable
        title="Membresía por vencer"
        subtitle="Usuarios con membresía activa que vence dentro de los próximos 7 días."
        rows={membershipExpiring}
        accent="teal"
      />

      <ExpiryTable
        title="Material por vencer"
        subtitle="Usuarios con acceso a contenido que vence dentro de los próximos 30 días."
        rows={materialExpiring}
        accent="gold"
      />
    </div>
  )
}
