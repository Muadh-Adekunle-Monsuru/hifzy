"use client";

import { useCallback, useEffect, useState } from "react";
import { SM2, CardState, ReviewResult } from "@/lib/srs/sm2-algorithm";

export interface Card {
  id: string;
  verseId: string;
  arabicText: string;
  audioUrl: string;
  answerVerses: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReviewDate: number;
  isMastered: boolean;
}

export function useSpacedRepetition(cards: Card[]) {
  const [sessionQueue, setSessionQueue] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewHistory, setReviewHistory] = useState<ReviewResult[]>([]);

  // Initialize session queue when cards are provided
  useEffect(() => {
    if (cards.length > 0 && sessionQueue.length === 0) {
      const due = cards.filter((card) => SM2.isDue(card as CardState));
      setSessionQueue(due);
    }
  }, [cards, sessionQueue.length]);

  const currentCard = sessionQueue[currentCardIndex];

  const submitReview = useCallback(
    (quality: number) => {
      if (!currentCard) return;

      // Calculate new card state
      const result = SM2.calculateNextReview(currentCard as CardState, quality);

      // Add to review history
      setReviewHistory((prev) => [...prev, result]);

      // If card was failed (quality < 3), add it back to the end of the queue
      if (quality < 3) {
        setSessionQueue((prev) => [...prev, currentCard]);
      }

      // Move to next card in the queue
      setCurrentCardIndex((prev) => prev + 1);
    },
    [currentCard],
  );

  const resetSession = useCallback(() => {
    setCurrentCardIndex(0);
    setReviewHistory([]);
    setSessionQueue([]); // This will trigger re-initialization from props
  }, []);

  const isSessionComplete = sessionQueue.length > 0 && currentCardIndex >= sessionQueue.length;

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
    cardsDue: sessionQueue,
    currentCardIndex,
    reviewHistory,
    submitReview,
    resetSession,
    isSessionComplete,
    sessionStats,
  };
}
