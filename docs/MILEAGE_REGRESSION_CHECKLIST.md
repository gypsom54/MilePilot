# Mileage Engine Regression Checklist

Use this checklist before merging any PR that touches mileage-critical files (see `docs/CRITICAL_FILES.md`).

Onboarding and UI-only changes must **not** modify the files listed in §1–§9 of `CRITICAL_FILES.md` unless the task explicitly requires it.

## Automated coverage (`npm run test:mileage-checklist` + `npm run test:vital`)

| Scenario | Covered by | Manual device test |
|----------|------------|-------------------|
| Start trip | `tests/tracking-regression.test.js`, `tests/trip-persistence.test.js` | ☐ Start shift from home screen |
| Track distance | `tests/tracking-regression.test.js` | ☐ Drive/walk 0.5+ mi; miles increase |
| End trip manually | `tests/trip-persistence.test.js` | ☐ Tap End Shift; summary appears |
| Auto-end after inactivity | `tests/trip-auto-end.test.js` | ☐ Park 90+ min (or debug timer); auto-end fires |
| Save trip | `tests/trip-persistence.test.js` | ☐ Trip visible in History after end |
| Classify trip | `tests/trip-persistence.test.js` (store API) | ☐ Pending trip can be marked business/personal (when UI exists) |
| Generate report | `tests/reports-regression.test.js` | ☐ PDF downloads from Report Centre |
| Send email | `tests/reports-regression.test.js`, `tests/summary-reports-collect.test.js` | ☐ Test email received after shift |

## Mileage-critical files (do not edit for UI-only work)

### Tracking engine
- `frontend/index.html` — inline `ENGINE`, `processGpsPoint`, `handlePos`, shift start/stop (lines marked VITAL)
- `frontend/js/tracking-provider.js`
- `frontend/js/native-platform.js`
- `src/locationTask.js`
- `src/expoLocationBridge.js`
- `src/MilePilotWebView.js`

### Auto-end
- `frontend/js/trip-auto-end.js`

### Trip persistence & classification
- `frontend/js/trip-store.js`

### Reports & email
- `frontend/js/summary-reports.js`
- `backend/reportEngine.js`
- `backend/server.js` (report routes)
- `backend/reportDownload.js`

### Test mirrors
- `tests/tracking-engine-core.js`

## Onboarding boundary rule

Onboarding may only:
- Save user preferences (`mp_driver`, `mp_vehicle`, `mp_tracking_mode`, `mp_work_schedule`, `mp_email`, `mp_report_frequency`, permission choice flags)
- Navigate between screens

Onboarding must **not**:
- Call `startShiftCommandCentre`, `enableTrackingGps`, or `processGpsPoint`
- Modify `mp_active_shift`, `mp_shifts`, or `mp_trips`
- Trigger `MPSummaryReports.send` or schedule reports (except saving frequency preference)
- Reset or migrate trip data
