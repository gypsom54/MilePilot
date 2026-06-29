# Product Specs

Formal specifications for Pulse features. Reference these in PRs and sprint work.

---

## PS-001 — Launch Experience

**Status:** ✅ Shipped  
**Sprint:** 1

### Objective
Perfect the first 60 seconds. Launch animation + onboarding.

### Delivered
- Cinematic launch (~5.2s): black → dot → heartbeat → PULSE → tagline → fade
- Onboarding name capture
- Personalised welcome conversation
- Reusable widgets: Logo, Typewriter, Button, Background, Glow, Transition

### Out of scope
Dashboard, inventory, settings, calculators

---

## PS-002 — Conversation Polish

**Status:** ✅ Shipped  
**Sprint:** 3

### Objective
Polish the first 90 seconds. Human typewriter, cinematic launch refinements.

### Delivered
- JSON conversation engine
- Variable typing speed + natural pauses
- Slower launch timing (+500ms heartbeat hold, logo breathe)
- `PulseTextField` premium input
- Motion system (`PulseMotion`)

---

## PS-003 — Pulse Brain

**Status:** ✅ Shipped  
**Sprint:** Brain

### Objective
Decision engine — remembers context, recommends UI copy. Not AI.

### Delivered
- `PulseBrain` with memory persistence
- `GreetingEngine`, `HomeRecommendationEngine`
- No hardcoded greetings in widgets
- `PulseAdvisoryLayer` hook for future AI

### Memory
Name, onboarding choices, learning type, reminders, milestones, streaks, favourite compounds, birthday, join date

---

## PS-004 — Welcome Home Experience

**Status:** ✅ Shipped  
**Sprint:** 4

### Objective
Arriving home — not a dashboard.

### Delivered
- Personalised headline from Brain
- Four glass cards (Cabinet, Discovery, Journal, Pulse)
- Primary CTA: "Add your first research item"
- Five-tab bottom navigation
- No statistics, charts, or clutter

---

## PS-005 — Welcome Conversation (planned)

**Status:** ⏳ Planned  
**Sprint:** 2

Extended onboarding conversation flow beyond name capture.

---

## PS-006 — Personalisation Journey (planned)

**Status:** ⏳ Planned  
**Sprint:** 3 (roadmap)

Learning preferences, reminder setup, favourite compounds seed.

---

## PS-007 — Research Cabinet (planned)

**Status:** ⏳ Planned  
**Sprint:** 5

Smart inventory — first real data feature.

---

## PS-008 — Knowledge Hub (planned)

**Status:** ⏳ Planned  
**Sprint:** 6

Learning and discovery surface.

---

## PS-009 — Journal Timeline (planned)

**Status:** ⏳ Planned  
**Sprint:** 7

Research journal experience.

---

## PS-010 — Research Co-Pilot (planned)

**Status:** ⏳ Planned  
**Sprint:** 8

Pulse assistant — future AI integration via `PulseAdvisoryLayer`.

---

## PS-011 — Pulse Pro (planned)

**Status:** ⏳ Planned  
**Sprint:** 10

Premium tier.

---

## Spec template

When adding a new spec, include:

```markdown
## PS-XXX — Title

**Status:** ⏳ Planned | 🔨 In progress | ✅ Shipped
**Sprint:** N

### Objective
One sentence.

### Requirements
- Bullet list

### Out of scope
- What we are NOT building

### Success criteria
How we know it's done.
```
