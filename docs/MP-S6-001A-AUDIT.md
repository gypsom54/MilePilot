# MP-S6-001A — Business Workspace Foundation Final Verification Audit

**Specification ID:** MP-S6-001A  
**Branch:** `cursor/business-workspace-sprint1-19bd`  
**PR:** #164  
**Audit date:** 2026-07-22  

---

## 14. FINAL VERDICT

### **PASS WITH CORRECTIONS**

Business Workspace foundation is architecturally sound, visually ready, and regression-clean after audit corrections. **Do not merge automatically.**

**Merge hygiene correction required:** the `handlePos` semicolon fix is a protected GPS/AutoPilot file change and **should be split into an isolated hotfix PR** merged to `main` before or separately from PR #164, even though the change is correct and minimal.

**Corrections applied during this audit (on branch):**
- `Coming Soon` changed from disabled `<button>` to `<p role="status">` (non-actionable)
- `showTool` scroll guard for non-browser environments
- Test suite expanded 9 → **24** cases
- Additional viewport screenshots captured

---

## 1. Protected handlePos change

| Field | Value |
|-------|--------|
| **File** | `frontend/index.html` |
| **Line** | **1845** (`function handlePos(pos){...}`) |

### Before (main — syntax error)

```javascript
}else feedAutopilotGps(pos)lastGpsAccuracy=p.acc;
```

### After (PR #164)

```javascript
}else feedAutopilotGps(pos);lastGpsAccuracy=p.acc;
```

### Git diff (only change in `handlePos`)

```diff
-}else feedAutopilotGps(pos)lastGpsAccuracy=p.acc;lastGpsAt=p.t;...
+}else feedAutopilotGps(pos);lastGpsAccuracy=p.acc;lastGpsAt=p.t;...
```

### Evidence on main before fix

```
acorn.parse(main index.html inline script)
→ SYNTAX FAIL: Unexpected token (357:1307)
```

### Evidence on PR after fix

```
acorn.parse(PR index.html inline script)
→ syntax OK
```

### Why it failed

In the `else` branch of `if (ccState === 'active')`, the parser saw:

`feedAutopilotGps(pos)lastGpsAccuracy`

Without a semicolon, JavaScript applies **ASI (automatic semicolon insertion) cannot insert** between `)` and `lastGpsAccuracy` because `lastGpsAccuracy` is a valid continuation (would imply calling the return value of `feedAutopilotGps` as a function). Result: **parse error** — entire inline `<script>` block fails to execute.

### Why the semicolon fixes it

`;` terminates the `feedAutopilotGps(pos)` statement. `lastGpsAccuracy=p.acc` becomes a separate statement in the same block.

### ASI could not handle it

No — ASI does not insert a semicolon before `lastGpsAccuracy` when preceded by `)`.

### Production impact

| Surface | Impact |
|---------|--------|
| **Browser boot** | **Broken on main** — no `showBusiness`, `showAsk`, `bootApp`, GPS handlers load |
| **Node unit tests** | Mostly unaffected (tests load modules directly, not full `index.html` script) |
| **Preview HTML** | Broken if using broken `index.html` inline script |
| **Native shell** | WebView loads `index.html` — **broken on main** |

This was **not strictly required for Business Workspace feature code** but was **discovered when validating browser screenshots** for Sprint 1.

### Tracking / AutoPilot tests (re-run)

| Suite | Result |
|-------|--------|
| `npm run test:tracking` | **PASS** |
| `npm run test:autopilot` | **PASS** |
| `npm run test:vital` | **ALL PASS** |

No behavioural change to `handlePos` logic — only parse validity.

### Recommendation

**Split into isolated hotfix PR** (`fix/handlepos-semicolon`) merged to `main` first; rebase PR #164 to exclude `handlePos` hunk OR merge hotfix before workspace PR.

---

## 2. Complete protected-system diff (PR #164 vs main)

| File | Protected? | Change |
|------|------------|--------|
| `frontend/index.html` | **YES** (GPS `handlePos`, routing) | Workspace wiring + **one semicolon in `handlePos`** + nav grid 6-col |
| `frontend/js/ask-milepilot-*.js` | YES | **No change** |
| `frontend/js/mp-tax-engine.js` | YES | **No change** |
| `frontend/js/autopilot-motion.js` | YES | **No change** |
| `frontend/js/trip-store.js` | YES | **No change** |
| `frontend/js/summary-reports.js` | YES | **No change** |
| `backend/*` | YES | **No change** |
| Service worker | YES | **No change** |
| `APP_VERSION` | YES | **No change** |

**New files only (safe):** `business-workspace*`, CSS, tests, docs, screenshots.

**Merge blocker unless addressed:** `handlePos` hunk in protected tracking code.

---

## 3. Business Workspace routing map

