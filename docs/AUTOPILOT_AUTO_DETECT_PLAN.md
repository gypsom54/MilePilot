# AutoPilot Auto-Detect — Implementation Plan

**Status:** Draft · July 2026  
**Scope:** Tracking only — reports locked, no PDF/email changes  
**Audience:** Product + engineering  
**Builds on:** MP-043 (tracking engine), MP-045 (auto-end), MP-046 (AutoPilot mode), **MP-047** (autopilot-motion.js — landed on main), field validation v8.43.31

---

## Current state on `main` (MP-047)

Substantial auto-detect work **already exists**:

| Piece | Status |
|-------|--------|
| `frontend/js/autopilot-motion.js` | State machine (ARMED → MOVING_CANDIDATE → auto-start) |
| `expo:autopilot:arm` / `disarm` | Background GPS while monitoring (not on active trip) |
| Start rule | ~10 mph sustained **2 min**, confidence ≥ 0.72 |
| Unit tests | `tests/autopilot-motion.test.js` |
| Docs | `docs/AUTOPILOT_MOTION.md` |

**Remaining gap for “never open the app”:** `tryAutoStart()` calls `startShiftCommandCentre()` in the **WebView**. When the app is killed or WebView is suspended, the state machine cannot fire. Phase 1 of this plan moves trip start to **native** (`startNativeTrip`) when driving is confirmed — same thresholds, native orchestrator.

See also: `docs/AUTOPILOT_MOTION.md` for MP-047 settings keys and debug screen.

---

## Executive summary

MilePilot **already records reliably** once a shift is started: background GPS, lock screen, calls, and media all work in TestFlight. The next milestone is **true AutoPilot** — detecting driving and starting a trip **without opening the app**.

| Capability | Today | Target |
|------------|-------|--------|
| Manual shift start | ✅ Shipped | Keep |
| Background GPS during shift | ✅ Field-validated | Keep |
| 90 min idle auto-end | ✅ Shipped | Refine (walking bug) |
| Auto-start when user drives | ❌ Not built | **This plan** |
| PWA / browser auto-detect | ❌ Not possible | Out of scope |

**Feasibility:** Achievable on **native iOS + Android** (EAS / TestFlight). Not achievable in Safari PWA.

**Recommended delivery:** Three phases — (0) idle fix, (1) driving classifier + auto-start, (2) polish + false-positive handling.

---

## Problem statement

### What users expect (NO-HARDWARE-PHILOSOPHY)

1. Install MilePilot  
2. Grant permissions once  
3. Turn on AutoPilot  
4. Drive — **never open the app**

### What the engine does today

1. User taps **Start Shift** (app must be opened at least once per trip)  
2. Native + web engines record in background  
3. 90 min idle auto-end fires when movement stops  

### Field issue to fix first

**Walking resets the 90-minute idle timer** even when not driving. Soft threshold is 22 m @ ≥1.0 m/s (~3.6 km/h) — normal walking qualifies. Native layer is worse: when GPS speed is `null`, movement distance alone can reset the deadline.

This explains why auto-end email may not arrive after parking: a walk to the shop resets the clock.

---

## Design principles

1. **Native orchestration** — auto-detect logic lives in `src/`, not `frontend/index.html` WebView JS (WebView suspends in background).  
2. **Escalate GPS cost** — low-power activity monitoring → full `BestForNavigation` only when driving is likely.  
3. **Speed + activity, never activity alone** — automotive motion + sustained speed before crediting miles or resetting idle.  
4. **User trust** — local notification on auto-start; easy undo; no silent multi-hour trips from false positives.  
5. **Protect MP-043** — extend native engine; do not rewrite web mileage math without contract sign-off.  
6. **AutoPilot mode only** — `mp_tracking_mode === 'autopilot'` + active subscription. Manual mode unchanged.

---

## Architecture

### Current (manual start)

```
User tap Start → startShiftCommandCentre() [WebView]
              → syncNativeTripStart() → expo:trip:start
              → startNativeTrip() + startBackgroundLocationUpdates()
              → locationTask → nativeTrackingEngine.ingestNativeLocation()
```

### Target (auto-detect)

```
OS activity / significant location wake
        ↓
nativeDriveDetector.js  (NEW)
        ↓  confidence: DRIVING
nativeAutoStart.js      (NEW)
        ↓
startNativeTrip() + startBackgroundLocationUpdates()
        ↓
local notification: "Trip recording started"
        ↓
On app open → WebView merges native trip into shift state + mp_trips
```

### New modules (proposed)

| File | Role |
|------|------|
| `src/nativeDriveDetector.js` | Activity + speed state machine; emits `driving` / `stationary` / `walking` |
| `src/nativeAutoStart.js` | Arms detector when AutoPilot on; starts trip when rules pass |
| `src/nativeIdlePolicy.js` | Shared idle thresholds — driving vs walking (fixes current bug) |
| `src/activityTask.js` | Optional TaskManager hook for Android activity updates |

