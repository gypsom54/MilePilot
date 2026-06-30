# MP-042 — Daily Summary Philosophy (LOCKED)

**Status:** 🔒 Locked — supersedes per-trip classification UX  
**Applies to:** All users — one intelligent tracking engine, no profession-specific forks  
**Aligns with:** `docs/MP-023-NORTH-STAR.md`, `docs/MP-041-REPORTING-AI-ROADMAP.md`

---

## Core promise

> **Your business. On AutoPilot.**

MilePilot does **not** create reports per trip.

MilePilot records activity throughout the day.

At the end of the working day it offers **one Daily Summary** review.

The **Daily Summary** is the user's primary interaction.

---

## Tracking engine (all users)

Throughout the day — **silent**:

| Record | Detail |
|--------|--------|
| GPS route | Full polyline + coordinates |
| Distance | Miles per journey |
| Duration | Total + moving time |
| Waiting time | `seconds − movingSeconds` |
| Start / finish | Time + location |
| Status | **Pending** until daily review |

### During the day we do NOT

- ❌ Send reports
- ❌ Show Business/Personal after every journey
- ❌ Push classification notifications
- ❌ Interrupt the user while working

### Implementation

| File | Role |
|------|------|
| `frontend/js/tracking-engine.js` | Single engine — movement, grace period, pending trips |
| `frontend/index.html` | `onTripRecorded()` — save silently, no modal |
| `frontend/js/trip-store.js` | `pending \| business \| personal` |

**No separate engines** for Taxi, Uber, Tradespeople, or other professions. Work type affects copy and future intelligence only.

---

## Daily review (end of day)

When the working day has likely ended:

- Hour ≥ 5:00 PM, **or**
- No movement for 20+ minutes after the last journey (aligned with stationary grace)
- User is not actively tracking

Dashboard shows:

```
Today's Activity Ready
Review today's journeys
```

User sees **every journey from that day** with:

- Route thumbnail
- Distance · duration · waiting time
- Start · finish
- Suggested Business or Personal (Driver Intelligence — suggestion only)

**Actions per journey:** Business · Personal · Edit · Leave Pending

**Finish:** Done reviewing · **Generate Daily Report**

### Implementation

| File | Role |
|------|------|
| `frontend/js/daily-review.js` | `shouldPromptDailyReview`, `markReviewComplete`, day totals |
| `frontend/index.html` | `openDailyReview()`, `finishDailyReview()`, banner UX |

---

## Daily report (one per day)

Generated **only after** the user completes daily review (or explicitly taps **Generate Daily Report**).

Includes:

- Total business miles
- Driving time
- Waiting / stationary time
- HMRC estimate
- Business journey count
- Route maps · timeline
- Pending journeys **excluded** (count shown)

Scheduled daily email (`maybeSendScheduledReport`) is **gated** on `MPDailyReview.isReviewComplete(today)`.

**Never multiple daily reports** for the same day.

---

## Weekly & monthly reports

| Frequency | Contents |
|-----------|----------|
| **Weekly** | All **Business** journeys confirmed that week · daily breakdown |
| **Monthly** | All **Business** journeys confirmed that month · weekly breakdown |

Unchanged scheduler: Sunday 6pm · 1st of month. Business only; pending excluded.

---

## Driver Intelligence (roadmap)

Reviews the **entire day**, not individual interrupt modals.

Future suggestions (user always confirms):

- "This looks like your normal school run."
- "We think this was Personal."
- "You've returned home after your normal workday."
- "Generate today's report?"

| Rule | Status |
|------|--------|
| Suggest | ✅ |
| Auto-classify | ❌ Forever |
| Auto-end shift | ❌ Forever |

---

## UX philosophy

| Time | Experience |
|------|------------|
| **During the day** | Silent — AutoPilot records |
| **End of day** | Useful — 30–60 seconds to review |
| **After review** | One professional daily report |

---

## Decision checklist

1. Does this prompt Business/Personal during the working day? → **Reject**
2. Does this send more than one daily report? → **Reject**
3. Does this fork tracking logic by profession? → **Reject**
4. Does AI classify without user tap? → **Reject**