```
Nav "Business"
  → showBusiness()
  → requireActiveAccess
  → setNav('Business')
  → showScreen('business')  [sessionStorage mp_active_screen='business']
  → MPBusinessWorkspace.mount()
  → paintHome() → bindEvents()

?view=business
  → parseDeepLink() → showBusiness()

Refresh on Business
  → bootApp() → mp_active_screen==='business' → showBusiness()
  (tool sub-state NOT persisted — returns to home; acceptable Sprint 1)

Tool card click
  → showTool(id) → hide home root, show tool root, paintTool()

Back button
  → showHome() → showBusiness() → mount() → home

Business → Ask (embed submit/chip)
  → openAskWithQuestion() → showAsk() → MPAskMilePilotApp.submitQuestion()

Business → Ask (nav tab)
  → showAsk() [standalone screen]

Ask → Business (nav)
  → showBusiness() [fresh mount, prior Ask leave() on screen change]

Business → Mileage/Reports
  → showScreen → MPBusinessWorkspace.leave() clears tool state

Invalid tool ID
  → showTool() no-ops (getTool returns null)
```

**Confirmed:** `innerHTML` replace on mount — no duplicate listeners on same nodes. `leave()` resets tool visibility. No route loops observed.

**Limitation:** Refresh while on tool empty-state returns to workspace home (tool ID not in sessionStorage).

---

## 4. Ask MilePilot embed verification

| Check | Result |
|-------|--------|
| Second Ask service | **None** — uses `MPAskMilePilotService` via `showAsk()` |
| Duplicate intent registry | **None** |
| Duplicate financial calc | **None** — no `MPTaxEngine` in workspace modules |
| Duplicate listeners on Ask | **None** — workspace delegates to production app |
| Chip submission | `openAskWithQuestion` → `showAsk()` + `submitQuestion()` |
| Manual submission | Same path |
| Leaving workspace | `MPBusinessWorkspace.leave()` on `showScreen` away from `#business` |
| Ask `leave()` on nav away | `showScreen` calls `MPAskMilePilotApp.leave()` when leaving `#ask` |
| External action safeguards | Unchanged — production `ActionExecutor` only |

**Four workspace chips tested (routing):**
1. How much can I claim this month? ✓
2. Show this week's journeys. ✓
3. Prepare my mileage report. ✓
4. Show trips needing review. ✓

---

## 5. Component inventory

| Component | Source | Interface | Used by | Business logic? | a11y |
|-----------|--------|-----------|---------|-----------------|------|
| WorkspaceHeader | `business-workspace-view.js` | `WorkspaceHeader(opts)` | Home, tool screens | No | Back `aria-label` |
| WorkspaceCard | view | `WorkspaceCard(tool)` | Tools grid | No | `<button aria-label>` |
| WorkspaceSection | view | `WorkspaceSection(title, body)` | Home sections | No | `<h2>` heading |
| WorkspaceEmptyState | view | `WorkspaceEmptyState(opts)` | Activity, tools | No | `role="status"` for Coming Soon |
| WorkspaceBadge | view | `WorkspaceBadge(text, variant)` | Cards | No | Text label |
| WorkspaceStat | view | `WorkspaceStat(label, value)` | Reserved | No | N/A Sprint 1 |
| WorkspaceDivider | view | `WorkspaceDivider()` | Home | No | `<hr>` |
| WorkspaceSkeleton | view | `WorkspaceSkeleton(h)` | Reserved | No | `aria-hidden` |

Shared desktop/mobile — single responsive CSS, no duplicate markup.

---

## 6. Data models (exact definitions)

See `frontend/js/business-workspace-models.js` and `docs/MP-S6-DATA-MODEL.md`.

- **Expense:** `id`, `supplierId`, `amountPence` (integer), `currency: 'GBP'`, `category`, `description`, `incurredISO`, `receiptId?`, `status`, `schemaVersion`
- **Receipt:** `id`, `expenseId`, `capturedISO`, `imageRef?` (opaque ref, not local path), `ocrStatus`, `schemaVersion`
- **Supplier:** `id`, `name`, `vatNumber?`, `email?`, `schemaVersion`
- **VATRecord:** `id`, `periodStartISO`, `periodEndISO`, `outputVatPence`, `inputVatPence`, `status`, `schemaVersion` — no rate logic
- **BusinessHealth:** `id`, `asOfISO`, `score`, `highlights[]`, `schemaVersion`
- **AccountantPack:** `id`, `periodLabel`, `generatedISO`, `includedSections[]`, `status`, `schemaVersion`

**No persistence, API calls, calculations, or fake records in Sprint 1.**

---

## 7. Production copy (final)

### Business Workspace header
- Eyebrow: **Business Workspace**
- Title: **Business Workspace**
- Subtitle: *Your business companion — mileage, tools, and insights in one place.*

### Ask MilePilot embed
- Label: **Ask MilePilot**
- Title: **What would you like help with today?**
- Placeholder: **What would you like help with today?**

