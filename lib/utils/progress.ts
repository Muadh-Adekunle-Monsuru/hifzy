/**
 * Progress tracking utilities for Hifz Revision Pro
 */

export interface ProgressMetrics {
  totalVerses: number;
  memorizedCount: number;
  masteredCards: number;
  cardsDueToday: number;
  averageAccuracy: number;
  studyStreak: number;
  lastStudyDate?: number;
  totalStudyMinutes: number;
}

export interface CardMetrics {
  totalCards: number;
  masteredCards: number;
  learningCards: number;
  reviewCards: number;
  newCards: number;
}

/**
 * Calculate progress percentage
 */
export function calculateProgressPercentage(
  memorized: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((memorized / total) * 100);
}

/**
 * Calculate study streak
 * @param lastStudyDate Last study session timestamp
 * @returns Current streak in days
 */
export function calculateStudyStreak(lastStudyDate?: number): number {
  if (!lastStudyDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(lastStudyDate);
  lastDate.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If last study was today or yesterday, streak continues
  if (daysDiff <= 1) {
    return daysDiff === 0 ? 1 : 1; // Today or continuing from yesterday
  }

  return 0; // Streak broken
}

/**
 * Format study time
 */
export function formatStudyTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

/**
 * Get accuracy level label
 */
export function getAccuracyLabel(accuracy: number): string {
  if (accuracy >= 90) return 'Excellent';
  if (accuracy >= 75) return 'Good';
  if (accuracy >= 60) return 'Fair';
  if (accuracy >= 45) return 'Needs Improvement';
  return 'Poor';
}

/**
 * Get card status label
 */
export function getCardStatus(
  repetitions: number,
  interval: number
): 'new' | 'learning' | 'review' | 'mastered' {
  if (repetitions === 0) return 'new';
  if (repetitions < 3) return 'learning';
  if (interval < 21) return 'review';
  return 'mastered';
}

/**
 * Categorize cards by status
 */
export function categorizeCards(
  cards: Array<{
    repetitions: number;
    interval: number;
    isMastered: boolean;
  }>
): CardMetrics {
  const metrics: CardMetrics = {
    totalCards: cards.length,
    masteredCards: 0,
    learningCards: 0,
    reviewCards: 0,
    newCards: 0,
  };

  cards.forEach((card) => {
    if (card.isMastered) {
      metrics.masteredCards += 1;
    } else if (card.repetitions === 0) {
      metrics.newCards += 1;
    } else if (card.repetitions < 3) {
      metrics.learningCards += 1;
    } else {
      metrics.reviewCards += 1;
    }
  });

  return metrics;
}

/**
 * Calculate next milestone
 */
export function getNextMilestone(
  memorized: number,
  total: number
): { target: number; remaining: number } {
  const milestones = [5, 10, 25, 50, 100, total];
  const nextMilestone = milestones.find((m) => m > memorized) || total;

  return {
    target: nextMilestone,
    remaining: nextMilestone - memorized,
  };
}
