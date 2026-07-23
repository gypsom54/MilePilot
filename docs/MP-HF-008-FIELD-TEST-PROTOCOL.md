# MP-HF-008 — Field Test Protocol (Recovered Native AutoPilot)

**Candidate:** commit `9b91907` · branch `cursor/mp-hf-007-recover-84363-19bd`  
**Label:** RECOVERED NATIVE AUTOPILOT CANDIDATE — FIELD TEST REQUIRED  
**Do not label PASS from this sheet until all required tests complete on a real iPhone.**

---

## Build identity (record before testing)

| Field | Value |
|-------|-------|
| Git commit | `9b91907fef6146d20aa905099782bac7deaed254` |
| APP_VERSION | 8.43.63 |
| version.txt | 8.43.57 (known mismatch) |
| iOS buildNumber | 15 |
| EAS build ID | _______________ |
| TestFlight build # | _______________ |
| Web bundle URL | _______________ |
| Web bundle SHA-256 (`frontend/index.html`) | `d665c6f5bce452e3dacd6fdf13d51cc7b4a6e2f89a3ae8b377da6e3cbe642724` |
| `nativeAutopilot.js` SHA-256 | `453bee1c43e0fbd51b3079d328e3a613076647fb81e650cc25754f6a467ae1ee` |

---

## TEST 1 — Fresh install / first-run activation (P0)

| Step | Done | Result |
|------|------|--------|
| Uninstall MilePilot | ☐ | |
| Install recovered candidate (native + matching web) | ☐ | |
| Complete onboarding, choose AutoPilot | ☐ | |
| Grant permissions + Always Allow | ☐ | |
| **Do NOT manually reopen after onboarding** | ☐ | |
| Lock phone | ☐ | |
| Drive ≥10 min at highway speed | ☐ | |
| Trip starts automatically | ☐ PASS / FAIL / NOT TESTED |

---

## TEST 2 — Background and lock screen

| Step | Done | Result |
|------|------|--------|
| Open MilePilot, confirm AutoPilot armed | ☐ | |
| Background app (state B) | ☐ | |
| Lock phone (state C) | ☐ | |
| Drive | ☐ | |
| Journey continues, miles increase | ☐ PASS / FAIL / NOT TESTED |

---

## TEST 3 — Other app usage

| Step | Done | Result |
|------|------|--------|
| Drive with another app foreground (e.g. maps) | ☐ | |
| Music/audio app running (e.g. Spotify) | ☐ | |
| Tracking continues | ☐ PASS / FAIL / NOT TESTED |

---

## TEST 4 — Phone call

| Step | Done | Result |
|------|------|--------|
| Hands-free call during active trip | ☐ | |
| Tracking continues | ☐ PASS / FAIL / NOT TESTED |

---

## TEST 5 — Journey end

| Step | Done | Result |
|------|------|--------|
| Stop driving | ☐ | |
| Idle detection begins | ☐ | |
| Auto-end after configured idle (90 min) OR manual end | ☐ | |
| Journey saved exactly once | ☐ PASS / FAIL / NOT TESTED |

---

## TEST 6 — Reporting

| Step | Done | Result |
|------|------|--------|
| Mileage correct | ☐ PASS / FAIL |
| Report generated | ☐ PASS / FAIL |
| PDF unchanged design | ☐ PASS / FAIL / NOT TESTED |
| Email delivered | ☐ PASS / FAIL |

---

## TEST 7 — Stationary false-positive

| Step | Done | Result |
|------|------|--------|
| Phone stationary indoors ≥90 min | ☐ | |
| No false journey | ☐ PASS / FAIL / NOT TESTED |

---

## Release gate

Tests **1, 2, 5, 7** must PASS to classify engine as historically validated.

**Overall:** ☐ HISTORICALLY VALIDATED ☐ CANDIDATE REJECTED ☐ INCONCLUSIVE

Attach: Xcode device logs filtered for `NativeAutopilot`, `BG GPS`, lifecycle export if available.
