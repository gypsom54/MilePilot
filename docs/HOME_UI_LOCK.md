# Home Dashboard UI Lock (MP-HOME-UI-2)

## DO NOT MODIFY WITHOUT SIGN-OFF

Field-validated **July 2026** — calm Auto Track / Manual Track cards; technical diagnostics on AutoPilot Status page.

This section is protected by CI (`scripts/verify-home-ui-contract.js`) and must not be changed casually.

## Protected elements

| Element | Purpose |
|---------|---------|
| `ccAutoCard` / `ccManualCard` | Identical-structure track cards on home |
| `cc-choice-sub` / `cc-choice-desc` | Subtitle + one-line description per card |
| `cc-choice-badge` | Status badge (Ready / Tracking / Permission Needed) |
| `ccModeBadge` | "AutoPilot active" badge on today summary |
| `ccManualBanner` | Manual mode warning + link to Settings |
| `#autopilotStatus` | AutoPilot Status page — GPS, timers, engine diagnostics |
| `renderHomeTrackingModeUI()` | Mode badge, banner, calm home status line |
| `renderHomeModeCards()` | Card active state + status badges |
| `renderAutopilotStatusPage()` | Technical diagnostics (not on home) |

## Home must NOT show

- GPS confidence, motion thresholds, detection timers on idle home
- `homeOpenDebugBtn` on home (debug entry lives on AutoPilot Status when `mp_debug=1`)

## Marker

`VITAL_HOME_UI_LOCK='MP-HOME-UI-2'` in `frontend/index.html` — do not remove.

## Related (separate lock)

Background/locked mileage: **MP-043** (`docs/TRACKING_CONTRACT.md`).

Closed-app AutoPilot trip start: native shell (`src/nativeAutopilot.js`) — requires TestFlight rebuild.
