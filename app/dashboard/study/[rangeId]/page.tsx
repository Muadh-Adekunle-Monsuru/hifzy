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
import { useSpacedRepetition } from "@/hooks/useSpacedRepetition";
import { Cards } from "@/lib/database/models/Cards";
import { initDatabase } from "@/lib/database/init";
import { Q } from "@nozbe/watermelondb";
import { toast } from "sonner";

export default function StudyPage({
  params,
}: {
  params: Promise<{ rangeId: string }>;
}) {
  const rangeId = use(params).rangeId;
  const [cards, setCards] = useState<Cards[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  useEffect(() => {
    const fetchRanges = async () => {
      try {
        const db = await initDatabase();
        const rangesCollection = db.get<Cards>("cards");

        const filteredCards = await rangesCollection
          .query(Q.where("range_id", rangeId))
          .fetch();

        setCards(filteredCards);
      } catch (error) {
        toast.error("Failed to fetch cards");
        console.error("Failed to fetch cards:", error);
      }
    };

    fetchRanges();
  }, []);

  const formattedCards = useMemo(() => {
    return cards.map((card) => ({
      id: card.id,
      verseId: card.verseId,
      interval: card.interval,
      easeFactor: card.easeFactor,
      repetitions: card.repetitions,
      nextReviewDate: card.nextReviewDate?.getTime() ?? 0,
      isMastered: card.isMastered,
      arabicText: card.arabicText,
      audioUrl: card.audioUrl,
      answerVerses: card.answerVerses,
      lastReviewDate: card.lastReviewDate?.getTime() ?? 0,
    }));
  }, [cards]);

  const {
    currentCard,
    submitReview,
    isSessionComplete,
    cardsDue,
    currentCardIndex,
    resetSession,
    reviewHistory,
    sessionStats,
  } = useSpacedRepetition(formattedCards);

  const handleRating = async (quality: number) => {
    if (!currentCard) return;

    try {
      const db = await initDatabase();
      const cardRecord = await db.get<Cards>("cards").find(currentCard.id);

      const nextReview = SM2.calculateNextReview(
        {
          interval: currentCard.interval,
          easeFactor: currentCard.easeFactor,
          repetitions: currentCard.repetitions,
          nextReviewDate: currentCard.nextReviewDate,
          lastReviewDate: 0,
        },
        quality,
      );

      await db.write(async () => {
        await cardRecord.update((record) => {
          record.interval = nextReview.interval;
          record.easeFactor = nextReview.easeFactor;
          record.repetitions = nextReview.repetitions;
          record.nextReviewDate = new Date(nextReview.nextReviewDate);
          record.isMastered = nextReview.interval > 30; // Mastered if interval > 30 days
        });
      });

      // Update local cards state to reflect changes
      setCards((prev) =>
        prev.map((c) => (c.id === cardRecord.id ? cardRecord : c)),
      );

      submitReview(quality);
      setShowAnswer(false);
    } catch (error) {
      toast.error("Failed to save progress");
      console.error("Failed to update card:", error);
    }
  };

  const startSession = () => {
    setIsSessionActive(true);
    setShowAnswer(false);
  };

  return (
    <div className="dark bg-[#131314] text-white min-h-screen flex flex-col ">
      <main className="flex-grow flex flex-col items-center justify-center w-full mx-auto p-3">
        {cardsDue.length === 0 ? (
          <EmptySession rangeId={rangeId} />
        ) : isSessionActive && currentCard ? (
          <ActiveSession
            currentCardIndex={currentCardIndex}
            cardsDue={cardsDue.length}
            currentCard={currentCard}
            showAnswer={showAnswer}
            setShowAnswer={setShowAnswer}
            handleGrade={handleRating}
          />
        ) : isSessionComplete ? (
          <SessionComplete sessionStats={sessionStats} />
        ) : (
          <ReadySession
            cardsDue={cardsDue.length}
            startSession={startSession}
            rangeId={rangeId}
          />
        )}
      </main>
    </div>
  );
}
