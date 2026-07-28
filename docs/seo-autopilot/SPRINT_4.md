# Sprint 4 — Crawl Intelligence Domain

## 1. Objective

Build the complete Crawl Intelligence observation domain from Volume 7 so SEO AutoPilot can preserve sourced, timestamped and immutable website observations without judging or optimising them.

## 2. Files to modify / create

- `docs/seo-autopilot/VOLUME_7_CRAWL_INTELLIGENCE.md`
- `docs/seo-autopilot/SPRINT_4.md`
- `docs/seo-autopilot/{ARCHITECTURE,README,EVENTS,KNOWLEDGE_GRAPH}.md`
- `packages/shared/**` (events)
- `packages/database/**` (crawl schema/store)
- `packages/knowledge-graph/**` (crawl mappings)
- `services/crawl/**`
- `apps/api/**`
- `tests/seo-autopilot/**`

## 3. Files protected

- MilePilot functionality
- RankAura UI / onboarding
- Ask SEO AutoPilot locks
- Website Intelligence mutation paths (crawl must not overwrite meaning)
- No production network crawler / browser automation

## 4. Acceptance criteria

- [x] Volume 7 committed
- [x] Observation domain + adapters + API + KG + events + manifest
- [x] Immutability, idempotency, scope enforcement, redaction
- [x] `recommend()` refuses judgement
- [x] No SEO/indexability/accessibility/performance/content/ranking/opportunity/dashboard/Ask/live crawl
- [x] Build + all tests pass

## 5. Test plan

```bash
pnpm install
pnpm run build:seo-autopilot
pnpm run test:seo-autopilot
```

## 6. Evidence

Build + full test suite results in PR/sprint report.

## 7. Rollback plan

Revert/close `cursor/seo-autopilot-crawl-intelligence-sprint4-6d57`.
