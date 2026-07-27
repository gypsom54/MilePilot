# Ask RankAura — Core Feature Specification

**Status:** PROTOTYPE BUILT — PENDING SCREENSHOT APPROVAL  
**Phase:** B (Workspace prototype — deterministic mock only)  
**Owner:** Jonathan  
**Authority:** Phase A approved · Workspace architecture approved · Growth Plan locked  
**Related:** `docs/WORKSPACE_SPEC.md` · `docs/GROWTH_PLAN_SPEC.md` · `docs/UI_BIBLE.md` · `docs/SCREEN_LOCK_STATUS.md` · `docs/PRODUCT_GUARDRAILS.md`  
**Implementation:** `rankaura-web/components/ask-rankaura/` · `rankaura-web/services/askRankAura/` · `rankaura-web/types/askRankAura.ts` · route `/workspace`

---

## 0. Purpose

Ask RankAura is a **locked, permanent core product direction**.

It is **not** a secondary chatbot, floating support bubble, or generic AI assistant.

Ask RankAura allows ordinary business owners to ask natural-language questions about their business growth — website, competitors, content, local visibility, reviews, opportunities, completed work, and recommendations awaiting approval — **without needing SEO knowledge**.

Ask RankAura translates complex growth information into calm, useful, plain-English answers grounded in the customer’s own RankAura data.

**Long-term product position:** Ask RankAura becomes the primary conversational interface and eventual front door to the RankAura Workspace.

The customer should feel like they are **checking in with a trusted business growth adviser who already understands their business**.

---

## 1. Locked product philosophy

### Ask RankAura should feel like

> “Checking in with my business growth adviser.”

### Ask RankAura should not feel like

> “Opening an AI chatbot.”

### Core truths

| Ask RankAura is | Ask RankAura is not |
|-----------------|---------------------|
| A trusted growth adviser | A generic chatbot |
| Grounded in the customer’s RankAura data | Ungrounded AI speculation |
| Calm, concise, plain English | SEO jargon or technical dumps |
| Honest about missing data | Fabricated rankings, traffic, or results |
| A compact Workspace entry point | A huge chat window or floating bubble |
| The eventual front door to RankAura | A support widget |

---

## 2. Workspace position (LOCKED direction — pending prototype)

The **current** Workspace architecture remains approved and must **not** be removed or redesigned during Phase A or the initial prototype:

```text
1. Greeting
2. Biggest Opportunity
3. Recent Wins
4. Since Your Last Visit
5. Growth Areas
6. Recent Progress
```

**Approved insertion point (Phase B):** Ask RankAura sits **directly beneath the greeting and reassurance message**, before Biggest Opportunity:

```text
1. Greeting
2. Ask RankAura          ← new (compact card; not a full chat wall)
3. Biggest Opportunity
4. Recent Wins
5. Since Your Last Visit
6. Growth Areas
7. Recent Progress
```

Ask RankAura should feel **central but calm**. It must not dominate the Workspace or replace the approved sections.

**Phase A rule:** Do not modify `rankaura-web` Workspace components until this spec is approved.

**Phase B implementation (recorded):** Ask RankAura is implemented as a compact expandable card on `/workspace`, inserted beneath Greeting. Existing Workspace sections are preserved. Answers resolve through `mockAskRankAuraProvider` — no live LLM.

---

## 3. Initial Ask RankAura design (Workspace card)

One premium **Ask RankAura** card on the Workspace.

| Element | Spec |
|---------|------|
| Heading | **Ask RankAura** |
| Supporting copy | **Ask anything about your business growth.** |
| Input placeholder | **Ask about your business…** |
| Submit | One clear submit action |
| Default state | **Compact** — no large empty chat window on the Workspace |
| After submit | Expand into a **focused answer panel** within the card (preferred for prototype) **or** open a dedicated Ask view only if repository architecture strongly favours it |
| Chat history | Do **not** allow a long chat history to dominate the Workspace in Phase B; dedicated history may come later |

### Forbidden UI patterns

