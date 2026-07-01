# Architecture

Pulse is a **Flutter** app (iOS, Android, Web) built as a premium, calm experience — not a feature-heavy dashboard.

---

## High-level flow

```
LaunchScreen
    ↓  (~5.2s cinematic animation)
ConversationScreen (onboarding_name.json)
    ↓  (name capture)
ConversationScreen (onboarding_welcome.json)
    ↓  (Let's Begin)
PulseShell
    ├── HomeScreen          ← Brain-driven
    ├── Cabinet placeholder
    ├── Learn placeholder
    ├── Journal placeholder
    └── Pulse placeholder
```

---

## Folder structure

```
lib/
├── main.dart                    App entry, Brain init, PulseBrainScope
├── core/
│   ├── brain/                   Decision engine (not AI)
│   │   ├── models/              Memory, context, recommendations
│   │   ├── storage/             Persistence (SharedPreferences)
│   │   ├── engines/             Greeting, home, placeholder logic
│   │   ├── pulse_brain.dart     Central facade
│   │   └── pulse_brain_scope.dart
│   ├── conversation/            JSON-driven onboarding scripts
│   ├── motion/                  PulseMotion timing and curves
│   └── theme/                   Colors, typography, Material theme
├── screens/
│   ├── launch_screen.dart
│   ├── conversation_screen.dart
│   ├── home/home_screen.dart
│   ├── shell/pulse_shell.dart
│   └── placeholders/
└── widgets/                     Reusable Pulse components

assets/
└── conversations/               Onboarding JSON scripts
```

---

## Pulse Brain (decision engine)

The Brain is **not AI**. It is a rule-based decision engine that:

- **Remembers** user context (name, preferences, streaks, compounds, etc.)
- **Decides** what to show based on time, memory, and surface
- **Recommends** copy and UI content to widgets

Widgets **never invent greetings or home copy**. They call:

```dart
final rec = await PulseBrain.instance.homeRecommendations();
```

### Memory (`PulseMemory`)

| Field | Purpose |
|-------|---------|
| `firstName` | Personalisation |
| `onboardingChoices` | Key-value from onboarding |
| `favouriteLearningType` | Learning recommendations |
| `reminderPreferences` | Notification timing (future) |
| `milestones` | Achieved moments |
| `streaks` | Activity consistency |
| `favouriteCompounds` | Research cabinet context |
| `birthday` / `joinedAt` | Special greetings |

### Engines

| Engine | Responsibility |
|--------|----------------|
| `GreetingEngine` | Morning, evening, birthday, anniversary |
| `HomeRecommendationEngine` | Home cards, CTA, headline copy |
| `PlaceholderRecommendationEngine` | Tab placeholder copy |

### Future AI

`PulseAdvisoryLayer` can refine recommendations without replacing memory or rule-based fallbacks.

---

## Conversation engine

Onboarding is driven by JSON in `assets/conversations/`.

| File | Purpose |
|------|---------|
| `onboarding_name.json` | Intro + name input |
| `onboarding_welcome.json` | Personalised welcome |

Steps: `typing` → `input` → `button`

Variables use `{{firstName}}` interpolation. Actions like `navigate:welcome` and `complete:onboarding` are handled in `ConversationScreen`.

---

## State and persistence

- **Brain**: `SharedPreferences` key `pulse_brain_memory_v1`
- **Tests**: `InMemoryPulseBrainStore` via `PulseBrain.initializeForTest()`

---

## Navigation

No router package. `PulseTransition.route()` provides fade + glide between screens. `PulseShell` manages bottom tab state with `AnimatedSwitcher`.

---

## Key rules

1. Copy on home and placeholders → **Brain**
2. Onboarding copy → **JSON** + Copy Bible
3. Motion → **PulseMotion** tokens only
4. Visual tokens → **PulseColors** / **PulseTypography**
