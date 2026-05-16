import React, { useEffect, useState } from "react";
import { getReviewCountsByDay } from "@/lib/streak";
import { initDatabase } from "@/lib/database/init";

export function StreakHeatmap() {
  const [history, setHistory] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        await initDatabase();
        const data = await getReviewCountsByDay(100);
        console.log("Heatmap history data:", Array.from(data.entries()));
        setHistory(data);
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Generate grid: 100 days
  const numDays = 100;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getIntensityClass = (count: number): string => {
    if (count === 0) return "";
    if (count <= 3) return "active-1";
    if (count <= 8) return "active-2";
    if (count <= 15) return "active-3";
    return "active-4";
  };

  // We want the last cell to be today
  // So index i represents today - (numDays - 1 - i)
  const cells = Array.from({ length: numDays }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (numDays - 1 - i));
    const midnight = date.getTime();
    const count = history.get(midnight) ?? 0;
    
    if (i === numDays - 1) {
      console.log("Today cell:", { midnight, count, today: today.getTime() });
    }
    
    return {
      cls: getIntensityClass(count),
      date: date.toLocaleDateString(),
      count
    };
  });

  return (
    <div className="md:col-span-8 border-2 border-neutral-800 bg-[#1c1b1b] p-2 px-5 md:px-15 flex flex-col justify-between">
      <div className="w-full">
        <div className="flex justify-between items-start mb-5">
          <h3 className=" text-sm font-medium text-primary">STREAK HEATMAP</h3>
          <span className="material-symbols-outlined text-outline">
            timeline
          </span>
        </div>
        <div className="overflow-x-hidden h-full w-full">
          <div className="flex justify-center items-center">
            <div className="grid grid-rows-5 grid-flow-col gap-3 w-full">
              {loading
                ? Array(numDays)
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={idx}
                        className="size-5 bg-neutral-900 animate-pulse"
                      ></div>
                    ))
                : cells.map((cell, idx) => (
                    <div
                      key={idx}
                      title={`${cell.date}: ${cell.count} reviews`}
                      className={`bg-neutral-800 aspect-square h-full border ${cell.cls}`}
                    ></div>
                  ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-between items-center">
        <span className="text-gray-300 text-[12px] uppercase">
          REVIEWS PER DAY OVER THE LAST 100 DAYS
        </span>
        <div className="flex items-center gap-3">
          <span className="text-gray-300 text-[10px]">LESS</span>
          <div className="flex gap-[2px]">
            <div className="heatmap-cell"></div>
            <div className="heatmap-cell active-1"></div>
            <div className="heatmap-cell active-2"></div>
            <div className="heatmap-cell active-3"></div>
            <div className="heatmap-cell active-4"></div>
          </div>
          <span className="text-gray-300 text-[10px]">MORE</span>
        </div>
      </div>
    </div>
  );
}