- Floating support bubble
- Full-height chat pane on Workspace load
- AI employee avatars or characters
- Voice mode
- Excessive animations
- Generic “How can I help you today?” chatbot framing

---

## 4. Suggested questions

| Rule | Spec |
|------|------|
| Max displayed | **4** contextual suggested questions |
| Source | Current business data + Workspace activity + Growth Plan state |
| Tone | Short, useful, relevant |
| Forbidden | Huge prompt library · random generic FAQs |

### Example suggested questions

- What is my biggest opportunity today?
- What has RankAura completed since my last visit?
- Which recommendations are waiting for approval?
- What have my competitors changed this week?
- What content should I publish next?
- What questions are customers asking online?
- Is there anything urgent I need to know?
- What should I focus on this month?
- How can I improve my local visibility?
- What PR opportunities have been found?

Suggested questions should **change** as RankAura activity and data availability change.

---

## 5. Required question categories (intent model)

The data and intent model must support questions in these categories. A single user question may map to one or more intents.

| # | Category | Example questions |
|---|----------|-------------------|
| 1 | **Current priorities** | What is my biggest opportunity today? · Is there anything urgent? · What should I focus on next? |
| 2 | **Completed work** | What has RankAura completed this week? · What changed since my last visit? · What improvements have already been prepared? |
| 3 | **Approvals** | Which recommendations need my approval? · What happens if I approve these website changes? · Show me the safest changes first. |
| 4 | **Website optimisation** | What is stopping more people finding my website? · Which pages need improvement? · Are there any mobile problems? |
| 5 | **Keywords** | What are my best keyword opportunities? · What are customers searching for? · Which local searches matter most? |
| 6 | **Competitors** | What have my competitors changed this week? · Where are competitors outperforming me? · Have any new gaps appeared? |
| 7 | **Content** | What should I publish next? · What customer questions should my website answer? · Which service page should we improve first? |
| 8 | **Reddit & community research** | What are customers asking on Reddit? · What concerns do people have before buying? · What language do customers naturally use? |
| 9 | **Local SEO** | How can I improve my Google Maps visibility? · Which citations are missing? · Is my business information consistent online? |
| 10 | **Reviews & reputation** | Have I received any new reviews? · Which reviews need a response? · How can I improve customer trust? |
| 11 | **Authority & backlinks** | What backlink opportunities have been found? · Are there relevant websites that could mention my business? · How is RankAura building my authority? |
| 12 | **Digital PR** | What PR opportunities are available? · Is there a local story we could pitch? · Have any journalist opportunities appeared? |
| 13 | **Social media** | What should I post this week? · Which platform matters most for my business? · Can website content be repurposed for social media? |
| 14 | **Analytics** | Why did my traffic change? · What is currently working? · Which pages are attracting enquiries? |
| 15 | **Business intelligence** | Are there any new business opportunities? · Has local demand changed? · What should I prepare for next month? |

---

## 6. Answer structure

Answers should **normally** follow a calm, compact structure. **Do not force every section on every answer** — simple questions receive simple answers.

### Standard sections (when relevant)

| Section | Purpose |
|---------|---------|
| **Direct answer** | One clear sentence answering the question |
| **What we found** | Only the most relevant evidence or context |
| **What RankAura is doing** | Work already underway |
| **Your next step** | Only when genuine customer action is required |

### Example (full structure)

**Question:** What is my biggest opportunity today?

**Direct answer:** Your strongest opportunity today is improving your main service pages for local customer searches.

**What we found:** Customers nearby are searching for phrases your current pages only partially address.

**What RankAura is doing:** We’ve prepared updated headings, page copy and internal-link recommendations.

**Your next step:** Review the proposed changes when you’re ready.

**Action:** Review & Fix

---

## 7. Tone and language

### Must be

- Calm · Helpful · Confident · Honest · Plain English · Business-focused · Concise by default

### Avoid

- SEO jargon · Overly long answers · Robotic introductions · Excessive enthusiasm · Technical data dumps · Repeating the customer’s first name · Pretending planned work is already completed · Exposing chain-of-thought or internal reasoning

### Prefer

