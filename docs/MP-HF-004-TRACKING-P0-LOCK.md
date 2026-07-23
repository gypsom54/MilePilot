# MP-HF-004 — Tracking P0 restore & lock (v8.43.72)

## Problem

After Business Workspace (MP-S6-001) merged, road testing showed AutoPilot broken again:

- **Open Settings** modal (`nativeAlwaysOpen`) not appearing after permissions when iOS grants foreground-only location
- Dashboard **AutoPilot status bar** (`ccAutopilotBar`) never rendered — `renderCommandCentre()` stopped calling `renderAutopilotStatusBar()`
- Dashboard showed manual-mode copy ("Ready for another shift?") instead of AutoPilot idle status
- `bootApp()` initialised `initAutoPilotMotion()` before `initTrackingEngine()` (golden order reversed)
- Legacy boot paths skipped `ensureAutopilotArmed()`
- `finishOnboarding()` deferred arming and silently defaulted tracking mode instead of golden flow

Golden reference: commit `686d370` (v8.43.67 / `v8.43-GOLDEN`).

## Fix (v8.43.72)

Restored golden dashboard + boot wiring while keeping Business Workspace / Ask MilePilot:

| Area | Change |
|------|--------|
| `renderCommandCentre()` | Calls `renderHomeTrackingModeUI()`, `renderAutopilotStatusBar()`, `renderHomeDebugButton()` |
| `getIdleDashboardStatus()` | AutoPilot-aware idle copy (ARMED, MOVING_CANDIDATE, PERMISSION_REQUIRED) |
| `finishOnboarding()` | Sets `mp_onboard_complete`, arms AutoPilot, `goHome()`, then prompts Always location if foreground-only |
| `ensureAutopilotArmed()` | Shows Always-location modal after native `enableTracking()` when background inactive |
| `goHome()` | Calls `ensureAutopilotArmed()` for AutoPilot users |
| `bootApp()` | `initTrackingEngine()` before `initAutoPilotMotion()`; legacy paths arm AutoPilot |

## Lock rules (do not change without explicit approval)

1. `renderCommandCentre()` **must** end with `renderAutopilotStatusBar()` for idle AutoPilot users
2. `bootApp()` **must** call `initTrackingEngine()` before `initAutoPilotMotion()`
3. `finishOnboarding()` **must** call `ensureAutopilotArmed()` before/at dashboard entry
4. Foreground-only iOS permission **must** surface `#nativeAlwaysModal` with **Open Settings** after onboarding
5. Do not merge Sprint 2+ features that touch tracking boot/dashboard without running `npm run test:vital`

## Validation

```bash
npm run test:autopilot
npm run test:tracking
npm run test:mileage-checklist
npm run verify:tracking
./build-upload.sh
```

## Deploy

Upload `MilePilot-v8.43.72-CLOUDFLARE-UPLOAD.zip` to Cloudflare Pages (`app.milepilot.uk`). TestFlight build 17 loads live web — **web bundle deploy is the critical path**.
