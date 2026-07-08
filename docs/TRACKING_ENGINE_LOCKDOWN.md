# MilePilot — Tracking Engine Lockdown (Production Milestone)

**Status:** 🔒 LOCKED — Production milestone, July 2026
**Field-validated:** TestFlight builds 12–14 (closed-app AutoPilot, background, lock-screen)

> **Major production milestone.** Manual tracking, background tracking,
> lock-screen tracking, AutoPilot mode, and motion-detected trip recording are
> all working and field-validated. **Do not refactor or redesign the working
> tracking engine unless required to fix a verified bug.**

This document sits on top of the existing tracking contracts and extends the
lock to the AutoPilot / motion / closed-app capabilities proven on the road:

- [TRACKING_CONTRACT.md](./TRACKING_CONTRACT.md) — machine-verified core contract (MP-043)
- [TRACKING_RELIABILITY_LOCKDOWN.md](./TRACKING_RELIABILITY_LOCKDOWN.md) — architecture audit
- [TRACKING_BACKGROUND_VITAL_LOCK.md](./TRACKING_BACKGROUND_VITAL_LOCK.md) — background/locked lock
- [AUTOPILOT_MOTION.md](./AUTOPILOT_MOTION.md) — motion detection
- [AUTO_END_TRIP.md](./AUTO_END_TRIP.md) — 90-minute idle logic
- Governed by [PRODUCT_VISION_MASTER.md](./PRODUCT_VISION_MASTER.md)

---

## Protected capabilities (do not break)

| Capability | Where | Status |
|-----------|-------|--------|
| **Manual tracking** | `startShiftCommandCentre` / `endShiftCommandCentre` (`frontend/index.html`) | 🔒 Locked |
| **AutoPilot tracking** | `MPAutoPilotMotion` (`frontend/js/autopilot-motion.js`) + `initAutoPilotMotion` | 🔒 Locked |
| **Background GPS** | `src/locationTask.js` (`expo-task-manager`), `startBackgroundGpsPoll` | 🔒 Locked |
| **Lock-screen tracking** | `src/nativeTrackingEngine.js` authoritative engine + resume sync | 🔒 Locked |
| **Motion detection** | `MPAutoPilotMotion` + `src/nativeAutopilot.js` (closed-app) | 🔒 Locked |
| **Closed-app auto-start** | `onAutopilotBackgroundLocation` + `hydrateNativeAutopilot` | 🔒 Locked |
| **Trip notifications** | `sendAutopilotNotification`, `notifyTripStarted` (deduped) | 🔒 Locked |
| **90-minute idle logic** | `MPTripAutoEnd` (`frontend/js/trip-auto-end.js`) + `src/nativeAutoEnd.js` | 🔒 Locked |
| **Report trigger pipeline** | `triggerAutopilotShiftReport` → `MPSummaryReports.onShiftEnded` | 🔒 Locked |

Reports, PDFs, and email templates remain locked — see
[TEMPLATE_LOCK_REPORTS.md](./TEMPLATE_LOCK_REPORTS.md) and
`.cursor/rules/vital-reports-pipeline.mdc`.

---

## Anti-regression guarantees added this milestone

These fixes are part of the lock and must not be reverted:

- **Sync flood guard** — background sync buffer coalesces to the latest payload
  only (`src/locationTask.js`), preventing the 100+ notification/crash loop on
  app resume.
- **End-shift guard** — `mp_shift_end_guard` blocks re-restoring a just-ended
  trip; `endShiftCommandCentre` is re-entrancy protected.
- **Report dedupe** — `mp_report_sent_<shiftId>` ensures one report per trip;
  notifications only fire when email actually sends.
- **Native auto-end once** — `nativeAutoEnd.js` stops the trip a single time and
  rate-limits scheduled notifications.
- **Blue-screen recovery** — WebView reloads on iOS content-process termination
  (`onContentProcessDidTerminate` / `onRenderProcessGone`).

---

## Change policy

1. **No refactors.** Only edit tracking code to fix a **verified, reproduced bug**.
2. Get explicit product sign-off before any tracking change.
3. Run `node scripts/verify-tracking-contract.js` and `node tests/native-autopilot.test.js`.
4. Re-run the field checklist below on a real device before shipping.
5. Bump `TRACKING_ENGINE_V` + update `scripts/tracking-contract.json` only if behaviour intentionally changes.

---

## Field verification checklist (run before any tracking release)

Run each in **Manual** and **AutoPilot** mode:

| Scenario | Manual | AutoPilot |
|----------|--------|-----------|
| Screen on — miles count live | ☐ | ☐ (auto-starts) |
| App backgrounded — miles keep counting | ☐ | ☐ |
| Phone locked — miles keep counting | ☐ | ☐ |
| App fully closed — trip detected | n/a | ☐ |
| Trip start notification (once) | n/a | ☐ |
| 90-min idle auto-end (once) | ☐ | ☐ |
| Report emailed once (no spam) | ☐ | ☐ |
| Mileage matches external GPS reference | ☐ | ☐ |

Do **not** ship if any applicable row fails.

---

## Do NOT

- Do not alter locked PDFs or email templates.
- Do not break any protected capability above.
- Do not redesign the tracking engine for cosmetic reasons.
- Do not remove the anti-regression guards.
