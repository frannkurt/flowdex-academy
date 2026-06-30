export type FlowdexCourse = {
  slug: string
  name: string
  price: number
  currency: "ARS" | "USD"
}

export const FLOWDEX_COURSES: FlowdexCourse[] = [
  { slug: "kickstart-investment", name: "Kickstart Investment", price: 99, currency: "USD" },
  { slug: "expert-investment", name: "Expert Investment", price: 299, currency: "USD" },
  { slug: "kickstart-trading", name: "Kickstart Trading", price: 99, currency: "USD" },
  { slug: "trading-lab", name: "Trading Lab", price: 299, currency: "USD" },
  { slug: "inner-circle", name: "Inner Circle", price: 399, currency: "USD" },
  { slug: "membresia", name: "Membresía", price: 50, currency: "USD" },
]

export function getCourseBySlug(slug: string) {
  return FLOWDEX_COURSES.find((course) => course.slug === slug)
}
