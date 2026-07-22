# Sprint 1 — Core UI Brand System

**Status:** APPROVED AND LOCKED  
**Base version:** v8.43.31  
**Branch:** `cursor/sprint1-design-system-19bd`  
**Merged via:** `cursor/merge-approved-visual-shell-19bd`

---

## What was created

| Asset | Path |
|-------|------|
| Design tokens + components | `frontend/css/mp-design-system.css` |
| Dev-only component gallery | `frontend/js/design-system-preview.js` |
| Standalone preview page | `frontend/design-system-preview.html` |

## Production integration (minimal, safe)

`frontend/index.html` adds **only**:

```html
<link rel="stylesheet" href="css/mp-design-system.css">
```

- **No** preview section, script, `showScreen()` changes, or `bootApp()` branches.
- `bootApp()` and `showScreen()` remain identical to the protected golden foundation (`686d370`).
- Loading the stylesheet alone produces **zero visual changes** to current production screens (all selectors scoped under `.mp-ds-root`).

No production screen markup was redesigned. No onboarding or dashboard logic was changed.

## Preview (development only — standalone)

1. Serve `frontend/` (e.g. `npx serve frontend -p 8000`).
2. Open **`http://localhost:8000/design-system-preview.html`** only.

The production app does not load preview JavaScript or reference the gallery. The Cloudflare upload package excludes preview HTML/JS.

## Design tokens

Semantic colour roles, typography roles, spacing scale, radius scale, depth presets, and motion presets — all scoped under `.mp-ds-root`.

## Components (18)

Primary, secondary, tertiary buttons · compact + card selection · text/email inputs · standard/elevated/selected cards · metric card · section heading · status badge · assistant message · user bubble · bottom sheet · modal · loading · success · empty state.

## Deploy package

`build-upload.sh` copies shared CSS into the upload bundle and **removes** `design-system-preview.js` from `milepilot-upload-v2/js/`. Preview HTML is not included in the production ZIP.

## Protected systems

No changes to tracking, AutoPilot, reports, backend, onboarding logic, or welcome splash styles.

## Revalidation

- [x] `npm run test:vital` — all passed
- [x] `build-upload.sh` — zip created (CSS only; preview JS/HTML excluded)
- [x] Protected engine files — **unchanged** vs `686d370`
- [x] Production `index.html` — CSS link only; no preview integration

## Rollback

```bash
git checkout rollback/pre-sprint1-design-system-v867
# or
git checkout cursor/restore-validated-flow-e91d
```
