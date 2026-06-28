# MP-034 — Beta Testing Checklist

**Version:** v8.8.3 (beta-ready)  
**Branch:** `cursor/mp-034-beta-qa-ae00`  
**Type:** QA verification + Pioneer beta prep — no new product features

Use this checklist before handing MilePilot to real self-employed testers. Every item should pass on a phone browser at **https://app.milepilot.uk** (or the current Pioneer deploy).

Pioneer cohort link: **https://app.milepilot.uk/?pioneer=1**

---

## Pre-flight

| Step | Action | Pass? |
|------|--------|-------|
| Deploy | Upload latest zip; confirm `https://app.milepilot.uk/version.txt` shows **v8.8.3** | ☐ |
| Cache | Hard-refresh or clear site data once after deploy | ☐ |
| HTTPS | Test on **https://** (GPS requires secure context) | ☐ |
| Device | Primary test on real phone (iOS Safari or Android Chrome) | ☐ |

---

## 1. First-time user flow

Clear all site data first (browser → Site settings → Clear data).

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 1.1 | Open MilePilot | Brief boot splash, then **Welcome** (“Your business. On AutoPilot.”) | ☐ |
| 1.2 | Tap **Continue →** | Location permission screen | ☐ |
| 1.3 | Enable location (or skip) | Reports frequency screen | ☐ |
| 1.4 | Choose report schedule | Email screen | ☐ |
| 1.5 | Enter email, continue | AutoPilot Ready screen | ☐ |
| 1.6 | Tap **Start First Shift** or complete setup | **Dashboard** loads (not welcome) | ☐ |
| 1.7 | Check Settings → Email | Email saved; no re-prompt on next launch | ☐ |

---

## 2. Returning user flow

Complete section 1 first, then:

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 2.1 | Refresh browser | Boot splash → **Dashboard** directly | ☐ |
| 2.2 | Close tab, reopen app | **Dashboard** directly | ☐ |
| 2.3 | Welcome screen | **Must not appear** | ☐ |
| 2.4 | Email / report setup | **Must not repeat** | ☐ |
| 2.5 | Time to dashboard | Under ~2 seconds after splash | ☐ |

---

## 3. Existing data detection

Simulate legacy users (DevTools → Application → Local Storage). Set **only** the listed key, remove `mp_onboard_complete`, refresh.

| Signal set | Expected route | Pass? |
|------------|----------------|-------|
| `mp_email` only | Dashboard | ☐ |
| `mp_report_frequency` only | Dashboard | ☐ |
| `mp_shifts` with ≥1 shift | Dashboard | ☐ |
| `mp_driver` or profile plan/work type | Dashboard | ☐ |
| None (empty storage) | Welcome onboarding | ☐ |

---

## 4. Dashboard (returning user)

After returning-user boot, confirm:

| Element | Expected | Pass? |
|---------|----------|-------|
| Greeting | Time-based hello (Good morning/afternoon/evening) | ☐ |
| AutoPilot status | ✓ AutoPilot Active or health check card | ☐ |
| Today’s miles | “Today’s Business” miles + driving time | ☐ |
| Next report | Scheduled report line (e.g. weekly Sunday 6pm) | ☐ |
| Primary action | **Start Shift** or **Start New Shift** | ☐ |
| Marketing welcome | **Must not** be the home screen | ☐ |

---

## 5. Reset onboarding (testing only)

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 5.1 | Settings → **Reset onboarding** | Welcome flow appears | ☐ |
| 5.2 | Complete FTUE again | Dashboard | ☐ |
| 5.3 | Normal users | Should never need this control | ☐ |

Settings shows: *“Testing only — not needed for normal use.”*

---

## 6. Install & access

| Step | Notes | Pass? |
|------|-------|-------|
| Open URL | https://app.milepilot.uk/?pioneer=1 | ☐ |
| Add to Home Screen | iOS: Share → Add to Home Screen; Android: Install prompt or “Add to Home” | ☐ |
| Standalone launch | Opens without browser chrome; GPS still works | ☐ |
| Pioneer banner | “MilePilot Pioneer Program” visible on Pioneer build | ☐ |

---

## 7. First shift test

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 7.1 | Tap **Start Shift** | “AutoPilot started” toast; live tracking UI | ☐ |
| 7.2 | Grant GPS if prompted | GPS status shows connected / locating | ☐ |
| 7.3 | Drive or simulate (dev: Simulate 2.5 mi) | Miles increment on dashboard | ☐ |
| 7.4 | Background test | Switch apps briefly; return — shift still active | ☐ |

---

## 8. Map test

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 8.1 | During active shift | Route map visible when GPS fix available | ☐ |
| 8.2 | Expand map (if shown) | Full-screen map with live position | ☐ |
| 8.3 | Weak GPS | Plain-English message, not technical error | ☐ |

---

## 9. End shift test

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 9.1 | Tap **End Shift** | Confirmation dialog with miles/time/HMRC | ☐ |
| 9.2 | Confirm end | Shift summary card; “Everything saved automatically” | ☐ |
| 9.3 | Tap **Done** | Returns to dashboard; today’s totals updated | ☐ |
| 9.4 | History tab | Completed shift appears on calendar | ☐ |

---

## 10. Report & email test

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 10.1 | Reports tab | Today/week/month totals match shifts | ☐ |
| 10.2 | Download / open report | PDF or printable report generates | ☐ |
| 10.3 | Email report (if configured) | Send succeeds or plain-English failure toast | ☐ |
| 10.4 | Post-shift auto-report | After end shift, report generates quietly (check Reports) | ☐ |

---

## 11. History test

| # | Step | Expected | Pass? |
|---|------|----------|-------|
| 11.1 | History → calendar | Days with shifts show miles and HMRC | ☐ |
| 11.2 | Tap a day | Shift detail with route map (if GPS route saved) | ☐ |
| 11.3 | Empty days | “No shift” — no crash | ☐ |

---

## 12. Feedback (Pioneer testers)

Settings → **Send feedback**. Ask testers to answer:

| Question | Required? |
|----------|-------------|
| How easy was MilePilot to use today? (1–10) | Yes |
| Did anything confuse you? | Optional |
| What would save you more time? | Optional |
| Any bugs? | Optional |

After **5 completed shifts**, feedback reminder may appear — testers can dismiss or share feedback.

Support email: **hello@milepilot.uk**

---

## 13. Known limitations

Tell testers upfront:

| Area | Limitation |
|------|------------|
| GPS | Requires HTTPS and location permission; accuracy varies indoors/urban canyons |
| Background | OS may pause GPS if battery optimisation is aggressive — disable for MilePilot if tracking stops |
| Offline | Shifts save locally; reports/email need connection |
| HMRC figures | Estimates for record-keeping — confirm with accountant |
| Notifications | Optional; not required for core tracking |
| Desktop | Optimised for mobile; desktop works but phone is primary |
| Pioneer metrics | Internal dashboard only (`?dev=1` or `?metrics=1`) — not shown to testers |
| Reset onboarding | Settings testing tool only — do not use in normal operation |

---

## 14. Sign-off

| Role | Name | Date | All critical paths pass? |
|------|------|------|---------------------------|
| QA | | | ☐ |
| Product | | | ☐ |

**Critical paths:** Sections 1, 2, 4, 7, 9 must pass before Pioneer send.

---

## Related docs

- `docs/MP-033-RETURNING-USER-ONBOARDING.md` — onboarding routing logic
- `docs/MP-032-PIONEER-PROGRAM.md` — Pioneer feedback & observability
- `docs/MP-030-PERFECT-FTUE.md` — first-time setup flow
