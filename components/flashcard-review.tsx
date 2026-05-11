'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { QuranVerse } from '@/lib/data/quranic-verses';
import { SM2 } from '@/lib/srs/sm2-algorithm';

interface FlashcardReviewProps {
  verse: QuranVerse;
  currentIndex: number;
  totalCards: number;
  onGrade: (quality: number) => void;
  isFlipped?: boolean;
}

const QUALITY_GRADES = [
  {
    value: 0,
    label: 'Blackout',
    description: 'Complete blackout, wrong answer',
    color: 'bg-red-100 hover:bg-red-200 text-red-700',
  },
  {
    value: 1,
    label: 'Difficult',
    description: 'Correct with serious difficulty',
    color: 'bg-orange-100 hover:bg-orange-200 text-orange-700',
  },
  {
    value: 2,
    label: 'Hard',
    description: 'Correct after hesitation',
    color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700',
  },
  {
    value: 3,
    label: 'Good',
    description: 'Correct with some difficulty',
    color: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
  },
  {
    value: 4,
    label: 'Easy',
    description: 'Correct despite some difficulty',
    color: 'bg-green-100 hover:bg-green-200 text-green-700',
  },
  {
    value: 5,
    label: 'Perfect',
    description: 'Correct without hesitation',
    color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700',
  },
];

export function FlashcardReview({
  verse,
  currentIndex,
  totalCards,
  onGrade,
  isFlipped = false,
}: FlashcardReviewProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const progress = Math.round(((currentIndex + 1) / totalCards) * 100);

  return (
    <div className="w-full space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-700">
            Card {currentIndex + 1} of {totalCards}
          </p>
          <p className="text-sm text-gray-600">{progress}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="space-y-6">
          {/* Surah Info */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {verse.surahName}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Surah {verse.surahNumber}, Ayah {verse.ayahNumber}
            </p>
          </div>

          {/* Arabic Text */}
          <div className="bg-white p-6 rounded-lg border border-blue-200">
            <p
              className="text-4xl leading-relaxed text-right text-gray-900 font-serif"
              dir="rtl"
            >
              {verse.arabicText}
            </p>
          </div>

          {/* Transliteration */}
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Transliteration
            </p>
            <p className="text-lg italic text-gray-700">
              {verse.transliteration}
            </p>
          </div>

          {/* Translation Toggle */}
          <div className="text-center">
            <Button
              variant={showTranslation ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowTranslation(!showTranslation)}
            >
              {showTranslation ? 'Hide' : 'Show'} Translation
            </Button>
          </div>

          {/* Translation */}
          {showTranslation && (
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                {verse.translation}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Grading Section */}
      <div className="space-y-4">
        <p className="text-center text-sm font-semibold text-gray-700">
          How well did you recite this verse?
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {QUALITY_GRADES.map((grade) => (
            <Button
              key={grade.value}
              onClick={() => onGrade(grade.value)}
              className={`h-auto py-3 flex flex-col items-center gap-1 ${grade.color}`}
              variant="ghost"
            >
              <span className="font-bold text-sm">{grade.label}</span>
              <span className="text-xs opacity-75">{grade.description}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-gray-600">
          Grade based on how accurately you recited the verse. Perfect means
          you remembered and recited it flawlessly. Blackout means you
          couldn&apos;t remember it correctly.
        </p>
      </div>
    </div>
  );
}
