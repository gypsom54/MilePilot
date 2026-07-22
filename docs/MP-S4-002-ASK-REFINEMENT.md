# MP-S4-002 — Ask MilePilot Shell Refinement

**Specification ID:** MP-S4-002  
**Depends on:** MP-S4-001  
**Status:** Complete — awaiting approval (not merged)  
**Branch:** `cursor/sprint4-ask-refinement-19bd`

---

## Scope

Visual and UX refinement only. Five separate scenario previews replace the stacked gallery.

**Changed:**
- `frontend/js/ask-milepilot-shell.js` — scenario-based previews
- `frontend/css/mp-design-system.css` — scoped `.mp-ask-*` refinement
- `frontend/ask-milepilot-preview.html` — overflow guard

**NOT changed:**
- Production, onboarding, Business Hub, routing, protected systems

---

## Scenarios

| # | ID | URL |
|---|-----|-----|
| 1 | Empty workspace | `?s=empty&nav=0` |
| 2 | Simple answer | `?s=simple&nav=0` |
| 3 | Detailed business answer | `?s=detailed&nav=0` |
| 4 | Business insight | `?s=insight&nav=0` |
| 5 | Safe action confirmation | `?s=confirm&nav=0` |

Use extensionless URL (required for `serve`):  
`http://localhost:8000/ask-milepilot-preview?s=empty&nav=0`

Add `nav=0` to hide scenario switcher for clean screenshots.

---

## Opening copy

- **Title:** Ask MilePilot
- **Promise:** Your business can finally answer your questions.
- **Placeholder:** Ask anything about your business…

---

## Preview

```bash
npx serve frontend -p 8000
# http://localhost:8000/ask-milepilot-preview?s=empty&nav=0
```

---

## Rollback

```bash
git checkout cursor/sprint4-ask-milepilot-19bd
```