- “We found…” · “We’ve prepared…” · “We’re monitoring…” · “This could help…” · “Nothing urgent needs your attention.” · “This recommendation is ready when you are.”

---

## 8. Personalisation

| Context | Rule |
|---------|------|
| First name | Use **sparingly** — e.g. Workspace greeting only, not in every Ask answer |
| Business name | Prefer when relevant — e.g. “Your business has three local search opportunities worth reviewing.” |
| Business description, website, industry, location | Available to the answer provider for grounding |
| Growth Plan & categories | Primary strategic context |
| Recent activity, recommendations, approvals | Primary operational context |

Personalisation must feel natural, not artificial.

---

## 9. Trust, data grounding, and confidence

Every answer must be traceable to an **identifiable RankAura data source**.

### Answer sources (typed)

- Website audit  
- Keyword research  
- Competitor monitoring  
- Google Search Console  
- Google Analytics  
- Google Business Profile  
- Review monitoring  
- Citation monitoring  
- Reddit & community research  
- Rank tracking  
- Content plan  
- Growth Plan  
- Recent activity  
- User-provided business information  

### Internal data-availability states

| State | Meaning | Customer-facing example |
|-------|---------|-------------------------|
| `confirmed` | Source connected; data supports the answer | “Search Console shows that impressions increased for this page.” |
| `inferred` | Partial signal; cautious wording | “Early signs suggest more people are finding this page — we’re watching for a clearer trend.” |
| `incomplete` | Some data exists but not enough for a firm conclusion | “I can see early movement, but there isn’t enough data yet to call this a trend.” |
| `unavailable` | Source not connected or not yet analysed | “Google Search Console is not connected yet, so I can’t verify ranking changes.” |

Do **not** expose technical confidence percentages to customers unless explicitly approved later.

### Hard trust rules

Ask RankAura must **never invent**:

- Rankings · Traffic changes · Reviews · Competitor activity · Completed work · Opportunities · Recommendations · Results

When information is unavailable, say so clearly and explain what is missing or what RankAura will do once connected.

**Example (unavailable):**

> Google Search Console is not connected yet, so I can’t confirm ranking changes. Once connected, I’ll monitor them and explain meaningful movement in plain English.

---

## 10. Actions

Ask RankAura may link to relevant **existing** RankAura actions.

### Initial safe actions (Phase B prototype)

- View recommendation  
- Review & Fix  
- View Growth Plan  
- View Research  
- Open Strategy  
- View Progress  
- Approve changes  
- Connect data source  

### Phase boundaries

- **Do not** implement autonomous live changes in Phase B  
- **Do not** publish content, modify websites, send outreach, or make external changes without explicit approval and a future action-safety specification  

---

## 11. Conversation experience

### Default (Workspace card)

- Heading  
- Supporting sentence  
- Input  
- Up to 4 suggested questions  

### After submit (prototype preference)

**Option A (preferred):** Expand the card into a focused answer panel — preserves calm Workspace.

**Option B:** Dedicated Ask RankAura route — only if architecture strongly favours separation; must remain compact on mobile.

### Later (out of Phase B)

- Dedicated conversational history  
- Possible eventual front-door routing through Ask RankAura  

---

## 12. Empty and error states

| Situation | Response pattern |
|-----------|------------------|
| **No available data** | “I don’t have enough information to answer that yet.” + explain what is missing |
| **Missing integration** | Name the source + benefit of connecting — e.g. “Connect Google Search Console so I can analyse which searches are bringing people to your website.” |
| **Analysis still running** | “I’m still analysing this area. I’ll add the findings to your Growth Plan when they’re ready.” |
| **No urgent issues** | “Nothing urgent needs your attention today. RankAura is continuing to monitor your website and competitors.” |
| **Outside RankAura scope** | “I can help with questions about your business growth, website, competitors and online visibility.” — do **not** fabricate business-specific answers |

---

## 13. Context the assistant must understand

When available from onboarding, Growth Plan, Workspace mocks, and future live providers:

