# Memory Framework

RankAura's Memory Framework stores everything AI employees know about a business.

## Principles

1. **No AI** — architecture and mock data only in Phase 1
2. **No persistence** — in-memory mock store, swappable for database later
3. **Read for all employees** — every AI employee reads via `IMemoryReader`
4. **Write through AuraCore** — no employee modifies another employee or memory directly
5. **Versioned and auditable** — every change creates a `MemoryEvent`

## Folder structure

```
services/memory/
├── README.md                 # This file
├── index.ts                  # Public exports
├── types.ts                  # IMemoryService, IMemoryReader, ILearningEngine
├── lifecycle.ts              # Lifecycle stages and transitions
├── memoryService.ts          # Mock implementation (Store, Retrieve, Update, …)
├── learningEngine.ts         # Mock learning engine + memoryReader
├── models/
│   ├── memory-store.ts       # MemoryStore (root composed type)
│   ├── business-memory.ts    # BusinessMemory
│   ├── brand-memory.ts       # BrandMemory
│   ├── website-memory.ts     # WebsiteMemory
│   ├── competitor-memory.ts  # CompetitorMemory
│   ├── performance-memory.ts # PerformanceMemory
│   ├── preference-memory.ts  # PreferenceMemory
│   ├── history-memory.ts     # HistoryMemory
│   ├── memory-event.ts       # MemoryEvent
│   ├── memory-confidence.ts  # MemoryConfidence
│   └── memory-timeline.ts    # MemoryTimeline
└── mock/
    ├── mockMemoryStore.ts    # Full mock MemoryStore
    ├── mockTimeline.ts       # Mock MemoryEvents
    └── mockInsights.ts       # Mock MemoryInsights
```

## Memory segments

| Segment | Model | Purpose |
| ------- | ----- | ------- |
| Business | `BusinessMemory` | Identity, industry, services, audience |
| Brand | `BrandMemory` | Voice, tone, writing style |
| Website | `WebsiteMemory` | URL, platform, pages |
| Competitors | `CompetitorMemory` | Competitive landscape |
| Performance | `PerformanceMemory` | Growth signals and wins |
| Preferences | `PreferenceMemory` | Autopilot, approvals, notifications |
| History | `HistoryMemory` | Past actions and decisions |
| Learning | `LearningRecord[]` | Insights learned over time |
| Seasonality | `SeasonalityRecord[]` | Seasonal demand patterns |

## Service capabilities

| Method | Access | Description |
| ------ | ------ | ----------- |
| `store()` | AuraCore only | Initialise or replace memory |
| `retrieve()` | All employees | Read full MemoryStore |
| `update()` | AuraCore only | Patch memory segments |
| `archive()` | AuraCore only | Archive a memory event |
| `version()` | All employees | Get current version info |
| `generateSummary()` | All employees | Plain-English memory summary |
| `generateTimeline()` | All employees | Chronological event timeline |
| `generateInsights()` | All employees | Surface actionable insights |

## Access control

```
AI Employee (read)  →  IMemoryReader  →  memoryReader
AI Employee (write) →  ❌ BLOCKED
AuraCore (write)    →  IMemoryService  →  memoryService
```

## Usage

```typescript
import { memoryReader, memoryService, MOCK_BUSINESS_ID } from "@/services/memory";

// Employee read (any employee)
const memory = await memoryReader.retrieve({
  businessId: MOCK_BUSINESS_ID,
  requestedBy: "scout",
});

// AuraCore write
await memoryService.update(
  { businessId: MOCK_BUSINESS_ID, requestedBy: "auracore" },
  { performance: { ...memory.performance, changePercent: 20 } },
);
```

## AuraCore integration

`IAuraCore` extends `IAuraCoreMemoryGateway`:

- `requestMemoryUpdate()` — employee-initiated changes routed through orchestration
- `requestMemoryArchive()` — archive events via orchestration
- `getMemory()` — read full store for brief generation

See `docs/MEMORY_LIFECYCLE.md` for lifecycle documentation.
