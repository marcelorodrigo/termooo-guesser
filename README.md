# termooo-guesser

Nuxt 3 SPA that helps solve [term.ooo](https://term.ooo) puzzles with a Wordle-like interface.

## Features

- Interactive 6x5 grid with click-to-cycle cell states (green/yellow/gray)
- Real-time ranked candidate list based on letter frequency
- Handles duplicate letters correctly
- Static deployment (GitHub Pages, Netlify, Vercel)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run generate
```

Output goes to `.output/public/`.

## Test

```bash
npm test
```
