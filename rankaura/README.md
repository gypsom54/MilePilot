# RankAura

**Your AI Growth Employee** — an AI growth platform for small businesses.

This is the technical foundation. The dashboard shell is in place with placeholder sections ready for future modules.

## Getting started

```bash
cd rankaura
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/                  Next.js App Router pages & layout
components/
  dashboard/          Dashboard shell & section components
  ui/                 Reusable UI primitives
lib/                  Utilities & constants
services/             Data layer (module connections planned)
types/                Shared TypeScript types
styles/               Design tokens
```

## Future modules

| Module     | Role                          | Dashboard connection        |
| ---------- | ----------------------------- | --------------------------- |
| AuraCore   | Orchestrates all AI modules   | Unified dashboard state     |
| Scout      | Discovers opportunities       | Opportunities               |
| Writer     | Creates content               | AI Team Activity            |
| Optimiser  | Improves pages                | Today's Wins                |
| Architect  | Site structure insights       | Growth Momentum             |
| Publisher  | Publishing & visibility       | AI Team Activity, Autopilot |
| Analyst    | Performance metrics           | Growth Momentum, Today's Wins |

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
