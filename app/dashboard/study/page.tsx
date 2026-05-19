"use client";
import { useSpacedRepetition } from "@/hooks/useSpacedRepetition";
import { initDatabase } from "@/lib/database/init";
import { Cards } from "@/lib/database/models/Cards";
import { ReviewLog } from "@/lib/database/models/ReviewLog";
import { SM2 } from "@/lib/srs/sm2-algorithm";
import { Q } from "@nozbe/watermelondb";
import { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ActiveSession } from "./_components/ActiveSession";
import { EmptySession } from "./_components/EmptySession";
import { ReadySession } from "./_components/ReadySession";
import { SessionComplete } from "./_components/SessionComplete";
import { getToken } from "@/lib/utils/auth";
import { useRouter, useSearchParams } from "next/navigation";

function StudyContent() {
  const searchParams = useSearchParams();
  const rangeId = searchParams.get("rangeId");
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [cards, setCards] = useState<Cards[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setAuthorized(true);
  }, [router]);

  useEffect(() => {
    if (!authorized || !rangeId) return;
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
  }, [rangeId, authorized]);

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
          record.lastReviewDate = new Date();
          record.isMastered = nextReview.interval > 30; // Mastered if interval > 30 days
        });

        await db.get<ReviewLog>("review_logs").create((log) => {
          log.cardId = currentCard.id;
          log.grade = quality;
          log.elapsedDays = Math.floor(
            (Date.now() - (currentCard.lastReviewDate || Date.now())) / 86400000,
          );
          log.scheduledDays = nextReview.interval;
          log.reviewedAt = new Date();
          log.createdAt = new Date();
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

  if (!authorized) {
    return (
      <div className="bg-[#131314] h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!rangeId) {
    return null; // Search param not ready yet or missing
  }

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

export default function StudyPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#131314] h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <StudyContent />
    </Suspense>
  );
}
