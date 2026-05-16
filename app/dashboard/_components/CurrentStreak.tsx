import React, { useEffect, useState } from "react";
import {
  recordVisit,
  calculateCurrentStreak,
  seedStreakData,
} from "@/lib/streak";
import { initDatabase } from "@/lib/database/init";
import { apiFetch } from "@/lib/utils/auth";

export function CurrentStreak() {
  const [streak, setStreak] = useState<number | null>(null);
  const [qfStreak, setQfStreak] = useState<number | null>(null);

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

      // Non-blocking QF streak fetch — do not await
      apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return null;
        })
        .then((data) => {
          if (data && typeof data.cached_streak_count === "number") {
            setQfStreak(data.cached_streak_count);
          }
        })
        .catch(() => {
          // Silently swallow — local streak is already shown
        });
    }

    updateStreak();
  }, []);

  const displayStreak = qfStreak ?? streak;

  return (
    <div className="md:col-span-4 bg-primary text-black p-7 relative overflow-hidden flex flex-col gap-6">
      <h3 className="text-sm font-medium text-black uppercase">
        Current Streak
      </h3>
      <div className="flex items-baseline gap-3">
        <span className="text-7xl font-bold leading-none">
          {streak !== null ? displayStreak : "..."}
        </span>
        <span className="font-light">Days</span>
      </div>
      {qfStreak !== null && (
        <span className="text-xs opacity-60">synced with Quran.com</span>
      )}
      <p className="mt-3 text-2xl font-sans opacity-60 tracking-tighter">
        {displayStreak && displayStreak > 0
          ? "KEEP THE MOMENTUM GOING!"
          : "STAY STEADFAST, DEAR LEARNER."}
      </p>
    </div>
  );
}
