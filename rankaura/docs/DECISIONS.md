# RankAura Architectural Decisions

Record of key decisions made during Phase 1 foundation build.

## ADR-001: RankAura is an AI Growth OS, not SEO software

**Decision:** All naming, copy, and architecture avoid SEO terminology in user-facing surfaces.  
**Rationale:** Product philosophy — users hire an AI employee, not configure SEO tools.  
**Status:** Accepted

## ADR-002: Separate domain models from dashboard view models

**Decision:** `types/models/` holds domain entities; `types/dashboard.ts` holds presentation DTOs.  
**Rationale:** Dashboard can evolve independently; API mapping layer stays clean.  
**Status:** Accepted

## ADR-003: AuraCore as orchestration interface only (Phase 1)

**Decision:** `IAuraCore` defines contracts with no implementation.  
**Rationale:** Allows parallel development of employees and UI without premature coupling.  
**Status:** Accepted

## ADR-004: Mock dashboard service before real APIs

**Decision:** `services/dashboard/mockData.ts` feeds `dashboardService.ts`.  
**Rationale:** UI is decoupled from backend; swap mock for AuraCore in Phase 2.  
**Status:** Accepted

## ADR-005: AI employees as isolated service folders

**Decision:** Each employee gets `README.md`, `index.ts`, `types.ts`, `config.ts`.  
**Rationale:** Clear ownership boundaries for a 10+ year modular codebase.  
**Status:** Accepted

## ADR-006: UI is approved and locked

**Decision:** Phase 1 refactors extract design system components without visual changes.  
**Rationale:** Product design is complete; engineering builds underneath.  
**Status:** Accepted

## ADR-007: Task model as AuraCore heart

**Decision:** All employee work maps to `Task` with approval, confidence, and impact fields.  
**Rationale:** Single orchestration primitive for prioritisation and completion tracking.  
**Status:** Accepted

## ADR-008: Memory as interfaces only (Phase 1)

**Decision:** `MemoryStore` interface defined; no persistence implementation.  
**Rationale:** Writer and Scout need contracts before storage layer exists.  
**Status:** Accepted

## ADR-009: Config and utils separation

**Decision:** `config/` for app constants; `utils/` for pure functions; `lib/` re-exports for compatibility.  
**Rationale:** Scalable convention as codebase grows.  
**Status:** Accepted

## ADR-010: No authentication in Phase 1

**Decision:** Placeholder user/business in `config/placeholders.ts`.  
**Rationale:** Auth is Phase 2; framework should not assume provider.  
**Status:** Accepted

## ADR-011: Memory write access gated to AuraCore

**Decision:** `IMemoryReader` for employees; `IMemoryService` writes reject non-AuraCore actors.  
**Rationale:** Prevents employees modifying each other or memory directly.  
**Status:** Accepted

## ADR-012: Writer as editorial department, not AI writer

**Decision:** Replace single Writer employee stub with a Writer Department: Planner, Strategist, Copywriter, Editor, and four specialised reviewers plus QA.  
**Rationale:** Production-ready editorial workflow with clear separation of concerns; no AI content generation in framework phase.  
**Status:** Accepted

## ADR-013: Orchestrator-only module communication (Writer Department)

**Decision:** All Writer modules return results to `writerDepartmentOrchestrator` only. No module calls another module. AuraCore uses `writerService` → orchestrator.  
**Rationale:** Enforces single responsibility, auditability, and safe future AI substitution per module.  
**Status:** Accepted

## ADR-014: Sequential review pipeline with early exit

**Decision:** Review order: Editor → Discoverability → Brand → Readability → QA. Pipeline stops on first failed reviewer with a revision request.  
**Rationale:** Mirrors real editorial sign-off; avoids wasted downstream reviews on blocked drafts.  
**Status:** Accepted

## ADR-015: Draft lifecycle as explicit state machine

**Decision:** `draftLifecycle.transition()` governs all status changes with actor and summary metadata recorded in `VersionHistory`.  
**Rationale:** Audit trail and predictable state for AuraCore task mapping.  
**Status:** Accepted
