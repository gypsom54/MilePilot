# AuraCore — Architecture Decisions

> Last updated: 2026-07-07

## ADR-001: Writer Department is not an AI writer

**Decision:** The Writer Department is a production editorial department framework, not an AI content generator.

**Rationale:** Separating architecture from AI allows the department structure, review pipeline, and quality models to be validated independently before any model provider is connected.

**Consequences:**
- All modules use mock/deterministic logic
- No OpenAI, Anthropic, or other AI SDKs
- No content is generated — only structural placeholders

---

## ADR-002: Orchestrator-only communication

**Decision:** All inter-module communication flows through `WriterDepartmentOrchestrator`. AuraCore communicates only through `AuraCoreBridge`.

**Rationale:** Prevents coupling between modules, enables audit trails, and mirrors real editorial department workflows where a production manager coordinates specialists.

**Consequences:**
- Reviewers cannot call each other
- Production modules cannot call reviewers directly
- Every handoff is logged in lifecycle/pipeline state

---

## ADR-003: Single responsibility per reviewer

**Decision:** Each reviewer module evaluates exactly one dimension.

| Reviewer | Sole responsibility |
|----------|-------------------|
| SEOReviewer | Search optimisation |
| BrandReviewer | Brand voice and tone |
| ReadabilityReviewer | Reading clarity |
| QAReviewer | Publish-readiness |

**Rationale:** Mirrors specialist editorial roles. Prevents one reviewer from blocking on another reviewer's concerns.

---

## ADR-004: Sequential review pipeline

**Decision:** Reviewers run in fixed order: SEO → Brand → Readability → QA.

**Rationale:** SEO and brand checks should complete before readability and final QA. Order is configurable in `department.config.ts`.

**Consequences:**
- Pipeline blocks on first failure
- Revision cycles are capped at `MAX_REVISION_CYCLES` (3)
- Failed stages generate `RevisionRequest` targeting copywriter or editor

---

## ADR-005: Mock data only

**Decision:** No APIs, databases, or external services in the framework phase.

**Rationale:** Validates architecture without infrastructure dependencies.

**Mock fixtures:**
- `MOCK_BRIEF_LANDING_PAGE` — high-impact landing page
- `MOCK_BRIEF_EMAIL` — medium-impact email
- `MOCK_BRIEF_ARTICLE` — strategic-impact article

---

## ADR-006: TypeScript monorepo with pnpm

**Decision:** AuraCore lives in `aura-core/` as a pnpm workspace with `@aura-core/writer-department` as the first package.

**Rationale:** Consistent with `vector-os/` monorepo pattern. TypeScript provides compile-time safety for interfaces and models.

---

## Future AI integration points

When AI is added, it must respect these boundaries:

| Module | Integration approach | Constraint |
|--------|---------------------|------------|
| Planner | AI provider behind `Planner.execute()` | Input: brief. Output: ContentPlan |
| Strategist | AI provider behind `Strategist.execute()` | Input: brief + plan. Output: ContentStrategy |
| Copywriter | AI provider behind `Copywriter.execute()` | Input: brief + plan + strategy. Output: Draft |
| Editor | AI provider behind `Editor.execute()` | Input: Draft. Output: EditedDraft |
| SEOReviewer | AI scoring behind `evaluate()` | Must return ReviewFinding[] only |
| BrandReviewer | AI scoring behind `evaluate()` | Must return ReviewFinding[] only |
| ReadabilityReviewer | AI scoring behind `evaluate()` | Must return ReviewFinding[] only |
| QAReviewer | AI scoring behind `evaluate()` | Must return ReviewFinding[] only |

**Rules for AI integration:**
1. AI never bypasses the orchestrator
2. AI never connects reviewer to reviewer
3. AI output must conform to existing interfaces
4. AI providers are swappable per module
5. Mock mode remains available for testing

---

## ADR-007: Stop after framework

**Decision:** This phase delivers architecture only. No AI, APIs, or content generation.

**Status:** Complete.
