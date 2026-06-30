type CoursePricingInput = {
  slug: string
  basePrice: number
}

export type CoursePricingResult = {
  finalPrice: number
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}

// Nota (junio 2026): acá vivía el "compareAtPrice" ($700 tachado del IC).
// Se eliminó junto con todos los precios ancla del sitio: las ofertas
// tachadas permanentes son el gesto típico del rubro que combatimos
// (ver /no-hacemos). El único descuento real es el de escalera
// (courses.discount_price vía resolveUpgradeDiscount), que se mantiene.
export function resolveCoursePricing({ basePrice }: CoursePricingInput): CoursePricingResult {
  return {
    finalPrice: roundMoney(basePrice),
  }
}
