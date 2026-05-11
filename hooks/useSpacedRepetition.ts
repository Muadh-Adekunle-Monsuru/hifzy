'use client';

import { useCallback, useEffect, useState } from 'react';
import { SM2, CardState, ReviewResult } from '@/lib/srs/sm2-algorithm';

export interface Card {
  id: string;
  verseId: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReviewDate: number;
  isMastered: boolean;
}

export function useSpacedRepetition(cards: Card[]) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewHistory, setReviewHistory] = useState<ReviewResult[]>([]);

  // Get cards due for review
  const cardsDue = cards.filter((card) => SM2.isDue(card as CardState));

  const currentCard = cardsDue[currentCardIndex];

  const submitReview = useCallback(
    (quality: number) => {
      if (!currentCard) return;

      // Calculate new card state
      const result = SM2.calculateNextReview(currentCard as CardState, quality);

      // Add to review history
      setReviewHistory((prev) => [...prev, result]);

      // Move to next card
      if (currentCardIndex < cardsDue.length - 1) {
        setCurrentCardIndex((prev) => prev + 1);
      } else {
        // Session complete
        setCurrentCardIndex(0);
      }
    },
    [currentCard, currentCardIndex, cardsDue.length]
  );

  const resetSession = useCallback(() => {
    setCurrentCardIndex(0);
    setReviewHistory([]);
  }, []);

  const isSessionComplete = currentCardIndex >= cardsDue.length;

  const sessionStats = {
    totalReviewed: reviewHistory.length,
    avgQuality:
      reviewHistory.length > 0
        ? reviewHistory.reduce((sum, r) => sum + r.quality, 0) /
          reviewHistory.length
        : 0,
    graduated: reviewHistory.filter((r) => r.isGraduated).length,
  };

  return {
    currentCard,
    cardsDue,
    currentCardIndex,
    reviewHistory,
    submitReview,
    resetSession,
    isSessionComplete,
    sessionStats,
  };
}
