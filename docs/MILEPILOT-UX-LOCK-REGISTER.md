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

**Flow:** Splash → Introduction → dev placeholder (`onboardAwaiting`) — superseded by Screen 3 flow below.

**Dev preview:** append `?preview=introduction` while `mp_onboard_complete` is not `true` to open Screen 2 directly (does not clear storage).

---

## Screen 3 — How MilePilot Can Help

| Field | Value |
|-------|-------|
| **Name** | How MilePilot Can Help |
| **ID** | `helpChoice` (MP-UX-LOCK-003) |
| **Status** | **IN REVIEW** |
| **Specification** | MP-UX-LOCK-003 |
| **Change authority** | Explicit human approval only |

**Approved copy** (MP-UX-LOCK-003A):

- Heading: `How can I help your business today?`
- Supporting: `Choose the experience that's right for you.`
- Supporting sub: `You can always change this later.`
- Option 1: Track my mileage — badge `HMRC READY` — Never miss another business mile.
- Option 2: Help run my business — benefit-led list (scan receipts, expenses, VAT, reports, ask, accountant summaries)
- Option 3: Complete Business Companion — Your business in one place. (outcome list)
- CTA: `Continue →` (hidden until selection)

**Specification:** MP-UX-LOCK-003 / MP-UX-LOCK-003A

**Flow:** Splash → Introduction → Help Choice → Screen 4 placeholder (`onboardAwaiting`) — **STOP** (Screen 4 not started).

**Dev preview:** append `?preview=helpChoice` while `mp_onboard_complete` is not `true`.

---

## Screen 4 — Not started

| Field | Value |
|-------|-------|
| **Status** | **NOT STARTED** |

Legacy screens below remain in DOM but are unreachable in UX lock v2 flow until Screen 4+ is approved.

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

*Last updated: MP-UX-LOCK-003A — Screen 3 product positioning refinement (IN REVIEW)*
