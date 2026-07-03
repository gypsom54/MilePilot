# MilePilot Phase 5 — Premium Reporting System 🔒

**Authority:** Product lock — best-looking mileage reports on the market.  
**Generator:** `backend/reports/premiumPdf.js`  
**Version:** `MP-050-phase5-premium-v1` in `reportEngine.js`

---

## Design intent

Premium fintech product — Apple · Stripe · Monzo · Linear · Notion inspiration.  
Dark navy MilePilot dashboard aesthetic (Accountant Export uses light theme for printing).

---

## Report types

| Period | API value | Theme |
|--------|-----------|-------|
| Daily | `Daily` | Dark |
| Weekly | `Weekly` | Dark |
| Monthly | `Monthly` | Dark |
| Quarterly | `Quarterly` | Dark |
| Annual | `Annual` | Dark |
| Accountant Export | `Accountant` | Light |
| Custom | `Custom` | Dark |

---

## PDF structure (7 pages, A4)

| Page | Section |
|------|---------|
| 1 | Executive Dashboard — KPI cards |
| 2 | Journey Timeline — visual cards |
| 3 | Journey Breakdown — professional table |
| 4 | Journey Map — blue route, markers, stats |
| 5 | HMRC Summary — rates, annual total, disclaimer |
| 6 | AI Business Insights — pattern cards + confidence |
| 7 | Verification Certificate — Report ID, QR placeholder, badge |

Footer: **Drive • Track • Claim** · milepilot.uk · page X of 7

---

## Email

Dark premium HTML — `backend/templates/email.html`  
KPI tiles: Business Miles, HMRC Estimate, Trips, Driving Time  
CTA: **Download Report**

---

## Architecture

```
backend/reports/
  theme.js              — dark/light tokens
  format.js             — shared formatters
  insightsEngine.js     — AI insights (deterministic)
  premiumPdf.js         — orchestrator
  components/
    layout.js           — header, footer, pages
    kpi.js              — KPI cards
    timeline.js         — journey timeline
    table.js            — breakdown table
    map.js              — route map panel
    hmrc.js             — HMRC summary
    insights.js         — insight cards
    certificate.js      — verification page
```

Future-ready for receipts, expenses, Business Health Score, and accountant integrations without redesign.

---

## Tests

```bash
node tests/reports-regression.test.js
node tests/email-template-golden.test.js
```
