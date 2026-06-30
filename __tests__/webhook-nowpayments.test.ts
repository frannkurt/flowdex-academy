import { describe, it, expect, beforeEach, vi } from "vitest"
import { createHmac } from "node:crypto"

// Mocks (deben definirse antes del import del route handler).
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}))

vi.mock("@/lib/emails/send", () => ({
  sendPurchaseConfirmation: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/courses/access-expiration", () => ({
  getCourseAccessExpiryDate: vi.fn(() => new Date("2027-01-01T00:00:00.000Z")),
}))

import { POST } from "@/app/api/payments/nowpayments/webhook/route"
import { createClient } from "@supabase/supabase-js"
import { sendPurchaseConfirmation } from "@/lib/emails/send"

const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET ?? "test-nowpayments-ipn-secret"

type OrderState = {
  id: string
  user_id: string
  course_id: string
  amount_usd: number
  status: "pending" | "paid" | "failed" | "expired"
  courses: { slug: string }
}

type UpdateCall = {
  updateData: Record<string, unknown>
  filters: Record<string, string>
}

type SupabaseMock = {
  client: ReturnType<typeof buildClient>
  updateCalls: UpdateCall[]
  upsertCalls: Array<{ data: Record<string, unknown>; opts: Record<string, unknown> }>
}

function makeUpdateChain(updateData: Record<string, unknown>, updateCalls: UpdateCall[]) {
  const filters: Record<string, string> = {}
  const chain = {
    eq(col: string, val: string) {
      filters[col] = val
      return chain
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

function buildClient(args: {
  order?: OrderState | null
  profile?: { email: string; full_name: string } | null
  updateCalls: SupabaseMock["updateCalls"]
  upsertCalls: SupabaseMock["upsertCalls"]
}) {
  const { order, profile, updateCalls, upsertCalls } = args
  return {
    from: vi.fn((table: string) => {
      if (table === "orders") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: order ?? null, error: null }),
          update: vi.fn((updateData: Record<string, unknown>) =>
            makeUpdateChain(updateData, updateCalls)
          ),
        }
      }
      if (table === "user_courses") {
        return {
          upsert: vi.fn((data: Record<string, unknown>, opts: Record<string, unknown>) => {
            upsertCalls.push({ data, opts })
            return Promise.resolve({ data: null, error: null })
          }),
        }
      }
      if (table === "profiles") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: profile ?? null, error: null }),
        }
      }
      return { select: vi.fn(), eq: vi.fn(), maybeSingle: vi.fn() }
    }),
  }
}

function createSupabaseMock(opts: {
  order?: OrderState | null
  profile?: { email: string; full_name: string } | null
} = {}): SupabaseMock {
  const updateCalls: UpdateCall[] = []
  const upsertCalls: SupabaseMock["upsertCalls"] = []
  const client = buildClient({
    order: opts.order,
    profile: opts.profile,
    updateCalls,
    upsertCalls,
  })
  return { client, updateCalls, upsertCalls }
}

// NowPayments calcula HMAC-SHA512 sobre el body con keys ordenadas
// alfabéticamente. Replico el mismo algoritmo del webhook real para generar
// firmas válidas en los tests.
function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObjectKeys)
  if (obj !== null && typeof obj === "object") {
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(obj as Record<string, unknown>).sort()) {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key])
    }
    return sorted
  }
  return obj
}

function signPayload(payload: Record<string, unknown>): string {
  const sorted = sortObjectKeys(payload)
  return createHmac("sha512", IPN_SECRET).update(JSON.stringify(sorted)).digest("hex")
}

function makeRequest(
  payload: Record<string, unknown>,
  opts: { signatureOverride?: string; skipSignature?: boolean } = {}
) {
  const body = JSON.stringify(payload)
  const headers: Record<string, string> = { "content-type": "application/json" }
  if (!opts.skipSignature) {
    headers["x-nowpayments-sig"] = opts.signatureOverride ?? signPayload(payload)
  }
  return new Request("https://www.flowdex.com.ar/api/payments/nowpayments/webhook", {
    method: "POST",
    headers,
    body,
  })
}

const DEFAULT_ORDER: OrderState = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  user_id: "user-uuid-001",
  course_id: "course-uuid-001",
  amount_usd: 399,
  status: "pending",
  courses: { slug: "inner-circle" },
}

const DEFAULT_PROFILE = {
  email: "alumno@example.com",
  full_name: "Alumno Test",
}

