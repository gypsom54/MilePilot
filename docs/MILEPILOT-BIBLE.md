# The MilePilot Bible

**Status:** 🔒 Constitution — June 2026  
**Audience:** Developers, designers, marketers, investors, future employees  
**Rule:** If it's not in here, it isn't MilePilot.

---

## Related documents

| Doc | Role |
|-----|------|
| [MILEPILOT-DESIGN-BIBLE.md](./MILEPILOT-DESIGN-BIBLE.md) | **UI & copy checklist for every new screen** |
| [MILEPILOT-BRAND-SYSTEM-v1.0.md](./MILEPILOT-BRAND-SYSTEM-v1.0.md) | Visual identity & tokens |
| [brand/COMPONENT-SPECS.md](./brand/COMPONENT-SPECS.md) | Component implementation refs |
| [DESIGN_LOCKED.md](./DESIGN_LOCKED.md) | Frozen app screens |
| [ONBOARDING_V1_LOCK.md](./ONBOARDING_V1_LOCK.md) | Frozen knowYou onboarding |

---

## 1. North star

### The promise

> **Your business. On AutoPilot.**

Every product, screen, email, report, and marketing line must reinforce this.

We do **not** sell GPS. We sell **peace of mind** — less admin, fewer lost miles, calm confidence that the records are handled.

### Mission

Help self-employed professionals run their business with less admin — starting with mileage, expanding to the full AutoPilot OS.

### Vision (AutoPilot OS)

Mileage is Version 1. The long arc:

```
Mileage → Expenses → Receipts → Tax → Invoices → AI → Accountant exports
```

One calm interface. One trust layer. One brand.

### What we are not

- A spreadsheet with a map
- A noisy fleet tracker
- A feature dump for accountants only
- A product that asks users to think about mileage all day
- A hardware-dependent tracker (no beacons, tags, or accessories — ever)

See [NO-HARDWARE-PHILOSOPHY.md](./NO-HARDWARE-PHILOSOPHY.md).

---

## 2. Core problem

Self-employed people lose money and time because:

- Business miles are forgotten or under-recorded
- Admin piles up at tax time
- Existing tools feel technical, cold, or overwhelming

MilePilot removes that burden **quietly**.

---

## 3. Product principles

Before any feature ships, answer **yes** to all:

1. Does this make running a small business **easier**?
2. Does it **reduce admin** (not add it)?
3. Does it feel **calm** within 3 seconds?
4. Can Tracker users stay uncluttered?
5. Does it reinforce **Your business. On AutoPilot.**?

If any answer is **no** — rethink.

### No hardware — ever 🔒

MilePilot will **never** require Bluetooth beacons, iBeacons, vehicle tags, car accessories, or external GPS devices.

**Only:** Install → enable permissions once → AutoPilot → drive normally.

Full policy: [NO-HARDWARE-PHILOSOPHY.md](./NO-HARDWARE-PHILOSOPHY.md).

Our competitive advantage is **simplicity** — not gadget ecosystems.

### AutoPilot Intelligence

Instead of hardware, software signals determine the workday:

- Motion activity · Background GPS · Speed · Stationary detection
- Driver Intelligence · Learned routines · Start/end locations · Typical working hours
- **User confirmations** (business vs personal)

The user should never need to remember to start tracking, stop tracking, buy hardware, or pair Bluetooth devices. MilePilot works quietly in the background.

### AI policy

- **Suggest, never decide** — the user confirms business vs personal
- AI assists review and reporting; it does not silently change records
- No jargon in user-facing AI copy

### Reporting policy

- Reports exist when needed — not after every trip
- Custom date ranges for real-life periods (not only calendar weeks)
- Only **reviewed business** journeys in official reports
- PDF = premium proof; email = quick summary

---

## 4. Brand

**Full visual system:** [MILEPILOT-BRAND-SYSTEM-v1.0.md](./MILEPILOT-BRAND-SYSTEM-v1.0.md) — tokens, pulse, route, hero moment, platform rules.

### Message hierarchy (locked)

| Level | Copy |
|-------|------|
| Primary | Stop thinking about mileage. |
| Secondary | Your business. On AutoPilot. |
| Legacy | Drive • Track • Claim — footer/transitional only |

### Wordmark

**Mile** <span style="color:#0D6BFF">Pilot</span> — system UI, weight 700, letter-spacing -0.04em

### Tagline (secondary — emotional centre)

**Your business. On AutoPilot.**

Legacy line (PDF footer / transitional): *Drive • Track • Claim* — retire when all assets updated.

### Colours

| Token | Hex | Use |
|-------|-----|-----|
| Navy | `#031126` | Background, headers |
| Panel | `#0B2348` | Cards, depth |
| Blue | `#0D6BFF` | Accent, pulse, CTAs |
| Muted | `#B9C8DD` | Secondary text |
| Soft text | `#9FB4D0` | Labels |
| Green | `#20D781` | Success, live GPS |
| Amber | `#F0C35A` | Pending / attention |

### Typography

