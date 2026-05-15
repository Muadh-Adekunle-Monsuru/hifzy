/**
 * SM-2 Algorithm Implementation
 * Based on: https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results
 *
 * The SM-2 algorithm is a spaced repetition algorithm that uses:
 * - Quality grade (0-5): User's response quality
 * - Interval: Days until next review
 * - Ease Factor: Difficulty multiplier (initially 2.5)
 */

export interface CardState {
  interval: number; // Days until next review
  easeFactor: number; // Difficulty multiplier (min 1.3)
  repetitions: number; // Times reviewed
  lastReviewDate: number; // Timestamp
  nextReviewDate: number; // Timestamp
}

export interface ReviewResult {
  repetitions: number;
  quality: number; // 0-5
  interval: number; // New interval
  easeFactor: number; // New ease factor
  nextReviewDate: number; // Timestamp of next review
  isGraduated: boolean; // True if card is mastered
}

// Quality grade meanings:
// 0 = complete blackout, wrong answer in all particulars
// 1 = blackout, correct answer recalled with serious difficulty
// 2 = difficulty, correct answer after a hesitation
// 3 = difficult, correct answer after some difficulty
// 4 = easy, correct answer despite some difficulty
// 5 = perfect, correct answer without the slightest hesitation

export class SM2 {
  private static readonly MIN_EASE_FACTOR = 1.3;
  private static readonly INITIAL_EASE_FACTOR = 2.5;

  /**
   * Calculate new card state after a review
   * @param currentState Current card state
   * @param quality Quality grade (0-5)
   * @returns New card state and review result
   */
  static calculateNextReview(
    currentState: CardState,
    quality: number,
  ): ReviewResult {
    if (quality < 0 || quality > 5) {
      throw new Error("Quality must be between 0 and 5");
    }

    // Ensure quality is between 0 and 5
    const q = Math.max(0, Math.min(5, quality));

    // Calculate new ease factor using SM-2 formula
    // EF' = EF + (0.1 - (5 - q) × (0.08 + (5 - q) × 0.02))
    let newEaseFactor =
      currentState.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

    // Ensure minimum ease factor
    newEaseFactor = Math.max(this.MIN_EASE_FACTOR, newEaseFactor);

    let newInterval: number;
    let newRepetitions: number;

    if (q < 3) {
      // Review again (failed answer)
      newInterval = 1;
      newRepetitions = 0;
    } else {
      // Successful answer
      newRepetitions = currentState.repetitions + 1;

      if (newRepetitions === 1) {
        newInterval = 1;
      } else if (newRepetitions === 2) {
        newInterval = 3;
      } else {
        // After second review, use ease factor
        newInterval = Math.round(currentState.interval * newEaseFactor);
      }
    }

    // Calculate next review date (add interval days to now)
    const nextReviewDate = Date.now() + newInterval * 24 * 60 * 60 * 1000;

    const isGraduated = newRepetitions >= 3 && q >= 3;

    return {
      quality: q,
      interval: newInterval,
      easeFactor: newEaseFactor,
      nextReviewDate,
      isGraduated,
    };
  }

  /**
   * Create initial card state
   */
  static createInitialCard(): CardState {
    const now = Date.now();
    return {
      interval: 0,
      easeFactor: this.INITIAL_EASE_FACTOR,
      repetitions: 0,
      lastReviewDate: now,
      nextReviewDate: now, // Due for review immediately
    };
  }

  /**
   * Check if a card is due for review
   */
  static isDue(cardState: CardState): boolean {
    return Date.now() >= cardState.nextReviewDate;
  }

  /**
   * Get cards due for review
   */
  static getCardsDue(cards: CardState[]): CardState[] {
    return cards.filter((card) => this.isDue(card));
  }

  /**
   * Calculate days until next review
   */
  static daysUntilReview(cardState: CardState): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysRemaining = Math.ceil(
      (cardState.nextReviewDate - Date.now()) / msPerDay,
    );
    return Math.max(0, daysRemaining);
  }

  /**
   * Format review date for display
   */
  static formatNextReview(cardState: CardState): string {
    const days = this.daysUntilReview(cardState);

    if (days === 0) {
      return "Due today";
    } else if (days === 1) {
      return "Due tomorrow";
    } else {
      return `Due in ${days} days`;
    }
  }

  /**
   * Get statistics about ease factor
   */
  static getEaseFactorLabel(easeFactor: number): string {
    if (easeFactor <= 1.5) return "Very Hard";
    if (easeFactor <= 2.0) return "Hard";
    if (easeFactor <= 2.5) return "Medium";
    if (easeFactor <= 3.0) return "Easy";
    return "Very Easy";
  }
}
