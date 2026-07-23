# AutoPilot Native Engine Lock (MP-HF-008)

**Status:** 🔒 PROPOSED — pending field verification of commit `9b91907`  
**Protected commit:** `9b91907fef6146d20aa905099782bac7deaed254`  
**APP_VERSION:** `8.43.63` · **iOS buildNumber:** `15`  
**Label:** RECOVERED NATIVE AUTOPILOT CANDIDATE — FIELD TEST REQUIRED

> Do not merge historical UI wholesale. Surgical native restoration only after field PASS.

---

## Protected files

| File | Role |
|------|------|
| `src/nativeAutopilot.js` | Native closed-app motion FSM, arming persistence, trip auto-start |
| `src/locationTask.js` | BG task; `hydrateNativeAutopilot` + `onAutopilotBackgroundLocation` |
| `src/expoLocationBridge.js` | `expo:autopilot:arm`, `initNativeTracking`, bridge handlers |
| `src/MilePilotWebView.js` | Cold-start re-arm, lock-screen BG ensure |
| `src/nativeTrackingEngine.js` | Native trip persistence |
| `src/nativeAutoEnd.js` | 90-minute native idle auto-end |
| `index.js` | **Must** `import './src/locationTask'` before app mount |
| `frontend/js/autopilot-motion.js` | JS FSM; calls `armNative` → `expo:autopilot:arm` |
| `frontend/js/trip-auto-end.js` | Web idle policy (90 min) |
| `frontend/index.html` | `ensureAutopilotArmed`, `finishOnboarding`, reconciliation |
| `scripts/tracking-contract.json` | CI companion file list |

## Protected functions (native)

| Function | File |
|----------|------|
| `hydrateNativeAutopilot` | `nativeAutopilot.js` |
| `setNativeAutopilotArmed` | `nativeAutopilot.js` |
| `onAutopilotBackgroundLocation` | `nativeAutopilot.js` |
| `ensureAutopilotBackgroundLocation` | `nativeAutopilot.js` |
| `loadNativeAutopilotState` | `nativeAutopilot.js` |
| `initNativeTracking` | `expoLocationBridge.js` |
| `startNativeTrip` | `nativeTrackingEngine.js` |

## Protected functions (JavaScript)

| Function | File |
|----------|------|
| `ensureAutopilotArmed` | `index.html` |
| `finishOnboarding` | `index.html` |
| `applyNativeTripSync` | `index.html` |
| `restoreNativeTripIfNeeded` | `index.html` |
| `restoreNativeTripFromSync` | `index.html` |
| `handoffToNativeEngine` | `index.html` |
| `bootApp` | `index.html` — `initTrackingEngine()` before `initAutoPilotMotion()` |

## Native task identifier

- `MILEPILOT_BACKGROUND_LOCATION` (`src/locationTask.js`)

## Native persistence paths

| Path | Contents |
|------|----------|
| `milepilot_native_autopilot.json` | `armed`, motion candidate state |
| `milepilot_native_trip.json` | Active native trip |
| Native auto-end state | `nativeAutoEnd.js` |

## Expected lifecycle

1. Onboarding completes → `ensureAutopilotArmed()` → `expo:autopilot:arm`
2. Native `setNativeAutopilotArmed(true)` + `ensureAutopilotBackgroundLocation()`
3. BG task receives locations → `hydrateNativeAutopilot()` → `onAutopilotBackgroundLocation()`
4. Sustained driving → `startNativeTrip()` + `syncNativeAutoEnd(90min)`
5. WebView resume → `applyNativeTripSync` / `restoreNativeTripIfNeeded`
6. Trip end → reports/email via existing JS pipeline

## Required field tests (before merge to main)

See `docs/MP-HF-008-FIELD-TEST-PROTOCOL.md` — Tests 1–7.

## Forbidden changes (without explicit approval)

- Removing `src/nativeAutopilot.js`
- Removing `hydrateNativeAutopilot` / `onAutopilotBackgroundLocation` from BG task
- Removing `setNativeAutopilotArmed` from `expo:autopilot:arm`
- Merging partial “golden” HTML restore without native files
- Replacing tracking files from branches that lack `nativeAutopilot.js`
- Changing `index.js` task registration order

## Approved change process

1. Product sign-off referencing this document
2. `npm run test:native-autopilot-guard` && `npm run test:native-autopilot` && `npm run verify:tracking`
3. Field test on real iPhone (Tests 1, 2, 5, 7 minimum)
4. Update protected commit hash in this document if intentionally superseded

## Rollback commit

If a surgical merge regresses: revert to `9b91907` native file set (hashes in `docs/MP-HF-007-RECOVERY-MANIFEST.md`).