### Tool cards
| Tool | Description | Badge |
|------|-------------|-------|
| Expenses | Track and organise every business purchase. | Coming Soon |
| VAT | Understand your VAT position at a glance. | Coming Soon |
| AI Bookkeeper | Intelligent help for everyday bookkeeping. | Coming Soon |
| Business Health | See how your business is performing overall. | Coming Soon |
| Accountant Pack | Export everything your accountant needs. | Coming Soon |

### Empty-state bodies
(Full text in `business-workspace.js` TOOLS array — no lorem, no fake dates/metrics, no "under construction")

### Recent Activity
- Title: **No recent activity yet**
- Body: *When you start using business tools, your latest actions will appear here.*

### Coming Next
- Receipt scanning and expense tracking
- VAT position and return preparation
- Business Health insights
- Accountant-ready export packs

### Coming Soon control (post-audit)
Changed to **`<p role="status">Coming Soon</p>`** — not an enabled button.

---

## 8. Screenshot evidence

| File | Viewport |
|------|----------|
| `docs/screenshots/mp-s6-001/01-business-home-mobile.png` | 390×844 |
| `docs/screenshots/mp-s6-001/02-expenses-empty-mobile.png` | 390×844 |
| `docs/screenshots/mp-s6-001/03-ask-still-works-mobile.png` | 390×844 |
| `docs/screenshots/mp-s6-001/04-business-home-desktop.png` | 1280×900 |
| `docs/screenshots/mp-s6-001/05-business-home-375x812.png` | 375×812 |
| `docs/screenshots/mp-s6-001/06-business-home-768x1024.png` | 768×1024 |
| `docs/screenshots/mp-s6-001/07-business-home-1440x900.png` | 1440×900 |

**Visual review:** Ask prominence good; blue glow restrained; cards align 2-col grid; badges consistent; empty-state hierarchy clear; bottom nav fits 6 items (9px labels). **UI lock not approved in this audit** — human visual sign-off still required before permanent workspace lock.

---

## 9. Accessibility

| Check | Result |
|-------|--------|
| Tool cards keyboard accessible | ✓ `<button type="button">` |
| Back control label | ✓ `aria-label="Back to Business Workspace"` |
| Icons decorative | ✓ `aria-hidden` on card icons |
| Status badges | ✓ text "Coming Soon" visible |
| Coming Soon not actionable | ✓ `role="status"` (post-audit) |
| Ask input labelled | ✓ `aria-label="Ask MilePilot"` |
| Heading hierarchy | ✓ h1 header, h2 sections, h3 card titles |
| No clickable divs | ✓ |

Focus management after tool open/back: not programmatically moved (minor gap — document for MP-S5-006 / a11y sprint).

---

## 10. Lifecycle results

| Test | Result |
|------|--------|
| No business data | ✓ empty activity state |
| Invalid tool ID | ✓ no-op |
| 50× mount/leave cycles | ✓ test pass |
| Ask handoff | ✓ production path |
| Refresh on tool screen | Returns to home (documented) |
| Missing workspace scripts | Would fail at mount — same as any screen |

---

## 11. Deploy mirror parity

| File | frontend MD5 | mirror MD5 | Match |
|------|--------------|------------|-------|
| `business-workspace.css` | `5862a0ca...` | `5862a0ca...` | ✓ |
| `business-workspace.js` | synced | synced | ✓ |
| `business-workspace-view.js` | synced | synced | ✓ |
| `business-workspace-models.js` | `67a56a87...` | `67a56a87...` | ✓ |
| `index.html` | `449fc588...` | `449fc588...` | ✓ |

---

## 12. Test results

| Suite | Count |
|-------|-------|
| `npm run test:business-workspace` | **24 / 24** |
| `npm run test:ask-milepilot` | **43 / 43** |
| `npm run test:tax-engine` | **25 / 25** |
| `npm run test:tracking` | **PASS** |
| `npm run test:autopilot` | **PASS** |
| `npm run test:vital` | **ALL PASS** |
| `npm run verify:release` | **OK** (8.43.31) |

---

## 13. Remaining risks

1. **`handlePos` in workspace PR** — protected-file merge hygiene
2. **Tool sub-state lost on refresh**
3. **6-tab nav density** on smallest devices
4. **No programmatic focus** on tool open/back
5. **Human visual lock** not yet signed off
6. **Main branch still has syntax error** until hotfix merged

---

## 15. Rollback plan

1. Revert PR #164 merge
2. Remove Business nav + `#business` screen
3. Delete `business-workspace*` assets from upload mirror
4. No data migration — no persistence introduced
5. If hotfix merged separately, keep `handlePos` semicolon

---

**Auditor recommendation:** **PASS WITH CORRECTIONS** — merge after `handlePos` hotfix is isolated and human visual approval obtained. **Do not begin Sprint 2.**
