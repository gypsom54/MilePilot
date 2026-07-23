# MilePilot Roadmap

This roadmap describes the product phases for MilePilot RC3 and beyond. See [PROJECT_RULES.md](PROJECT_RULES.md) for design and development constraints.

## Phase 1 — Foundation

**Status:** mostly complete (RC3)

Includes:

- GPS tracking with live map (Leaflet + OpenStreetMap)
- Shift saving to browser localStorage
- Shift history
- Daily / weekly / monthly reports
- Browser print / Save PDF
- Server-side PDF generation (PDFKit)
- Email report sending (Resend API)
- Backend API on Railway
- Frontend on Cloudflare Pages (`app.milepilot.uk`)
- Onboarding flow (name → vehicle → email setup)
- PWA manifest and service worker stub

Remaining polish:

- Expand service worker for offline shell caching
- Configure production `mp_api_base` for `api.milepilot.uk`
- Premium UI pass (Phase 2)

## Phase 2 — Premium UI

**Status:** current focus

Goals:

- Premium welcome screen (see welcome screen rules in PROJECT_RULES.md)
- Cleaner vehicle selection
- Better dashboard
- Better tracking screen
- Better reports screen
- Better history screen
- Consistent branding
- Better typography
- Reduced clutter

## Phase 3 — Business Dashboard

At the end of every shift, ask:

**How much did you earn?**

This unlocks:

- Revenue
- Hourly earnings
- Estimated fuel cost
- Estimated profit
- HMRC estimate
- Business insight

## Phase 4 — Weekly Review

Every week MilePilot should summarise:

- Revenue
- Mileage
- Driving hours
- HMRC estimate
- Profit estimate
- Best shift
- Best day
- Weekly recommendation

## Phase 5 — Business Intelligence

Add:

- Business Health Score
- Charts
- Trends
- Efficiency insights
- Revenue per mile
- Revenue per hour

## Phase 6 — AI Business Coach

Future feature.

MilePilot should provide:

- Morning briefings
- Weekly coaching
- Monthly coaching
- Tax reminders
- Profit insights
- Business recommendations

## Phase 7 — Cloud Sync (Firebase)

Move from localStorage-only to authenticated cloud storage.

Includes:

- Firebase Auth (sign-in)
- Firestore trip / shift storage
- Report archive
- Scheduled report delivery
- Cross-device sync

See `firebase/README.md` for initial notes.

## Phase 8 — Native App

Required for reliable background tracking.

Native app must support:

- Background location
- Motion detection
- Notifications
- Track as work / Personal journey / Ignore
- Locked-phone tracking
- Offline save and sync

The web app cannot reliably support full background tracking.