### Bridge extensions (`expoLocationBridge.js`)

| Message | Direction | Purpose |
|---------|-----------|---------|
| `expo:autodetect:arm` | Web → Native | Enable monitoring after onboarding / settings |
| `expo:autodetect:disarm` | Web → Native | Manual mode or user opt-out |
| `expo:autodetect:status` | Native → Web | Detector state for settings/debug |
| `expo:trip:auto-started` | Native → Web | Merge auto trip on resume |

---

## Phase 0 — Idle policy fix (prerequisite)

**Goal:** Walking after parking must not reset the 90-minute driving idle timer.

### Changes

| Layer | Current | Proposed |
|-------|---------|----------|
| Web `shouldResetAutoEndIdle` | Soft: 22 m @ 1.0 m/s | **Driving only:** ≥40 m @ ≥1.8 m/s, or automotive activity flag |
| `nativeAutoEnd.js` | Soft move; speed null = pass | **Require speed ≥1.8 m/s** OR `activity === automotive` |
| Mile grace | 20 min after last mile | Keep — but grace reset also requires driving signal |

### New constants (`nativeIdlePolicy.js`)

```javascript
export const IDLE = {
  INACTIVITY_MS: 90 * 60 * 1000,
  DRIVING_MIN_SPEED_MPS: 1.8,      // ~6.5 km/h — above fast walk
  DRIVING_MIN_MOVE_M: 40,
  WALKING_MAX_SPEED_MPS: 1.5,      // never reset idle below this
  MILE_GRACE_MS: 20 * 60 * 1000,
};
```

### Acceptance

- [ ] Park car → walk 500 m → 90 min timer **does not** reset  
- [ ] Slow traffic creep **does** reset (speed 1.8+ m/s)  
- [ ] Existing background/lock-screen tests still pass (`npm run test:vital`)

**Risk:** Low. Isolated threshold change + regression tests.

---

## Phase 1 — Driving detector + auto-start (core)

**Goal:** User drives without opening app → trip starts within ~60 s, background GPS arms.

### 1A — iOS

| API | Use |
|-----|-----|
| `CMMotionActivityManager` | `automotive` / `walking` / `stationary` transitions |
| `CLLocationManager` significant-change | Low-power wake when cell tower changes |
| `CLLocationManager` standard updates | Escalate when `automotive` + speed check passes |
| Already have | `UIBackgroundModes: location`, `NSMotionUsageDescription` |

**Expo path:** Config plugin or thin native module wrapping Core Motion. `expo-location` alone is insufficient for activity — evaluate:

- `react-native-motion-activity` / custom Expo module  
- Or `@react-native-community/push-notification-ios` pattern for native Swift bridge

**Auto-start rule (iOS):**

```
IF activity == automotive (confidence ≥ medium)
AND speed ≥ 4 m/s (~14 km/h) for ≥ 30 s consecutive GPS samples
AND mp_tracking_mode == autopilot
AND subscription active
AND no active trip
THEN startNativeTrip() + startBackgroundLocationUpdates()
```

30 s + 14 km/h filters passenger in slow traffic / parking-lot shuffles.

### 1B — Android

| API | Use |
|-----|-----|
| `ActivityRecognitionClient` | `IN_VEHICLE` transitions |
| `FusedLocationProvider` | Speed validation (already via expo-location) |
| Foreground service | Already in `locationTask.js` during active trip |

**Permission:** `ACTIVITY_RECOGNITION` declared in `app.config.js` — add runtime request in onboarding.

**Auto-start rule (Android):**

```
IF activity == IN_VEHICLE
AND speed ≥ 4 m/s for ≥ 20 s
AND autopilot + subscribed + no active trip
THEN startNativeTrip() + foreground service
```

Android activity recognition is generally more responsive than iOS; 20 s window is acceptable.

### 1C — State machine (`nativeDriveDetector.js`)

```
States: OFF | MONITORING | CANDIDATE | DRIVING | ENDING

OFF          → user not on AutoPilot or permissions missing
MONITORING   → low-power activity listener armed
CANDIDATE    → automotive signal + speed rising
DRIVING       → trip active, full GPS
ENDING       → stationary + speed < 0.9 m/s for 90 s → prepare auto-end path
```

Transitions logged to `milepilot_tracking_debug.json` for field support.

### 1D — Auto-start orchestrator (`nativeAutoStart.js`)

On `DRIVING` confirmed:

1. `startNativeTrip({ shiftId, startedAt, vehicle: 'car', autoStarted: true })`  
2. `startBackgroundLocationUpdates()` (existing `locationTask.js`)  
3. Schedule local notification (see UX below)  
4. Persist `autoStarted: true` flag for review UI  
5. Queue `expo:trip:auto-started` for next WebView resume  

