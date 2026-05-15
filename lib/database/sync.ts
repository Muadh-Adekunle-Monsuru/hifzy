import { synchronize } from "@nozbe/watermelondb/sync";
import { getDatabase } from "./init";
import { getToken } from "../utils/auth";

const API_URL = "https://quran-be-59779bf2.fastapicloud.dev/sync";

export async function syncDatabase() {
  const database = getDatabase();
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      const response = await fetch(
        `${API_URL}/pull?last_pulled_at=${lastPulledAt || 0}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
      // Split the push into two steps to ensure decks exist before cards are processed
      // This is a workaround for servers that don't handle relational sync payloads in a single transaction

      // Step 1: Push Decks (Ranges)
      const deckChanges: any = {
        decks: {
          created: (changes.range?.created || []).map(
            mapLocalRangeToServerDeck,
          ),
          updated: (changes.range?.updated || []).map(
            mapLocalRangeToServerDeck,
          ),
          deleted: changes.range?.deleted || [],
        },
        cards: { created: [], updated: [], deleted: [] },
        review_logs: { created: [], updated: [], deleted: [] },
        preferences: { created: [], updated: [], deleted: [] },
      };

      console.log("Pushing Decks:", JSON.stringify(deckChanges, null, 2));

      const deckResponse = await fetch(
        `${API_URL}/push?last_pulled_at=${lastPulledAt || 0}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
      const cardChanges: any = {
        decks: { created: [], updated: [], deleted: [] },
        cards: {
          created: (changes.cards?.created || []).map(mapLocalCardToServerCard),
          updated: (changes.cards?.updated || []).map(mapLocalCardToServerCard),
          deleted: changes.cards?.deleted || [],
        },
        review_logs: { created: [], updated: [], deleted: [] },
        preferences: { created: [], updated: [], deleted: [] },
      };

      console.log("Pushing Cards:", JSON.stringify(cardChanges, null, 2));

      const cardResponse = await fetch(
        `${API_URL}/push?last_pulled_at=${lastPulledAt || 0}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
  });
}

// Helpers for Decks <-> Range
function mapServerDeckToLocalRange(deck: any) {
  const [startSurah, startAyah] = (deck.range_start || "").split(":");
  const [endSurah, endAyah] = (deck.range_end || "").split(":");

  return {
    id: deck.id,
    start_surah_number: isNaN(Number(startSurah)) ? null : Number(startSurah),
    start_ayah_number: isNaN(Number(startAyah)) ? null : Number(startAyah),
    end_surah_number: isNaN(Number(endSurah)) ? null : Number(endSurah),
    end_ayah_number: isNaN(Number(endAyah)) ? null : Number(endAyah),
    reciter: deck.recitation_id || 1,
    created_at: new Date(deck.created_at).getTime(),
  };
}

function mapLocalRangeToServerDeck(range: any) {
  return {
    id: range.id,
    name: `${range.start_surah_number}:${range.start_ayah_number}`,
    range_start: `${range.start_surah_number}:${range.start_ayah_number}`,
    range_end: `${range.end_surah_number}:${range.end_ayah_number}`,
    recitation_id: range.reciter,
  };
}

// Helpers for Cards
function mapServerCardToLocalCard(card: any) {
  return {
    id: card.id,
    range_id: card.deck_id,
    verse_id: card.verse_key,
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
    stability: 0,
    difficulty: card.ease_factor || 250,
    reps: card.repetitions || 0,
    lapses: 0,
    state: card.is_mastered ? "mastered" : "learning",
    due_date: new Date(card.next_review_date).toISOString(),
  };
}
