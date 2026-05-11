'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FlashcardReview } from '@/components/flashcard-review';
import { quranVerses } from '@/lib/data/quranic-verses';
import { SM2, CardState, ReviewResult } from '@/lib/srs/sm2-algorithm';

interface SessionCard {
  id: string;
  verseId: string;
  state: CardState;
  verse: (typeof quranVerses)[0];
}

export default function StudyPage() {
  const [sessionCards, setSessionCards] = useState<SessionCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewHistory, setReviewHistory] = useState<ReviewResult[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Initialize session with cards due for review
  useEffect(() => {
    // For MVP, we'll simulate cards that are due
    // In production, these would come from WatermelonDB
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
    const cardsDue = mockCards.filter((card) =>
      SM2.isDue(card.state)
    );

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
  };

  const handleGrade = (quality: number) => {
    if (currentCardIndex >= sessionCards.length) return;

    const currentCard = sessionCards[currentCardIndex];
    const result = SM2.calculateNextReview(currentCard.state, quality);

    setReviewHistory((prev) => [...prev, result]);

    // Move to next card
    if (currentCardIndex < sessionCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      // Session complete
      setIsSessionActive(false);
    }
  };

  const currentCard = sessionCards[currentCardIndex];
  const isSessionComplete = currentCardIndex >= sessionCards.length && isSessionActive === false;
  const cardsDue = sessionCards.length;

  // Calculate session stats
  const sessionStats = useMemo(() => {
    if (reviewHistory.length === 0) {
      return {
        totalReviewed: 0,
        avgQuality: 0,
        graduated: 0,
        sessionDuration: 0,
      };
    }

    const graduated = reviewHistory.filter((r) => r.isGraduated).length;
    const avgQuality = reviewHistory.reduce((sum, r) => sum + r.quality, 0) / reviewHistory.length;
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
    <main className="flex-1 bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Study Session</h1>
            <p className="text-gray-600 mt-2">
              Review verses with the spaced repetition system
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">← Back Home</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* No Cards Available */}
        {cardsDue === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-xl font-semibold text-gray-900 mb-4">
              No verses due for review today
            </p>
            <p className="text-gray-600 mb-6">
              Great job! All your verses are on schedule. Come back tomorrow to
              continue your studies.
            </p>
            <Link href="/verses">
              <Button>Browse Verse Library</Button>
            </Link>
          </Card>
        ) : isSessionActive && currentCard ? (
          <>
            {/* Active Study Session */}
            <FlashcardReview
              verse={currentCard.verse}
              currentIndex={currentCardIndex}
              totalCards={cardsDue}
              onGrade={handleGrade}
            />
          </>
        ) : isSessionComplete ? (
          <>
            {/* Session Complete Summary */}
            <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-green-700 mb-2">
                    Session Complete!
                  </h2>
                  <p className="text-gray-600">
                    Great work reviewing your verses today.
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-3xl font-bold text-blue-600">
                      {sessionStats.totalReviewed}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Verses Reviewed</p>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <p className="text-3xl font-bold text-green-600">
                      {sessionStats.graduated}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Graduated</p>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <p className="text-3xl font-bold text-indigo-600">
                      {sessionStats.avgQuality}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Avg Quality</p>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <p className="text-3xl font-bold text-orange-600">
                      {sessionStats.sessionDuration}m
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Duration</p>
                  </div>
                </div>

                {/* Quality Breakdown */}
                <div className="bg-white rounded-lg p-6 text-left">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Quality Distribution
                  </h3>
                  <div className="space-y-2">
                    {[0, 1, 2, 3, 4, 5].map((quality) => {
                      const count = reviewHistory.filter(
                        (r) => r.quality === quality
                      ).length;
                      const percentage =
                        reviewHistory.length > 0
                          ? (count / reviewHistory.length) * 100
                          : 0;
                      const labels = [
                        'Blackout',
                        'Difficult',
                        'Hard',
                        'Good',
                        'Easy',
                        'Perfect',
                      ];
                      return (
                        <div key={quality}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-700">
                              {labels[quality]}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {count}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-center pt-4">
                  <Link href="/">
                    <Button variant="outline">Back to Dashboard</Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setCurrentCardIndex(0);
                      setReviewHistory([]);
                      startSession();
                    }}
                  >
                    Review Again
                  </Button>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <>
            {/* Start Session */}
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Ready to Study?
              </h2>
              <p className="text-gray-600 mb-6">
                You have {cardsDue} verse{cardsDue !== 1 ? 's' : ''} due for review.
                Let&apos;s start your study session.
              </p>
              <Button size="lg" onClick={startSession}>
                Start Study Session
              </Button>
            </Card>

            {/* Tips */}
            <Card className="p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Study Tips</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>
                    Try to recite the verse from memory before looking at the
                    translation
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>
                    Grade honestly - your accuracy affects how often you&apos;ll
                    review this verse
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>
                    Use the audio features to practice your pronunciation
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>
                    Consistent daily study is more effective than cramming
                  </span>
                </li>
              </ul>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
