# Developer Notes

Practical guide for building on Pulse.

---

## Prerequisites

- Flutter SDK (stable channel)
- Xcode (iOS) / Android Studio (Android) / Chrome (web)

---

## Setup

```bash
git clone <your-pulse-repo-url>
cd pulse-app-          # or your local folder name
flutter pub get
flutter run -d chrome
```

Verify:

```bash
flutter analyze   # must pass
flutter test      # must pass
```

---

## Project conventions

### Package name
`pulse_app` — imports use `package:pulse_app/...`

### Branch naming
`cursor/<descriptive-name>-a417`

### Commit messages
```
feat(scope): short description

Longer explanation if needed.
```

### File placement

| What | Where |
|------|-------|
| New widget | `lib/widgets/pulse_*.dart` |
| New screen | `lib/screens/` |
| Brain logic | `lib/core/brain/engines/` |
| Onboarding copy | `assets/conversations/*.json` + Copy Bible |
| User-facing copy | Brain or Copy Bible — never inline |
| Tests | `test/` mirroring `lib/` structure |

---

## Running tests

```bash
flutter test                           # all
flutter test test/brain/               # brain only
flutter test test/widget_test.dart      # smoke
```

Brain tests use `PulseBrain.initializeForTest()` and `PulseBrain.resetForTest()` in `tearDown`.

---

## Key APIs

### Initialise Brain (main.dart)

```dart
final brain = await PulseBrain.initialize();
runApp(PulseApp(brain: brain));
```

### Get home recommendations

```dart
final rec = await PulseBrain.instance.homeRecommendations();
// rec.greetingLine, rec.cards, rec.primaryCta
```

### Record user data

```dart
await PulseBrain.instance.setFirstName('Jonathan');
await PulseBrain.instance.addFavouriteCompound('BPC-157');
await PulseBrain.instance.recordActivity();
```

### Add onboarding conversation

1. Create `assets/conversations/your_flow.json`
2. Register asset in `pubspec.yaml`
3. Navigate via `ConversationScreen(assetPath: '...')`
4. Update [Copy Bible](./Copy-Bible.md)

---

## Sprint checklist

Before opening a PR:

- [ ] Sprint goal only — no scope creep
- [ ] `flutter analyze` clean
- [ ] `flutter test` passing
- [ ] Copy in Copy Bible or Brain (not hardcoded)
- [ ] Motion uses `PulseMotion` tokens
- [ ] [Product Specs](./Product-Specs.md) updated
- [ ] [Roadmap](./Roadmap.md) updated — **do not reorder the locked sprint table**
- [ ] Relevant doc updated (Components, Architecture, etc.)
- [ ] Reduced motion tested

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Hardcoded "Good morning" in widget | Use `PulseBrain.instance.homeRecommendations()` |
| `Duration(milliseconds: 350)` inline | Use `PulseMotion.fast` |
| `Color(0xFF2EE8FF)` inline | Use `PulseColors.cyan` |
| "Coming soon" in UI | Use human copy from Copy Bible |
| Skipping docs in PR | Update docs — they're part of the product |

---

## Repository note

Pulse may live in its own repo (`pulse-app-` on GitHub) separate from MilePilot. The Flutter app root contains `lib/`, `assets/`, `docs/`, and `pubspec.yaml` at the top level.

---

## Getting help

1. Read [docs/README.md](./README.md) (60-minute onboarding)
2. Read [Architecture](./Architecture.md) for data flow
3. Search `lib/core/brain/` for decision logic
4. Check [Components](./Components.md) before building new widgets
