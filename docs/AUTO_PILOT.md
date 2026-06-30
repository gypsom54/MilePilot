# MilePilot Auto-Pilot Philosophy (MP-016 + MP-021 + MP-023)

**North Star:** See **`docs/MP-023-NORTH-STAR.md`** — all product decisions align here first.

**Promise:** Set it up once. MilePilot does the rest.

---

## Product rule

Every feature must pass:

> Can AutoPilot do this automatically?

If **yes** — automate it.  
If **no** — ask the user only when absolutely necessary.

**The Product Rule:** If a feature increases user effort, stop. Find a way for AutoPilot to do it instead. The goal is fewer decisions — every screen calmer than the last.

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
4. Archives report metadata (local)  
5. Syncs automatic email schedule  
6. Runs **scheduled** report send **only if** daily / weekly / monthly is due (`maybeSendScheduledReport`)  

Then shows a **simple success screen** with one button: **Done**.

**Locked policy (MP-041):** No PDF generation on End Shift. No email unless the user's chosen frequency is due. See `docs/MP-041-REPORTING-AI-ROADMAP.md`.

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
- Send reports or emails after every trip or every End Shift  
- Generate PDFs automatically on End Shift (user opens Document Centre on demand)  
- Auto-open PDFs or Reports after End Shift  
- Change PDF layout or onboarding (locked)
