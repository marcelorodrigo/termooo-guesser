# termooo-guesser

Nuxt 3 SPA that helps solve [term.ooo](https://term.ooo) puzzles with a Wordle-like interface.

## Features

- Interactive 6x5 grid with click-to-cycle cell states (green/yellow/gray)
- Real-time ranked candidate list based on letter frequency
- Handles duplicate letters correctly
- Static deployment (GitHub Pages, Netlify, Vercel)

## Development

Install Node.js 24, then enable pnpm through Corepack. The project pins the
supported pnpm version in `package.json`.

```bash
npm install --global corepack@latest
corepack enable pnpm
```

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm generate
```

Output goes to `.output/public/`.

## Test

```bash
pnpm typecheck
pnpm test
```
