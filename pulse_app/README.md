# Pulse

**Keep your finger on the Pulse.**

Premium Flutter app — calm, personal, intelligent.

---

## Documentation

**New developer?** Start here → **[docs/README.md](docs/README.md)** (60-minute onboarding)

| Doc | Purpose |
|-----|---------|
| [Architecture](docs/Architecture.md) | How the app is built |
| [Design System](docs/Design-System.md) | Colors, type, spacing |
| [Components](docs/Components.md) | Widget catalogue |
| [Copy Bible](docs/Copy-Bible.md) | Voice and approved copy |
| [Roadmap](docs/Roadmap.md) | Sprint plan |

---

## Run locally

```bash
flutter pub get
flutter run -d chrome
```

```bash
flutter analyze
flutter test
```

---

## What's shipped (locked roadmap)

| Sprint | Objective | Status |
|--------|-----------|--------|
| 1 | Brand Identity | ✅ Complete |
| 2 | Architecture & Foundation | ✅ Complete |
| 3 | Perfect First Impression | 🔨 Next |

See **[docs/Roadmap.md](docs/Roadmap.md)** for the full locked plan.

---

## Project structure

```
lib/
  core/brain/       Decision engine
  core/conversation/ JSON onboarding
  core/motion/      Animation tokens
  core/theme/       Design tokens
  screens/          App surfaces
  widgets/          Reusable components
assets/conversations/ Onboarding scripts
docs/               Product documentation
```

---

## Principles

**Optimise for delight, not speed.**

Documentation is part of the product. Every sprint updates `docs/`.
