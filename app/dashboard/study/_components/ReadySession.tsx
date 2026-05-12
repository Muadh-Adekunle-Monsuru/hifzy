import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, Trash, History } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import DeleteRangeDialog from "./DeleteRangeDialog";
import { useEffect, useState } from "react";
import { initDatabase } from "@/lib/database/init";
import { Range } from "@/lib/database/models/Range";

export function ReadySession({
  cardsDue,
  startSession,
  rangeId,
}: {
  cardsDue: number;
  startSession: () => void;
  rangeId: string;
}) {
  const router = useRouter();
  const [range, setRange] = useState<Range | null>(null);

  useEffect(() => {
    const fetchRange = async () => {
      try {
        const db = await initDatabase();
        const rangesCollection = db.get<Range>("range");
        const range = await rangesCollection.find(rangeId);
        setRange(range);
      } catch (error) {
        console.error("Failed to fetch range:", error);
      }
    };
    fetchRange();
  }, [rangeId]);

  return (
    <div className="w-full max-w-2xl border rounded-xl bg-surface-container relative overflow-hidden flex flex-col items-center p-md gap-md">
      {/* Decorative Background Icon */}
      <div className="absolute -top-12 -left-12 opacity-10 transform -rotate-12 pointer-events-none">
        <span
          className="material-symbols-outlined text-[200px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          book_4
        </span>
      </div>

      {/* Top Navigation Row */}
      <div className="w-full flex justify-between gap-md relative z-10">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-xs text-label-caps font-label-caps text-secondary hover:text-primary transition-colors group"
        >
          <ChevronLeftIcon className="size-4 group-hover:-translate-x-1 transition-transform" />
          DASHBOARD
        </button>
        <DeleteRangeDialog randId={rangeId} />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center gap-4 text-center relative z-10">
        <span className="font-label-caps text-label-caps text-outline tracking-widest mb-gap-sm">
          UPCOMING SESSION
        </span>

        <div className="mb-gap-lg">
          {range?.startSurahNumber ? (
            <h2 className="text-5xl md:text-6xl font-headline-md text-primary arabic-glow">
              {range.startSurahName}
              {range.startSurahNumber !== range.endSurahNumber && (
                <>
                  <span className="text-secondary mx-4">/</span>
                  {range.endSurahName}
                </>
              )}
            </h2>
          ) : range?.startPage ? (
            <h2 className="text-5xl md:text-6xl font-headline-md text-primary arabic-glow">
              Pages {range.startPage}—{range.endPage}
            </h2>
          ) : (
            <div className="h-16 w-64 bg-surface-container-high animate-pulse rounded-md"></div>
          )}
        </div>

        <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 border border-outline-variant rounded-full mb-gap-xl">
          <History className="size-4 text-primary" />
          <p className="font-body-md text-primary">
            {cardsDue}{" "}
            <span className="text-secondary">verses due for review</span>
          </p>
        </div>

        <button
          onClick={startSession}
          className="w-full py-4 border-2 border-primary bg-primary text-background font-headline-md uppercase tracking-tighter hover:bg-background hover:scale-105 cursor-pointer transition-all active:scale-[0.98] relative overflow-hidden group shadow-xl"
        >
          <span className="relative z-10">Begin Study Session</span>
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out"></div>
        </button>
      </div>

      {/* Bottom Footer Accent */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
    </div>
  );
}
