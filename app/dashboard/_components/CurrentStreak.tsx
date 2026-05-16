import { initDatabase } from "@/lib/database/init";
import { calculateCurrentStreak, recordVisit } from "@/lib/streak";
import { apiFetch } from "@/lib/utils/auth";
import { useEffect, useState } from "react";

export function CurrentStreak() {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    async function updateStreak() {
      try {
        await initDatabase();
        await recordVisit();
        const currentStreak = await calculateCurrentStreak();
        setStreak(currentStreak);
      } catch (error) {
        console.error("Error updating streak:", error);
      }
    }

    updateStreak();
  }, []);

  const displayStreak = streak;

  return (
    <div className="md:col-span-4 bg-primary text-black p-7 relative overflow-hidden flex flex-col gap-6">
      <h3 className="text-sm font-medium text-black uppercase">
        Current Streak
      </h3>
      <div className="flex items-baseline gap-3">
        <span className="text-7xl font-bold leading-none">
          {streak !== null ? displayStreak : "0"}
        </span>
        <span className="font-light">Days</span>
      </div>
      <p className="mt-3 text-2xl font-sans opacity-60 tracking-tighter">
        {displayStreak && displayStreak > 1
          ? "KEEP THE MOMENTUM GOING!"
          : "STAY STEADFAST, DEAR LEARNER."}
      </p>
    </div>
  );
}
