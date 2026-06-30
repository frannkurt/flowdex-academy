# Flowdex Academy

Flowdex Academy is a production markets-education platform: a typed course system, exams, multi-gateway checkout, and membership areas, built on Next.js (React, TypeScript) with Supabase and deployed on Vercel.

> This is a production product. The repository here is a curated public showcase — secrets, internal tooling, and paid course content are excluded.

**Stack:** Next.js (App Router) · React · TypeScript · Tailwind CSS · Supabase (Auth, Postgres, RLS) · Vercel

## Architecture

```mermaid
flowchart TD
    Browser["Browser — Next.js / React"] --> App["App Router — 43 API routes, server actions"]

    App --> Supabase["Supabase — Auth, Postgres, RLS"]
    App --> Payments["Payments — MercadoPago / PayPal / NOWPayments<br/>idempotent webhooks"]
    App --> Email["Resend — transactional email"]
    App --> Bots["Discord / Telegram bots"]
    App --> AI["AI tutor — Gemini"]

    App --> Upstash["Upstash — rate limiting"]
    App --> Obs["Sentry + PostHog — observability"]

    App --> Vercel["Vercel — deploy, cron jobs"]
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
