# SEO AutoPilot — Architecture Foundation (Sprint 0)

North Star: help businesses grow by transforming complex digital data into clear,
evidence-based actions that save time and produce measurable results.

This repository now includes the SEO AutoPilot monorepo foundation:

- `apps/` — `apps/web` customer shell (**D1–D6 LOCKED**; **Sprint D7 Guided Action Plans DONE**); `apps/api` composition shell
- `packages/` — engine-sdk, knowledge-graph SDK, ai prompt framework, shared, placeholders
- `services/` — Intelligence Engine scaffolds (no business/SEO logic)
- `docs/seo-autopilot/` — developer documentation
- `tests/seo-autopilot/` — unit / integration / contract / performance / regression structure

## Commands

```bash
pnpm install
pnpm run build:seo-autopilot
pnpm run test:seo-autopilot
pnpm run build:seo-web
pnpm run dev:seo-web
```

Delivery docs also include [`docs/SPRINT_D1_DELIVERY_REPORT.md`](./docs/SPRINT_D1_DELIVERY_REPORT.md), [`docs/SPRINT_D3_DELIVERY_REPORT.md`](./docs/SPRINT_D3_DELIVERY_REPORT.md), [`docs/SPRINT_D4_DELIVERY_REPORT.md`](./docs/SPRINT_D4_DELIVERY_REPORT.md), [`docs/SPRINT_D5_DELIVERY_REPORT.md`](./docs/SPRINT_D5_DELIVERY_REPORT.md), [`docs/SPRINT_D6_DELIVERY_REPORT.md`](./docs/SPRINT_D6_DELIVERY_REPORT.md) and [`docs/SPRINT_D7_DELIVERY_REPORT.md`](./docs/SPRINT_D7_DELIVERY_REPORT.md).

See `docs/seo-autopilot/README.md` for architecture guides.

## Product delivery planning (post-planning phase)

Customer-product delivery docs (MVP, roadmap, guardrails):

- [`docs/CURRENT_STATE_AUDIT.md`](./docs/CURRENT_STATE_AUDIT.md)
- [`docs/MVP_PRODUCT_SCOPE.md`](./docs/MVP_PRODUCT_SCOPE.md)
- [`docs/IMPLEMENTATION_ROADMAP.md`](./docs/IMPLEMENTATION_ROADMAP.md)
- [`docs/ENGINEERING_GUARDRAILS.md`](./docs/ENGINEERING_GUARDRAILS.md)
- [`docs/DECISIONS_REQUIRED.md`](./docs/DECISIONS_REQUIRED.md)
- [`docs/FIRST_SPRINT_RECOMMENDATION.md`](./docs/FIRST_SPRINT_RECOMMENDATION.md)
