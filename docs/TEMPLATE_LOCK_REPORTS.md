# MilePilot Report Templates — 🔒 LOCKED

**Source of truth:**
- `templates/MilePilot_APPROVED_Report_Template.pdf` — approved daily PDF
- `templates/email.html` — approved light email structure
- `Cursor_Report_Email_Lockdown_Prompt` — agent rules

---

## Three surfaces

| Surface | Theme | Template |
|---------|-------|----------|
| 📱 App | Dark navy | UI locked |
| 📄 PDF | **White professional** | `approvedPdfLayout.js` → 5-page daily |
| 📧 Email | **Light summary** | `templates/email.html` |

---

## PDF locked structure (Daily)

1. Daily Business Summary
2. MilePilot Intelligence
3. Business Journey Log + HMRC Summary
4. Weekly Performance
5. MilePilot AI Summary

Footer on all PDF pages: **Drive • Track • Claim**

---

## Email locked structure

- MilePilot header (navy band)
- Daily Business Report greeting
- Summary metrics (4 tiles)
- Download PDF Report button
- Open MilePilot link
- Compliance disclaimer
- **Drive • Track • Claim** footer

---

## Rules

- Do NOT redesign email or PDF
- Do NOT make email dark
- Only inject live data
- Run tests before deploy: `node tests/reports-regression.test.js` && `node tests/email-template-golden.test.js`
