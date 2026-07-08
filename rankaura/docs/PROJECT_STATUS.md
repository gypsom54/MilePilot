# RankAura Project Status

**Phase:** Sprint 014 — Mission Workspace (Vector OS Core Workflow)  
**Last updated:** Mission-centric intelligence briefing with deployment animation  
**UI status:** Mission Control locked — Mission Workspace is primary workflow

## Sprint 014 (current)

- [x] **Mission-centric workflow** — `/missions/[id]` is the primary review experience
- [x] **Premium intelligence briefing** — generous whitespace, soft cards, minimal borders
- [x] **Reusable components:** MissionHeader, DepartmentCard, FindingCard, ApprovalFooter, DeploymentAnimation
- [x] **Department sections:** Scout, Writer, Architect, Guardian (pluggable for Sales, Finance, Operations, Support, Hiring)
- [x] **Deployment animation** — Writer → Architect → Publisher → Website Updated
- [x] **Aura confirmation** — "Mission Complete. Your business has been improved."
- [x] Tests: `npm run test:aurora`

## Mission Workspace Architecture

```
/missions/[id]
└── MissionWorkspace
    ├── MissionHeader
    ├── DepartmentCard × N (Scout, Writer, Architect, Guardian, …)
    │   └── FindingCard (research / KPI findings)
    ├── ApprovalFooter
    └── DeploymentAnimation → AuraConfirmation
```

### Plugging in future departments

1. Add department data to `types/mission.ts`
2. Add mock data in `lib/mock-mission.ts`
3. Create section component using `DepartmentCard` + `FindingCard`
4. Register in `MissionWorkspace.tsx`
5. Add accent colour in `DepartmentCard` `DEPARTMENT_ACCENTS`

No layout redesign required.

## Prior sprints (complete)

- Sprint 005: Intelligence briefing sections
- Sprint 004: Living Mission Control
- Sprints 001–003: Foundation and dashboard loop

## Not started

- Notifications, chat, AI APIs, backend persistence

## Build health

| Check | Status |
| ----- | ------ |
| TypeScript | Passing |
| ESLint | Passing |
| Aurora tests | Passing (`npm run test:aurora`) |

## How to run

```bash
cd rankaura && npm install && npm run dev
```

- Mission Control: http://localhost:3000
- Mission Workspace: http://localhost:3000/missions/mission-001

Approve a mission to see the deployment animation.
