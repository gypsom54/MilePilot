# MP-029 — AutoPilot Confidence Layer

**Version:** v8.6.0  
**Branch:** `cursor/mp-029-autopilot-confidence-ae00`  
**Type:** User confidence — no new tracking features

---

## Goal

Give every user an instant “everything is working” view on the dashboard. No digging through settings. No technical jargon. Just clear ✓ / ⚠ status cards that reinforce the AutoPilot promise:

**Drive. Track. Claim.** Everything else runs on AutoPilot.

---

## What shipped

### AutoPilot Status section

Replaces the old report-status line on the Command Centre with a dedicated **AutoPilot Status** card (`#ccApHealth`).

**Seven health checks:**

| Check | ✓ When | ⚠ When |
|-------|--------|--------|
| GPS | Location granted / active | Permission missing or denied |
| Auto Save | Storage + tracking engine OK | Engine unavailable or storage blocked |
| Reports | Report schedule set | No schedule configured |
| History | Saving (live) or Complete (idle) | Storage unavailable |
| Email | Email address saved | No email on file |
| Background Tracking | Location + AutoPilot enabled | Deferred or not set up |
| Permissions | Onboarding + location + notifications complete | Setup incomplete |

### Design

- Dark navy card, blue accents, rounded rows — matches existing MilePilot visual language
- Green ✓ icons for healthy items; amber ⚠ for attention items
- Plain-English hints only when something needs action (e.g. *“Reports won't be emailed until an email address has been added.”*)
- Overall subtitle: *“Everything is working.”* / *“One thing needs your attention.”* / recording message during active shift
- Status dot: green when all clear, amber when any warning

### Behaviour

- Renders on every `renderCommandCentre()` call — stays in sync after settings changes
- **Hidden during active tracking** (same as other idle dashboard cards) — live route + stats take focus
- Visible for Tracker and Pro plans
- No new settings screen — this is a confidence dashboard, not configuration

---

## Success criteria

| Test | Expected |
|------|----------|
| Fresh onboarding complete | All seven checks green; “Everything is working.” |
| No email saved | Email ⚠ with plain-English hint |
| GPS denied | GPS ⚠; hint mentions browser settings in plain English |
| Reports not scheduled | Reports ⚠ |
| Active shift | Health card hidden; live tracking UI shown |
| Settings save (email/schedule) | Health card updates on return to Home |

A new user should understand setup health in **under five seconds**.

---

## Deploy

Upload `MilePilot-UPLOAD-v8.6.0.zip` — verify `https://app.milepilot.uk/version.txt` shows **v8.6.0**

Service worker cache: `milepilot-v8-6-0`

See also: `docs/MP-028-LIVE-DEPLOYMENT-QA.md` for live QA steps after upload.