On WebView resume (`MilePilotWebView.js`):

- If native trip active and web `ccState !== 'active'` → call `applyNativeTripSync()` / hydrate shift UI  
- User sees trip already recording — no duplicate start  

### Acceptance

- [ ] Drive from cold app (never opened) → trip starts, miles accumulate locked screen  
- [ ] Walk to car in car park → trip does **not** start until speed threshold  
- [ ] Manual mode → detector disarmed, no auto-start  
- [ ] Passenger in taxi → ideally no start below speed threshold; document known edge case  

---

## Phase 2 — Auto-stop + polish

**Goal:** End trips cleanly without user action; reduce false positives.

### Auto-stop signals (priority order)

1. **90 min idle** (existing) — with Phase 0 walking fix  
2. **Activity → stationary** for 5 min + speed < 0.9 m/s + no mile credited in 10 min  
3. **Geofence home** (optional v2) — if user saved home location, end trip on arrival  

### False-positive handling

| Scenario | Mitigation |
|----------|------------|
| Passenger in car | Speed often low in city; 14 km/h gate helps; notification + "Not my trip?" undo |
| Train / bus | Sustained high speed without automotive activity → do not start |
| Phone on desk shaking | Activity ≠ automotive; no start |
| Short drive < 0.3 mi | Mark `pending_review`; MIE prompt on open |

### Undo flow

Notification action: **"Stop recording"** → `endNativeTrip()` within 5 min of auto-start.

---

## Notification UX

### Auto-start (required)

```
Title:  MilePilot — Trip started
Body:   Business mileage is now recording.
Actions: [View] [Stop recording]
```

- Category: `MILEPILOT_TRIP_AUTO`  
- Sound: subtle default  
- Do not spam: max 1 auto-start notification per 30 min  

### Auto-end (existing — verify)

```
Title:  Trip ended automatically
Body:   Tap to review your journey.
```

### Permission onboarding copy (iOS Always)

> MilePilot uses your location in the background to record business journeys automatically when you drive — even if the app is closed. You can switch to Manual mode anytime in Settings.

Align with App Store review expectations.

---

## Threshold reference

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Auto-start min speed | 4.0 m/s (14.4 km/h) | Above walk; below typical urban drive |
| Auto-start confirm window | 20–30 s | Reduces parking-lot false starts |
| Idle reset min speed | 1.8 m/s | Driving creep, not walking |
| Idle reset min distance | 40 m | Matches existing hard threshold |
| Walking max speed (no reset) | 1.5 m/s | ~5.4 km/h |
| Stationary speed | 0.9 m/s | Existing `STOP_SPEED_MPS` |
| Auto-end idle | 90 min | Existing product rule |
| Min trip miles (review) | 0.3 mi | Avoid cluttering trip list |

All thresholds in one file (`nativeIdlePolicy.js`) for field tuning via debug build.

---

## WebView sync (no app open → data on open)

### Storage

Native trip already persists to `milepilot_native_trip.json`. Extend payload:

```json
{
  "autoStarted": true,
  "detectorState": "DRIVING",
  "startReason": "activity+speed"
}
```

### On app resume

1. `expo:trip:sync:request` (existing)  
2. If `autoStarted` and web shift inactive → hydrate `startShiftCommandCentre` state **without** resetting miles  
3. `MPTrips.save()` on end — existing pipeline  
4. Reports unchanged — same `analyseReport` path  

### Day-off / pause

Respect `mp_day_off` — detector disarmed for that calendar day.

---

## Test matrix (device-required)

CI covers contracts; auto-detect **must** be field-tested.

| # | Scenario | Platform | Pass criteria |
|---|----------|----------|---------------|
| 1 | Cold start drive 10 min, app never opened | iOS TF | Trip in native JSON; miles > 0; notification shown |
| 2 | Same | Android | Same |
| 3 | Park → walk 15 min | Both | Trip stays open; idle timer **not** reset (Phase 0) |
| 4 | Park → 95 min | Both | Auto-end fires; notification |
| 5 | Lock screen + Spotify 20 min | iOS | Miles increase |
| 6 | Incoming call 5 min | Both | No crash; GPS continues |
| 7 | Manual mode | Both | No auto-start |
| 8 | Passenger taxi city | Both | Prefer no start; document if starts |
| 9 | Train 30 min | Both | No start |
| 10 | Open app mid-trip | Both | UI shows active shift; miles match native |
| 11 | Battery saver on | Android OEM | Document behaviour |
| 12 | Permission revoked mid-trip | Both | Graceful degrade + user prompt |

Add `tests/auto-detect-contract.test.js` for state machine unit tests (mocked activity events).

