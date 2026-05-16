import { synchronize } from "@nozbe/watermelondb/sync";
import { getDatabase } from "./init";
import { apiFetch } from "../utils/auth";
import { surahDetail } from "@/app/dashboard/_components/SurahDetails";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/sync`;

export async function syncDatabase() {
  const database = getDatabase();

  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      const response = await apiFetch(
        `${API_URL}/pull?last_pulled_at=${lastPulledAt || 0}`,
      );

      if (!response.ok) {
        throw new Error(`Sync pull failed: ${await response.text()}`);
      }

      const { changes: serverChanges, timestamp } = await response.json();
      // Map server tables to local tables
      const mappedChanges: any = {
        range: {
          created: (serverChanges.decks?.created || []).map(
            mapServerDeckToLocalRange,
          ),
          updated: (serverChanges.decks?.updated || []).map(
            mapServerDeckToLocalRange,
          ),
          deleted: serverChanges.decks?.deleted || [],
        },
        cards: {
          created: (serverChanges.cards?.created || []).map(
            mapServerCardToLocalCard,
          ),
          updated: (serverChanges.cards?.updated || []).map(
            mapServerCardToLocalCard,
          ),
          deleted: serverChanges.cards?.deleted || [],
        },
      };

      return { changes: mappedChanges, timestamp };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      // Step 1: Push Decks (Ranges)
      // Track page-mode range IDs that are skipped (unsupported server-side)
      const skippedPageModeRangeIds = new Set<string>();

      const deckChanges: any = {
        decks: {
          created: (changes.range?.created || []).flatMap((range: any) => {
            const mapped = mapLocalRangeToServerDeck(range);
            if (!mapped) {
              skippedPageModeRangeIds.add(range.id);
              return [];
            }
            return [mapped];
          }),
          updated: (changes.range?.updated || []).flatMap((range: any) => {
            const mapped = mapLocalRangeToServerDeck(range);
            if (!mapped) {
              skippedPageModeRangeIds.add(range.id);
              return [];
            }
            return [mapped];
          }),
          deleted: changes.range?.deleted || [],
        },
        cards: { created: [], updated: [], deleted: [] },
        review_logs: { created: [], updated: [], deleted: [] },
        preferences: { created: [], updated: [], deleted: [] },
      };

      const deckResponse = await apiFetch(
        `${API_URL}/push?last_pulled_at=${lastPulledAt || 0}`,
        {
          method: "POST",
          body: JSON.stringify({
            changes: deckChanges,
            lastPulledAt: lastPulledAt || 0,
          }),
        },
      );

      if (!deckResponse.ok) {
        throw new Error(`Deck sync failed: ${await deckResponse.text()}`);
      }

      // Step 2: Push Cards
      // Collect card IDs belonging to skipped page-mode ranges so we can
      // also exclude their review-log entries
      const skippedCardIds = new Set<string>();

      const filteredCardsCreated = (changes.cards?.created || []).filter(
        (card: any) => {
          if (skippedPageModeRangeIds.has(card.range_id)) {
            skippedCardIds.add(card.id);
            return false;
          }
          return true;
        },
      );
      const filteredCardsUpdated = (changes.cards?.updated || []).filter(
        (card: any) => {
          if (skippedPageModeRangeIds.has(card.range_id)) {
            skippedCardIds.add(card.id);
            return false;
          }
          return true;
        },
      );

      const cardChanges: any = {
        decks: { created: [], updated: [], deleted: [] },
        cards: {
          created: filteredCardsCreated.map(mapLocalCardToServerCard),
          updated: filteredCardsUpdated.map(mapLocalCardToServerCard),
          deleted: changes.cards?.deleted || [],
        },
        review_logs: {
          created: (changes.review_logs?.created || []).filter(
            (log: any) => !skippedCardIds.has(log.card_id),
          ).map(mapLocalReviewLogToServer),
          updated: (changes.review_logs?.updated || []).filter(
            (log: any) => !skippedCardIds.has(log.card_id),
          ).map(mapLocalReviewLogToServer),
          deleted: [],
        },
        preferences: { created: [], updated: [], deleted: [] },
      };

      const cardResponse = await apiFetch(
        `${API_URL}/push?last_pulled_at=${lastPulledAt || 0}`,
        {
          method: "POST",
          body: JSON.stringify({
            changes: cardChanges,
            lastPulledAt: lastPulledAt || 0,
          }),
        },
      );

      if (!cardResponse.ok) {
        throw new Error(`Card sync failed: ${await cardResponse.text()}`);
      }
    },
    sendCreatedAsUpdated: true,
  });
}

// Helpers for Decks <-> Range
function mapServerDeckToLocalRange(deck: any) {
  const rangeStart = deck.range_start || "";
  const rangeEnd = deck.range_end || "";

  if (rangeStart.startsWith("page:")) {
    const [, startPage] = rangeStart.split(":");
    const [, endPage] = rangeEnd.split(":");
    return {
      id: deck.id,
      start_page: Number(startPage),
      end_page: Number(endPage),
      reciter: deck.recitation_id || 1,
      created_at: new Date(deck.created_at).getTime(),
    };
  }

  // Fallback to surah mode
  const [startSurah, startAyah] = rangeStart.split(":");
  const [endSurah, endAyah] = rangeEnd.split(":");

  const sSurahNum = Number(startSurah);
  const eSurahNum = Number(endSurah);

  const startSurahData = surahDetail.find((s) => s.id === sSurahNum);
  const endSurahData = surahDetail.find((s) => s.id === eSurahNum);

  return {
    id: deck.id,
    start_surah_number: isNaN(sSurahNum) ? null : sSurahNum,
    start_surah_name: startSurahData?.transliteration || "",
    start_ayah_number: isNaN(Number(startAyah)) ? null : Number(startAyah),
    end_surah_number: isNaN(eSurahNum) ? null : eSurahNum,
    end_surah_name: endSurahData?.transliteration || "",
    end_ayah_number: isNaN(Number(endAyah)) ? null : Number(endAyah),
    reciter: deck.recitation_id || 1,
    created_at: new Date(deck.created_at).getTime(),
  };
}

function mapLocalRangeToServerDeck(range: any): object | null {
  // page-mode ranges require server-side resolution; skip until supported
  if (!range.start_surah_number) return null;

  const isSurahMode = !!range.start_surah_number;
  return {
    id: range.id,
    name: isSurahMode
      ? `${range.start_surah_number}:${range.start_ayah_number}`
      : `page:${range.start_page}:${range.end_page}`,
    range_start: isSurahMode
      ? `${range.start_surah_number}:${range.start_ayah_number}`
      : `page:${range.start_page}`,
    range_end: isSurahMode
      ? `${range.end_surah_number}:${range.end_ayah_number}`
      : `page:${range.end_page}`,
    recitation_id: range.reciter,
  };
}

// Helpers for Cards
function mapServerCardToLocalCard(card: any) {
  return {
    id: card.id,
    range_id: card.deck_id,
    verse_id: card.verse_key,
    arabic_text: card.arabic_text || "",
    audio_url: card.audio_url || "",
    answer_verses: card.answer_verses || "[]",
    ease_factor: card.difficulty || 250,
    repetitions: card.reps || 0,
    next_review_date: new Date(card.due_date).getTime(),
    is_mastered: card.state === "mastered",
    created_at: new Date(card.updated_at).getTime(),
  };
}

function mapLocalCardToServerCard(card: any) {
  return {
    id: card.id,
    deck_id: card.range_id,
    verse_key: card.verse_id,
    arabic_text: card.arabic_text,
    audio_url: card.audio_url,
    answer_verses: card.answer_verses,
    stability: card.interval || 0,
    difficulty: card.ease_factor || 250,
    reps: card.repetitions || 0,
    lapses: 0,
    state: card.is_mastered ? "mastered" : "learning",
    due_date: new Date(card.next_review_date).toISOString(),
  };
}

// Helpers for Review Logs
function mapLocalReviewLogToServer(log: any) {
  return {
    id: log.id,
    card_id: log.card_id,
    grade: log.grade,
    elapsed_days: log.elapsed_days,
    scheduled_days: log.scheduled_days,
    reviewed_at: new Date(log.reviewed_at).toISOString(),
  };
}
