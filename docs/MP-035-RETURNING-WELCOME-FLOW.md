# MP-035 — Fix Returning User Welcome Flow

**Version:** v8.8.4  
**Branch:** `cursor/mp-035-returning-welcome-flow-ae00`  
**Type:** Onboarding routing fix — no new product features

---

## Problem

Returning users with saved email and report schedule were sent back into setup:

Welcome → Report frequency → Email → Setup again

The welcome screen is fine as a **brand moment** — but Continue must not restart completed steps.

---

## Solution: explicit onboarding state flags

| Flag | Storage key | Detected from |
|------|-------------|---------------|
| hasAccount | `mp_has_account` | Profile / completion |
| hasReportSchedule | `mp_has_report_schedule` | `mp_report_frequency` |
| hasEmail | `mp_has_email` | `mp_email` |
| hasLocationPermission | `mp_has_location_permission` | `mp_location_choice === granted` |
| hasCompletedInitialSetup | `mp_has_completed_initial_setup` | Explicit flag, legacy complete, or email+schedule |

`continueFromWelcome()` routes using **only missing steps**.

---

## Flows

### First-time user (nothing saved)

Welcome → Report frequency → Email → Location → AutoPilot Ready → Dashboard

Then `hasCompletedInitialSetup = true`.

### Returning user (setup complete)

Welcome (brand) → **Continue** → Dashboard

No report, email, or permission screens unless explicitly missing.

### Partial setup

| Has | Missing | After Continue |
|-----|---------|----------------|
| Email | Report schedule | Report frequency only |
| Report schedule | Email | Email only |
| Everything | — | Dashboard |

---

## Key changes

- Removed cold-boot `resumeOnboardingStep()` — stale `mp_onboard_step` no longer traps users
- `reconcileOnboardingState()` clears stale step for returning users
- All users see welcome on boot; Continue decides the path
- FTUE step order: Reports → Email → Location → AutoPilot Ready

---

## Acceptance tests

| # | Scenario | Expected |
|---|----------|----------|
| 1 | New user, no data | Full setup flow |
| 2 | Email + report schedule | Welcome → Dashboard |
| 3 | Setup complete flag | Welcome → Dashboard |
| 4 | Email only | Welcome → Report schedule → Dashboard |
| 5 | Report schedule only | Welcome → Email → Dashboard |
| 6 | Refresh | No repeated setup |
| 7 | Continue on welcome (returning) | Dashboard / Start Shift |

---

## Deploy

Upload `MilePilot-UPLOAD-v8.8.4.zip` — verify `https://app.milepilot.uk/version.txt` shows **v8.8.4**

Service worker cache: `milepilot-v8-8-4`
