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
│    employees/            AI employee modules                  │
│      scout/              Research employee (framework)      │
│      writer/             Writer Department (editorial)      │
├─────────────────────────────────────────────────────────────┤
│  types/                  TypeScript contracts                 │
│    models/               Domain models                        │
│    dashboard.ts          Dashboard view models              │
├─────────────────────────────────────────────────────────────┤
│  database/               Repository interfaces (future)     │
│  integrations/           External API stubs (future)        │
│  hooks/                  React hooks (future)               │
│  config/                 App configuration                  │
│  lib/                    Mock data (Aurora Sprint 001)      │
│  utils/                  Shared utilities                   │
│  styles/                 Design tokens                      │
└─────────────────────────────────────────────────────────────┘
```

## Data flow (Aurora Sprint 001 — Mission Control)

```
app/page.tsx
    → services/dashboard/dashboard.service.ts
        → lib/mock-dashboard.ts
    → components/dashboard/MissionControl.tsx (client state)
        → DailyBriefCard, MissionCard, GrowthTeamCard
        → BusinessHealthCard, TimelinePreview
        → MissionReviewPanel (approve / defer)
```

## Data flow (Phase 3 — planned)

```
app/page.tsx
    → services/auracore (IAuraCore)
        → services/employees/* (Scout, Writer, …)
        → database/* (repositories)
        → services/memory (MemoryStore)
    → services/dashboard/dashboard.service.ts (maps to view models)
    → components/dashboard/MissionControl.tsx
```

## Writer Department flow

```
AuraCore
    → writerService (IAIEmployee facade)
        → writerDepartmentOrchestrator
            → planner → strategist → copywriter (production)
            → reviewPipeline → editor → seo-reviewer → brand-reviewer
                                 → readability-reviewer → qa-reviewer
            → draftLifecycle / versionHistory / models
```

Modules never communicate directly — only through the orchestrator.

## Aurora Mission Control (Sprint 001 + 002)

| Section | Component | Service method |
| ------- | --------- | -------------- |
| Daily Brief | `DailyBriefCard` | `getDailyBrief()` |
| Today's Mission | `MissionCard` | `getTodayMission()` |
| Growth Team Status | `GrowthTeamCard` | `getGrowthTeamStatus()` |
| Business Health | `BusinessHealthCard` | `getBusinessHealth()` |
| Timeline Preview | `TimelinePreview` | `getTimelinePreview()` |
| Mission Review | `MissionReviewModal` + `MissionReview` | `lib/mission-review.ts` |
| Approval confirmation | `ApprovalConfirmation` | Local client state |

Mock data: `lib/mock-dashboard.ts`

### Mission Mode (immersive AI Business OS)

```
Review Mission → MissionModeTransition → /missions/[id]
    → MissionMode
        ├── MissionPipeline (7 AI employees, live progress)
        ├── MissionDocument (Notion-style working document)
        ├── LiveAIFeed (scrolling activity timeline)
        ├── AuraAssistant (Jarvis-style floating AI)
        └── MissionModeDeployment (cinematic approve flow)
```

Engine: `services/mission-mode/missionModeEngine.ts` + `hooks/useMissionModeEngine.ts`  
Mock data: `lib/mock-mission-mode.ts`

## AI employee modules

| Module     | Folder                              | Dashboard connection        |
| ---------- | ----------------------------------- | --------------------------- |
| AuraCore   | `services/auracore/`                | Orchestrates all modules    |
| Scout      | `services/employees/scout/`         | Opportunities, research reports |
| Writer     | `services/employees/writer/`        | AI Team, Content (department) |
| Architect  | `services/employees/architect/`     | Growth Momentum             |
| Optimiser  | `services/employees/optimiser/`     | Today's Wins                |
| Publisher  | `services/employees/publisher/`     | AI Team, Autopilot          |
| Analyst    | `services/employees/analyst/`       | Growth Momentum, Wins       |
| Guardian   | `services/employees/guardian/`      | Approval workflows          |
| Memory     | `services/memory/`                  | Business context for all    |

## Writer Department modules

| Module | Responsibility | Folder |
| ------ | -------------- | ------ |
| Planner | Content plan from brief | `modules/planner/` |
| Strategist | Angle and messaging strategy | `modules/strategist/` |
| Copywriter | First draft body | `modules/copywriter/` |
| Editor | Structure and clarity | `modules/editor/` |
| Discoverability Reviewer | Customer findability structure | `modules/seo-reviewer/` |
| Brand Reviewer | Voice and values | `modules/brand-reviewer/` |
| Readability Reviewer | Plain English | `modules/readability-reviewer/` |
| QA Reviewer | Final sign-off | `modules/qa-reviewer/` |

## Core domain models

Located in `types/models/`:

- Business, User, Website, Page
- Opportunity, Task, AIEmployee
- MemoryStore, Notification, GrowthMetric

Writer Department models in `services/employees/writer/models/`:

- ContentDraft, BusinessImpact, ContentQuality
- RevisionRequest, WriterReport, VersionHistory

## Task system

`types/models/task.ts` is the heart of AuraCore. Every AI employee action maps to a Task with priority, confidence, status, and approval requirements.
