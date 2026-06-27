# MP-014 — Tracking Engine QA Checklist

**App version:** 7.4.1  
**Engine:** Tracking Engine v2  
**Focus:** Start Shift / End Shift reliability for beta

---

## 1. Deployment confirmation

- [ ] https://app.milepilot.uk/version.txt shows **v7.4.1**
- [ ] https://app.milepilot.uk/js/tracking-engine.js returns engine code (not 404)
- [ ] Service worker cache: `milepilot-v7-4-1`
- [ ] Hard refresh or reinstall PWA after upload

---

## 2. Start Shift

| Step | Expected |
|------|----------|
| Tap **Start Shift** | Timer starts immediately |
| Dashboard | “Shift In Progress” + 🟢 Tracking |
| Button | Changes to **End Shift** |
| GPS not yet granted | Branded banner (no browser `alert`) |
| GPS granted | Miles begin updating when moving |
| Double-tap Start | Ignored while busy |

---

## 3. Live dashboard (single source of truth)

While tracking, all values from `MPTracking.getState()`:

- [ ] Business miles update
- [ ] Driving time updates (live timer)
- [ ] HMRC estimate updates
- [ ] Journey count updates when stops detected
- [ ] No manual refresh needed

---

## 4. End Shift

| Step | Expected |
|------|----------|
| Tap **End Shift** | GPS stops, timer stops |
| Toast | “Shift saved ✓ — Great work today” |
| Overlay | Great work today 👏 + stats |
| History | Shift listed |
| Reports | Daily report includes shift |
| Dashboard | Returns to ready / post-work state |

---

## 5. Background behaviour

Test and note device + browser:

| Scenario | Expected |
|----------|----------|
| App stays open | Continuous tracking |
| Tab minimised | State saved; resume on return |
| Screen locked | Timer resumes; GPS may pause (OS limit) |
| Switch to Maps / Uber | Same as lock — see [TRACKING_BACKGROUND.md](./TRACKING_BACKGROUND.md) |

---

## 6. Error handling (branded toasts / banners)

- [ ] Location denied
- [ ] GPS unavailable
- [ ] Tracking paused / reconnect
- [ ] Shift save failed (storage full)

---

## 7. Developer test mode (QA only)

Enable: `https://app.milepilot.uk/?dev=1`

Settings → **Developer tools** (hidden from normal users):

- Simulate 2.5 mi during active shift
- Add completed test shift (12.4 mi)
- Generate report from test data

Disable: “Hide developer tools” in Settings.

---

## 8. Success criteria

- [ ] Start Shift works
- [ ] Tracking state works
- [ ] End Shift saves
- [ ] Dashboard updates correctly
- [ ] Reports use saved shift data
- [ ] No broken navigation
- [ ] No styling regressions
