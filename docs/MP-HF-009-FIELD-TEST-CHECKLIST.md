# MP-HF-009 — Field Test Checklist

**Device:** Real iPhone with TestFlight build 16 (`recovery-hf009` profile)  
**Pre-flight:** Settings → Recovery Validation — confirm all identities match before driving

---

## Pre-flight verification

- [ ] Fresh install or clean test device
- [ ] TestFlight build **16** installed
- [ ] Settings → **Recovery Validation (MP-HF-009)** shows:
  - [ ] commit contains `9b91907`
  - [ ] APP_VERSION `8.43.63`
  - [ ] bundle hash matches repo `recovery-build-identity.json`
  - [ ] nativeAutoPilot detected: **YES**
  - [ ] native bridge detected: **YES**
  - [ ] recovery candidate: **YES**
- [ ] `https://app.milepilot.uk/version.txt` returns `8.43.63`

---

## TEST 1 — Fresh install auto-start

1. Delete app if previously installed
2. Install from TestFlight
3. Complete onboarding
4. Grant location (Always) and notifications permissions
5. **Exit immediately — do NOT manually reopen MilePilot**
6. Lock phone
7. Drive

| Expected | Pass |
|----------|------|
| AutoPilot starts automatically without reopening app | ☐ |

**Notes:**

---

## TEST 2 — Journey survives lock + other apps

1. Drive normally
2. Lock screen
3. Open Spotify or another app
4. Continue driving

| Expected | Pass |
|----------|------|
| Journey continues uninterrupted | ☐ |

**Notes:**

---

## TEST 3 — Auto-end on idle

1. Stop driving
2. Allow idle timeout (do not end manually)

| Expected | Pass |
|----------|------|
| Journey ends automatically | ☐ |

**Notes:**

---

## TEST 4 — Report pipeline

After TEST 3 completes, verify:

| Expected | Pass |
|----------|------|
| Trip saved in History | ☐ |
| Mileage correct | ☐ |
| Report generated | ☐ |
| PDF generated | ☐ |
| Email delivered | ☐ |

**Notes:**

---

## TEST 5 — No false journey

1. Leave phone stationary for extended period (30+ minutes)

| Expected | Pass |
|----------|------|
| No false journey started | ☐ |

**Notes:**

---

## Overall result

| Criterion | Pass |
|-----------|------|
| TEST 1 — Auto-start without reopen | ☐ |
| TEST 2 — Locked + other apps | ☐ |
| TEST 3 — Auto-end | ☐ |
| TEST 4 — Report / PDF / email | ☐ |
| TEST 5 — No false journey | ☐ |

### Verdict (circle one)

- **PASS** — All tests passed → recovered engine validated on device
- **FAIL** — Any test failed → export diagnostics, do not change code, compare `a84a0c4`

---

## If TEST 1 fails but others pass

Likely isolated issue: `finishOnboarding()` calls `ensureAutopilotArmed()` without `await` (arming race on first-run exit). Document this — do not fix until analysis complete.

---

## Diagnostic export (on FAIL)

1. Settings → Recovery Validation → screenshot or copy full text
2. Enable debug: `localStorage.setItem('mp_debug','1')` → Tracking Debug → copy state
3. Note TestFlight build number, time of test, iOS version
4. Attach to MP-HF-009 failure analysis
