# MP-S5-005 — Ask MilePilot Production Integration Audit

**Specification ID:** MP-S5-005  
**Branch / PR:** `cursor/ask-milepilot-production-19bd` / PR #163  
**Depends on:** MP-044 / MP-044B (merged via PR #162)  
**Audit date:** 2026-07-22  
**Status:** Verification complete — **MERGED** (PR #163 → `main`, 2026-07-22)  
**Post-merge lock:** `docs/MP-S5-ASK-LOCK.md`, ADR 002  

---

## 14. FINAL VERDICT

### **PASS WITH CORRECTIONS**

Ask MilePilot is safely integrated into production routing, script order, and the locked MP-S4 visual shell. All automated gates pass. Corrections were applied during this audit (see §Remaining risks). **Do not merge until human approval.**

---

## 1. Files changed by PR #163

| File | Change |
|------|--------|
| `frontend/index.html` | Ask nav tab, `#ask` screen, `buildAskDeps`, `initAskMilePilot`, `showAsk`, deep link `?view=ask`, session restore, `showScreen` leave hook |
| `frontend/js/ask-milepilot-app.js` | Production app controller (mount/leave/submit/confirm) |
| `frontend/js/ask-milepilot-service.js` | Intent router, query services, formatter, action executor |
| `frontend/js/ask-milepilot-view.js` | Locked MP-S4 visual templates |
| `milepilot-upload-v2/index.html` | Mirror of production wiring |
| `milepilot-upload-v2/js/ask-milepilot-*.js` | Deployment mirror |
| `tests/ask-milepilot-service.test.js` | 43 integration tests |
| `scripts/mp-s5-parity-audit.js` | HMRC parity matrix (8 cases) |
| `docs/MP-S5-002-ASK-PRODUCTION.md` | Integration notes |
| `docs/adr/001-mp-tax-engine-single-source-of-truth.md` | Engine ADR |
| `docs/CRITICAL_FILES.md`, `.github/CODEOWNERS`, `.cursor/rules/vital-tax-engine.mdc` | Engine protection metadata |
| `package.json` | `test:ask-milepilot`, `test:ask-parity` in vital suite |

**Protected subsystems unchanged in this PR:** `mp-tax-engine.js`, GPS/tracking, AutoPilot, motion detection, trip start/end, native bridge, onboarding, report maths internals, Business Hub (not present), service worker logic.

---

## 2. Production routing map

| User action | Route handler | Screen | Ask mount | Composer ready |
|-------------|---------------|--------|-----------|----------------|
| Ask nav tab | `showAsk()` → `setNav('Ask')` → `showScreen('ask')` | `#ask` active | `MPAskMilePilotApp.mount(true)` | `paint()` → empty or conversation |
| `?view=ask` deep link | `parseDeepLink()` → `showAsk()` | `#ask` | `mount(true)` | immediate |
| Refresh on Ask | `bootApp()` → `sessionStorage mp_active_screen==='ask'` → `showAsk()` | `#ask` | `mount(true)` | fresh empty state |
| Browser back/forward | *No per-screen `pushState`* | May leave app / prior history entry | N/A | **Known limitation** |
| Ask → Mileage | `showHome()` / nav → `showScreen('home')` | `#home` | `MPAskMilePilotApp.leave()` clears pending | Mileage unaffected |
| Ask → Reports | `showReports()` | `#reports` | `leave()` on screen change | Reports unaffected |
| Ask → Business Hub | **N/A** — Business Hub not in production `index.html` | — | — | — |
| App launch (no view) | `bootApp()` → `goHome()` | `#home` | Ask not mounted | — |
| Invalid `?view=` | `parseDeepLink()` returns false → default boot | `#home` | — | — |
| Return from Settings | `showScreen` back to prior screen via nav | User-selected | Remount on next `showAsk()` | Idempotent |
| Mobile nav | Same `showAsk()` path; bottom nav `#nav` | `#ask` | Same mount chain | Touch targets unchanged |

**Routing chain (typical):**

```
User taps Ask
  → showAsk()
  → requireActiveAccess (subscription gate)
  → setNav('Ask')
  → showScreen('ask')  [persists mp_active_screen]
  → MPAskMilePilotApp.mount(true)  [service already init via initAskMilePilot]
  → paint() → innerHTML replace → bindEvents()
  → composer input focusable
```

**Confirmed:** No duplicate persistent listeners (DOM replaced each `paint()`). Leaving Ask calls `leave()` → `cancelAction()` + state reset. No route loop. Mileage/Reports routes unchanged.

---

## 3. Script-load order (production)

```
1.  mp-tax-engine.js          ← HMRC engine (required first)
2.  trip-store.js
3.  custom-period-report.js
4.  summary-reports.js
5.  ask-milepilot-view.js     ← locked shell templates
6.  ask-milepilot-service.js  ← consumes MPTaxEngine
7.  ask-milepilot-app.js      ← consumes service + view
8.  bootApp() → initAskMilePilot() → MPAskMilePilotService.init(buildAskDeps())
```

**Fail-fast:** `defaultClaim`, `collectRange` fallback, and `getHmrcRate` throw `MPTaxEngine unavailable. Application initialisation error.` when engine missing. No silent flat-rate fallback.

---

## 4. Real-data lineage table

| Question | Intent | Service path | Production dependency | Storage | Engine | Formatter | View |
|----------|--------|--------------|----------------------|---------|--------|-----------|------|
| How much can I claim this month? | ClaimAmount | `MileageQueryService.claimThisMonth` | `buildAskDeps().getTrips/getShifts` | `MPTrips` / `trips[]` | `calculateTaxYearClaims` | `claimAmount` | simple |
| How many miles have I driven? | MileageSummary | `mileageSummary('month')` | `collectRange` → `MPCustomReport` or engine | trips | `periodClaimTotals` | `mileageSummary` | simple/text |
| Show today's journeys | TodaysTrips | `JourneyQueryService.todaysTrips` | `getTrips()` filtered by date | trips | per-row `hmrcById` | `journeyList` | detailed |
| Show this week's trips | WeeklyTrips | `weeklyTrips` | same | trips | engine | `journeyList` | detailed |
| Show this month's trips | MonthlyTrips | `monthlyTrips` | same | trips | engine | `journeyList` | detailed |
| Which trips need reviewing? | PendingTrips | `pendingTrips` | `MPTrips.getPendingTrips` | trips | — | `pendingTrips` | detailed |
| Compare this month with last month | CompareMonths | `compareMonths` | `collectRange` ×2 | trips | engine | `compareMonths` | text |
| Did I drive yesterday? | DroveYesterday | `droveYesterday` | date-filtered trips | trips | — | `droveYesterday` | text |
| When was my last journey? | LastJourney | `lastJourney` | trips + shifts sort | trips/shifts | — | `lastJourney` | text |
| Is AutoPilot enabled? | AutopilotStatus | `autopilotStatus` | `MPTrackingMode`, `MPAutoPilotMotion` | localStorage | — | `autopilotStatus` | text |
| Prepare my mileage report | MileageReport | `prepareMonthlyReport` | `MPSummaryReports.buildPayload` | trips + settings | `getHmrcRate` | `confirmAction` | confirm |
| Export my report | ExportReport | `exportReportPreview` | same | same | engine | `confirmAction` | confirm |
| Email my accountant | EmailAccountant | `emailAccountantPreview` | `getEmail`, report payload | `mp_email` | engine | `confirmAction` / blocked | confirm/text |

**No preview fixtures, demo values, fake journeys, or hard-coded recipients in the production path.** Missing email blocks action preparation entirely.

---

## 5. Intent registry and collision results

| Query | Resolved intent | Safe? |
|-------|-----------------|-------|
| How much can I claim this month? | ClaimAmount | ✓ |
| How many miles did I drive this month? | MileageSummary | ✓ |
| Show my report for this month | MileageReport | ✓ (corrected: added `show.*report` pattern) |
| Email my mileage report to my accountant | EmailAccountant | ✓ |
| What is my accountant's email? | AccountantEmailLookup | ✓ (does not trigger EmailAccountant) |
| Show trips that need reviewing | PendingTrips | ✓ |
| Did I drive yesterday? | DroveYesterday | ✓ |
| Is AutoPilot enabled? | AutopilotStatus | ✓ |
| How much did I spend on fuel? | NotConnected (fuel) | ✓ |
| What is my VAT position? | NotConnected (vat) | ✓ |
| Prepare my accountant pack | NotConnected (accountantPack) | ✓ |
| Tell me a joke | Unknown | ✓ (no fabricated data) |

---

## 6. External-action safety proof

**State flow:** REQUESTED → PROPOSED (`confirmAction` sets `pendingAction`) → AWAITING_CONFIRMATION (confirm view) → CONFIRMED/CANCELLED → EXECUTING → SUCCESS/FAILURE

| Check | Result |
|-------|--------|
| Question submission does not execute | ✓ `apiPost` not called on `handleQuestion` |
| Confirmation render does not execute | ✓ |
| Page refresh does not execute | ✓ pending not persisted; fresh mount |
| Navigation away does not execute | ✓ `leave()` → `cancelAction()` |
| Cancel performs no action | ✓ |
| Double-click / Enter / double-tap | ✓ `executing` flag + duplicate guard (corrected race) |
| Failed action safe message | ✓ no raw SMTP/backend errors exposed |
| Pending cleared safely | ✓ on success, cancel, leave |
| No real email in tests | ✓ mocked `apiPost` only |
| Missing saved email | ✓ no prepare, no fake recipient, Settings direction |

---

## 7. HMRC parity matrix

Automated: `npm run test:ask-parity` — **8/8 PASS**

| Case | Eligible mi | 1st tier | 2nd tier | Claim (£) | Tax year | Vehicle | Journeys | Ask = Engine |
|------|-------------|----------|----------|-----------|----------|---------|----------|--------------|
| A <10k car | 5000 | 5000 | 0 | 2750 | 2026-27 | car | 1 | ✓ |
| B =10k car | 10000 | 10000 | 0 | 5500 | 2026-27 | car | 1 | ✓ |
| C >10k car | 12000 | 10000 | 2000 | 6000 | 2026-27 | car | 1 | ✓ |
| D threshold cross | 10050 | 10000 | 50 | 5512.50 | 2026-27 | car | 2 | ✓ |
| E motorcycle | 200 | 200 | 0 | 48 | 2026-27 | motorcycle | 1 | ✓ |
| F bicycle | 100 | 100 | 0 | 20 | 2026-27 | bicycle | 1 | ✓ |
| G 5/6 Apr boundary | 100 | 100 | 0 | 55 | 2026-27 | car | 1 | ✓ |
| H unknown vehicle | — | — | — | 0 (safe) | — | invalid | — | ✓ zero, no multiply |

Ask does not perform independent mileage multiplication; all totals route through `MPTaxEngine`.

Dashboard / monthly report / PDF / email parity with engine is inherited from MP-044B lock (PR #162); Ask reads the same `claimFn` and report builders.

---

## 8. Visual-lock evidence

Production uses `ask-milepilot-view.js` — the MP-S4 locked template module. `ask-milepilot-shell.js` remains for static preview (`?s=`) only and is **not** loaded in production `index.html`.

**Code verification (unchanged from MP-S4 lock):**
- Typography, spacing, composer, suggestion chips, cards, result panels, confirmation surface, mobile/desktop layouts, colours, button dimensions, empty/loading states — all defined in `ask-milepilot-view.js` CSS class structure.

**Automated pixel screenshots:** Not captured in this cloud audit run. Recommend pre-merge visual spot-check on device for: empty, simple result, detailed journeys, text, confirmation, success, error, 375px and 1280px viewports.

---

## 9. Accessibility and input behaviour

| Check | Result |
|-------|--------|
| Composer receives focus | ✓ `aria-label="Ask MilePilot"` on inputs |
| Enter submits once | ✓ `preventDefault` + `busy` guard |
| Shift+Enter (textarea hero) | ✓ only Enter without Shift submits |
| Empty / whitespace rejected | ✓ `.trim()` guard in `submitQuestion` |
| Suggestion chips keyboard accessible | ✓ `<button type="button">` |
| Confirmation controls | ✓ buttons with `data-ask-confirm` |
| Disabled when processing | ✓ `showProcessing` disables confirm buttons |
| Screen-reader labels | ✓ `aria-label` on composer, send, follow-ups |
| No inaccessible span-buttons | ✓ |

---

## 10. Lifecycle and memory results

| Check | Result |
|-------|--------|
| Open Ask twice | ✓ `innerHTML` replace; no listener accumulation on stale nodes |
| Leave Ask | ✓ clears pending; does not erase trip data |
| Return to Ask | ✓ fresh conversation state (by design) |
| Refresh | ✓ no action replay |
| Logout/reset | ✓ transient Ask state in memory only |
| Pending not persisted | ✓ |
| 50-cycle nav stress | **Not automated** — architecture supports idempotent mount/leave; recommend manual soak test |

---

## 11. Protected-system diff

```
git diff main -- mp-tax-engine.js autopilot-motion.js trip-store.js
→ (no changes)
```

PR #163 does **not** modify: GPS, AutoPilot, motion detection, trip start/end, background tracking, native bridge, permissions, onboarding, report maths, MPTaxEngine internals, Business Hub, service worker, or `APP_VERSION`.

`lastGpsAccuracy` is correctly declared (`let lastGpsAccuracy=null` at line 1527) — prior syntax issue resolved.

---

## 12. Automated test results

| Suite | Result |
|-------|--------|
| `npm run test:ask-milepilot` | **43 / 43 passed** |
| `npm run test:ask-parity` | **8 / 8 passed** |
| `npm run test:tax-engine` | **25 / 25 passed** |
| `npm run test:vital` | **ALL PASSED** |

Test coverage includes: routing intents, real DI, claim/journey/pending/comparison queries, AutoPilot, unsupported/fuel/VAT/accountant-pack, missing email, confirmation/cancellation, double-execution prevention, action failure, navigation leave, MPTaxEngine parity, threshold, tax-year boundary, unknown vehicle, locked suggestion copy, production script order.

---

## 13. Build and deployment validation

| Check | Result |
|-------|--------|
| `npm run verify:release` | ✓ version 8.43.31 aligned |
| Syntax errors | ✓ none in changed files |
| Ask files in upload mirror | ✓ `milepilot-upload-v2/` synced |
| Service worker cache | ✓ registers with `APP_VERSION` query param |
| Missing scripts | ✓ none |
| Uncaught exceptions (static review) | ✓ boot path reviewed |

---

## 14. Remaining risks

1. **Browser back/forward** does not map to in-app screens (no History API integration).
2. **Business Hub route** not applicable — feature absent from production shell.
3. **Visual pixel diff** not automated; manual spot-check recommended.
4. **50-cycle navigation soak** not run in CI.
5. **Corrections applied during audit** (included in this branch):
   - Deep-link boot bug (`parseDeepLink` no longer overridden by `showReports`)
   - Session restore for Ask refresh
   - Intent collisions (fuel/VAT/pack/email lookup)
   - Email action blocked without saved email
   - `collectRange` engine-only fallback (no stored `hmrc` sum)
   - Double-confirm race on parallel `confirmAction`
   - `show my report` intent routing

---

## 15. Rollback plan

1. Revert PR #163 merge commit on `main`.
2. Remove Ask nav entry and `#ask` screen from `frontend/index.html` (or deploy previous Cloudflare zip).
3. `milepilot-upload-v2/` mirror reverts with same commit.
4. No database migration required — Ask stores no persistent state.
5. MPTaxEngine lock (PR #162) remains independent and unaffected.

---

**Auditor recommendation:** **PASS WITH CORRECTIONS** — safe to merge after human approval. Do not merge automatically.
