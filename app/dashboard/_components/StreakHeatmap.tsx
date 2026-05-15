import React, { useEffect, useState } from "react";
import { getVisitationHistory } from "@/lib/streak";
import { initDatabase } from "@/lib/database/init";

export function StreakHeatmap() {
  const [history, setHistory] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        await initDatabase();
        const data = await getVisitationHistory(100); // ~10 weeks
        setHistory(data);
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Generate grid: 10 weeks * 7 days = 70 cells
  const numDays = 100;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // We want the last cell to be today
  // So index i represents today - (numDays - 1 - i)
  const cells = Array.from({ length: numDays }, (_, i) => {
    const date = new Date(today.getTime() - (numDays - 1 - i) * 86400000);
    const hasVisited = history.includes(date.getTime());
    return hasVisited ? "active-4" : "";
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
        <div className="overflow-x-hidden pb-2">
          <div className="flex justify-center gap-1 min-w-[600px]">
            <div className="grid grid-rows-5 grid-flow-col gap-3">
              {loading
                ? Array(numDays)
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={idx}
                        className="size-5 bg-neutral-900 animate-pulse"
                      ></div>
                    ))
                : cells.map((cls, idx) => (
                    <div
                      key={idx}
                      className={`bg-neutral-800 size-4 border ${cls}`}
                    ></div>
                  ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-between items-center">
        <span className="text-gray-300 text-[12px] uppercase">
          DAYS VISITED IN THE LAST 10 WEEKS
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
