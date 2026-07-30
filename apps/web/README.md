# @seo-autopilot/web

Customer-facing SEO AutoPilot interface (React + Vite + TypeScript).

## Sprint status

| Sprint | Status |
| --- | --- |
| D1 — Shell + Learning Centre | DONE / LOCKED |
| D2 — Onboarding + Business Growth Profile | LOCKED |
| D3 — Website Discovery | DONE / LOCKED |
| D4 — Personal Workspace (daily briefing) | DONE |

## Routes

- `/` — Home
- `/learn`, `/learn/:slug` — Learning Centre
- `/discover` — Analysis progress (honest checklist)
- `/discover/summary` — Discovery summary (max three recommendations)
- `/workspace` — Personal daily briefing + workspace sections

## Notes

- No authentication, Ask SEO AutoPilot, Google integrations, or SEO scores
- FAQ content: `src/content/faq.ts`
- Discovery mock content: `src/content/discovery.ts`
- Daily briefing mock content: `src/content/briefing.ts`
- Discovery session state: `src/discovery/DiscoveryContext.tsx`
- Briefing resolver: `src/discovery/useDailyBriefing.ts`

## Commands

```bash
pnpm --filter @seo-autopilot/web dev
pnpm --filter @seo-autopilot/web build
pnpm --filter @seo-autopilot/web typecheck
pnpm --filter @seo-autopilot/web preview
```

## Visual notes

Provisional decisions are documented in `src/theme/visual-decisions.ts`.
Brand identity is a text wordmark until an approved logo is supplied.
