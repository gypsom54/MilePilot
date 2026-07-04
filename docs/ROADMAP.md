# MilePilot Product Roadmap — Phase 2

**Vision locked:** See [VISION_LOCK.md](./VISION_LOCK.md) — Tracker vs Business platform direction.

**Phase 1 complete:** Design, onboarding, dashboard foundation (~90%)  
**Phase 2 focus:** Core product — tracking reliability, AutoPilot, classification, reports. Onboarding is frozen; see [DEVELOPMENT_PRIORITIES.md](./DEVELOPMENT_PRIORITIES.md).

---

## Progress snapshot

| Area | Status |
|------|--------|
| Design & branding | ~90% 🔒 Locked |
| Onboarding flow (`#knowYou` MP-002) | **100% 🔒 Frozen** — production-ready; bug fixes only |
| Dashboard foundation | ~90% 🔒 Locked |
| **Core tracking engine** | Sprint 1 → in progress |
| Reports | ~10% |
| Business intelligence | Phase 4 — Intelligence Layer in progress |

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

*Note: True OS-level background GPS requires native app; PWA uses wake lock + persistence.*

---

## Sprint 2 — Live Command Centre ⭐⭐⭐⭐⭐

Dashboard transforms while shift is active: live miles, time, claim, **End Shift**.

---

## Sprint 3 — Shift Summary ⭐⭐⭐⭐⭐

End Shift → celebration overlay, report ready, share PDF.

---

## Sprint 4 — Reports ⭐⭐⭐⭐⭐

Daily / weekly / monthly, HMRC-ready PDFs, maps, timeline, one-click share.

---

## Sprint 5 — Business Intelligence ⭐⭐⭐⭐⭐

**MilePilot Intelligence Layer** — teach the app to understand the numbers.

- [x] Smart insights (rule-based, multiple per dashboard)
- [x] Monday morning weekly briefing
- [x] Monthly dashboard with progress bar + daily chart
- [x] Weekly goals (miles + HMRC estimate)
- [x] Driver Score (record keeping habits)
- [ ] Driver health reminders (Phase 9)
- [ ] Pulse AI companion tab (Phase 6)
- [ ] Business Hub / Pro tier (Phase 5) — see [BUSINESS_HUB_VISION_LOCK.md](./BUSINESS_HUB_VISION_LOCK.md) 🔒 vision only

Earning patterns, best hours, year-to-date savings — business coach.

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

---

## Platform (vision lock — architecture only)

| Milestone | Status |
|-----------|--------|
| Business Profile (`mp_business_profile`) | ✅ In app |
| Profession personalisation | ✅ In app |
| Experience tier definitions (Tracker / Business) | ✅ Architecture |
| Feature gating helpers | ✅ Architecture |
| Experience onboarding step | 🔜 Future |
| Tracker vs Business billing | 🔜 Future |
| Business-tier features (expenses, receipts, etc.) | 🔜 Future |

Target pricing: Tracker £5.99/mo · Business £9.99/mo (not shown in app yet).

---

## Deploy links (always)

- App: https://app.milepilot.uk  
- Backup: https://milepilot-app.pages.dev  
- Version: https://app.milepilot.uk/version.txt  

Upload: Cloudflare Pages → `milepilot-app` → 6 files from `milepilot-upload-v2/`
