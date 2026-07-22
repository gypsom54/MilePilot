# MP-S6 — Business Workspace Data Models

**Specification ID:** MP-S6-DATA-MODEL  
**Status:** Sprint 1 — interfaces only (no persistence implementation)  
**Schema version:** 1

## Storage keys (reserved)

| Key | Model |
|-----|--------|
| `mp_expenses` | Expense[] |
| `mp_receipts` | Receipt[] |
| `mp_suppliers` | Supplier[] |
| `mp_vat_periods` | VATRecord[] |
| `mp_business_health` | BusinessHealth[] |
| `mp_accountant_packs` | AccountantPack[] |

## Expense

```javascript
{
  id: string,
  supplierId: string,
  amountPence: number,
  currency: 'GBP',
  category: string,
  description: string,
  incurredISO: string,
  receiptId?: string,
  status: 'draft' | 'confirmed',
  schemaVersion: 1
}
```

## Receipt

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

## Supplier

```javascript
{
  id: string,
  name: string,
  vatNumber?: string,
  email?: string,
  schemaVersion: 1
}
```

## VATRecord

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

## BusinessHealth

```javascript
{
  id: string,
  asOfISO: string,
  score: number,
  highlights: string[],
  schemaVersion: 1
}
```

## AccountantPack

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

## Implementation note

Sprint 1 defines shapes in `frontend/js/business-workspace-models.js` only.  
No reads or writes to localStorage for these keys until Sprint 2+.
