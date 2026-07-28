# SEO AutoPilot — Architecture Foundation (Sprint 0)

North Star: help businesses grow by transforming complex digital data into clear,
evidence-based actions that save time and produce measurable results.

This repository now includes the SEO AutoPilot monorepo foundation:

- `apps/` — web + api shells (no UI / no business endpoints)
- `packages/` — engine-sdk, knowledge-graph SDK, ai prompt framework, shared, placeholders
- `services/` — Intelligence Engine scaffolds (no business/SEO logic)
- `docs/seo-autopilot/` — developer documentation
- `tests/seo-autopilot/` — unit / integration / contract / performance / regression structure

## Commands

```bash
pnpm install
pnpm run build:seo-autopilot
pnpm run test:seo-autopilot
```

See `docs/seo-autopilot/README.md` for architecture guides.
