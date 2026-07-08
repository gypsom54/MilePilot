# Writer Department

RankAura's **production-ready editorial department**. Not an AI writer — a modular content production system.

## Philosophy

- Plain English content for customers
- Every module has exactly one responsibility
- All communication routes through the orchestrator
- AuraCore talks only to the orchestrator
- No module talks directly to another module

## Folder structure

```
writer/
├── README.md
├── ARCHITECTURE.md
├── EXAMPLES.md
├── writerService.ts           # IAIEmployee facade → orchestrator
├── orchestrator/              # Department orchestrator (AuraCore entry)
├── models/                    # BusinessImpact, ContentQuality, etc.
├── lifecycle/                 # Draft lifecycle
├── pipeline/                  # Review pipeline
├── modules/
│   ├── planner/
│   ├── strategist/
│   ├── copywriter/
│   ├── editor/
│   ├── seo-reviewer/
│   ├── brand-reviewer/
│   ├── readability-reviewer/
│   └── qa-reviewer/
└── mock/
```

## Production flow

```
Brief → Planner → Strategist → Copywriter → [Review Pipeline]
                                              Editor → SEO → Brand → Readability → QA
```

## Usage

```typescript
import { writerDepartmentOrchestrator } from "@/services/employees/writer";

const draft = await writerDepartmentOrchestrator.receiveBrief({
  businessId: "biz_rankaura_demo",
  title: "Emergency Boiler Repair",
  contentType: "service",
  brief: "Create a helpful service page...",
});

await writerDepartmentOrchestrator.runProduction(draft.id);
await writerDepartmentOrchestrator.runReview(draft.id);
```

See `ARCHITECTURE.md` for the full diagram and `EXAMPLES.md` for more examples.
