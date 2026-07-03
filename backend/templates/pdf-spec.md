# MilePilot PDF — MASTER SPECIFICATION 🔒 UI LOCKED

**Authority:** CTO directive — this document governs all MilePilot PDF reports.  
**Reference PDF:** `templates/MilePilot_APPROVED_Report_Template.pdf`  
**Generator:** `backend/approvedPdfLayout.js` → `buildApprovedDailyPdf()`  
**Version:** `REPORT_VERSION` in `reportEngine.js`

---

## Agent and developer rules (non-negotiable)

- **DO NOT** design your own PDF
- **DO NOT** improvise
- **DO NOT** change layouts
- **DO NOT** change typography
- **DO NOT** add extra sections

The report must be implemented **exactly** as specified.  
The PDF is part of the MilePilot brand and is **UI LOCKED**.

**Permitted without approval:** replacing placeholder values with live data only.  
**Forbidden without approval:** any redesign.

---

## Design intent

White professional document for HMRC, accountants, and printing.  
**Not** the app's dark theme.

---

## Daily report — 5 locked pages

| Page | Section |
|------|---------|
| 1 | Daily Business Summary — hero miles, stats, today's highlights |
| 2 | MilePilot Intelligence — pattern bullets |
| 3 | Business Journey Log + HMRC Summary |
| 4 | Weekly Performance — week totals, trend, insights |
| 5 | MilePilot AI Summary — narrative + guidance bullets |

Each page header: Mile Pilot, driver name, **Drive • Track • Claim**, auto-generated line, milepilot.uk, date · report ID.

Page footer: `— X of 5 —`

---

## Rules

- PDF body stays **white**
- Do not revert to dark navy full-page PDF
- Do not change page order or section names without sign-off
- Weekly/Monthly/Custom reports use legacy generator until separately approved
