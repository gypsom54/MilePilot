# Sprint D5 Delivery Report — Ask SEO AutoPilot

**Date:** 2026-07-30  
**Branch:** `cursor/seo-autopilot-sprint-d5-ask-seo-autopilot-6d57`  
**Status:** Complete — Sprint D6 not started  
**Locked predecessors:** Sprint D1–D4 — not redesigned

---

## Objective

Introduce Ask SEO AutoPilot as a calm conversational business assistant UI grounded in the existing mock Business Profile and Discovery Summary — **not** a messaging-app chatbot and **not** live Volume 3 orchestration.

---

## Important engineering boundary

This sprint delivers a **customer-facing mock Ask experience** only.

- No OpenAI / LLM integration
- No streaming
- No changes to `services/ask-autopilot` orchestration engine
- Volume 3 live orchestration remains deferred until a later approved engine sprint

---

## 1. Components created

| Component | Role |
| --- | --- |
| `SuggestedQuestions` | 6 context-aware suggested prompts |
| `AskComposer` | Plain question input (not a chat composer chrome) |
| `ConversationThread` | Session conversation list (adviser layout, not bubbles) |
| `AskAnswerCard` | Structured Answer / Why / Next step / Learn more |

---

## 2. Routes added

| Route | Screen |
| --- | --- |
| `/ask` | Ask SEO AutoPilot |

Navigation: Ask link added to header/mobile (minimal shell affordance only).

---

## 3. Mock conversation model

Files:

- `apps/web/src/content/ask.ts` — suggested questions, intents, turn types
- `apps/web/src/ask/mockAskResponder.ts` — typed mock answers using `MOCK_BUSINESS_PROFILE` + `MOCK_DISCOVERY_SUMMARY` (+ today’s priority from briefing mock)

---

## 4. State management

- `AskProvider` / `useAsk` — session-only conversation history (`turns[]`)
- `askQuestion(question, intentId?)` resolves mock answer immediately
- `clearConversation()` resets the visit
- No persistence / localStorage / backend

---

## 5. Validation

| Command | Result |
| --- | --- |
| `pnpm --filter @seo-autopilot/web typecheck` | Pass |
| `pnpm --filter @seo-autopilot/web build` | Pass |
| `pnpm run build:seo-autopilot` | Pass |
| `pnpm run test:seo-autopilot` | **86/86** pass |
| `npm run test:production-boot-syntax` | **6/6** pass |

Manual: open `/ask`, select a suggested question, receive structured answer naming Harbour View Plumbing / opportunities; free-text fallback works; history clears for the session.

---

## 6. Deferred functionality

- Volume 3 Ask orchestration engine
- Live engine evidence retrieval / conflict resolution
- LLM or streaming responses
- Auth, persistence, notifications
- Google integrations
- Sprint D6+

---

## 7. UX observations (recommendations only — not implemented)

1. **Entry from Workspace:** A “Ask about today’s priority” link from the D4 priority card would shorten the path; left unchanged to keep D4 locked.
2. **Learning Centre FAQ-pages article** (noted in D4) would improve the FAQ suggested-question “Learn more” target.
3. **Discovery session coupling:** Mock Ask always uses full discovery summary fixtures, even if `/discover` was not completed in-session. Live wiring should pass actual profile/summary from DiscoveryProvider.
4. **Nav density:** Four primary links (Home / Workspace / Ask / Learn) is still calm; avoid adding more without IA review.

---

## Rollback

Revert/close PR / delete branch `cursor/seo-autopilot-sprint-d5-ask-seo-autopilot-6d57`.
