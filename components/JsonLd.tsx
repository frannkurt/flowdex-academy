// Server component para inyectar JSON-LD structured data en el <head>.
// Google rastrea estos bloques y arma resultados ricos en la SERP
// (carrusel de cursos, sitelinks de organización, breadcrumbs, FAQ, etc).
//
// Uso: <JsonLd data={{ "@context": "https://schema.org", ... }} />

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML es la forma recomendada por Next/React para
      // inyectar JSON-LD sin que React escape los caracteres especiales.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
