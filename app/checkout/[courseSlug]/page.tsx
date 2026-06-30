import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getInnerCircleEligibility } from "@/lib/inner-circle-eligibility"
import { getCheckoutSyllabus } from "@/lib/courses/checkout-syllabus"
import { CheckoutClient } from "./CheckoutClient"
import { resolveCoursePricing } from "@/lib/pricing/course-pricing"
import { resolveUpgradeDiscount } from "@/lib/pricing/upgrade-discount"
import { isInternalProgressOnlyCourseSlug } from "@/lib/courses/progress-course-config"

type CheckoutPageProps = {
  params: Promise<{ courseSlug: string }>
}

type CourseRow = {
  id: string
  name: string
  description: string
  price: number
  slug: string
  discount_price: number | string | null
}

type PathBlockInfo = {
  key: "investment" | "trading"
  completed: boolean
  suggestedCourseSlug: string | null
  suggestedCourseUnlocked: boolean
}

type CheckoutBlockInfo = {
  blocked: boolean
  message: string
  paths: PathBlockInfo[]
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { courseSlug } = await params

  if (isInternalProgressOnlyCourseSlug(courseSlug)) {
    redirect("/dashboard")
  }

  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/login")

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Checkout exprés: sin sesión también se puede comprar (cuenta invisible:
  // el checkout pide email + nombre y el acceso llega por email post-pago).
  // Excepción: Inner Circle exige cuenta con caminos completados.
  const isGuest = !user
  if (isGuest && courseSlug === "inner-circle") {
    redirect(`/login?returnTo=/checkout/${courseSlug}`)
  }

  const { data: course, error } = await supabase
    .from("courses")
    .select("id, name, description, price, slug, discount_price")
    .eq("slug", courseSlug)
    .maybeSingle()

  if (error || !course) {
    redirect("/")
  }

  // Teléfono ya cargado del alumno (si compró antes), para prellenar el campo.
  let initialPhone = ""
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("phone")
      .eq("id", user.id)
      .maybeSingle()
    initialPhone = (profile as { phone: string | null } | null)?.phone ?? ""
  }

  const typedCourse = course as CourseRow
  const pricing = resolveCoursePricing({
    slug: typedCourse.slug,
    basePrice: Number(typedCourse.price),
  })

  let blockInfo: CheckoutBlockInfo | null = null

  if (typedCourse.slug === "inner-circle" && user) {
    const eligibility = await getInnerCircleEligibility(supabase, user.id)

    if (!eligibility.isEligible) {
      blockInfo = {
        blocked: true,
        message:
          "Para acceder a Inner Circle, necesitas completar al 100% uno de estos caminos: Inversiones o Trading.",
        paths: eligibility.paths.map((path) => ({
          key: path.key,
          completed: path.completed,
          suggestedCourseSlug: path.suggestedCourseSlug,
          suggestedCourseUnlocked:
            path.courses.find((course) => course.slug === path.suggestedCourseSlug)
              ?.unlocked ?? false,
        })),
      }
    }
  }

  // Auto-upgrade: si el usuario ya tiene el Kickstart correspondiente activo
  // y el curso tiene `discount_price` seteado, ese precio se usa como final.
  // El admin controla el upgrade desde el panel via courses.discount_price.
  const discountPriceFromDb =
    typedCourse.discount_price === null || typedCourse.discount_price === undefined
      ? null
      : Number(typedCourse.discount_price)
  // Invitado: sin historial visible no podemos mostrar el upgrade acá, pero
  // /api/orders/create lo resuelve igual server-side si el email corresponde
  // a una cuenta con el Kickstart activo (cobra el precio con descuento).
  const upgradeDiscount = user
    ? await resolveUpgradeDiscount(
        supabase,
        user.id,
        typedCourse.slug,
        pricing.finalPrice,
        discountPriceFromDb
      )
    : {
        applied: false,
        finalPrice: pricing.finalPrice,
        basePrice: pricing.finalPrice,
        requiredKickstartSlug: null,
      }

  const displayPrice = upgradeDiscount.finalPrice
  // Monto absoluto del descuento aplicado (para mostrar en el copy del cliente).
  const upgradeDiscountAmount = upgradeDiscount.applied
    ? Math.max(upgradeDiscount.basePrice - upgradeDiscount.finalPrice, 0)
    : 0
  const syllabusSections = getCheckoutSyllabus(typedCourse.slug)

  return (
    <CheckoutClient
      course={{
        id: typedCourse.id,
        name: typedCourse.name,
        description: typedCourse.description,
        price: displayPrice,
        slug: typedCourse.slug,
      }}
      syllabusSections={syllabusSections}
      blockInfo={blockInfo}
      upgradeApplied={upgradeDiscount.applied}
      upgradeDiscountAmount={upgradeDiscountAmount}
      initialPhone={initialPhone}
      isGuest={isGuest}
    />
  )
}
