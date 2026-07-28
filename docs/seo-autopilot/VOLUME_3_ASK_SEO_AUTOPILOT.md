# Engineering Bible — Volume 3

# Ask SEO AutoPilot

## The Orchestration Engine

> **Implementation lock:** This volume is specification only.  
> Do **not** implement the Ask SEO AutoPilot orchestration engine until an approved sprint explicitly authorises it.  
> The next engineering phase remains the Business Discovery Domain (Volume 4).

---

## Product architecture update

The platform now has two closely connected AI-visibility capabilities:

### AI Discovery & Recommendation Engine

Measures whether businesses are understood, cited, mentioned and recommended by AI platforms.

### Answer Opportunity Intelligence Engine

Discovers the questions customers are asking and identifies where the business can become the strongest available answer.

These feed the:

### Knowledge Asset Builder

Creates complete authority assets rather than generic blog posts.

### The closed loop

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

---

## What Ask SEO AutoPilot is

Ask SEO AutoPilot transforms specialist intelligence into one clear business decision.

Ask SEO AutoPilot is the primary interface to the platform.

### It is not

- a generic chatbot
- an AI writing assistant
- a search box over reports
- a wrapper around one language model

### It is

The orchestration layer connecting every specialist engine, the Knowledge Graph, the Opportunity Engine and the Automation Engine.

---

## Central responsibility

A user should never need to understand which engine owns a task.

They should simply ask:

- “What should I work on today?”
- “Why has traffic fallen?”
- “Does ChatGPT recommend my business?”
- “Which customer questions are we failing to answer?”
- “What is the best growth opportunity this month?”

Ask SEO AutoPilot determines:

1. What the user is actually asking.
2. Which business context is relevant.
3. Which engines have the required capabilities.
4. What evidence must be collected.
5. Whether the evidence agrees or conflicts.
6. How confident the system should be.
7. What action should be recommended.
8. Whether that action can be prepared or executed.
9. How the answer should be explained.

---

## The orchestration flow

```text
User request
     ↓
Intent interpretation
     ↓
Business context retrieval
     ↓
Capability discovery
     ↓
Engine selection
     ↓
Parallel evidence collection
     ↓
Evidence validation
     ↓
Conflict resolution
     ↓
Opportunity prioritisation
     ↓
Response construction
     ↓
Approval or automation
     ↓
Knowledge Graph update
```

---

## 1. Intent interpretation

Ask SEO AutoPilot must distinguish between different types of request.

| Intent | Example | Behaviour |
| --- | --- | --- |
| **Informational** | “How many reviews did we receive this month?” | Return verified information. |
| **Diagnostic** | “Why did our rankings drop?” | Investigate causes across multiple engines. |
| **Strategic** | “Where should we focus our marketing?” | Compare opportunities and recommend a direction. |
| **Creative** | “Create a knowledge asset for this topic.” | Prepare structured output from approved evidence. |
| **Operational** | “Fix the missing internal links.” | Determine whether the action can be safely executed. |
| **Monitoring** | “Tell me when a competitor starts appearing above us in AI answers.” | Create or update a monitoring rule. |
| **Exploratory** | “What opportunities are we missing?” | Search broadly across the intelligence mesh. |

The system should not use the same reasoning pattern for every request.

---

## 2. Context assembly

Before consulting engines, Ask SEO AutoPilot retrieves the relevant business context.

This may include:

- business stage
- goals
- products and services
- locations
- ideal customers
- brand tone
- current priorities
- website entities
- existing knowledge assets
- recent performance
- open opportunities
- previous decisions
- user permissions
- automation preferences
- confidence thresholds

The answer should reflect the business rather than providing generic advice.

---

## 3. Capability discovery

Ask SEO AutoPilot should not rely on a permanently hard-coded list of engines.

Every engine publishes a **Capability Manifest**.

### Example

