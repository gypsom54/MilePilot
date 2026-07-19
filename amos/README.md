# AMOS Sprint 1 Foundation

AMOS (Ask MilePilot Orchestration System) is an additive architecture layer that routes deterministic intents to approved tools exposed by registered engines.

Scope in Sprint 1:
- Deterministic intent only (`journey.mileage_summary`)
- Single tool execution per workflow
- Registry-based tool allowlist
- Structured response and structured audit record
- Journey adapter wraps trusted existing summary logic from `frontend/js/summary-reports.js`

Out of scope in Sprint 1:
- No UI changes
- No generative AI
- No multi-tool workflows
- No report generation or email sending through AMOS

## Structure

- `core/`: AMOS bootstrap and Journey adapter
- `intent-router/`: deterministic intent routing
- `engine-registry/`: engine registration + health checks
- `tool-registry/`: tool discovery + allowlist
- `workflow-runner/`: request lifecycle execution
- `response-builder/`: structured response formatter
- `audit-logger/`: safe structured audit events
- `contracts/`: typed contracts and validators
- `tests/`: AMOS-specific automated tests and harness

## Run

```bash
npm run test:amos
npm run amos:harness
```
