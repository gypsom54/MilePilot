# MilePilot UI Lock

**Status:** Active — UI Lockdown First (June 2026)  
**Purpose:** Single source of truth for screen polish status during Phase 1.

> **Rule:** Locked screens must not be changed again unless there is a genuine bug.

**Related docs:**
- [UI_LOCK_NAVIGATION.md](./UI_LOCK_NAVIGATION.md) — bottom navigation dock
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

✅ **Dashboard** (Locked)  
✅ **Bottom Navigation** (Locked)  
⬜ **Start Shift**  
⬜ **Live Tracking**  
⬜ **AI Review**  
✅ **Reports** (Locked)  
⬜ **History** (Next up)  
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
| Background Permission Screen | ✅ Locked | `#permissions` `data-mp="MP-004"` `data-locked="true"` | |
| Email Reports Screen | 🟡 In Review | `#emailSetup` `data-mp="email"` | Step 5 of 6 |
| Success Screen | ✅ Locked | `#onboardReady` `data-mp="onboard-ready"` `data-locked="true"` | |
| Dashboard | ✅ Locked | `#home` `data-mp="MP-006"` `data-locked="true"` | See [UI_LOCK_DASHBOARD.md](./UI_LOCK_DASHBOARD.md) |
| Bottom Navigation | ✅ Locked | `.nav` `#nav` | See [UI_LOCK_NAVIGATION.md](./UI_LOCK_NAVIGATION.md) |
| Start Shift | ⬜ Pending | `#home` → `#ccPrimaryBtn` | Dashboard idle CTA — frozen with Dashboard |
| Live Tracking | ⬜ Pending | `#tracking` | |
| AI Review | ⬜ Pending | `#home` → `#ccSummary` / `#journeyReviewPanel` | |
| Reports | ✅ Locked | `#reports` `data-mp="MP-008"` `data-locked="true"` | See [UI_LOCK_REPORTS.md](./UI_LOCK_REPORTS.md) |
| History | 🟡 In Review | `#history` | Next up — Phase 1 polish |
| Settings | ⬜ Pending | `#settings` | |
| Subscription | ⬜ Pending | `#subscriptionPaywall` | |

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

**History** (`#history`) — Phase 1 polish (dashboard visual standard).

**Locked:** Dashboard v8.43.23 · Reports v8.43.22 · Navigation v8.43.21. See [UI_LOCK_DASHBOARD.md](./UI_LOCK_DASHBOARD.md) and [UI_LOCK_REPORTS.md](./UI_LOCK_REPORTS.md).