```yaml
engine:
  id: answer-opportunity
  name: Answer Opportunity Intelligence
  version: 1.0.0

capabilities:
  - discover_customer_questions
  - cluster_question_intent
  - detect_knowledge_gaps
  - score_answer_opportunities
  - create_answer_maps

consumes:
  - business_profile
  - topic_entities
  - community_signals
  - search_signals
  - competitor_content

produces:
  - answer_opportunity
  - question_cluster
  - knowledge_gap
  - answer_map

confidence:
  minimum_actionable: 0.65

risk:
  default: low

approval:
  required_for_execution: false
```

Ask SEO AutoPilot searches the Engine Registry for the capabilities needed to answer the request.

This means future engines can be added without rewriting the orchestrator.

---

## 4. Orchestration plans

For every meaningful request, the system generates an internal execution plan.

### Example request

“Why is my competitor being recommended by AI platforms instead of me?”

### Internal plan

1. Retrieve the relevant business, service and location entities.
2. Ask AI Discovery for recommendation and citation evidence.
3. Ask Competitor Intelligence for comparative visibility.
4. Ask Authority Intelligence for third-party trust differences.
5. Ask Answer Opportunity Intelligence for unanswered question gaps.
6. Ask Experience Intelligence for technical accessibility issues.
7. Ask the Knowledge Graph for supporting relationships and history.
8. Ask Opportunity Intelligence to rank the available corrective actions.
9. Produce one evidence-based explanation.

The user does not need to see the technical plan unless they request it.

---

## 5. Parallel intelligence

Where possible, engines should work in parallel.

```text
AI Discovery ─────────────┐
Competitor Intelligence ──┤
Authority Intelligence ───┤
Answer Opportunity ───────┼── Evidence Resolver
Experience Intelligence ──┤
Review Intelligence ──────┤
Knowledge Graph ──────────┘
```

This avoids unnecessarily slow sequential processing.

Dependencies should still be respected when one engine requires another engine’s output.

---

## 6. Evidence contract

Every engine response must follow a shared evidence structure.

```ts
interface EngineEvidence {
  engineId: string;
  claim: string;
  evidence: EvidenceItem[];
  confidence: number;
  observedAt: string;
  expiresAt?: string;
  limitations: string[];
  relatedEntities: string[];
  suggestedActions?: SuggestedAction[];
}
```

Every evidence item should identify:

- source
- observation date
- relevant entity
- supporting data
- confidence
- freshness
- limitations

No engine should return an unexplained recommendation.

---

## 7. Conflict resolution

Engines will sometimes disagree.

### Example

- Content Intelligence may recommend publishing a new guide.
- Authority Intelligence may determine that improving an existing page would be stronger.
- Performance Intelligence may warn that publishing more content before resolving technical problems could dilute results.

Ask SEO AutoPilot must resolve this transparently.

### Conflict rules

1. Prefer direct evidence over inference.
2. Prefer fresh evidence over stale evidence.
3. Prefer business outcomes over vanity metrics.
4. Respect engine ownership boundaries.
5. Consider dependencies and sequencing.
6. Penalise recommendations with weak confidence.
7. Prefer reversible actions when evidence is uncertain.
8. Escalate unresolved high-risk conflicts for human approval.

### Example synthesised answer

“There is clear demand for a new guide, but creating it is not the best first action. Your existing page already has authority and is underperforming because its evidence, structure and internal links are incomplete. Improving that page first is the lower-effort, higher-confidence opportunity.”

---

## 8. Recommendation synthesis

Ask SEO AutoPilot should not dump ten engine outputs on the user.

It should synthesise them into:

1. **What is happening?** — A plain-English diagnosis.
2. **Why does it matter?** — Connection to the business goal.
3. **What should we do?** — One prioritised action.
4. **Why this action?** — Evidence and confidence.
5. **What happens next?** — Expected result, dependencies and monitoring.

### Example

Your strongest opportunity is to expand your sole-trader tax guide rather than publish another general article.

Customers are repeatedly asking seven questions that your current page does not answer. Two competitors cover those questions, and AI platforms currently cite one of them for recommendation-related prompts. Your existing page already attracts relevant traffic, so strengthening it is likely to produce a faster result than creating a new page.

Confidence: 89%

