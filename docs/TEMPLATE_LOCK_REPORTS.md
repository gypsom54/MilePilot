# MilePilot Report Templates — LOCKED v1.0

**Superseded detail:** See [REPORTING_SYSTEM_LOCK.md](./REPORTING_SYSTEM_LOCK.md) for the authoritative lockdown contract.

---

## Three surfaces

| Surface | Theme | Template |
|---------|-------|----------|
| App | Dark navy | UI locked (`docs/UI_LOCK_REPORTS.md`) |
| PDF | Dark premium | `backend/reporting/pdf/premiumPdf.js` — 7-page A4 |
| Email | Dark premium | `backend/reporting/email/templates/email.html` |

---

## PDF locked structure (7 pages)

1. Executive Dashboard
2. Journey Timeline
3. Journey Breakdown
4. Journey Map
5. HMRC Summary
6. AI Business Insights
7. Verification Certificate

Footer on all PDF pages: **Drive • Track • Claim**

---

## Email locked structure

- MilePilot header (navy band + blue glow divider)
- Greeting hero (`Good morning/afternoon/evening,` + driver name)
- Title case period title
- KPI grid (108px equal-height cards)
- AI insight sentence
- Summary card
- **Download Full PDF Report** CTA
- Open MilePilot link
- **Drive • Track • Claim** footer

---

## Rules

- Do NOT redesign email or PDF
- Do NOT restructure layout
- Only inject live data
- Run before deploy: `npm run test:reporting-lock`

---

## Tests

```bash
npm run test:reporting-lock
node scripts/capture-reporting-baselines.js --update  # after approved design change only
```
