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

## ADR-016: Aurora Mission Control as first product loop

**Decision:** Replace legacy multi-section dashboard with Mission Control: Daily Brief → Today's Mission → Growth Team → Business Health → Timeline. One primary CTA: Review Mission.  
**Rationale:** First release (Aurora) must feel immediately usable — calm, focused, confident.  
**Status:** Accepted (Sprint 001)

## ADR-017: API-shaped dashboard service with mock data

**Decision:** `services/dashboard/dashboard.service.ts` exposes discrete methods (`getDailyBrief`, `getTodayMission`, etc.) reading from `lib/mock-dashboard.ts`.  
**Rationale:** Swap mock for real API without changing UI components.  
**Status:** Accepted (Sprint 001)

## ADR-018: Mission approval as local UI state (Sprint 001)

**Decision:** Approve Mission updates mission status and prepends a timeline event in client state only. No publishing or Guardian backend yet.  
**Rationale:** Validates the review loop UX before backend wiring.  
**Status:** Accepted (Sprint 001)

## ADR-019: Mission Review as composable modal experience (Sprint 002)

**Decision:** Split Mission Review into `MissionReview` (content), `MissionReviewModal` (shell + steps), and `ApprovalConfirmation` (post-approve). Shared logic in `lib/mission-review.ts`.  
**Rationale:** Reusable, testable components; polished two-step approve → confirm flow without dashboard redesign.  
**Status:** Accepted (Sprint 002)

## ADR-020: Continue Growing opens Mission Review (Sprint 002)

**Decision:** Daily Brief secondary CTA "Continue Growing" opens the same Mission Review modal as "Review Mission" when a mission is pending.  
**Rationale:** Two familiar entry points, one review experience; no extra features.  
**Status:** Accepted (Sprint 002)
