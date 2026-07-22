# Sprint 1 — Core UI Brand System

**Status:** Complete (visual infrastructure only)  
**Base version:** v8.43.67  
**Branch:** `cursor/sprint1-design-system-19bd`

---

## What was created

| Asset | Path |
|-------|------|
| Design tokens + components | `frontend/css/mp-design-system.css` |
| Dev-only component gallery | `frontend/js/design-system-preview.js` |
| Preview screen hook | `frontend/index.html` (minimal — 5 touch points) |

## Preview access (development only)

```
https://app.milepilot.uk/?ds=preview
https://app.milepilot.uk/?debug=designsystem
```

Not accessible to normal users without the URL flag. Does not replace welcome screen or alter onboarding routing.

## Design tokens

Semantic colour roles, typography roles, spacing scale, radius scale, depth presets, and motion presets — all scoped under `.mp-ds-root`.

## Components (18)

Primary, secondary, tertiary buttons · compact + card selection · text/email inputs · standard/elevated/selected cards · metric card · section heading · status badge · assistant message · user bubble · bottom sheet · modal · loading · success · empty state.

## Protected systems

No changes to tracking, AutoPilot, reports, backend, onboarding logic, or welcome splash styles.

## Rollback

```bash
git checkout rollback/pre-sprint1-design-system-v867
# or
git checkout cursor/restore-validated-flow-e91d
```
