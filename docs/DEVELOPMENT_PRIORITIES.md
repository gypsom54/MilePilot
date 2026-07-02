# Development Priorities — Post-Onboarding

**Effective:** 2026-06-29  
**Onboarding:** Frozen and production-ready. See [ONBOARDING_V1_LOCK.md](./ONBOARDING_V1_LOCK.md).

Every development sprint from this point onward should prioritise the following, in order:

## 1. Background mileage reliability

- Consistent GPS capture while the phone is locked or the app is backgrounded
- Native Always-location permission flow and settings deep-link
- Trip persistence, recovery after app kill, and regression coverage

## 2. AutoPilot behaviour

- Shift start/stop, stop detection, and auto-end trip logic
- Mode switching (manual vs AutoPilot) without data loss
- Reliable handoff between foreground UI and native tracking engine

## 3. Journey classification

- Business vs personal assignment accuracy
- End-of-day review flow and pending-journey queue
- User overrides that feed back into learning signals

## 4. AI learning engine

- MIE (MilePilot Intelligence Engine) confidence and route memory
- Working-hours and customer-pattern detection
- Explainability and audit-friendly classification reasons

## 5. Report generation

- HMRC-ready PDFs and share flows
- Daily / weekly / monthly report schedules
- Business-only reports gated on review completion

## 6. Overall app stability

- Stabilisation checklists, vital tests, and release verification
- Crash-free sessions, performance, and beta feedback loops
- No scope creep into frozen UI unless a genuine bug is reported

---

**Out of scope unless bug fix:** onboarding redesign, copy polish, or spacing tweaks on `#knowYou` (MP-002).