---

## Platform constraints (honest)

### iOS

- **Always location** required — already documented in `NATIVE_TESTFLIGHT.md`  
- App Review will scrutinise background location — justify with auto mileage for self-employed  
- WebView JS **cannot** run auto-detect — native only  
- iOS may throttle GPS — existing `evaluateNativeSyncHealth` + handoff remains  
- Tunnels / poor GPS — trips may under-record; acceptable v1 limitation  

### Android

- Foreground service during trip — already implemented  
- OEM battery killers (Xiaomi, Huawei) — may need "disable battery optimisation" help article  
- Activity Recognition permission — separate runtime prompt on Android 10+  

### PWA / browser

**Do not promise auto-detect.** Manual start only. Settings copy should say: "Automatic trip detection requires the MilePilot app."

---

## Files to touch (tracking only)

| File | Change |
|------|--------|
| `src/nativeDriveDetector.js` | **New** |
| `src/nativeAutoStart.js` | **New** |
| `src/nativeIdlePolicy.js` | **New** |
| `src/nativeAutoEnd.js` | Phase 0 threshold fix |
| `src/nativeTrackingEngine.js` | `autoStarted` flag |
| `src/expoLocationBridge.js` | New messages |
| `src/MilePilotWebView.js` | Resume merge for auto trips |
| `src/locationTask.js` | Arm detector on boot if AutoPilot |
| `frontend/index.html` | Hydrate auto trip on sync only — minimal diff |
| `frontend/js/tracking-mode.js` | Arm/disarm detector on mode change |
| `frontend/js/trip-auto-end.js` | Phase 0 idle policy import |
| `app.config.js` | Motion plugin if needed |
| `scripts/tracking-contract.json` | New exports + patterns |
| `tests/auto-detect-contract.test.js` | **New** |
| `docs/NATIVE_TESTFLIGHT.md` | New test cases |

**Do not touch:** `backend/reporting/**`, email templates, PDF components.

---

## Contract / version bump

| ID | Version | Change |
|----|---------|--------|
| MP-043 | v4 | Auto-detect native orchestration |
| MP-047 | v1 | **New** — Auto-detect contract |

Run before merge:

```bash
npm run test:vital
node scripts/verify-tracking-contract.js
# + device matrix above
```

---

## Risks and mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| False auto-starts | User trust | Speed gate + notification undo |
| App Store rejection | Launch delay | Pre-review notes; Manual mode; clear privacy |
| Battery drain | 1-star reviews | Activity-gated GPS escalation |
| Native module complexity | Schedule | Phase 0 first; Phase 1 iOS then Android |
| Web/native state desync | Lost miles | Native authoritative (existing pattern) |

---

## Recommended build order

```
Week A — Phase 0
  ├── nativeIdlePolicy.js
  ├── Fix web + native idle reset
  ├── Field test: park + walk (your exact bug)
  └── Ship TestFlight

Week B — Phase 1 iOS
  ├── Core Motion bridge
  ├── nativeDriveDetector + nativeAutoStart
  ├── Notification + WebView merge
  └── Field test: cold start drive

Week C — Phase 1 Android
  ├── Activity Recognition
  ├── Parity with iOS rules
  └── OEM battery testing

Week D — Phase 2
  ├── Undo flow
  ├── Auto-stop refinement
  ├── Onboarding copy + settings status
  └── Production release candidate
```

*(Calendar estimates omitted — use device test gates between phases.)*

---

## Success criteria

Auto-detect is **done** when:

1. A TestFlight user can drive a real business journey **without opening MilePilot** and see a complete trip on next open.  
2. Walking after parking does **not** prevent auto-end.  
3. Manual mode users are unaffected.  
4. `npm run test:vital` passes.  
5. Reports still generate identically — no reporting code changed.

---

## Out of scope (v1)

- Bluetooth / OBD / beacons (NO-HARDWARE-PHILOSOPHY)  
- PWA auto-detect  
- AI route prediction / learned departure times (intelligence-recommendations.js stubs)  
- Geofence home auto-end (Phase 2 optional)  
- Report or email changes  

---

## References

- `docs/NO-HARDWARE-PHILOSOPHY.md` — product vision  
- `docs/TRACKING_MODES.md` — AutoPilot vs Manual  
- `docs/TRACKING_BACKGROUND_VITAL_LOCK.md` — locked handoff behaviour  
- `docs/AUTO_END_TRIP.md` — idle semantics  
- `docs/NATIVE_TESTFLIGHT.md` — device checklist  
- `src/nativeTrackingEngine.js` — authoritative native mileage  
- `src/nativeAutoEnd.js` — native idle watchdog  

---

**Next step:** Approve Phase 0 (idle fix) for immediate TestFlight build, then greenlight native activity module spike for iOS.
