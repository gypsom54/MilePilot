# First Sprint Recommendation — SEO AutoPilot Delivery

**Status:** **DONE** — Sprint D1 approved, implemented, and closed as complete — see `docs/SPRINT_D1_DELIVERY_REPORT.md`  
**Date:** 2026-07-30

---

## Recommended first implementation sprint

**Name:** Sprint D1 — SEO AutoPilot calm product shell + Learning Centre seed  

**Objective (one only):** Establish a real customer-facing shell for SEO AutoPilot with calm visual foundations and a small set of honest FAQ pages — without Ask, without Google, and without fake success states.

### Why this sprint (evidence-based)

- Repository has **strong engines** but **zero SEO AutoPilot customer UI** (`apps/web` scaffold-only).  
- Ask SEO AutoPilot is **Engineering-locked** (Volume 3) — cannot be the first build.  
- Google connectors have **no infrastructure** — blocked.  
- Learning Centre content can ship as **real static behaviour** and immediately demonstrates adviser tone.  
- Creates the foundation for Phase 2 (Business Growth Profile onboarding) without inventing integrations.  
- Preserves MilePilot production surfaces untouched.

### Customer outcome

A visitor can open SEO AutoPilot, feel a calm premium shell, read plain-English answers about SEO vs paid ads and timescales, and understand what the product will (and will not yet) do.

### In scope

- Implement UI in `apps/web` **after Decisions 1–2 are approved** (recommended: React + Vite in `apps/web`)  
- App layout, tokens, typography, spacing — calm/minimal/premium  
- Routes: Home (honest next-steps, no fake scores), Learning Centre index, 6–10 FAQ articles from the approved topic list  
- Shared customer-language components: What / Why / Next  
- Explicit Home copy that Ask and Google connections arrive later  

### Out of scope

- Ask SEO AutoPilot orchestration or chatbot UI  
- Business Discovery onboarding wiring (Sprint D2)  
- Google OAuth / Ads  
- Opportunity Queue / Health scores  
- MilePilot frontend/backend changes  
- RankAura revival  
- Package upgrades unrelated to the chosen UI scaffold  

### Acceptance criteria

1. App builds and runs locally for mobile and desktop widths.  
2. Home has one primary purpose and is understandable in under one minute.  
3. FAQ content uses plain English; no ranking guarantees; no fear framing.  
4. No mock “connected”, “analysing”, or Ask success states.  
5. MilePilot vital paths untouched; SEO engine tests still pass.  
6. Lint/typecheck/build (as applicable to new app) pass.

### Test requirements

- Production/typecheck build for new web app  
- Manual mobile + desktop review  
- Copy review against `docs/ENGINEERING_GUARDRAILS.md`  
- Regression: `pnpm run test:seo-autopilot`

### Rollback

Remove/revert the Sprint D1 branch; `apps/web` returns to scaffold-only.

### Estimated complexity

**Medium** (framework scaffolding + content + design discipline).

### Depends on owner approval of

- `docs/DECISIONS_REQUIRED.md` Decision 1 (UI home) and Decision 2 (framework)  
- This sprint recommendation  

---

## Suggested immediate next sprint (not started)

**Sprint D2 — Calm onboarding + Business Growth Profile** wired to Business Discovery.
