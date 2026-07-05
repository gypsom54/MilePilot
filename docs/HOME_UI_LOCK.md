# Home Dashboard UI Lock (MP-HOME-UI-1)

## DO NOT MODIFY WITHOUT SIGN-OFF

Field-validated **July 2026** — AutoPilot vs Manual home indicators, status bar, and native **Open Tracking Debug** entry.

This section is protected by CI (`scripts/verify-home-ui-contract.js`) and must not be changed casually.

## Protected elements

| Element | Purpose |
|---------|---------|
| `ccModeBadge` | "AutoPilot active" badge on home |
| `ccManualBanner` | Manual mode warning + link to Settings |
| `ccAutopilotBar` | AutoPilot watching / GPS status strip |
| `homeOpenDebugBtn` | Native **Open Tracking Debug →** on home |
| `renderHomeTrackingModeUI()` | Mode badge, banner, manual override button styling |
| `renderHomeDebugButton()` | Shows debug button on native + AutoPilot idle |

## Marker

`VITAL_HOME_UI_LOCK='MP-HOME-UI-1'` in `frontend/index.html` — do not remove.

## Related (separate lock)

Background/locked mileage: **MP-043** (`docs/TRACKING_CONTRACT.md`).

Closed-app AutoPilot trip start: native shell (`src/nativeAutopilot.js`) — requires TestFlight rebuild.
