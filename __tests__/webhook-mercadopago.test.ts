import { describe, it, expect, beforeEach, vi } from "vitest"

// Los mocks deben definirse ANTES de importar el route handler. Si se hace
// al revés, la importación del handler trae las versiones reales de los
// módulos y los vi.mock no surten efecto.
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}))

vi.mock("@/lib/payments/mercadopago-webhook-validation", () => ({
  validateMercadoPagoSignature: vi.fn(() => true),
}))

vi.mock("@/lib/emails/send", () => ({
  sendPurchaseConfirmation: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/courses/access-expiration", () => ({
  getCourseAccessExpiryDate: vi.fn(() => new Date("2027-01-01T00:00:00.000Z")),
}))

// Imports después de declarar los mocks.
import { POST } from "@/app/api/payments/mercadopago/webhook/route"
import { createClient } from "@supabase/supabase-js"
import { validateMercadoPagoSignature } from "@/lib/payments/mercadopago-webhook-validation"
import { sendPurchaseConfirmation } from "@/lib/emails/send"

type OrderState = {
  id: string
  user_id: string
  course_id: string
  status: "pending" | "paid" | "failed"
  amount_usd: number
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

// Helper: crea un "thenable" que registra el update cuando se await.
// Funciona con 1 o más `.eq()` encadenados, porque el chain solo se ejecuta
// al hacer `await` (que llama a .then).
function makeUpdateChain(
  updateData: Record<string, unknown>,
  updateCalls: UpdateCall[]
) {
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

function setupFetchMock(opts: {
  ok?: boolean
  status?: string
  external_reference?: string
  transaction_amount?: number
} = {}) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: opts.ok ?? true,
    json: async () => ({
      status: opts.status ?? "approved",
      external_reference: opts.external_reference ?? DEFAULT_ORDER.id,
      transaction_amount: opts.transaction_amount ?? 399,
    }),
  }) as unknown as typeof global.fetch
}

function makeRequest(body: unknown) {
  return new Request("https://www.flowdex.com.ar/api/payments/mercadopago/webhook", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  })
}

const DEFAULT_ORDER: OrderState = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  user_id: "user-uuid-001",
  course_id: "course-uuid-001",
  status: "pending",
  amount_usd: 399,
  courses: { slug: "inner-circle" },
}

const DEFAULT_PROFILE = {
  email: "alumno@example.com",
  full_name: "Alumno Test",
}

const PAYMENT_NOTIFICATION = {
  type: "payment",
  action: "payment.updated",
  data: { id: "1234567890" },
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(validateMercadoPagoSignature).mockReturnValue(true)
})

describe("MercadoPago Webhook · validación de monto · underpayment", () => {
  it("1. acredita curso cuando el pago es exacto", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)
    setupFetchMock({ transaction_amount: 399 })

    const res = await POST(makeRequest(PAYMENT_NOTIFICATION))

    expect(res.status).toBe(200)
    expect(supa.updateCalls.some((c) => c.updateData.status === "paid")).toBe(true)
    expect(supa.upsertCalls).toHaveLength(1)
    expect(supa.upsertCalls[0].data.is_active).toBe(true)
    expect(sendPurchaseConfirmation).toHaveBeenCalledOnce()
  })

  it("2. acredita cuando paga 50 centavos de más", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)
    setupFetchMock({ transaction_amount: 399.5 })

    const res = await POST(makeRequest(PAYMENT_NOTIFICATION))

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(1)
    expect(sendPurchaseConfirmation).toHaveBeenCalledOnce()
  })

  it("3. acredita cuando paga 1 centavo de menos (dentro tolerancia)", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)
    setupFetchMock({ transaction_amount: 398.99 })

    const res = await POST(makeRequest(PAYMENT_NOTIFICATION))

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(1)
  })

  it("4. acredita cuando paga exactamente USD 1 menos (límite tolerancia)", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)
    setupFetchMock({ transaction_amount: 398 })

    const res = await POST(makeRequest(PAYMENT_NOTIFICATION))

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(1)
  })

  it("5. marca failed cuando paga USD 1.01 menos (fuera de tolerancia)", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)
    setupFetchMock({ transaction_amount: 397.99 })

    const res = await POST(makeRequest(PAYMENT_NOTIFICATION))

    expect(res.status).toBe(200)
    expect(supa.updateCalls.some((c) => c.updateData.status === "failed")).toBe(true)
    expect(supa.upsertCalls).toHaveLength(0)
    expect(sendPurchaseConfirmation).not.toHaveBeenCalled()
  })

  it("6. marca failed cuando paga mucho menos (intento de fraude)", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)
    setupFetchMock({ transaction_amount: 1 })

    const res = await POST(makeRequest(PAYMENT_NOTIFICATION))

    expect(res.status).toBe(200)
    expect(supa.updateCalls.some((c) => c.updateData.status === "failed")).toBe(true)
    expect(supa.upsertCalls).toHaveLength(0)
    expect(sendPurchaseConfirmation).not.toHaveBeenCalled()
  })
})

