# MP-044B — HMRC Engine Permanent Lock

**Specification ID:** MP-044B  
**Status:** LOCKED — HMRC calculation engine is the single source of truth  
**Parent:** MP-044 Unified HMRC Tax Engine  
**Rollback tag:** `rollback/pre-mp-tax-engine-v84331`

## Protected status

From MP-044B onwards, **MPTaxEngine is protected**. No feature may implement its own mileage allowance calculation.

All mileage claim calculations **must** route through `MPTaxEngine`. Direct HMRC calculations elsewhere are **prohibited**.

This applies to:

- Dashboard insights and goals
- Reports (daily, weekly, monthly, annual, custom, archive)
- PDF and email outputs
- Ask MilePilot (preview and production when routed)
- Backend report generation
- Accountant exports (current and future)
- Business Health, VAT, and AI insights (future)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MPTaxEngine (protected)                   │
│              frontend/js/mp-tax-engine.js                    │
├─────────────────────────────────────────────────────────────┤
│  TaxYearResolver     │  UK tax year from journey date       │
│  HMRCRateTables      │  Versioned rate tables per tax year   │
│  JourneyCalculator   │  Threshold splitting, integer pence   │
│  PeriodCalculator    │  Period / tax-year claim totals       │
│  MarginalCalculator  │  claimMarginalPounds() for live/goals │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
   index.html           trip-store.js        summary-reports.js
   dashboard            journey-review       custom-period-report
   goals/insights       report-archive       backend/reportEngine.js
```

Backend adapter `backend/mpTaxEngine.js` loads the frontend engine file as the **only** rate-table source. `VEHICLE_RATES` in `reportEngine.js` is derived from the engine at load time — not a duplicate table.

## Responsibilities

| Component | Responsibility |
|-----------|----------------|
| `MPTaxEngine` | All HMRC mileage allowance maths: rates, thresholds, tax years, pence rounding |
| `trip-store.js` | Persist trips/shifts; delegate claim values to engine on classify/normalise |
| `index.html` | `claim()`, `periodTotals()`, dashboard insights, goal projections |
| `summary-reports.js` | Scheduled and on-demand report payloads |
| `custom-period-report.js` | Custom date-range report collection |
| `report-archive.js` | Archive entry payloads |
| `journey-review.js` | Per-day business totals for review UI |
| `reportEngine.js` | Server-side PDF/email rendering from engine-recalculated payloads |

Consumers **must not**:

- Multiply `miles × rate` for display or reporting
- Read stored `shift.hmrc` / `trip.hmrc` for displayed totals (storage is legacy; engine recalculates)
- Define local `VEHICLE_RATES`, `0.55` fallbacks, or `defaultClaim()` flat-rate paths

## Approved rate-table design

Rates live **only** in `HMRC_RATE_TABLES` inside `mp-tax-engine.js`:

| Tax year | Car/van first 10,000 mi | Car/van over 10,000 mi | Bicycle | Motorcycle |
|----------|--------------------------|-------------------------|---------|------------|
| 2025-26  | 45p | 25p | 20p | 24p |
| 2026-27  | 55p | 25p | 20p | 24p |

- Integer **pence** internally; pounds only at display boundaries
- `displayRateForVehicle()` returns the headline first-tier rate for UI labels only — not for `miles × rate` maths
- New tax years: add a new table entry; do not patch consumers

## Tax-year logic

- UK tax year: 6 April → 5 April
- `getUkTaxYear(date)` resolves the tax year for any journey or “as of” date
- Claims accumulate per tax year and vehicle type
- Cross-year periods split correctly inside `calculatePeriodClaims()`

## Threshold rules

- First **10,000** eligible business miles per tax year per vehicle type at first-tier rate
- Remaining miles at second-tier (reduced) rate
- Threshold is applied **chronologically** across all business journeys in the tax year
- `claimMarginalPounds()` uses prior business journeys for live tracking and goal projection

## Engine ownership

| Role | Owner |
|------|-------|
| Engine implementation | `frontend/js/mp-tax-engine.js` |
| Test matrix | `tests/mp-tax-engine.test.js` (25 tests) |
| Backend bridge | `backend/mpTaxEngine.js` |
| Change control | Explicit approval required — see `docs/CRITICAL_FILES.md` |

## Initialisation contract

Production script order loads `mp-tax-engine.js` before all consumers. If `MPTaxEngine` is unavailable, consumers throw:

```
MPTaxEngine unavailable. Application initialisation error.
```

Silent fallbacks (`0.55`, `miles × rate`, stored `hmrc`) are **removed**. A missing engine must fail loudly during development rather than produce incorrect financial data.

## Verification

```bash
npm run test:tax-engine   # 25/25 engine matrix
npm run test:vital        # Full regression including reports contract
node scripts/compare-legacy-hmrc.js   # Legacy stored vs engine (comparison only)
```

## Related documents

- `docs/MP-044-TAX-ENGINE.md` — Original MP-044 implementation notes
- `docs/MP-044-LEGACY-COMPARISON.json` — Stored vs recalculated comparison
- `docs/CRITICAL_FILES.md` — Protected file list

---

**Verdict: PASS — HMRC Engine Permanently Locked**
