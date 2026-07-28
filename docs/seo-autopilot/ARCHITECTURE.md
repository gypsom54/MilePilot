# SEO AutoPilot — Architecture Overview

## Mission

See [NORTH_STAR.md](./NORTH_STAR.md).

## Bible volumes (authority)

| Volume | Document | Status |
| --- | --- | --- |
| 3 | [VOLUME_3_ASK_SEO_AUTOPILOT.md](./VOLUME_3_ASK_SEO_AUTOPILOT.md) | Spec locked — **do not implement yet** |
| 4 | [VOLUME_4_BUSINESS_DISCOVERY.md](./VOLUME_4_BUSINESS_DISCOVERY.md) | Implemented (Sprint 1) |
| 5 | [VOLUME_5_MARKET_INTELLIGENCE.md](./VOLUME_5_MARKET_INTELLIGENCE.md) | Implemented (Sprint 2) |
| 6 | [VOLUME_6_WEBSITE_INTELLIGENCE.md](./VOLUME_6_WEBSITE_INTELLIGENCE.md) | Implemented (Sprint 3) |
| 7 | [VOLUME_7_CRAWL_INTELLIGENCE.md](./VOLUME_7_CRAWL_INTELLIGENCE.md) | Implemented (Sprint 4) |
| 8 | [VOLUME_8_KNOWLEDGE_GRAPH.md](./VOLUME_8_KNOWLEDGE_GRAPH.md) | Implemented (Sprint 5) |

**Baseline architecture review:** [PLATFORM_ARCHITECTURE_AUDIT.md](./PLATFORM_ARCHITECTURE_AUDIT.md) — Engineering Bible checkpoint (post–Sprint 5). **Proceed with new intelligence; do not open a foundation refactor sprint.** Revisit after additional engines to verify architectural law — not to redesign.

## AI-visibility product loop

Defined in Volume 3. Two closely connected capabilities feed the Knowledge Asset Builder:

1. **AI Discovery & Recommendation Engine** — measures whether businesses are understood, cited, mentioned and recommended by AI platforms.
2. **Answer Opportunity Intelligence Engine** — discovers customer questions and where the business can become the strongest available answer.
3. **Knowledge Asset Builder** — creates complete authority assets rather than generic blog posts.

```text
Discover questions
        ↓
Cluster intent and topics
        ↓
Detect knowledge gaps
        ↓
Score opportunities
        ↓
Build the knowledge asset
        ↓
Strengthen evidence and authority
        ↓
Publish and connect it
        ↓
Monitor search and AI visibility
        ↓
Improve and expand it
```

Ask SEO AutoPilot is the orchestration layer over this mesh. It does not replace specialist engines.

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
  business-discovery      # Sprint 1 — canonical business understanding
  market-intelligence     # Sprint 2 — external market observations
  website-intelligence    # Sprint 3 — structural/semantic website model
  crawl                   # Sprint 4 — crawl observation domain
  knowledge-graph-engine  # Sprint 5 — canonical semantic memory
  performance
  authority
  reviews
  community
  competitor
  opportunity
  ask-autopilot           # orchestration engine shell (unimplemented)
```

Forthcoming engines from Volume 3 (not implemented until their specification volumes / approved sprints):

- AI Discovery & Recommendation
- Answer Opportunity Intelligence
- Knowledge Asset Builder

## Core principles

1. **Every engine implements `IntelligenceEngine`** — no custom top-level structures.
2. **Engines communicate only through the Event Bus** — no direct coupling.
3. **Knowledge Graph access is via SDK interfaces** — no ad-hoc graph access.
4. **Every engine registers in the Engine Registry** — plugin architecture.
5. **Every engine publishes a Capability Manifest** — Ask discovers capabilities; no hard-coded engine list.
6. **Every engine response follows the Evidence contract** — no unexplained recommendations.
7. **Every engine logs through the shared logging framework.**
8. **Every engine owns its own `prompt.md`** — independent, versioned, replaceable.
9. **Every engine is configured** (limits, timeouts, flags, version, health, dependencies).
10. **Every engine is testable** via the shared test structure.

## Runtime composition (Sprint 0)

`@seo-autopilot/api` exposes `createPlatformRuntime()` which constructs:

- `InMemoryEngineRegistry`
- `InMemoryEventBus`

Durable transports and real HTTP servers are out of scope for Sprint 0.
