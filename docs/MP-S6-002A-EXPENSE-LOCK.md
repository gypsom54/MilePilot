# MP-S6-002A — Expense Engine Protection Lock

**Specification ID:** MP-S6-002A  
**Status:** LOCKED — Expense engine foundation accepted (pending MP-S6-002 approval)  
**Parent:** MP-S6-002 Expense Engine Foundation  
**Rollback:** Tag before MP-S6-002 merge

## Protected status

From MP-S6-002A onwards, **MPExpenseEngine is the single source of truth for business expenses**.

No feature may implement parallel expense storage, ad-hoc `mp_expenses` writes, or independent category lists.

## Protected files

| File | Lock level |
|------|------------|
| `frontend/js/expense-engine.js` | **ENGINE — LOCKED** |
| `frontend/js/business-workspace-models.js` (expense shape + keys) | **CONTRACT — PROTECTED** |
| `docs/MP-S6-DATA-MODEL.md` (expense section) | **SCHEMA AUTHORITY** |
| `tests/expense-engine.test.js` | **REGRESSION GATE** |

## Storage contracts (immutable without migration)

| Key | Purpose |
|-----|---------|
| `mp_expenses` | Expense[] JSON array |
| `mp_expense_categories` | Configurable category list |
| `mp_expense_meta` | Schema version + migration timestamp |

## Schema rules

- Amounts in **integer pence** only
- `schemaVersion: 1` until migration spec approved
- VAT fields are **storage only** — engine must not calculate VAT
- Soft delete via `deleted`; archive via `archived`
- Categories must remain configurable via engine API

## Required tests before merge

```bash
npm run test:expense-engine
npm run test:business-workspace
npm run test:tax-engine
npm run test:ask-milepilot
```

## Change approval matrix

| Change | Approval |
|--------|----------|
| New expense fields | Product + migration spec + tests |
| Schema version bump | Product + `migrateStorage()` update |
| Category defaults | Product review |
| Repository query API | Product + expense tests |
| VAT calculation logic | **S6-004 only** — not in expense engine |
| OCR / receipt parsing | **S6-003 only** |

## Extension rule

Future features **consume** `MPExpenseEngine` APIs. They must not:

- Write directly to `mp_expenses`
- Duplicate category enums in other modules
- Calculate VAT inside the expense engine
- Redesign Business Workspace layout for expense UI

## Related locks

| System | Document |
|--------|----------|
| Business Workspace shell | `docs/MP-S6-BUSINESS-LOCK.md` |
| HMRC mileage | `docs/MP-044-ENGINE-LOCK.md` |
| Ask MilePilot | `docs/MP-S5-ASK-LOCK.md` |
