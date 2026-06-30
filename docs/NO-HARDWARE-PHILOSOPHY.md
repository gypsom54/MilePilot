# MilePilot Philosophy — No Hardware Required

**Status:** 🔒 Locked product decision — June 2026  
**Context:** After reviewing competitor products such as Driversnote.

---

## The decision

**MilePilot will never require additional hardware.**

No:

- Bluetooth beacons
- iBeacons
- Vehicle tags
- Car accessories
- External GPS devices

The only requirement:

1. Install MilePilot
2. Enable permissions once
3. Turn on AutoPilot
4. Drive normally

---

## AutoPilot Intelligence

Instead of hardware, MilePilot uses software signals:

| Signal | Role |
|--------|------|
| Motion activity | Detect when the user is moving |
| Background GPS | Record routes without foreground use |
| Speed | Distinguish driving from walking |
| Stationary detection | Identify stops and waiting time |
| Driver Intelligence | Learn patterns over time |
| Learned routines | Typical workdays and habits |
| Start/end locations | Home, depot, regular clients |
| Typical working hours | When a workday usually begins |
| User confirmations | Business vs personal — user always confirms |

These signals together determine the user's workday.

**Suggest, never decide.** Intelligence proposes; the user confirms.

---

## Product promise

The user should **never** need to remember to:

- Start tracking
- Stop tracking
- Buy hardware
- Pair Bluetooth devices

MilePilot should quietly do the work in the background.

---

## Competitive advantage

**Simplicity.**

| Others | MilePilot |
|--------|-----------|
| Beacons, tags, accessories | Phone only |
| Pair devices, charge batteries | Install once |
| Remember to start/stop | AutoPilot in background |
| GPS as the product | Peace of mind as the product |

Install once. Forget about mileage.

**Your business. On AutoPilot.**

---

## Engineering guardrails

Before shipping any tracking feature, confirm:

1. Does it work with **phone sensors only**?
2. Does it reduce manual start/stop burden?
3. Does it avoid new hardware partnerships or SKUs?
4. Does it reinforce **quiet background** operation?

If a proposal requires beacons, tags, or external devices — **reject it**.

---

## Related documents

- [MILEPILOT-BIBLE.md](./MILEPILOT-BIBLE.md) — constitution
- [VISION_LOCK.md](./VISION_LOCK.md) — platform vision
- Driver Intelligence — future sprint; must follow this philosophy

---

*This decision is permanent unless the entire product strategy is revisited by founders.*
