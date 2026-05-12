"use client";

import React, { useEffect, useState } from "react";
import RangeDialog from "./RangeDialog";
import { initDatabase } from "@/lib/database/init";
import { Range } from "@/lib/database/models/Range";
import { useRouter } from "next/navigation";
import { randomBytes } from "crypto";

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
            console.log("Ranges: ", data);
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
    <div className="md:col-span-12 mt-md grid grid-cols-6 gap-gutter">
      {/* Header */}
      <div className="mb-sm col-span-6">
        <h3 className="font-headline-md text-headline-md border-b border-outline-variant pb-xs flex items-center gap-sm">
          Study Ranges
          <span className="material-symbols-outlined text-outline">
            history
          </span>
        </h3>
      </div>

      {/* Render saved ranges */}
      {ranges.map((range) => (
        <div
          key={range.id}
          onClick={() => router.push(`/dashboard/study/${range.id}`)}
          className="col-span-6 md:col-span-2 bento-card bg-surface-container-low p-md group cursor-pointer active:scale-95 transition-all"
        >
          <div className="flex justify-between items-start mb-md">
            <span className="font-label-caps text-label-caps text-outline">
              {range.startSurahNumber ? "BY SURAH" : "BY PAGE"}
            </span>
            <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
              arrow_forward_ios
            </span>
          </div>
          <div className="flex justify-between items-end mb-sm">
            {range.startSurahNumber && (
              <h4 className="font-headline-md text-headline-md">
                {range.startSurahName}
                {range.startSurahNumber !== range.endSurahNumber &&
                  ` - ${range.endSurahName}`}
              </h4>
            )}
            {range.startPage && (
              <h4 className="font-headline-md text-headline-md">
                PAGES {range.startPage} - {range.endPage}
              </h4>
            )}
          </div>
          <div className="flex flex-col gap-xs">
            <div className="flex justify-between items-center text-label-caps font-label-caps">
              {range.startSurahNumber && (
                <span className="text-outline">
                  {range.startSurahNumber === range.endSurahNumber
                    ? `AYAH ${range.startAyahNumber}-${range.endAyahNumber}`
                    : `${range.startSurahNumber}:${range.startAyahNumber}-${range.endSurahNumber}:${range.endAyahNumber}`}
                </span>
              )}
              <span className="text-primary">0% MASTERY</span>
            </div>
            <div className="h-[2px] w-full bg-outline-variant">
              <div className="h-full bg-primary w-[0%]"></div>
            </div>
          </div>
        </div>
      ))}

      {/* (Action) */}
      <RangeDialog />
    </div>
  );
}
