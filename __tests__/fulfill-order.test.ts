import { describe, it, expect, beforeEach, vi } from "vitest"

// Mocks de los efectos externos (deben definirse antes de importar el helper).
vi.mock("@/lib/emails/send", () => ({
  sendPurchaseConfirmation: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/courses/access-expiration", () => ({
  getCourseAccessExpiryDate: vi.fn(() => new Date("2027-01-01T00:00:00.000Z")),
}))

vi.mock("@/lib/payments/guest-access-link", () => ({
  buildGuestAccessUrl: vi.fn().mockResolvedValue("https://www.flowdex.com.ar/acceso?token=x"),
}))

vi.mock("@/lib/telegram/admin-notifications", () => ({
  notifyAdminOfPurchase: vi.fn().mockResolvedValue(undefined),
}))

import { fulfillPaidOrder } from "@/lib/payments/fulfill-order"
import { sendPurchaseConfirmation } from "@/lib/emails/send"
import { notifyAdminOfPurchase } from "@/lib/telegram/admin-notifications"

type OrderState = {
  id: string
  user_id: string
  course_id: string
  amount_usd: number
  status: "pending" | "paid" | "failed" | "expired"
  courses: { slug: string } | null
}

type UpdateCall = { updateData: Record<string, unknown>; filters: Record<string, string> }

function makeUpdateChain(updateData: Record<string, unknown>, updateCalls: UpdateCall[]) {
  const filters: Record<string, string> = {}
  const chain = {
    eq(col: string, val: string) {
      filters[col] = val
      return chain
    },
    // El flip atómico pending→paid cierra con .select("id") y espera las filas
    // "flippeadas" (fulfillPaidOrder confirma que ganó la carrera si length>0).
    // Devolvemos una fila para simular el flip ganado.
    select(): Promise<{ data: Array<{ id: string }>; error: null }> {
      updateCalls.push({ updateData, filters })
      return Promise.resolve({ data: [{ id: "flipped" }], error: null })
    },
    then<T1, T2>(
      onfulfilled?: ((value: { data: null; error: null }) => T1 | PromiseLike<T1>) | null,
      onrejected?: ((reason: unknown) => T2 | PromiseLike<T2>) | null
    ): Promise<T1 | T2> {
      updateCalls.push({ updateData, filters })
      return Promise.resolve({ data: null, error: null }).then(onfulfilled, onrejected)
    },
  }
  return chain
}

function createMock(opts: {
  order?: OrderState | null
  profile?: { email: string; full_name: string } | null
  course?: { name: string } | null
}) {
  const updateCalls: UpdateCall[] = []
  const upsertCalls: Array<{ data: Record<string, unknown>; opts: Record<string, unknown> }> = []
  const order = opts.order
  const profile = opts.profile ?? { email: "alumno@example.com", full_name: "Alumno Test" }
  const course = opts.course ?? { name: "Inner Circle" }

  const client = {
    from: vi.fn((table: string) => {
      if (table === "orders") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: order ?? null, error: null }),
          update: vi.fn((data: Record<string, unknown>) => makeUpdateChain(data, updateCalls)),
        }
      }
      if (table === "user_courses") {
        return {
          upsert: vi.fn((data: Record<string, unknown>, o: Record<string, unknown>) => {
            upsertCalls.push({ data, opts: o })
            return Promise.resolve({ data: null, error: null })
          }),
        }
      }
      if (table === "profiles") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: profile, error: null }),
        }
      }
      if (table === "courses") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: course, error: null }),
        }
      }
      return { select: vi.fn(), eq: vi.fn(), maybeSingle: vi.fn() }
    }),
  }

  return { client, updateCalls, upsertCalls }
}

const DEFAULT_ORDER: OrderState = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  user_id: "user-uuid-001",
  course_id: "course-uuid-001",
  amount_usd: 399,
  status: "pending",
  courses: { slug: "inner-circle" },
}

