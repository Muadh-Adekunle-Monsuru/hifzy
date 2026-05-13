import React from "react";

export function CurrentStreak() {
  return (
    <div className="md:col-span-4 bg-primary text-black p-7 relative overflow-hidden flex flex-col gap-6">
      <h3 className="text-sm font-medium text-black">CURRENT STREAK</h3>
      <div className="flex items-baseline gap-3">
        <span className="text-[64px] font-bold leading-none">0</span>
        <span className="font-light">Days</span>
      </div>
      <p className="mt-3 font-mono opacity-80 tracking-tighter">
        STAY STEADFAST, DEAR LEARNER.
      </p>
    </div>
  );
}
