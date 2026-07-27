# Sprint 0 — Architecture Foundation

## 1. Objective

Create the engineering foundation for SEO AutoPilot: a scalable architecture
that every future Intelligence Engine will use.

This sprint is **not** about building features or UI.

## 2. Files to modify / create

- `pnpm-workspace.yaml`
- `tsconfig.seo-autopilot.json`
- `tsconfig.seo-autopilot.base.json`
- `package.json` (SEO AutoPilot build/test scripts + TypeScript only)
- `apps/web/**`
- `apps/api/**`
- `packages/shared/**`
- `packages/engine-sdk/**`
- `packages/knowledge-graph/**`
- `packages/ai/**`
- `packages/ui/**` (scaffold only)
- `packages/database/**` (scaffold only)
- `packages/auth/**` (scaffold only)
- `services/**` (10 engine scaffolds)
- `docs/seo-autopilot/**`
- `tests/seo-autopilot/**`
- `.gitignore` (dist / tsbuildinfo for new packages if needed)

## 3. Files protected

- All existing MilePilot application code (`src/`, `frontend/`, `backend/`, Expo shell)
- All existing RankAura application code (`rankaura/`, `rankaura-web/`)
- Existing MilePilot/RankAura design and product bibles under `docs/` (not SEO AutoPilot authority)
- No authentication UI
- No dashboard / reports / SEO tools / crawlers / business logic

## 4. Acceptance criteria

Sprint complete only if:

- [x] Zero business logic
- [x] Zero SEO logic
- [x] Zero dashboards
- [x] Zero UI decisions
- [x] Engine framework exists (`@seo-autopilot/engine-sdk`)
- [x] Knowledge Graph SDK exists (`@seo-autopilot/knowledge-graph` — interfaces only)
- [x] Event system exists (`EventBus` + platform event names)
- [x] Engine Registry exists (`InMemoryEngineRegistry`)
- [x] Logging framework exists
- [x] AI Prompt Framework exists (per-engine `prompt.md`)
- [x] Configuration system exists
- [x] Testing framework structure exists
- [x] Documentation exists
- [x] Everything compiles cleanly

If any business feature has been built, the sprint has failed.

## 5. Test plan

1. `pnpm install` (workspace)
2. `pnpm run build:seo-autopilot` — TypeScript project references compile
3. `pnpm run test:seo-autopilot` — unit + contract tests for foundation
4. Manual review: no UI components, no SEO/business algorithms in diff

## 6. Evidence

- Compiling TypeScript monorepo under `apps/`, `packages/`, `services/`
- Passing foundation tests under `tests/seo-autopilot/`
- Developer docs under `docs/seo-autopilot/`

## 7. Rollback plan

1. Delete the feature branch `cursor/seo-autopilot-architecture-sprint0-6d57`
2. Or revert the Sprint 0 commit(s) on the branch
3. No production systems are affected — Sprint 0 adds scaffold only
