import React from "react";

export function DailyTip() {
  return (
    <div className="md:col-span-6 border-2 border-neutral-800 bg-[#1c1b1b] p-5 flex flex-col justify-between">
      <div>
        <h3 className="text-muted-foreground text-sm font-mono font-semibold mb-3">
          MOTIVATION
        </h3>
        <p className="text-2xl italic font-bold">
          Retention is not memorization; it is the repeated return to the word
          until it resides within you.
        </p>
      </div>
    </div>
  );
}
