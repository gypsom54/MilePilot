# Scout — Research Employee

Scout is RankAura's **research employee**. Scout is NOT AI and NOT an SEO tool.

Scout discovers growth opportunities by analysing the business website, competitors, and market trends — then presents plain-English recommendations.

## Philosophy

- Plain business language — no SEO jargon
- Research, not automation
- Reads from Memory (read-only)
- All writes pass through AuraCore

## Folder structure

```
scout/
├── README.md                 # This file
├── index.ts                  # Public exports
├── config.ts                 # Scout configuration
├── types.ts                  # Scout-specific types
├── scoutService.ts           # IAIEmployee implementation
├── models/                   # SearchIntent, ScoutOpportunity
├── mock/                     # Mock research data
├── pipeline/                 # Research pipeline orchestration
├── analysers/
│   ├── website/              # Website analyser
│   ├── competitor/           # Competitor analyser
│   └── trend/                # Trend analyser
├── scoring/                  # Opportunity scoring engine
├── recommendations/          # Recommendation generator
├── inbox/                    # Opportunity inbox
└── reports/                  # Daily, weekly, monthly reports
```

## IAIEmployee methods

| Method | Purpose |
| ------ | ------- |
| `analyse()` | Run all analysers via research pipeline |
| `discover()` | Find new opportunities for inbox |
| `prioritise()` | Score and rank opportunities |
| `summarise()` | Generate daily research summary |
| `recommend()` | Produce plain-English action recommendations |

## Usage

```typescript
import { scoutService } from "@/services/employees/scout";

const analysis = await scoutService.analyse({
  businessId: "biz_rankaura_demo",
  requestedBy: "auracore",
});

const report = await scoutService.summarise({
  businessId: "biz_rankaura_demo",
  requestedBy: "auracore",
});
```

## Phase 1 status

Architecture only. Mock data. No APIs, AI, scraping, or database.

See `docs/SCOUT_FRAMEWORK.md` for full architecture documentation.
