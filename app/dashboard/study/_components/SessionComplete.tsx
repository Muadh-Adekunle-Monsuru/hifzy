import Link from "next/link";
import { SessionStats } from "./types";

export function SessionComplete({
  sessionStats,
}: {
  sessionStats: SessionStats;
}) {
  return (
    <div className="w-full max-w-2xl bento-cell  bg-[#1b1b1f] relative overflow-hidden flex flex-col items-center p-5 gap-3 py-10 ">
      <h2 className="text-4xl font-bold mb-2">Session Complete!</h2>
      <p className="text-muted-foreground  mb-7">
        Great work reviewing your verses today.
      </p>
      <div className="grid grid-cols-2 divide-x-2 divide-border mb-4">
        <div className=" flex items-center flex-col p-5">
          <p className="text-3xl font-bold text-primary mb-2">
            {sessionStats.totalReviewed}
          </p>
          <p className="text-muted-foreground">Cards Reviewed</p>
        </div>
        <div className=" flex items-center flex-col p-5">
          <p className="text-3xl font-bold text-primary mb-2">
            {Math.floor(sessionStats.avgQuality)}
          </p>
          <p className="text-muted-foreground">Avg Quality</p>
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        <Link href="/dashboard">
          <button className="w-fit bg-primary px-10  py-4 border-2 border-primary text-background font-bold uppercase tracking-widest hover:bg-transparent hover:text-primary transition-all active:scale-[0.98] cursor-pointer">
            Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
