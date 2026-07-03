# MilePilot Reporting Module

**Version:** 1.0 · **Status:** LOCKED

Production HTML email + PDF generation. Isolated from dashboard logic.

See [docs/REPORTING_SYSTEM_LOCK.md](../../docs/REPORTING_SYSTEM_LOCK.md) for the full design contract.

## Structure

- `styles/reportTheme.js` — central design tokens
- `email/` — dark premium email template
- `pdf/` — 7-page A4 premium PDF + components
- `utils/` — download token store
- `verification/` — snapshots, fingerprints, component registry

## Tests

```bash
npm run test:reporting-lock
```

## Do not

- Redesign reports
- Restructure layout
- Replace components
- Refactor for preference

Extend only — with explicit approval.
