# MP-S6 — Business Workspace Data Models

**Specification ID:** MP-S6-DATA-MODEL  
**Status:** Sprint 2 — Expense engine implemented (MP-S6-002)  
**Schema version:** 1

## Storage keys

| Key | Model | Implementation |
|-----|--------|----------------|
| `mp_expenses` | Expense[] | `MPExpenseEngine` |
| `mp_expense_categories` | string[] | `MPExpenseEngine` |
| `mp_expense_meta` | `{ schemaVersion, migratedAt }` | `MPExpenseEngine` |
| `mp_receipts` | Receipt[] | Reserved (S6-003) |
| `mp_suppliers` | Supplier[] | Reserved |
| `mp_vat_periods` | VATRecord[] | Reserved (S6-004) |
| `mp_business_health` | BusinessHealth[] | Reserved (S6-005) |
| `mp_accountant_packs` | AccountantPack[] | Reserved (S6-007) |

## Expense (MP-S6-002)

```javascript
{
  id: string,
  businessId: string,
  createdISO: string,
  updatedISO: string,
  incurredISO: string,
  amountPence: number,          // integer pence
  currency: 'GBP',
  category: string,
  supplier: string,
  supplierId: string,
  description: string,
  receiptReference: string,
  vatStatus: 'unknown' | 'included' | 'excluded' | 'mixed',
  vatAmountPence: number,       // stored only — not calculated
  businessPercentage: number,   // 0–100
  notes: string,
  tags: string[],
  status: 'draft' | 'confirmed' | 'pending_receipt',
  attachments: AttachmentMeta[],
  archived: boolean,
  deleted: boolean,
  schemaVersion: 1
}
```

## Receipt (reserved)

```javascript
{
  id: string,
  expenseId: string,
  capturedISO: string,
  imageRef?: string,
  ocrStatus: 'pending' | 'processed' | 'failed',
  schemaVersion: 1
}
```

## Supplier (reserved)

```javascript
{
  id: string,
  name: string,
  vatNumber?: string,
  email?: string,
  schemaVersion: 1
}
```

## VATRecord (reserved)

```javascript
{
  id: string,
  periodStartISO: string,
  periodEndISO: string,
  outputVatPence: number,
  inputVatPence: number,
  status: 'draft' | 'submitted' | 'paid',
  schemaVersion: 1
}
```

## BusinessHealth (reserved)

```javascript
{
  id: string,
  asOfISO: string,
  score: number,
  highlights: string[],
  schemaVersion: 1
}
```

## AccountantPack (reserved)

```javascript
{
  id: string,
  periodLabel: string,
  generatedISO: string,
  includedSections: string[],
  status: 'draft' | 'ready' | 'sent',
  schemaVersion: 1
}
```

## Implementation

- Shapes: `frontend/js/business-workspace-models.js`
- Expense persistence: `frontend/js/expense-engine.js`
- Lock: `docs/MP-S6-002A-EXPENSE-LOCK.md`