function basePayload(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    payment_status: "finished",
    order_id: DEFAULT_ORDER.id,
    payment_id: 1234567890,
    price_amount: 399,
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("NowPayments Webhook · validación de monto · underpayment", () => {
  it("1. acredita curso cuando el pago es exacto y status=finished", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const res = await POST(makeRequest(basePayload({ price_amount: 399 })))

    expect(res.status).toBe(200)
    expect(supa.updateCalls.some((c) => c.updateData.status === "paid")).toBe(true)
    expect(supa.upsertCalls).toHaveLength(1)
    expect(sendPurchaseConfirmation).toHaveBeenCalledOnce()
  })

  it("2. acredita cuando status=confirmed (mismo path que finished)", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const res = await POST(
      makeRequest(basePayload({ payment_status: "confirmed", price_amount: 399 }))
    )

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(1)
    expect(sendPurchaseConfirmation).toHaveBeenCalledOnce()
  })

  it("3. acredita cuando paga USD 1 menos (límite tolerancia)", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const res = await POST(makeRequest(basePayload({ price_amount: 398 })))

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(1)
  })

  it("4. marca failed cuando paga USD 1.01 menos (fuera tolerancia)", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const res = await POST(makeRequest(basePayload({ price_amount: 397.99 })))

    expect(res.status).toBe(200)
    expect(supa.updateCalls.some((c) => c.updateData.status === "failed")).toBe(true)
    expect(supa.upsertCalls).toHaveLength(0)
    expect(sendPurchaseConfirmation).not.toHaveBeenCalled()
  })
})

describe("NowPayments Webhook · overpayment · warning estructurado", () => {
  it("5. acredita sin warning cuando paga 10% más", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    const res = await POST(makeRequest(basePayload({ price_amount: 439 })))

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(1)
    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Overpayment significativo"),
      expect.anything()
    )

    warnSpy.mockRestore()
  })

  it("6. acredita CON warning cuando paga 15.3% más", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    const res = await POST(makeRequest(basePayload({ price_amount: 460 })))

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(1)
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Overpayment significativo"),
      expect.objectContaining({
        orderId: DEFAULT_ORDER.id,
        userId: DEFAULT_ORDER.user_id,
        expected: 399,
        paid: 460,
      })
    )

    warnSpy.mockRestore()
  })
})

describe("NowPayments Webhook · estados intermedios y terminales", () => {
  it("7. ignora status waiting (pago en progreso)", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const res = await POST(makeRequest(basePayload({ payment_status: "waiting" })))

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(0)
    expect(supa.updateCalls).toHaveLength(0)
  })

  it("8. ignora status partially_paid", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const res = await POST(makeRequest(basePayload({ payment_status: "partially_paid" })))

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(0)
  })

  it("9. marca orden como failed cuando status=failed", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const res = await POST(makeRequest(basePayload({ payment_status: "failed" })))

    expect(res.status).toBe(200)
    expect(supa.updateCalls.some((c) => c.updateData.status === "failed")).toBe(true)
    expect(supa.upsertCalls).toHaveLength(0)
    expect(sendPurchaseConfirmation).not.toHaveBeenCalled()
  })

  it("10. marca orden como expired cuando status=expired", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const res = await POST(makeRequest(basePayload({ payment_status: "expired" })))

    expect(res.status).toBe(200)
    expect(supa.updateCalls.some((c) => c.updateData.status === "expired")).toBe(true)
    expect(supa.upsertCalls).toHaveLength(0)
  })
})

describe("NowPayments Webhook · seguridad y casos edge", () => {
  it("11. responde 401 cuando la firma HMAC es inválida", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const res = await POST(
      makeRequest(basePayload(), { signatureOverride: "firma-falsa-no-coincide" })
    )

    expect(res.status).toBe(401)
    expect(supa.upsertCalls).toHaveLength(0)
  })

  it("12. responde 401 cuando falta el header x-nowpayments-sig", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const res = await POST(makeRequest(basePayload(), { skipSignature: true }))

    expect(res.status).toBe(401)
    expect(supa.upsertCalls).toHaveLength(0)
  })

  it("13. responde 400 cuando el JSON es corrupto", async () => {
    const supa = createSupabaseMock({ order: null, profile: null })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const corruptRequest = new Request(
      "https://www.flowdex.com.ar/api/payments/nowpayments/webhook",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-nowpayments-sig": "anything-because-cant-validate-json-broken",
        },
        body: "{not valid json",
      }
    )

    const res = await POST(corruptRequest)

    expect(res.status).toBe(400)
    expect(supa.upsertCalls).toHaveLength(0)
  })

  it("14. no duplica acreditación cuando la orden ya está paid", async () => {
    const paidOrder: OrderState = { ...DEFAULT_ORDER, status: "paid" }
    const supa = createSupabaseMock({ order: paidOrder, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const res = await POST(makeRequest(basePayload({ price_amount: 399 })))

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(0)
    expect(sendPurchaseConfirmation).not.toHaveBeenCalled()
  })

  it("15. responde 200 graceful cuando el order_id no existe en DB", async () => {
    const supa = createSupabaseMock({ order: null, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const res = await POST(makeRequest(basePayload()))

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(0)
    expect(sendPurchaseConfirmation).not.toHaveBeenCalled()
  })
})
