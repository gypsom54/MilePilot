# MP-HF-007 — Recovery Manifest

**Label:** RECOVERED HISTORICAL CANDIDATE — FIELD TEST REQUIRED  
**Recovery commit:** `9b91907fef6146d20aa905099782bac7deaed254`  
**Recovery branch:** `cursor/mp-hf-007-recover-84363-19bd`  
**Marketing version (APP_VERSION):** `8.43.63`  
**Do not merge. Do not modernise. Field test required.**

---

## Identity (do not trust filename alone)

| Field | Value |
|-------|-------|
| Git commit | `9b91907` |
| Commit date | 2026-07-07 |
| Commit message | Feedback submit: always return to dashboard, never trap user (v8.43.63) |
| `APP_VERSION` | `8.43.63` |
| `frontend/version.txt` | `8.43.57` (**mismatch — known**) |
| `milepilot-upload-v2/version.txt` | `8.43.57` (**mismatch**) |
| Native `ios.buildNumber` (app.config.js) | `8` |
| `src/nativeAutopilot.js` | **PRESENT** (closed-app AutoPilot) |
| `bootApp` init order | `initTrackingEngine()` → `initAutoPilotMotion()` |
| `TRACKING_ENGINE_V` | `2` |

## File hashes (SHA-256)

Run at recovery commit:

```bash
git checkout 9b91907
sha256sum frontend/index.html src/nativeAutopilot.js src/expoLocationBridge.js \
  frontend/js/autopilot-motion.js frontend/js/trip-auto-end.js
```

## Why this candidate

1. Tip of the **8.43.63 business-build lineage** with `nativeAutopilot.js` intact.
2. `docs/TRACKING_ENGINE_LOCKDOWN.md` (commit `fd86d4d`, same era) documents field-validated TestFlight builds **12–14** and explicitly locks `src/nativeAutopilot.js` closed-app auto-start.
3. Lineage includes `8dd8d3a` / `fe54287` (native closed-app AutoPilot) through `16ebc87` (build 13) → `9b91907`.
4. **Not** present on current `main` — `nativeAutopilot.js` was never carried forward on the main merge line.

## Alternate candidate (same native stack)

| Commit | APP_VERSION | Notes |
|--------|-------------|-------|
| `a84a0c4` | `8.43.64` | Onboarding lockdown; `version.txt` matches APP_VERSION; tracking native files identical to `9b91907` except minor `autopilot-motion.js` notify string |
| `686d370` | `8.43.67` | Same `src/` as `9b91907`; 1-line `index.html` diff only — **failed later field tests; use only for comparison** |

## Reproducible build

```bash
git checkout cursor/mp-hf-007-recover-84363-19bd
# or: git checkout 9b91907
./build-upload.sh   # if available at this commit
# Deploy milepilot-upload-v2/ to Cloudflare
# EAS build from app.config.js at this commit for native shell
```

## Field test (required before any PASS label)

See `docs/MP-HF-007-FIELD-TEST-SHEET.md` — fresh install, onboarding, permissions, **do not reopen**, lock, drive, full lifecycle.
