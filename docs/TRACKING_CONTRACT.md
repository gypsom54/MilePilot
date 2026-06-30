# MilePilot Tracking Contract (MP-043)

**Status: LOCKED — business critical**

Background GPS mileage recording is MilePilot's core promise: *Never miss another business mile.*  
This contract prevents silent regressions when `index.html` is edited.

## What must never be removed

| Capability | Implementation |
|------------|----------------|
| High-accuracy shift GPS | `GEO_OPTS_TRACKING` with `enableHighAccuracy: true` |
| Foreground reconnect | `enableTrackingGps(false)` on `visibilitychange` → visible |
| Background polling | `startBackgroundGpsPoll()` every `BG_GPS_POLL_MS` (12s) |
| Stale GPS recovery | `checkGpsStale()` + `scheduleGpsReconnect()` |
| Motion nudge | `bindMotionGpsNudge()` via `devicemotion` |
| Weak-signal recording | `ACC_SOFT_MAX: 220` (record up to 220m accuracy) |
| Device speed gate | `deviceSpeedMps` from `pos.coords.speed` |
| bfcache recovery | `pageshow` handler restarts GPS |
| Engine version | `TRACKING_ENGINE_V >= 2` |

## Automated protection

1. **CI guard** — `.github/workflows/tracking-guard.yml` runs `scripts/verify-tracking-contract.js` on every PR that touches `frontend/` or `milepilot-upload-v2/`.
2. **Build guard** — `build-upload.sh` runs the verifier before creating Cloudflare zips.
3. **Runtime guard** — `assertTrackingResilience()` logs a console error at app boot if functions are missing.

## Before changing tracking code

1. Read this document.
2. Run `node scripts/verify-tracking-contract.js` locally.
3. Test on a real device:
   - Start shift → drive 2 min (app visible) → miles increase
   - Switch apps 3 min → return → miles resume
4. Bump `TRACKING_ENGINE_V` if engine behaviour changes.
5. Update `scripts/tracking-contract.json` only with explicit product approval.

## History

| Version | Date | Change |
|---------|------|--------|
| MP-043 v1 | 2026-06-30 | Restored MP-041 fixes + added contract guard after consolidation regression |

## iOS limitation

PWAs cannot get true always-on background GPS on iOS. This contract maximises capture within platform limits. Native TestFlight app required for full background location.
