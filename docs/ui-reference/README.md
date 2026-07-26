# RankAura UI Reference

**Status:** Approved visual source of truth  
**Authority:** Uploaded product screenshots (localhost RankAura React/Next app)  
**Owner:** Jonathan

## Rule

If documentation and screenshots disagree, **the screenshots win**.

Do not redesign the UI to match older documentation.  
Update documentation to match the approved screenshots instead.

The standalone HTML prototype under `rankaura/` is **not** production and must never be used as a visual reference.

## Screenshot inventory (approved set)

Place binary screenshots in this folder using these exact filenames:

| Order | File | Screen |
|------:|------|--------|
| 1 | `01-welcome.png` | Welcome |
| 2 | `02-website.png` | Website |
| 3 | `03-business-name.png` | Business name |
| 4 | `04-business-description.png` | Business description |
| 5 | `05-analysis-setup.png` | Analysis / setup (green ticks) |
| 6 | `06-dashboard.png` | Dashboard (Evening Brief) |

Until binaries are dropped here, the lock specs in `docs/UI_BIBLE.md` (derived from the approved screenshot set reviewed in chat) remain authoritative.

## Related documents

- `docs/UI_BIBLE.md` — screen-by-screen visual/spec lock
- `docs/SCREEN_LOCK_STATUS.md` — lock status register
- `rankaura/docs/` — product constitution, vision, sprint, roadmap

## Development rule

> No approved screen may be visually redesigned or materially altered without explicit written approval from the product owner (Jonathan).
