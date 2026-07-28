# Product Specs

Formal specifications aligned with the **[locked Roadmap](./Roadmap.md)**. Reference these in PRs.

---

## PS-001 — Brand Identity

**Status:** ✅ Complete  
**Sprint:** 1

### Objective
Establish the Pulse identity — premium, calm, unmistakable.

### Delivered
- Launch animation (heartbeat → PULSE)
- `PulseLogo`, `PulseBackground`, `PulseGlow`
- Design tokens: `PulseColors`, `PulseTypography`, `PulseTheme`
- Tagline: *Keep your finger on the Pulse.*

### Out of scope
Dashboard, inventory, settings

---

## PS-002 — Architecture & Foundation

**Status:** ✅ Complete  
**Sprint:** 2

### Objective
Build the foundation every future sprint depends on.

### Delivered
- Flutter project structure (`lib/core`, `lib/widgets`, `lib/screens`)
- JSON conversation engine + onboarding scripts
- `PulseMotion` animation system
- Reusable component library
- Documentation folder (`/docs`)
- Test infrastructure

### Out of scope
Feature screens beyond onboarding shell

---

## PS-003 — Perfect First Impression

**Status:** 🔨 In progress  
**Sprint:** 3 — **Next**

### Objective
Make the first 90 seconds unforgettable. Polish only.

### Requirements
- Cinematic launch timing (+500ms heartbeat hold, logo breathe)
- Human typewriter (variable speed, natural pauses)
- Premium input (`PulseTextField`)
- Micro-interactions on buttons and focus
- Slower, flowing transitions
- Copy polish per [Copy Bible](./Copy-Bible.md)

### Out of scope
New features, inventory, settings, calculators, home dashboard

### Success criteria
Users pause before pressing Continue. They smile. They feel welcomed.

---

## PS-004 — Welcome Home Experience

**Status:** ⏳ Next  
**Sprint:** 4

### Objective
Arriving home — not a dashboard.

### Requirements
- Brain-driven personalised greeting
- Four glass cards: Cabinet, Discovery, Journal, Pulse
- Primary CTA: *Add your first research item*
- Five-tab navigation: Home · Cabinet · Learn · Journal · Pulse
- No statistics, charts, or clutter

### Out of scope
Real cabinet data, learning content, journal entries

### Success criteria
Users feel they have arrived somewhere calm and personal.

---

## PS-005 — Research Cabinet

**Status:** ⏳ Planned  
**Sprint:** 5

### Objective
First real data feature — organise research items.

### Requirements
- Add, view, edit research items
- Cabinet tab becomes functional
- Brain remembers favourite compounds

---

## PS-006 — Knowledge Hub

**Status:** ⏳ Planned  
**Sprint:** 6

### Objective
Learning and discovery surface.

### Requirements
- Learn tab becomes functional
- Brain-driven learning recommendations
- Favourite learning type personalisation

---

## PS-007 — Journal Timeline

**Status:** ⏳ Planned  
**Sprint:** 7

### Objective
Research journal — continue the journey.

### Requirements
- Journal tab becomes functional
- Timeline of research activity
- Streak and milestone integration

---

## PS-008 — Pulse Brain

**Status:** ⏳ Planned (early build in codebase)  
**Sprint:** 8

### Objective
Decision engine — remembers context, recommends UI copy. **Not AI.**

### Requirements
- Remember: name, onboarding, learning type, reminders, milestones, streaks, compounds
- Context-aware greetings (morning, evening, birthday, anniversary)
- Recommendations to UI — never hardcoded widgets
- `PulseAdvisoryLayer` hook for future AI

### Note
Foundation code exists ahead of schedule. Sprint 8 completes, tests, and officially ships Brain.

---

## PS-009 — Smart Inventory Engine

**Status:** ⏳ Planned  
**Sprint:** 9

### Objective
Intelligent inventory predictions and management.

### Requirements
- Inventory prediction logic in Brain
- Low-stock awareness
- Notification timing integration

---

## PS-010 — Pulse Pro & Store Integration

**Status:** ⏳ Planned  
**Sprint:** 10

### Objective
Premium tier and app store billing.

### Requirements
- Pulse Pro feature gating
- App Store / Play Store subscription integration
- Pro onboarding and upgrade flow

---

## Spec template

```markdown
## PS-XXX — Title

**Status:** ⏳ Planned | 🔨 In progress | ✅ Complete
**Sprint:** N (from locked Roadmap)

### Objective
One sentence.

### Requirements
- Bullet list

### Out of scope
- What we are NOT building

### Success criteria
How we know it's done.
```
