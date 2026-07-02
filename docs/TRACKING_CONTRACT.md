# MilePilot Tracking Contract (MP-043)

## BUSINESS CRITICAL — DO NOT MODIFY WITHOUT SIGN-OFF

**Without background GPS mileage recording, MilePilot has no business.**

This code is marked `VITAL` in the codebase, protected by CI, CODEOWNERS, and Cursor agent rules.  
Validated working: foreground, background, and locked-screen recording (**v8.43.31** — field drive, July 2026).

---

## Protected files

| File | Role |
|------|------|
| `frontend/index.html` | Tracking engine (GPS, miles, shift state) |
| `frontend/js/native-platform.js` | Native vs PWA detection |
| `frontend/js/tracking-provider.js` | TestFlight GPS bridge |
| `src/locationTask.js` | iOS background location task |
| `src/expoLocationBridge.js` | Native → WebView GPS bridge |
| `src/MilePilotWebView.js` | TestFlight WebView shell |
| `scripts/tracking-contract.json` | Machine-readable contract |
| `scripts/verify-tracking-contract.js` | CI verifier |

Mirrored in `milepilot-upload-v2/` for Cloudflare deploys.

---

## What must never be removed

| Capability | Implementation |
|------------|----------------|
| Vital marker | `VITAL_TRACKING_SYSTEM='MP-043-v2'` |
| High-accuracy shift GPS | `GEO_OPTS_TRACKING` with `enableHighAccuracy: true` |
| Foreground reconnect | `enableTrackingGps(false)` on `visibilitychange` → visible |
| Background polling | `startBackgroundGpsPoll()` every `BG_GPS_POLL_MS` (12s) |
| Stale GPS recovery | `checkGpsStale()` + `scheduleGpsReconnect()` |
| Motion nudge | `bindMotionGpsNudge()` via `devicemotion` |
| Weak-signal recording | `ACC_SOFT_MAX: 220` |
| Native speed gate | `nativeGps` + `movementSpeedMps()` |
| TestFlight bridge | `MPTrackingProvider` + `expo:tracking:start` |
| Background buffer | `pendingBackgroundLocations` in `locationTask.js` |
| Engine version | `TRACKING_ENGINE_V >= 2` |

---

## Automated protection (6 layers)

1. **CI guard** — `.github/workflows/production-guard.yml` runs contract verifiers + regression tests on every PR
2. **Path guard** — `.github/workflows/tracking-guard.yml` fails PRs that break the tracking contract
3. **Build guard** — `build-upload.sh` won't zip unless verifier passes
4. **Runtime guard** — `assertTrackingResilience()` errors at app boot if functions missing
5. **CODEOWNERS** — `.github/CODEOWNERS` requires review on protected paths
6. **Cursor rule** — `.cursor/rules/vital-gps-tracking.mdc` instructs agents not to touch this code

**Related:** `docs/CRITICAL_FILES.md` · `docs/PRODUCTION_MONITORING_PLAN.md` · `docs/BRANCH_PROTECTION.md` · `npm run test:vital`

---

## Before changing tracking code

1. Get explicit product sign-off — this is not a refactor target
2. Read this document and `docs/NATIVE_TESTFLIGHT.md`
3. Run `node scripts/verify-tracking-contract.js`
4. Test on a real device: foreground, background, locked screen
5. Bump `TRACKING_ENGINE_V` and update `tracking-contract.json` if behaviour changes

---

## History

| Version | Date | Change |
|---------|------|--------|
| MP-043 v3 | 2026-07-02 | Background/locked handoff + web fallback — **field-validated v8.43.31** — see `TRACKING_BACKGROUND_VITAL_LOCK.md` |
| MP-043 v2 | 2026-06-30 | Native TestFlight bridge + vital protection markers |
| MP-043 v1 | 2026-06-30 | PWA background GPS restored after consolidation regression |

---

## iOS note

PWAs have platform limits. TestFlight with **Always** location uses `expo-task-manager` for true background GPS.
