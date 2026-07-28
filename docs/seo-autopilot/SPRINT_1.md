# Sprint 1 — Business Discovery Domain

## 1. Objective

Implement the Business Discovery Engine domain from Volume 4 so the platform can represent a business as a versioned, provenance-rich canonical profile consumed via API, Knowledge Graph, and events — with zero SEO, crawling, content, orchestration, or dashboard work.

## 2. Files to modify / create

- `docs/seo-autopilot/VOLUME_4_BUSINESS_DISCOVERY.md`
- `docs/seo-autopilot/SPRINT_1.md`
- `docs/seo-autopilot/VOLUME_4_BUSINESS_DISCOVERY_READINESS.md`
- `docs/seo-autopilot/ARCHITECTURE.md`
- `docs/seo-autopilot/README.md`
- `packages/shared/**` (events, provenance helpers)
- `packages/engine-sdk/**` (Capability Manifest types)
- `packages/knowledge-graph/**` (in-memory store + BD mappings)
- `packages/database/**` (Business Discovery schema + store)
- `services/business-discovery/**`
- `apps/api/**`
- `tests/seo-autopilot/**`

## 3. Files protected

- MilePilot tracking / reports code
- RankAura UI and design systems
- Ask SEO AutoPilot orchestration implementation (Volume 3 remains locked)
- No dashboards, SEO scoring, crawlers, keyword research, content generation, opportunity calculations

## 4. Acceptance criteria

- [x] Volume 4 committed as Bible authority
- [x] Canonical Business Profile can be created, updated, and retrieved
- [x] Every field carries provenance (source, confidence, last verified, change history)
- [x] Changes are versioned
- [x] Entities mapped into the Knowledge Graph
- [x] Events published for domain changes
- [x] Capability Manifest published
- [x] Validation layer rejects invalid profiles
- [x] Business Discovery API available
- [x] Unit, integration, and contract tests pass
- [x] Zero SEO / crawl / content / orchestration / dashboard code

## 5. Test plan

```bash
pnpm install
pnpm run build:seo-autopilot
pnpm run test:seo-autopilot
```

## 6. Evidence

- Compiling TypeScript packages/services
- Passing Sprint 1 tests under `tests/seo-autopilot/`
- Documentation under `docs/seo-autopilot/`

## 7. Rollback plan

Revert commits on `cursor/seo-autopilot-business-discovery-sprint1-6d57` or close the Sprint 1 PR.
