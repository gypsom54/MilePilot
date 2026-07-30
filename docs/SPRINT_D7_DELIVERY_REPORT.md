# Sprint D7 Delivery Report — Guided Action Plans

**Date:** 2026-07-30  
**Branch:** `cursor/seo-autopilot-sprint-d7-guided-action-plans-6d57`  
**Status:** Complete — Sprint D8 not started  
**Locked predecessors:** Sprint D1–D6 — not redesigned

---

## Objective

Turn a selected opportunity into a calm, practical, step-by-step action plan with manual confirmation — guided implementation only, not autonomous execution.

---

## 1. Components created

| Component | Role |
| --- | --- |
| `ActionPlanOutline` | Lightweight step outline with current/done states |
| `ActionPlanStepFocus` | One primary step: what / why / guidance / complete / optional Ask |
| `ActionPlanComplete` | Calm “Nicely done.” completion state |

---

## 2. Files modified

- `apps/web/src/App.tsx` — `/opportunities/:slug/plan`
- `apps/web/src/main.tsx` — `ActionPlanProvider`
- `apps/web/src/components/OpportunityDetail.tsx` — “Show me how” → plan route only
- `apps/web/src/components/AskComposer.tsx` — optional `initialValue` (prefill only)
- `apps/web/src/pages/AskPage.tsx` — reads `?q=` to prefill composer; **no auto-submit**
- Docs / README updates

**Created:** `content/actionPlans.ts`, `actionPlans/ActionPlanContext.tsx`, ActionPlan page + components

---

## 3. Routes updated

| Route | Purpose |
| --- | --- |
| `/opportunities/:slug/plan` | Guided action plan |

Existing opportunity detail unchanged aside from CTA target.

---

## 4. Action-plan mock models

`apps/web/src/content/actionPlans.ts`

- Plan: actionPlanId, opportunitySlug, title, introduction, estimatedTime, steps
- Step: id, title, whatToDo, whyItMatters, helpfulGuidance, optional learning guide, optional Ask reference
- Completion tracked in session state (not in static mock)

---

## 5. State-management approach

Isolated `ActionPlanProvider` / `useActionPlan`:

- plan lookup by opportunity slug
- per-plan session: currentStepId + completedStepIds
- mark complete, goToStep, progress counts, plan completion
- Session-only — no persistence
- DiscoveryContext / AskContext APIs unchanged

---

## 6. Opportunity-to-plan mappings

| Opportunity slug | Action plan |
| --- | --- |
| `answer-common-customer-questions` | `plan-faq-questions` (6 steps) |
| `gather-recent-reviews` | `plan-recent-reviews` (4 steps) |
| `clarify-service-areas` | `plan-service-areas` (4 steps) |

Other D6 opportunities show a calm “plan not available yet” page if “Show me how” is used.

---

## 7. Validation completed

| Command | Result |
| --- | --- |
| `pnpm --filter @seo-autopilot/web typecheck` | Pass |
| `pnpm --filter @seo-autopilot/web build` | Pass |
| `pnpm run build:seo-autopilot` | Pass |
| `pnpm run test:seo-autopilot` | **86/86** pass |
| `npm run test:production-boot-syntax` | **6/6** pass |

Manual: Show me how → plan overview + first step; mark steps complete; progress text; completion state; Ask `?q=` prefill.

---

## 8. Deferred functionality

- Auto-submit Ask questions from plan handoff
- Plans for every D6 opportunity
- Live verification that website changes were made
- CMS / WordPress publishing
- Persistence of completion across visits
- Sprint D8

---

## 9. UX observations (not implemented)

1. **D4 Today’s Priority “Show me how”** still points at Learning Centre via briefing mock — aligning it to the matching action plan would improve continuity (left unchanged to keep D4 locked).
2. **Unmapped opportunities** currently reach an empty-plan message; product may prefer hiding “Show me how” until a plan exists.
3. **Ask prefill** requires the customer to press Ask — auto-submit would feel smoother but needs an explicit D5 unlock.
4. **Completion “View another opportunity”** currently returns to the full list; a smarter “next highest priority without a completed plan” could come later.

---

## Rollback

Revert/close PR / delete branch `cursor/seo-autopilot-sprint-d7-guided-action-plans-6d57`.
