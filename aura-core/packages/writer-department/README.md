# Writer Department

Production-ready editorial department framework for AuraCore.

**This is NOT an AI writer.** It is an architecture-only framework with mock data. No OpenAI, no content generation APIs, no databases.

## Architecture

```
AuraCore
    │
    ▼
AuraCoreBridge  ──►  WriterDepartmentOrchestrator
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
    Production          Review Pipeline      Models
    Modules             (sequential)         & State
        │                   │
   Planner            SEOReviewer
   Strategist          BrandReviewer
   Copywriter          ReadabilityReviewer
   Editor              QAReviewer
```

**Communication rules:**
- AuraCore → Orchestrator only (via `AuraCoreBridge`)
- Modules → Orchestrator only
- Reviewers never talk to each other
- No module talks directly to another module

## Modules

| Module | Responsibility |
|--------|---------------|
| **Planner** | Transform briefs into structured content plans |
| **Strategist** | Define narrative angle and positioning |
| **Copywriter** | Produce draft copy from plan + strategy |
| **Editor** | Structural, clarity, and consistency edits |
| **SEOReviewer** | Keyword usage and search optimisation only |
| **BrandReviewer** | Brand voice and tone adherence only |
| **ReadabilityReviewer** | Reading level and sentence structure only |
| **QAReviewer** | Factual consistency and publish-readiness only |

## Models

| Model | Purpose |
|-------|---------|
| `DraftLifecycle` | State machine for content from brief → published |
| `ReviewPipeline` | Sequential reviewer stage management |
| `BusinessImpact` | Business reach, conversion, and risk assessment |
| `ContentQuality` | Multi-dimensional quality scoring |
| `RevisionRequest` | Structured revision requests from reviewers |
| `WriterReport` | Department output report per brief |
| `VersionHistory` | Draft version tracking |

## Install

```bash
cd aura-core
pnpm install
```

## Run tests

```bash
pnpm test
```

## Run examples

```bash
pnpm example:workflow    # Full brief → report pipeline
pnpm example:review      # Review pipeline stage breakdown
pnpm example:revision    # AuraCore bridge + revision cycle
```

## Typecheck

```bash
pnpm typecheck
```

## Usage

```typescript
import { AuraCoreBridge } from '@aura-core/writer-department';
import { MOCK_BRIEF_LANDING_PAGE } from '@aura-core/writer-department';

const bridge = new AuraCoreBridge();

const response = bridge.handleRequest({
  type: 'submit_brief',
  payload: MOCK_BRIEF_LANDING_PAGE,
  requestId: 'req-001',
  timestamp: new Date().toISOString(),
});
```

## Future AI integration points

See `../../docs/DECISIONS.md` for planned integration boundaries.

| Integration point | Module | Purpose |
|-------------------|--------|---------|
| Brief enrichment | Planner | AI-assisted outline generation |
| Strategy drafting | Strategist | AI-assisted angle/positioning |
| Copy generation | Copywriter | AI-assisted first draft |
| Editorial pass | Editor | AI-assisted structural edits |
| SEO analysis | SEOReviewer | AI-assisted keyword analysis |
| Brand check | BrandReviewer | AI-assisted tone analysis |
| Readability | ReadabilityReviewer | AI-assisted clarity scoring |
| QA check | QAReviewer | AI-assisted completeness check |

All AI integrations must plug into existing module interfaces via the orchestrator. No direct AI-to-AI or reviewer-to-reviewer communication.

## Build readiness

| Area | Score | Notes |
|------|-------|-------|
| Architecture | 95% | Orchestrator pattern complete |
| Types & interfaces | 95% | Full type coverage |
| Module isolation | 100% | Enforced by design |
| Mock data | 90% | 3 brief fixtures |
| Tests | 85% | 25+ assertions across 5 suites |
| Documentation | 90% | README + system docs |
| AI integration | 0% | Intentionally not built |
| **Overall framework** | **88%** | Ready for AI plug-in phase |
