# MP-S5-002 — Ask MilePilot Production Integration

**Specification ID:** MP-S5-002  
**Status:** Production integration complete  
**Depends on:** MP-S4 (locked visual shell), MP-044B (locked `MPTaxEngine`)

## Scope

Wire the functional Ask MilePilot stack into production `index.html` while preserving the locked MP-S4 visual design.

**Integrated:**
- `frontend/js/ask-milepilot-service.js` — intent routing, mileage queries, report actions
- `frontend/js/ask-milepilot-view.js` — view renderer (MP-S4 CSS classes only)
- `frontend/js/ask-milepilot-app.js` — app controller; UI talks only to `MPAskMilePilotService`
- Production screen `#ask` with nav tab **Ask**
- Deep link: `?view=ask`

**NOT changed:**
- `frontend/js/ask-milepilot-shell.js` — static preview scenarios (MP-S4 locked)
- `frontend/ask-milepilot-preview.html` — dev preview only
- GPS, tracking, AutoPilot, onboarding, Business Hub
- `MPTaxEngine` tax rules

## Architecture

```
index.html (production deps)
    │
    ├── buildAskDeps() ── claim, getHmrcRate, trips, shifts, apiPost
    │
    └── MPAskMilePilotService.init(deps)
              │
              ├── MileageQueryService ──► MPTaxEngine
              ├── JourneyQueryService ──► MPTaxEngine / trip-store
              └── ReportQueryService ──► MPSummaryReports / MPCustomReport
                        │
                        └── MPAskMilePilotApp.mount(true) ──► MPAskMilePilotView
```

All claim values displayed in Ask responses originate from `MPTaxEngine`. The service must not calculate `miles × rate` independently.

## Production entry

1. Bottom nav → **Ask**
2. URL → `https://app.milepilot.uk/?view=ask`
3. `bootApp()` → `initAskMilePilot()` registers production deps before first question

## Preview vs production

| Mode | Entry | Renderer |
|------|-------|----------|
| Preview | `ask-milepilot-preview.html?s=empty` | `MPAskMilePilotShell` (static) |
| Production | `index.html` → Ask tab | `MPAskMilePilotApp` + `MPAskMilePilotView` |

## Tests

```bash
npm run test:ask-milepilot
npm run test:vital
```

## Rollback

Remove Ask nav tab and `#ask` screen from `index.html`; Ask reverts to preview-only.
