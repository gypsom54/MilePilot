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

- Deep navy backgrounds
- Bright MilePilot blue accents
- White typography
- Soft grey secondary text
- Rounded cards
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
- Reports
- History
- PDF generation
- Email report sending
- Backend API URL
- LocalStorage keys
- Existing saved shift data

Before changing core logic, explain the reason.

## Backend

Backend runs on Railway.

Email reports use Resend API.

PDF reports are generated server-side.

Do not switch back to SMTP.

## Background Tracking

The web app is only suitable for testing GPS.

Proper background mileage tracking requires a native app.

Future native flow:

Motion detected.
Send notification.
Ask: Are you working today?

Options:

- Track as work
- Personal journey
- Ignore

Never automatically log personal journeys without user control.

## Development Principle

Every change should answer:

What is the single biggest improvement we can make to a driver's working day?
