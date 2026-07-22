# MilePilot Critical Files Index

**Goal:** MilePilot must never silently break background mileage tracking, trip persistence, or automatic report delivery.

Every file below is business-critical. Changes require explicit review, device testing (for tracking), and passing CI (`production-guard.yml`).

---

## 1. Background location tracking (MP-043 — VITAL)

| File | Responsibility |
|------|----------------|
| `frontend/index.html` | Tracking engine: `processGpsPoint`, `handlePos`, `startBackgroundGpsPoll`, `checkGpsStale`, `scheduleGpsReconnect`, motion nudge, shift start/stop |
| `milepilot-upload-v2/index.html` | Cloudflare deploy mirror of tracking engine |
| `frontend/js/native-platform.js` | Native vs PWA detection (`MPPlatform`) |
| `frontend/js/tracking-provider.js` | TestFlight GPS bridge (`MPTrackingProvider`) |
| `milepilot-upload-v2/js/native-platform.js` | Deploy mirror |
| `milepilot-upload-v2/js/tracking-provider.js` | Deploy mirror |
| `src/locationTask.js` | Expo background location task (locked screen) |
| `src/expoLocationBridge.js` | Native → WebView coordinate bridge |
| `src/MilePilotWebView.js` | TestFlight WebView shell |

**Contract:** `scripts/tracking-contract.json` · **Docs:** `docs/TRACKING_CONTRACT.md`

### Must-not-regress behaviours

- High-accuracy GPS during active shift (`GEO_OPTS_TRACKING`)
- Background polling every 12s (`BG_GPS_POLL_MS`)
- Stale GPS reconnect (`GPS_STALE_MS`, `GPS_RECONNECT_MS`)
- Motion-based GPS nudge (`bindMotionGpsNudge`)
- Weak-signal tolerance (`ACC_SOFT_MAX: 220`)
- Native speed gate (`nativeGps`, `movementSpeedMps`)
- Stationary grace: 90s before stop recorded (`STOP_AFTER_MS: 90000`) — trip does **not** auto-end

---

## 2. Lock-screen tracking (MP-043 — VITAL)

Same files as §1, specifically:

| Mechanism | File |
|-----------|------|
| iOS background task | `src/locationTask.js` |
| Pending location buffer | `src/locationTask.js` → `pendingBackgroundLocations` |
| WebView injection | `src/expoLocationBridge.js`, `src/MilePilotWebView.js` |
| PWA wake lock + background poll | `frontend/index.html` |

**Test coverage:** `tests/tracking-regression.test.js` — lock-screen and background gap scenarios.

---

## 3. Motion detection (MP-043 — VITAL)

| File | Symbols |
|------|---------|
| `frontend/index.html` | `ensureMotionAccess`, `bindMotionGpsNudge`, `devicemotion` handler |
| `milepilot-upload-v2/index.html` | Mirror |

Motion permission nudges GPS when the device moves but watch callbacks stall.

---

## 4. Trip start/stop logic (MP-043 — VITAL)

| File | Symbols |
|------|---------|
| `frontend/index.html` | `startShiftCommandCentre`, `endShiftCommandCentre`, `processGpsPoint`, `recordStop`, `normaliseShift` |
| `frontend/js/trip-auto-end.js` | `MPTripAutoEnd` — 90 min inactivity auto-end (MP-045) |
| `milepilot-upload-v2/index.html` | Mirror |

Trip **ends** when the driver taps End Shift **or** after 90 minutes without GPS movement (`MPTripAutoEnd`). See `docs/AUTO_END_TRIP.md`.

---

## 5. Stationary timeout logic (MP-043 — VITAL)

| Constant / function | Value / role |
|---------------------|--------------|
| `STOP_AFTER_MS` | `90000` (90 seconds) |
| `STOP_SPEED_MPS` | `0.9` m/s threshold |
| `recordStop` | Records a stop event; does **not** end the shift |

**Test coverage:** `tests/tracking-regression.test.js` — short stop vs 90s timeout.

---

## 6. Trip persistence (Never Miss A Trip)

| File | Storage keys |
|------|--------------|
| `frontend/js/trip-store.js` | `mp_trips`, `mp_active_trip` |
| `milepilot-upload-v2/js/trip-store.js` | Mirror |
| `frontend/index.html` | `saveActiveShift`, `mp_active_shift` (in-shift state) |

**Test coverage:** `tests/trip-persistence.test.js`, `tests/tracking-regression.test.js` (active shift payload roundtrip).

---

## 7. Report scheduling (MP-044 — VITAL)

| File | Symbols |
|------|---------|
| `frontend/js/summary-reports.js` | `scheduleDailyAfterShift`, `checkScheduledReports`, `MPSummaryReports` |
| `milepilot-upload-v2/js/summary-reports.js` | Mirror |
| `frontend/index.html` | `initSummaryReports`, 60s scheduler interval |

**Contract:** `scripts/reports-contract.json`

---

## 8. Email delivery (MP-044 — VITAL)

| File | Endpoint / symbol |
|------|-------------------|
| `backend/server.js` | `POST /reports/send`, Resend integration |
| `backend/reportEngine.js` | `buildReportEmailHtml`, `buildReportEmailText`, `buildReportSubject` |

---

## 9. PDF generation (MP-044 — VITAL)

| File | Symbol |
|------|--------|
| `backend/reportEngine.js` | `buildPdfBuffer`, `analyseReport` |
| `backend/routeMapService.js` | Route map rendering for email/PDF |
| `backend/server.js` | `POST /reports/pdf` |
| `backend/reportDownload.js` | `storeReportDownload`, `getStoredDownload` |

**Test coverage:** `tests/reports-regression.test.js`

---

## 10. MilePilot Intelligence Engine (MIE) — product layer (not mileage engine)