describe("MercadoPago Webhook · overpayment · warning estructurado", () => {
  it("7. acredita sin warning cuando paga 10% más", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)
    setupFetchMock({ transaction_amount: 439 }) // 10% más

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    const res = await POST(makeRequest(PAYMENT_NOTIFICATION))

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(1)
    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Overpayment significativo"),
      expect.anything()
    )

    warnSpy.mockRestore()
  })

  it("8. acredita CON warning cuando paga 15.3% más", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)
    setupFetchMock({ transaction_amount: 460 }) // ~15.3% más

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    const res = await POST(makeRequest(PAYMENT_NOTIFICATION))

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

  it("9. acredita CON warning cuando paga 25% más", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)
    setupFetchMock({ transaction_amount: 500 })

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    const res = await POST(makeRequest(PAYMENT_NOTIFICATION))

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(1)
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Overpayment significativo"),
      expect.objectContaining({ paid: 500 })
    )

    warnSpy.mockRestore()
  })
})

describe("MercadoPago Webhook · seguridad y casos edge", () => {
  it("10. responde 401 cuando la firma es inválida", async () => {
    vi.mocked(validateMercadoPagoSignature).mockReturnValue(false)
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const res = await POST(makeRequest(PAYMENT_NOTIFICATION))

    expect(res.status).toBe(401)
    expect(supa.upsertCalls).toHaveLength(0)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it("11. responde 200 graceful cuando el payload es JSON corrupto", async () => {
    const supa = createSupabaseMock({ order: null, profile: null })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const corruptRequest = new Request(
      "https://www.flowdex.com.ar/api/payments/mercadopago/webhook",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{this is not json",
      }
    )

    const res = await POST(corruptRequest)

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(0)
  })

  it("12. no duplica acreditación cuando la orden ya está paid", async () => {
    const paidOrder: OrderState = { ...DEFAULT_ORDER, status: "paid" }
    const supa = createSupabaseMock({ order: paidOrder, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)
    setupFetchMock({ transaction_amount: 399 })

    const res = await POST(makeRequest(PAYMENT_NOTIFICATION))

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(0)
    expect(sendPurchaseConfirmation).not.toHaveBeenCalled()
  })

  it("13. no acredita cuando external_reference es no-UUID (intento legacy)", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)
    setupFetchMock({
      external_reference: '{"user_id":"x","course_slug":"inner-circle"}',
      transaction_amount: 5,
    })

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    const res = await POST(makeRequest(PAYMENT_NOTIFICATION))

    expect(res.status).toBe(200)
    expect(supa.upsertCalls).toHaveLength(0)
    expect(sendPurchaseConfirmation).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("no-UUID"),
      expect.any(String)
    )

    warnSpy.mockRestore()
  })

  it("14. marca failed cuando el payment status es rejected", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)
    setupFetchMock({ status: "rejected", transaction_amount: 399 })

    const res = await POST(makeRequest(PAYMENT_NOTIFICATION))

    expect(res.status).toBe(200)
    expect(supa.updateCalls.some((c) => c.updateData.status === "failed")).toBe(true)
    expect(supa.upsertCalls).toHaveLength(0)
    expect(sendPurchaseConfirmation).not.toHaveBeenCalled()
  })

  it("15. responde 200 sin procesar cuando type !== payment", async () => {
    const supa = createSupabaseMock({ order: DEFAULT_ORDER, profile: DEFAULT_PROFILE })
    vi.mocked(createClient).mockReturnValue(supa.client as never)

    const res = await POST(
      makeRequest({
        type: "merchant_order",
        action: "merchant_order.updated",
        data: { id: "1234567890" },
      })
    )

    expect(res.status).toBe(200)
    expect(global.fetch).not.toHaveBeenCalled()
    expect(supa.upsertCalls).toHaveLength(0)
  })
})
