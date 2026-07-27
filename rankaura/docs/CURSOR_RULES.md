# Cursor Rules for RankAura

Read before making any change:
- `docs/UI_BIBLE.md`
- `docs/SCREEN_LOCK_STATUS.md`
- `docs/ui-reference/README.md`
- RANKAURA_CONSTITUTION.md
- PRODUCT_VISION.md
- UX_PHILOSOPHY.md
- DESIGN_SYSTEM.md
- ROADMAP.md
- SPRINT_01.md

## UI Lock Rule (mandatory)
**No approved screen may be visually redesigned or materially altered without explicit written approval from the product owner (Jonathan).**

Approved screenshots are the visual source of truth.  
If documentation and screenshots disagree, screenshots win — update documentation.

The `rankaura/` HTML prototype is not a visual reference.

## Existing Work Is Protected
This repository already contains approved UI, screens, components and layouts.

Do not start from scratch.

Do not replace existing screens unless explicitly instructed.

Do not assume a screen is retired because it is absent from the current screenshot set.

## Before Coding
1. Inspect the current routes and components.
2. Identify existing onboarding screens.
3. Reuse existing components.
4. Preserve approved screens.
5. Make only changes required by the current sprint.
6. Preserve unrelated behaviour and branding.

## Boundaries
- One sprint at a time.
- No unrequested features.
- No dashboard redesign during Sprint 1.
- No broad backend rewrites.
- No new dependencies unless necessary.
- No placeholder logos.
- No feature creep.

## Completion
At the end:
1. Summarise files changed.
2. Explain what was preserved.
3. Explain what was not changed.
4. Confirm build/lint/tests.
5. List risks or assumptions.
6. Stop and wait for approval.
