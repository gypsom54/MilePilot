# MilePilot — Background GPS & Tracking Limits

**MP-014 · Beta QA reference**

---

## What works today (PWA / browser)

MilePilot v7.4.x uses the **Tracking Engine** (`js/tracking-engine.js`) with:

| Capability | Implementation |
|------------|----------------|
| Shift timer while app open | `setInterval` + `shiftStartedAt` |
| Persist active shift | `localStorage` (`mp_active_shift`) on visibility change / pagehide |
| Resume after tab switch | `restoreActiveShift()` on boot + `pageshow` |
| GPS while app foreground | `navigator.geolocation.watchPosition` |
| GPS reconnect after loss | 15s auto-retry + branded banner |
| Screen stay awake (where supported) | Wake Lock API |
| End shift → save → reports | Single engine source of truth (`mp_shifts`) |

---

## Known PWA / browser limitations

**True always-on background GPS is not available in a web app.**

Browsers may pause or throttle JavaScript when:

- The phone is **locked**
- Another app is **foreground** (Uber, Maps, Deliveroo, etc.)
- The OS applies **battery optimisation**
- iOS Safari suspends tabs aggressively

In these cases MilePilot will:

1. **Save the last known shift state** before the tab is hidden
2. **Restore timer and miles** when the user returns
3. **Attempt GPS reconnect** when the app becomes visible again

Miles recorded while suspended depend on the OS — some devices continue delivering location updates briefly; others do not.

### User guidance (shown in-app)

- Location denied → branded banner + Enable Location
- GPS unavailable → “Try an open area…”
- Tracking paused → “MilePilot will reconnect automatically…”
- Battery optimisation → Settings hint in developer docs / future native build

---

## Architecture for native app (future)

The Tracking Engine is designed to be **portable**:

```
MPTracking.startShift() → processGpsPoint() → endShift() → mp_shifts
```

A native wrapper (Capacitor / React Native) would replace:

- `watchPosition` → OS background location service
- Wake Lock → foreground service notification (Android) / background modes (iOS)
- `localStorage` → SQLite or secure native storage (optional sync)

**No dashboard or report schema changes required** — same shift object feeds PDF reports.

---

## Beta testing checklist

See [MP-014-QA.md](./MP-014-QA.md).

---

## Health checks after deploy

- https://app.milepilot.uk/version.txt → `v7.4.1`
- https://app.milepilot.uk/js/tracking-engine.js → loads without 404
- Service worker cache name → `milepilot-v7-4-1`
