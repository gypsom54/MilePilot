# Testing Framework

Every Intelligence Engine must support:

| Suite | Location |
| --- | --- |
| Unit Tests | `tests/seo-autopilot/unit/` |
| Integration Tests | `tests/seo-autopilot/integration/` |
| Engine Contract Tests | `tests/seo-autopilot/contract/` |
| Performance Tests | `tests/seo-autopilot/performance/` |
| Regression Tests | `tests/seo-autopilot/regression/` |

## Commands

```bash
pnpm run build:seo-autopilot
pnpm run test:seo-autopilot
```

## Contract minimum

Every registered engine must expose:

- `name`, `purpose`, `version`
- `inputs`, `outputs`, `events`, `dependencies`
- `analyse()`, `recommend()`, `automate()`, `health()`
