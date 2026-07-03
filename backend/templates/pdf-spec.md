# MilePilot PDF Template — 🔒 LOCKED

**Reference:** `templates/MilePilot_APPROVED_Report_Template.pdf`  
**Generator:** `backend/approvedPdfLayout.js` → `buildApprovedDailyPdf()`  
**Version:** `REPORT_VERSION` in `reportEngine.js`

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
