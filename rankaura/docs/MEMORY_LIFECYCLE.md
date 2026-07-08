# Memory Lifecycle

How memory moves through RankAura from creation to archival.

## Stages

```
┌─────────┐     ┌─────────┐     ┌───────────┐     ┌──────────┐
│  draft  │ ──► │  active │ ──► │ validated │ ──► │ archived │
└─────────┘     └─────────┘     └───────────┘     └──────────┘
     │                │                │                 ▲
     └────────────────┴────────────────┴─────────────────┘
                    (direct archive allowed)
```

| Stage | Description |
| ----- | ----------- |
| **draft** | Initial memory captured during onboarding, not yet validated |
| **active** | In use by AI employees via read access |
| **validated** | Confidence threshold met, trusted for automated decisions |
| **archived** | Retained for audit but no longer drives active decisions |

## Transitions

| From | Allowed transitions |
| ---- | ------------------- |
| draft | active, archived |
| active | validated, archived |
| validated | active, archived |
| archived | (none — terminal) |

Transitions are enforced by AuraCore in Phase 2.

## Event types

Every memory change produces a `MemoryEvent`:

| Type | Trigger |
| ---- | ------- |
| `created` | Initial store |
| `updated` | Patch via AuraCore |
| `archived` | Event or segment archived |
| `versioned` | Version increment |
| `insight_generated` | Learning engine records insight |

## Versioning

- Each `update()` increments `MemoryStore.version`
- `version()` returns current version metadata
- Events carry the version number at time of change

## Confidence model

`MemoryConfidence` scores every event and insight:

| Score | Level | Meaning |
| ----- | ----- | ------- |
| 80–100 | high | Trusted for automated action |
| 50–79 | medium | Useful, may need validation |
| 0–49 | low | Tentative, human review recommended |

## Read vs write paths

### Read (any employee)

```
Employee → IMemoryReader.retrieve()
         → IMemoryReader.generateSummary()
         → IMemoryReader.generateTimeline()
         → ILearningEngine.generateInsights()
```

### Write (AuraCore only)

```
Employee requests change
    → AuraCore.requestMemoryUpdate()
        → IMemoryService.update()
            → MemoryEvent created
            → Version incremented
```

### Blocked path

```
Employee → IMemoryService.update()  →  ❌ Error: write denied
```

## Phase 1 status

- Lifecycle stages defined as types
- Mock service simulates versioning and events in memory
- No persistence — data resets on server restart
- No AI — insights are static mock data

## Phase 2 recommendations

1. Persist `MemoryStore` and `MemoryEvent` to database
2. Enforce lifecycle transitions in AuraCore
3. Add confidence decay over time
4. Connect LearningEngine to real analyst outputs
5. Add memory conflict resolution when employees disagree
