# MilePilot Reporting System — LOCKED v1.0

**Status:** LOCKED  
**Version:** 1.0  
**Approval:** Explicit product approval required for any visual or layout change.

---

## Primary objective

Protect reliability, consistency, branding, and layout. Every report generated six months from now should look identical unless deliberately approved.

---

## Design contract (frozen)

The following elements are **frozen**:

| Element | Locked |
|---------|--------|
| Navy background | ✓ |
| MilePilot logo | ✓ |
| Blue glow divider | ✓ |
| Typography hierarchy | ✓ |
| Greeting section | ✓ |
| KPI cards (108px height) | ✓ |
| Summary cards | ✓ |
| Journey tables | ✓ |
| Journey map | ✓ |
| HMRC summary | ✓ |
| AI insights | ✓ |
| Verification certificate | ✓ |
| Footer | ✓ |
| Colours | ✓ |
| Border radius | ✓ |
| Card spacing | ✓ |
| PDF margins (48pt) | ✓ |
| Email styling | ✓ |

**No visual changes without explicit approval.**

---

## Module architecture

Reporting is isolated under `backend/reporting/` — do not mix with dashboard logic.

```
backend/reporting/
├── index.js                 # Public module boundary
├── VERSION.js               # v1.0 LOCKED
├── styles/
│   └── reportTheme.js       # Central design tokens (colours, spacing, layout)
├── email/
│   ├── template.js          # EmailTemplate engine
│   └── templates/email.html # Locked dark email master
├── pdf/
│   ├── premiumPdf.js        # 7-page A4 orchestrator
│   ├── format.js
│   ├── insightsEngine.js
│   └── components/          # Locked PDF components
├── utils/
│   └── download.js          # PDF download tokens
└── verification/
    ├── componentRegistry.js # Locked component map
    ├── layoutFingerprint.js # Regression fingerprints
    └── snapshotFixtures.js  # Daily/Weekly/Monthly/Annual fixtures
```

Legacy shims remain at contract paths (`backend/reportEngine.js`, `backend/emailTemplate.js`, etc.) for backward compatibility.

---

## Component lock

| Component | File |
|-----------|------|
| ReportHeader | `pdf/components/layout.js` |
| GreetingCard | `email/templates/email.html` |
| KPICard | `pdf/components/kpi.js` |
| SummaryCard | `email/template.js` |
| JourneyTable | `pdf/components/table.js` |
| JourneyTimeline | `pdf/components/timeline.js` |
| JourneyMap | `pdf/components/map.js` |
| HMRCSummary | `pdf/components/hmrc.js` |
| AIInsights | `pdf/components/insights.js` |
| VerificationCertificate | `pdf/components/certificate.js` |
| ReportFooter | `pdf/components/layout.js` |
| EmailTemplate | `email/templates/email.html` |

Once stable, these components should rarely change.

---

## Style lock

**Single source of truth:** `backend/reporting/styles/reportTheme.js`

Owns: colours, typography, spacing, border radius, glow, shadows, card padding, PDF margins, email dimensions.

PDF components must use `resolveTheme()` tokens. Email styling is locked in `email/templates/email.html` (values documented in `EMAIL_LAYOUT`).

---

## PDF template lock

Frozen: margins (48pt), page breaks, fonts (Helvetica), header, footer, spacing, A4 layout, 7 pages, page numbering.

**Only data changes. Layout must remain identical.**

---

## Email template lock

Frozen: logo, greeting, KPI grid (108px cards), summary, CTA button, footer, spacing, dark theme, blue CTA.

**Only report data changes.**

---

## No regressions — pre-commit checklist

Before every commit touching reporting:

- [ ] PDF generation works
- [ ] Email generation works
- [ ] Download still works
- [ ] Page count = 7
- [ ] No missing components
- [ ] Snapshot tests pass

```bash
npm run test:reporting-lock
```

---

## Automated tests

| Test | Purpose |
|------|---------|
| `tests/reports-regression.test.js` | Pipeline smoke tests |
| `tests/email-template-golden.test.js` | Email placeholder + layout checks |
| `tests/reporting-snapshot.test.js` | Daily/Weekly/Monthly/Annual fingerprints |
| `tests/golden-report.test.js` | **Golden Report** — permanent reference standard |

Approved baselines: `tests/reporting-baselines/`

---

## Golden Report (reference standard)

One perfect report with known values — kept forever:

| Field | Value |
|-------|-------|
| Driver | Jonathan O'Neill |
| Business Miles | 487.4 |
| Trips | 38 |
| Driving Time | 31h 48m |
| HMRC | £219.33 |

**Artifacts:** `tests/reporting-baselines/golden/`

```
golden/
├── manifest.json    ← layout fingerprints + structure metrics
├── email.html       ← approved golden email
└── report.pdf       ← approved golden PDF (7 pages)
```

Every reporting engine change must regenerate the same report and compare. If fonts, spacing, page breaks, colours, or alignment differ unexpectedly → **investigate before releasing**.

```bash
node tests/golden-report.test.js
node scripts/capture-reporting-baselines.js --golden --update  # approved changes only
```

---

## Snapshot baselines

Update period baselines only after deliberate approved design change:

```bash
node scripts/capture-reporting-baselines.js --update
```

If any future change alters layout fingerprints → **FAIL THE BUILD**.

---

## Visual regression

Reference artifacts stored per period:

```
tests/reporting-baselines/
├── fingerprints.json
├── daily/email.html + report.pdf
├── weekly/email.html + report.pdf
├── monthly/email.html + report.pdf
└── annual/email.html + report.pdf
```

CI compares layout fingerprints (page count, email markers, dimensions). Reference PDFs and HTML files are the approved visual baseline for manual review.

---

## Backward compatibility

Future features (receipts, expenses, business health, AI, fuel, vehicle costs, accountant exports) must **extend** the reporting system — never rewrite it.

---

## Version

| Field | Value |
|-------|-------|
| Reporting System | **1.0** |
| Status | **LOCKED** |
| PDF pages | 7 |
| Engine version | `MP-050-phase5-premium-v1` |

Future modifications require explicit approval before implementation.
