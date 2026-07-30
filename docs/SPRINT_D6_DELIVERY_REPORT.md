# Sprint D6 Delivery Report — Opportunity Engine

**Date:** 2026-07-30  
**Branch:** `cursor/seo-autopilot-sprint-d6-opportunity-engine-6d57`  
**Status:** **DONE / LOCKED** — Sprint D6 approved and locked; Sprint D7 not started  
**Locked predecessors:** Sprint D1–D5 — not redesigned

---

## Objective

Replace placeholder opportunities with a structured Opportunity Engine that prioritises work by business value — a decision aid, not an SEO audit.

---

## 1. Components created

| Component | Role |
| --- | --- |
| `OpportunityListItem` | Compact opportunity row with priority band |
| `OpportunityCategoryGroup` | Category heading + ordered list |
| `OpportunityDetailView` | Full plain-English detail + Show me how |
| `PrioritisationLegend` | Qualitative impact/effort bands (no scores) |

---

## 2. Files modified / created

**Created**

- `apps/web/src/content/opportunities.ts`
- `apps/web/src/opportunities/useOpportunities.ts`
- Opportunity components + CSS above
- `apps/web/src/pages/OpportunitiesPage.tsx` + `.css`
- `apps/web/src/pages/OpportunityDetailPage.tsx` + `.css`
- `docs/SPRINT_D6_DELIVERY_REPORT.md`

**Modified (minimal)**

- `apps/web/src/App.tsx` — `/opportunities` routes
- `apps/web/src/pages/WorkspacePage.tsx` — Your Opportunities body wired to engine (section shell unchanged)
- `apps/web/README.md`, `docs/IMPLEMENTATION_ROADMAP.md`, `docs/CURRENT_STATE_AUDIT.md`, `SEO_AUTOPILOT_README.md`

---

## 3. Mock opportunity models

`apps/web/src/content/opportunities.ts`

- Required fields: title, category, whyThisMatters, estimatedEffort, potentialImpact, recommendedAction, relatedLearningGuide
- Detail fields: explanation, whyIdentified, expectedBenefit, steps, showMeHowHref
- Qualitative `impactLevel` / `effortLevel` → `PriorityBand` (no numeric scores)
- Categories: Content, Technical Foundation, Local Visibility, Trust & Reputation, Customer Experience
- Within category: ordered impact first, then effort

---

## 4. State management

- `useOpportunities()` — memoised grouped list, top priorities, `getBySlug`
- No persistence / backend / React global store beyond mock module helpers

---

## 5. Validation completed

| Command | Result |
| --- | --- |
| `pnpm --filter @seo-autopilot/web typecheck` | Pass |
| `pnpm --filter @seo-autopilot/web build` | Pass |
| `pnpm run build:seo-autopilot` | Pass |
| `pnpm run test:seo-autopilot` | **86/86** pass |
| `npm run test:production-boot-syntax` | **6/6** pass |

Manual: `/opportunities` shows categories + Start here; detail route shows structured guidance; Workspace opportunities links to engine.

---

## 6. Deferred functionality

- Live Opportunity Engine / scoring services
- Wiring D4 Today’s Priority to live top opportunity
- Google / crawl / AI orchestration
- Auth / persistence
- Sprint D7

---

## 7. UX observations (not implemented)

1. **D4 Today’s Priority** still uses briefing mock; aligning it to `firstPriority` from this engine would reduce duplicate “start here” messages (left unchanged to keep D4 locked).
2. **Nav:** Opportunities is reachable from Workspace; a primary nav item may help later without crowding.
3. **Ask mock** still references discovery opportunity titles; later, Ask should cite Opportunity Engine slugs.
4. **Low-impact/high-effort** item is included intentionally to teach honest prioritisation — confirm product wants it visible in customer UI.

---

## Rollback

Revert/close PR / delete branch `cursor/seo-autopilot-sprint-d6-opportunity-engine-6d57`.