- First name  
- Business name  
- Business description  
- Website  
- Industry  
- Location or service area  
- Growth Plan  
- Applicable growth categories  
- Recent RankAura activity  
- Recommendations  
- Approvals  
- Monitoring results  
- Connected data sources  

Phase B prototype uses **deterministic mock data** aligned with the approved Workspace business scenario.

---

## 14. Component and type direction (Phase B)

Do **not** hard-code all answers inside page components. Use a deterministic mock provider consistent with existing RankAura provider patterns (`mockWorkspace`, `mockGrowthPlan`, etc.).

### Suggested components

| Component | Role |
|-----------|------|
| `AskRankAuraCard` | Workspace entry card (heading, input, suggested questions) |
| `AskRankAuraInput` | Accessible question input + submit |
| `SuggestedQuestions` | Up to 4 contextual prompt chips |
| `AskRankAuraAnswer` | Focused answer panel (expandable) |
| `AnswerEvidence` | “What we found” evidence block |
| `AnswerAction` | Optional CTA link/button |
| `DataAvailabilityNotice` | Honest unavailable/incomplete messaging |

### Suggested types

```ts
type AskRankAuraIntent =
  | "current_priorities"
  | "completed_work"
  | "approvals"
  | "website_optimisation"
  | "keywords"
  | "competitors"
  | "content"
  | "reddit_community"
  | "local_seo"
  | "reviews_reputation"
  | "authority_backlinks"
  | "digital_pr"
  | "social_media"
  | "analytics"
  | "business_intelligence";

type AnswerSourceType =
  | "website_audit"
  | "keyword_research"
  | "competitor_monitoring"
  | "google_search_console"
  | "google_analytics"
  | "google_business_profile"
  | "review_monitoring"
  | "citation_monitoring"
  | "reddit_community_research"
  | "rank_tracking"
  | "content_plan"
  | "growth_plan"
  | "recent_activity"
  | "user_business_info";

type DataAvailability = "confirmed" | "inferred" | "incomplete" | "unavailable";

interface AskRankAuraQuestion {
  id: string;
  text: string;
  intent: AskRankAuraIntent;
}

interface AnswerSection {
  kind: "direct" | "found" | "doing" | "next_step";
  body: string;
}

interface AnswerSource {
  type: AnswerSourceType;
  availability: DataAvailability;
  label?: string; // plain-English source label for internal/debug; optional customer hint
}

type AskRankAuraActionKind =
  | "view_recommendation"
  | "review_fix"
  | "view_growth_plan"
  | "view_research"
  | "open_strategy"
  | "view_progress"
  | "approve_changes"
  | "connect_data_source";

interface AnswerAction {
  kind: AskRankAuraActionKind;
  label: string;
  href?: string;
}

interface AskRankAuraAnswer {
  questionId: string;
  questionText: string;
  directAnswer: string;
  sections?: AnswerSection[];
  sources: AnswerSource[];
  action?: AnswerAction;
  suggestedFollowUps?: string[];
}

interface SuggestedQuestion {
  id: string;
  text: string;
  intent: AskRankAuraIntent;
}

interface AskRankAuraData {
  heading: string;
  support: string;
  placeholder: string;
  suggestedQuestions: SuggestedQuestion[]; // max 4 displayed
  answersByQuestionId: Record<string, AskRankAuraAnswer>;
}
```

---

## 15. Initial prototype mock conversations (Phase B)

Deterministic mock using the **approved Workspace business scenario** (local service business; session personalisation when present; no demo-industry hard-coding).

### Required mock questions (minimum)

1. What is my biggest opportunity today?  
2. What has RankAura completed since my last visit?  
3. Which recommendations are waiting for approval?  
4. What have my competitors changed this week?  
5. What questions are customers asking online?  
6. Is there anything urgent I need to know?  
7. What content should I publish next?  
8. How can I improve my local visibility?  

### Required unavailable-data example

**Question:** Have my rankings improved?

**Answer:** Google Search Console is not connected yet, so I can’t confirm ranking changes. Once connected, I’ll monitor them and explain meaningful movement in plain English.

