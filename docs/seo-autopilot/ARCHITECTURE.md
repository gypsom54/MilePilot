# SEO AutoPilot — Architecture Overview

## Mission

See [NORTH_STAR.md](./NORTH_STAR.md).

## Topology

```text
/apps
  web                 # future UI host (scaffold only in Sprint 0)
  api                 # future API host + composition root helpers

/packages
  engine-sdk          # IntelligenceEngine + Engine Registry
  knowledge-graph     # Knowledge Graph SDK interfaces
  ai                  # Per-engine prompt framework
  shared              # Events, logging, config, results
  database            # placeholder
  auth                # placeholder (no auth UI)
  ui                  # placeholder (no UI decisions)

/services
  business-discovery
  market-intelligence
  performance
  crawl
  authority
  reviews
  community
  competitor
  opportunity
  ask-autopilot       # orchestration engine shell
```

## Core principles

1. **Every engine implements `IntelligenceEngine`** — no custom top-level structures.
2. **Engines communicate only through the Event Bus** — no direct coupling.
3. **Knowledge Graph access is via SDK interfaces** — no ad-hoc graph access.
4. **Every engine registers in the Engine Registry** — plugin architecture.
5. **Every engine logs through the shared logging framework.**
6. **Every engine owns its own `prompt.md`** — independent, versioned, replaceable.
7. **Every engine is configured** (limits, timeouts, flags, version, health, dependencies).
8. **Every engine is testable** via the shared test structure.

## Runtime composition (Sprint 0)

`@seo-autopilot/api` exposes `createPlatformRuntime()` which constructs:

- `InMemoryEngineRegistry`
- `InMemoryEventBus`

Durable transports and real HTTP servers are out of scope for Sprint 0.
