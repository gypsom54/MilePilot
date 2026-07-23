# MP-HF-003 — Onboarding completion + tracking restore (v8.43.69)

## Problem

After MP-S6-001 Business Workspace merge, users on TestFlight 17 loading live web could:

1. Get **stuck on “Start My First Shift”** — `finishOnboarding()` redirected back to tracking mode when `mp_tracking_mode` was missing, or blocked on synchronous tracking setup.
2. Lose **background AutoPilot** — critical native helpers (`seedTripGps`, `syncWebMilesToNative`, `restoreNativeTripIfNeeded`, etc.) and the full `initTrackingEngine()` lifecycle were dropped during the merge.

## Fix

- **Onboarding unchanged visually** — same screens and button copy.
- **`finishOnboarding()`** — default missing tracking mode to AutoPilot silently; complete dashboard transition first; arm AutoPilot in `setTimeout` after `goHome()`.
- **Restore golden tracking stack** from `686d370` (MP-HF-002): native sync helpers, `initTrackingEngine` visibility/pageshow hooks, `restoreActiveShift` native path.

## Deploy

Upload `milepilot-upload-v2/` zip to Cloudflare. TestFlight 17 does not need rebuild — it loads `app.milepilot.uk`. Confirm dashboard footer shows **v8.43.69**.
