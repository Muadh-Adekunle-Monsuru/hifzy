import React from "react";

export function CurrentStreak() {
  return (
    <div className="md:col-span-4 bento-card bg-primary text-on-primary p-md relative overflow-hidden group  active:scale-95 transition-all">
      <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 group-hover:rotate-12 transition-transform">
        star
      </span>
      <h3 className="font-label-caps text-label-caps mb-lg">CURRENT STREAK</h3>
      <div className="flex items-baseline gap-xs">
        <span className="text-[64px] font-bold leading-none">0</span>
        <span className="font-headline-md">Days</span>
      </div>
      <p className="mt-md font-label-caps text-label-caps opacity-80">
        STAY STEADFAST, DEAR LEARNER.
      </p>
    </div>
  );
}
