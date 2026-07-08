# RankAura System Map

High-level architecture for the AI Growth Operating System.

## Layer overview

```
┌─────────────────────────────────────────────────────────────┐
│  app/                    Next.js pages & routing            │
├─────────────────────────────────────────────────────────────┤
│  components/             UI presentation                    │
│    dashboard/            Approved dashboard shell           │
│    ui/                   Design system primitives           │
├─────────────────────────────────────────────────────────────┤
│  services/               Business logic layer               │
│    auracore/             Orchestration contracts            │
│    memory/               Memory framework (read/write)      │
│    dashboard/            Dashboard data service + mocks     │
│    employees/            AI employee module stubs           │
├─────────────────────────────────────────────────────────────┤
│  types/                  TypeScript contracts                 │
│    models/               Domain models                        │
│    dashboard.ts          Dashboard view models              │
├─────────────────────────────────────────────────────────────┤
│  database/               Repository interfaces (future)     │
│  integrations/           External API stubs (future)        │
│  hooks/                  React hooks (future)               │
│  config/                 App configuration                  │
│  utils/                  Shared utilities                   │
│  styles/                 Design tokens                      │
└─────────────────────────────────────────────────────────────┘
```

## Data flow (Phase 1)

```
app/page.tsx
    → services/dashboard/dashboardService.ts
        → services/dashboard/mockData.ts
    → components/dashboard/DashboardShell.tsx
        → components/ui/* (design system)
```

## Data flow (Phase 2 — planned)

```
app/page.tsx
    → services/auracore (IAuraCore)
        → services/employees/* (Scout, Writer, …)
        → database/* (repositories)
        → types/models/memory (MemoryStore)
    → services/dashboard/dashboardService.ts (maps to view models)
    → components/dashboard/*
```

## AI employee modules

| Module     | Folder                              | Dashboard connection        |
| ---------- | ----------------------------------- | --------------------------- |
| AuraCore   | `services/auracore/`                | Orchestrates all modules    |
| Scout      | `services/employees/scout/`         | Opportunities, research reports |
| Writer     | `services/employees/writer/`        | AI Team, Content            |
| Architect  | `services/employees/architect/`     | Growth Momentum             |
| Optimiser  | `services/employees/optimiser/`     | Today's Wins                |
| Publisher  | `services/employees/publisher/`     | AI Team, Autopilot          |
| Analyst    | `services/employees/analyst/`       | Growth Momentum, Wins       |
| Guardian   | `services/employees/guardian/`      | Approval workflows          |
| Memory     | `services/memory/`                  | Business context for all    |

## Core domain models

Located in `types/models/`:

- Business, User, Website, Page
- Opportunity, Task, AIEmployee
- MemoryStore, Notification, GrowthMetric

## Task system

`types/models/task.ts` is the heart of AuraCore. Every AI employee action maps to a Task with priority, confidence, status, and approval requirements.
