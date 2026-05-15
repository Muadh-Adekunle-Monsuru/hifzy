import { getMoonData } from "@/lib/utils/moon";

export const MoonCard = () => {
  const { dayOfWeek, hijriDay, hijriMonth, hijriYear, phase, icon } =
    getMoonData();

  return (
    <div className="md:col-span-6 border-2 border-neutral-800 bg-[#1c1b1b] p-6 flex flex-col justify-between min-h-[200px]">
      {/* Top Labeling */}
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-[0.2em]">
          Lunar Cycle
        </span>
        <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">
          {dayOfWeek} {/* e.g., Thursday */}
        </span>
      </div>

      {/* Hero Section: Hijri Date */}
      <div className="flex flex-col items-center justify-center py-6">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-mono">
          {hijriDay}
        </h2>
        <p className="text-lg font-medium text-zinc-300 uppercase tracking-widest mt-1">
          {hijriMonth}
        </p>
        <p className="text-[10px] text-zinc-500 font-mono mt-1 opacity-60">
          {hijriYear} AH
        </p>
      </div>

      {/* Subtle Footer: Moon Phase & Visual */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-2xl grayscale brightness-125">{icon}</span>
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
            {phase}
          </span>
        </div>
        <div className="h-1 w-12 bg-neutral-800 rounded-full overflow-hidden">
          {/* Visual progress bar of the month */}
          <div
            className="h-full bg-white/40"
            style={{ width: `${(hijriDay / 30) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
