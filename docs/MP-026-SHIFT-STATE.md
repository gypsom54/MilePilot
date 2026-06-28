# MP-026 — Fix Shift State Logic (Single Source of Truth)

**Version:** v8.4.1  
**Branch:** `cursor/mp-026-shift-state-ae00`  
**Type:** Production bug fix — required before beta

---

## Problem

Dashboard and tracking engine could disagree on shift state. The UI sometimes showed **Start Shift** while the engine believed a shift was active — tapping the button opened the End Shift confirmation.

Root cause: dashboard mode (`today_done`, time-of-day greetings) was computed independently from engine `ccState`, and UI decisions used a duplicated local `ccState` variable that could desync.

---

## Solution

Introduced **`shift.status`** as the single source of truth in `tracking-engine.js`:

| Status | Meaning |
|--------|---------|
| `idle` | No active shift — show Start Shift / Start New Shift |
| `tracking` | Shift in progress — show End Shift |
| `ending` | User confirmed end — brief transition |
| `saving` | Persisting route, history, reports |
| `completed` | Completion screen visible |
| `idle` | After Done — ready for next shift |

Every screen reads status via `MPTracking.getShiftStatus()` / `getShiftStatus()` — never infers state independently.

---

## Dashboard rules

- `idle` → Start Shift (or Start New Shift if today has journeys)
- `tracking` → End Shift + live tracking UI
- `saving` → Disabled button: "Saving your shift..."
- `completed` → Completion overlay only; primary button hidden
- Done → `acknowledgeShiftComplete()` → `idle`

End Shift confirmation **only** opens when `shift.status === tracking`.

---

## Engine API (MP-026)

| Method | Role |
|--------|------|
| `getShiftStatus()` | Read current status |
| `startShift()` | Sets `tracking` immediately (before GPS) |
| `requestEndShift()` | `tracking` → `ending` |
| `completeShift(claimFn)` | `ending` → `saving` → `completed` |
| `acknowledgeShiftComplete()` | `completed` → `idle` |
| `forceIdle()` | Dev/reset helper |

Legacy `ccState` / `isActive()` remain for compatibility (`active` = `tracking` only).

---

## Refresh handling

- Active shift in `mp_active_shift` → restore as `tracking`
- No active shift → `idle`
- Completed state is in-memory only; refresh after save returns to `idle` with shift in history

---

## Acceptance tests

- ✓ Fresh install → Start Shift visible
- ✓ Tap Start Shift → immediately `tracking` / End Shift
- ✓ Active shift → End Shift visible
- ✓ Confirm end → Saving → Completed
- ✓ Done → Start New Shift (if today has miles) or Start Shift
- ✓ Refresh during tracking → still tracking
- ✓ Refresh after completed shift → Start New Shift
- ✓ Start Shift never opens End Shift confirmation
