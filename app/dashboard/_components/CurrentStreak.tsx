import React, { useEffect, useState } from "react";
import {
  recordVisit,
  calculateCurrentStreak,
  seedStreakData,
} from "@/lib/streak";
import { initDatabase } from "@/lib/database/init";

export function CurrentStreak() {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    async function updateStreak() {
      try {
        await initDatabase();
        await recordVisit();
        // await seedStreakData();
        const currentStreak = await calculateCurrentStreak();
        setStreak(currentStreak);
      } catch (error) {
        console.error("Error updating streak:", error);
      }
    }

    updateStreak();
  }, []);

  return (
    <div className="md:col-span-4 bg-primary text-black p-7 relative overflow-hidden flex flex-col gap-6">
      <h3 className="text-sm font-medium text-black uppercase">
        Current Streak
      </h3>
      <div className="flex items-baseline gap-3">
        <span className="text-7xl font-bold leading-none">
          {streak !== null ? streak : "..."}
        </span>
        <span className="font-light">Days</span>
      </div>
      <p className="mt-3 text-2xl font-sans opacity-60 tracking-tighter">
        {streak && streak > 0
          ? "KEEP THE MOMENTUM GOING!"
          : "STAY STEADFAST, DEAR LEARNER."}
      </p>
    </div>
  );
}
