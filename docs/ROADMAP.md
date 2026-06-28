# MilePilot Product Roadmap — Phase 2

**Phase 1 complete:** Design, onboarding, dashboard foundation (~90%)  
**Phase 2 focus:** Make MilePilot a working product, not a UI project.

---

## Progress snapshot

| Area | Status |
|------|--------|
| Design & branding | ~90% 🔒 Locked |
| Onboarding flow | ~95% 🔒 Locked |
| Dashboard foundation | ~90% 🔒 Locked |
| **Core tracking engine** | ✅ **MP-013 v2** — Sprint 1–3 complete |
| **PDF Reporting System** | ✅ **LOCKED** — MP-012 v11 |
| **Live tracking** | ✅ **FROZEN** v7.7.1 — see `docs/TRACKING_FROZEN.md` |
| Business intelligence | 🔄 **Phase 2 active** — Dashboard Intelligence (v7.8.0+) |
| **Tracker MVP production readiness** | ✅ **MP-025** — v8.4.0 |

---

## ✅ MP-025 — Production Readiness Sprint (Tracker MVP)

**Status:** Complete — ready for real-world phone testing  
**Version:** v8.4.0  
**Branch / PR:** `cursor/mp-025-production-readiness-ae00`  
**Doc:** `docs/MP-025-PRODUCTION-READINESS.md`

### Focus

No new features. Perfect the Tracker experience: onboarding confirmation, simplified dashboard, automatic shift completion, focused settings, history polish, reliability handling.

### Deploy

- Cache key: `milepilot-v8-4-0`
- Verify: https://app.milepilot.uk/version.txt
- Upload zip: `MilePilot-UPLOAD-v8.4.0.zip`

---

## ✅ PDF Reporting System — LOCKED

