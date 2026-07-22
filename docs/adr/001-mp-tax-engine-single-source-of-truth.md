# ADR 001: MPTaxEngine as the Single Source of Truth for Mileage Claims

**Status:** Accepted  
**Date:** 2026-07-22  
**Deciders:** Product (MP-044B approved)  
**Related:** MP-044, MP-044B, `docs/MP-044-ENGINE-LOCK.md`

## Context

MilePilot previously calculated HMRC mileage allowances in multiple places — dashboard helpers, report builders, shift normalisation, and preview tools each carried their own rate constants or `miles × rate` shortcuts. This produced inconsistent totals, made tax-year and threshold changes risky, and blocked confident expansion into Ask MilePilot, Business Health, VAT, and accountant exports.

MP-044 introduced `MPTaxEngine` as a unified calculation engine. MP-044B removed legacy fallbacks and permanently locked the architecture.

## Decision

**All mileage claim calculations must route through `MPTaxEngine`.**

1. **Single implementation** — `frontend/js/mp-tax-engine.js` is the only production HMRC rate table and calculation logic.
2. **Backend bridge** — `backend/mpTaxEngine.js` loads the frontend engine file; Node consumers must not duplicate rates.
3. **Consumer rule** — Dashboards, reports, PDFs, emails, Ask MilePilot, and all future features call engine helpers (`claimMarginalPounds`, `periodClaimTotals`, `sumRecalculatedClaims`, etc.). They must not multiply miles by a rate locally.
4. **HMRC changes** — New tax years or rate updates are implemented by extending versioned tables inside `MPTaxEngine` only. No consumer may introduce parallel calculation logic.
5. **Failure mode** — If `MPTaxEngine` is unavailable at runtime, consumers throw `MPTaxEngine unavailable. Application initialisation error.` Silent fallbacks are prohibited.
6. **Stored values** — `trip.hmrc` / `shift.hmrc` remain persisted for legacy comparison but must not be displayed as authoritative totals; the engine recalculates on read.

## Consequences

### Positive

- One tested matrix (`npm run test:tax-engine`, 25 tests) governs all financial output.
- Future features (Ask, Business Health, VAT, AI insights) inherit correct threshold and tax-year behaviour automatically.
- HMRC rate changes are localized to one file per tax year.

### Negative / constraints

- `mp-tax-engine.js` is a protected subsystem; changes require explicit approval and full `npm run test:vital`.
- All new features must depend on engine load order (script tag before consumers).
- Tests that exercise financial paths must load `MPTaxEngine` in their sandbox.

### Protected files

| File | Role |
|------|------|
| `frontend/js/mp-tax-engine.js` | Core engine |
| `backend/mpTaxEngine.js` | Node adapter |
| `tests/mp-tax-engine.test.js` | Regression matrix |

See `docs/CRITICAL_FILES.md` §13 and `.cursor/rules/vital-tax-engine.mdc`.

## Compliance

Any PR that adds `miles × rate`, hard-coded `0.45`/`0.55` claim paths, or duplicate `VEHICLE_RATES` tables outside the engine must be rejected unless it is an explicit engine extension with tests.
