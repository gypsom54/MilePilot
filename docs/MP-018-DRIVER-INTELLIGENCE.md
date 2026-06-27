# MP-018 — Driver Intelligence Dashboard (Phase 2)

**Version:** v7.8.0  
**Status:** Phase 2 active — Dashboard Intelligence

## v7.8.0 — Day recap dashboard

When the driver has completed shifts today (`today_done` mode):

```
Good evening, Jonathan 👋
You drove
142.6 business miles today

Estimated HMRC claim    Journeys completed    You drove for
£78.43                  19                    6h 42m

AI Insight
Today was your busiest Friday this month.
```

Featured insights (data-backed only):

- Busiest [weekday] this month
- X% more/fewer than last [weekday]
- Peak driving window (e.g. 5pm and 8pm)
- More miles this month than last month

## Tracking policy

Live tracking UI is **frozen** at v7.7.1. See `docs/TRACKING_FROZEN.md`.

## Objective

Transform MilePilot from a mileage tracker into a business companion — calm, premium, data-driven intelligence without redesigning the UI.

## Architecture

Modular analytics live in `frontend/js/driver-intelligence.js` (`MPDriverIntelligence`).

| API | Purpose |
|-----|---------|
| `analyse(ctx, mode)` | Full dashboard intelligence bundle |
| `buildDailyHealth(ctx)` | Today metrics + streak |
| `buildWeeklyHealth(ctx)` | Week metrics + comparisons |
| `buildWeeklySummary(ctx)` | Sunday report data source |
| `buildMonthlyOverview(ctx)` | Monthly dashboard data model |
| `generateInsights(ctx, mode)` | Up to 3 data-backed insight lines |
| `future` | Stub hooks for expenses, receipts, tax, AI, export |

Context object: `{ shifts, today, now, active, fmtMoney, fmtShort }`

## Dashboard surfaces (existing design system)

1. **Today's Business** — unchanged daily snapshot
2. **Business Health** — `.cc-card` with `.cc-metrics` (today or week scope)
3. **This Week** — weekly summary card (evening / today_done / day_off / Monday)
4. **Business Insight** — up to 3 bullet insights from real data only
5. **Recent Activity** — unchanged

No new colours. No layout redesign. Cards hidden when no data.

## Insight rules

- Only show insights backed by shift data
- Never invent statistics
- Priority-ranked; top 3 shown
- Examples: longest journey today, busiest/quietest day, HMRC week, streak, vs yesterday/last week

## Weekly summary (report-ready)

`buildWeeklySummary()` returns miles, hours, HMRC, journeys, longest journey, best driving day, week-over-week % — powers future Sunday auto-reports.

## Monthly overview (data model)

`buildMonthlyOverview()` returns monthly miles, time, HMRC, shifts, journeys, average daily miles, month-over-month comparison.

## Future modules

`MPDriverIntelligence.future` reserves extension points for:

- Expenses
- Receipt Scanner
- Profit Dashboard
- Tax Estimates
- AI Insights
- Business Performance
- Accountant Export

## Performance

Pure functions on in-memory shift arrays. No new animations. Instant render on dashboard refresh.
