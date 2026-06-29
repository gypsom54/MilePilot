# Roadmap

**🔒 Locked.** This is the canonical sprint plan. Do not reorder sprints without founder approval.

Optimise for delight, not speed.

---

## Our Roadmap (Locked)

| Sprint | Objective | Status |
|--------|-----------|--------|
| ✅ Sprint 1 | Brand Identity | Complete |
| ✅ Sprint 2 | Architecture & Foundation | Complete |
| 🔨 Sprint 3 | Perfect First Impression | **Next** |
| ⏳ Sprint 4 | Welcome Home Experience | Next |
| ⏳ Sprint 5 | Research Cabinet | Planned |
| ⏳ Sprint 6 | Knowledge Hub | Planned |
| ⏳ Sprint 7 | Journal Timeline | Planned |
| ⏳ Sprint 8 | Pulse Brain | Planned |
| ⏳ Sprint 9 | Smart Inventory Engine | Planned |
| ⏳ Sprint 10 | Pulse Pro & Store Integration | Planned |

---

## Sprint definitions

### ✅ Sprint 1 — Brand Identity
Launch animation, PULSE wordmark, design tokens, reusable brand widgets.  
**Spec:** [PS-001](./Product-Specs.md#ps-001--brand-identity)

### ✅ Sprint 2 — Architecture & Foundation
Flutter project structure, conversation engine, motion system, documentation, component library.  
**Spec:** [PS-002](./Product-Specs.md#ps-002--architecture--foundation)

### 🔨 Sprint 3 — Perfect First Impression
Polish the first 90 seconds until unforgettable. Launch timing, typewriter humanity, input delight, transitions. No new features.  
**Spec:** [PS-003](./Product-Specs.md#ps-003--perfect-first-impression)

### ⏳ Sprint 4 — Welcome Home Experience
Arriving home — not a dashboard. Glass cards, Brain-driven greetings, five-tab nav.  
**Spec:** [PS-004](./Product-Specs.md#ps-004--welcome-home-experience)

### ⏳ Sprint 5 — Research Cabinet
First real data feature. Organise research items.

### ⏳ Sprint 6 — Knowledge Hub
Learning and discovery surface.

### ⏳ Sprint 7 — Journal Timeline
Research journal experience.

### ⏳ Sprint 8 — Pulse Brain
Decision engine — remembers context, recommends UI copy. Not AI.  
**Spec:** [PS-008](./Product-Specs.md#ps-008--pulse-brain)

### ⏳ Sprint 9 — Smart Inventory Engine
Intelligent inventory predictions and management.

### ⏳ Sprint 10 — Pulse Pro & Store Integration
Premium tier and store billing.

---

## Current focus

**Sprint 3 — Perfect First Impression**

Make the first 90 seconds feel unforgettable. Polish only — no new features, no inventory, no settings.

---

## Implementation notes

Some work exists in the codebase **ahead of the locked sprint schedule**. This is fine — sprints define *product focus*, not git history. When a planned sprint arrives, refine and ship officially rather than re-building.

| Locked sprint | Codebase status |
|---------------|-----------------|
| Sprint 3 | Partial — launch polish, typewriter, motion in progress |
| Sprint 4 | Early build exists — `HomeScreen`, `PulseShell`, glass cards |
| Sprint 8 | Early build exists — `PulseBrain`, engines, persistence |

Do not skip sprint goals. Complete each sprint properly before moving on.

---

## Principles (every sprint)

1. Do not add features outside the sprint objective
2. Perfect the experience before adding functionality
3. Update [Product Specs](./Product-Specs.md) and this file
4. Update documentation in the same PR
5. No hardcoded copy in widgets — Brain or Copy Bible

---

## North star

Users open Pulse and think:

> *"This is different."*

They feel **more organised**, **more informed**, and **more confident** — without trying.

---

## How to update this file

At sprint completion only (with founder sign-off on locked plan):

1. Change sprint status: `Next` → `Complete`
2. Set the following sprint to `Next` / `🔨`
3. Update Product Specs delivered section
4. One line on what shipped

**Do not reorder the locked table.**
