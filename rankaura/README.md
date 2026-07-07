# RankAura

**Your AI Growth Employee** — an AI Growth Operating System for small businesses.

## Documentation

- [AURA.md](docs/AURA.md) — Product philosophy and experience rules
- [SYSTEM_MAP.md](docs/SYSTEM_MAP.md) — Architecture overview
- [PROJECT_STATUS.md](docs/PROJECT_STATUS.md) — Phase 1 completion status
- [DECISIONS.md](docs/DECISIONS.md) — Architectural decision records

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Project structure

```
app/                  Next.js App Router
components/
  dashboard/          Approved dashboard shell (locked UI)
  ui/                 Design system primitives
config/               App configuration
database/             Repository interfaces (future)
docs/                 Architecture & product documentation
hooks/                React hooks (future)
integrations/         External API stubs (future)
lib/                  Backward-compatible re-exports
services/
  auracore/           Orchestration contracts
  dashboard/          Dashboard data service
  employees/          AI employee module stubs
styles/               Design tokens
types/
  models/             Domain models
  dashboard.ts        Dashboard view models
utils/                Shared utilities
```

## Phase 1 scope

Foundation only — no AI, no SEO engine, no auth, no database.

Every future feature has a defined place to live.
