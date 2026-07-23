# MP-S6 — Business Workspace Production Lock

**Specification ID:** MP-S6-BUSINESS-LOCK  
**Status:** LOCKED — Business Workspace foundation accepted (merged PR #164)  
**Parent:** MP-S6-001 (Sprint 1 foundation), MP-S6-001C (visual/accessibility sign-off)  
**Deliverable:** `docs/MP-S6-001-DELIVERABLE.md` — PASS (approved)

## Protected status

From MP-S6-BUSINESS-LOCK onwards, **Business Workspace layout, navigation, component system, empty-state philosophy, Ask position, and data model interfaces are protected**.

Business Workspace is the production shell for MilePilot Business tier features. Sprint 1 delivers foundations only — tool cards, navigation, premium empty states, and data contracts. **Future business features must extend this foundation; they must not redesign it without explicit product approval.**

**Sprint 2 is not authorised by this lock.** Await the next specification before starting receipt scanning, expenses implementation, VAT engine, or live Ask answers for business domains.

## What is locked

| Area | Locked contract |
|------|-----------------|
| **Business Workspace layout** | Home + tool-detail two-screen pattern (`#mpBusinessWorkspaceRoot` / `#mpBusinessToolRoot`) |
| **Business navigation** | Six-tab primary nav: Home · Ask · **Business** · Reports · History · Settings |
| **Workspace component system** | `WorkspaceHeader`, `WorkspaceCard`, `WorkspaceSection`, `WorkspaceEmptyState`, `WorkspaceDivider`, Ask embed |
| **Empty-state philosophy** | Premium “Coming Soon” placeholders — honest, professional, no fake data or calculations |
| **Ask MilePilot position** | Embedded hero on Business home; handoff via `openAskWithQuestion()` — Ask remains separate nav tab |
| **Workspace data model interfaces** | `MPBusinessWorkspaceModels` + `docs/MP-S6-DATA-MODEL.md` storage keys and schemas |

## Protected files

| File | Lock level | Responsibility |
|------|------------|----------------|
| `frontend/css/business-workspace.css` | **Visual system — LOCKED** | Layout, cards, empty states, tool screens, nav density |
| `frontend/js/business-workspace-view.js` | **Components — LOCKED** | Reusable workspace UI primitives |
| `frontend/js/business-workspace.js` | **Controller — PROTECTED** | Tool registry, navigation, mount/leave, Ask handoff |
| `frontend/js/business-workspace-models.js` | **Data contracts — PROTECTED** | Schema interfaces; `isConnected()` gates |
| `frontend/index.html` (Business wiring only) | **Routing — PROTECTED** | `#business` screen, `showBusiness`, nav item, `showScreen` leave hook |
| `docs/MP-S6-DATA-MODEL.md` | **Schema authority** | Storage keys and model shapes |
| `milepilot-upload-v2/` mirrors | Deploy mirror | Must stay in sync with production |

## Tool registry (protected)

`TOOLS` in `business-workspace.js` is the **sole authority** for Business Workspace tool cards:

| Tool ID | Feature key | Sprint 1 status |
|---------|-------------|-----------------|
| `expenses` | `expenses` | Empty state only |
| `vat` | `vat` | Empty state only |
| `bookkeeper` | `bookkeeper` | Empty state only |
| `health` | `businessHealth` | Empty state only |
| `accountant` | `accountantPack` | Empty state only |

Rules:

- New tools require product approval and registry + test updates
- `isConnected(feature)` remains `false` until a dedicated sprint delivers live data
- Ask intents for business domains stay `NotConnected` until workspace services expose query APIs (see `docs/MP-S5-ASK-LOCK.md`)

## Navigation and lifecycle (protected)

| Rule | Requirement |
|------|-------------|
| Primary nav order | Home → Ask → Business → Reports → History → Settings |
| `showScreen` leave | Must call `MPBusinessWorkspace.leave()` when leaving `#business` |
| Session restore | `mp_active_screen === 'business'` restores via `showBusiness()` |
| Deep link | `?view=business` opens Business Workspace |
| Focus management | Tool open focuses heading; back restores originating card (MP-S6-001C) |
| `showHome()` | Must not remount Business when already on `#business` |

## Empty-state philosophy (protected)

Business Workspace empty states must:

- Explain what the feature **will** do — not pretend it already works
- Use “Coming Soon” badges consistently
- Avoid fabricated amounts, VAT figures, health scores, or expense lists
- Match premium tone established in Sprint 1 visual sign-off

## Ask integration (protected position)

- Ask embed lives on Business home — **not** inside individual tool screens
- Handoff uses production Ask (`showAsk` + `MPAskMilePilotApp.submitQuestion`)
- Ask visual shell remains governed by `docs/MP-S5-ASK-LOCK.md` and `docs/MP-S4-003-ASK-VISUAL-LOCK.md`
- Business Workspace must not duplicate Ask composer UI outside the embed pattern

## Data model interfaces (protected)

Reserved storage keys and schemas in `docs/MP-S6-DATA-MODEL.md`:

- `mp_expenses`, `mp_receipts`, `mp_suppliers`, `mp_vat_periods`, `mp_business_health`, `mp_accountant_packs`

Future sprints may **implement** persistence against these interfaces. They must not rename keys or break `schemaVersion: 1` without a migration spec.

## Systems that remain separately protected

Business Workspace does **not** override:

| System | Lock document |
|--------|----------------|
| GPS / AutoPilot / background tracking | `docs/TRACKING_BACKGROUND_VITAL_LOCK.md` |
| Mileage claims | `docs/MP-044-ENGINE-LOCK.md` |
| Ask MilePilot production | `docs/MP-S5-ASK-LOCK.md` |
| Ask visual shell | `docs/MP-S4-003-ASK-VISUAL-LOCK.md` |
| Reports / PDF / email | Existing report locks |

## Change approval matrix

| Change type | Approval required |
|-------------|-------------------|
| Workspace layout / component visual system | Product + MP-S6 visual sign-off |
| Tool registry (add/remove/rename tools) | Product + `test:business-workspace` |
| Navigation order or tab labels | Product — explicit approval only |
| Empty-state copy (minor) | Product review |
| Empty-state structure / redesign | Product + visual sign-off |
| Ask embed position or handoff contract | Product + Ask lock review |
| Data model schema changes | Product + migration spec + model tests |
| Implementing live feature data (Sprint 2+) | Dedicated sprint specification |

## Required tests before merge

```bash
npm run test:business-workspace   # 44 tests
npm run test:ask-milepilot        # Ask unchanged
npm run test:tracking             # Tracking unchanged
npm run test:vital                # Full vital suite
```

## Extension rule (Sprint 2+)

Future business features must:

1. **Extend** the tool registry and `isConnected()` gates — not replace the shell
2. **Implement** data behind existing model interfaces — not invent parallel schemas
3. **Expose** query APIs for Ask — not embed business logic in Ask service
4. **Preserve** empty-state pattern for any feature not yet live

**Do not begin Sprint 2 without the next approved specification.**

## Related documents

- `docs/MP-S6-001-BUSINESS-WORKSPACE-SPRINT1.md` — Sprint 1 scope
- `docs/MP-S6-001-DELIVERABLE.md` — deliverable sign-off
- `docs/MP-S6-001B-VISUAL-SIGNOFF.md` — visual approval pack
- `docs/MP-S6-DATA-MODEL.md` — data model interfaces
- `docs/MP-S5-ASK-LOCK.md` — Ask production lock
- `docs/VISION_LOCK.md` — MilePilot Business tier vision
