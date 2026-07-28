# Ask SEO AutoPilot

**Authority:** [VOLUME_3_ASK_SEO_AUTOPILOT.md](./VOLUME_3_ASK_SEO_AUTOPILOT.md)

Ask SEO AutoPilot is the orchestration layer connecting every specialist engine, the Knowledge Graph, the Opportunity Engine and the Automation Engine.

It transforms specialist intelligence into one clear business decision.

## Implementation lock

**Do not implement** the orchestration engine until an approved sprint explicitly authorises it.

Sprint 0 provides only the service scaffold at `services/ask-autopilot` (unimplemented `IntelligenceEngine` methods + owned `prompt.md`).

## What it is not

- a generic chatbot
- an AI writing assistant
- a search box over reports
- a wrapper around one language model

## Locked orchestration principle

Ask SEO AutoPilot does not replace the Intelligence Engines and does not invent expertise. It identifies the user’s intent, retrieves the relevant business context, discovers the correct specialist capabilities, coordinates evidence, resolves conflicts and transforms the result into one clear, explainable and actionable response.

## Next phase

Business Discovery Domain — see [VOLUME_4_BUSINESS_DISCOVERY_READINESS.md](./VOLUME_4_BUSINESS_DISCOVERY_READINESS.md).  
Full blueprint arrives as **Volume 4 — Business Discovery Engine**.
