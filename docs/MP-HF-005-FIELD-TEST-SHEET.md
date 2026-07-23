# MP-HF-005 — Real-Device Test Sheet

**Build under test:** v8.43.73 (MP-HF-005 diagnostic)  
**Device:** _______________________ **iOS:** __________ **Tester:** __________ **Date:** __________

**Before each test:** Fresh install OR note carry-over state. Export lifecycle ledger after test (Settings → Tracking Debug → Export Lifecycle Ledger).

---

## TEST A — Backgrounded

| Step | Done | Notes |
|------|------|-------|
| Fresh install | ☐ | |
| Complete onboarding | ☐ | |
| Grant Always Allow | ☐ | |
| Leave app in background (state B) | ☐ | |
| Lock phone (state C) | ☐ | |
| Drive ≥10 min ≥10 mph | ☐ | |
| Trip started without reopen? | ☐ PASS / ☐ FAIL | |

**Ledger file attached:** ☐  
**Result:** ☐ PASS ☐ FAIL ☐ NOT TESTED

---

## TEST B — First-run exit (P0)

| Step | Done | Notes |
|------|------|-------|
| Fresh install | ☐ | |
| Complete onboarding + Always Allow | ☐ | |
| Exit **without** manually reopening (state G) | ☐ | |
| Lock phone | ☐ | |
| Drive | ☐ | |
| Trip started? | ☐ PASS / ☐ FAIL | |

**Ledger file attached:** ☐  
**Result:** ☐ PASS ☐ FAIL ☐ NOT TESTED

---

## TEST C — Force-quit (document only)

| Step | Done | Notes |
|------|------|-------|
| AutoPilot armed + permissions OK | ☐ | |
| Swipe app away (state D) | ☐ | |
| Drive | ☐ | |
| Actual iOS behaviour | | |

**Do not treat as ordinary background PASS.**  
**Result:** ☐ PASS ☐ FAIL ☐ NOT TESTED (expected limitations)

---

## TEST D — Device restart

| Step | Done | Notes |
|------|------|-------|
| Restart phone (state F) | ☐ | |
| Do not open MilePilot | ☐ | |
| Drive | ☐ | |
| Actual behaviour | | |

**Result:** ☐ PASS ☐ FAIL ☐ NOT TESTED

---

## TEST E — Stationary false-positive

| Step | Done | Notes |
|------|------|-------|
| Phone stationary indoors ≥90 min | ☐ | |
| No trip created | ☐ PASS / ☐ FAIL | |

**Ledger file attached:** ☐  
**Result:** ☐ PASS ☐ FAIL ☐ NOT TESTED

---

## TEST F — Full lifecycle

| Step | Done | Notes |
|------|------|-------|
| Automatic trip start | ☐ | |
| Locked-screen tracking | ☐ | |
| Manual or auto stop | ☐ | |
| 90 min idle auto-end | ☐ | |
| Journey saved | ☐ | |
| Report generated | ☐ | |
| Email delivered | ☐ | |

**Ledger file attached:** ☐  
**Result:** ☐ PASS ☐ FAIL ☐ NOT TESTED

---

## Release gate

| Tests required for ROAD-TESTED AUTOPILOT PASS | A | B | E | F |
|------------------------------------------------|---|---|---|---|
| Must all PASS | ☐ | ☐ | ☐ | ☐ |

**Overall label:** ☐ ROAD-TESTED AUTOPILOT PASS ☐ CANDIDATE — NOT FIELD VERIFIED
