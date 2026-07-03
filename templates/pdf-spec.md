# MilePilot PDF Template — 🔒 LOCKED

**Status:** Frozen master specification  
**Generator:** `backend/reportEngine.js` → `buildPdfBuffer()`  
**Version token:** `REPORT_VERSION` in `reportEngine.js`

---

## Design intent

| Surface | Theme | Purpose |
|---------|-------|---------|
| 📱 App | Dark navy | Phone UI |
| 📄 PDF | **White professional** | HMRC, accountants, printing |
| 📧 Email | **Light summary** | 30-second preview + PDF attached |

The PDF does **not** share the app's dark background. That is intentional.

---

## Locked layout

1. **Navy brand band** (top) — Mile Pilot wordmark, tagline, period title, date, driver name
2. **White body** — hero miles, metric cards, route map panel, intelligence section
3. **Journey table** (page 2+) — trip timeline for accountants
4. **Footer** — tagline, HMRC disclaimer, report ID

## Locked colours (body)

| Token | Value | Use |
|-------|-------|-----|
| Page background | White (default) | Print-friendly |
| Body text | `#06112A` | Primary copy |
| Muted | `#64748B` | Labels |
| Accent | `#0D6BFF` | Brand rules |
| Cards | `#FFFFFF` + `#DDE6F2` border | Metric tiles |
| Header band | `#031126` | Brand only |

## Rules

- **Do not** change PDF to dark theme
- **Do not** redesign layout without explicit product sign-off
- **Only inject** live data: miles, time, journeys, HMRC, routes, driver, period
- Regression: `node tests/reports-regression.test.js`
