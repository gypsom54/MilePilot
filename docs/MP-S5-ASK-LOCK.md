# MP-S5 — Ask MilePilot Production Lock

**Specification ID:** MP-S5-ASK-LOCK  
**Status:** LOCKED — Ask MilePilot is an accepted production feature (merged PR #163)  
**Parent:** MP-S5-002 (production integration), MP-S5-005 (integration audit)  
**Audit:** `docs/MP-S5-005-AUDIT.md` — PASS WITH CORRECTIONS (approved)

## Protected status

From MP-S5-ASK-LOCK onwards, **Ask MilePilot production shell and intent registry are protected**.

Ask MilePilot is the production conversational interface for mileage, HMRC claims, journeys, reports, and AutoPilot status. It is **not** a general-purpose AI chatbot and must not fabricate business data.

## Protected files

| File | Lock level | Responsibility |
|------|------------|----------------|
| `frontend/js/ask-milepilot-view.js` | **Visual shell — LOCKED** | MP-S4 typography, spacing, composer, chips, cards, confirmation UI |
| `frontend/js/ask-milepilot-service.js` | **Intent + logic — PROTECTED** | IntentRouter, query services, ResponseFormatter, ActionExecutor |
| `frontend/js/ask-milepilot-app.js` | **Lifecycle — PROTECTED** | mount/leave, submit, confirm, event binding |
| `frontend/index.html` (Ask wiring only) | **Routing — PROTECTED** | `showAsk`, `buildAskDeps`, `initAskMilePilot`, deep link, session restore |
| `milepilot-upload-v2/` mirrors | Deploy mirror | Must stay in sync with production |

**Preview-only (not production):** `ask-milepilot-shell.js` — static demo shell for `?s=`; changes do not affect production.

## Intent registry (protected)

`IntentRouter` in `ask-milepilot-service.js` is the **sole authority** for question → intent resolution.

| Rule | Requirement |
|------|-------------|
| New intents | Require dedicated review + regression tests |
| Collision changes | Must prove email lookup ≠ email action, claim ≠ mileage summary, report ≠ trip list |
| Not-connected features | fuel, VAT, accountant pack → `NotConnected` until data sources exist |
| Unsupported questions | `Unknown` — no fabricated answers |

Protected intent categories:

- Financial queries → must use `MPTaxEngine` (never local multiplication)
- External actions → confirmation flow only; no execution on question submit
- Information lookup vs action → distinct intents and formatters

## Action execution (protected)

External actions (prepare report, export, email) must follow:

```
REQUESTED → PROPOSED → AWAITING_CONFIRMATION → CONFIRMED/CANCELLED → EXECUTING → SUCCESS/FAILURE
```

Must-not-regress:

- Question submit does not call `apiPost`
- Missing saved email blocks preparation (no fake recipient)
- Double-confirm / double-tap cannot execute twice (`executing` flag)
- Navigation away (`leave()`) clears pending actions
- Raw backend errors are not exposed to the user

## Financial calculations (protected)

All claim amounts in Ask responses must route through `MPTaxEngine` via `buildAskDeps().claimFn` or engine helpers. See `docs/MP-044-ENGINE-LOCK.md`.

Ask must **not**:

- Multiply `miles × rate` independently
- Sum stored `trip.hmrc` for period totals
- Fall back to flat rates when engine is unavailable (must throw)

## Change approval matrix

| Change type | Approval required |
|-------------|-------------------|
| Visual shell (typography, spacing, colours, layout) | Product + MP-S4 visual sign-off |
| Intent routing / new intents | Product + `test:ask-milepilot` expansion |
| Action execution flow | Product + action-safety test review |
| Financial calculation path | Product + `test:tax-engine` + `test:ask-parity` |
| Production routing / mount lifecycle | Product + routing regression tests |
| Connecting new data sources (expenses, VAT, etc.) | Dedicated sprint spec; extend via `NotConnected` removal only when source is live |

## Required tests before merge

```bash
npm run test:ask-milepilot   # 43+ tests
npm run test:ask-parity      # HMRC parity matrix
npm run test:tax-engine      # engine unchanged
npm run test:vital           # full vital suite
```

## Related documents

- `docs/MP-S5-002-ASK-PRODUCTION.md` — integration architecture
- `docs/MP-S5-005-AUDIT.md` — production audit (approved)
- `docs/MP-S4-001-ASK-MILEPILOT.md` — original visual lock
- `docs/adr/002-ask-milepilot-production-lock.md` — ADR
- `docs/MP-S5-006-BROWSER-HISTORY.md` — known routing backlog
