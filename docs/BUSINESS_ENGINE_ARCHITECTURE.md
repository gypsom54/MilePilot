# MilePilot — Business Engine Architecture (Review + LOCK)

**Status:** 🔒 LOCKED — all future Business Hub development must follow this.
**Governed by:** [PRODUCT_VISION_MASTER.md](./PRODUCT_VISION_MASTER.md)
**Tests:** `node tests/business-engine.test.js` (runs in CI via `build-upload.sh`)

---

## Principle

> **UI displays information. Engines calculate information. AI interprets information.**
> Never mix responsibilities.

Every Business Hub feature plugs into these engines. Screens own no data and
perform no calculation — they subscribe to a single live snapshot.

---

## Topology

```
                         ┌──────────────────────┐
                         │   Event Bus (pub/sub) │  ← the only channel
                         └──────────┬───────────┘
   emit/subscribe (no engine calls another directly)
┌───────────┬───────────┬───────────┬───────────┬───────────┬───────────┐
│ Receipt   │ OCR       │ Expense   │ VAT       │ Timeline  │ Health    │
│ Engine    │ Engine    │ Engine    │ Engine    │ Engine    │ Engine    │
└───────────┴───────────┴───────────┴───────────┴───────────┴───────────┘
┌───────────┬───────────┬───────────┐
│ Report    │ AI        │ Notify    │
│ Engine    │ Engine    │ Engine    │
└───────────┴───────────┴───────────┘
                         ▲
              Business Engine (orchestrator)
       wires engines · injects providers · getSnapshot()
                         ▲
              Business Home (UI facade: MPBusinessHub)
                  subscribe(fn) → render, no refresh
```

Files: `frontend/js/business/*.js` (engines + bus + store + orchestrator),
`frontend/js/business-hub.js` (UI facade).

---

## Event flow (fully automatic)

```
Receipt Captured → RECEIPT_CAPTURED → (store+compress) → RECEIPT_STORED
      → OCR Engine → OCR_STARTED → OCR_COMPLETE
      → Expense Engine → EXPENSE_UPDATED
            → VAT Engine → VAT_UPDATED
            → Timeline Engine → TIMELINE_UPDATED
            → Health Engine → HEALTH_UPDATED
            → Report Engine → REPORT_UPDATED
                  → Notification Engine → NOTIFICATION_QUEUED
                  → AI Engine → AI_LEARNED
      → orchestrator → STATE_CHANGED → Business Home re-renders
```

The user never triggers any of this. One action (e.g. an expense) fans out
through the bus and the Home updates with no refresh button.

---

## Why each engine exists (single responsibility)

| Engine | Owns | Reacts to | Emits |
|--------|------|-----------|-------|
| **Receipt** | capture, storage, compression, retry, status | — | `RECEIPT_CAPTURED/STORED/FAILED/STATUS_CHANGED` |
| **OCR** | image enhancement, OCR, raw text, confidence | `RECEIPT_STORED` | `OCR_STARTED/COMPLETE/FAILED` |
| **Expense** | merchant, category, totals, history | `OCR_COMPLETE` | `EXPENSE_UPDATED` |
| **VAT** | VAT detection, month/quarter totals | `EXPENSE_UPDATED` | `VAT_UPDATED` |
| **Timeline** | unified chronological activity feed | `RECEIPT_CAPTURED`, `EXPENSE_UPDATED`, `MILEAGE_UPDATED` | `TIMELINE_UPDATED` |
| **Business Health** | organisation score, missing items, readiness, suggestions | mileage/expense/vat/receipt events | `HEALTH_UPDATED` |
| **Report** | daily/weekly/monthly/quarterly/yearly/accountant data model | mileage/expense/vat events | `REPORT_UPDATED` |
| **AI** | natural language, suggestions, insights, learning | all data events | `AI_LEARNED` |
| **Notification** | daily briefing, weekly review, missing receipt, health changes | health/report/receipt events | `NOTIFICATION_QUEUED` |

Cross-cutting: **Event Bus** (`event-bus.js`) and **Store** (`store.js`, the only
persistence boundary; localStorage in-app, in-memory in tests).

---

## Design decisions (why this is production-grade)

- **Pluggable externals.** OCR (`recognise`), image compression (`compress`),
  expense classification (`classify`), and AI reasoning (`responder`) are all
  injected. Real native Vision / cloud OCR / an LLM plug in with zero changes to
  the engines — satisfying "support future AI features without major refactoring."
- **Honest zero-states.** With no real OCR yet, the default recogniser returns an
  empty low-confidence result and the Expense Engine refuses to fabricate an
  expense. Numbers are always real.
- **No circular dependencies.** Engines depend only on the bus + their store.
  Where one engine needs another's data (VAT needs expenses), the orchestrator
  injects a provider callback — a runtime read, not a load-time dependency. Every
  module `require()`s standalone in the test suite.
- **Replaceable.** Any engine can be swapped as long as it honours its event
  contract. Tests instantiate each engine in isolation with a fresh bus + store.
- **Reliable.** The bus isolates handler errors (one bad subscriber can't break
  the chain); the store degrades to in-memory on quota/serialization failure.
- **Locked pipelines untouched.** The Report Engine is a *data model only* — the
  existing report email/PDF pipeline (`MPSummaryReports` / backend) and native
  notification delivery remain the source of truth for delivery. The Notification
  Engine only *decides and queues*; the delivery layer drains the queue.

---

## How the Business Home uses it

`MPBusinessHub` (UI facade) holds a reference to the started engine and exposes
`getHealth()`, `getSummary()`, `getModules()`, `subscribe()`, `ask()` — pure
mapping of engine snapshots to render shapes. `openBusinessHub()` ingests current
mileage then renders; `subscribe(STATE_CHANGED)` re-renders the screen live.

The Home screen contains **no business math**.

---

## How future features plug in

1. **Receipt capture UI** → call `engine.engines.receipt.capture({imageRef})`. The
   rest (OCR → expense → VAT → health → timeline → report → notify) happens
   automatically.
2. **Real OCR** → `MPBusinessEngine.start({ ocr: { recognise } })`.
3. **Expenses screen** → read `engine.getSnapshot().expenses`; add via
   `engine.engines.expense.addExpense(...)`.
4. **VAT / Accountant Pack screens** → read `snapshot.vat` / `snapshot.reports`.
5. **AI Bookkeeper** → `engine.ask(question)`; swap in an LLM via `ai.responder`.
6. **Notifications** → delivery layer drains `engine.engines.notification.getPending()`.

No feature re-implements calculation. It plugs into an engine.

---

## Success criteria — met

- ✅ Every engine independently testable (12 isolated tests).
- ✅ Every engine replaceable (event-contract only; injected externals).
- ✅ All communication via events (no direct engine-to-engine calls).
- ✅ No circular dependencies (all modules load standalone in tests).
- ✅ No duplicated business logic (Home facade delegates; health logic lives once
  in the Health Engine).
- ✅ Supports future AI without refactoring (injected reasoning + learning bus).

---

## Change policy

- Add new engines by giving them a single responsibility and an event contract.
- Never call one engine from another directly — emit/subscribe via the bus.
- Never compute business values in the UI.
- Update `tests/business-engine.test.js` when contracts change; it runs in CI.
