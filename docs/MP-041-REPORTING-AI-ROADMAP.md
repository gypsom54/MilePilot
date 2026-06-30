# MP-041 — Reporting, Shift Mode & AI Roadmap (LOCKED)

**Status:** 🔒 Locked — product and engineering decisions  
**Supersedes:** Stale reporting notes in `AUTO_PILOT.md` and open-ended Sprint 7 items  
**Aligns with:** `docs/MP-023-NORTH-STAR.md`

---

## Confirmed progress (TestFlight, June 2026)

| Capability | Status |
|------------|--------|
| Native iPhone app (TestFlight) | ✅ Working |
| Background location tracking | ✅ Working |
| Tracking continues when phone locked | ✅ Working |
| Stationary grace period (20 min default) | ✅ Working |
| Short stops no longer end trips immediately | ✅ Working |
| Reports **not** sent after every trip | ✅ Locked policy |

---

## Core promise

> **MilePilot never loses a journey.**

The customer installs once, turns on AutoPilot, and receives **daily, weekly, or monthly mileage summaries automatically** — on the schedule they chose.

- Every journey is recorded (as **Pending** until classified).
- Only **Business** trips enter HMRC totals and scheduled reports.
- **Personal** and **Pending** trips are excluded from report mileage.
- Pending count is shown as excluded — never silently merged into business totals.

---

## Reporting logic (LOCKED)

### What we do NOT do

- ❌ Send a report after every trip
- ❌ Send a report after every End Shift
- ❌ Email a PDF on every journey completion
- ❌ Include Personal trips in HMRC or report totals
- ❌ Include Pending trips in report mileage (show count only)

### What we DO

Reports are generated and emailed **only** when the user's selected frequency is due:

| Frequency | When sent | Period contents |
|-----------|-----------|-----------------|
| **Daily** | Once at end of day (6:00 PM) | All **Business** miles that day |
| **Weekly** | Once at end of week (Sunday 6:00 PM) | Total Business miles + daily breakdown |
| **Monthly** | Once at end of month (1st, previous month) | Total Business miles + weekly breakdown |

### Report contents (required)

- Total business miles
- Driving time
- Waiting / stationary time (where applicable)
- Number of business trips or shift segments
- HMRC estimate (business only)
- **Pending trips excluded** — with count and link to review inbox
- Route map thumbnails (on demand from stored coordinates)

### Implementation map

| Layer | File | Responsibility |
|-------|------|----------------|
| Schedule | `frontend/js/report-scheduler.js` | `isReportDue`, dedup per period |
| Trigger | `frontend/index.html` | `maybeSendScheduledReport()` on boot, foreground, post-shift |
| Payload | `frontend/index.html` | `buildScheduledReportPayload()` — business trips only + `pendingCount` |
| Render | `backend/reportEngine.js` | PDF + email HTML (MP-012 locked layout) |
| API | `backend/server.js` | `POST /reports/send`, `POST /reports/pdf` |

### End Shift behaviour (LOCKED)

When the user taps **End Shift**:

1. Save shift locally
2. Update Dashboard / History
3. Archive report metadata (local)
4. Sync email subscription preferences
5. Run `maybeSendScheduledReport()` **only if** a frequency is due

**No** automatic PDF generation. **No** automatic email. User opens Document Centre to view/download on demand.

---

## Taxi / cab shift mode (ROADMAP — preserve architecture)

**Goal:** For taxi, PHV, and cab drivers, work is a **shift**, not a chain of separate classified trips.

### Shift mode principles

| Principle | Detail |
|-----------|--------|
| Shift = work unit | One active shift; miles during shift default to Business context |
| Long waits | Rank, airport, station, customer wait — **do not end the shift** (stationary grace + shift mode) |
| Driving miles | Count toward Business while shift is active |
| Waiting time | Recorded separately (stationary / non-moving time) |
| End shift | Manual **End Shift**, or after long inactivity (configurable, user-informed) |

### Current state vs roadmap

| Today | Roadmap |
|-------|---------|
| Shift UI (Start / End Shift) | ✅ Exists |
| Auto-split into trips + Pending review | ✅ Default for all work types |
| `professional_driver` work type label | ✅ Exists in `plan-ux.js` |
| Dedicated shift-only mode (no per-trip modal) | 🔜 Future — preserve hooks in tracking engine |

**Do not remove** shift lifecycle (`startShift`, `completeShift`) or `shiftStops` / stationary timers when building shift mode — extend them.

---

## Future AI logic (ROADMAP — suggest, never decide)

### Learning goals (future)

MilePilot may learn over time:

- Usual start location
- Usual finish location
- Common work hours
- Regular waiting areas (ranks, airports)
- Repeated personal journeys

### Hard rules (LOCKED forever)

| Rule | Example |
|------|---------|
| AI **suggests** | “You’ve returned to your usual start point. End shift?” |
| AI **suggests** | “MilePilot thinks this is still part of your work shift. Continue tracking?” |
| User **confirms** | All classification and shift-end actions |
| Never auto-classify | `autoClassify: false` in `trip-classifier.js` |
| Never auto-end shift | No silent shift completion without user tap |

### Implementation map

| Layer | File | Today | Future |
|-------|------|-------|--------|
| Trip suggestions | `frontend/js/trip-classifier.js` | Heuristic labels on Pending modal | Richer context (locations, habits) |
| Dashboard insights | `frontend/js/driver-intelligence.js` | Data-backed copy | Habit-aware prompts |
| Shift prompts | (new) | — | Confirm-only shift end / continue |

---

## Decision checklist

Before shipping any reporting or AI change, confirm:

1. Does this send email/PDF more often than the user's chosen frequency? → **Reject**
2. Does this include Pending or Personal in business totals? → **Reject**
3. Does this classify or end a shift without user confirmation? → **Reject**
4. Does this increase decisions on the driving path? → **Reject** (North Star)

---

## Related docs

- `docs/MP-023-NORTH-STAR.md` — product philosophy
- `docs/MP-012` / `backend/reportEngine.js` — PDF layout (locked)
- `docs/MP-018-DRIVER-INTELLIGENCE.md` — dashboard intelligence
- `docs/AUTO_PILOT.md` — driving flow (aligned with this doc)
