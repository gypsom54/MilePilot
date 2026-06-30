# MilePilot AutoPilot Flow — Locked (v8.1.0)

## Core Promise

> Install once, turn on AutoPilot, and do not have to think about mileage again.

MilePilot captures journeys silently, learns routines, and presents a calm end-of-day review. The driver is never interrupted all day with Business/Personal questions.

**Review → Confirm → Report sent** is the primary daily interaction.

---

## Tracking Modes

| Mode | Best for | Behaviour |
|------|----------|-----------|
| **Smart Mode** (default) | Long-term default | Records quietly all day like a shift. End-of-day timeline review with suggestions. User always confirms. |
| **Trip Mode** | Estate agents, sales reps, tradespeople | Each journey saved as Pending. Classify Business/Personal after each trip. |
| **Shift Mode** | Taxi, cab, Uber, delivery | One working shift. Waiting time included. Business by default. No mid-shift prompts. |

Settings → **Tracking Style** switches modes. Legacy `pending` style migrates to Trip Mode.

---

## Classification Rules

| Status | Reports | HMRC | Business totals |
|--------|---------|------|-----------------|
| **Pending** | Excluded | Excluded | Excluded |
| **Business** | Included | Included | Included |
| **Personal** | Excluded | Excluded | Excluded (kept in history) |

Driver Intelligence may **suggest** classifications. It never silently decides.

---

## Daily Flow

### Morning
1. User leaves home; phone stays in pocket.
2. Background GPS detects movement.
3. Recording starts silently — no immediate Business/Personal prompt.

Optional (Phase 2): high-confidence prompt — *"Looks like you're starting your usual workday. Start AutoPilot?"*

### During the day
- No prompts after every stop.
- Short stops continue the same journey/shift (stationary grace periods).
- Shift/Smart modes: waiting at ranks, airports, stations does not split the session.

### End of day
Trigger: manual End Shift, return to base + idle, ~90 min idle after typical shift length, or ~10–12 h worked.

Prompt:
- **Title:** Looks like you've finished work today
- **Body:** Review today's journeys and generate your mileage report.
- **Buttons:** Review Today · Later · End shift

### Daily Timeline Review
- Timeline of segments, journeys, and waiting periods.
- Each item shows a **suggested** classification (Smart Mode).
- Actions: Business · Personal · Pending · Confirm all suggestions.
- **Generate mileage report** opens Report Centre (business-only; pending excluded).

---

## Report Timing

- **Never** email a report after each trip.
- **Daily:** one report per day, after end-of-day review or confirmation.
- **Weekly / Monthly:** business mileage only; pending always excluded.
- If pending trips exist before report generation, user is notified and can review first.

---

## Driver Intelligence Roadmap

Learns (suggests only):
- Usual start/finish locations and times
- Average shift length
- Regular ranks, airports, school runs, personal routes

Examples:
- *"This looks like your usual school run. Mark as Personal?"*
- *"You've returned to your usual start point. End shift?"*

User always has final control.

---

## Technical Notes

- Storage: `mp_shifts`, `mp_business_profile.trackingStyle`, `mp_driver_intelligence`
- Helpers: `isTripMode()`, `isShiftMode()`, `isSmartMode()`, `isContinuousMode()`
- UI: `#dailyReview`, `openDailyReview()`, `buildDailyTimeline()`
- Version: **8.1.0** (`APP_VERSION`)
