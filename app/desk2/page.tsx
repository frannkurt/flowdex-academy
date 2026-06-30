// Preview de la variante "Academy" de la landing del Desk (la versión con el
// sistema visual del sitio, guardada como referencia). El default de /desk es
// el híbrido terminal (DeskLandingTerminal). noindex: no es contenido público.
import { DeskLanding } from "@/components/desk/DeskLanding"

export const metadata = {
  title: "Flowdex Desk — preview Academy",
  robots: { index: false, follow: false },
}

export default function Desk2Page() {
  return <DeskLanding />
}
