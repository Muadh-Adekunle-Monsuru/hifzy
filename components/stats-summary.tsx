'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import {
  calculateProgressPercentage,
  getAccuracyLabel,
  formatStudyTime,
} from '@/lib/utils/progress';

export interface StatsSummaryProps {
  totalVerses: number;
  memorizedCount: number;
  masteredCards: number;
  cardsDueToday: number;
  averageAccuracy: number;
  studyStreak: number;
  totalStudyMinutes: number;
}

export function StatsSummary({
  totalVerses,
  memorizedCount,
  masteredCards,
  cardsDueToday,
  averageAccuracy,
  studyStreak,
  totalStudyMinutes,
}: StatsSummaryProps) {
  const progressPercentage = calculateProgressPercentage(
    memorizedCount,
    totalVerses
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Progress */}
      <Card className="p-4 text-center hover:shadow-md transition-shadow">
        <div className="text-3xl font-bold text-blue-600">{progressPercentage}%</div>
        <p className="text-xs text-gray-600 font-semibold mt-2">
          Progress ({memorizedCount}/{totalVerses})
        </p>
      </Card>

      {/* Mastered */}
      <Card className="p-4 text-center hover:shadow-md transition-shadow">
        <div className="text-3xl font-bold text-green-600">{masteredCards}</div>
        <p className="text-xs text-gray-600 font-semibold mt-2">Mastered</p>
      </Card>

      {/* Due Today */}
      <Card className="p-4 text-center hover:shadow-md transition-shadow">
        <div className="text-3xl font-bold text-orange-600">
          {cardsDueToday}
        </div>
        <p className="text-xs text-gray-600 font-semibold mt-2">Due Today</p>
      </Card>

      {/* Accuracy */}
      <Card className="p-4 text-center hover:shadow-md transition-shadow">
        <div className="text-3xl font-bold text-indigo-600">
          {averageAccuracy.toFixed(0)}%
        </div>
        <p className="text-xs text-gray-600 font-semibold mt-2">
          {getAccuracyLabel(averageAccuracy)}
        </p>
      </Card>

      {/* Study Streak */}
      <Card className="p-4 text-center hover:shadow-md transition-shadow">
        <div className="text-3xl font-bold text-red-600">{studyStreak}</div>
        <p className="text-xs text-gray-600 font-semibold mt-2">
          Day Streak
        </p>
      </Card>

      {/* Total Study Time */}
      <Card className="p-4 text-center hover:shadow-md transition-shadow">
        <div className="text-lg font-bold text-purple-600">
          {formatStudyTime(totalStudyMinutes)}
        </div>
        <p className="text-xs text-gray-600 font-semibold mt-2">
          Total Study
        </p>
      </Card>
    </div>
  );
}
