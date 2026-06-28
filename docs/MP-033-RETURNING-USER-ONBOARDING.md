# MP-033 — Fix Returning User Onboarding Logic

**Version:** v8.8.1  
**Branch:** `cursor/mp-033-returning-user-onboarding-ae00`  
**Type:** Boot routing fix — no new product features

---

## Problem

After the MP-030 FTUE update, some returning users (email saved, shifts recorded, setup done) were sent back to the welcome screen on every launch. The welcome screen is for first-time setup only.

Root causes:

1. `mp_onboard_complete` was the only completion signal — legacy users often lacked this flag.
2. `migrateOnboardingVersion()` reset onboarding on version upgrade when the flag was missing.
3. Welcome had `class="active"` in HTML, causing a flash before JavaScript booted.

---

## Solution: single source of truth

### `hasCompletedOnboarding()`

Returns `true` when:

- `mp_onboard_complete === 'true'`, **or**
- Reliable existing account data exists (any of):
  - saved email
  - report schedule
  - AutoPilot enabled
  - driver name / plan / work type
  - stay-updated prompt seen
  - previous shifts in `mp_shifts`

### `markOnboardingComplete()`

Called when FTUE finishes. Sets `mp_onboard_complete`, clears `mp_onboard_step`, clears forced-reset flag.

### `reconcileOnboardingState()`

On boot, migrates legacy users with account signals to `mp_onboard_complete = true`.

### `mp_onboarding_reset`

Set by Settings → Reset onboarding. Suppresses account-signal detection until FTUE completes again (prevents immediate re-skip when shifts still exist).

---

## Launch routing

| User | Flow |
|------|------|
| **First-time** (`hasCompletedOnboarding !== true`) | Welcome → Location → Reports → Email → AutoPilot Ready → Dashboard |
| **Returning** (`hasCompletedOnboarding === true`) | Brief boot splash → Dashboard directly |

Returning users never see the welcome Continue button, email step, or report frequency step again.

---

## Boot splash

New `#bootSplash` screen is the default HTML active screen (not welcome). Shows brand + “Loading…” until `bootApp()` routes to dashboard or FTUE.

---

## Reset onboarding (Settings)

Testing/debug only. Clears onboarding flags and account prefs, sets `mp_onboarding_reset`, returns to welcome flow.

---

## Acceptance tests

| # | Scenario | Expected |
|---|----------|----------|
| 1 | Clear all app data | Welcome onboarding |
| 2 | Complete onboarding | Dashboard |
| 3 | Close and reopen | Dashboard, not welcome |
| 4 | Browser refresh | Dashboard, not welcome |
| 5 | Email saved, flag missing | Dashboard (returning user) |
| 6 | Shifts saved, flag missing | Dashboard (returning user) |
| 7 | Reset onboarding from Settings | Welcome flow again |

---

## Deploy

Upload `MilePilot-UPLOAD-v8.8.1.zip` — verify `https://app.milepilot.uk/version.txt` shows **v8.8.1**

Service worker cache: `milepilot-v8-8-1`
