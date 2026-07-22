# MP-S5-001 — Ask MilePilot Core Engine (Mileage Foundation)

**Specification ID:** MP-S5-001  
**Depends on:** MP-S4-003 (visual shell locked)  
**Status:** Complete — functional mileage foundation  
**Branch:** `cursor/ask-milepilot-core-engine-19bd`

---

## Objective

Connect the locked Ask MilePilot interface to MilePilot's existing business engine so it answers real mileage questions using live user data — **no AI, no UI redesign**.

---

## Architecture

```
AskMilePilotService (frontend/js/ask-milepilot-service.js)
├── IntentRouter          — pattern matching, no AI
├── MileageQueryService   — claims, summaries, month comparison
├── JourneyQueryService   — today/week/month/pending/last journey
├── ReportQueryService    — report payloads via MPSummaryReports / MPCustomReport
├── ResponseFormatter     — natural language (never raw JSON)
└── ActionExecutor        — confirmation-gated email/export/prepare

MPAskMilePilotApp         — controller; UI talks only to service
MPAskMilePilotView        — locked CSS classes only
```

---

## Supported questions

| Category | Example |
|----------|---------|
| Mileage | How much can I claim this month? |
| Mileage | How many miles have I driven? |
| Journeys | Show today's journeys |
| Journeys | Show this week's / month's trips |
| Review | Which trips still need reviewing? |
| Reports | Prepare / export / email my report |
| AutoPilot | Is AutoPilot enabled? |
| AutoPilot | When was my last journey? / Did I drive yesterday? |

---

## Confirmation flow

Actions (`Email my accountant`, `Export my report`, `Prepare my mileage report`) show the **locked MP-S4 confirmation UI** before executing. Actions delegate to the existing report engine via `apiPost('/reports/send')` or `apiPost('/reports/pdf')`.

---

## Preview (development)

```bash
npx serve frontend -p 8000
# Functional: http://localhost:8000/ask-milepilot-preview
# Static scenarios: http://localhost:8000/ask-milepilot-preview?s=simple&nav=0
```

---

## Protected systems

**Not modified:** production routing, onboarding, Business Hub, AutoPilot engine, trip detection, locked shell visuals.

---

## Tests

```bash
npm run test:ask-milepilot
npm run test:vital
```

---

## Out of scope (future sprints)

Expenses, fuel, VAT, OCR, Business Health, AI summaries, OpenAI, accountant packs, voice, image uploads.
