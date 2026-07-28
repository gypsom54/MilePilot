# Design System

Tokens and rules for visual consistency. **If it's not a token, it doesn't belong.**

---

## Colors (`PulseColors`)

| Token | Hex | Use |
|-------|-----|-----|
| `graphite` | `#0A0A0C` | Primary background |
| `graphiteDeep` | `#050506` | Depth, gradient ends |
| `graphiteElevated` | `#141418` | Inputs, nav bar |
| `cyan` | `#2EE8FF` | Primary accent, glow |
| `cyanSoft` | `#00D4FF` | Gradient end |
| `cyanGlow` | `#662EE8FF` | Ambient glow |
| `white` | `#F5F5F7` | Headlines |
| `whiteSoft` | `#CCF5F5F7` | Secondary text |
| `whiteMuted` | `#99F5F5F7` | Captions, subtitles |
| `whiteDim` | `#66F5F5F7` | Placeholders |

---

## Typography (`PulseTypography`)

Apple-inspired system font stack.

| Style | Size | Weight | Use |
|-------|------|--------|-----|
| `display` | 42 | 700 | PULSE wordmark |
| `heading` | 28 | 600 | Screen titles |
| `body` | 17 | 400 | Body copy |
| `caption` | 14 | 400 | Nav labels, hints |
| `tagline` | 15 | 400 | Brand tagline |

Home greeting uses `heading` at 32px.

---

## Spacing (`PulseMotion`)

| Token | Value | Use |
|-------|-------|-----|
| `screenPadding` | 32 | Horizontal screen inset |
| `sectionGap` | 28 | Between input and button |
| `lineGap` | 16 | Between typewriter lines |
| `minTouchTarget` | 48 | Buttons, nav items |

Card gap on home: **20px**  
Headline block bottom margin: **40px**

---

## Radius

| Element | Radius |
|---------|--------|
| Cards | 24px |
| Buttons | 16px |
| Inputs | 16px |
| Nav bar top | 28px |
| Glow dots / pulse line | 999px (pill) |

---

## Glass card

```
Background:  white @ 6% opacity
Border:      white @ 10% opacity
Blur:        18px (BackdropFilter)
Shadow:      black @ 35%, blur 28, offset (0, 12)
Glow:        cyan @ 6%, blur 24
Padding:     26h × 28v
```

---

## Buttons

Primary button gradient: `cyan` → `cyanSoft`  
Text on button: `graphite` (dark on light cyan)  
Disabled opacity: **0.32**

---

## Theme

`PulseTheme.dark()` — Material 3 dark theme applied in `main.dart`.

---

## Do / Don't

| Do | Don't |
|----|-------|
| Use tokens | Hardcode `#2EE8FF` in widgets |
| Generous padding | Crowded layouts |
| One accent colour | Multiple accent colours |
| Soft shadows | Hard drop shadows |
| High contrast text | Grey on grey |

---

## Figma / design files

Not yet linked. Design system in code is the source of truth until design tooling is added.
