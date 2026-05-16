# Hifzy: Frontend

The Next.js client for Hifzy, an offline-first Quran memorisation companion powered by spaced repetition (SM-2) and voice recording.

## Features

- **Spaced Repetition (SM-2)**: Optimized review scheduling to maximize memorization efficiency.
- **Audio Recording & Comparison**: Record and compare recitations with reference audio for accuracy feedback.
- **Progress Dashboard**: Detailed statistics, charts, and metrics to track your journey.
- **Offline-First**: All data is stored locally via WatermelonDB (LokiJS adapter, IndexedDB) for reliable offline use.
- **QF API Integration**: Syncs review activity to Quran.com via the backend bridge.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI, Framer Motion, Lucide React
- **Database**: WatermelonDB (LokiJS adapter, IndexedDB)
- **Audio**: Web Audio API (MediaRecorder)

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

### Sync Protocol

Review logs are synced to the backend via WatermelonDB's `synchronize()` protocol — a two-phase push that sends decks first, then cards and review logs. The backend forwards activity to Quran.com asynchronously.

## Project Structure

- `app/`: Routing and page components (Dashboard, Study, Auth).
- `lib/`: Core logic for SRS, Audio processing, Database schema, and sync.
- `hooks/`: Custom hooks for state management and SRS integration.
- `components/`: Reusable UI elements and feature-specific components.

## Development

- **Build**: `npm run build`
- **Test**: `npm run test`
- **Lint**: `npm run lint`

## Related

- **Backend repo**: [github.com/OyekuA/Hifzy-Backend](https://github.com/OyekuA/Hifzy-Backend)
- **Live demo**: [hifzy-srs.vercel.app](https://hifzy-srs.vercel.app)

## License

MIT
