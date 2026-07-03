# Background & Locked-Screen Mileage — VITAL LOCK

**Status:** 🔒 **FROZEN** — Part of Core Tracking Engine v1.0 LOCKED  
**Version locked:** v8.43.31  
**Contract:** MP-043 v3 (`scripts/tracking-contract.json`)  
**Manifest:** [CORE_TRACKING_ENGINE_V1_LOCKED.md](./CORE_TRACKING_ENGINE_V1_LOCKED.md)

> **Do not edit.** This code path was validated on a real drive (foreground + locked screen + background). Treat it like a newborn — CI will fail if these symbols are removed.

---

## What this protects

The dual-engine handoff that makes background/locked mileage work on TestFlight:

| Layer | Role |
| --- | --- |
| Native engine | Records GPS when WebView is suspended (`src/nativeTrackingEngine.js`) |
| Web handoff | `handoffToNativeEngine()` passes full shift state + last GPS point on lock |
| Odometer merge | `applyNativeTripSync()` merges miles **and** `pendingMeters` |
| Fallback | `nativeBgFallbackActive` + `startBackgroundGpsPoll()` when native BG stalls |
| Resume | `burstNativeTripSync()` — triple sync on unlock |

---

## Frozen symbols (CI-enforced)

**Functions:** `handoffToNativeEngine`, `evaluateNativeSyncHealth`, `requestNativeTripSync`, `burstNativeTripSync`, `getNativeHandoffPayload`, `nativeOdometerMeters`, `ensureNativeBgFallback`, `startNativeSyncPoll`

**State:** `nativeBgFallbackActive`, `lastNativeBgAt`, `__nativeEngineAuthoritative`

**Bridge:** `expo:native:background`, `expo:appstate`

---

## Before any change

1. Explicit user sign-off + new device drive test (foreground, locked 5+ min, Maps background 5+ min)
2. `npm run verify:tracking` && `npm run test:tracking`
3. Bump `TRACKING_ENGINE_V` and contract version
4. Update this doc with new version

---

## Known note (not a bug — do not “fix” without sign-off)

Cold GPS can take ~45 seconds to first fix on some iPhone drives. Mileage records correctly once GPS connects. Do not refactor connection logic during UI or report work.
