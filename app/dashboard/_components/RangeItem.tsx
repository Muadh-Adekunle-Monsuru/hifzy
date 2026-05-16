"use client";

import React, { useEffect, useState } from "react";
import { Range } from "@/lib/database/models/Range";
import { Cards } from "@/lib/database/models/Cards";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Q } from "@nozbe/watermelondb";

interface RangeItemProps {
  range: Range;
}

export default function RangeItem({ range }: RangeItemProps) {
  const [dueCount, setDueCount] = useState<number | null>(null);

  useEffect(() => {
    let subscription: any;

    const observeDueCards = async () => {
      try {
        const cardsCollection = range.collections.get<Cards>("cards");
        // Observe the count of cards due for review (next_review_date <= now)
        // We use range.id to filter cards specifically for this range
        subscription = cardsCollection
          .query(
            Q.where("range_id", range.id),
            Q.where("next_review_date", Q.lte(Date.now()))
          )
          .observeCount()
          .subscribe((count) => {
            setDueCount(count);
          });
      } catch (error) {
        console.error("Failed to observe due cards:", error);
      }
    };

    observeDueCards();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [range]);

  return (
    <Link
      href={`/dashboard/study/${range.id}`}
      className="col-span-6 md:col-span-2 bento-card bg-[#1c1b1b] p-5 py-10 group cursor-pointer active:scale-95 transition-all block"
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
          <span className="text-primary font-bold">
            {dueCount !== null ? `${dueCount} DUE TODAY` : "..."}
          </span>
        </div>
        <div className="h-[2px] w-full bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: dueCount === 0 ? '100%' : '20%' }}
          ></div>
        </div>
      </div>
    </Link>
  );
}
