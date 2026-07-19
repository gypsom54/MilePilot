# AMOS Sprint 2 Journey Integration

AMOS (Ask MilePilot Orchestration System) is an additive architecture layer that routes deterministic intents to approved tools exposed by registered engines.

Scope in Sprint 2:
- Deterministic intent routing only
- Single tool execution per workflow
- Registry-based tool allowlist
- Structured response and structured audit record
- Journey adapter wraps trusted existing production logic from:
	- `frontend/js/summary-reports.js`
	- `frontend/js/trip-store.js`
	- `frontend/js/journey-review.js`

Registered Journey tools:
- `journey.getMileageSummary`
- `journey.getTodayTrips`
- `journey.getTripHistory`
- `journey.getPendingReviews`
- `journey.getJourneyById`

Supported routed requests:
- Weekly mileage summary
- Today's journeys
- Last journey
- Journeys awaiting review

Out of scope:
- No UI changes
- No generative AI
- No multi-tool workflows
- No AMOS email or report sending
- No tracking or native code changes

## Structure

- `core/`: AMOS bootstrap, Journey adapter, trusted frontend VM loaders
- `intent-router/`: deterministic intent routing
- `engine-registry/`: engine registration + health checks
- `tool-registry/`: tool discovery + allowlist
- `workflow-runner/`: request lifecycle execution
- `response-builder/`: natural-language response formatter
- `audit-logger/`: safe structured audit events
- `contracts/`: typed contracts and validators
- `tests/`: AMOS-specific automated tests and harness

## Run

```bash
npm run test:amos
npm run amos:harness
```
