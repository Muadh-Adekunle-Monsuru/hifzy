# Hifz Revision Pro

A comprehensive Quranic memorization learning platform powered by spaced repetition algorithm (SM-2), audio recording, and progress tracking.

## Features

- **Spaced Repetition System (SM-2)**: Uses the industry-standard SM-2 algorithm to optimize review scheduling and maximize memorization efficiency
- **Audio Recording & Comparison**: Record your recitation and compare it with reference audio using Web Audio API. Get detailed accuracy feedback
- **Progress Dashboard**: Track your memorization progress with detailed statistics, charts, and metrics
- **Offline-First Design**: All data is stored locally using WatermelonDB. Study anywhere without internet
- **Verse Library**: Browse and explore Quranic verses with Arabic text, transliteration, and English translation
- **Study Sessions**: Interactive study sessions with flashcard-style review and quality grading
- **Personalized Settings**: Customize notifications, audio quality, study preferences, and more

## Technology Stack

- **Frontend**: Next.js 15+ with React 19
- **UI Components**: shadcn/ui with Tailwind CSS
- **Local Database**: WatermelonDB (offline-first SQLite)
- **Audio Processing**: Web Audio API
- **Charts & Visualization**: Recharts
- **State Management**: Zustand
- **Forms**: React Hook Form

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Project Structure

```
app/
  page.tsx                 # Home/landing page
  layout.tsx              # Root layout with navigation
  study/page.tsx          # Study session page
  verses/page.tsx         # Verse library page
  dashboard/page.tsx      # Progress dashboard
  settings/page.tsx       # Settings page

components/
  verse-card.tsx          # Displays individual verses
  flashcard-review.tsx    # Study flashcard component
  audio-recorder.tsx      # Audio recording UI
  stats-summary.tsx       # Statistics display
  navigation.tsx          # App navigation bar

lib/
  data/
    quranic-verses.ts     # Sample Quranic verses data
  srs/
    sm2-algorithm.ts      # SM-2 algorithm implementation
  audio/
    recorder.ts           # Web Audio API wrapper
    comparison.ts         # Audio analysis & comparison
  database/
    schema.ts             # WatermelonDB schema
    init.ts               # Database initialization
  utils/
    progress.ts           # Progress tracking utilities

hooks/
  useSpacedRepetition.ts  # SRS state management hook
```

## Core Features

### 1. Spaced Repetition (SM-2)

The SM-2 algorithm is implemented in `lib/srs/sm2-algorithm.ts` with the following features:

- **Quality Grades**: 0-5 scale for rating recitation quality
- **Dynamic Intervals**: Intervals adjust based on performance (1 day → 3 days → 7 days → etc.)
- **Ease Factor**: Difficulty multiplier (starts at 2.5, minimum 1.3)
- **Repetition Tracking**: Counts successful repetitions to identify mastery

### 2. Audio Recording

- **Microphone Access**: Secure browser microphone access using `getUserMedia()`
- **Recording Formats**: Supports WebM, OGG, MP4, and WAV
- **Duration Tracking**: Accurate recording duration measurement
- **Playback**: Immediate playback of recorded audio

### 3. Audio Comparison

- **Fundamental Frequency Analysis**: Estimates the pitch/tone of recitation
- **Duration Matching**: Compares recitation duration with reference
- **Accuracy Scoring**: Generates 0-100% accuracy score with feedback
- **RMS Analysis**: Measures audio intensity for quality assessment

### 4. Verse Management

- **Sample Data**: Includes 15 verses from Surahs Al-Fatiha, Al-Baqarah, and Aal-e-Imran
- **Rich Content**: Arabic text, transliteration, English translation
- **Searchable**: Filter verses by surah and search text
- **Customizable**: Easy to add more verses to the library

## Usage

### Starting a Study Session

1. Navigate to the Study page
2. View verses due for review (determined by SM-2 schedule)
3. Review each verse and rate your recitation (0-5)
4. Optionally record your recitation for audio comparison
5. View session summary with statistics

### Adding Records

Each study session creates records in the database:

- **Cards**: SRS flashcard state (interval, ease factor, next review date)
- **Sessions**: Study session metadata (duration, accuracy)
- **Session Reviews**: Individual card reviews with quality grades
- **Audio Recordings**: User recordings with accuracy scores

### Tracking Progress

The dashboard displays:

- Overall progress percentage
- Verses mastered
- Cards due today
- Average accuracy
- Study streak
- Total study time
- Progress charts and graphs

## Database Schema

### Collections

- **verses**: Quranic verses with metadata
- **cards**: SRS flashcard state
- **sessions**: Study session records
- **session_reviews**: Individual review records
- **audio_recordings**: Audio recording data
- **progress**: Aggregated progress metrics

## SM-2 Algorithm Details

The implementation uses the original SM-2 formula:

```
Quality Grade (q): 0-5
Ease Factor Formula: EF' = EF + (0.1 - (5 - q) × (0.08 + (5 - q) × 0.02))
Minimum EF: 1.3

Interval Calculation:
- If q < 3: interval = 1 day, reset repetitions
- If repetitions = 1: interval = 1 day
- If repetitions = 2: interval = 3 days
- If repetitions ≥ 3: interval = previous_interval × new_EF
```

## Audio Comparison Algorithm

1. **Analyze both recordings** (reference and user)
   - Calculate RMS (intensity)
   - Estimate fundamental frequency using autocorrelation
   - Extract duration

2. **Compare metrics**:
   - Duration Match: ±20% tolerance
   - Frequency Match: Pitch/tone comparison
   - Overall Accuracy: Weighted average (60% duration, 40% frequency)

3. **Generate feedback** based on accuracy score

## Offline Functionality

All data is stored locally in WatermelonDB. The app works completely offline:

- Study sessions save automatically
- Audio recordings are stored locally
- Progress syncs to local database
- No internet connection required

## Customization

### Adding More Verses

Edit `lib/data/quranic-verses.ts`:

```typescript
export const quranVerses: QuranVerse[] = [
  {
    id: 'verse_2_5',
    surahNumber: 2,
    surahName: 'Al-Baqarah',
    ayahNumber: 5,
    arabicText: '...', // Add Arabic text
    transliteration: '...', // Add transliteration
    translation: '...', // Add English translation
  },
  // Add more verses...
];
```

### Changing Recording Quality

In `app/settings/page.tsx`, modify `audioQuality` options or change the default in `lib/audio/recorder.ts`

### Customizing SRS Parameters

Edit `lib/srs/sm2-algorithm.ts` to adjust:

- `MIN_EASE_FACTOR`: Minimum difficulty multiplier
- `INITIAL_EASE_FACTOR`: Starting ease factor for new cards

## Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm start
```

### Code Quality

- ESLint for code linting
- TypeScript for type safety
- Tailwind CSS for consistent styling

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: Audio recording requires HTTPS (or localhost for development)

## Future Enhancements

- Backend API integration for cloud sync
- Multiple user accounts
- Tajweed rule highlights
- AI-powered pronunciation feedback
- Adaptive difficulty adjustment
- Social features (leaderboards, groups)
- Mobile app (React Native)
- Hadith memorization support
- Custom verse collections

## Performance Notes

- WatermelonDB is optimized for mobile and offline use
- Audio analysis uses Web Audio API for client-side processing
- Charts use Recharts for efficient re-rendering
- All data persists in localStorage

## Privacy

Your data is yours:

- No servers track your activity
- No analytics or telemetry
- All processing happens locally
- Export your data anytime

## License

MIT

## Support

For issues or feature requests, please open an issue or contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: May 2026  
**Built with**: Next.js, React, TypeScript, Tailwind CSS
