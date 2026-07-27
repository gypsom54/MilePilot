# RankAura UI Reference

**Status:** Approved visual source of truth (+ Growth Plan Phase 3 captures awaiting approval)  
**Authority:** Uploaded product screenshots (localhost RankAura React/Next app)  
**Owner:** Jonathan

## Rule

If documentation and screenshots disagree, **the screenshots win**.

Do not redesign the UI to match older documentation.  
Update documentation to match the approved screenshots instead.

The standalone HTML prototype under `rankaura/` is **not** production and must never be used as a visual reference.

## Screenshot inventory (approved set)

| Order | File | Screen |
|------:|------|--------|
| 1 | `01-welcome.png` | Welcome |
| 2 | `02-website.png` | Website |
| 3 | `03-business-name.png` | Business name |
| 4 | `04-business-description.png` | Business description |
| 5 | `05-analysis-setup.png` | Analysis / setup (green ticks) |
| 6 | `06-dashboard.png` | Legacy dashboard (IA superseded — visual DNA only) |

## Onboarding personalisation captures (final polish)

Located in `docs/ui-reference/onboarding/`:

| File | Contents |
|------|----------|
| `01-welcome-desktop.png` | Welcome — empty start |
| `02-name-empty-desktop.png` | What should we call you? — empty field |
| `03-nice-to-meet-you-desktop.png` | One-time name greeting |
| `04-website-empty-desktop.png` | Website — neutral placeholder |
| `05-business-name-empty-desktop.png` | Business name — empty |
| `06-business-description-empty-desktop.png` | Description — empty |
| `../growth-plan/17-growth-plan-personalised-desktop.png` | `{Name}, your Growth Plan is ready.` + business name |

Located in `docs/ui-reference/growth-plan/`:

| File | Contents |
|------|----------|
| `07-growth-plan-existing-desktop.png` | Existing-site Growth Plan — desktop |
| `08-launch-plan-new-desktop.png` | Brand-new-site Launch Plan — desktop |
| `09-growth-plan-existing-mobile.png` | Existing-site — mobile |
| `10-launch-plan-new-mobile.png` | Brand-new-site — mobile |
| `11-categories-collapsed.png` | Collapsed category system |
| `12-category-expanded-reddit.png` | Reddit & Community Research expanded |
| `13-category-expanded-your-action.png` | Website Health expanded with Your Action |

## Related documents

- `docs/UI_BIBLE.md` — screen-by-screen visual/spec lock
- `docs/SCREEN_LOCK_STATUS.md` — lock status register
- `docs/GROWTH_PLAN_SPEC.md` — Growth Plan / Launch Plan specification
- `rankaura/docs/` — product constitution, vision, sprint, roadmap

## Development rule

> No approved screen may be visually redesigned or materially altered without explicit written approval from the product owner (Jonathan).
