# RankAura Screen Lock Status

**Owner:** Jonathan  
**Rule:** No approved screen may be visually redesigned or materially altered without explicit written approval from the product owner.

Screenshot authority: `docs/ui-reference/` + `docs/UI_BIBLE.md`  
Growth Plan authority: `docs/GROWTH_PLAN_SPEC.md`  
Phase 3 implementation: `rankaura-web/app/growth-plan/`

---

## Locked screens (screenshot-backed)

| # | Screen | Route | Primary components | Status |
|---|--------|-------|--------------------|--------|
| 1 | Welcome | `/onboarding` (`welcome`) | `OnboardingWelcome`, `OnboardingFlow` | **APPROVED — VISUALLY LOCKED** |
| 2 | Website | `/onboarding` (`website`) | `OnboardingFlow`, `OnboardingShell`, `OnboardingInput`, `OnboardingPrimaryButton` | **APPROVED — VISUALLY LOCKED** |
| 3 | Business name | `/onboarding` (`business-name`) | `OnboardingFlow`, `OnboardingShell`, `OnboardingInput`, `OnboardingPrimaryButton` | **APPROVED — VISUALLY LOCKED** |
| 4 | Business description | `/onboarding` (`business-description`) | `OnboardingFlow`, `OnboardingShell`, `OnboardingTextarea`, `OnboardingPrimaryButton` | **APPROVED — VISUALLY LOCKED** |
| 5 | Analysis / Setup | `/onboarding` (`analysis`) | `OnboardingFlow` (`AnalysisStep`), `OnboardingAnalysis`, `OnboardingShell` | **APPROVED — VISUALLY LOCKED** (exit route superseded — see flow) |

---

## Growth Plan / Launch Plan (Phase 3 — awaiting visual approval)

| # | Screen | Route | Spec / impl | Status |
|---|--------|-------|-------------|--------|
| 6a | Growth Plan (existing) | `/growth-plan?site=existing` | Spec + `rankaura-web` | **IMPLEMENTED — AWAITING SCREENSHOT APPROVAL** |
| 6b | Launch Plan (new) | `/growth-plan?site=new` | Spec + `rankaura-web` | **IMPLEMENTED — AWAITING SCREENSHOT APPROVAL** |
| 7 | Main Workspace | TBD | Pending | **NOT STARTED** — do not rebuild until Growth Plan approved |

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
2. Website URL  
3. Business Name  
4. Business Description  
5. Business and website analysis  
6. **Growth Plan OR Launch Plan**  
7. Main Workspace  

**Hard rule:** No direct Analysis → legacy dashboard route.

Production onboarding redirect to Growth Plan is **not** changed in Phase 3 (review via `/growth-plan` only). Connect after visual approval.

---

## Not present / pending

| Screen | Classification |
|--------|----------------|
| Name (“What should we call you?”) | Not present in the current approved screenshot set |
| Rebuilt Workspace | Pending after Growth Plan approval |

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
