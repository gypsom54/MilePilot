# @seo-autopilot/web

Customer-facing SEO AutoPilot interface (React + Vite + TypeScript).

## Sprint D1

Calm product shell, Home introduction, and Learning Centre with seeded FAQ content.

- Routes: `/`, `/learn`, `/learn/:slug`
- No authentication, Ask SEO AutoPilot, Google integrations, or fabricated business data
- FAQ content lives in `src/content/faq.ts` (typed data, not a CMS)

## Commands

```bash
pnpm --filter @seo-autopilot/web dev
pnpm --filter @seo-autopilot/web build
pnpm --filter @seo-autopilot/web typecheck
pnpm --filter @seo-autopilot/web preview
```

Or from this package:

```bash
pnpm dev
pnpm build
pnpm typecheck
```

## Visual notes

Provisional decisions are documented in `src/theme/visual-decisions.ts`.
Brand identity is a text wordmark until an approved logo is supplied.
