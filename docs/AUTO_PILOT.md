# MilePilot Auto-Pilot Philosophy (MP-016 + MP-021)

**Promise:** Set it up once. MilePilot does the rest.

See **`docs/MP-021-AUTOPILOT-PHILOSOPHY.md`** for the full product philosophy (onboarding, UX principle, design rule).

---

## Product rule

Every feature must pass:

> Can AutoPilot do this automatically?

If **yes** — automate it.  
If **no** — ask the user only when absolutely necessary.

---

## Driving flow

| State | Dashboard CTA | User action |
|-------|---------------|-------------|
| Ready | Start Shift | One tap |
| Tracking | End Shift | One tap |
| Done | (none) | Done on success screen → Dashboard |

**No** Save Report, View Report, or Download on the driving path.

---

## End Shift (automatic)

When the user taps **End Shift**, MilePilot silently:

1. Stops GPS and timer  
2. Saves shift to local storage  
3. Updates Dashboard, History, Reports data  
4. Generates PDF in the background  
5. Archives report metadata  
6. Syncs automatic email schedule  
7. Sends daily email immediately if daily preference is on  

Then shows a **simple success screen** with one button: **Done**.

---

## Document Centre (Reports tab)

All paperwork lives here:

- Automatic Reports schedule + **Change Schedule**
- Daily / Weekly / Monthly tabs
- View PDF · Download PDF · Share PDF · Email Again · Export CSV
- Report history archive

---

## Automatic reports (set once)

| Frequency | Schedule |
|-----------|----------|
| Daily | Every evening your driving summary is emailed |
| Weekly (Recommended) | Every Sunday at 6:00 PM |
| Monthly | First day of month — previous month's report |

User chooses once during onboarding or in Settings / Document Centre.

---

## What we don't do

- Turn Dashboard into an admin page  
- Prompt to save or export after every shift  
- Auto-open PDFs or Reports after End Shift  
- Change PDF layout or onboarding (locked)