// fulfillPaidOrder recibe el serviceClient ya construido, así que basta con
// pasarle el mock tipado como never (no usamos el tipo real de Supabase acá).
function run(mockClient: unknown, paidAmount: number, orderId = DEFAULT_ORDER.id) {
  return fulfillPaidOrder({
    serviceClient: mockClient as never,
    orderId,
    paidAmount,
    provider: "paypal",
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("fulfillPaidOrder · validación de monto", () => {
  it("1. acredita con monto exacto", async () => {
    const m = createMock({ order: { ...DEFAULT_ORDER } })
    const res = await run(m.client, 399)
    expect(res).toBe("fulfilled")
    expect(m.updateCalls.some((c) => c.updateData.status === "paid")).toBe(true)
    expect(m.upsertCalls).toHaveLength(1)
    expect(sendPurchaseConfirmation).toHaveBeenCalledOnce()
    expect(notifyAdminOfPurchase).toHaveBeenCalledOnce()
  })

  it("2. acredita pagando USD 1 menos (límite tolerancia)", async () => {
    const m = createMock({ order: { ...DEFAULT_ORDER } })
    const res = await run(m.client, 398)
    expect(res).toBe("fulfilled")
    expect(m.upsertCalls).toHaveLength(1)
  })

  it("3. marca failed pagando USD 1.01 menos (fuera tolerancia)", async () => {
    const m = createMock({ order: { ...DEFAULT_ORDER } })
    const res = await run(m.client, 397.99)
    expect(res).toBe("underpaid")
    expect(m.updateCalls.some((c) => c.updateData.status === "failed")).toBe(true)
    expect(m.upsertCalls).toHaveLength(0)
    expect(sendPurchaseConfirmation).not.toHaveBeenCalled()
  })

  it("4. acredita sin warning pagando 10% más", async () => {
    const m = createMock({ order: { ...DEFAULT_ORDER } })
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    const res = await run(m.client, 439)
    expect(res).toBe("fulfilled")
    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Overpayment significativo"),
      expect.anything()
    )
    warnSpy.mockRestore()
  })

  it("5. acredita CON warning pagando 15.3% más", async () => {
    const m = createMock({ order: { ...DEFAULT_ORDER } })
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    const res = await run(m.client, 460)
    expect(res).toBe("fulfilled")
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Overpayment significativo"),
      expect.objectContaining({ orderId: DEFAULT_ORDER.id, expected: 399, paid: 460 })
    )
    warnSpy.mockRestore()
  })
})

describe("fulfillPaidOrder · idempotencia y casos edge", () => {
  it("6. no duplica si la orden ya está paid", async () => {
    const m = createMock({ order: { ...DEFAULT_ORDER, status: "paid" } })
    const res = await run(m.client, 399)
    expect(res).toBe("already_paid")
    expect(m.upsertCalls).toHaveLength(0)
    expect(sendPurchaseConfirmation).not.toHaveBeenCalled()
  })

  it("7. devuelve not_found si la orden no existe", async () => {
    const m = createMock({ order: null })
    const res = await run(m.client, 399)
    expect(res).toBe("not_found")
    expect(m.upsertCalls).toHaveLength(0)
  })

  it("8. devuelve no_course si la orden no tiene curso asociado", async () => {
    const m = createMock({ order: { ...DEFAULT_ORDER, courses: null } })
    const res = await run(m.client, 399)
    expect(res).toBe("no_course")
    expect(m.upsertCalls).toHaveLength(0)
    expect(sendPurchaseConfirmation).not.toHaveBeenCalled()
  })

  it("9. monto no numérico (NaN) marca failed", async () => {
    const m = createMock({ order: { ...DEFAULT_ORDER } })
    const res = await run(m.client, Number.NaN)
    expect(res).toBe("underpaid")
    expect(m.upsertCalls).toHaveLength(0)
  })
})