- **Font:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`
- **Headlines:** 34–42px, weight 700, tight tracking
- **Body:** 15–16px, weight 500, line-height 1.45
- **Labels:** 11–13px, uppercase, letter-spacing 0.08–0.12em, blue-muted

### Motion

- Ease: `cubic-bezier(.22, 1, .36, 1)`
- Brand pulse: alive glow 4s loop; welcome sweep once
- Respect `prefers-reduced-motion`
- Buttons: subtle scale 0.985 on press — never bouncy

### Spacing

- Screen padding: 22–24px horizontal, 108px bottom (nav clearance)
- Card radius: 24px
- Button radius: 16–18px
- Section gaps: 16–28px — when in doubt, add air

---

## 5. Tone of voice

| Do | Don't |
|----|-------|
| Calm, confident, minimal | Technical GPS jargon |
| Benefit-first | Feature lists |
| "Your records are ready" | "Configure reporting module" |
| Short sentences | Paragraphs |
| Professional warmth | Hype or exclamation overload |

**Examples**

- ✅ "Your business mileage is ready."
- ❌ "GPS tracking engine initialised."

---

## 6. Experiences (pricing architecture)

### MilePilot Tracker — £5.99/mo (target)

- Automatic mileage tracking
- GPS routes
- HMRC estimates
- PDF + email reports
- History
- Custom date range reports

**Zero clutter.** No business-expense UI.

### MilePilot Business — £9.99/mo (target)

Everything in Tracker, plus (future):

- Expenses, receipts, tax estimates
- Accountant exports, income tracking
- Business dashboard, AI assistant

**Gate behind `canAccessFeature()`** — never overwhelm Tracker users.

---

## 7. Screen standards (3-second test)

Every screen must answer within 3 seconds: *"What is this?"* and *"What do I do?"*

| Screen | Purpose | Primary action |
|--------|---------|----------------|
| Welcome | Stop thinking about mileage | Enter name |
| Know You | Vehicle for HMRC rate | Select vehicle |
| Experience | Tracker vs Business | Choose one |
| Business Profile | Work type terms | Select profession |
| Promise | Trust + AutoPilot promise | Get started |
| Permissions | Quiet background recording | Enable location |
| Notifications | Automatic reports | Enable / skip |
| Dashboard | Today's business miles | Start shift |
| Tracking | Live shift | End shift |
| Review Day | Confirm business trips | Review & classify |
| Reports | Records + PDFs | View / generate |
| History | Past shifts | Browse |
| Settings | Profile + reports prefs | Save |

See [PHASE-1-UX-AUDIT.md](./PHASE-1-UX-AUDIT.md) for polish notes.

---

## 8. Onboarding copy (benefits, not features)

Under 15 words per beat. See [marketing/ONBOARDING-COPY.md](./marketing/ONBOARDING-COPY.md).

1. Stop thinking about mileage.
2. MilePilot quietly records your journeys.
3. Review your day.
4. Receive professional mileage reports automatically.
5. **Your business. On AutoPilot.**

---

## 9. Notifications

- Remind, don't nag
- Shift start optional
- Report delivery: user-chosen frequency (daily / weekly / monthly)
- Copy always ties to **records ready**, not GPS status

---

## 10. Reports & PDF

- **Period reports:** daily, weekly, monthly
- **Custom date range:** any start/end; reviewed business only
- **PDF:** magazine layout, brand header, journey timeline, HMRC block
- **Email:** 30-second preview + PDF attachment
- Pending journeys excluded with clear notice

---

## 11. Driver Intelligence

- Suggest patterns; user confirms
- Shown on dashboard when calm (not during active tracking)
- Never blocks core tracking flow
- **Phone-only signals** — motion, GPS, speed, stationary detection, routines, locations, working hours (see [NO-HARDWARE-PHILOSOPHY.md](./NO-HARDWARE-PHILOSOPHY.md))
- Goal: reduce manual start/stop; never require hardware

---

## 12. Beta feedback (product roadmap)

Every beta tester answers:

1. Did MilePilot miss any journeys? **YES / NO**
2. Did you trust the mileage? **YES / NO**
3. Was reviewing your day easy? **YES / NO**
4. Would you pay £6.99/month? **YES / NO**
5. What annoyed you? *(free text)*

That free-text field **is** the roadmap.

---

## 13. Engineering conventions

- **Frontend:** `frontend/index.html` + `frontend/js/*`
- **Backend:** Railway — reports, PDF, email
- **Deploy:** Cloudflare `milepilot-app` — full folder upload every release
- **Version:** `APP_VERSION` in `index.html` + `version.txt` must match
- **Branches:** `cursor/<name>-4c0e`
- **Locked design:** [DESIGN_LOCKED.md](./DESIGN_LOCKED.md) — refine, don't redesign
- **Vision:** [VISION_LOCK.md](./VISION_LOCK.md)

---

## 14. Marketing

Full package: [marketing/](./marketing/)

- **Website v1.0:** [website/](../website/) — Apple-style launch page
- Homepage & landing copy
- App Store listing
- FAQ, welcome emails
- 90s explainer video script
- Screenshot & preview storyboard

**Sell peace of mind, not GPS.**

---

## 15. Decision filter (daily use)

When discussing any idea, ask:

> "Does this make running a small business easier?"

Not: "Can we build this?"

---

## 16. Version history

| Version | Milestone |
|---------|-----------|
| v8.22.x | Custom date range reports |
| v8.23.0 | Bible + UX polish + onboarding copy |
| v8.23.1 | No-hardware philosophy locked |
| Website v1.0 | Apple-style marketing site (`website/`) |
| Future | Review Day, AutoPilot OS modules |

---

*This document is the constitution. Update it when the company learns something fundamental — not for every small fix.*

**Your business. On AutoPilot.**
