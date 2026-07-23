# MP-S6-002 — Expense Engine Foundation

**Specification ID:** MP-S6-002  
**Status:** PASS — awaiting approval  
**Depends on:** MP-S6-001 (Business Workspace), MP-S6-BUSINESS-LOCK  
**Sprint:** 2 — Expenses Foundation (no OCR, AI, or receipt scanning)

## Objective

Create MilePilot's permanent expense subsystem. All future business spending features must consume this engine.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  MPExpenseEngine (protected)                 │
│              frontend/js/expense-engine.js                   │
├─────────────────────────────────────────────────────────────┤
│  Expense Store        │  localStorage mp_expenses           │
│  Category Config      │  localStorage mp_expense_categories │
│  Migration Meta       │  localStorage mp_expense_meta        │
│  Repository           │  CRUD, archive, soft/hard delete      │
│  Validation           │  Integer pence, category, VAT store │
│  Search & Filters     │  category, supplier, date, amount…  │
│  Statistics           │  monthly/yearly/category totals     │
│  Attachments          │  Metadata only (future OCR)         │
│  Query API            │  totalSpentPence() for Ask/VAT      │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
  business-workspace.js   business-expenses-tool.js   Future: OCR, VAT, Ask
  isConnected('expenses')  Tool surface (no fake data)
```

## Expense object (schema v1)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Unique |
| `businessId` | string | Default `default` |
| `createdISO` / `updatedISO` / `incurredISO` | ISO string | |
| `amountPence` | integer | Business amount in pence |
| `currency` | string | Default `GBP` |
| `category` | string | From configurable list |
| `supplier` / `supplierId` | string | Name + future supplier link |
| `description` | string | |
| `receiptReference` | string | Manual ref until OCR |
| `vatStatus` | enum | `unknown` \| `included` \| `excluded` \| `mixed` — **stored only** |
| `vatAmountPence` | integer | Stored only — **not calculated** |
| `businessPercentage` | 0–100 | Business-use portion |
| `notes` / `tags` | string / string[] | |
| `status` | enum | `draft` \| `confirmed` \| `pending_receipt` |
| `attachments` | array | Metadata only |
| `archived` / `deleted` | boolean | Soft lifecycle |
| `schemaVersion` | number | `1` |

## Categories (configurable)

Fuel, Parking, Vehicle, Tools, Equipment, Office, Travel, Meals, Accommodation, Subscriptions, Software, Telephone, Internet, Marketing, Professional Fees, Training, Insurance, Other.

Configurable via `MPExpenseEngine.setCategories()` / `addCategory()` / `removeCategory()`.

## Statistics (no fake data)

- Expense count
- Monthly spend (business-adjusted pence)
- Yearly spend
- Category totals
- Pending receipts (no receipt reference and no attachments)

## Future compatibility

| Consumer | Integration |
|----------|-------------|
| Receipt OCR (S6-003) | `createExpense()` + `addAttachment()` |
| VAT Engine (S6-004) | Read `vatStatus` / `vatAmountPence` |
| Business Health (S6-005) | `getStatistics()` |
| AI Bookkeeper (S6-006) | `searchExpenses()` + `totalSpentPence()` |
| Ask MilePilot | `totalSpentPence()` query API |
| Accountant Pack | `loadExpenses()` export |

## Migration strategy

1. On init, `migrateStorage()` normalises legacy Sprint 1 shapes (`receiptId` → `receiptReference`, adds `businessId`).
2. `mp_expense_meta` records `schemaVersion` and `migratedAt`.
3. Future schema bumps require migration spec per `MP-S6-002A-EXPENSE-LOCK.md`.

## Protected systems (unchanged)

GPS · Tracking · AutoPilot · MPTaxEngine · Ask MilePilot · Reports · Email · PDF · Business Workspace layout

## Tests

```bash
npm run test:expense-engine    # 14 tests
npm run test:business-workspace  # 44 tests
```

## Files

| File | Role |
|------|------|
| `frontend/js/expense-engine.js` | Engine + repository |
| `frontend/js/business-expenses-tool.js` | Tool surface (locked primitives) |
| `frontend/js/business-workspace-models.js` | Extended expense interface |
| `frontend/js/business-workspace.js` | `isConnected('expenses')`, `paintTool` branch |
| `tests/expense-engine.test.js` | Repository tests |
| `docs/MP-S6-002A-EXPENSE-LOCK.md` | Protection lock |

## Final status

**PASS** — Expense engine foundation complete. Await product approval before Sprint 3 (Smart Receipt Capture).
