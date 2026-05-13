import React from "react";

export function MasteryHeatmap() {
  const cellClasses = [
    "active-1",
    "active-2",
    "active-1",
    "",
    "active-3",
    "",
    "active-4",
    "active-4",
    "active-3",
    "",
    "active-1",
    "",
    "active-2",
    "active-1",
    "",
    "active-1",
    "active-2",
    "active-3",
    "active-4",
    "active-2",
    "",
    "active-1",
    "",
    "active-1",
    "active-2",
    "active-3",
    "",
    "active-1",
    "active-4",
    "active-4",
    "active-4",
    "active-3",
    "active-3",
    "active-2",
    "active-4",
  ];

  const cells = Array(7).fill(cellClasses).flat();

  return (
    <div className="md:col-span-8 border-2 border-neutral-800 bg-[#1c1b1b] p-7 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-5">
          <h3 className=" text-sm font-medium text-primary">MASTERY HEATMAP</h3>
          <span className="material-symbols-outlined text-outline">
            timeline
          </span>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-[600px]">
            <div className="grid grid-rows-7 grid-flow-col gap-1">
              {cells.map((cls, idx) => (
                <div key={idx} className={`heatmap-cell ${cls} bg-black`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-between items-center">
        <span className="text-gray-300 text-[12px]">
          0 AYATS REVISED THIS MONTH
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
