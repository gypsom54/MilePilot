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

---

## Screen 2 — Meet MilePilot

| Field | Value |
|-------|-------|
| **Name** | MilePilot Introduction |
| **ID** | `introduction` (MP-UX-LOCK-002) |
| **Status** | **LOCKED** |
| **Specification** | MP-UX-LOCK-002 / MP-UX-LOCK-002A |
| **Change authority** | Explicit human approval only — requires UNLOCK SCREEN 2 |

**Locked heading:** `Hi, I’m MilePilot.` (curly apostrophe U+2019 in production)

---

## Screen 3 — How MilePilot Can Help

| Field | Value |
|-------|-------|
| **Name** | How can I help your business today? |
| **ID** | `helpChoice` (MP-UX-LOCK-003) |
| **Status** | **LOCKED** |
| **Specification** | MP-UX-LOCK-003 / MP-UX-LOCK-003A |
| **Change authority** | Explicit human approval only — requires UNLOCK SCREEN 3 |

**Locked card 3 title:** `Everything MilePilot`

---

## Screen 4 — Personal Introduction

| Field | Value |
|-------|-------|
| **Name** | Personal Introduction |
| **ID** | `personalIntro` (MP-UX-LOCK-004) |
| **Status** | **LOCKED** |
| **Specification** | MP-UX-LOCK-004 / MP-UX-LOCK-004A |
| **Change authority** | Explicit human approval only — requires UNLOCK SCREEN 4 |

**Approved copy** (exact production — curly apostrophe `’` U+2019):

- Eyebrow: `LET’S MAKE THIS PERSONAL`
- Heading: `What should I call you?`
- Supporting: `I’ll use your name to make MilePilot feel more personal.`
- Input label: `First name`
- Placeholder: `Enter your first name`
- Error: `Please enter your first name.`
- CTA: `Continue`

**Storage:** `mp_user_first_name` only (max 50 chars, trim whitespace, preserve capitalisation)

**Flow:** Splash → Introduction → Help Choice → **Personal Introduction** → Screen 5 Your Work

**Dev preview:** append `?preview=personalIntro` while `mp_onboard_complete` is not `true`.

---

## Screen 5 — Your Work

| Field | Value |
|-------|-------|
| **Name** | Your Work |
| **ID** | `yourWork` (MP-UX-LOCK-005) |
| **Status** | **IN REVIEW** |
| **Specification** | MP-UX-LOCK-005 |
| **Change authority** | Explicit human approval only — requires UNLOCK SCREEN 5 to modify after lock |

**Approved copy** (exact production):

- Eyebrow: `TELL ME ABOUT YOUR WORK`
- Heading: `What kind of work do you do?`
- Supporting: `This helps me make MilePilot more useful for your business.`
- CTA: `Continue`

**Options** (single selection, `mp_business_category`):

| Value | Title |
|-------|-------|
| `driver` | Driving & delivery |
| `trades` | Trades & construction |
| `freelance` | Freelance & professional |
| `services` | Retail & personal services |
| `other` | Something else |

**Storage:** `mp_business_category` only

**Flow:** Personal Introduction → **Your Work** → Screen 6 placeholder (`onboardAwaiting`) — **STOP**

**Dev preview:** append `?preview=yourWork` while `mp_onboard_complete` is not `true`.

---

## Screen 6+ — Not started

| Field | Value |
|-------|-------|
| **Status** | **NOT STARTED** |

---

## Legacy route isolation (UX lock v2)

Old screens remain in DOM but are **blocked** for users where `mp_onboard_complete !== 'true'` via `guardUxLockScreen()` in `showScreen()`.

Old name screen: `knowYou` (MP-002) — blocked, not reachable in UX lock v2 flow.

**Completed users** (`mp_onboard_complete === 'true'`) bypass all guards and route to dashboard as before.

---

*Last updated: MP-UX-LOCK-005 — Screen 5 Your Work (IN REVIEW)*
