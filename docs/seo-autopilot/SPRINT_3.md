# Sprint 3 — Website Intelligence Domain

## 1. Objective

Build the complete Website Intelligence domain from Volume 6 so the platform can represent a business website structurally and semantically before crawling or optimisation begins.

## 2. Files to modify / create

- `docs/seo-autopilot/VOLUME_6_WEBSITE_INTELLIGENCE.md`
- `docs/seo-autopilot/SPRINT_3.md`
- `docs/seo-autopilot/{ARCHITECTURE,README,EVENTS,KNOWLEDGE_GRAPH}.md`
- `packages/shared/**` (events)
- `packages/database/**` (WI schema/store)
- `packages/knowledge-graph/**` (WI mappings)
- `services/website-intelligence/**`
- `apps/api/**`
- `tests/seo-autopilot/**`
- `tsconfig.seo-autopilot.json`

## 3. Files protected

- MilePilot functionality
- RankAura UI / onboarding
- Ask SEO AutoPilot locks
- Business Discovery / Market Intelligence mutation semantics (WI must not overwrite)
- Crawling / reporting / unrelated packages

## 4. Acceptance criteria

- [x] Volume 6 committed
- [x] Domain + API + KG + events + manifest
- [x] URL normalisation + dedupe
- [x] Staging/production distinct
- [x] Hierarchy loop rejection
- [x] Candidate confirmation required
- [x] Idempotent imports; tenant isolation
- [x] Historical publication states retained
- [x] `recommend()` refuses optimisation
- [x] No crawl/SEO/content/performance/dashboard/opportunity/Ask capabilities
- [x] Build + all tests pass

## 5. Test plan

```bash
pnpm install
pnpm run build:seo-autopilot
pnpm run test:seo-autopilot
```

## 6. Evidence

Build output + full test suite results.

## 7. Rollback plan

Revert/close `cursor/seo-autopilot-website-intelligence-sprint3-6d57`.
