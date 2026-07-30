# Engineering Guardrails — SEO AutoPilot Product Delivery

**Date:** 2026-07-30  
**Applies to:** All SEO AutoPilot customer-product and engine delivery sprints in this repository  

Also respect:

- `docs/seo-autopilot/PLATFORM_ARCHITECTURE_AUDIT.md` (baseline — no foundation redesign sprint)
- MilePilot critical locks in `docs/CRITICAL_FILES.md` and `docs/MP-*` when touching MilePilot paths
- Ask SEO AutoPilot lock in `docs/seo-autopilot/ASK_SEO_AUTOPILOT.md` / Volume 3

---

## Delivery process lock

1. Inspect  
2. Document  
3. Plan  
4. Approve  
5. Build **one** contained sprint  
6. Test  
7. Review  
8. Lock  
9. Move to the next sprint  

---

## Hard rules

- **Preserve working behaviour** — especially MilePilot production and passing SEO engine suites.  
- **One sprint, one objective.**  
- **No bulk rewrites** and no speculative redesigns.  
- **No silent visual redesigns** of locked MilePilot surfaces.  
- **No unnecessary dependencies**; do not install/upgrade packages “because modern.”  
- **Full file replacement only** when a file is deliberately rewritten in the approved sprint.  
- **No placeholder logos.**  
- **No invented product names** — use repository-established names; document inconsistencies instead of “fixing” branding in code.  
- **No fake integrations** and **no mock success states presented as real** (especially Google “connected”, Ask answers, health scores).  
- **No placeholder experiences that look complete** without real behaviour.  
- Validate with **typecheck/build**, **existing tests**, and **production build** where applicable; add lint when a linter is introduced deliberately.  
- **Mobile and desktop** must both be considered.  
- **Accessibility must be maintained.**  
- Customer language must remain **plain and reassuring**.  
- **Internal technical language must not appear** in standard customer-facing screens (no engine names, graph jargon, raw SEO issue dumps).  
- Risky or irreversible actions require **customer approval**.  
- Safe monitoring may occur quietly.  
- Automation must **never remove customer control**.  
- All recommendations must explain **what**, **why**, and **next**.  
- **No fear-based issue presentation.**  
- **Never display hundreds of issues** when a prioritised top three will serve better.  
- **Do not invent APIs, credentials, or backend capabilities** that do not exist.  
- **Do not claim something works unless tested.**  
- **Do not implement Ask SEO AutoPilot** until Volume 3 is explicitly unlocked by an approved sprint.  
- **Do not open a foundation refactor sprint** unless a future architecture checkpoint proves a genuine Bible violation.

---

## Product experience rules

Visual tone: calm, premium, minimal, modern, spacious, reassuring, consistent.

Avoid: cluttered dashboards, dense tables, technical SEO jargon, excessive charts, animated typing, artificial AI effects, neon-heavy UI, anxiety gamification, red warnings unless genuinely urgent.

Every important screen: understandable in under one minute; **one primary purpose**.

---

## Growth framework language

Customer explanations should map work into:

1. Strong Foundations  
2. Visibility  
3. Acceleration  
4. Reputation  
5. Sustainable Growth  

Google Ads guidance must stay optional and balanced — never “more spend is always better.”
