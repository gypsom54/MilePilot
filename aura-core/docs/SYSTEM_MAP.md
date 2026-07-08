# AuraCore — System Map

> Last updated: 2026-07-07

## Overview

AuraCore is the agent orchestration layer. Departments are self-contained editorial/production units that communicate through orchestrators.

```mermaid
flowchart TB
    subgraph AuraCore["AuraCore Platform"]
        AC[AuraCore Core]
    end

    subgraph WriterDept["Writer Department"]
        BRIDGE[AuraCoreBridge]
        ORCH[WriterDepartmentOrchestrator]

        subgraph Production["Production Modules"]
            PL[Planner]
            ST[Strategist]
            CW[Copywriter]
            ED[Editor]
        end

        subgraph Review["Review Modules"]
            SEO[SEOReviewer]
            BR[BrandReviewer]
            RR[ReadabilityReviewer]
            QA[QAReviewer]
        end

        subgraph Models["State Models"]
            LC[DraftLifecycle]
            RP[ReviewPipeline]
            BI[BusinessImpact]
            CQ[ContentQuality]
            REV[RevisionRequest]
            WR[WriterReport]
            VH[VersionHistory]
        end
    end

    AC -->|"submit_brief, get_status, get_report"| BRIDGE
    BRIDGE --> ORCH
    ORCH --> PL
    ORCH --> ST
    ORCH --> CW
    ORCH --> ED
    ORCH --> SEO
    ORCH --> BR
    ORCH --> RR
    ORCH --> QA
    ORCH --> Models

    PL -.->|"returns plan"| ORCH
    ST -.->|"returns strategy"| ORCH
    CW -.->|"returns draft"| ORCH
    ED -.->|"returns edited draft"| ORCH
    SEO -.->|"returns review result"| ORCH
    BR -.->|"returns review result"| ORCH
    RR -.->|"returns review result"| ORCH
    QA -.->|"returns review result"| ORCH
```

## Package layout

```
aura-core/
  docs/
    SYSTEM_MAP.md          ← this file
    PROJECT_STATUS.md
    DECISIONS.md
  packages/
    writer-department/
      src/
        config/            — pipeline order, thresholds, responsibilities
        types/             — shared types and interfaces
        models/            — lifecycle, pipeline, quality, impact models
        modules/           — production + review modules
        orchestrator/      — department orchestrator + AuraCore bridge
        mock/              — mock brief fixtures
      examples/            — runnable workflow demos
      tests/               — vitest test suites
```

## Draft lifecycle

```mermaid
stateDiagram-v2
    [*] --> brief_received
    brief_received --> planned : Planner
    planned --> strategized : Strategist
    strategized --> drafted : Copywriter
    drafted --> edited : Editor
    edited --> in_review : Orchestrator
    in_review --> revision_requested : Reviewer fail
    revision_requested --> edited : Revision resolved
    in_review --> approved : All reviewers pass
    approved --> published : Orchestrator
    published --> archived
    revision_requested --> archived : Max cycles exceeded
```

## Review pipeline

Reviewers execute sequentially in this order:

1. **SEOReviewer** — seo
2. **BrandReviewer** — brand
3. **ReadabilityReviewer** — readability
4. **QAReviewer** — qa

On failure: revision request → target module (copywriter or editor) → re-review.

## Communication contracts

| From | To | Method |
|------|----|--------|
| AuraCore | Writer Department | `AuraCoreBridge.handleRequest()` |
| Orchestrator | Any module | `module.execute(input)` |
| Module | Orchestrator | `ModuleResponse<T>` |
| Reviewer | Reviewer | **FORBIDDEN** |
| Module | Module | **FORBIDDEN** |

## Related projects

| Project | Location | Relationship |
|---------|----------|-------------|
| Vector OS | `vector-os/` | Design system + UI Lab (separate concern) |
| MilePilot | `/workspace` root | Existing product (no AuraCore coupling yet) |
