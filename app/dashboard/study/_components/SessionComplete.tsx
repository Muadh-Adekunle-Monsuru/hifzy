import Link from "next/link";
import { SessionStats } from "./types";

export function SessionComplete({
  sessionStats,
  startSession,
}: {
  sessionStats: SessionStats;
  startSession: () => void;
}) {
  return (
    <div className="w-full max-w-3xl mb-xl text-center bento-cell p-xl bg-surface-container">
      <h2 className="text-4xl font-headline-md text-primary mb-md">Session Complete!</h2>
      <p className="text-secondary mb-lg">Great work reviewing your verses today.</p>
      <div className="grid grid-cols-2 gap-4 mb-xl">
         <div className="bento-cell p-md">
           <p className="text-3xl font-bold text-primary mb-2">{sessionStats.totalReviewed}</p>
           <p className="font-label-caps text-secondary">Verses Reviewed</p>
         </div>
         <div className="bento-cell p-md">
           <p className="text-3xl font-bold text-primary mb-2">{sessionStats.avgQuality}</p>
           <p className="font-label-caps text-secondary">Avg Quality</p>
         </div>
      </div>
      <div className="flex gap-4 justify-center">
        <Link href="/dashboard">
          <button className="py-sm px-lg border-2 border-primary bg-transparent text-primary font-headline-md uppercase tracking-tighter hover:bg-primary hover:text-background transition-all active:scale-[0.98]">
            Dashboard
          </button>
        </Link>
        <button
          onClick={startSession}
          className="py-sm px-lg border-2 border-primary bg-primary text-background font-headline-md uppercase tracking-tighter hover:bg-background hover:text-primary transition-all active:scale-[0.98]"
        >
          Review Again
        </button>
      </div>
    </div>
  );
}
