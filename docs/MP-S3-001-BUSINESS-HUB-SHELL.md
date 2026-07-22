# MP-S3-001 — Business Hub Shell

**Specification ID:** MP-S3-001  
**Status:** Shell complete — awaiting approval (not merged)  
**Branch:** `cursor/sprint3-business-hub-19bd`

---

## Scope

Architecture-only shell. Visual placeholders only.

**Created:**
- `frontend/business-hub-preview.html` — standalone preview page
- `frontend/js/business-hub-shell.js` — static shell markup
- `frontend/css/mp-design-system.css` — shell layout classes (scoped under `.mp-ds-root .mp-bh-*`)

**NOT created / NOT touched:**
- Production `index.html`, routing, onboarding, dashboard
- OCR, AI, Ask MilePilot logic, APIs, storage, navigation
- Protected engine systems

---

## Shell layout

1. **Top greeting** — "Good morning, Jonathan." / "Everything is ready."
2. **Meta row** — Date + weather placeholder
3. **Today summary** — Business Miles, Claimable, Tasks Waiting (placeholder values)
4. **Feature grid** — Expenses, AI Receipt Scanner, Ask MilePilot, VAT, Business Health, Accountant Pack
5. **Recent activity** — Placeholder timeline
6. **Bottom encouragement** — "Everything is up to date. Enjoy your day."

---

## Design

Uses Sprint 2 design tokens and component classes only. No new colours or typography.

---

## Preview

```bash
npx serve frontend -p 8000
# http://localhost:8000/business-hub-preview.html
```

---

## Rollback

```bash
git checkout cursor/sprint2-premium-visual-19bd
```
