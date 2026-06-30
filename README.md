# Flowdex Academy

Flowdex Academy is a production markets-education platform: a typed course system, exams, multi-gateway checkout, and membership areas, built on Next.js (React, TypeScript) with Supabase and deployed on Vercel.

> This is a production product. The repository here is a curated public showcase — secrets, internal tooling, and paid course content are excluded.

**Stack:** Next.js (App Router) · React · TypeScript · Tailwind CSS · Supabase (Auth, Postgres, RLS) · Vercel

## Architecture

```mermaid
flowchart TD
    Browser["Browser — Next.js / React"] --> App["App Router<br/>43 API routes · server actions"]

    App --> Courses["Courses & exams"]
    App --> Pay["Payments"]
    App --> Tutor["AI tutor"]
    App --> Data["Data & auth"]
    App --> Comms["Community & email"]
    App --> Ops["Platform ops"]

    Courses --> C1["Typed course content<br/>modules · sections · blocks"]
    Courses --> C2["Zero-trust exam engine<br/>idempotent attempts · cooldown"]
    Courses --> C3["Progress tracking<br/>+ membership gating"]

    Pay --> P1["MercadoPago · PayPal · NOWPayments"]
    Pay --> P2["Idempotent webhooks<br/>tolerant fulfillment"]
    Pay --> P3["Coupons & affiliate tracking"]
    Pay --> P4["Dual-currency pricing (ARS / USD)"]

    Tutor --> T1["Gemini + context caching"]
    Tutor --> T2["Prompt-injection filter"]
    Tutor --> T3["Usage logging & quotas"]

    Data --> D1["Supabase Auth + Turnstile captcha"]
    Data --> D2["Postgres + Row-Level Security<br/>multi-tenant isolation"]
    Data --> D3["34 versioned SQL migrations"]

    Comms --> M1["Discord bot — role grant / revoke"]
    Comms --> M2["Telegram bot — admin notifications"]
    Comms --> M3["Resend — transactional email"]

    Ops --> O1["Upstash — rate limiting"]
    Ops --> O2["Sentry + PostHog — observability"]
    Ops --> O3["Vercel — deploy · 3 cron jobs"]
```

## Features

- Typed course system (modules, sections, and content blocks defined in TypeScript)
- Zero-trust exam engine
- Multi-gateway payments (MercadoPago, PayPal, NOWPayments) with idempotent webhooks
- Row-Level-Security multi-tenant data isolation
- AI tutor (Gemini) with a prompt-injection filter
- Rate limiting (Upstash Redis)
- Observability (Sentry error tracking, PostHog product analytics)
- Discord and Telegram integration

## Notes

- This is a curated public showcase: secrets, internal tooling, and paid course content are excluded.
- Course content files retain their pedagogical structure but the lesson bodies are replaced with placeholders.
- This is not the full production tree.
