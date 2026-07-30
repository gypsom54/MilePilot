# Sprint D1 Delivery Report — Calm Product Shell + Learning Centre Seed

**Date:** 2026-07-30  
**Branch:** `cursor/seo-autopilot-sprint-d1-shell-6d57`  
**Status:** Complete — Sprint D2 not started

---

## Objective

Create the first genuine customer-facing SEO AutoPilot interface: a calm product shell, a minimal Home page, a plain-English Learning Centre with seeded FAQ content, shared visual foundations, and responsive desktop/mobile behaviour — without fabricated business data, Ask, Google integrations, or persistence architecture.

---

## Work completed

1. Scaffolded React + Vite + TypeScript in `apps/web`
2. Implemented AppShell with text wordmark brand, Home / Learning Centre nav, labelled future “Business workspace”, mobile menu, footer
3. Built Home with honest hero, Learning Centre CTA, and five growth pillars (no scores)
4. Built Learning Centre landing with six categories and progressive FAQ list
5. Seeded 33 FAQ articles with typed content in `src/content/faq.ts`
6. Added shared components (PageContainer, PageIntro, GrowthPillar, FAQ*, PlainLanguageNote, NextStepPanel)
7. Documented provisional visual decisions
8. Validated web build/typecheck, SEO AutoPilot build/tests, production boot syntax
9. Updated delivery docs (`CURRENT_STATE_AUDIT`, `IMPLEMENTATION_ROADMAP`, this report)

---

## Files created

- `apps/web/index.html`
- `apps/web/vite.config.ts`
- `apps/web/tsconfig.app.json`
- `apps/web/src/main.tsx`
- `apps/web/src/App.tsx`
- `apps/web/src/vite-env.d.ts`
- `apps/web/src/styles/global.css`
- `apps/web/src/theme/visual-decisions.ts`
- `apps/web/src/content/faq.ts`
- `apps/web/src/components/*` (AppShell, Header, MobileNavigation, Footer, PageContainer, PageIntro, GrowthPillar, FAQCategory, FAQArticle, PlainLanguageNote, NextStepPanel + CSS)
- `apps/web/src/pages/*` (HomePage, LearningCentrePage, FaqArticlePage + CSS)
- `docs/SPRINT_D1_DELIVERY_REPORT.md`
- Delivery planning docs brought onto branch (if not already on `main`): `docs/CURRENT_STATE_AUDIT.md`, `docs/MVP_PRODUCT_SCOPE.md`, `docs/IMPLEMENTATION_ROADMAP.md`, `docs/ENGINEERING_GUARDRAILS.md`, `docs/DECISIONS_REQUIRED.md`, `docs/FIRST_SPRINT_RECOMMENDATION.md`

---

## Files modified

- `apps/web/package.json` — React/Vite/router dependencies and scripts
- `apps/web/tsconfig.json` — project references for Vite app
- `apps/web/README.md` — Sprint D1 usage
- `package.json` — `dev:seo-web`, `build:seo-web`, `typecheck:seo-web`; `pnpm.onlyBuiltDependencies` for esbuild
- `pnpm-lock.yaml` — lockfile for web deps
- `tsconfig.seo-autopilot.json` — removed `apps/web` from composite `tsc -b` (Vite app is not a library project)
- `SEO_AUTOPILOT_README.md` — web shell status + commands
- `docs/CURRENT_STATE_AUDIT.md` — UI current state
- `docs/IMPLEMENTATION_ROADMAP.md` — Phase 1 / Learning Centre seed status
- `docs/FIRST_SPRINT_RECOMMENDATION.md` — marked approved/implemented
- Deleted scaffold `apps/web/src/index.ts` (replaced by Vite entry)

---

## Dependencies added

In `@seo-autopilot/web` only:

| Package | Role |
| --- | --- |
| `react` `19.2.3` | UI |
| `react-dom` `19.2.3` | DOM renderer |
| `react-router-dom` | Client routing |
| `vite` | Dev/build |
| `@vitejs/plugin-react` | React plugin |
| `@types/react`, `@types/react-dom` | Types |
| `typescript` | Already workspace-available; listed for package scripts |

Root: no new runtime deps; `pnpm.onlyBuiltDependencies: ["esbuild"]` so Vite’s esbuild binary can install under pnpm 10.

---

## Tests run

| Command | Result |
| --- | --- |
| `pnpm --filter @seo-autopilot/web typecheck` | Pass |
| `pnpm --filter @seo-autopilot/web build` | Pass |
| `pnpm run build:seo-autopilot` | Pass |
| `pnpm run test:seo-autopilot` | **86/86 pass** |
| `npm run test:production-boot-syntax` | **6/6 pass** |

---

## Manual checks

Documented in the PR / agent run after preview smoke:

- `/` Home — brand, hero, pillars, CTA to Learning Centre; no fabricated metrics
- `/learn` — categories + FAQ lists
- At least three FAQ routes (e.g. `/learn/what-is-seo`, `/learn/how-long-does-seo-normally-take`, `/learn/what-is-the-difference-between-seo-and-google-ads`)
- Desktop layout and mobile layout (nav menu)
- Keyboard focus / Escape closes mobile menu
- No intentional console errors from app code
- No broken internal Learning Centre links in seed set
- No MilePilot (`frontend/`, `backend/`) or engine package behaviour changes

---

## Known limitations

- No authentication or customer accounts
- No durable persistence for accounts/profiles (in-memory engines unchanged; UI is static content)
- Business workspace nav item is labelled “Coming later” only
- No approved logo asset — text wordmark only
- Visual system is provisional (see `apps/web/src/theme/visual-decisions.ts`)
- No automated visual/e2e framework introduced this sprint
- FAQ `nextStep` is optional advisory text linking to a related article when present

---

## Deferred work

- Sprint D2: onboarding + Business Growth Profile
- Ask SEO AutoPilot (Volume 3 locked)
- Google Search Console / Analytics / Business Profile / Ads
- Business Health scores, Opportunity queues, Growth timelines
- Notifications, weekly/monthly letters
- Payments / pricing
- Production persistence architecture
- Later Learning Centre expansion beyond the D1 seed

---

## Rollback instructions

1. Revert or close the Sprint D1 PR / delete branch `cursor/seo-autopilot-sprint-d1-shell-6d57`
2. Restore prior `apps/web` scaffold (`src/index.ts` package shell) if needed
3. Revert root `package.json` web scripts and `pnpm.onlyBuiltDependencies` if undesired
4. Re-add `apps/web` to `tsconfig.seo-autopilot.json` only if restoring the old composite library shape
5. `rankaura-web/` was never part of this sprint — leave untouched

MilePilot production paths and SEO AutoPilot engine packages were not modified and need no rollback for this sprint’s product shell work.
