# MilePilot Project Rules

## Product Vision

MilePilot is the business companion for self-employed drivers.

It is not just a mileage tracker.

The long-term goal is to become the operating system for self-employed drivers.

MilePilot helps drivers:

- Save time
- Make more money
- Understand their business
- Reduce stress

## Core User

Self-employed UK drivers, including:

- Uber drivers
- Taxi drivers
- Private hire drivers
- Delivery drivers
- Courier drivers

## Brand Positioning

MilePilot should feel premium, modern and trustworthy.

Reference style:

- Stripe
- Linear
- Monzo
- Notion
- Uber

## Design Rules

Use:

- Deep navy backgrounds (`#031126`, `#0A2854`)
- Bright MilePilot blue accents (`#0D6BFF`)
- White typography
- Soft grey secondary text (`#B9C8DD`, `#64748B`)
- Rounded cards (18–24px radius)
- Clean spacing
- Premium buttons
- Minimal clutter

Avoid:

- Cheap clip-art graphics
- Oversized empty boxes
- Cluttered layouts
- Harsh borders
- Basic-looking forms
- Unnecessary animations

## Welcome Screen Rules

The welcome screen must feel premium and modern.

Keep:

- MilePilot wordmark
- Animated typing effect
- First-name input
- Continue button

Remove:

- Car graphic
- Route graphic
- Ugly logo graphic under the wordmark
- Massive empty name card

Preferred headline:

Your driving business.
On auto pilot.

## Technical Rules

Do not break existing functionality.

Preserve:

- GPS tracking
- Reports (daily / weekly / monthly)
- History
- PDF generation (browser print + server-side PDFKit)
- Email report sending via Resend
- Backend API URL configuration
- LocalStorage keys (`mp_driver`, `mp_vehicle`, `mp_email`, `mp_shifts`, `mp_api_base`)
- Existing saved shift data

Before changing core logic, explain the reason.

### Architecture

| Layer | Location | Notes |
|-------|----------|-------|
| Frontend | `frontend/` | Static PWA — single `index.html`, no build step |
| Backend | `backend/server.js` | Express (ESM), stateless PDF + email API |
| Deploy | `deploy/cloudflare-targets.json` | `app.milepilot.uk` frontend, `api.milepilot.uk` backend |

### HMRC Rates (2024/25 advisory rates)

| Vehicle | Rate |
|---------|------|
| Car | 55p / mile |
| Van | 55p / mile |
| Bicycle | 20p / mile |
| Motorcycle | 24p / mile |

All HMRC figures shown in the app are estimates for record keeping. Always include the disclaimer that users should check official guidance.

### API Endpoints

- `GET /health` — backend status and Resend configuration check
- `POST /reports/send` — accepts report JSON, returns PDF via Resend email

## Backend

Backend runs on Railway.

Email reports use the Resend API (not SMTP).

PDF reports are generated server-side with PDFKit.

Do not switch back to SMTP.

Required env vars:

- `RESEND_API_KEY`
- `EMAIL_FROM` (default: `MilePilot <reports@milepilot.uk>`)
- `PORT` (default: `8787`)

## Background Tracking

The web app is only suitable for testing GPS.

Proper background mileage tracking requires a native app.

Future native flow:

1. Motion detected
2. Send notification
3. Ask: Are you working today?

Options:

- Track as work
- Personal journey
- Ignore

Never automatically log personal journeys without user control.

## Production Targets

- Frontend: `app.milepilot.uk` (Cloudflare Pages)
- Backend: `api.milepilot.uk` (Railway)
- Email sender: `reports@milepilot.uk`

## Development Principle

Every change should answer:

**What is the single biggest improvement we can make to a driver's working day?**

See also: [ROADMAP.md](ROADMAP.md) for phased delivery plan.
