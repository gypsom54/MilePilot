# MP-032 — Pioneer Program Preparation

**Version:** v8.8.0  
**Branch:** `cursor/mp-032-pioneer-prep-ae00`  
**Type:** Observability, feedback, and confidence — no new product features

---

## Goal

Prepare MilePilot for a closed Pioneer Program with 20–30 self-employed drivers. Learn from real usage quickly through lightweight feedback, quiet error logging, and internal success metrics.

---

## In-app feedback (Settings)

Settings → **Send feedback** opens a short form:

| Question | Field |
|----------|--------|
| How easy was MilePilot to use today? (1–10) | Required rating buttons |
| Did anything confuse you? | Optional text |
| What would save you more time? | Optional text |
| Any bugs? | Optional text |

Submissions are stored locally and posted to `POST /pioneer/feedback`.

---

## About screen

Settings → **About MilePilot**:

- Version number
- Build number (`MP-032`)
- Release notes
- Support email (`hello@milepilot.uk`)
- Privacy Policy and Terms of Use (in-app overlays)

---

## Error logging

- Global `error` and `unhandledrejection` handlers capture unexpected errors with version, build, URL, and context.
- Errors are kept in localStorage (last 50) and sent to `POST /pioneer/errors`.
- Users continue to see plain-English toasts — no stack traces in the UI.

---

## Pioneer beta banner

Shown only on Pioneer builds:

- Enable with `?pioneer=1` in the URL (persists via `localStorage mp_pioneer_program=1`)
- Banner: **MilePilot Pioneer Program** — *Thanks for helping shape the future of MilePilot.*

---

## Feedback reminder

After **five completed shifts**, a polite modal asks: *How is MilePilot working for you?*

- **Share feedback** — opens the feedback form
- **Not now** — dismisses until next eligible shift summary
- **Don't ask again** — permanent dismiss

---

## Internal success dashboard

**Not shown to end users.** Visible when:

- Developer mode (`?dev=1`), or
- Pioneer build with `?pioneer=1&metrics=1`

Settings card **Pioneer metrics (internal)** shows:

| Metric | Source |
|--------|--------|
| Completed shifts | Shift end hook |
| Reports generated | Post-shift PDF generation |
| Reports emailed | Daily auto-email send |
| Average shift duration | Total seconds ÷ shifts |
| GPS permission granted | Location permission outcome |
| Setup completion rate | Onboarding complete flag |
| App version | Current build |

Server-side aggregation: `GET /pioneer/metrics` (requires `PIONEER_ADMIN_KEY` in production).

Telemetry sync: `POST /pioneer/telemetry` (Pioneer builds only).

---

## QA checklist

| Path | Expected |
|------|----------|
| Settings → Send feedback | Form opens, ease 1–10 required |
| Submit feedback | Toast thanks, modal closes |
| Settings → About | Version, build, release notes, support |
| Privacy / Terms | Overlay with plain copy |
| `?pioneer=1` | Pioneer banner on dashboard |
| Complete 5 shifts | Reminder after summary Done |
| Don't ask again | Reminder never returns |
| `?dev=1` | Internal metrics card in Settings |
| JS error (dev console) | Logged locally + server, no user-facing stack |

---

## Deploy

Upload `MilePilot-UPLOAD-v8.8.0.zip` — verify `https://app.milepilot.uk/version.txt` shows **v8.8.0**

Service worker cache: `milepilot-v8-8-0`

Pioneer cohort: share `https://app.milepilot.uk/?pioneer=1`