SEO AutoPilot can prepare the complete knowledge-asset upgrade for your approval.

---

## 9. Progressive disclosure

The default answer should remain calm and understandable.

Users can expand:

- evidence
- engines consulted
- confidence reasoning
- sources
- opportunity calculation
- expected impact
- action history
- technical details

The platform should never force non-technical users to interpret raw SEO data.

---

## 10. Conversational continuity

Ask SEO AutoPilot must understand follow-up instructions.

### Example

1. “Why are we not appearing?”
2. Then: “What about locally?”
3. Then: “Create the page.”
4. Then: “Make it sound more professional.”

The orchestrator maintains:

- active business
- active topic
- active opportunity
- prior evidence
- approved direction
- current workflow state

It must not make the user repeatedly restate the context.

---

## 11. Action preparation

Ask SEO AutoPilot can move from explanation into action.

| Mode | Example |
| --- | --- |
| **Inform** | “Your service page lacks supporting evidence.” |
| **Recommend** | “Add a proof section with three verifiable trust signals.” |
| **Draft** | “I have prepared the section and schema changes.” |
| **Execute** | “The approved changes have been published.” |

Automation remains governed by:

- risk level
- user permissions
- confidence
- reversibility
- approval requirements
- platform connection status

---

## 12. Memory and learning

The orchestrator should learn from decisions without becoming unpredictable.

It records:

- recommendations accepted
- recommendations rejected
- edits made by the user
- preferred tone
- preferred level of detail
- recurring business priorities
- automation comfort
- outcomes from completed actions

Learning must not silently override locked business facts or user permissions.

A user correction becomes explicit knowledge:

“We do not serve national customers.”

That updates the business context and prevents future national-growth recommendations.

---

## 13. Response modes

Ask SEO AutoPilot should support several presentation modes.

| Mode | Purpose |
| --- | --- |
| **Quick answer** | One clear answer with the most important evidence. |
| **Guided mode** | Explains the recommendation step by step. |
| **Executive mode** | Focuses on impact, risk, cost and expected return. |
| **Specialist mode** | Shows detailed technical evidence and engine outputs. |
| **Action mode** | Moves directly into preparation, approval or execution. |

The platform may recommend a mode, but the user controls how much detail they see.

---

## 14. Failure behaviour

The orchestrator must never pretend certainty.

### When evidence is incomplete

“There is not enough verified information to determine the cause yet. Search visibility declined, but the platform does not currently have access to conversion data or recent website deployments. I can still investigate the technical and competitive signals, but the result will remain provisional.”

### When an engine fails

“Performance data is temporarily unavailable. The recommendation below is based on search, competitor and content evidence only.”

### When engines disagree

“Two plausible causes remain. The current evidence slightly favours the first, but confidence is only 62%.”

Trust is more important than sounding decisive.

---

## 15. Orchestration records

Every meaningful interaction should create an auditable record containing:

- user request
- interpreted intent
- context used
- engines consulted
- execution plan
- evidence received
- conflicts found
- recommendation
- confidence
- actions offered
- approval state
- outcome
- Knowledge Graph updates

This allows debugging, compliance, learning and explainability.

---

## Locked orchestration principle

Ask SEO AutoPilot does not replace the Intelligence Engines and does not invent expertise. It identifies the user’s intent, retrieves the relevant business context, discovers the correct specialist capabilities, coordinates evidence, resolves conflicts and transforms the result into one clear, explainable and actionable response.

That is now the intelligence layer connecting the complete platform.

---

## Next controlled step

Cursor should **not** begin implementing this orchestration engine yet.

The next engineering phase remains the **Business Discovery Domain**, but its specification should now support:

- complete business entity profiles
- products and services
- customer questions
- audience intents
- expertise areas
- locations
- business goals
- brand claims
- evidence sources
- AI entity readiness
- future Answer Opportunity research

The next document in the plan is:

**Volume 4 — Business Discovery Engine**  
Complete Domain and Engineering Specification

That will give Cursor the precise blueprint for Sprint 1 without allowing it to invent the product.
