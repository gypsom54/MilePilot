# MilePilot Component Specs

**Parent:** [MILEPILOT-BRAND-SYSTEM-v1.0.md](../MILEPILOT-BRAND-SYSTEM-v1.0.md)  
**Tokens:** [tokens.css](./tokens.css)

Every component below is **shared across platforms**. Implement once, reuse everywhere.

---

## 1. Brand bar

**App reference:** `frontend/index.html` — `.brand-bar`

```
┌─────────────────────────┐
│      Mile Pilot         │  ← wordmark, centred
│ Your business. On       │  ← tagline, 11px, letter-spacing .08em
│ AutoPilot.              │
└─────────────────────────┘
```

| Property | Value |
|----------|-------|
| Wordmark size | 34px (welcome 42px, header 17px) |
| Tagline colour | `rgba(110,180,255,0.78)` |
| Margin below | 18–24px |
| Pulse | Nearby on hero moments only — **not** underlined |

---

## 2. AutoPilot status row

**App reference:** `.cc-map-gps-row`, `.mp-gps-banner`

```html
<span class="gps-dot is-live"></span>
<span>AutoPilot Active</span>
<span class="meta">GPS locked</span>
```

| Property | Value |
|----------|-------|
| Dot | 8px, `#0D6BFF`, 2s pulse |
| Label | 12px, semibold, `rgba(234,242,255,0.94)` |
| Meta | 11px, right-aligned, muted |
| Container | Optional banner: `rgba(13,107,255,0.1)` bg |

**Locked label:** `AutoPilot Active` — not “AutoPilot active”, not “Tracking”, not “GPS on”.

---

## 3. Metric hero (TODAY)

**App reference:** `.cc-hero`

| Element | Style |
|---------|-------|
| Label | TODAY — 11px, uppercase, blue-muted |
| Value | 68–92px app / 42px phone mock, weight 700, tabular nums |
| Unit | Business miles — 15px muted |

Count-up animation on marketing: 1.4s ease-out cubic.

---

## 4. Card (`cc-card` / `mp-card`)

| Property | Value |
|----------|-------|
| Background | `linear-gradient(180deg, rgba(255,255,255,.06), rgba(13,107,255,.02))` |
| Border | `1px solid rgba(110,180,255,.14)` |
| Radius | 24px (18px inner) |
| Padding | 20px 18px |
| Title | 13px uppercase, blue-muted, letter-spacing `.08em` |
| Shadow | `0 4px 24px rgba(0,0,0,.1)` + inset highlight |

**Variants:** default · warn (amber border) · route (map inside)

---

## 5. Map card

| Property | Value |
|----------|-------|
| Canvas | `#0B1B36` |
| Grid | `rgba(110,180,255,0.1)` 1px |
| Route | `#0D6BFF` 3px animated |
| Start | `#20D781` 5px + white stroke |
| End | `#0D6BFF` 5px + white stroke |
| Live position | Pulse ring 16px + dot 6px |
| Labels | CAMDEN, CITY, WESTMINSTER — 8px uppercase |

Optional: gentle map pan 12s on marketing.

---

## 6. Blue pulse (signature bar)

**Retired:** underline beneath logo on marketing.  
**Current:** standalone glow element OR GPS dot OR radar rings.

### Bar (loading, email rule)

```css
height: 2px;
background: var(--mp-pulse-gradient);
box-shadow: var(--mp-pulse-shadow);
animation: brandPulseGlow 4s ease-in-out infinite;
```

### Radar (hero moment)

3 concentric rings, 3s expand fade, centred on GPS dot.

---

## 7. Route line (divider)

Use instead of `<hr>` or decorative SVG waves.

```css
.route-animated {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: routeDraw 3.5s var(--mp-ease) infinite;
}
```

Section transitions: full-width faint route on navy, opacity 0.35.

---

## 8. Primary button

| Property | Value |
|----------|-------|
| Height | 52px (app primary 58px) |
| Radius | 16px |
| Background | `#1E88FF → #0D6BFF → #005FE8` |
| Shadow | `0 8px 28px rgba(13,107,255,.28)` |
| Marketing | Optional `.pulse-edge` glow animation |

**Labels:** Join the beta · Review today's journeys · Turn on automatic reports

---

## 9. Notification toast (phone / push)

| Property | Value |
|----------|-------|
| Copy | `{n} journeys ready to review` |
| Background | `rgba(11,35,72,0.95)` |
| Border | `rgba(110,180,255,0.2)` |
| Dot | GPS pulse 8px left |
| Animation | slide down 0.8s after load |

---

## 10. PDF report band

```
┌──────────────────────────────────────┐
│ NAVY BAND                            │
│ Mile Pilot                           │
│ Your business. On AutoPilot.         │
├──────────────────────────────────────┤
│ Weekly Business Mileage              │
│ 142.8 miles                          │
│ [stats grid] [daily table]           │
│ [route thumbnail]                    │
│ Footer: Your business. On AutoPilot. │
└──────────────────────────────────────┘
```

No pulse underline in band. Pulse = route thumbnail glow or left accent rule.

---

## 11. Email header

| Element | Spec |
|---------|------|
| Background | `#031126` full-width band |
| Wordmark | Mile Pilot centred |
| Tagline | Your business. On AutoPilot. |
| Accent | 2px pulse gradient line below band |
| Status line | AutoPilot Active · Weekly report ready |

---

## 12. Trust card (marketing)

6 cards maximum per row grid:

1. No extra hardware  
2. Works while locked  
3. Professional reports  
4. HMRC-ready records  
5. Background tracking  
6. End-of-day review  

Each: navy card + 6px pulse dot left of title + one line body.

---

## Code references

| Component | App CSS class |
|-----------|---------------|
| Brand bar | `.brand-bar`, `.wordmark` |
| Card | `.cc-card` |
| Hero metric | `.cc-hero`, `.cc-hero-value` |
| GPS | `.cc-map-gps-dot.is-live` |
| Map | `.cc-route-map`, `#0B1B36` |
| Button | `.cc-primary-btn`, `.premium-btn` |
| Nav | `.nav`, `.nav-item` |

Website must import `docs/brand/tokens.css` values — not invent parallel tokens.
