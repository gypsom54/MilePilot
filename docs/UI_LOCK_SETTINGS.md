# Settings Screen UI Lock

**Status:** 🔒 **UI LOCKED** — Officially frozen (2 July 2026)  
**Component:** `#settings` `.screen` — premium control centre  
**Version locked:** v8.43.27 (final)

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

### Card header pattern (locked)

Every medium and hero card uses the same three-line header structure:

| Line | Role | Style |
| --- | --- | --- |
| 1 | Section title (uppercase) | `settings-card-title` + icon |
| 2 | Value / mode name | `settings-value-line` or `settings-hero-mode` |
| 3 | Supporting copy | `settings-value-desc`, `settings-hero-lead`, or checklist rows |

Examples: **Tracking Mode** → AutoPilot · **Email Reports** → Automatic Reports · **Vehicle** → Car · **Business Details** → driver name.

### Locked copy

| Card | Content |
| --- | --- |
| Tracking Mode | Hero: TRACKING MODE → mode line → lead → description; Change → retained |
| AutoPilot lead | You're using MilePilot's smartest tracking mode. |
| AutoPilot desc | Automatically detects journeys and prepares your mileage reports. |
| AutoPilot reassure | You can switch to Manual Tracking anytime. |
| Mode row label | Current Mode |
| Email Reports value | Automatic Reports (Manual Reports in manual mode) |
| Email Reports desc | Your mileage reports are automatically emailed after each completed business shift. |
| Vehicle value | Car (icon only — no duplicate emoji in text) |
| Vehicle desc | Used for HMRC mileage calculations. |
| Automatic Tracking value | All set / Review items below (from checklist state) |
| Automatic Tracking | ✓ Location · ✓ Notifications · ✓ Email Reports · ✓ Auto End Trip |
| Business Details value | Driver name |
| Business Details rows | Experience + Business Type |

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
- Bug fixes for safe-area or scroll (genuine usability issues only)

---

## Post-launch backlog (do not build in Phase 1)

| Item | Notes |
| --- | --- |
| **App Version** section | e.g. *MilePilot v1.0.0 · Built for UK self-employed drivers.* — confidence signal; reserve UI slot when ready |
| AI Assistant | Settings entry — future |
| Subscription | Settings entry — future |

---

## Phase 1 milestone

Settings completes the core customer-journey UI foundation alongside Welcome, Personalisation, Vehicle, Tracking Mode, Permissions, Email Reports, Success, Dashboard, and Navigation.

**Next engineering focus (not UI):** rock-solid mileage tracking · reliable background behaviour · professional reports · AI learning.

Before editing `#settings`:

- [ ] Is this a genuine layout/safe-area bug? If no → stop.
- [ ] Am I changing tracking, permissions, or report logic? If yes → stop.
- [ ] Does card order and hierarchy still match this doc?
