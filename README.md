# Hifz Revision Pro

A comprehensive Quranic memorization platform powered by Spaced Repetition (SM-2) and offline-first progress tracking.

## Features

- **Spaced Repetition (SM-2)**: Optimized review scheduling to maximize memorization efficiency.
- **Audio Comparison**: Record and compare recitations with reference audio for accuracy feedback.
- **Progress Dashboard**: Detailed statistics, charts, and metrics to track your journey.
- **Offline-First**: All data is stored locally via WatermelonDB for reliable offline use.
- **Responsive Design**: Seamless experience across desktop and mobile.

## Tech Stack

- **Framework**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: WatermelonDB (SQLite)
- **Audio**: Web Audio API

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to begin.

## Core Logic

### Spaced Repetition (SM-2)

Implemented in `lib/srs/sm2-algorithm.ts`, the system uses quality grades (0-5) to dynamically adjust review intervals and ease factors for each verse.

## Project Structure

- `app/`: Routing and page components (Dashboard, Study, Verses).
- `lib/`: Core logic for SRS, Audio processing, and Database schema.
- `hooks/`: Custom hooks for state management and SRS integration.
- `components/`: Reusable UI elements and feature-specific components.

## Development

- **Build**: `npm run build`
- **Test**: `npm run test`
- **Lint**: `npm run lint`

## License

MIT
