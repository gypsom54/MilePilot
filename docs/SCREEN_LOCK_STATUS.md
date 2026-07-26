# RankAura Screen Lock Status

**Owner:** Jonathan  
**Rule:** No approved screen may be visually redesigned or materially altered without explicit written approval from the product owner.

Screenshot authority: `docs/ui-reference/` + `docs/UI_BIBLE.md`

---

## Locked screens (screenshot-backed)

| # | Screen | Route | Primary components | Status |
|---|--------|-------|--------------------|--------|
| 1 | Welcome | `/onboarding` (`welcome`) | `OnboardingWelcome`, `OnboardingFlow` | **APPROVED — VISUALLY LOCKED** |
| 2 | Website | `/onboarding` (`website`) | `OnboardingFlow`, `OnboardingShell`, `OnboardingInput`, `OnboardingPrimaryButton` | **APPROVED — VISUALLY LOCKED** |
| 3 | Business name | `/onboarding` (`business-name`) | `OnboardingFlow`, `OnboardingShell`, `OnboardingInput`, `OnboardingPrimaryButton` | **APPROVED — VISUALLY LOCKED** |
| 4 | Business description | `/onboarding` (`business-description`) | `OnboardingFlow`, `OnboardingShell`, `OnboardingTextarea`, `OnboardingPrimaryButton` | **APPROVED — VISUALLY LOCKED** |
| 5 | Analysis / Setup | `/onboarding` (`analysis`) | `OnboardingFlow` (`AnalysisStep`), `OnboardingAnalysis`, `OnboardingShell` | **APPROVED — VISUALLY LOCKED** |
| 6 | Dashboard | `/` | Dashboard shell / sidebar / brief cards (see UI Bible) | **APPROVED — VISUALLY LOCKED** |

---

## Approved onboarding flow (do not change without approval)

1. Welcome  
2. Website  
3. Business Name  
4. Business Description  
5. Analysis / Setup  
6. Dashboard  

---

## Not present in the current approved screenshot set

Do **not** assume these are retired. Only Jonathan may permanently remove them.

| Screen | Classification |
|--------|----------------|
| Name | Not present in the current approved screenshot set |
| Growth Plan Summary | Not present in the current approved screenshot set |
| Launch Growth Plan | Not present in the current approved screenshot set |

---

## Non-authority surfaces

| Surface | Status |
|---------|--------|
| `rankaura/` HTML SPA prototype | Not production · not a visual reference |
| Agent-generated prototype captures under `/opt/cursor/artifacts/rankaura-onboarding/` | Discard for visual lock decisions |

---

## Change control

1. Propose change with screenshot before/after.  
2. Obtain **explicit written approval** from Jonathan.  
3. Update `UI_BIBLE.md` + this register in the same change.  
4. Never “quietly” restyle locked screens.
