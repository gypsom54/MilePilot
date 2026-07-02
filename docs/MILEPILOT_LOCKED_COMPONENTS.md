# MilePilot Locked Components

**Status:** Active — UI Lockdown First (June 2026)  
**Purpose:** Stop regressions by locking approved screens before any core-engine work.

> **Rule:** Locked screens must not be changed again unless there is a genuine bug.

**Related docs:**
- [MILEPILOT_UI_LOCK.md](./MILEPILOT_UI_LOCK.md) — screen status board (canonical checklist)
- [ONBOARDING_V1_LOCK.md](./ONBOARDING_V1_LOCK.md) — Name & Vehicle detail
- [MILEPILOT-DESIGN-BIBLE.md](./MILEPILOT-DESIGN-BIBLE.md) — copy, UI, animation standards
- [TRACKING_RELIABILITY_LOCKDOWN.md](./TRACKING_RELIABILITY_LOCKDOWN.md) — Phase 2 engine rules
- [DEVELOPMENT_PRIORITIES.md](./DEVELOPMENT_PRIORITIES.md) — sprint focus

---

## Onboarding — locked (approved)

| | Screen | ID | MP code |
| --- | --- | --- | --- |
| ✓ | **Welcome Screen** | `#welcome` | MP-001 |
| ✓ | **Name & Vehicle** | `#knowYou` | MP-002 |
| ✓ | **Tracking Mode** | `#trackingMode` | MP-046 |
| ✓ | **Background Permission Screen** | `#permissions` | MP-004 |
| ✓ | **Success Screen** | `#onboardReady` | onboard-ready |

All onboarding screens above are **🔒 LOCKED** except Email Reports (in review).

**App — locked:**

| | Screen | ID | MP code |
| --- | --- | --- | --- |
| ✓ | **Dashboard** | `#home` | MP-006 |

See [UI_LOCK_DASHBOARD.md](./UI_LOCK_DASHBOARD.md).

**In review:** Email Reports Screen (`#emailSetup`) — see [MILEPILOT_UI_LOCK.md](./MILEPILOT_UI_LOCK.md).

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

### Name & Vehicle — LOCKED

- **File:** `frontend/index.html` → `#knowYou`
- **Marker:** `data-locked="true"` `data-onboard-lock="v1.0"` `data-onboard-frozen="true"` `data-mp="MP-002"`
- **Detail:** [ONBOARDING_V1_LOCK.md](./ONBOARDING_V1_LOCK.md)

### Tracking Mode — LOCKED

- **File:** `frontend/index.html` → `#trackingMode`
- **Marker:** `data-locked="true"` `data-mp="MP-046"`
- **Policy:** AutoPilot vs Manual cards, copy, and layout frozen unless bug fix.

### Background Permission Screen — LOCKED

- **File:** `frontend/index.html` → `#permissions`
- **Marker:** `data-locked="true"` `data-mp="MP-004"`
- **Frozen:** June 2026 — no further UI changes unless genuine bug
- **Approved copy:**
  - Headline: Unlock AutoPilot Tracking
  - Confidence: Drive normally. MilePilot takes care of the rest.
  - Card title: 📍 Always Location Permission
  - Card body: Allowing Always Location lets MilePilot automatically detect your business journeys—even when your phone is locked.
  - Explain: Your location is only used to detect business journeys and calculate mileage.
  - Privacy: 🔒 Your location is never sold or shared.
  - Battery: ⚡ Designed to minimise battery usage.
  - Primary CTA: Enable AutoPilot
  - Secondary: Use Manual Tracking Instead
  - Hint: Takes about 10 seconds.

### Success Screen — LOCKED

- **File:** `frontend/index.html` → `#onboardReady`
- **Marker:** `data-locked="true"` `data-mp="onboard-ready"`
- **Frozen:** June 2026 — no further UI changes unless genuine bug
- **Approved copy:**
  - Headline: `Welcome aboard!`
  - Intro: MilePilot is ready to track your business mileage automatically.
  - Feature: Start your first shift. MilePilot will automatically record your journeys and prepare your mileage reports.
  - Payoff: Every business mile now counts.
  - Button: Start My First Shift
  - Helper: You can change these settings any time.
- **Animation:** Green tick single pulse + soft blue glow; progress bar 83% → 100% on arrival (`prefers-reduced-motion` respected)

### Dashboard — LOCKED

- **File:** `frontend/index.html` → `#home`
- **Marker:** `data-locked="true"` `data-mp="MP-006"`
- **Detail:** [UI_LOCK_DASHBOARD.md](./UI_LOCK_DASHBOARD.md)
- **Permanent hero message:** Removed v8.43.23 — greeting + *Ready for another shift?* only
- **Version:** v8.43.23 — final Phase 1 micro polish; **frozen**

### Bottom Navigation — LOCKED

- **File:** `frontend/index.html` → `.nav` `#nav`
- **Detail:** [UI_LOCK_NAVIGATION.md](./UI_LOCK_NAVIGATION.md)
- **Version:** v8.43.21 — flex shell dock; content scrolls above nav

### Reports — LOCKED

- **File:** `frontend/index.html` → `#reports`
- **Marker:** `data-locked="true"` `data-mp="MP-008"`
- **Detail:** [UI_LOCK_REPORTS.md](./UI_LOCK_REPORTS.md)
- **Version:** v8.43.22 — visual polish frozen

### Settings — IN REVIEW

- **File:** `frontend/index.html` → `#settings`
- **Marker:** `data-locked="true"` `data-mp="MP-009"`
- **Detail:** [UI_LOCK_SETTINGS.md](./UI_LOCK_SETTINGS.md)
- **Version:** v8.43.24 — premium control centre polish; awaiting approval

---

## Pending screens (not yet locked)

| Screen | ID | MP code | Notes |
| --- | --- | --- | --- |
| Email Reports Screen | `#emailSetup` | email | 🟡 In review |
| Reports | `#reports` | MP-008 | ✅ Locked — [UI_LOCK_REPORTS.md](./UI_LOCK_REPORTS.md) |
| Settings | `#settings` | MP-009 | 🟡 In review — [UI_LOCK_SETTINGS.md](./UI_LOCK_SETTINGS.md) |
| History | `#history` | — | ⬜ Next up |
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
