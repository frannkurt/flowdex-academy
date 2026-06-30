import type { Metadata } from "next"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getCourseBySlug } from "@/lib/courses/catalog"
import { JsonLd } from "@/components/JsonLd"
import {
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
} from "@/lib/seo/structured-data"
import InnerCircleClient from "./InnerCircleClient"

const FALLBACK_PRICE = getCourseBySlug("inner-circle")?.price ?? 399

export const metadata: Metadata = {
  title: "Inner Circle: Mentoría Premium en Trading e Inversión",
  description:
    "Inner Circle es el programa premium de Flowdex: tres cursos avanzados de trading e inversión, sesiones grupales en vivo con Franco y Augusto, comunidad privada e indicadores propios en TradingView.",
  alternates: { canonical: "/inner-circle" },
  openGraph: {
    title: "Inner Circle | Mentoría Premium de Trading e Inversión",
    description:
      "Acompañamiento profesional en vivo, tres cursos avanzados, comunidad privada e indicadores propios. El programa premium de Flowdex.",
    type: "website",
    url: "https://flowdex.com.ar/inner-circle",
    images: [
      {
        url: "/og/og-inner-circle.jpg",
        width: 1200,
        height: 630,
        alt: "Flowdex Inner Circle — Mentoría Premium",
      },
    ],
  },
  twitter: {
    images: ["/og/og-inner-circle.jpg"],
  },
}

export default async function InnerCirclePage() {
  let price = FALLBACK_PRICE

  try {
    const supabase = await createSupabaseServerClient()
    if (supabase) {
      const { data } = await supabase
        .from("courses")
        .select("price")
        .eq("slug", "inner-circle")
        .maybeSingle()

      if (data?.price != null) {
        const parsed = Number(data.price)
        if (Number.isFinite(parsed) && parsed >= 0) {
          price = parsed
        }
      }
    }
  } catch {}

  const courseSchema = buildCourseJsonLd("inner-circle")
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Inicio", url: "/" },
    { name: "Inner Circle", url: "/inner-circle" },
  ])

  return (
    <>
      {/* Course schema con precio dinámico + breadcrumb para la SERP. */}
      {courseSchema && <JsonLd data={courseSchema} />}
      <JsonLd data={breadcrumb} />
      <InnerCircleClient price={price} />
    </>
  )
}
