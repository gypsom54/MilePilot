# MP-S6-001 — Business Workspace Sprint 1: Foundations

**Specification ID:** MP-S6-001  
**Status:** COMPLETE — Sprint 1 foundation (await approval)  
**Depends on:** MP-044B (engine lock), MP-S5 (Ask production), unified reporting  
**Vision:** `docs/VISION_LOCK.md` — MilePilot Business tier

## Why now

Platform foundations are complete:

- Reliable trip collection (tracking engine)
- Protected financial engine (`MPTaxEngine`)
- Unified reporting (PDF, email, archive)
- Production Ask MilePilot (mileage domain)

The next value step is **Business Workspace** — making MilePilot a business companion, not an isolated mileage tracker. Resist adding disconnected AI features; build data layers first, then extend Ask.

## Sprint 1 scope (foundations only)

**In scope:**

1. **Navigation shell** — Business tab / workspace entry in primary nav (gated to Business experience tier when billing is ready; architecture stub now)
2. **Empty states** — professional placeholders for Expenses, VAT, Business Health, Accountant Pack (not-connected, consistent with Ask `NotConnected` pattern)
3. **Data model stubs** — `mp_expenses`, `mp_receipts`, `mp_vat_periods` localStorage schemas (versioned, no UI maths yet)
4. **Service boundaries** — `MPBusinessWorkspace` module: screen registry, feature flags, `isConnected(feature)` helpers
5. **Ask integration contract** — document how future intents will consume workspace data (no live expenses/VAT answers yet)

**Explicitly out of scope for Sprint 1:**

- Receipt OCR / camera scanning
- VAT calculation engine
- Business Health scoring
- Accountant Pack export
- Live Ask answers for fuel/VAT/expenses (remain `NotConnected`)
- Billing / subscription tier enforcement UI

## Recommended build order (full Business Workspace programme)

| Phase | Deliverable | Ask extension |
|-------|-------------|---------------|
| **Sprint 1** | Foundations, nav, empty states, data model | None (stubs only) |
| Sprint 2 | Receipt scanning / Expenses | "How much did I spend?" → real data |
| Sprint 3 | VAT tracking | "What is my VAT position?" → real data |
| Sprint 4 | Business Health | Health insights in workspace + Ask |
| Sprint 5 | Accountant Pack | Pack prepare/export via confirmation flow |
| Sprint 6 | Ask expansion | Cross-domain questions from unified workspace |

## Architecture principles

1. **MPTaxEngine remains sole authority for mileage claims** — expenses/VAT get their own engines or adapters, not duplicated in Ask
2. **Ask reads, never owns** — workspace services expose query APIs; Ask intents call them
3. **NotConnected until live** — same safety pattern as fuel/VAT today
4. **Confirmation for external actions** — accountant pack, exports follow `ActionExecutor` flow
5. **Upload mirror** — all new JS synced to `milepilot-upload-v2/`

## Files (anticipated)

| File | Role |
|------|------|
| `frontend/js/business-workspace.js` | Screen registry, feature flags, empty-state data |
| `frontend/js/business-workspace-view.js` | Workspace shell UI (new visual system — not Ask lock) |
| `frontend/index.html` | `#business` screen, nav item, `showBusiness()` |
| `docs/MP-S6-DATA-MODEL.md` | Storage schemas (to be written in Sprint 1) |

## Acceptance criteria (Sprint 1)

- [ ] Business Workspace reachable from primary nav (or feature-flagged stub)
- [ ] Empty states for Expenses, VAT, Business Health, Accountant Pack
- [ ] Data model documented and versioned; no production calculations
- [ ] Ask `NotConnected` responses unchanged (no premature data fabrication)
- [ ] `npm run test:vital` passes
- [ ] No changes to GPS, tracking, MPTaxEngine internals, or Ask visual shell

## Next action

Open implementation branch `cursor/business-workspace-sprint1-19bd` when Sprint 1 development begins.
