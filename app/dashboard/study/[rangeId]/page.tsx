"use client";
import React, { useEffect, useState, useMemo, use } from "react";
import { TopAppBar } from "@/components/landing/TopAppBar";
import { Footer } from "@/components/landing/Footer";
import { quranVerses } from "@/lib/data/quranic-verses";
import { SM2, ReviewResult } from "@/lib/srs/sm2-algorithm";
import { SessionCard, SessionStats } from "../_components/types";
import { EmptySession } from "../_components/EmptySession";
import { ReadySession } from "../_components/ReadySession";
import { SessionComplete } from "../_components/SessionComplete";
import { ActiveSession } from "../_components/ActiveSession";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StudyPage({
  params,
}: {
  params: Promise<{ rangeId: string }>;
}) {
  const rangeId = use(params).rangeId;
  const [sessionCards, setSessionCards] = useState<SessionCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewHistory, setReviewHistory] = useState<ReviewResult[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Initialize session with cards due for review
  useEffect(() => {
    // For MVP, we'll simulate cards that are due
    const mockCards: SessionCard[] = quranVerses.map((verse, index) => ({
      id: `card_${index}`,
      verseId: verse.id,
      state: {
        ...SM2.createInitialCard(),
        // Make first 5 verses due
        nextReviewDate: index < 5 ? Date.now() - 1000 : Date.now() + 86400000,
      },
      verse,
    }));

    // Filter only cards due for review
    const cardsDue = mockCards.filter((card) => SM2.isDue(card.state));

    setSessionCards(cardsDue);

    if (cardsDue.length === 0) {
      setIsSessionActive(false);
    }
  }, []);

  const startSession = () => {
    setIsSessionActive(true);
    setSessionStartTime(Date.now());
    setCurrentCardIndex(0);
    setReviewHistory([]);
    setShowAnswer(false);
  };

  const handleGrade = (quality: number) => {
    if (currentCardIndex >= sessionCards.length) return;

    const currentCard = sessionCards[currentCardIndex];
    const result = SM2.calculateNextReview(currentCard.state, quality);

    setReviewHistory((prev) => [...prev, result]);

    // Move to next card
    if (currentCardIndex < sessionCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      // Session complete
      setIsSessionActive(false);
    }
  };

  const currentCard = sessionCards[currentCardIndex];
  const isSessionComplete =
    currentCardIndex >= sessionCards.length && isSessionActive === false;
  const cardsDue = sessionCards.length;

  // Calculate session stats
  const sessionStats: SessionStats = useMemo(() => {
    if (reviewHistory.length === 0) {
      return {
        totalReviewed: 0,
        avgQuality: 0,
        graduated: 0,
        sessionDuration: 0,
      };
    }

    const graduated = reviewHistory.filter((r) => r.isGraduated).length;
    const avgQuality =
      reviewHistory.reduce((sum, r) => sum + r.quality, 0) /
      reviewHistory.length;
    const sessionDuration = sessionStartTime
      ? Math.round((Date.now() - sessionStartTime) / 60000)
      : 0;

    return {
      totalReviewed: reviewHistory.length,
      avgQuality: avgQuality.toFixed(1),
      graduated,
      sessionDuration,
    };
  }, [reviewHistory, sessionStartTime]);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col celestial-bg">
      <TopAppBar />

      <main className="flex-grow flex flex-col items-center justify-center px-gap-margin-mobile md:px-gap-margin-desktop py-gap-lg max-w-7xl mx-auto w-full">
        {cardsDue === 0 ? (
          <EmptySession />
        ) : isSessionActive && currentCard ? (
          <ActiveSession
            currentCardIndex={currentCardIndex}
            cardsDue={cardsDue}
            currentCard={currentCard}
            showAnswer={showAnswer}
            setShowAnswer={setShowAnswer}
            handleGrade={handleGrade}
          />
        ) : isSessionComplete ? (
          <SessionComplete
            sessionStats={sessionStats}
            startSession={startSession}
          />
        ) : (
          <ReadySession
            cardsDue={cardsDue}
            startSession={startSession}
            rangeId={rangeId}
          />
        )}
      </main>
    </div>
  );
}
