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
| **Core tracking engine** | Sprint 1 → in progress |
| **PDF Reporting System** | ✅ **LOCKED** — MP-012 v11 |
| Business intelligence | 0% |

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

*Note: True OS-level background GPS requires native app; PWA uses wake lock + persistence.*

---

## Sprint 2 — Live Command Centre ⭐⭐⭐⭐⭐

Dashboard transforms while shift is active: live miles, time, claim, **End Shift**.

---

## Sprint 3 — Shift Summary ⭐⭐⭐⭐⭐

End Shift → celebration overlay, report ready, share PDF.

---

## Sprint 4 — Reports ⭐⭐⭐⭐⭐

**PDF engine: ✅ DONE (locked at MP-012 v11).** Remaining sprint scope:

- [ ] One-click share from app (wire existing PDF endpoint)
- [ ] Sunday / weekly email automation (Resend)
- [ ] In-app report preview flow polish (no PDF layout changes)
- [ ] Monthly / annual report triggers from live shift data

*Do not redesign PDF layout, typography, or page structure.*

---

## Sprint 5 — Business Intelligence ⭐⭐⭐⭐⭐

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

**PDF generation is production-ready.** Focus next on live data feeding reports and delivery automation (email, share).

---

## Deploy links (always)

- App: https://app.milepilot.uk  
- Backup: https://milepilot-app.pages.dev  
- Version: https://app.milepilot.uk/version.txt  

Upload: Cloudflare Pages → `milepilot-app` → 6 files from `milepilot-upload-v2/`
