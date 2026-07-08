# Scout Framework

Architecture documentation for Scout — RankAura's research employee.

## What Scout is

Scout is the **research employee** inside RankAura. Scout:

- Analyses website, competitors, and market trends
- Discovers customer demand (search intents)
- Scores and prioritises growth opportunities
- Generates daily, weekly, and monthly research reports
- Recommends plain-English actions

Scout is **not** AI, **not** an SEO tool, and uses **no external APIs** in Phase 1.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  scoutService (IAIEmployee)                             │
│  analyse · discover · prioritise · summarise · recommend│
├─────────────────────────────────────────────────────────┤
│  researchPipeline                                       │
│    → websiteAnalyser                                    │
│    → competitorAnalyser                                 │
│    → trendAnalyser                                      │
│    → scoringEngine                                      │
├─────────────────────────────────────────────────────────┤
│  opportunityInbox          reportService                │
│  recommendationGenerator                                │
├─────────────────────────────────────────────────────────┤
│  memoryReader (read-only)          AuraCore (writes)    │
└─────────────────────────────────────────────────────────┘
```

## Data flow

```
Memory (read) → Analysers → Pipeline → Scoring → Inbox
                                      → Reports → Dashboard
                                      → Recommendations
```

## Models

| Model | Location | Purpose |
| ----- | -------- | ------- |
| `SearchIntent` | `models/search-intent.ts` | Customer demand signal |
| `ScoutOpportunity` | `models/opportunity.ts` | Actionable growth opportunity |

## Reports

| Report | Method | Frequency |
| ------ | ------ | --------- |
| Daily | `reportService.generateDaily()` | Every morning brief |
| Weekly | `reportService.generateWeekly()` | End of week |
| Monthly | `reportService.generateMonthly()` | End of month |

## Access rules

- Scout **reads** memory via `IMemoryReader`
- Scout **does not write** to memory directly
- Inbox state changes route through AuraCore in Phase 2
- Scout does not modify other employees

## Phase 1 status

- ✅ Full modular architecture
- ✅ Mock data throughout
- ✅ IAIEmployee interface implemented
- ✅ Test specifications in every module
- ❌ No real research APIs
- ❌ No AI generation
- ❌ No database persistence

## Future roadmap

See Scout README and PROJECT_STATUS.md.
