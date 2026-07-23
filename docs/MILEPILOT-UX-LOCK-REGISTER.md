# MilePilot UX Lock Register

One-screen-at-a-time product recovery workflow.

**Workflow:** DESIGN → IMPLEMENT → SCREENSHOT → HUMAN REVIEW → APPROVE → LOCK → NEXT SCREEN

---

## UX LOCK RULE 001

Once a screen has been approved and marked **LOCKED**, it may not be modified again unless the specification explicitly states **"UNLOCK SCREEN X"**. Locked screens are read-only assets. Any accidental modification to a locked screen is a failed implementation and must be reverted before continuing.

---

## Screen 1 — Splash Screen

| Field | Value |
|-------|-------|
| **Name** | Splash Screen |
| **ID** | `welcome` (MP-001) |
| **Status** | **LOCKED** |
| **Specification** | Original approved production splash |
| **Change authority** | Explicit human approval only — requires UNLOCK SCREEN 1 |

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
| **Change authority** | Explicit human approval only — requires UNLOCK SCREEN 2 |

**Approved copy** (exact production — curly apostrophe `’` U+2019):

- Eyebrow: `MEET MILEPILOT`
- Heading: `Hi, I’m MilePilot.`
- Primary: `I’m here to make self-employed life simpler.`
- Supporting: `I’ll help you track your mileage, reduce your admin and stay on top of your business — so you have more time for the work that matters.`
- Promise: `Less admin. More time for your business.`
- CTA: `Let’s get started`

**Dev preview:** append `?preview=introduction` while `mp_onboard_complete` is not `true`.

---

## Screen 3 — How MilePilot Can Help

| Field | Value |
|-------|-------|
| **Name** | How MilePilot Can Help |
| **ID** | `helpChoice` (MP-UX-LOCK-003) |
| **Status** | **LOCKED** |
| **Specification** | MP-UX-LOCK-003 / MP-UX-LOCK-003A |
| **Change authority** | Explicit human approval only — requires UNLOCK SCREEN 3 |

**Approved copy** (exact production):

**Screen title**
- Heading: `How can I help your business today?`
- Supporting: `Choose the experience that's right for you.`
- Supporting sub: `You can always change this later.`

**Card 1 — Track my mileage**
- Badge: `HMRC READY`
- Headline: `Never miss another business mile.`
- Body: `Automatically record your journeys, calculate your claims and generate HMRC-ready mileage reports so you stay organised and claim what you're entitled to.`

**Card 2 — Help run my business**
- Headline: `Spend less time on paperwork.`
- Supporting: `Everything you need to stay organised in one place.`
- Benefits (exact order):
  1. `Scan receipts automatically`
  2. `Track every business expense`
  3. `Stay on top of VAT`
  4. `Generate business reports`
  5. `Ask questions about your business`
  6. `Prepare accountant-ready summaries`

**Card 3 — Everything MilePilot**
- Headline: `Your business in one place.`
- Supporting (exact order):
  1. `Automatic mileage tracking`
  2. `Smart business tools`
  3. `AI assistance whenever you need it`
  4. `HMRC-ready reports`
  5. `Everything working together to save you time`

**CTA:** `Continue →` (hidden until exactly one card is selected)

**Flow:** Splash → Introduction → Help Choice → Screen 4 placeholder (`onboardAwaiting`) — **STOP** (Screen 4 not started).

**Dev preview:** append `?preview=helpChoice` while `mp_onboard_complete` is not `true`.

---

## Screen 4 — Not started

| Field | Value |
|-------|-------|
| **Status** | **NOT STARTED** |

---

## Legacy route isolation (UX lock v2)

Old screens remain in DOM but are **blocked** for users where `mp_onboard_complete !== 'true'` via `guardUxLockScreen()` in `showScreen()`.

**Completed users** (`mp_onboard_complete === 'true'`) bypass all guards and route to dashboard as before.

---

*Last updated: MP-UX-LOCK-003A — Screen 3 final copy locked*
