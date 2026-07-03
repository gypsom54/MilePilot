# AutoPilot Motion Detection (MP-047)

**Status:** Active — extends Core Tracking Engine v1.0 (does not replace it)

## Objective

When AutoPilot mode is enabled, MilePilot detects likely driving without the user pressing Start Shift. Detected journeys use the same GPS engine, trip storage, auto-end, and report pipeline as manual tracking.

## State machine

| State | Meaning |
|-------|---------|
| `OFF` | AutoPilot disabled or motion detection paused |
| `PERMISSION_REQUIRED` | Waiting for Always Location / notifications |
| `ARMED` | Monitoring GPS/motion for driving |
| `MOVING_CANDIDATE` | Sustained speed above driving threshold |
| `TRACKING` | Active shift (manual or auto-started) |
| `IDLE_CANDIDATE` | Handled by `MPTripAutoEnd` during active shift |
| `ENDING` | Starting trip handoff |
| `COMPLETED` | Trip ended; re-arming monitor |
| `ERROR` | Battery saver, permission revoked, etc. |

## Detection rules

**Start when (all):**
- Speed ≥ ~10 mph (4.47 m/s) sustained for **2 minutes**
- GPS accuracy ≤ 80 m
- Confidence score ≥ 0.72
- Not walking speed (2.2 m/s cap)
- AutoPilot mode + auto-detect enabled

**Do not start when:**
- Manual mode
- Motion detection toggled off
- Poor GPS / short movement / walking
- Subscription inactive

## User settings

| Setting | Storage key |
|---------|-------------|
| AutoPilot mode | `mp_tracking_mode` |
| Auto-detect driving | `mp_autopilot_motion_enabled` |
| Auto-start as business | `mp_autopilot_auto_business` |
| Daily report email | `mp_report_prefs.emailReports` |
| Idle auto-end | `MPTripAutoEnd` (90 min default) |

## Files

| File | Role |
|------|------|
| `frontend/js/autopilot-motion.js` | State machine + detection |
| `frontend/js/autopilot-debug.js` | Dev debug screen |
| `frontend/index.html` | Wiring hooks only |
| `src/expoLocationBridge.js` | `expo:autopilot:arm` / `disarm` |
| `tests/autopilot-motion.test.js` | Unit tests |

## Debug

```javascript
localStorage.setItem('mp_debug', '1');
// Open app with ?debug=autopilot
```

Settings → Developer debug → **Open AutoPilot Debug →**

## Testing checklist

See user acceptance checklist in product spec — automated coverage in `tests/autopilot-motion.test.js`.

## Boundaries

- **Do not modify** `processGpsPoint`, PDF/email templates, or locked report styling
- **Do call** `startShiftCommandCentre()` / `endShiftCommandCentre()` for trip lifecycle
- **Do use** `MPSummaryReports.onShiftEnded()` for report delivery (deduped)
