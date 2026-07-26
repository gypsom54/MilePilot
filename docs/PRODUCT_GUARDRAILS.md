# RankAura Product Guardrails

**Status:** FINAL AUTHORITY for future development  
**Owner:** Jonathan  
**Related locks:** `docs/UI_BIBLE.md` · `docs/SCREEN_LOCK_STATUS.md` · `docs/ui-reference/` · `rankaura/docs/PRODUCT_VISION.md`

This document governs every future RankAura change.  
If a proposal conflicts with these guardrails, the proposal loses.

---

## Product rules

1. **RankAura is an AI Growth Manager, not an SEO dashboard.**

2. **Simplicity always wins over feature quantity.**

3. **Every screen must answer:**  
   “Does this help a business owner grow their business?”

4. **If a feature requires SEO knowledge to understand, redesign the wording instead of teaching SEO.**

5. **Premium, calm and trustworthy always take priority over flashy.**

6. **Existing approved screenshots remain the visual source of truth until replaced by newer approved screenshots.**

7. **New functionality should fit naturally into the existing interface rather than creating new sections unnecessarily.**

8. **Cursor should always prefer extending existing components over creating duplicate components.**

9. **Every new feature must feel like it has always belonged in RankAura.**

10. **Before implementing any UI change, verify it does not conflict with:**
    - `docs/UI_BIBLE.md`
    - `docs/SCREEN_LOCK_STATUS.md`
    - `rankaura/docs/PRODUCT_VISION.md` (and `docs/` copies where present)
    - `docs/PRODUCT_GUARDRAILS.md`

---

## Visual lockdown

No approved screen may be visually redesigned or materially altered without explicit written approval from the product owner (Jonathan).

Screenshots in `docs/ui-reference/` win over documentation when they disagree.  
Update docs to match screenshots — never redesign the UI to match outdated docs.

The standalone HTML prototype under `rankaura/` is not a visual reference.

---

## Permanent development workflow

Work **one objective at a time**. Never implement multiple major features in one iteration.

```text
Audit
  ↓
Single feature proposal
  ↓
Implement one feature
  ↓
Run checks
  ↓
Screenshot
  ↓
Approval
  ↓
Lock
  ↓
Move to the next feature
```

### For every change
1. State the single objective.
2. List the exact files you will touch.
3. Make the smallest safe change.
4. Run the relevant checks.
5. Report what changed.
6. Stop for approval before beginning another screen or feature.

### Forbidden by default
- Broad refactors
- Speculative improvements
- Features outside the current roadmap sprint
- Modifying multiple approved screens at once
- Creating parallel/duplicate UI systems

---

## Quick pre-flight checklist

Before coding:

- [ ] Does this help a business owner grow without making them work harder?
- [ ] Can a non-SEO owner understand it immediately?
- [ ] Does it extend an existing component/screen instead of inventing a new area?
- [ ] Does it conflict with UI Bible / Screen Lock / Vision / these Guardrails?
- [ ] Is this a single feature, ready for screenshot + approval + lock?
