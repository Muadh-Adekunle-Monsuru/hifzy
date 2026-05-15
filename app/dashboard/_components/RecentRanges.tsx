"use client";

import React, { useEffect, useState } from "react";
import RangeDialog from "./RangeDialog";
import { initDatabase } from "@/lib/database/init";
import { Range } from "@/lib/database/models/Range";
import { useRouter } from "next/navigation";
import { randomBytes } from "crypto";
import { ChevronRight, History } from "lucide-react";
import RangeItem from "./RangeItem";

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
        <RangeItem key={range.id} range={range} />
      ))}

      {/* (Action) */}
      <RangeDialog />
    </div>
  );
}
