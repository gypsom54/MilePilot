# MilePilot — Permanent Development Rules

**Status:** 🔒 LOCKED  
**Golden foundation:** **v8.43.67** (`cursor/restore-validated-flow-e91d`)  
**Effective:** July 2026

---

## Golden foundation

The current project is based on **MilePilot v8.43.67**, the best-known working version.

This version contains proven tracking and AutoPilot behaviour and must be treated as the **GOLDEN FOUNDATION**.

Do not advance the app version, replace deploy packages, or merge experimental branches without explicit user approval and a verified rollback point.

---

## Non-negotiable rules

1. **Never modify unrelated files.**
2. **Never perform broad refactors.**
3. **Never rewrite working logic for cleanliness.**
4. **Never change** native tracking, background location, motion detection, trip completion, reports, permissions, or email delivery **during UI work**.
5. **Never replace complete files** unless explicitly authorised.
6. **Never invent** new copy, screens, routes, or functionality.
7. **Never combine multiple objectives** into one implementation.
8. **Never report success** without showing:
   - files changed
   - exact behaviour changed
   - tests performed
   - confirmation that protected systems were untouched
9. **If the requested change requires touching protected engine code, STOP and explain why** before editing.
10. **Preserve a rollback point** before every implementation.

---

## Protected systems (do not touch without explicit sign-off)

| System | Primary files / docs |
|--------|----------------------|
| Native tracking engine | `src/nativeTrackingEngine.js`, `frontend/index.html` (tracking block) |
| Background / closed-app GPS | `src/locationTask.js`, `src/expoLocationBridge.js`, `src/nativeAutopilot.js` |
| Motion detection / AutoPilot | `frontend/js/autopilot-motion.js`, `src/nativeAutopilot.js` |
| Trip completion / auto-end | `frontend/js/trip-auto-end.js`, `src/nativeAutoEnd.js` |
| Reports pipeline | `frontend/js/summary-reports.js`, `backend/reportEngine.js` |
| Email delivery | `backend/server.js`, report templates |
| Permissions / native shell | `app.config.js`, `src/MilePilotWebView.js` |
| Contracts | `scripts/tracking-contract.json`, `scripts/home-ui-contract.json` |

See also: `docs/TRACKING_ENGINE_LOCKDOWN.md`, `docs/TRACKING_CONTRACT.md`, `docs/MILEPILOT_LOCKED_COMPONENTS.md`.

---

## Required workflow (every task)

```
Audit
  ↓
Report
  ↓
Receive approval
  ↓
Implement ONE objective
  ↓
Test
  ↓
Provide screenshots
  ↓
Approve
  ↓
Lock
  ↓
Move on
```

**The user-facing app must never be left in a partially functioning state.**

---

## Before any change

- [ ] Confirm task touches only the files required for the single stated objective
- [ ] Confirm protected systems are not in scope (or user has explicitly approved)
- [ ] Note current version (`8.43.67`) and branch (`cursor/restore-validated-flow-e91d`)
- [ ] Create rollback point (git branch or tagged commit) before editing

---

## After any change

- [ ] List every file changed
- [ ] Describe exact behaviour changed (not just "polished" or "improved")
- [ ] Run relevant verifiers: `bash build-upload.sh` (includes tracking + home UI contracts + native AutoPilot tests)
- [ ] Confirm protected systems untouched (or document intentional change with device test)
- [ ] Provide screenshots if UI changed
- [ ] Wait for user approval before locking or moving to next objective

---

## Rollback

If anything breaks:

```powershell
git checkout cursor/restore-validated-flow-e91d
```

Redeploy: `MilePilot-v8.43.67-CLOUDFLARE-UPLOAD.zip`

Verify: https://app.milepilot.uk/version.txt → `8.43.67`
