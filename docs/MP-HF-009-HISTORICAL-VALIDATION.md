# MP-HF-009 — Historical Recovery Build Validation

**Spec:** MP-HF-009  
**Priority:** P0 — SINGLE DECISIVE FIELD TEST  
**Status:** RECOVERED NATIVE AUTOPILOT CANDIDATE — FIELD TEST REQUIRED

---

## 1. Objective

Produce **one** historically accurate build from frozen commit `9b91907` and validate it on a real iPhone. No tracking changes, no architecture work, no fixes (including the `finishOnboarding()` arming race).

---

## 2. Frozen Recovery Commit

| Field | Value |
|-------|-------|
| **Commit** | `9b91907fef6146d20aa905099782bac7deaed254` |
| **APP_VERSION** | `8.43.63` |
| **iOS buildNumber (HF-009)** | `16` |
| **EAS profile** | `recovery-hf009` |
| **Alternate candidate (if FAIL)** | `a84a0c4` |

### Files that must NOT be modified

- `src/nativeAutopilot.js`
- `src/expoLocationBridge.js`
- `src/locationTask.js`
- `frontend/js/autopilot-motion.js`
- `frontend/js/trip-auto-end.js`
- Boot order (`index.js`)
- Onboarding logic
- Tracking thresholds / timing values
- Native bridge handlers
- Report pipeline

MP-HF-009 adds **read-only provenance diagnostics only**.

---

## 3. Final Build Identity

Run before any deploy or EAS build:

```bash
npm run generate:recovery-provenance
```

This writes `recovery-build-identity.json` and `frontend/recovery-build-identity.json` with:

| Field | Purpose |
|-------|---------|
| `git.commit` | Full SHA of build HEAD |
| `git.branch` | Branch name |
| `appVersion` | `APP_VERSION` from `frontend/index.html` |
| `versionTxt` | `frontend/version.txt` |
| `iosBuildNumber` | From `app.config.js` |
| `easProfile` | `recovery-hf009` |
| `bundleHash` | SHA-256 of recovery web bundle files |
| `nativeSourceHash` | SHA-256 of native engine source files |
| `webAppUrl` | Pinned URL loaded by TestFlight shell |
| `recoveryCandidate` | `true` |

### Critical file hashes @ frozen base (`9b91907`)

| File | SHA-256 |
|------|---------|
| `frontend/index.html` | `d665c6f5bce452e3dacd6fdf13d51cc7b4a6e2f89a3ae8b377da6e3cbe642724` |
| `src/nativeAutopilot.js` | `453bee1c43e0fbd51b3079d328e3a613076647fb81e650cc25754f6a467ae1ee` |
| `src/expoLocationBridge.js` | `6f0bbdbc355ccb4ce795544d050f9ab2eab621e55446346479e9c0a44c4d71b8` |
| `src/locationTask.js` | (included in `nativeSourceHash`) |

---

## 4. Proof Native/Web Commits Match

### Deployment order (mandatory)

1. **Generate provenance** — `npm run generate:recovery-provenance`
2. **Build Cloudflare zip** — `./build-upload.sh`
3. **Deploy zip to Cloudflare** — upload full `milepilot-upload-v2/` contents (not `version.txt` alone)
4. **Verify remote** — `npm run verify:recovery-deploy`
5. **EAS TestFlight build** — `npm run build:ios:recovery`

### Pinned web URL

TestFlight shell loads:

```
https://app.milepilot.uk/?runtime=expo&build=recovery-hf009&commit=9b91907&v=8.43.63
```

This prevents the native binary from loading today's `main` bundle.

### Verification checks

`scripts/verify-recovery-deploy.mjs` confirms:

- Local HEAD contains frozen commit `9b91907`
- `version.txt` === `APP_VERSION` === `8.43.63`
- `app.config.js` and `eas.json` pin matching version
- Cloudflare `version.txt` matches (when deployed)
- Cloudflare `recovery-build-identity.json` `bundleHash` matches local

---

## 5. Diagnostic Screen

**Settings → Recovery Validation (MP-HF-009)** or open with `?debug=recovery`

Displays (read-only):

| Field | Source |
|-------|--------|
| commit | `recovery-build-identity.json` |
| APP_VERSION | runtime + identity |
| bundle hash | build-time hash |
| native hash | build-time native source hash |
| nativeAutoPilot detected | YES/NO — `expo:debug:query` returns `autopilotArmedNative` |
| native bridge detected | YES/NO — `MPExpoBridge` present |
| recovery candidate | YES |

Native shell also injects `__MILEPILOT_RECOVERY_IDENTITY__` at WebView boot.

---

## 6. User Field-Test Checklist

See [MP-HF-009-FIELD-TEST-CHECKLIST.md](./MP-HF-009-FIELD-TEST-CHECKLIST.md).

### Success criteria (all must PASS)

- AutoPilot starts without reopening the app
- Journey records while locked
- Journey survives other app usage
- Auto-end works
- Report works
- Email works
- No false journeys

---

## 7. Rollback Procedure

If the wrong bundle was deployed or TestFlight loads mismatched web code:

1. **Do not change tracking code**
2. Re-deploy previous Cloudflare zip from known-good backup
3. Confirm `https://app.milepilot.uk/version.txt` shows expected version
4. Uninstall TestFlight build from device; reinstall only after deploy verify passes
5. Open Settings → Recovery Validation and confirm `bundleHash` matches `recovery-build-identity.json` in repo
6. Export diagnostics from Recovery Validation screen before any further action

To roll back TestFlight: install previous build from App Store Connect (build 15 or earlier) only after confirming Cloudflare matches that build's pinned URL.

---

## 8. If Field Test Fails

**Do not modify code. Do not attempt another fix.**

1. Export Recovery Validation diagnostics (screenshot or copy)
2. Export lifecycle logs if available (`mp_debug=1` → Tracking Debug)
3. Compare against alternate candidate `a84a0c4`
4. Determine root cause:
   - Wrong recovered commit?
   - Wrong web bundle on Cloudflare?
   - Wrong native binary?
   - Onboarding arming race (`finishOnboarding` → `ensureAutopilotArmed()` without `await`)?
   - Deployment mismatch?

Only after that analysis may new development resume.

---

## 9. Build Commands

```bash
# Full recovery validation pipeline
npm run generate:recovery-provenance
./build-upload.sh
npm run verify:recovery-deploy    # after Cloudflare deploy
npm run build:ios:recovery        # EAS TestFlight
```

---

## 10. Verdict

**HISTORICAL RECOVERY BUILD READY FOR DEVICE VALIDATION**

Conditions met when:

- Branch frozen at `9b91907` + read-only diagnostics added
- `version.txt` aligned to `8.43.63`
- EAS `recovery-hf009` profile pins commit-specific web URL
- Provenance scripts generate and verify identity
- Cloudflare zip ready for deploy
- User performs field tests 1–5

Field test outcome determines whether merge/recovery proceeds or alternate candidate `a84a0c4` is investigated.
