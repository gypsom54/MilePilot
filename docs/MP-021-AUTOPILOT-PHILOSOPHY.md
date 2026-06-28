# MP-021 — AutoPilot First Philosophy

**Status:** Active product philosophy  
**Promise:** Set it up once. MilePilot does the rest.

---

## Product shift

MilePilot is no longer centred around mileage tracking. It is centred around **automation**.

Every future feature must reinforce this philosophy.

---

## Product promise

The user should never have to think about:

- Starting tracking
- Saving journeys
- Creating reports
- Exporting PDFs
- Organising history
- Remembering mileage
- Calculating HMRC mileage

Once AutoPilot is configured, MilePilot quietly handles everything.

---

## Onboarding

Replace feature-heavy onboarding with **benefit-led onboarding**.

**Message:**

> Welcome to MilePilot.  
> Set it up once.  
> Then let MilePilot work automatically in the background.

After setup, the user should feel confident that MilePilot will:

- Detect journeys
- Record business mileage
- Save every trip
- Build reports
- Email reports on the chosen schedule

The user should feel they never need to worry about paperwork again.

---

## AutoPilot setup

Instead of presenting technical permissions individually, introduce a single **Enable AutoPilot** step.

Explain that enabling Motion, Location, Notifications and Background Activity allows MilePilot to work automatically.

**Emphasis:** outcomes, not technology.

---

## UX principle

Every new feature must pass this test:

> Can AutoPilot do this automatically?

| Answer | Action |
|--------|--------|
| **Yes** | Automate it |
| **No** | Ask the user only when absolutely necessary |

Reduce taps. Reduce decisions. Reduce admin.

---

## Product vision

MilePilot should become the business companion that users rarely need to open because it is already doing the work for them.

The app should quietly build records, reports and history while the user focuses on running their business.

The best compliment we can receive:

> "I forgot it was even running."

That means AutoPilot is working.

---

## Design rule

Do not add more buttons unless they create genuine value.

Instead, improve automation.

The interface should remain calm, premium and simple while the intelligence happens behind the scenes.

---

## Onboarding flow (MP-021)

```
welcome → planPick → workType → reportSetup (+ email) → autoPilotSetup → home
```

Legacy screens (`knowYou`, `promise`, `permissions`, `notifications`) remain in the DOM for resume compatibility but are not shown to new users.

---

## Related docs

- `docs/AUTO_PILOT.md` — MP-016 driving flow and end-shift automation
- `docs/DESIGN_LOCKED.md` — MP-001 welcome layout locked; copy tweaks allowed per MP-021
