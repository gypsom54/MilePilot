# MilePilot Locked Components

**Status:** Active — UI Lockdown First (June 2026)  
**Purpose:** Stop regressions by locking approved screens before any core-engine work.

> **Rule:** Locked screens must not be changed again unless there is a genuine bug.

**Related docs:**
- [ONBOARDING_V1_LOCK.md](./ONBOARDING_V1_LOCK.md) — Vehicle Selection detail
- [MILEPILOT-DESIGN-BIBLE.md](./MILEPILOT-DESIGN-BIBLE.md) — copy, UI, animation standards
- [TRACKING_RELIABILITY_LOCKDOWN.md](./TRACKING_RELIABILITY_LOCKDOWN.md) — Phase 2 engine rules
- [DEVELOPMENT_PRIORITIES.md](./DEVELOPMENT_PRIORITIES.md) — sprint focus

---

## Onboarding — locked (approved)

| | Screen | ID | MP code |
| --- | --- | --- | --- |
| ✓ | **Welcome Screen** | `#welcome` | MP-001 |
| ✓ | **Vehicle Selection** | `#knowYou` | MP-002 |
| ✓ | **Tracking Mode** | `#trackingMode` | MP-046 |
| ✓ | **AutoPilot Permission** | `#permissions` | MP-004 |
| ✓ | **Success Screen** | `#onboardReady` | onboard-ready |

All five screens above are **🔒 LOCKED**. Do not change unless a genuine bug is reported.

---

## Development reset — why

UI changes have repeatedly broken or affected core mileage tracking logic.  
**New process:** polish every screen methodically, lock each one after approval, then focus on the engine.

---

## Phase 1 — UI lockdown (current)

### Allowed changes (polish only)

- Copy
- Layout
- Spacing
- Typography
- Icons
- Colours
- Animation
- Visual hierarchy

### Do not touch

- GPS tracking
- Background tracking
- Mileage calculations
- Trip persistence
- Reports logic
- Email logic
- AI logic
- Database logic

### Workflow (one screen at a time)

1. Fix **one screen only**
2. Send **screenshot**
3. **Wait for approval**
4. Mark screen as **locked** in this document
5. Move to **next screen**

### Deploy policy

Do **not** upload every build zip to Cloudflare during Phase 1.  
Commit and screenshot on each approved screen; upload **one final zip** when the full UI pass is complete.

---

## Locked screen detail

### Welcome Screen — LOCKED

- **File:** `frontend/index.html` → `#welcome`
- **Marker:** `data-locked="true"` `data-mp="MP-001"`
- **Policy:** Visual and copy frozen unless bug fix.

### Vehicle Selection — LOCKED

- **File:** `frontend/index.html` → `#knowYou`
- **Marker:** `data-locked="true"` `data-onboard-lock="v1.0"` `data-onboard-frozen="true"` `data-mp="MP-002"`
- **Detail:** [ONBOARDING_V1_LOCK.md](./ONBOARDING_V1_LOCK.md)

### Tracking Mode — LOCKED

- **File:** `frontend/index.html` → `#trackingMode`
- **Marker:** `data-locked="true"` `data-mp="MP-046"`
- **Policy:** AutoPilot vs Manual cards, copy, and layout frozen unless bug fix.

### AutoPilot Permission — LOCKED

- **File:** `frontend/index.html` → `#permissions`
- **Marker:** `data-locked="true"` `data-mp="MP-004"`
- **Policy:** Benefit-focused copy, privacy block, Enable AutoPilot CTA, and Manual Mode skip frozen unless bug fix.

### Success Screen — LOCKED

- **File:** `frontend/index.html` → `#onboardReady`
- **Marker:** `data-locked="true"` `data-mp="onboard-ready"`
- **Approved copy:**
  - Headline: `Welcome aboard, {name}.`
  - Intro: MilePilot is ready to track your business mileage automatically.
  - Brand: Your business is now on AutoPilot.
  - Tagline: Business mileage without the paperwork.
  - Steps: Start your shift · Drive normally · Review today's journeys · Download your mileage report
  - Payoff: Every business mile now counts.
  - CTA line: Let's put MilePilot to work.
  - Button: Start My First Shift
  - Helper: You can change these settings any time.
- **Animation:** Green tick single pulse + soft blue glow (`prefers-reduced-motion` respected)

---

## Pending screens (not yet locked)

| Screen | ID | MP code | Notes |
| --- | --- | --- | --- |
| Email setup | `#emailSetup` | email | Step 5 of 6 — next onboarding polish |
| Command Centre (Dashboard) | `#home` | MP-006 | |
| Reports | `#reports` | MP-008 | |
| History | `#history` | — | |
| Settings | `#settings` | — | |
| Live tracking / shift | — | — | UI only in Phase 1 |
| Paywall / subscription | — | — | If in scope |

---

## Phase 2 — Core engine (after UI locked)

Only after **all** Phase 1 screens are locked:

- Background GPS
- Mileage accuracy
- AutoPilot
- Manual Tracking
- Trip ending
- Reports
- Email delivery

See [TRACKING_RELIABILITY_LOCKDOWN.md](./TRACKING_RELIABILITY_LOCKDOWN.md).

---

## Phase 3 — AI layer (after tracking reliable)

- Habit learning
- Business / Personal prediction
- Confidence scores
- Swipe review
- Journey intelligence

---

## Phase 4 — MilePilot Pro (future)

- AI receipt scanning
- Expense extraction
- HMRC-ready exports
- Accountant packs
- Partner ecosystem

---

## Agent checklist before editing any screen

- [ ] Is this screen listed as **locked** in this doc? If yes → stop unless bug fix.
- [ ] Am I changing **only** polish (copy, layout, spacing, type, colour, animation)?
- [ ] Am I touching tracking, reports, email, AI, or persistence? If yes → stop.
- [ ] One screen per PR / iteration with screenshot for approval.