**Status:** LOCKED  
**Version:** MP-012 v11 (`MP-012-pdf-v11`)  
**Branch / PR:** `cursor/mp-012-pdf-layout-fix-ae00` → [#16](https://github.com/gypsom54/MilePilot/pull/16)

### Approved

- Branding approved
- Layout approved
- Typography approved
- Intelligence approved
- Accountant pages approved
- Large-number stress testing passed
- Empty state approved
- Weekly report approved
- QR verification approved
- **Ready for production**

### Policy

**No further work unless a genuine bug is found.**

Every extra tweak now carries risk — spacing regressions, layout bugs, large-number handling breaks, inconsistencies between report types. Treat the PDF engine as a finished feature.

**Health check after deploy:** `"reportVersion": "MP-012-pdf-v11"`

**Test pack:** [MilePilot-PDF-TEST-MP012-v11.zip](https://github.com/gypsom54/MilePilot/raw/cursor/mp-012-pdf-layout-fix-ae00/MilePilot-PDF-TEST-MP012-v11.zip)

---

## Sprint 1 — The Tracking Engine ⭐⭐⭐⭐⭐

**Goal:** Start Shift begins a real tracked shift.

When the user presses **Start Shift**:

- [x] GPS tracking
- [x] Shift timer
- [x] Route recording
- [x] Business miles calculation
- [x] Driving time
- [x] HMRC mileage estimate
- [x] Stop detection
- [x] Persist on background / tab switch
- [x] End shift → auto-save

*Note: True OS-level background GPS requires native app; PWA uses wake lock + persistence + auto GPS reconnect.*

---

## ✅ MP-013 — Tracking Engine v2

**Status:** Complete (deployed v7.4.0)  
**Version:** Tracking Engine v2 · App v7.4.0+  
**Branch / PR:** `cursor/mp-013-tracking-engine-ae00` → [#17](https://github.com/gypsom54/MilePilot/pull/17)

---

## Sprint 1–3 — Tracking & Live Shift ✅

See MP-013 deliverables below. **MP-014** adds QA, reliability, dev test mode, and background GPS documentation.

---

## MP-016 — Auto-Pilot Product Flow

**Status:** Complete  
**Version:** App v7.5.0  
**Philosophy:** You drive. MilePilot handles the paperwork.

See [docs/AUTO_PILOT.md](./AUTO_PILOT.md)

- End Shift → automatic save, PDF, email schedule (no export buttons on driving flow)
- Success screen: Done only
- Document Centre: all report management
- Dashboard: Start Shift / End Shift only

**Deploy:** MilePilot-UPLOAD-v7.5.0.zip

---

## MP-021 — AutoPilot First Philosophy

**Status:** Active  
**Version:** App v8.1.0+  
**Branch:** `cursor/mp-021-autopilot-ae00`

**Promise:** Set it up once. MilePilot does the rest.

See [docs/MP-021-AUTOPILOT-PHILOSOPHY.md](./MP-021-AUTOPILOT-PHILOSOPHY.md)

- Benefit-led onboarding copy (automation over manual tracking)
- Unified **Enable AutoPilot** step (replaces separate permission screens for new users)
- Email capture during report setup
- UX rule: every feature must pass "Can AutoPilot do this automatically?"

**Onboarding flow:** welcome → planPick → workType → reportSetup → autoPilotSetup → home

---

## MP-022 — Brand Messaging

**Status:** Active  
**Version:** App v8.2.0+  
**Branch:** `cursor/mp-022-brand-messaging-ae00`

See [docs/MP-022-BRAND-MESSAGING.md](./MP-022-BRAND-MESSAGING.md)

- Outcome-led copy throughout app (not feature-led)
- Universal self-employed language (not driver-only)
- AutoPilot as core product concept in user-facing text
- Tagline locked: **Drive • Track • Claim**

---

## MP-023 — North Star (AutoPilot Product Philosophy)

**Status:** Active — **master product philosophy**  
**Version:** App v8.3.0+  
**Branch:** `cursor/mp-023-north-star-ae00`

See [docs/MP-023-NORTH-STAR.md](./MP-023-NORTH-STAR.md)

- Mission: remove mileage administration from users' lives
- Dashboard = reassurance ("Is everything working?")
- Reports simply exist — no manual admin
- Product hierarchy: Layer 1 Tracker (no clutter) / Layer 2 Business (Pro)
- Golden question: Does this make the user's life easier?

---

## MP-017 — Live Tracking Screen & Map Strategy

**Status:** Complete  
**Version:** App v7.6.0  

See [docs/MP-017-LIVE-TRACKING.md](./MP-017-LIVE-TRACKING.md)

- Calm live tracking on Dashboard (status, timer, miles, supporting stats)
- Route preview map card — not full-screen
- History shift detail with route map
- Branded GPS permission blocked message
- PDF Route Map section + ASCII-safe labels

**Deploy:** MilePilot-UPLOAD-v7.6.0.zip

---

## MP-014 — Tracking QA & Live Shift Experience

**Status:** Complete  

### Delivered

- Start/End Shift reliability (busy guard, save error handling)
- Branded error messages (location, GPS, tracking paused, save failed)
- Background resume (`pageshow`, wake lock re-acquire, GPS reconnect)
- Developer test mode (`?dev=1`) — simulate miles, test shifts, reports
- QA checklist: [docs/MP-014-QA.md](./MP-014-QA.md)
- Background limits doc: [docs/TRACKING_BACKGROUND.md](./TRACKING_BACKGROUND.md)

**Deploy:** [MilePilot-UPLOAD-v7.4.1.zip](../MilePilot-UPLOAD-v7.4.1.zip)

---

## ✅ MP-013 deliverables (v2 engine)

- Reusable `frontend/js/tracking-engine.js` — single source of truth for shifts
- Start Shift → GPS, timer, live miles, HMRC estimate, route recording
- Live Command Centre: Shift In Progress, 🟢 Tracking, live timer, current journey
- Background persist (visibility / pagehide), wake lock, GPS auto-reconnect
- Rich shift storage: journey count, average speed, GPS points, created date
- End Shift → completion overlay (Great work today 👏) — superseded by MP-016 Auto-Pilot (Done only)
- Smart movement detection architecture (disabled — ready for future sprint)
- Branded GPS error handling (no browser alerts)

---

## Sprint 2 — Live Command Centre ⭐⭐⭐⭐⭐

Dashboard transforms while shift is active: live miles, time, claim, **End Shift**.

**Status:** ✅ Complete (MP-013)

---

## Sprint 3 — Shift Summary ⭐⭐⭐⭐⭐

End Shift → celebration overlay, report ready, share PDF.

**Status:** ✅ Complete (MP-013)

---

## Sprint 4 — Reports ⭐⭐⭐⭐⭐

**PDF engine: ✅ DONE (locked at MP-012 v11).** Remaining sprint scope:

- [ ] One-click share from app (wire existing PDF endpoint)
- [ ] Sunday / weekly email automation (Resend)
- [ ] In-app report preview flow polish (no PDF layout changes)
- [ ] Monthly / annual report triggers from live shift data

*Do not redesign PDF layout, typography, or page structure.*

---

## Platform vision — beyond mileage tracking

MilePilot stays beautifully simple at launch, with a clear path to a full business platform for self-employed drivers.

| Stage | Focus | Status |
|-------|--------|--------|
| **Today** | GPS tracking + automated mileage reports | ✅ FROZEN v7.7.1 |
| **Phase 2** | **Dashboard Intelligence** — day recap, AI insights, trends, HMRC | 🔄 v7.8.0+ |
| **Phase 3** | **History** — calendar month view, tap any day → report + map | Planned |
| **Phase 4** | **Business Hub** — mileage, income, fuel, parking, MOT, tax reserve, accountant export | Planned |
| **Eventually** | **AI assistant** — claim amounts, fuel spend, tax set-aside, profitable weeks | Planned |

Principle: **save the driver time, never add admin.**

---

## Sprint 5 — Dashboard Intelligence (Phase 2) ⭐⭐⭐⭐⭐

**Active.** Tracking screen is frozen — intelligence lives on the dashboard.

After a day of driving the dashboard shows:

- Good evening, {name} 👋
- **You drove** → hero miles → business miles today
- HMRC claim · journeys · driving time
- **AI Insight** — busiest Friday this month, vs last Friday, peak hours, month-over-month

See `docs/MP-018-DRIVER-INTELLIGENCE.md` and `docs/TRACKING_FROZEN.md`.

---

## Sprint 6 — Smart Assistant (Pulse) ⭐⭐⭐⭐☆

Contextual companion: weather, earning day, thresholds.

---

## Sprint 7 — Automation ⭐⭐⭐⭐⭐

Automatic reports, email summaries, tax / MOT / service reminders.

---

## Sprint 8 — Premium ⭐⭐⭐⭐⭐

Unlimited reports, AI insights, cloud backup, multi-vehicle, accountant access.

---

## North star feature — Evidence Pack

One button → professional PDF proof for Job Centre, HMRC, accountant:

- Every shift, maps, totals, timestamps, weekly/monthly summaries.

**PDF generation is production-ready.** Focus next on live data feeding reports and delivery automation (email, share).

---

## Deploy links (always)

- App: https://app.milepilot.uk  
- Backup: https://milepilot-app.pages.dev  
- Version: https://app.milepilot.uk/version.txt  

Upload: Cloudflare Pages → `milepilot-app` → 8 files from `MilePilot-UPLOAD-v7.4.0.zip` (includes `js/tracking-engine.js`)
