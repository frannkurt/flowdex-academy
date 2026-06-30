import type { MetadataRoute } from "next"

const BASE_URL = "https://flowdex.com.ar"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Rutas privadas (auth requerido) y endpoints de API no deben indexarse.
        // Si Search Console descubre estas URLs igual rebotan en login.
        disallow: [
          "/api/",
          "/dashboard",
          "/courses/",
          "/checkout/",
          "/journal",
          "/admin",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/laboratorio",
          "/herramientas",
        ],
        allow: "/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
