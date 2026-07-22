# MP-S4-001 — Ask MilePilot Foundation

**Specification ID:** MP-S4-001  
**Status:** Shell complete — awaiting approval (not merged)  
**Branch:** `cursor/sprint4-ask-milepilot-19bd`

---

## Scope

Visual shell only. The primary interface through which users interact with their business — no AI, no APIs, no logic.

**Created:**
- `frontend/ask-milepilot-preview.html` — standalone preview page
- `frontend/js/ask-milepilot-shell.js` — static shell markup
- Shell layout CSS in `mp-design-system.css` (scoped `.mp-ds-root .mp-ask-*`)

**NOT created / NOT touched:**
- Production `index.html`, routing, onboarding, Business Hub
- AI, OpenAI, networking, OCR, calculations, database, auth, reports
- Protected engine systems

---

## Shell includes

1. Large Ask MilePilot input
2. Suggested questions
3. Recent conversations
4. Empty state
5. Loading state (typing indicator)
6. Response examples:
   - Long answer
   - Table answer
   - Business insight
   - Action confirmation
   - Follow-up suggestion

All placeholders. Nothing functional.

---

## Design

Sprint 2 design language and tokens only.

---

## Preview

```bash
npx serve frontend -p 8000
# http://localhost:8000/ask-milepilot-preview.html
```

---

## Rollback

```bash
git checkout cursor/sprint3-business-hub-19bd
```
