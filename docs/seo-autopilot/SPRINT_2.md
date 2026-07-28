# Sprint 2 — Market Intelligence Domain

## 1. Objective

Implement the complete Market Intelligence domain from Volume 5 so SEO AutoPilot can represent external market understanding through structured, sourced and versioned evidence.

## 2. Files to modify / create

- `docs/seo-autopilot/VOLUME_5_MARKET_INTELLIGENCE.md`
- `docs/seo-autopilot/SPRINT_2.md`
- `docs/seo-autopilot/ARCHITECTURE.md`
- `docs/seo-autopilot/README.md`
- `docs/seo-autopilot/EVENTS.md`
- `docs/seo-autopilot/KNOWLEDGE_GRAPH.md`
- `packages/shared/**` (events)
- `packages/database/**` (MI schema/store)
- `packages/knowledge-graph/**` (MI mappings)
- `services/market-intelligence/**`
- `apps/api/**`
- `tests/seo-autopilot/**`

## 3. Files protected

- MilePilot functionality
- RankAura UI / onboarding screens
- Ask SEO AutoPilot implementation locks
- Crawling / reporting code outside this sprint
- Business Discovery canonical mutation paths (MI must not overwrite BD facts)
- Unrelated workspace packages

## 4. Acceptance criteria

- [x] Volume 5 committed
- [x] Domain + API + KG + events + manifest
- [x] Evidence sourced, versioned, scoped
- [x] Candidate/confirm workflows
- [x] Gaps require evidence; trends require multi-time observations
- [x] Idempotent imports; tenant isolation
- [x] `recommend()` refuses strategy
- [x] No crawl/SEO/content/orchestration/dashboard/external providers
- [x] Build + all tests pass

## 5. Test plan

```bash
pnpm install
pnpm run build:seo-autopilot
pnpm run test:seo-autopilot
```

## 6. Evidence

Build output + test suite results (count in PR / sprint report).

## 7. Rollback plan

Revert/close branch `cursor/seo-autopilot-market-intelligence-sprint2-6d57`.
