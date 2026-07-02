# Sprint 3 Roadmap — Intelligence First

Sprint 2 built the foundation: MIE, end-of-day review, mode-based reports. Sprint 3 deepens **learning, trust, and admin reduction** — not new settings screens.

## North star

> Reduce admin for self-employed professionals. Compete on intelligence, not GPS accuracy.

---

## P0 — Intelligence (ship first)

### 1. Richer MIE learning signals
- Learn **working hours** from shift start/end times (no onboarding questions)
- Detect **regular customers** via end-location clusters with visit counts
- **Typical routes** confidence boost after 3+ consistent classifications
- Persist confidence history per route for audit trail

### 2. End-of-day review polish
- Haptic / animation feedback on swipe classify
- “Review later” queue surfaced on dashboard badge
- Target: **< 20 seconds** median review time (instrument in beta feedback)

### 3. Explainability v2
- Show **visit count** and **last classified** date in card reasons
- “Why Personal?” copy for weekend + evening personal patterns
- Confidence trend: “Getting more confident on this route”

### 4. Business-only report hardening
- Block report generation when pending journeys exist (with one-tap review CTA)
- Accountant-friendly export metadata (tax year, vehicle rate, review status)

---

## P1 — Product depth

### 5. Manual mode report flow
- One-tap “Generate shift report” after review complete
- Clear “not emailed automatically” messaging in shift summary

### 6. MIE migration & privacy
- Export / reset intelligence model from Settings
- Document what is stored locally vs server

### 7. Subscription value tie-in
- Trial expiry: preserve MIE model; gate **new** learning + email reports
- Paywall copy emphasises “AI sorts your day in 30 seconds”

---

## P2 — Future module stubs (architecture only)

Do **not** build full features yet. Prepare interfaces:

| Module | Sprint 3 prep |
|--------|----------------|
| Receipt scanner | `MPMIE.analyseReceipt()` schema + placeholder UI hook |
| Expense intelligence | Category enum + local storage key design |
| HMRC business pack | Report template slots for expenses + VAT |
| Partner ecosystem | `MPPartnerAdapter` interface document |

---

## Explicitly deferred (Sprint 4+)

- Full receipt OCR pipeline
- Bank / accountant live integrations
- Income tracking dashboard
- New onboarding screens (unless they replace something MIE can learn)

---

## Success metrics

| Metric | Target |
|--------|--------|
| % journeys auto-sorted without review | > 70% after 2 weeks of use |
| Median end-of-day review time | < 30 seconds |
| User corrections per week | Decreasing trend |
| Trial → paid conversion | Baseline + improve via “admin saved” positioning |

---

## Engineering guardrails (carry forward)

1. **Do not modify** GPS, mileage engine, `summary-reports.js` email core without contract tests
2. All intelligence changes go through `mie-intelligence-engine.js` + tests
3. UI consumes MIE via `MPMIE` / `MPJourneyReview` only
4. `npm run test:vital` must pass before merge

---

## Suggested sprint order

1. MIE learning signals (working hours, customer clusters)
2. Review UX polish + pending queue
3. Report hardening (pending gate)
4. Manual mode generate flow
5. Instrumentation + beta survey on review time
