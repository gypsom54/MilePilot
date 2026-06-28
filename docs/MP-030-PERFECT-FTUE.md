# MP-030 — Perfect the First-Time User Experience (FTUE)

**Version:** v8.7.0  
**Branch:** `cursor/mp-030-ftue-ae00`  
**Type:** Onboarding + calm dashboard — no new tracking features

---

## Goal

A brand-new user should understand MilePilot in under 60 seconds and complete setup without instructions. Setup should feel like **enabling AutoPilot**, not configuring software.

**Promise:** Drive. Track. Claim. Everything else happens automatically.

---

## New setup flow (5 steps)

| Step | Screen | Action |
|------|--------|--------|
| 1 | Welcome | Drive • Track • Claim — *Your business. On AutoPilot.* → **Continue** |
| 2 | Location | Plain-English GPS explanation → **Enable Location** (auto-advances when granted) |
| 3 | Reports | Daily / Weekly / Monthly — one tap |
| 4 | Email | Where should we send them? |
| 5 | AutoPilot Ready | ✓ checklist → **Start First Shift** |

### Removed from the main path

- Name entry on welcome
- Plan picker (defaults to Tracker)
- Work type picker (defaults to Other)
- Vehicle selection (defaults to car)
- Separate AutoPilot permissions screen
- Notifications step (skipped silently)
- Legacy promise / knowYou / notifications flows

Users who completed onboarding before v8.7.0 are unaffected. Incomplete onboarding restarts at Welcome on upgrade.

---

## Calm dashboard (idle)

When everything is healthy, the dashboard reassures instead of overwhelming:

- **Today's Business** — miles + driving time only
- **✓ AutoPilot Active**
- **Weekly report scheduled**
- **Next report: Sunday 6:00 PM**

Pro insight cards, recent activity, and extra metrics are hidden on the calm idle view. If any health check fails, the full MP-029 warning list returns.

---

## QA checklist

| Path | Expected |
|------|----------|
| Fresh install | Welcome → 5 steps → Start First Shift |
| Location granted | Auto-advances to Reports within ~0.5s |
| Location denied | Can still Continue manually |
| No email | Blocked with toast on Email step |
| Complete setup | Dashboard shows calm reassurance |
| Reset onboarding (dev) | Returns to Welcome |
| Existing completed user | Goes straight to dashboard |

---

## Deploy

Upload `MilePilot-UPLOAD-v8.7.0.zip` — verify `https://app.milepilot.uk/version.txt` shows **v8.7.0**

Service worker cache: `milepilot-v8-7-0`
