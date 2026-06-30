import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Información legal | FLOWDEX",
  description:
    "Términos y Condiciones, Política de Privacidad y Política de Reembolsos de Flowdex.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="prose prose-invert prose-headings:font-display prose-headings:tracking-wide prose-headings:text-white prose-p:text-[#CCCCCC] prose-li:text-[#CCCCCC] prose-strong:text-white prose-a:text-[#5BB8D4] hover:prose-a:text-[#7DD4C0] max-w-none">
          {children}
        </div>
      </div>
    </main>
  )
}