| File | Responsibility |
|------|----------------|
| `frontend/js/mie-intelligence-engine.js` | Confidence model, habit learning, `prepareDailyReview`, explanations |
| `frontend/js/journey-review.js` | Swipe review UI (consumes MIE; does not control GPS) |
| `frontend/js/ai-mileage-review.js` | Backward-compatible alias → `MPMIE` |

**Rules:** MIE must never import or call GPS handlers, `MPSummaryReports.send*`, or subscription gates directly. UI wires MIE at the application layer (`index.html` orchestration only).

**Docs:** `docs/MIE-ARCHITECTURE.md` · **Tests:** `tests/ai-mileage-review.test.js`, `tests/journey-review.test.js`

---

## 11. Onboarding boundary (UI-only)

Onboarding lives in `frontend/index.html` (screens + preference handlers only). It must **not** call shift start/stop, GPS handlers, or report send logic.

See `docs/MILEAGE_REGRESSION_CHECKLIST.md` for the full regression checklist and onboarding rules.

---

## 12. Protection infrastructure

| File | Role |
|------|------|
| `scripts/verify-tracking-contract.js` | MP-043 CI verifier |
| `scripts/verify-reports-contract.js` | MP-044 CI verifier |
| `tests/tracking-engine-core.js` | Canonical engine mirror for tests |
| `tests/tracking-regression.test.js` | GPS / trip regression suite |
| `tests/reports-regression.test.js` | PDF / email regression suite |
| `tests/trip-persistence.test.js` | localStorage trip roundtrip |
| `.github/workflows/production-guard.yml` | Runs all verifiers + tests |
| `.github/workflows/tracking-guard.yml` | Path-filtered tracking guard |
| `.github/CODEOWNERS` | Required reviewer on critical paths |
| `.cursor/rules/vital-tax-engine.mdc` | Agent guardrail for HMRC engine |
| `.cursor/rules/vital-ask-milepilot.mdc` | Agent guardrail for Ask MilePilot |
| `docs/TRACKING_CONTRACT.md` | Human-readable tracking contract |
| `docs/PRODUCTION_MONITORING_PLAN.md` | Monitoring + health dashboard plan |
| `docs/BRANCH_PROTECTION.md` | GitHub branch protection setup |

---

## 13. HMRC Tax Engine (MP-044 / MP-044B — VITAL, LOCKED)

| File | Responsibility |
|------|----------------|
| `frontend/js/mp-tax-engine.js` | **Sole** HMRC rate tables, tax-year resolver, threshold splitting, claim calculators |
| `backend/mpTaxEngine.js` | Node ESM adapter — loads frontend engine as single source of truth |
| `tests/mp-tax-engine.test.js` | 25-test regression matrix |

**Contract:** All mileage claim calculations must route through `MPTaxEngine`.  
**Docs:** `docs/MP-044-ENGINE-LOCK.md` · `docs/adr/001-mp-tax-engine-single-source-of-truth.md`  
**Agent rule:** `.cursor/rules/vital-tax-engine.mdc`

### Must-not-regress behaviours

- Versioned rate tables per UK tax year (2025-26, 2026-27, …)
- 10,000-mile threshold applied chronologically per tax year / vehicle type
- Integer pence internally; no silent `miles × rate` fallbacks
- `requireTaxEngine()` throws if engine script failed to load
- Stored `trip.hmrc` / `shift.hmrc` not used as display authority

**Test coverage:** `npm run test:tax-engine` (25 tests), included in `npm run test:vital`

---

## 14. Ask MilePilot (MP-S5 — VITAL, LOCKED)

| File | Responsibility |
|------|----------------|
| `frontend/js/ask-milepilot-view.js` | **Locked** MP-S4 visual shell — composer, chips, cards, confirmation UI |
| `frontend/js/ask-milepilot-service.js` | IntentRouter, query services, ResponseFormatter, ActionExecutor |
| `frontend/js/ask-milepilot-app.js` | mount/leave lifecycle, submit/confirm controllers |
| `frontend/index.html` (Ask wiring) | `showAsk`, `buildAskDeps`, deep link, session restore |
| `milepilot-upload-v2/js/ask-milepilot-*.js` | Deploy mirrors |
| `tests/ask-milepilot-service.test.js` | 43+ integration tests |
| `scripts/mp-s5-parity-audit.js` | HMRC parity matrix (Ask vs engine) |

**Contract:** Intent registry and action execution are protected. Financial answers must use `MPTaxEngine`.  
**Docs:** `docs/MP-S5-ASK-LOCK.md` · `docs/adr/002-ask-milepilot-production-lock.md`  
**Agent rule:** `.cursor/rules/vital-ask-milepilot.mdc`

### Must-not-regress behaviours

- Visual shell matches MP-S4 lock (typography, spacing, layout)
- Intent collisions resolved (email lookup ≠ email action; fuel/VAT/pack → NotConnected)
- External actions require confirmation; no execution on question submit
- Missing email blocks email action preparation
- `collectRange` / claim paths require `MPTaxEngine` (no flat-rate fallback)
- `leave()` clears pending actions on navigation away

**Test coverage:** `npm run test:ask-milepilot`, `npm run test:ask-parity`, included in `npm run test:vital`

**Backlog:** `docs/MP-S5-006-BROWSER-HISTORY.md` — browser back/forward routing

---

## Change checklist

Before merging any PR that touches files in §1–§9 or §13–§14:

1. [ ] Explicit product sign-off for intentional behaviour changes
2. [ ] `npm run test:vital` passes locally
3. [ ] Real-device test: foreground + background + locked screen (tracking changes)
4. [ ] End-to-end report email received (report changes)
5. [ ] PR template tracking checklist completed
6. [ ] CODEOWNERS reviewer approved
