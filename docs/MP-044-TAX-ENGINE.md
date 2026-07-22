# MP-044 — Unified HMRC Tax Engine

**Specification ID:** MP-044  
**Status:** Implementation complete — awaiting approval (do not merge to production)  
**Rollback tag:** `rollback/pre-mp-tax-engine-v84331`

## Architecture

```
MPTaxEngine (frontend/js/mp-tax-engine.js)
├── TaxYearResolver      — getUkTaxYear(), journeyInTaxYear()
├── HMRCRateTables       — versioned 2025-26 / 2026-27
├── MileageCalculator    — calculateTaxYearClaims(), calculatePeriodClaims()
├── JourneyCalculator    — calculateJourneyClaimPence() with threshold splitting
├── TaxYearSummary       — explainTaxYearSummary()
├── MoneyFormatter       — integer pence internally, formatPence() for display
└── Validation           — validateVehicle(), getRateConfig()
```

Backend adapter: `backend/mpTaxEngine.js` loads the frontend engine as the single source of truth.

## Protected files changed

| File | Change |
|------|--------|
| `frontend/js/mp-tax-engine.js` | **NEW** — core engine |
| `backend/mpTaxEngine.js` | **NEW** — Node ESM adapter |
| `frontend/js/trip-store.js` | HMRC via engine; preserve stored hmrc on load |
| `frontend/js/summary-reports.js` | Recalculated period totals |
| `frontend/js/custom-period-report.js` | Recalculated custom reports |
| `frontend/js/report-archive.js` | Recalculated archive totals |
| `frontend/js/journey-review.js` | Recalculated day totals |
| `frontend/index.html` | Script load, claim(), periodTotals() |
| `backend/reportEngine.js` | sumShifts() recalculates via engine |
| `milepilot-upload-v2/js/*` | Mirrored frontend changes |
| `milepilot-upload-v2/js/ask-milepilot-*.js` | Ask uses MPTaxEngine only |

**Unchanged:** GPS tracking, AutoPilot, journey detection, onboarding, Business Hub, production routing, locked Ask UI shell.

## Rollback plan

1. `git checkout rollback/pre-mp-tax-engine-v84331`
2. Or revert branch `cursor/mp-tax-engine-19bd`
3. No database migration was performed — stored `trip.hmrc` values are untouched

## Legacy comparison

Run: `node scripts/compare-legacy-hmrc.js`  
Output: `docs/MP-044-LEGACY-COMPARISON.json`

Stored values are not rewritten. Migration decisions deferred to a future sprint.

## Tests

- `npm run test:tax-engine` — 25-test matrix (all pass)
- `npm run test:vital` — full regression (all pass)
