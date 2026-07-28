# Sprint 5 — Knowledge Graph Engine

## 1. Objective

Transform the Knowledge Graph into the canonical semantic memory of SEO AutoPilot per Volume 8.

## 2. Files to modify / create

- `docs/seo-autopilot/VOLUME_8_KNOWLEDGE_GRAPH.md`
- `docs/seo-autopilot/SPRINT_5.md`
- `docs/seo-autopilot/{ARCHITECTURE,README,EVENTS,KNOWLEDGE_GRAPH}.md`
- `packages/shared/**` (events)
- `packages/knowledge-graph/**` (canonical models, store, identity, queries)
- `services/knowledge-graph-engine/**`
- `apps/api/**`
- `tests/seo-autopilot/**`

## 3. Files protected

- MilePilot tracking / report pipelines
- RankAura UI
- Ask SEO AutoPilot locks
- Volumes 3–7 Bible content (index refs only)
- No SEO / crawl / website / business / market domain logic
- No automatic AI merges

## 4. Acceptance criteria

- [x] Volume 8 committed
- [x] Canonical entities/relationships, aliases, identity, duplicates, merge proposals
- [x] Evidence / provenance / confidence / version / temporal validity
- [x] Repository + in-memory persistence + API + events + manifest
- [x] `recommend()` refuses
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

Revert/close `cursor/seo-autopilot-knowledge-graph-sprint5-6d57`.
