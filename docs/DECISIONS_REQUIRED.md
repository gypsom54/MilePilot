# Decisions Required — SEO AutoPilot Delivery

**Date:** 2026-07-30  
**Rule:** Only genuine blockers that cannot be resolved from the repository alone.

---

## Decision 1 — Where does the SEO AutoPilot customer UI live?

**Status:** **DECIDED** — Option A (`apps/web`). Implemented in Sprint D1 (**DONE**).

**Why it matters:** There is no SEO AutoPilot customer app today. `apps/web` is scaffold-only; MilePilot `frontend/` is a different product; `rankaura-web/` is an untracked Next build without source.

**Options:**

| Option | Description |
| --- | --- |
| A | Build SEO AutoPilot UI in `apps/web` (recommended monorepo home) |
| B | Build a new top-level app folder (e.g. `seo-autopilot-web/`) |
| C | Attempt to revive RankAura from external source (if it exists outside this repo) |

**Recommended:** **A — `apps/web`**, keeping `@seo-autopilot/*` cohesion and avoiding MilePilot PWA entanglement.

**Consequences:**

- A: Clean boundary; needs framework choice (Decision 2).  
- B: Clearer product separation; more repo sprawl.  
- C: Fast visual start only if source is recovered; branding conflict (RankAura vs SEO AutoPilot); currently **not possible from this repo alone**.

**Blocks development?** **Yes** — Phase 1 cannot start without a home for the UI.

---

## Decision 2 — UI framework for SEO AutoPilot customer app

**Status:** **DECIDED** — Option A (React + Vite). Implemented in Sprint D1 (**DONE**).

**Why it matters:** MilePilot UI is vanilla HTML/JS; RankAura remnant suggests Next/React; `apps/web` has no UI framework dependency today.

**Options:**

| Option | Description |
| --- | --- |
| A | React + Vite SPA in `apps/web` |
| B | Next.js App Router in `apps/web` (or adjacent app) |
| C | Vanilla HTML/JS like MilePilot |

**Recommended:** **A — React + Vite** for a contained product shell with simpler hosting than Next, unless SSR/SEO for marketing pages is required inside the app.

**Consequences:**

- A: Fast product UI; separate marketing site can remain static.  
- B: Better if app pages must be publicly indexable; heavier.  
- C: Matches MilePilot skills; weaker component ecosystem for adviser UI.

**Blocks development?** **Yes** for Phase 1 implementation.

---

## Decision 3 — When may Ask SEO AutoPilot be implemented?

**Status:** **DECIDED** — Option A (keep Volume 3 lock). Ask remains deferred after Sprint D1.

**Why it matters:** Product planning wants Ask as the front door; Engineering Bible Volume 3 **locks** implementation.

**Options:**

| Option | Description |
| --- | --- |
| A | Keep lock; ship MVP Home + Learning + Profile first (recommended) |
| B | Unlock Volume 3 now with an explicit approved sprint |
| C | Build a non-orchestrated chatbot “preview” |

**Recommended:** **A** — honour the lock; do not ship C (violates “no fake behaviour”).

**Consequences:**

- A: Honest MVP; Ask later as true front door.  
- B: Unlocks planned experience earlier; requires orchestration design capacity.  
- C: Forbidden by delivery philosophy.

**Blocks development?** **Blocks Ask only** — not Phase 1–2.

---

## Decision 4 — Branding posture while names coexist

**Status:** **DECIDED** — Option A (customer UI labels **SEO AutoPilot**; MilePilot untouched; RankAura ignored).

**Why it matters:** Repository contains MilePilot (shipped), SEO AutoPilot (engines/docs), RankAura (untracked build).

**Options:**

| Option | Description |
| --- | --- |
| A | Customer UI labels **SEO AutoPilot**; leave MilePilot untouched; ignore RankAura until source/brand decision (recommended) |
| B | Rebrand everything immediately |
| C | Ship RankAura name in the new UI |

**Recommended:** **A** — document inconsistency; no rename sprint.

**Blocks development?** **No** if A is accepted.

---

## Decision 5 — Persistence for Version One demos

**Status:** **DECIDED for Sprint D1 only** — Option A (in-memory acceptable for visual foundation). Not approved as production persistence architecture.

**Why it matters:** Engines are in-memory; profiles will reset on process restart.

**Options:**

| Option | Description |
| --- | --- |
| A | Accept in-memory for Version One with honest UI copy (recommended to start) |
| B | Add durable DB before any UI |
| C | localStorage-only UI persistence without engines |

**Recommended:** **A** short-term; plan B as a later explicit sprint.

**Consequences:**

- A: Unblocks UI learning; not multi-tenant production.  
- B: Slower start; better production path.  
- C: Diverges from engine source of truth.

**Blocks development?** **No** for Phase 1–2 if A accepted.

---

## Decision 6 — Google connector timeline

**Why it matters:** GSC/GA/GBP/Ads are in the vision but have **zero** OAuth/API implementation.

**Options:**

| Option | Description |
| --- | --- |
| A | Defer all Google connections until after MVP shell + profile + learning (recommended) |
| B | Start OAuth scaffolding immediately in parallel |

**Recommended:** **A**.

**Blocks development?** **Blocks Phases 7–8 only.**

---

## Resolved from repository (no owner question needed)

- Do not modify MilePilot tracking/report critical paths for SEO work.  
- Do not treat `rankaura-web/.next` as application source.  
- Do not implement Ask orchestration without Volume 3 unlock.  
- SEO AutoPilot engines Sprints 1–5 are the intelligence foundation to consume.  
- No foundation refactor sprint (baseline architecture audit decision).
