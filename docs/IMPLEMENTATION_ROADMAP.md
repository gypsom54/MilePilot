# Implementation Roadmap — SEO AutoPilot Product Delivery

**Date:** 2026-07-30  
**Based on:** `docs/CURRENT_STATE_AUDIT.md`, `docs/MVP_PRODUCT_SCOPE.md`, Engineering Bible checkpoint  

Relative effort only — no calendar dates.

---

## Phase 0 — Stabilise and understand the repository

| Field | Content |
| --- | --- |
| **Objective** | Lock shared understanding of MilePilot vs SEO AutoPilot vs RankAura; protect production MilePilot; confirm SEO engine health |
| **Customer outcome** | None directly — prevents wrong-surface delivery |
| **Deliverables** | Current state audit; delivery guardrails; decision list; roadmap (this pack) |
| **Likely files** | `docs/CURRENT_STATE_AUDIT.md`, `docs/MVP_PRODUCT_SCOPE.md`, `docs/IMPLEMENTATION_ROADMAP.md`, `docs/ENGINEERING_GUARDRAILS.md`, `docs/DECISIONS_REQUIRED.md` |
| **Dependencies** | None |
| **Risks** | Mistaking RankAura build for product source |
| **Tests** | Re-run `pnpm run build:seo-autopilot` + `pnpm run test:seo-autopilot` |
| **Acceptance** | Docs approved; decisions logged; no app code changed in Phase 0 |
| **Exclusions** | UI implementation; Ask unlock; Google |
| **Complexity** | Low |

---

## Phase 1 — Product shell and visual consistency

| Field | Content |
| --- | --- |
| **Objective** | Create a calm, premium SEO AutoPilot customer shell with routing, layout, and shared language components |
| **Customer outcome** | A coherent place that feels like a trusted adviser product (not MilePilot, not a technical dashboard) |
| **Deliverables** | App shell; Home route skeleton; design tokens; shared What/Why/Next components; navigation limited to Home + Learning |
| **Likely affected** | `apps/web/**`, possibly `packages/ui/**`, docs UX notes |
| **New files** | App entry, layout, theme, shared copy components, routes |
| **Dependencies** | Decision: UI framework + app location |
| **Risks** | Accidental MilePilot styling bleed; placeholder theatre |
| **Tests** | Typecheck/build; smoke render tests if framework supports; mobile + desktop layout checks |
| **Acceptance** | Shell loads; one primary purpose per screen; no fake data success states |
| **Exclusions** | Ask, Google, Opportunity scoring, MilePilot edits |
| **Complexity** | Medium |

---

## Phase 2 — Onboarding and Business Growth Profile

| Field | Content |
| --- | --- |
| **Objective** | Calm onboarding that creates a real Business Discovery profile |
| **Customer outcome** | “You understand my business” without jargon |
| **Deliverables** | Multi-step onboarding; profile summary; wire to Business Discovery APIs via composition/API boundary |
| **Likely affected** | `apps/web/**`, `apps/api/**` (HTTP adapter if needed), `services/business-discovery/**` (only if API gaps proven) |
| **Dependencies** | Phase 1 shell; BD engine |
| **Risks** | In-memory reset confusion; tenancy inconsistency (BD) |
| **Tests** | API + UI flow; idempotent profile create; plain-language copy review |
| **Acceptance** | Profile created and shown on Home; no SEO audit spam |
| **Exclusions** | Enrichment theatre; Ask |
| **Complexity** | Medium |

---

## Phase 3 — Minimal Home and Ask SEO AutoPilot interface

| Field | Content |
| --- | --- |
| **Objective** | Complete Minimal Home; prepare Ask **only when Volume 3 is unlocked** |
| **Customer outcome** | Clear “where I am / what next”; later, conversational front door |
| **Deliverables** | Home with profile + pillars + next steps; Ask UI shell **gated** behind unlock decision |
| **Dependencies** | Phase 2; **Volume 3 approval** for real Ask behaviour |
| **Risks** | Building chatbot theatre before orchestration exists |
| **Tests** | Home acceptance; Ask contract tests only after unlock |
| **Acceptance** | Home understandable in under one minute; Ask either absent or truly orchestrated — never faked |
| **Exclusions** | Generic LLM chatbot wrapper |
| **Complexity** | High (Ask); Low–Medium (Home alone) |

**Note:** Until Volume 3 is unlocked, Phase 3 delivers **Home only**. Ask remains a later gated sub-phase.

---

## Phase 4 — Business Health and Opportunity Queue

| Field | Content |
| --- | --- |
| **Objective** | Top-three prioritised opportunities in plain English |
| **Customer outcome** | “I know the few things that matter most” |
| **Deliverables** | Health overview (non-fearful); Opportunity Queue max 3; what/why/next |
| **Dependencies** | Assessment/Opportunity product rules (Bible volumes TBD); engines beyond stubs |
| **Risks** | Scoring without evidence; issue floods |
| **Complexity** | High |

---

## Phase 5 — Learning Centre and FAQ

| Field | Content |
| --- | --- |
| **Objective** | Comprehensive plain-English education |
| **Customer outcome** | Confidence without shame or guarantees |
| **Deliverables** | FAQ articles listed in product planning; SEO vs Ads guidance; “how long / what we do / approvals” |
| **Dependencies** | Phase 1 shell (can start content early in Phase 1–2) |
| **Risks** | Over-promising timescales |
| **Complexity** | Low–Medium |

*MVP includes a curated subset; Phase 5 expands to the full topic list.*

---

## Phase 6 — Progress updates and Growth Timeline

| Field | Content |
| --- | --- |
| **Objective** | Reassure with steady progress narrative |
| **Customer outcome** | Weekly/monthly plain-English updates; timeline of work |
| **Dependencies** | Work logging model; copy system; possibly more engines |
| **Complexity** | Medium–High |

---

## Phase 7 — Google data connections

| Field | Content |
| --- | --- |
| **Objective** | Read-only GSC / GA / GBP connections with clear consent |
| **Customer outcome** | “Connected sources” explained in plain English |
| **Dependencies** | OAuth app, scopes, auth package, durable token storage, compliance |
| **Risks** | Fake “connected” states; scope creep |
| **Complexity** | High |
| **Exclusions** | Ads management |

---

## Phase 8 — Google Ads optional capability

| Field | Content |
| --- | --- |
| **Objective** | Optional connection + read-only reporting + guidance |
| **Customer outcome** | Balanced SEO vs paid advice; never “bigger budget is always better” |
| **Dependencies** | Phase 7 patterns; Ads API access; compliance |
| **Complexity** | High |
| **Exclusions** | Full campaign management until explicitly approved |

---

## Phase 9 — Real customer testing and refinement

| Field | Content |
| --- | --- |
| **Objective** | Validate adviser tone, onboarding friction, Home clarity |
| **Customer outcome** | Product refined from real owner feedback |
| **Deliverables** | Test protocol; copy fixes; accessibility pass; mobile/desktop validation |
| **Complexity** | Medium |

---

## Sequencing principle

```text
Phase 0 (docs) → Phase 1 (shell) → Phase 2 (profile)
      → Phase 5 content can overlap early
      → Phase 3 Home (Ask gated)
      → Phases 4, 6 when intelligence volumes exist
      → Phases 7–8 when Google infra exists
      → Phase 9 continuously after Phase 2
```

Do not run Phases 4, 7, or Ask implementation in parallel with Phase 1–2 until their blockers clear.
