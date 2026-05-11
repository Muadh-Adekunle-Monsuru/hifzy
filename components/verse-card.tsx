'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import type { QuranVerse } from '@/lib/data/quranic-verses';

interface VerseCardProps {
  verse: QuranVerse;
  isSelected?: boolean;
  onClick?: () => void;
}

export function VerseCard({
  verse,
  isSelected = false,
  onClick,
}: VerseCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`p-6 cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'hover:border-gray-400'
      }`}
    >
      <div className="space-y-4">
        {/* Surah Info */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {verse.surahName}
            </h3>
            <p className="text-sm text-gray-600">
              Surah {verse.surahNumber}, Ayah {verse.ayahNumber}
            </p>
          </div>
        </div>

        {/* Arabic Text */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <p
            className="text-2xl leading-relaxed text-right text-gray-900 font-serif"
            dir="rtl"
          >
            {verse.arabicText}
          </p>
        </div>

        {/* Transliteration */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
            Transliteration
          </p>
          <p className="text-sm text-gray-700 italic">
            {verse.transliteration}
          </p>
        </div>

        {/* Translation */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
            Translation
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {verse.translation}
          </p>
        </div>
      </div>
    </Card>
  );
}
