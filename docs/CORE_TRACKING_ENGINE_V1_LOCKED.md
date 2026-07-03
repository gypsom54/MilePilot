# Core Tracking Engine — Version 1.0 LOCKED

**Status:** 🔒 **LOCKED** — Production-ready  
**Signed off:** July 2026  
**App version:** v8.43.31  
**Contract:** MP-043 v3 (`scripts/tracking-contract.json`)

> **Do not rewrite working logic.** Reliability is now more important than experimentation. Future work must **extend** the tracking engine rather than replacing it.

---

## Real-world validation (passed)

| Scenario | Result |
|----------|--------|
| Background mileage tracking | ✓ |
| Locked-screen tracking | ✓ |
| Tracking during phone calls | ✓ |
| Tracking during Spotify / media playback | ✓ |
| Mileage calculation accuracy | ✓ |
| Shift completion | ✓ |
| Report generation | ✓ |

---

## Frozen components

The following are **frozen at v1.0**. No changes without explicit product sign-off, regression tests, and manual device verification.

| Component | Primary files | Contract |
|-----------|---------------|----------|
| GPS tracking logic | `frontend/index.html`, `src/nativeTrackingEngine.js` | MP-043 |
| Distance calculations | `processGpsPoint`, `nativeTrackingEngine.js` | MP-043 |
| Background task handling | `src/locationTask.js`, `startBackgroundGpsPoll` | MP-043 |
| Location update configuration | `GEO_OPTS_TRACKING`, `ENGINE` constants | MP-043 |
| Shift lifecycle | `startShiftCommandCentre`, `endShiftCommandCentre` | MP-043 |
| Mileage calculations | `pendingMeters`, `nativeOdometerMeters` | MP-043 |
| Report generation trigger | `scheduleDailyAfterShift`, `checkScheduledReports` | MP-044 |
| Email generation trigger | `POST /reports/send`, `MPSummaryReports` | MP-044 |

**Background / lock-screen handoff** (field-validated v8.43.31): see [TRACKING_BACKGROUND_VITAL_LOCK.md](./TRACKING_BACKGROUND_VITAL_LOCK.md).

---

## Trusted foundation for future features

The v1.0 engine is the **stable base layer**. New capabilities must hook in at the application or intelligence layer — not by replacing core GPS math or shift state.

| Future feature | Extension approach |
|----------------|-------------------|
| AutoPilot Motion Detection | New module; calls existing shift/GPS hooks only |
| AI Journey Learning | `mie-intelligence-engine.js` — never imports GPS handlers |
| Business / Personal Classification | MIE + journey review UI; no engine changes |
| Automatic Shift Detection | Orchestration layer above `startShiftCommandCentre` |
| Confidence Scoring | MIE product layer; read-only trip data |

See [MIE-ARCHITECTURE.md](./MIE-ARCHITECTURE.md) for the decoupled intelligence pattern.

---

## Change policy (mandatory)

If a future feature **requires** changes to the tracking engine:

1. **Preserve existing behaviour** — manual tracking must behave identically after the change.
2. **Add automated regression tests** — extend `tests/tracking-regression.test.js` or `tests/native-tracking-engine.test.js`.
3. **Confirm manual tracking** — real-device drive: foreground, background, locked screen.
4. **Never introduce breaking changes** without explicit approval.

### Prohibited without sign-off

- Rewriting or optimising working GPS algorithms
- Refactoring `processGpsPoint` or native distance logic
- Changing `ENGINE` constants for experimentation
- Merging UI polish and engine changes in one PR
- Shipping TestFlight without the device drive gate ([TRACKING_RELIABILITY_LOCKDOWN.md](./TRACKING_RELIABILITY_LOCKDOWN.md))

---

## Protection layers (enforced)

| Layer | Mechanism |
|-------|-----------|
| Machine contract | `scripts/tracking-contract.json` — `coreEngineVersion: "1.0"` |
| CI guard | `.github/workflows/production-guard.yml` |
| Path guard | `.github/workflows/tracking-guard.yml` |
| Build guard | `build-upload.sh` — verifier must pass |
| Runtime guard | `assertTrackingResilience()` at app boot |
| CODEOWNERS | `.github/CODEOWNERS` — required review |
| Agent rules | `.cursor/rules/vital-gps-tracking.mdc`, `core-tracking-engine-v1-locked.mdc` |
| Regression suite | `npm run test:vital` |

---

## Related lock documents

| Document | Scope |
|----------|-------|
| [TRACKING_CONTRACT.md](./TRACKING_CONTRACT.md) | MP-043 human contract |
| [TRACKING_BACKGROUND_VITAL_LOCK.md](./TRACKING_BACKGROUND_VITAL_LOCK.md) | Background / lock-screen handoff |
| [TRACKING_RELIABILITY_LOCKDOWN.md](./TRACKING_RELIABILITY_LOCKDOWN.md) | Device test gate + architecture audit |
| [CRITICAL_FILES.md](./CRITICAL_FILES.md) | File index by subsystem |
| [TEMPLATE_LOCK_REPORTS.md](./TEMPLATE_LOCK_REPORTS.md) | PDF + email templates |
| [MILEAGE_REGRESSION_CHECKLIST.md](./MILEAGE_REGRESSION_CHECKLIST.md) | Pre-merge checklist |

---

## Release gate

Before any production or TestFlight release:

```bash
npm run test:vital
npm run verify:release
bash build-upload.sh
```

Then complete the device drive gate in [TRACKING_RELIABILITY_LOCKDOWN.md](./TRACKING_RELIABILITY_LOCKDOWN.md).

---

## Version history

| Version | Date | Change |
|---------|------|--------|
| **1.0 LOCKED** | 2026-07-03 | Production sign-off after real-world validation |
| MP-043 v3 | 2026-07-02 | Background / locked-screen handoff — field-validated v8.43.31 |
| MP-043 v2 | 2026-06-30 | Native TestFlight bridge + vital protection markers |
