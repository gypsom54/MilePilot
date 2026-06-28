# MP-025 — Production Readiness Sprint (Tracker MVP)

**Version:** v8.4.0  
**Branch:** `cursor/mp-025-production-readiness-ae00`  
**Status:** Complete — ready for real-world phone testing

---

## Product goal

The customer installs MilePilot once, completes setup once, and trusts it to work quietly in the background every day.

**Set it up once. MilePilot does the rest.**

This sprint adds **no new features**. It perfects the Tracker experience for production.

---

## What shipped

### Onboarding

- New **AutoPilot Ready** confirmation screen after Enable AutoPilot
- Checklist: location, motion, automatic reports, report schedule, ready to go
- Subtitle: *MilePilot is now working quietly in the background.*
- Primary CTA: **Start Tracking** (starts first shift)
- Secondary: **Go to dashboard**
- Stay-updated prompt suppressed after onboarding (reports configured in report setup)

### Dashboard (Tracker)

Tracker idle dashboard shows only:

- Greeting
- AutoPilot status panel
- Today's mileage (hero)
- Next scheduled report
- Start Shift

Hidden for Tracker: Today's Business card, Recent Activity, Pro intelligence cards, last-shift line in AutoPilot panel.

### Shift completion

- *Nice work.* / *Everything has been saved automatically.*
- Single **Done** button — no manual follow-up actions

### Settings (Tracker)

- Duplicate Reports card hidden (schedule managed via Business Profile)
- Email + profile rows remain; Pro-only toggles unchanged

### History

- Calendar rows show: date, miles, driving time, shift count, report status, route preview indicator
- Day detail: route map, summary, view report
- Shift detail: route, stats

### Reliability

- Offline banner when network unavailable
- Graceful copy for GPS denied, unavailable, reconnect, save failed, offline email/PDF
- Online/offline listeners with calm user messaging

---

## Production checklist

| Area | Status |
|------|--------|
| Onboarding under 2 minutes | ✅ |
| AutoPilot Ready confirmation | ✅ |
| Tracker dashboard simplified | ✅ |
| Tracking (timer, GPS, map, expand) | ✅ (frozen engine) |
| Shift completion automatic | ✅ |
| Reports accountant-ready | ✅ (MP-012 locked) |
| History story + drill-down | ✅ |
| Settings focused | ✅ |
| Reliability scenarios | ✅ |
| Polish & calm UX | ✅ |

---

## Out of scope (future versions)

- Expenses, tax tools, AI assistant, Business Hub
- Additional analytics or dashboard cards

---

## Deploy

- Cache key: `milepilot-v8-4-0`
- Verify: https://app.milepilot.uk/version.txt
- Upload: `MilePilot-UPLOAD-v8.4.0.zip` from `milepilot-upload-v2/`

---

## Acceptance test

A brand-new self-employed user can:

1. Install MilePilot
2. Complete setup (< 2 min)
3. See AutoPilot Ready confirmation
4. Track a full working day
5. End shift — everything saved automatically
6. Receive / view their report
7. Review history

Without help or documentation.

**Trust is the feature.**
