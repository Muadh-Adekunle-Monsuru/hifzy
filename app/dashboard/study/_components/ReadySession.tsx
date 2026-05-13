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
    <div className="w-full max-w-2xl bento-cell  bg-[#1b1b1f] relative overflow-hidden flex flex-col items-center p-5 gap-md">
      {/* Top Navigation Row */}
      <div className="w-full flex justify-between gap-md relative z-10">
        <Button
          variant={"ghost"}
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-xs group"
        >
          <ChevronLeftIcon className="size-4 group-hover:-translate-x-1 transition-transform" />
          DASHBOARD
        </Button>
        <DeleteRangeDialog randId={rangeId} />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center gap-4 text-center relative z-10">
        <span className="text-muted-foreground font-mono ">
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

        <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 border border-outline-variant rounded-full mb-5">
          <History className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {cardsDue} <span className="">verses due for review</span>
          </p>
        </div>

        <button
          onClick={startSession}
          className="w-fit bg-primary px-10  py-4 border-2 border-primary text-background font-bold uppercase tracking-widest hover:bg-transparent hover:text-primary transition-all active:scale-[0.98] cursor-pointer"
        >
          <span className="relative z-10">Begin Study Session</span>
        </button>
      </div>
    </div>
  );
}
