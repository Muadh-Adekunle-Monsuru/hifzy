import { getDatabase } from "./database/init";
import { Visitation } from "./database/models/Visitation";
import { Cards } from "./database/models/Cards";
import { Q } from "@nozbe/watermelondb";

const getMidnight = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export async function recordVisit() {
  try {
    const db = getDatabase();
    const today = getMidnight(new Date());

    const existing = await db.get<Visitation>("visitation_logs")
      .query(Q.where("visit_date", today.getTime()))
      .fetch();

    if (existing.length === 0) {
      await db.write(async () => {
        await db.get<Visitation>("visitation_logs").create((visit) => {
          visit.visitDate = today;
          visit.createdAt = new Date();
        });
      });
    }
  } catch (error) {
    console.error("Failed to record visit:", error);
  }
}

export async function calculateCurrentStreak(): Promise<number> {
  try {
    const db = getDatabase();
    const visits = await db.get<Visitation>("visitation_logs").query().fetch();
    
    if (visits.length === 0) return 0;

    // Get unique midnight timestamps sorted descending
    const visitDates = Array.from(new Set(visits.map(v => getMidnight(v.visitDate).getTime())))
      .sort((a, b) => b - a);

    if (visitDates.length === 0) return 0;

    const today = getMidnight(new Date()).getTime();
    const yesterday = today - 86400000;

    let currentStreak = 0;
    let lastDate: number;

    // Check if the latest visit is today or yesterday
    if (visitDates[0] === today) {
      currentStreak = 1;
      lastDate = today;
    } else if (visitDates[0] === yesterday) {
      currentStreak = 1;
      lastDate = yesterday;
    } else {
      // Streak broken (last visit was before yesterday)
      return 0;
    }

    // Count backwards from the starting point
    for (let i = 1; i < visitDates.length; i++) {
      const expectedDate = lastDate - 86400000;
      if (visitDates[i] === expectedDate) {
        currentStreak++;
        lastDate = expectedDate;
      } else {
        // Gap found
        break;
      }
    }

    return currentStreak;
  } catch (error) {
    console.error("Failed to calculate streak:", error);
    return 0;
  }
}

export async function seedStreakData() {
  try {
    const db = getDatabase();
    const today = getMidnight(new Date());
    
    // Create records for the last 30 days (with some gaps for realism)
    await db.write(async () => {
      for (let i = 0; i < 30; i++) {
        // Skip some days randomly (70% visit rate)
        if (Math.random() < 0.3) continue;

        const date = new Date(today.getTime() - i * 86400000);
        
        // Check if already exists to avoid duplicates
        const existing = await db.get<Visitation>("visitation_logs")
          .query(Q.where("visit_date", date.getTime()))
          .fetch();
          
        if (existing.length === 0) {
          await db.get<Visitation>("visitation_logs").create((visit) => {
            visit.visitDate = date;
            visit.createdAt = new Date();
          });
        }
      }
    });
    console.log("Streak data seeded successfully!");
  } catch (error) {
    console.error("Failed to seed streak data:", error);
  }
}

export async function getVisitationHistory(days: number = 60): Promise<number[]> {
  try {
    const db = getDatabase();
    const today = getMidnight(new Date());
    const startDate = today.getTime() - days * 86400000;

    const visits = await db.get<Visitation>("visitation_logs")
      .query(Q.where("visit_date", Q.gte(startDate)))
      .fetch();

    return visits.map(v => getMidnight(v.visitDate).getTime());
  } catch (error) {
    console.error("Failed to get visitation history:", error);
    return [];
  }
}

export async function getReviewCountsByDay(days: number = 100): Promise<Map<number, number>> {
  try {
    const db = getDatabase();
    const startDate = getMidnight(new Date()).getTime() - days * 86400000;

    const cards = await db.get<Cards>("cards")
      .query(Q.where("last_review_date", Q.gte(startDate)))
      .fetch();

    const counts = new Map<number, number>();
    for (const card of cards) {
      if (card.lastReviewDate === null) continue;
      const midnight = getMidnight(card.lastReviewDate).getTime();
      counts.set(midnight, (counts.get(midnight) ?? 0) + 1);
    }

    return counts;
  } catch (error) {
    console.error("Failed to get review counts by day:", error);
    return new Map();
  }
}
