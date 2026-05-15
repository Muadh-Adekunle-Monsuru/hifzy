"use client";

import React, { useEffect, useState } from "react";
import RangeDialog from "./RangeDialog";
import { initDatabase } from "@/lib/database/init";
import { Range } from "@/lib/database/models/Range";
import { useRouter } from "next/navigation";
import { randomBytes } from "crypto";
import { ChevronRight, History } from "lucide-react";

export function RecentRanges() {
  const [ranges, setRanges] = useState<Range[]>([]);
  const router = useRouter();

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;

    const fetchRanges = async () => {
      try {
        const db = await initDatabase();
        const rangesCollection = db.get<Range>("range");

        // Observe the query to automatically update UI on database changes
        subscription = rangesCollection
          .query()
          .observe()
          .subscribe((data) => {
            setRanges([...data].reverse()); // Use spread to ensure a new array reference
          });
      } catch (error) {
        console.error("Failed to fetch ranges:", error);
      }
    };

    fetchRanges();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <div className="md:col-span-12 mt-7 grid grid-cols-6 gap-5">
      {/* Header */}
      <div className="mb-4 col-span-6 flex items-center gap-2  border-b border-gray-200 pb-2">
        <History className="text-muted-foreground" />
        <h3 className="text-xl font-semibold uppercase text-muted-foreground">
          Study Ranges
        </h3>
      </div>

      {/* Render saved ranges */}
      {ranges.map((range) => (
        <div
          key={range.id}
          onClick={() => router.push(`/dashboard/study/${range.id}`)}
          className="col-span-6 md:col-span-2 bento-card bg-[#1c1b1b] p-5 py-10 group cursor-pointer active:scale-95 transition-all"
        >
          <div className="flex justify-between items-center mb-5">
            <span className="font-medium text-muted-foreground group-hover:text-primary text-xs ">
              {range.startSurahNumber ? "BY SURAH" : "BY PAGE"}
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110" />
          </div>
          <div className="flex justify-between items-end mb-5">
            {range.startSurahNumber && (
              <h4 className="text-3xl font-medium">
                {range.startSurahName}
                {range.startSurahNumber !== range.endSurahNumber &&
                  ` - ${range.endSurahName}`}
              </h4>
            )}
            {range.startPage && (
              <h4 className="text-3xl font-medium">
                PAGES {range.startPage} - {range.endPage}
              </h4>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              {range.startSurahNumber && (
                <span className="text-outline">
                  {range.startSurahNumber === range.endSurahNumber
                    ? `AYAH ${range.startAyahNumber}-${range.endAyahNumber}`
                    : `${range.startSurahNumber}:${range.startAyahNumber}-${range.endSurahNumber}:${range.endAyahNumber}`}
                </span>
              )}
              <span className="text-primary">0% MASTERY</span>
            </div>
            <div className="h-[2px] w-full bg-neutral-300 rounded-full">
              <div className="h-full bg-primary w-[0%] rounded-full"></div>
            </div>
          </div>
        </div>
      ))}

      {/* (Action) */}
      <RangeDialog />
    </div>
  );
}
