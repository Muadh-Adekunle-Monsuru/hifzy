"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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
  lastReviewDate: number;
  nextReviewDate: number;
  isMastered: boolean;
}

export interface ReviewedCard {
  card: Card;        // updated card state (with isMastered, new interval, etc.)
  result: ReviewResult;
}

export function useSpacedRepetition(cards: Card[]) {
  const [sessionQueue, setSessionQueue] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewHistory, setReviewHistory] = useState<ReviewedCard[]>([]);
  
  // Track cards prop identity to detect real changes
  const cardsRef = useRef(cards);

  useEffect(() => {
    // Only re-initialize if the cards reference changed significantly (new deck loaded)
    // or if we have no queue yet. We check the first card ID to detect a "new deck".
    const isNewDeck = 
      cardsRef.current.length > 0 && 
      cards.length > 0 && 
      cards[0].id !== cardsRef.current[0].id;

    if (isNewDeck || sessionQueue.length === 0) {
      cardsRef.current = cards;
      const due = cards.filter((card) => SM2.isDue(card as CardState));
      setSessionQueue(due);
      setCurrentCardIndex(0);
      setReviewHistory([]);
    }
    cardsRef.current = cards;
  }, [cards]);

  const currentCard = sessionQueue[currentCardIndex] ?? null;

  const submitReview = useCallback(
    (quality: number) => {
      if (!currentCard) return;

      const result = SM2.calculateNextReview(currentCard as CardState, quality);

      // Build the updated card with ALL new SM-2 state + isMastered
      const updatedCard: Card = {
        ...currentCard,
        interval: result.interval,
        easeFactor: result.easeFactor,
        repetitions: result.repetitions,
        lastReviewDate: Date.now(),
        nextReviewDate: result.nextReviewDate,
        isMastered: result.isGraduated,
      };

      // Record history with the updated card snapshot
      setReviewHistory((prev) => [...prev, { card: updatedCard, result }]);

      setSessionQueue((prev) => {
        // Replace the current card's stale entry with the updated state
        const next = prev.map((c, i) =>
          i === currentCardIndex ? updatedCard : c
        );
        // If failed (Again/Good quality < 3), push a fresh copy to the end for re-review
        if (quality < 3) {
          return [...next, updatedCard];
        }
        return next;
      });

      setCurrentCardIndex((prev) => prev + 1);
    },
    [currentCard, currentCardIndex],
  );

  const resetSession = useCallback(() => {
    const due = cardsRef.current.filter((card) =>
      SM2.isDue(card as CardState)
    );
    setSessionQueue(due);
    setCurrentCardIndex(0);
    setReviewHistory([]);
  }, []);

  const isSessionComplete =
    sessionQueue.length > 0 && currentCardIndex >= sessionQueue.length;

  const sessionStats = {
    total: sessionQueue.length,
    totalReviewed: reviewHistory.length,
    remaining: Math.max(0, sessionQueue.length - currentCardIndex),
    avgQuality:
      reviewHistory.length > 0
        ? reviewHistory.reduce((sum, r) => sum + r.result.quality, 0) /
          reviewHistory.length
        : 0,
    graduated: reviewHistory.filter((r) => r.result.isGraduated).length,
    mastered: reviewHistory.filter((r) => r.card.isMastered).length,
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
