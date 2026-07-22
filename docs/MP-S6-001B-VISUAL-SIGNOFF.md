# MP-S6-001B — Business Workspace Visual Sign-Off Pack

**Date:** 2026-07-22  
**Branch:** `cursor/business-workspace-sprint1-19bd`  
**PR:** #164  
**Prerequisite:** MP-HF-001 merged to `main` (PR #165)

---

## Sign-off scope

Post-hotfix merge-readiness review for Business Workspace Sprint 1 foundation:

- Focus management on tool open / home return
- Mobile navigation density (6-tab dock on narrow viewports)
- Visual regression evidence across breakpoints
- Protected-system diff hygiene (no separate `handlePos` hunk)

**Sprint 2 not started.**

---

## Visual evidence

| # | File | Viewport | Subject |
|---|------|----------|---------|
| 1 | `docs/screenshots/mp-s6-001/01-business-home-mobile.png` | 390×844 | Business home — Ask embed + tools |
| 2 | `docs/screenshots/mp-s6-001/02-expenses-empty-mobile.png` | 390×844 | Expenses empty state |
| 3 | `docs/screenshots/mp-s6-001/03-ask-still-works-mobile.png` | 390×844 | Standalone Ask regression |
| 4 | `docs/screenshots/mp-s6-001/04-business-home-desktop.png` | 1280×900 | Desktop home |
| 5 | `docs/screenshots/mp-s6-001/05-business-home-375x812.png` | 375×812 | iPhone-class home |
| 6 | `docs/screenshots/mp-s6-001/06-business-home-768x1024.png` | 768×1024 | Tablet home |
| 7 | `docs/screenshots/mp-s6-001/07-business-home-1440x900.png` | 1440×900 | Wide desktop |
| 8 | `docs/screenshots/mp-s6-001/08-nav-density-320x568.png` | **320×568** | 6-tab nav — icon-only density mode |
| 9 | `docs/screenshots/mp-s6-001/09-expenses-focus-back-390x844.png` | 390×844 | Tool screen — back control focus target |

Capture command: `node scripts/capture-business-workspace-screenshots.js`

---

## Visual checklist

| Item | Status | Notes |
|------|--------|-------|
| Ask embed prominence | ✓ | Hero input + chips above tools grid |
| Blue glow restraint | ✓ | Matches MP design system |
| Tool card grid alignment | ✓ | 2-column responsive grid |
| Coming Soon badges | ✓ | Consistent `role="status"` labels |
| Empty-state hierarchy | ✓ | Title → body → status |
| 6-tab nav at 390px | ✓ | 9px labels, 2px gap |
| 6-tab nav at 320px | ✓ | Icon-only (labels visually hidden, `aria-label` on buttons) |
| Focus on tool open | ✓ | Back control receives focus |
| Focus on home return | ✓ | Ask input receives focus |

---

## Accessibility sign-off

| Check | Result |
|-------|--------|
| Tool cards keyboard accessible | ✓ `<button>` elements |
| Back control labelled | ✓ `aria-label="Back to Business Workspace"` |
| Nav icon-only mode | ✓ `aria-label` on each `nav-item` |
| Programmatic focus on tool open | ✓ `[data-bw-back]` |
| Programmatic focus on home | ✓ `.mp-bw-ask-input` |
| Coming Soon non-actionable | ✓ `role="status"` |

---

## Human approval

- [ ] Product owner visual approval
- [ ] Engineering merge approval for PR #164

**Agent recommendation:** PASS — merge-ready pending human sign-off above.