**Availability:** `google_search_console` → `unavailable`

---

## 16. Responsive behaviour

### Desktop

- Ask card sits in the same centred column as Workspace (`max-w-3xl` family)  
- Compact default height  
- Expanded answer panel scrolls internally if needed — must not push the page into an chat-app feel  

### Mobile

- Full-width card; comfortable input and submit touch targets  
- Suggested questions wrap cleanly (no horizontal scroll)  
- Expanded answer remains readable without excessive height  
- Does not dominate above Biggest Opportunity  

---

## 17. Accessibility

- Semantic heading for Ask RankAura (`h2` within Workspace hierarchy)  
- Labelled input (`aria-label` or visible label)  
- Submit button keyboard-accessible  
- Suggested questions as buttons (not inert chips)  
- Answer panel announced on expand (`aria-live="polite"` region)  
- Focus management: move focus to answer heading after submit  
- Adequate contrast on light canvas  
- Respect `prefers-reduced-motion`  

---

## 18. Future safety requirements (not Phase B)

Before any live AI or autonomous action integration:

- [ ] Grounding pipeline: every answer cites retrievable RankAura sources  
- [ ] Hallucination guardrails: block ungrounded claims about rankings, traffic, reviews, competitor events  
- [ ] Action safety spec: explicit approval gates for website changes, publishing, outreach  
- [ ] Connection-state matrix: per-source availability surfaced honestly  
- [ ] Audit log of questions and source IDs used (internal)  
- [ ] Rate limiting and abuse protection  
- [ ] No chain-of-thought exposure to customers  

---

## 19. Phase process

### Phase A — Specification ✅

- [x] Create `docs/ASK_RANKAURA_SPEC.md`
- [x] Update `docs/UI_BIBLE.md`
- [x] Update `docs/PRODUCT_GUARDRAILS.md`
- [x] Update `docs/SCREEN_LOCK_STATUS.md`
- [x] Jonathan approved Phase A

### Phase B — Prototype ✅ (pending screenshot approval)

- [x] Compact Workspace Ask RankAura card beneath greeting
- [x] Contextual suggested questions (max 4)
- [x] Expandable answer panel
- [x] Deterministic mock provider + types
- [x] Desktop + mobile screenshots
- [ ] Jonathan screenshot approval
- [x] Do **not** connect live AI or external services
- [x] Do **not** remove or redesign existing Workspace sections

---

## 20. Hard rules (summary)

Do **not**:

- Build a generic chatbot or floating support bubble  
- Create a huge chat window on the Workspace  
- Replace or redesign the approved Workspace sections  
- Invent business data in answers  
- Use ungrounded AI answers in production  
- Add live autonomous actions in the prototype  
- Add voice mode, avatars, or AI employee characters  
- Expose technical chain-of-thought  
- Start live API integration during the prototype phase  

---

## 21. Success criteria

Ask RankAura succeeds when:

- [ ] A non-technical business owner knows what to ask  
- [ ] Answers are clearly based on their own business  
- [ ] The customer understands what RankAura found  
- [ ] The customer understands what RankAura has already done  
- [ ] The customer knows whether any action is required  
- [ ] Missing data is explained honestly  
- [ ] The interface remains calm and compact  
- [ ] The customer feels supported rather than overwhelmed  
- [ ] Ask RankAura feels like a trusted growth adviser, not a chatbot  

---

## 22. Approval checklist (Jonathan)

### Phase A

- [x] Product purpose and philosophy accepted
- [x] Workspace insertion point (below greeting) accepted
- [x] Compact card + expandable answer approach accepted
- [x] Question categories and intent model accepted
- [x] Answer structure and tone accepted
- [x] Trust / data-availability rules accepted
- [x] Mock conversation set accepted
- [x] Ready for Phase B prototype

### Phase B

- [ ] Compact card screenshots accepted
- [ ] Expanded answer screenshots accepted
- [ ] Unavailable-data example accepted
- [ ] Fallback behaviour accepted
- [ ] Ready for live-provider phase (later)

---

**End of Ask RankAura specification.**
