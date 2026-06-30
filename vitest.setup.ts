// Setup global para tests con Vitest.
// Setea variables de entorno mockeadas que los handlers necesitan al arrancar.
// Sin esto, los API routes devuelven 500 antes de llegar a la lógica real.

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key"
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key"
process.env.MP_ACCESS_TOKEN = "TEST-mp-access-token"
process.env.NEXT_PUBLIC_APP_URL = "https://www.flowdex.com.ar"
process.env.RESEND_API_KEY = "re_test_key"
process.env.MP_WEBHOOK_SECRET = "test-webhook-secret"
process.env.NOWPAYMENTS_IPN_SECRET = "test-nowpayments-ipn-secret"
