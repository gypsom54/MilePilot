# Settings Screen UI Lock

**Status:** 🔒 **UI LOCKED** — Officially frozen (2 July 2026)  
**Component:** `#settings` `.screen` — premium control centre  
**Version locked:** v8.43.26 (final)

> **Rule:** No visual changes. No wording changes. No spacing tweaks. Revisit only if users are confused during testing, or a new feature genuinely requires another setting.

**Related docs:**
- [UI_LOCK_DASHBOARD.md](./UI_LOCK_DASHBOARD.md) — visual standard
- [UI_LOCK_NAVIGATION.md](./UI_LOCK_NAVIGATION.md) — bottom navigation dock
- [MILEPILOT_UI_LOCK.md](./MILEPILOT_UI_LOCK.md) — screen status board

---

## Freeze policy

Settings is a **premium control centre**, not a technical configuration page.

### Card order (locked)

1. **Tracking Mode** (hero) — 🚀
2. **Email Reports** — 📧
3. **Vehicle** — 🚗
4. **Automatic Tracking** (checklist, AutoPilot only) — ⚡
5. **Business Details** — 👤
6. Beta Feedback (compact)
7. Reset / clear (compact)

### Locked copy

| Card | Content |
| --- | --- |
| Tracking Mode | Hero: mode line, lead, description; Change → retained |
| AutoPilot lead | You're using MilePilot's smartest tracking mode. |
| AutoPilot desc | Automatically detects journeys and prepares your mileage reports. |
| AutoPilot reassure | You can switch to Manual Tracking anytime. |
| Mode row label | Current Mode |
| Email Reports | Your mileage reports are automatically emailed after each completed business shift. |
| Vehicle value | Car (icon only — no duplicate emoji in text) |
| Vehicle desc | Used for HMRC mileage calculations. |
| Automatic Tracking | ✓ Location · ✓ Notifications · ✓ Email Reports · ✓ Auto End Trip |
| Business Details | Experience + Business Type (renamed from Work Type) |

### Card hierarchy

| Tier | Class | Use |
| --- | --- | --- |
| Hero | `settings-card--hero` | Tracking Mode |
| Medium | `settings-card--medium` | Email, Vehicle, Auto tracking, Business |
| Compact | `settings-card--compact` | Beta, reset actions |

### Not allowed

- New settings features (AI Assistant, Subscription UI)
- Logic changes to tracking, permissions, or reports
- Reverting to paragraph-heavy autopilot copy
- Developer-facing copy in user-visible cards (debug panel excepted)

### Allowed

- Displaying live checklist state from existing stored values
- Bug fixes for safe-area or scroll

---

## Agent checklist

Before editing `#settings`:

- [ ] Is this a genuine layout/safe-area bug? If no → stop.
- [ ] Am I changing tracking, permissions, or report logic? If yes → stop.
- [ ] Does card order and hierarchy still match this doc?
