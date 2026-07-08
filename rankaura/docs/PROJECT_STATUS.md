# RankAura Project Status

**Phase:** Aurora Build Sprint 005 — Mission Workspace (Intelligence Briefing)  
**Last updated:** Universal workflow engine for department reviews  
**UI status:** Mission Control locked — Mission Workspace rebuilt as briefing experience

## Aurora Build Sprint 005 (current)

- [x] **Mission Workspace** rebuilt at `/missions/[id]` — intelligence briefing, not CMS
- [x] **7 sections:** Header, Scout Report, Writer Draft, Architect Review, Guardian Review, Business Impact, Approval
- [x] **Universal workflow engine** — pluggable department sections for future teams (SEO, Ads, Email, Sales, Social, CRM, Support)
- [x] **Components:** MissionHeader, MissionStatusBadge, ScoutInsightCard, WriterDraftPreview, ArchitectChecklist, GuardianChecklist, BusinessImpactCard, ApprovalPanel, MetricBadge, DepartmentHeader
- [x] **Micro-interactions:** fade-in sections, card hover, skeleton loading, success animation
- [x] **missionService:** approve, approveDraft, requestChanges, requestRewrite, archive, leaveFeedback
- [x] Tests: `npm run test:aurora`
- [x] Mock only — no APIs, AI, auth, backend

## Mission Workspace Architecture

```
/missions/[id]
└── MissionWorkspace
    ├── MissionHeader          (title, status, metrics, primary CTA)
    ├── ScoutInsightCard       ← Research / market departments
    ├── WriterDraftPreview     ← Content departments
    ├── ArchitectChecklist     ← Structure / SEO departments
    ├── GuardianChecklist      ← Compliance / quality departments
    ├── BusinessImpactCard     ← Analyst / impact data
    └── ApprovalPanel          ← Universal approval gate
```

### Future department integration

| Future department | Plugs into | Data interface |
| ----------------- | ---------- | -------------- |
| SEO | ArchitectChecklist | `ArchitectReview` |
| Ads | ScoutInsightCard + BusinessImpactCard | `ScoutReport` + impact |
| Email | WriterDraftPreview | `WriterDraft` |
| Sales | ScoutInsightCard | `ScoutReport` |
| Social | WriterDraftPreview | `WriterDraft` |
| CRM | BusinessImpactCard | `MissionBriefingImpact` |
| Support | GuardianChecklist | `GuardianReview` |

Add a new department by: (1) extend `types/mission.ts`, (2) add mock in `lib/mock-mission.ts`, (3) create or reuse section component, (4) wire in `MissionWorkspace.tsx`.

## Aurora Build Sprint 004 (complete)

- [x] Living Mission Control — activity engine, Morning Brief, dynamic timeline

## Prior sprints (complete)

- Sprint 003: Initial Mission Workspace route
- Sprint 002: Mission Review navigation
- Sprint 001: Mission Control dashboard

## Not started

- [ ] AuraCore feeding real department output
- [ ] Persistence, auth, APIs, notifications, chat

## Build health

| Check | Status |
| ----- | ------ |
| TypeScript | Passing |
| ESLint | Passing |
| Production build | Passing |
| Aurora tests | Passing (`npm run test:aurora`) |

## How to run

```bash
cd rankaura
npm install
npm run dev
```

- Mission Control: http://localhost:3000
- Mission Workspace: http://localhost:3000/missions/mission-001

```bash
npm run test:aurora
```
