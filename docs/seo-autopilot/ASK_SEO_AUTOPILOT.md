# How Ask SEO AutoPilot queries engines

## Role

`ask-autopilot` is the orchestration engine shell.

It does **not** contain SEO tools or business answers in Sprint 0.
It will coordinate registered engines in later volumes.

## Intended flow (future)

1. User question enters Ask SEO AutoPilot.
2. Ask consults the **Engine Registry** for available engines + health.
3. Ask publishes orchestration-related events on the **Event Bus**.
4. Specialist engines analyse / recommend via the shared `IntelligenceEngine` contract.
5. Ask may read context through the **Knowledge Graph SDK**.
6. Ask returns evidence-based actions aligned to the North Star.

## Sprint 0 reality

- Service scaffold exists: `services/ask-autopilot`
- Implements `IntelligenceEngine` via `BaseIntelligenceEngine`
- `analyse` / `recommend` / `automate` return `ENGINE_NOT_IMPLEMENTED`
- Owns `prompts/prompt.md`

No conversational product behaviour is implemented yet.
Volume 3 will specify the full orchestration engine.
