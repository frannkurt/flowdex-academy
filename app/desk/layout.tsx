// Layout propio del Desk: scopea fondo/color oscuro al contenedor sin tocar
// globals.css ni el layout raíz del sitio (regla de oro §0 — todo aditivo).
export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return <div className="mesh-gradient min-h-screen text-foreground">{children}</div>
}
