# MilePilot Stabilisation Regression Checklist

Run before every beta / TestFlight build during the stabilisation sprint.

**Automated gate:** `npm run verify:stabilisation`

## UI — Onboarding

- [ ] Onboarding screen 1 (welcome) displays correctly — no layout overlap
- [ ] Name / vehicle screen: silhouette icon is small (17px) and vertically centred in the name input
- [ ] AutoPilot tracking mode screen works — cards selectable, Continue enabled
- [ ] Permission flow on onboarding does **not** show the Always-location modal over setup screens
- [ ] Email setup and Ready screens load without overlap

## Permissions

- [ ] Open Settings button opens iOS Settings → MilePilot
- [ ] Always-location modal appears only when AutoPilot + foreground-only + active shift on Home or Tracking
- [ ] Modal does **not** appear on Reports, History, Settings, or onboarding
- [ ] If Always location is already granted, modal does **not** appear
- [ ] Got it dismisses modal and does not block the screen underneath

## Dashboard & Tracking

- [ ] Dashboard loads — greeting, hero miles, Start Shift visible
- [ ] Start Shift works — tracking screen opens, timer runs
- [ ] Tracking screen layout does not overlap (map, miles, End Shift)
- [ ] GPS banner (if shown) does not cover primary buttons

## AI Review

- [ ] AI Review screen after shift end: cards fit on screen
- [ ] Save review and Done buttons do not overlap cards or each other
- [ ] No stacked pop-ups (permission modal + review at same time)

## Reports

- [ ] Reports screen loads — archive, custom report entry visible

## Mileage engine (real device only)

- [ ] Background mileage tested on a real iPhone drive — **do not sign off from simulator alone**
- [ ] Foreground miles increment while app is open during shift
- [ ] Miles sync after app resume from background

## Freeze rules (this sprint)

- No new features, redesigns, or copy changes unless fixing a visible bug
- No mileage engine file changes unless required for a proven tracking defect
- No unrelated dashboard / reports / onboarding layout edits
