# MP-S5-006 — Browser History and In-App Navigation State

**Specification ID:** MP-S5-006  
**Status:** BACKLOG — not started  
**Priority:** Medium (quality-of-life; not a merge blocker)  
**Identified in:** MP-S5-005 production integration audit

## Problem

Ask MilePilot (and other primary screens) use `showScreen()` without the History API. Browser back/forward may leave the app or jump to an unrelated history entry instead of the previous in-app screen.

Session restore via `sessionStorage mp_active_screen` partially addresses refresh-on-Ask but not native browser navigation.

## Goal

In-app navigation that respects browser back/forward while preserving:

- No accidental action execution on history navigation
- Pending Ask actions cleared when leaving via back
- Deep links (`?view=ask`, `?view=reports`) still work
- No impact on GPS/tracking lifecycle

## Proposed approach

1. `history.pushState({ screen: id }, '', buildUrlForScreen(id))` on each `showScreen()` for primary nav screens
2. `popstate` listener → `showScreen(state.screen)` with `fromHistory: true` flag
3. Ask `leave()` called when history navigates away from `#ask`
4. Optional: replaceState for deep-link cleanup instead of `clearDeepLink()` strip

## Out of scope

- Full URL router / SPA framework migration
- Business Hub routes (not yet in production shell)

## Acceptance criteria

- [ ] Back from Ask → previous screen (e.g. Mileage)
- [ ] Forward restores Ask without duplicating listeners or replaying actions
- [ ] Refresh on Ask still works (`mp_active_screen` or URL `?view=ask`)
- [ ] `npm run test:vital` passes
- [ ] New tests: history navigation regression suite

## Dependencies

- MP-S5-ASK-LOCK (production Ask stable)
- No changes to tracking engine or MPTaxEngine

## Estimate

Single focused sprint item — routing layer only in `frontend/index.html` + tests.
