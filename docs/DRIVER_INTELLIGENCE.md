# Driver Intelligence Roadmap

MilePilot replaces fixed shift assumptions with adaptive learning. No AI makes automatic decisions — the app quietly learns patterns and only suggests actions. The user always confirms.

## Phase 1 — Default assumptions

- Typical work shift: **10 hours**
- After approximately 10 hours of work **and** 90 minutes of inactivity, MilePilot may suggest preparing the **Daily Report**
- Shifts are **never** ended automatically
- Trips are **never** classified automatically
- Reports are **never** sent before the user confirms

## Phase 2 — Learning (after ~2 weeks)

After 14 days and 10+ recorded shifts, MilePilot learns:

- Typical shift duration
- Typical work start and finish times
- Typical start and finish locations
- Common waiting locations (ranks, airports, queues)
- Repeated personal journeys

Suggestions (user must confirm):

- *"It looks like you've finished work for today."* → **Generate today's report?**
- *"It looks like you're beginning your normal work shift."* → **Start AutoPilot?**

## Daily report priority

1. **Manual End Shift** — prepares today's summary immediately
2. **Driver Intelligence** — likely end of day (learned finish time or location)
3. **90-minute inactivity** after learned or default shift duration
4. **One Daily Summary** — entire day's business mileage, never per-trip reports

## Storage

Learned data is stored locally in `mp_driver_intelligence` (localStorage).

## Principles

- Never automatically end shifts
- Never automatically classify trips
- Never automatically send reports
- The app quietly learns and reduces unnecessary interaction over time
