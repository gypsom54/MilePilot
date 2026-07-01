# GitHub Branch Protection — MilePilot

**Goal:** Critical tracking, trip persistence, and report pipeline code cannot reach `main` without review and passing CI.

---

## 1. Protected branch: `main`

Configure in **GitHub → Settings → Branches → Branch protection rules → Add rule**

| Setting | Value | Why |
|---------|-------|-----|
| Branch name pattern | `main` | Production source of truth |
| Require a pull request before merging | ✅ | No direct pushes |
| Required approvals | **1** (increase to 2 as team grows) | Human review for VITAL code |
| Dismiss stale pull request approvals | ✅ | Re-review after new commits |
| Require review from Code Owners | ✅ | Enforces `.github/CODEOWNERS` |
| Require status checks to pass | ✅ | CI must be green |
| Require branches to be up to date | ✅ | No merging stale PRs |
| Do not allow bypassing | ✅ (recommended) | Even admins follow process |

---

## 2. Required status checks

Add these checks from **production-guard** workflow:

| Check name | Workflow file |
|------------|---------------|
| `vital-contracts-and-regression` | `.github/workflows/production-guard.yml` |

If GitHub shows a different job label, use the exact name from the PR checks tab.

**Optional additional checks** (if enabled on repo):

| Check | Workflow |
|-------|----------|
| `verify-tracking-contract` | `.github/workflows/tracking-guard.yml` |

`production-guard.yml` already runs the tracking verifier — one required check is sufficient.

---

## 3. CODEOWNERS enforcement

File: `.github/CODEOWNERS`

Critical paths require approval from `@gypsom54` (update as team grows):

**Tracking (MP-043):**

- `frontend/index.html`
- `frontend/js/native-platform.js`
- `frontend/js/tracking-provider.js`
- `milepilot-upload-v2/index.html` + JS mirrors
- `src/locationTask.js`, `src/expoLocationBridge.js`, `src/MilePilotWebView.js`
- `scripts/tracking-contract.json`, `scripts/verify-tracking-contract.js`

**Reports & trips (MP-044):**

- `frontend/js/summary-reports.js`
- `frontend/js/trip-store.js`
- `backend/reportEngine.js`
- `backend/server.js`
- `backend/reportDownload.js`
- `scripts/reports-contract.json`, `scripts/verify-reports-contract.js`

**Tests & docs:**

- `tests/tracking-*.js`, `tests/reports-*.js`, `tests/trip-persistence.test.js`
- `docs/TRACKING_CONTRACT.md`, `docs/CRITICAL_FILES.md`, `docs/PRODUCTION_MONITORING_PLAN.md`

---

## 4. Path-based workflow triggers

| Workflow | Triggers on |
|----------|-------------|
| `tracking-guard.yml` | Changes to `frontend/**`, `src/**`, tracking scripts |
| `production-guard.yml` | **All PRs** and pushes to `main` |

Every PR runs full vital regression — even documentation-only PRs are fast (< 2 min).

---

## 5. Agent / developer rules

1. **Never force-push to `main`**
2. **Never merge with failing `production-guard`**
3. **Tracking changes** require device test note in PR body (foreground + background + lock screen)
4. **Report changes** require screenshot or test email confirmation
5. Cursor agents: read `.cursor/rules/vital-gps-tracking.mdc` and `vital-reports-pipeline.mdc`

---

## 6. Release discipline

| Artifact | Version pin |
|----------|-------------|
| Cloudflare PWA | `frontend/version.txt`, cache-bust `?v=` |
| TestFlight | `app.config.js` `buildNumber`, `WEB_APP_URL` |
| API | Railway auto-deploy from `main` |

Tag releases: `v8.28.x-cloudflare` after verified device test.

---

## 7. Emergency hotfix process

1. Branch from `main`: `cursor/hotfix-gps-<desc>-4c0e`
2. Minimal fix only — no drive-by refactors
3. Run `npm run test:vital` locally
4. PR with `P0` label + device test evidence
5. CODEOWNER approval
6. Merge → verify `/health` → pin Cloudflare → notify users if needed

---

## 8. Setup checklist (repo admin)

- [ ] Branch protection rule on `main` created
- [ ] `vital-contracts-and-regression` added as required check
- [ ] "Require review from Code Owners" enabled
- [ ] CODEOWNERS file committed (this repo)
- [ ] `production-guard.yml` workflow present on `main`
- [ ] Verify: open test PR that removes `startBackgroundGpsPoll` → CI must fail
