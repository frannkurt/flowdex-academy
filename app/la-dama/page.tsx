import { LaDamaPageClient } from "@/components/la-dama/LaDamaPageClient"

export const metadata = {
  title: "La dama · Flowdex",
  description: "",
  robots: { index: false, follow: false },
}

export default function LaDamaPage() {
  return <LaDamaPageClient />
}
