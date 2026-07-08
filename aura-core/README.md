# AuraCore

Production editorial department framework for the Aura platform.

## Packages

| Package | Description |
|---------|-------------|
| `@aura-core/writer-department` | Writer Department — editorial orchestrator, modules, models |

## Quick start

```bash
cd aura-core
pnpm install
pnpm test
pnpm example:workflow
```

## Documentation

- [System Map](docs/SYSTEM_MAP.md) — architecture diagram and communication rules
- [Project Status](docs/PROJECT_STATUS.md) — build progress and readiness score
- [Decisions](docs/DECISIONS.md) — architecture decision records

## Rules

- **Not an AI writer** — architecture only
- **No OpenAI** — no AI integrations in this phase
- **No APIs or databases** — mock data only
- **Orchestrator-only communication** — modules never talk directly
