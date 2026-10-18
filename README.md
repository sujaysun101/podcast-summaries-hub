# YieldCast

YieldCast is a sponsor desk for independent podcasters. Save a show, keep an audience profile, rank brand fits with a reason, draft a pitch, and move it across a board: drafted, sent, replied, won. Each show can publish a public media kit.

## Features

- Saved shows with host, cadence, downloads, and a per-episode rate card
- Audience profile stored with the show
- Brand matches with a fit score and a written reason
- Pitch drafts and an outreach kanban
- Shareable media kit at `/kit/[slug]`
- Dashboard charts for pipeline value and won packages
- Demo workspace when `DATABASE_URL` is missing, labeled in the app

## Stack

Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Clerk, Drizzle ORM, Postgres, Anthropic.

The `yieldcast/` directory is the earlier Vite prototype. The product in this repository is the Next.js app at the root.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

Clerk runs in keyless mode in development when the publishable and secret keys are empty. In production, set both keys. If they are missing in production, the app serves the demo workspace so a preview can still be clicked through.

## Database

```bash
# DATABASE_URL must be a Postgres connection string (Neon or Supabase work)
npm run db:migrate
npm run db:seed
```

`db:seed` writes the demo shows for `SEED_USER_ID` (default `demo`). Without `DATABASE_URL`, the same demo workspace is served from memory and nothing is written.

## Environment variables

See `.env.example` for names.

| Name | Role |
| --- | --- |
| `DATABASE_URL` | Postgres. Omit it to use the in-memory demo store. |
| `ANTHROPIC_API_KEY` | Live analysis and pitch drafts. Omit it for labeled sample responses. |
| `AI_MODEL` | Claude model. Defaults to `claude-sonnet-4-5`. |
| `AI_MAX_TOKENS` | Response cap, never above 4096. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key. |
| `CLERK_SECRET_KEY` | Clerk secret key. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` |
| `UPSTASH_REDIS_REST_URL` | Optional shared rate limit. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional shared rate limit. |
| `NEXT_PUBLIC_APP_URL` | Absolute URL for metadata. |
| `DEMO_SCREENSHOT` | Set to `1` only while capturing portfolio screenshots. Skips auth. |
| `SEED_USER_ID` | User id the seed script fills. |

## AI route

`POST /api/analyse` requires a signed-in user, validates the body with zod, and rate-limits per user (Upstash when configured, otherwise an in-memory token bucket). Bad input returns 400. A missing key, or a model reply that cannot be validated, returns a labeled sample analysis instead of a 500.

## Screenshots

```bash
DEMO_SCREENSHOT=1 npm run dev
# in another shell
npm run screenshot
```

Writes `public/portfolio-screenshot.png` and `public/portfolio-screenshot-landing.png` at 1440×900.
