# Bottom Navigation UI Lock

**Status:** DESIGN COMPLETE — Frozen (July 2026)  
**Component:** `.nav` `#nav` — main app dock  
**Version locked:** v8.43.20

> **Rule:** No redesign, icon changes, or functionality changes unless a genuine usability issue is discovered.

**Related docs:**
- [UI_LOCK_DASHBOARD.md](./UI_LOCK_DASHBOARD.md) — Command Centre (uses this dock)
- [MILEPILOT_UI_LOCK.md](./MILEPILOT_UI_LOCK.md) — screen status board
- [MILEPILOT-DESIGN-BIBLE.md](./MILEPILOT-DESIGN-BIBLE.md) — navigation pattern

---

## Freeze policy

The bottom navigation is a **full-width application dock**, not a floating card inside page content.

### Layout (locked)

| Property | Value |
| --- | --- |
| Position | `fixed` — anchored to bottom |
| Width | Full screen (`100%`) |
| Safe area | `padding-bottom: calc(8px + env(safe-area-inset-bottom))` |
| Separation | Top border + upward shadow — content scrolls above dock |
| Background | `#0A2854` → `#031126` gradient (matches dashboard navy) |
| Active state | Blue glow on active tab only |
| Inactive tabs | Muted icons/labels — blend with dock |

### CSS tokens

```css
--nav-dock-inner: 64px;
--nav-dock-pad: calc(var(--nav-dock-inner) + env(safe-area-inset-bottom, 0px) + 24px);
```

All main screens use `--nav-dock-pad` for bottom content padding so cards never sit inside the dock.

### Not allowed

- Floating pill / inset card nav overlapping content
- Redesigning icons or tab order
- Changing navigation behaviour or routes
- Competing glow on inactive tabs

### Allowed

- Bug fixes for safe-area on new devices
- z-index fixes if modals conflict

---

## Agent checklist

Before editing `.nav`:

- [ ] Is this a genuine layout/safe-area bug? If no → stop.
- [ ] Am I changing icons, labels, or onclick handlers? If yes → stop.
- [ ] Does content still clear the dock on all screen sizes?
