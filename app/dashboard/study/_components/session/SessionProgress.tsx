"use client";

interface SessionProgressProps {
  currentCardIndex: number;
  cardsDue: number;
}

export function SessionProgress({ currentCardIndex, cardsDue }: SessionProgressProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="uppercase">Session Progress</span>
        <span className="font-label-caps text-primary">
          {currentCardIndex + 1} / {cardsDue} Cards
        </span>
      </div>
      {/* Progress Bar using your variable colors */}
      <div className="h-2 w-full bg-white/10 border border-border overflow-hidden rounded-full">
        <div
          className="h-full bg-primary transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          style={{
            width: `${((currentCardIndex + 1) / cardsDue) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
