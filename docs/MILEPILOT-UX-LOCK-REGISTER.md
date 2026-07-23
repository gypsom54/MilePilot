# MilePilot UX Lock Register

One-screen-at-a-time product recovery workflow.

**Workflow:** DESIGN → IMPLEMENT → SCREENSHOT → HUMAN REVIEW → APPROVE → LOCK → NEXT SCREEN

---

## Screen 1 — Splash Screen

| Field | Value |
|-------|-------|
| **Name** | Splash Screen |
| **ID** | `welcome` (MP-001) |
| **Status** | **LOCKED** |
| **Specification** | Original approved production splash |
| **Change authority** | Explicit human approval only |

Do not change artwork, logo, animation, timing, typography, background, spacing, or transition styling.

**Permitted change:** none to splash HTML/CSS. Routing to Screen 2 is handled inside `startOnboardingName()` when `mp_onboard_complete !== 'true'`.

---

## Screen 2 — MilePilot Introduction

| Field | Value |
|-------|-------|
| **Name** | MilePilot Introduction |
| **ID** | `introduction` (MP-UX-LOCK-002) |
| **Status** | **LOCKED** |
| **Specification** | MP-UX-LOCK-002 / MP-UX-LOCK-002A |
| **Change authority** | Explicit human approval only |

**Approved copy** (exact production — curly apostrophe `’` U+2019):

- Eyebrow: `MEET MILEPILOT`
- Heading: `Hi, I’m MilePilot.`
- Primary: `I’m here to make self-employed life simpler.`
- Supporting: `I’ll help you track your mileage, reduce your admin and stay on top of your business — so you have more time for the work that matters.`
- Promise: `Less admin. More time for your business.`
- CTA: `Let’s get started`

**Flow:** Splash → Introduction → dev placeholder (`onboardAwaiting`) — **STOP** (Screen 3 not started).

**Dev preview:** append `?preview=introduction` while `mp_onboard_complete` is not `true` to open Screen 2 directly (does not clear storage).

---

## Screen 3 — Not started

| Field | Value |
|-------|-------|
| **Status** | **NOT STARTED** |

Legacy screens below remain in DOM but are unreachable in UX lock v2 flow until Screen 3+ is approved.

| Screen | Status |
|--------|--------|
| Name / vehicle (legacy MP-002) | NOT STARTED — code present, unreachable in UX lock v2 flow |
| Tracking mode (MP-046) | NOT STARTED |
| Permissions (MP-004) | NOT STARTED |
| Email setup | NOT STARTED |
| Onboard ready | NOT STARTED |
| Dashboard entry | NOT STARTED |

---

## Legacy route isolation (UX lock v2)

Old screens remain in DOM but are **blocked** for users where `mp_onboard_complete !== 'true'` via `guardUxLockScreen()` in `showScreen()`.

| Old screen | File | Blocked route / function | Reason |
|------------|------|--------------------------|--------|
| knowYou | `frontend/index.html` | `showScreen('knowYou')`, `startOnboardingName()` | Redirects to introduction |
| trackingMode | same | `showScreen('trackingMode')`, `confirmOnboardName()` | Guarded |
| permissions | same | `showScreen('permissions')`, `continueSetup()` | Guarded |
| emailSetup | same | `showScreen('emailSetup')`, `goToEmailSetup()` | Guarded |
| onboardReady | same | `showScreen('onboardReady')`, `finishOnboarding()` | Guarded |
| experienceChoice | same | `showScreen('experienceChoice')` | Guarded |
| businessProfile | same | `showScreen('businessProfile')` | Guarded |
| promise | same | `showScreen('promise')` | Guarded |
| notifications | same | `showScreen('notifications')` | Guarded |

**Completed users** (`mp_onboard_complete === 'true'`) bypass all guards and route to dashboard as before.

---

*Last updated: MP-UX-LOCK-002A — Screen 2 corrected and locked*
