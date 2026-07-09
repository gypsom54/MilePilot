# Animations

Pulse motion is **calm, cinematic, and human**. Nothing bounces, snaps, spins, or flashes.

---

## Principles

| Do | Don't |
|----|-------|
| Fade | Bounce |
| Glide | Snap |
| Breathe | Spin |
| Lift | Flash |
| Pulse (subtle glow) | Fast movement |

**Optimise for delight, not speed.** If an animation feels rushed — slow it.

---

## PulseMotion (`lib/core/motion/pulse_motion.dart`)

Central source of truth for all timing.

### Durations

| Token | ms | Use |
|-------|-----|-----|
| `instant` | 120 | Micro feedback |
| `fast` | 280 | Opacity, small scale |
| `medium` | 500 | Reveals between steps |
| `slow` | 800 | Tab switches |
| `glide` | 1100 | Card entrance, input reveal |
| `cinematic` | 1400 | Screen transitions, headlines |
| `launch` | 5200 | Launch sequence total |
| `glowCycle` | 3080 | Breathing glow (10% slower than v1) |

### Curves

| Token | Curve |
|-------|-------|
| `fade` | `easeOutCubic` |
| `glideIn` | `easeOutCubic` |
| `breathe` | `easeInOutSine` |
| `draw` | `easeInOutSine` |

### Accessibility

```dart
PulseMotion.reducedMotion(context)  // respects system setting
PulseMotion.adapt(context, duration)
```

When reduced motion is on: skip typewriter, shorten durations, disable glow pulse.

---

## Launch sequence (~5.2s)

| Phase | Timing |
|-------|--------|
| Black screen | ~1s |
| Cyan dot appears + breathes | ~1s |
| Heartbeat line draws (sine ease) | ~1.5s |
| **Pause after heartbeat** | +500ms |
| P reveals | ~400ms |
| ULS E fade in | ~400ms |
| Tagline | ~400ms |
| Logo breathes | ~700ms |
| Slow fade to onboarding | ~900ms |

Implemented in `LaunchScreen` + `PulseLogo` CustomPainter.

---

## Typewriter

- Variable character delay (±15–18% variance)
- Per-line pauses (e.g. 920ms after "Hello...")
- Never robotic — see `PulseTypewriter` and conversation JSON `pauseAfterMs`

---

## Screen transitions

`PulseTransition.route()` — shared fade + 2.5% vertical glide over `cinematic` duration.

---

## Micro-interactions

| Element | Behaviour |
|---------|-----------|
| `PulseGlassCard` | Staggered fade + glide on enter; 0.992 scale on press |
| `PulsePrimaryButton` | Soft glow, 0.982 scale on press, optional breathe when enabled |
| `PulseTextField` | Focus glow, pulsing cursor |
| `PulseBottomNav` | Cyan indicator fades in on active tab |

---

## Adding new animation

1. Use `PulseMotion` tokens — do not invent durations
2. Test with reduced motion enabled
3. Target 60fps — prefer `AnimatedBuilder` over rebuilding large trees
4. Update this document in your sprint PR
