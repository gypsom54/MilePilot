# RankAura Screen Lock Status

**Owner:** Jonathan  
**Rule:** No approved screen may be visually redesigned or materially altered without explicit written approval from the product owner.

Screenshot authority: `docs/ui-reference/` + `docs/UI_BIBLE.md`  
Growth Plan authority: `docs/GROWTH_PLAN_SPEC.md`  
Workspace authority: `docs/WORKSPACE_SPEC.md`  
Phase 3/4 implementation: `rankaura-web/app/growth-plan/` · `rankaura-web/app/workspace/`

---

## Locked screens (screenshot-backed)

| # | Screen | Route | Primary components | Status |
|---|--------|-------|--------------------|--------|
| 1 | Welcome | `/onboarding` (`welcome`) | `OnboardingWelcome`, `OnboardingFlow` | **APPROVED — VISUALLY LOCKED** |
| 1b | Customer name | `/onboarding` (`name`) | `OnboardingFlow`, `OnboardingShell`, `OnboardingInput` | **IMPLEMENTED — personalisation lock** |
| 1c | Nice to meet you | `/onboarding` (`nice-to-meet-you`) | `OnboardingFlow` | **IMPLEMENTED — one-time name use** |
| 2 | Website | `/onboarding` (`website`) | `OnboardingFlow`, `OnboardingShell`, `OnboardingInput`, `OnboardingPrimaryButton` | **APPROVED — VISUALLY LOCKED** (neutral placeholders) |
| 3 | Business name | `/onboarding` (`business-name`) | `OnboardingFlow`, `OnboardingShell`, `OnboardingInput`, `OnboardingPrimaryButton` | **APPROVED — VISUALLY LOCKED** (neutral placeholders) |
| 4 | Business description | `/onboarding` (`business-description`) | `OnboardingFlow`, `OnboardingShell`, `OnboardingTextarea`, `OnboardingPrimaryButton` | **APPROVED — VISUALLY LOCKED** (neutral placeholders) |
| 5 | Analysis / Setup | `/onboarding` (`analysis`) | `OnboardingFlow` (`AnalysisStep`), `OnboardingAnalysis`, `OnboardingShell` | **APPROVED — VISUALLY LOCKED** → Growth Plan |

---

## Growth Plan / Launch Plan (Phase 3 — awaiting visual approval)

| # | Screen | Route | Spec / impl | Status |
|---|--------|-------|-------------|--------|
| 6a | Growth Plan (existing) | `/growth-plan?site=existing` | Spec + `rankaura-web` | **IMPLEMENTED — AWAITING SCREENSHOT APPROVAL** |
| 6b | Launch Plan (new) | `/growth-plan?site=new` | Spec + `rankaura-web` | **IMPLEMENTED — AWAITING SCREENSHOT APPROVAL** |
| 7 | Main Workspace | `/workspace` | `docs/WORKSPACE_SPEC.md` + `rankaura-web` | **FINAL POLISH — AWAITING REVIEW** |

### Phase 4 Workspace screenshots (final polish)

| File | Contents |
|------|----------|
| `docs/ui-reference/workspace/01-workspace-desktop.png` | Full Workspace — desktop |
| `docs/ui-reference/workspace/02-workspace-mobile.png` | Full Workspace — mobile |
| `docs/ui-reference/workspace/03-biggest-opportunity-viewport.png` | Refined Biggest Opportunity |
| `docs/ui-reference/workspace/04-recent-wins-viewport.png` | Recent Wins |
| `docs/ui-reference/workspace/05-since-last-visit-viewport.png` | Since Your Last Visit |
| `docs/ui-reference/workspace/06-growth-areas-viewport.png` | Growth Areas |
| `docs/ui-reference/workspace/07-recent-progress-viewport.png` | Recent Progress timeline |

### Phase 3 screenshot set

| File | Contents |
|------|----------|
| `docs/ui-reference/growth-plan/07-growth-plan-existing-desktop.png` | Existing-site Growth Plan — desktop |
| `docs/ui-reference/growth-plan/08-launch-plan-new-desktop.png` | Brand-new-site Launch Plan — desktop |
| `docs/ui-reference/growth-plan/09-growth-plan-existing-mobile.png` | Existing-site Growth Plan — mobile |
| `docs/ui-reference/growth-plan/10-launch-plan-new-mobile.png` | Brand-new-site Launch Plan — mobile |
| `docs/ui-reference/growth-plan/11-categories-collapsed.png` | Collapsed category system (full page) |
| `docs/ui-reference/growth-plan/11b-featured-categories-collapsed-viewport.png` | Featured categories viewport |
| `docs/ui-reference/growth-plan/12-category-expanded-reddit.png` | Reddit & Community Research expanded |
| `docs/ui-reference/growth-plan/12b-reddit-expanded-viewport.png` | Reddit expanded viewport |
| `docs/ui-reference/growth-plan/14-key-discoveries-viewport.png` | Key Discoveries emotional highlight |

**Polish pass (2026-07-27):** Copy, Key Discoveries, human category names, status labels, and business-impact lines updated. Layout hierarchy unchanged aside from Key Discoveries after analysis confirmation.

---

## Superseded — legacy dashboard IA

| Screen | Route | Screenshot | Status |
|--------|-------|------------|--------|
| Legacy Mission dashboard | `/` | `docs/ui-reference/06-dashboard.png` | **IA SUPERSEDED** · visual DNA retained as reference only |

### Explicitly superseded (do not preserve as product IA)

- Priority Mission  
- Today’s Mission  
- Review Mission  
- Mission-based language  
- AI employee supervision framing  
- Direct Analysis → Dashboard routing  
- Existing dashboard content hierarchy  

### Still valid as visual reference only

- Spacing · typography · card softness · layout quality · controlled blue accents · calm premium light composition  

---

## Approved first-use flow (LOCKED)

1. Welcome  
2. **What should we call you?** (customer first name — used sparingly)  
3. Nice to meet you (one-time personalisation)  
4. Website URL  
5. Business Name  
6. Business Description  
7. Business and website analysis  
8. **Growth Plan OR Launch Plan**  
9. Main Workspace  

**Hard rule:** No direct Analysis → legacy dashboard route.

**Personalisation rule:** Use the customer’s first name only at key moments (nice to meet you · Growth Plan ready · future Workspace greeting). Prefer **business name** elsewhere.

Production onboarding lives at `/onboarding` in `rankaura-web` and hands off to `/growth-plan`.

---

## Not present / pending

| Screen | Classification |
|--------|----------------|
| `/` | Legacy Mission dashboard — **not** the product home; do not extend |

---

## Non-authority surfaces

| Surface | Status |
|---------|--------|
| `rankaura/` HTML SPA prototype | Not production · not a visual reference |

---

## Change control

1. Propose change with screenshot before/after.  
2. Obtain **explicit written approval** from Jonathan.  
3. Update `UI_BIBLE.md` + this register in the same change.  
4. Never “quietly” restyle locked screens.  
5. Growth Plan structure changes require updating `docs/GROWTH_PLAN_SPEC.md` before code.
