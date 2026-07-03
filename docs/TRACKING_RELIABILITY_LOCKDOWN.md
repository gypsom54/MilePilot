# Tracking Reliability Lockdown (MP-043)

**Status:** 🔒 **LOCKED** — Core Tracking Engine v1.0 production-ready (July 2026)

**Manifest:** [CORE_TRACKING_ENGINE_V1_LOCKED.md](./CORE_TRACKING_ENGINE_V1_LOCKED.md)

---

## Architecture audit (answers to investigation questions)

### 1. Is TestFlight using real native background location?

**Before lockdown:** Partially. Native `expo-task-manager` collected GPS, but **mileage was calculated in WebView JavaScript** (`processGpsPoint` in `index.html`). iOS suspends WebView JS when the app is backgrounded (even unlocked, e.g. using Maps).

**After lockdown (v8.41.0+):** Native `nativeTrackingEngine.js` owns GPS ingestion, distance calculation, and persistence. WebView displays synced state only.

### 2. Remote PWA or bundled?

**Remote.** TestFlight loads `https://app.milepilot.uk/?runtime=expo&v=8.41.0` via WebView (`MilePilotWebView.js`). PWA is NOT bundled in the native binary today.

**Risk:** Native shell and Cloudflare PWA must version-match. Use `npm run verify:release` before every deploy.

### 3. Does tracking continue when…

| Scenario | Native GPS collected? | Miles calculated? |
|----------|----------------------|-------------------|
| Screen locked | Yes (with Always + bg task) | Yes — native engine |
| App backgrounded (Maps open) | Yes (with Always + bg task) | Yes — native engine |
| Device idle | Yes if moving | Yes — native engine |
| WebView suspended | N/A | Native engine independent of WebView |

### 4. Always permission?

Required for background GPS on iOS. App reports `foreground-only` when only "While Using" is granted. Debug screen shows permission status.

### 5. iOS background location mode?

Configured in `app.config.js`: `UIBackgroundModes: ['location']`, `expo-location` plugin `isIosBackgroundLocationEnabled: true`.

### 6. Location updates while backgrounded?

Logged to Metro/Xcode as `[MilePilot BG GPS] location`. Debug screen shows `Last background GPS` timestamp.

### 7. Mileage calculated where?

| Runtime | Calculator |
|---------|------------|
| TestFlight / Expo native | `src/nativeTrackingEngine.js` (authoritative) |
| Browser / PWA | `frontend/index.html` `processGpsPoint` |

### 8. Trip state persisted if suspended?

Yes. Native engine writes `milepilot_native_trip.json` on every GPS update. WebView also saves `mp_active_shift` to localStorage when possible.

### 9. Background updates flushed?

On app resume, native state is injected to WebView via `expo:trip:sync`. Miles should match native stored value.

### 10. Auto-end mechanism?

Dual layer: `MPTripAutoEnd` in WebView when active; `nativeAutoEnd.js` runs from background GPS task when WebView suspended. Notification scheduled as backup.

---

## Root cause of repeated failures

1. **WebView-dependent mileage** — core product logic ran in JavaScript that iOS pauses in background
2. **Permission misreporting** — "While Using" treated as fully granted; background task never started
3. **Split deploy** — native build + Cloudflare PWA version skew
4. **No device gate** — TestFlight shipped without background drive verification
5. **No runtime visibility** — failures were silent

---

## Files in lockdown scope

| File | Role |
|------|------|
| `src/nativeTrackingEngine.js` | **NEW** — authoritative native mileage |
| `src/locationTask.js` | Background GPS → native engine |
| `src/expoLocationBridge.js` | Bridge + trip start/stop/debug |
| `src/MilePilotWebView.js` | Resume sync injection |
| `src/nativeAutoEnd.js` | Background auto-end |
| `frontend/js/tracking-provider.js` | WebView bridge |
| `frontend/js/tracking-debug.js` | **NEW** — debug screen |
| `frontend/index.html` | Tracking hooks only (no UI polish) |

---

## Tracking Debug screen

Enable access:

```javascript
localStorage.setItem('mp_debug', '1');
```

Or open app with `?debug=tracking`.

Settings → Developer debug → **Open Tracking Debug →**

Shows: version, build, permission, background active, GPS timestamps, native vs web miles, errors.

---

## Device test gate (required before TestFlight)

1. Install build on real iPhone
2. Settings → MilePilot → Location → **Always**
3. Enable debug: `localStorage.setItem('mp_debug','1')`
4. Start shift — note miles
5. Open Maps for 10+ minutes while driving
6. Return to MilePilot — miles must increase (check Tracking Debug: `Last background GPS`)
7. Lock phone 5+ minutes — unlock — miles must increase
8. End shift — miles in history match debug screen
9. Do **not** ship if any step fails

---

## Release checklist

```bash
npm run test:vital
npm run verify:release
bash build-upload.sh
# Deploy Cloudflare zip
# Verify https://app.milepilot.uk/version.txt
npm run build:ios:production
```

---

## Production safety assessment

| Aspect | Safe? | Notes |
|--------|-------|-------|
| Native background mileage | **Improved** — needs device proof | Architecture fix landed |
| Remote PWA loading | **Fragile** | Version skew risk remains |
| Bundled PWA for TestFlight | **Recommended next** | Eliminates half the fragility |
| Automated tests | Good for math | Cannot replace device test |

**Verdict:** Core Tracking Engine v1.0 is **production-ready** after real-world validation (background, locked screen, calls, media playback). Device test gate remains required for each new native build.
