# MP-HF-002 — AutoPilot background tracking restore

## Problem

Production users on v8.43.67 reported AutoPilot auto-detect / background tracking broken:
- No dashboard AutoPilot status bar with tap-to-reconnect / Open Settings guidance
- `ensureAutopilotArmed()` and native background arming removed from `main`
- Motion detection slowed (2 min sustained vs ~10 sec golden tuning)

## Root cause

Regression on `main` after golden foundation `686d370` (v8.43.67): ~240 lines of tracking/autopilot infrastructure removed from `frontend/index.html` and `autopilot-motion.js` retuned slower.

## Fix (v8.43.68)

Restored from golden `686d370` while preserving MP-S5 Ask MilePilot + MPTaxEngine:

- Dashboard `ccAutopilotBar` with GPS/permission status and `retryAutopilotGps()`
- Always-location modal with settings polling + success state (`nativeAlwaysOpen`, `nativeAlwaysDone`)
- `ensureAutopilotArmed()`, `startAutopilotHealthWatch()`, `seedAutopilotGps()`, native bridge routing
- Native trip restore/sync (`restoreNativeTripIfNeeded`, `startShiftNativeTracking`, etc.)
- `autopilot-motion.js` fast auto-start tuning (~10 mph, ~10 sec sustained)
- Boot/onboarding/resume paths call `ensureAutopilotArmed()`

## Validation

- `test:autopilot` — 8/8
- `test:tracking` — 19/19
- `test:vital` — PASS
- `verify:release` — PASS
- `production-boot-syntax` — PASS

## Deploy note

User seeing v8.43.67 without working tracking likely had a partial deploy (design-system CSS referenced 8.43.67 while tracking code was already regressed). Deploy **8.43.68** from this hotfix branch to restore full AutoPilot stack.
