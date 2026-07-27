# RankAura Screen Lock Status

**Owner:** Jonathan  
**Rule:** No approved screen may be visually redesigned or materially altered without explicit written approval from the product owner.

Screenshot authority: `docs/ui-reference/` + `docs/UI_BIBLE.md`  
Growth Plan authority: `docs/GROWTH_PLAN_SPEC.md` (Phase 2 — structure/language locked; screenshots pending)

---

## Locked screens (screenshot-backed)

| # | Screen | Route | Primary components | Status |
|---|--------|-------|--------------------|--------|
| 1 | Welcome | `/onboarding` (`welcome`) | `OnboardingWelcome`, `OnboardingFlow` | **APPROVED — VISUALLY LOCKED** |
| 2 | Website | `/onboarding` (`website`) | `OnboardingFlow`, `OnboardingShell`, `OnboardingInput`, `OnboardingPrimaryButton` | **APPROVED — VISUALLY LOCKED** |
| 3 | Business name | `/onboarding` (`business-name`) | `OnboardingFlow`, `OnboardingShell`, `OnboardingInput`, `OnboardingPrimaryButton` | **APPROVED — VISUALLY LOCKED** |
| 4 | Business description | `/onboarding` (`business-description`) | `OnboardingFlow`, `OnboardingShell`, `OnboardingTextarea`, `OnboardingPrimaryButton` | **APPROVED — VISUALLY LOCKED** |
| 5 | Analysis / Setup | `/onboarding` (`analysis`) | `OnboardingFlow` (`AnalysisStep`), `OnboardingAnalysis`, `OnboardingShell` | **APPROVED — VISUALLY LOCKED** (exit route superseded — see below) |

---

## Spec-locked screens (screenshots pending)

| # | Screen | Route | Spec | Status |
|---|--------|-------|------|--------|
| 6 | Growth Plan / Launch Plan | `/growth-plan` (`?site=existing` \| `?site=new`) | `docs/GROWTH_PLAN_SPEC.md` | **SPEC LOCKED — Phase 2** · awaiting Phase 3 build + screenshot approval |
| 7 | Main Workspace | TBD after Growth Plan approval | Pending | **NOT LOCKED** — do not rebuild until Growth Plan approved |

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

- Spacing  
- Typography  
- Card softness  
- Layout quality  
- Controlled blue accents  
- Calm premium light composition  

Do **not** preserve incorrect information architecture merely because it appears in the previous approved screenshot.

### Theme note (Jonathan)

Do not automatically convert Growth Plan or Workspace to a full dark navy dashboard. Preserve the calm light workspace for the first Growth Plan implementation. Dark navy may remain in navigation, branded accents, and selective premium moments.

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

Analysis screen visuals remain locked; only the **post-analysis destination** changes (to Growth Plan / Launch Plan) once Phase 3 is approved.

---

## Not present / pending

| Screen | Classification |
|--------|----------------|
| Name (“What should we call you?”) | Not present in the current approved screenshot set |
| Historical Growth Plan Summary / Launch CTA variants | Superseded by Growth Plan / Launch Plan page |
| Growth Plan / Launch Plan screenshots | Pending Phase 3 |
| Rebuilt Workspace screenshots | Pending later phase |

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
5. Growth Plan structure changes require updating `docs/GROWTH_PLAN_SPEC.md` before code.
