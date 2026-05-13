import { Card } from "@/hooks/useSpacedRepetition";

export interface RawVerse {
  verse_key: string;
  arabic_text: string;
  audio_url: string;
}

// Data for the "back" of the card
export interface AnswerVerse {
  arabic_text: string;
  audio_url: string;
}

export type VerseCard = Card &
  Omit<RawVerse, "verse_key"> & {
    answer_verses: AnswerVerse[]; // The 3 subsequent ayahs
  };

/**
 * Initializes raw verse data into valid SM-2 Card objects
 * Each card's 'back' contains the next 3 verses in the sequence.
 */
export function initializeCards(rawVerses: RawVerse[]): VerseCard[] {
  const now = Date.now();

  const cards: VerseCard[] = rawVerses.slice(0, -1).map((verse, index) => {
    // 1. Slice the next three verses from the array
    // index + 1 is the starting point, index + 4 is the end (exclusive)
    const nextThree = rawVerses.slice(index + 1, index + 4).map((v) => ({
      arabic_text: v.arabic_text,
      audio_url: v.audio_url,
    }));

    return {
      // Front of the card
      arabic_text: verse.arabic_text,
      audio_url: verse.audio_url,

      // Back of the card (The Answer)
      answer_verses: nextThree,

      // Metadata & SRS
      id: `card_${verse.verse_key}`,
      verseId: verse.verse_key,
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      nextReviewDate: now,
      isMastered: false,
    };
  });

  // Fisher-Yates shuffle algorithm
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}
