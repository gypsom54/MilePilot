# Automatic trip end on inactivity (MP-045)

## Behaviour

When a shift is **active**, MilePilot tracks `lastMovementAt` (timestamp of last GPS movement ≥ 6 m).

If **no movement** is detected for **90 minutes**, the app calls `endShiftCommandCentre('auto')` — the same path as tapping **End Shift**:

- Saves the trip to shift history
- Clears active shift state
- Schedules the daily report email (if frequency = daily)
- Shows the shift complete summary

## Logging (browser console)

Filter by `[MilePilot AutoEnd]`:

| Log | Meaning |
|-----|---------|
| `Trip started` | Inactivity timer armed |
| `Movement detected — inactivity timer reset` | Vehicle moved |
| `Inactivity timer expired — auto-ending trip` | 90 min idle reached |
| `Auto-ending trip via endShiftCommandCentre` | Handoff to production end-shift |
| `Trip ended` | State cleared |

Email pipeline logs: `[MilePilot Reports]`

## Developer debug panel

```javascript
localStorage.setItem('mp_debug', '1');
```

Open **Settings** → **Developer debug** panel.

**Short test timeout** (do not use in production):

```javascript
localStorage.setItem('mp_debug_auto_end_ms', '120000'); // 2 minutes
```

## PWA vs native — what works where

| Scenario | Auto-end reliable? |
|----------|-------------------|
| App in foreground | Yes |
| Screen locked, app still running (PWA / TestFlight) | Yes — uses timestamp check on 1s timer + resume |
| App backgrounded briefly | Yes — checks on `visibilitychange` / `pageshow` |
| App **force-quit** or OS kills WebView | **Partial** — on next open, `restoreActiveShift` + `checkTripAutoEnd` runs; if idle ≥ 90 min, trip auto-ends immediately |
| Phone off for days | Same as force-quit — catch-up on next launch |
| Low Power Mode | Timers may slow; timestamp check still correct when JS runs |
| PWA tab discarded by Safari (no process) | **No live timer** until user reopens app; then catch-up applies |

**Bottom line:** Auto-end is **production-ready** when the app process runs or when the user returns to the app. It is **not** a server-side cron — a killed PWA cannot end a trip until reopened.

Native iOS/Android (TestFlight) uses a **native idle watchdog** (`src/nativeAutoEnd.js`) that runs alongside background GPS. When the WebView is suspended, the native layer still tracks wall-clock idle time and triggers auto-end via `expo:autoend:trigger`. A local notification is scheduled as backup.

| Scenario | Auto-end reliable? |
|----------|-------------------|
| TestFlight, screen locked, background GPS active | **Yes** — native watchdog + BG location wake |
| TestFlight, app force-quit | **Partial** — catch-up on next open |
| Browser PWA, tab discarded | **No live timer** until reopen; then catch-up |

## Email after auto-end

Daily reports are sent **1 hour after shift end** (product rule), not instantly.

Scheduling is **persisted** in `localStorage` (`mp_pending_report`) so it survives app restarts. `checkScheduledReports` (every 60s + on boot) delivers the email even if `setTimeout` was lost.

Requirements for email:

1. `mp_email` set
2. `mp_report_frequency` = `daily`
3. Trip must actually end (manual or auto)
4. Backend `/reports/send` + Resend configured

## Files

| File | Role |
|------|------|
| `frontend/js/trip-auto-end.js` | Isolated inactivity service (`MPTripAutoEnd`) |
| `frontend/js/summary-reports.js` | Persisted email scheduling + logging |
| `frontend/index.html` | Hooks only — does not change GPS engine logic |
| `tests/trip-auto-end.test.js` | Unit tests |

## Not the same as stationary stops

`STOP_AFTER_MS` (90 **seconds**) records a **stop event** during a trip. It does **not** end the trip. Auto-end is `INACTIVITY_MS` (90 **minutes**) in `trip-auto-end.js`.
