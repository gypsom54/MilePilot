# Memory Framework — Architecture Summary

Phase 1 memory framework for RankAura's AI Growth Operating System.

## What was built

- **Composed MemoryStore** — 7 memory segments + learning + seasonality
- **IMemoryService** — Store, Retrieve, Update, Archive, Version, GenerateSummary, GenerateTimeline, GenerateInsights
- **IMemoryReader** — read-only contract for AI employees
- **ILearningEngine** — insight recording and generation (mock)
- **IAuraCoreMemoryGateway** — sole write path for employee-initiated changes
- **MemoryEvent + MemoryTimeline** — audit trail and chronological view
- **MemoryConfidence** — scoring model for trust levels
- **Mock data** — full demo business memory in memory

## Key rules

1. Every AI employee reads memory via `IMemoryReader`
2. No employee writes directly — `memoryService.update()` rejects non-AuraCore actors
3. No AI, embeddings, database, or APIs
4. UI unchanged

## Entry points

```typescript
import {
  memoryService,    // full service (writes gated)
  memoryReader,     // read-only for employees
  learningEngine,   // insights
  MOCK_MEMORY_STORE,
} from "@/services/memory";
```

## Related docs

- [services/memory/README.md](../services/memory/README.md)
- [MEMORY_LIFECYCLE.md](./MEMORY_LIFECYCLE.md)
- [SYSTEM_MAP.md](./SYSTEM_MAP.md)
