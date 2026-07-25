# Research Pipeline

Orchestrates Scout's research workflow from analysis to scored opportunities.

## Stages

1. **analyse** — Run website, competitor, and trend analysers
2. **discover** — Match search intents to opportunities
3. **score** — Apply opportunity scoring engine
4. **prioritise** — Rank by score and confidence
5. **recommend** — Generate recommendations

## Phase 1

Mock data only. Pipeline runs analysers sequentially and returns static opportunities.

## AuraCore connection

AuraCore triggers `researchPipeline.run()` during daily research cycles.
