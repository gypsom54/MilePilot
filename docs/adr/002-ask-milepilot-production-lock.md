# ADR 002: Ask MilePilot Production Lock

**Status:** Accepted  
**Date:** 2026-07-22  
**Context:** MP-S5-005 production integration audit approved; PR #163 merged to `main`.

## Decision

Ask MilePilot is locked as a production feature with three protected subsystems:

1. **Visual shell** (`ask-milepilot-view.js`) — MP-S4 appearance is frozen; functional semantics may evolve behind the same UI contract.
2. **Intent registry** (`IntentRouter` in `ask-milepilot-service.js`) — all question routing changes require dedicated review and test expansion.
3. **Action execution** (`ActionExecutor`) — confirmation-gated external actions; no silent execution.

Financial calculations in Ask must continue to delegate exclusively to `MPTaxEngine` (ADR 001).

## Consequences

### Positive

- Predictable user experience for a production-facing feature
- Intent collisions and action-safety regressions caught by CI
- Clear boundary before connecting expenses, VAT, and Business Health data sources

### Negative / deferred

- Browser back/forward does not map to in-app screens (see MP-S5-006 backlog)
- New Ask capabilities for expenses/VAT require Business Workspace data layers first

## Compliance

- CODEOWNERS entries on Ask files
- Agent rule: `.cursor/rules/vital-ask-milepilot.mdc`
- Lock document: `docs/MP-S5-ASK-LOCK.md`
