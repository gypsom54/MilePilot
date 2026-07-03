# Report Templates — 🔒 LOCKED

**Status:** Frozen as of MP-021 (July 2026)  
**Rule:** The app injects data only. No redesigns without explicit product sign-off.

---

## Three surfaces, three jobs

| Surface | Theme | Template | Purpose |
|---------|-------|----------|---------|
| 📱 **App** | Dark navy | `frontend/index.html` (UI locked) | Phone use |
| 📄 **PDF** | White professional | `templates/pdf-spec.md` + `buildPdfBuffer()` | HMRC, accountants, printing |
| 📧 **Email** | Light branded summary | `templates/email.html` | 30-second preview + PDF attached |

**The app and reports do not share the same background colour. That is intentional.**

---

## Locked files

| File | Role |
|------|------|
| `templates/email.html` | Master HTML email — **do not edit layout/colours** |
| `templates/pdf-spec.md` | PDF design specification |
| `backend/emailTemplate.js` | Data injection only (`{{PLACEHOLDERS}}`) |
| `backend/reportEngine.js` | `buildPdfBuffer()` — white PDF generator |

---

## Email placeholders

Only these values change per report:

- `{{GREETING}}`, `{{PERIOD_TITLE}}`, `{{MILES}}`, `{{DRIVING_TIME}}`
- `{{JOURNEYS}}`, `{{HMRC_ESTIMATE}}`, `{{SUMMARY_LINES}}`
- `{{PDF_DOWNLOAD_URL}}`, `{{ARCHIVE_URL}}`
- `{{PENDING_NOTICE}}`, `{{AUTOMATION_NOTES}}`

---

## Agent rules

1. **Never** switch email to dark theme
2. **Never** switch PDF to dark theme  
3. **Never** inline-generate email HTML in `reportEngine.js` — use `templates/email.html`
4. Changes to design require updating the template file + this doc + golden tests
5. Run `node tests/email-template-golden.test.js` before deploy

---

## Preview

Open `docs/report-email-preview.html` in a browser to see the approved light email with sample data.
