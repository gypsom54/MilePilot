# RankAura Project Status

**Phase:** Sprint 015 — Mission Workspace Proper Build  
**Last updated:** Full-page intelligence briefing with mock approval workflow  
**UI status:** Mission Control locked — Mission Workspace is primary workflow

## Sprint 015 (current)

- [x] **Route `/missions/[id]`** — connected to Review Mission CTA on dashboard
- [x] **Mock mission id** — `research-storage-conditions-guide`
- [x] **Full-page intelligence briefing** — substantially different from dashboard (no sidebar)
- [x] **Components:** MissionWorkspacePage, MissionHeader, AuraBrief, DepartmentWorkflow, DepartmentContributionCard, DraftPreview, ArchitecturePlan, BusinessImpactGrid, ApprovalPanel, DeploymentAnimation
- [x] **Department workflow** — Scout, Writer, Architect, Guardian, Publisher contributions
- [x] **Draft preview** — large article-style preview panel
- [x] **Approval workflow** — Approve, Request Changes, Save For Later (local state)
- [x] **Deployment animation** — Preparing → Writer → Architect → Guardian → Publisher → Mission approved
- [x] **Timeline update** — prepends "Mission approved: …" on approve (local mock store)
- [x] **Service functions** — `getMissionById`, `approveMission`, `requestChanges`, `saveForLater`
- [x] Tests: `npm run test:aurora`

## Mission Workspace Architecture

```
/missions/[id]
└── MissionWorkspacePage
    ├── MissionHeader (executive briefing + actions)
    ├── AuraBrief
    ├── DepartmentWorkflow → DepartmentContributionCard × N
    ├── DraftPreview
    ├── ArchitecturePlan
    ├── BusinessImpactGrid
    ├── ApprovalPanel
    └── DeploymentAnimation → MissionApprovedConfirmation
```

### Plugging in future departments

1. Add `DepartmentContribution` to `lib/mock-mission.ts`
2. Add accent colour in `DepartmentContributionCard` `DEPARTMENT_ACCENTS`
3. No layout redesign required

## Prior sprints (complete)

- Sprint 014: Premium intelligence briefing primitives
- Sprint 005: Intelligence briefing sections
- Sprint 004: Living Mission Control
- Sprints 001–003: Foundation and dashboard loop

## Known limitations (Sprint 015)

- Timeline updates are local to the in-memory mission store — dashboard timeline does not sync on approve
- No real publishing, APIs, AI, or database
- Mission store resets on server restart

## Not started

- Notifications, chat, AI APIs, backend persistence, WordPress

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
- Mission Workspace: http://localhost:3000/missions/research-storage-conditions-guide

Click **Review Mission** on the dashboard, or open the URL directly. Approve a mission to see the deployment animation.
