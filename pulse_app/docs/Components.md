# Components

Reusable widgets live in `lib/widgets/`. **Always extend these — never duplicate.**

---

## Layout and canvas

### `PulseBackground`
Deep graphite radial gradient. Optional ambient cyan glow.

```dart
PulseBackground(showAmbientGlow: true, child: ...)
```

### `PulseTransition`
Fade + glide route transitions. Never bounce.

```dart
Navigator.push(context, PulseTransition.route(NextScreen()));
```

---

## Brand

### `PulseLogo`
Wordmark with heartbeat-to-P animation. Used in launch and welcome.

| Param | Purpose |
|-------|---------|
| `heartbeatProgress` | 0–1 draw progress |
| `pRevealProgress` | P letter reveal |
| `letterOpacity` | ULS E fade |
| `logoBreathe` | Subtle scale/glow breathe |
| `compact` | Smaller variant for in-app |

---

## Conversation and input

### `PulseTypewriter`
Human typing animation with per-line pauses and variable speed.

### `PulseConversation`
Renders a full conversation script from JSON. Handles typing, input, buttons.

### `PulseTextField`
Premium text input — pulsing cursor, focus glow, fading placeholder.

---

## Actions

### `PulsePrimaryButton`
Primary CTA. Soft glow, press scale, hover (web), focus ring.

```dart
PulsePrimaryButton(
  label: 'Continue',
  enabled: canContinue,
  pulseWhenEnabled: true,  // gentle breathe when active
  onPressed: () {},
)
```

---

## Home and navigation

### `PulseGlassCard`
Frosted glass card — 24px radius, soft shadow, tiny cyan glow.

```dart
PulseGlassCard(
  title: 'Research Cabinet',
  subtitle: 'Ready whenever you are.',
  staggerIndex: 1,  // entrance delay
)
```

### `PulseBottomNav`
Five-tab bar: Home · Cabinet · Learn · Journal · Pulse

---

## Effects

### `PulseGlow`
Wraps children with cyan box-shadow. Optional `animate: true` for breathe.

---

## Screens (not widgets, but key surfaces)

| Screen | File |
|--------|------|
| Launch | `screens/launch_screen.dart` |
| Onboarding | `screens/conversation_screen.dart` |
| Home | `screens/home/home_screen.dart` |
| App shell | `screens/shell/pulse_shell.dart` |

---

## Component rules

1. **No hardcoded copy** on home or greetings — use Brain
2. **No magic numbers** for timing — use `PulseMotion`
3. **No magic colours** — use `PulseColors`
4. New component? Add it here in the same sprint.
