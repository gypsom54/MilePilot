# Vector OS

Internal UI Lab and design system monorepo for the Vector project.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- [pnpm](https://pnpm.io/) 9

## Install

```bash
cd vector-os
pnpm install
```

## Run locally

### UI Lab (Storybook)

Browse and develop components in Storybook:

```bash
pnpm dev:storybook
```

Open [http://localhost:6006](http://localhost:6006).

### Website app shell

The public website is not built yet. A minimal Next.js app shell is available for future work:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
pnpm build
```

## Typecheck

```bash
pnpm typecheck
```

## Project structure

```txt
vector-os/
  apps/
    website/        # Next.js app (shell only — no public pages yet)
    storybook/      # UI Lab — Storybook
  packages/
    tokens/           # Design tokens
    ui/             # Reusable components (Button, …)
    icons/          # Icon components
    utils/          # Shared utilities
    types/          # Shared TypeScript types
  docs/
    engineering/    # Engineering documentation
    ux-bible/       # UX guidelines
  engineering-packs/
```

## Design tokens

Tokens are defined in `@vector-platform/tokens` and exposed as:

- **TypeScript** — `import { colors, spacing } from '@vector-platform/tokens'`
- **CSS** — `import '@vector-platform/tokens/tokens.css'` then use `var(--vector-*)` custom properties

Token categories: colours, typography, spacing, radius, shadows, motion.

## Components

The first component is **Button** with:

- Variants: Primary, Secondary, Ghost
- Sizes: Small, Medium, Large
- States: Default, Hover, Focus, Disabled, Loading

See all variants in Storybook under **Components / Button**.

## License

Private — Vector OS internal use.
