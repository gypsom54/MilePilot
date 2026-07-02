# MilePilot UI Lock

**Status:** Active — UI Lockdown First (June 2026)  
**Purpose:** Single source of truth for screen polish status during Phase 1.

> **Rule:** Locked screens must not be changed again unless there is a genuine bug.

**Related docs:**
- [MILEPILOT_LOCKED_COMPONENTS.md](./MILEPILOT_LOCKED_COMPONENTS.md) — full lock policy, phases, agent checklist
- [MILEPILOT-DESIGN-BIBLE.md](./MILEPILOT-DESIGN-BIBLE.md) — copy, UI, animation standards
- [ONBOARDING_V1_LOCK.md](./ONBOARDING_V1_LOCK.md) — Name & Vehicle detail

---

## Screen status

### Onboarding

✅ **Welcome Screen** (Locked)  
✅ **Name & Vehicle** (Locked)  
✅ **Tracking Mode** (Locked)  
✅ **Background Permission Screen** (Locked)  
🟡 **Email Reports Screen** (In Review)  
✅ **Success Screen** (Locked)

### App

⬜ **Dashboard**  
⬜ **Start Shift**  
⬜ **Live Tracking**  
⬜ **AI Review**  
⬜ **Reports**  
⬜ **History**  
⬜ **Settings**  
⬜ **Subscription**

---

## Status key

| Symbol | Meaning |
| --- | --- |
| ✅ | Locked — approved; no further polish unless bug fix |
| 🟡 | In review — polish in progress; awaiting approval |
| ⬜ | Not started — pending Phase 1 polish |

---

## Screen map (code reference)

| Screen | Status | DOM / marker | Notes |
| --- | --- | --- | --- |
| Welcome Screen | ✅ Locked | `#welcome` `data-mp="MP-001"` `data-locked="true"` | |
| Name & Vehicle | ✅ Locked | `#knowYou` `data-mp="MP-002"` `data-locked="true"` | See [ONBOARDING_V1_LOCK.md](./ONBOARDING_V1_LOCK.md) |
| Tracking Mode | ✅ Locked | `#trackingMode` `data-mp="MP-046"` `data-locked="true"` | |
| Background Permission Screen | ✅ Locked | `#permissions` `data-mp="MP-004"` `data-locked="true"` | Frozen — UI lock complete |
| Email Reports Screen | 🟡 In Review | `#emailSetup` `data-mp="email"` | Step 5 of 6 — **current focus** |
| Success Screen | ✅ Locked | `#onboardReady` `data-mp="onboard-ready"` `data-locked="true"` | Frozen — UI lock complete |
| Dashboard | ⬜ Pending | `#home` `data-mp="MP-006"` | Command Centre |
| Start Shift | ⬜ Pending | `#home` → `#ccPrimaryBtn` | Dashboard idle / active CTA state |
| Live Tracking | ⬜ Pending | `#tracking` | Live shift map + metrics |
| AI Review | ⬜ Pending | `#home` → `#ccSummary` / `#journeyReviewPanel` | Post-shift journey review |
| Reports | ⬜ Pending | `#reports` `data-mp="MP-008"` | Report Centre |
| History | ⬜ Pending | `#history` | |
| Settings | ⬜ Pending | `#settings` | |
| Subscription | ⬜ Pending | `#subscriptionPaywall` | Paywall overlay |

---

## Workflow

1. Polish **one screen only** (copy, layout, spacing, typography, icons, colours, animation, hierarchy)
2. Send **screenshot**
3. **Wait for approval**
4. Update this doc: 🟡 → ✅
5. Move to next screen

**Do not touch during Phase 1:** GPS tracking, background tracking, mileage calculations, trip persistence, reports logic, email logic, AI logic, database logic.

**Deploy:** Do not upload every zip. One final Cloudflare upload when the full UI pass is complete.

---

## Next up

**Email Reports Screen** (`#emailSetup`) — polish and screenshot for approval.

**Success Screen** is frozen. Future work should focus on tracking reliability, AI journey detection, reports, exports, and performance — not further UI changes unless a genuine usability issue is found.
