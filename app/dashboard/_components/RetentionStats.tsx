"use client";

import React, { useEffect, useState } from "react";
import { initDatabase, getDatabase } from "@/lib/database/init";
import { Q } from "@nozbe/watermelondb";
import { Cards } from "@/lib/database/models/Cards";
import { Range } from "@/lib/database/models/Range";

interface RetentionRow {
  label: string;
  score: number;
  status: "SOLID" | "SHAKY" | "WEAK";
  filledBars: number;
}

export function RetentionStats() {
  const [rows, setRows] = useState<RetentionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRetention() {
      try {
        await initDatabase();
        const db = getDatabase();

        const ranges = await db.get<Range>("range").query().fetch();

        if (ranges.length === 0) {
          setRows([]);
          setLoading(false);
          return;
        }

        // Sort by createdAt ascending
        const sorted = [...ranges].sort((a, b) => {
          const aTime = a.createdAt?.getTime() ?? 0;
          const bTime = b.createdAt?.getTime() ?? 0;
          return aTime - bTime;
        });

        const results: RetentionRow[] = [];

        for (const range of sorted) {
          if (results.length >= 3) break;

          const allCards = await db
            .get<Cards>("cards")
            .query(Q.where("range_id", range.id))
            .fetch();

          if (allCards.length === 0) continue;

          const total = allCards.length;
          const mastered = allCards.filter(
            (card) => card.repetitions >= 3,
          ).length;
          const score = Math.round((mastered / total) * 100);

          let status: "SOLID" | "SHAKY" | "WEAK";
          if (score >= 70) {
            status = "SOLID";
          } else if (score >= 40) {
            status = "SHAKY";
          } else {
            status = "WEAK";
          }

          let filledBars: number;
          if (score >= 70) {
            filledBars = 4;
          } else if (score >= 40) {
            filledBars = 2;
          } else {
            filledBars = 1;
          }

          const label =
            range.startSurahName || `Page ${range.startPage ?? "?"}`;

          results.push({ label, score, status, filledBars });
        }

        setRows(results);
      } catch (error) {
        console.error("Failed to load retention stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRetention();
  }, []);

  if (loading) {
    return (
      <div className="md:col-span-6 border-2 border-neutral-800 bg-[#1c1b1b] p-5 py-10">
        <h3 className="text-muted-foreground text-sm font-mono font-semibold text-outline mb-3">
          RETENTION BY RANGE
        </h3>
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2 animate-pulse">
              <span className="text-xs font-semibold w-10 bg-neutral-700 rounded h-4" />
              <div className="flex-grow flex gap-1">
                {[0, 1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    className="h-4 w-4 bg-neutral-700 rounded"
                  />
                ))}
              </div>
              <span className="text-xs font-semibold bg-neutral-700 rounded h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="md:col-span-6 border-2 border-neutral-800 bg-[#1c1b1b] p-5 py-10">
        <h3 className="text-muted-foreground text-sm font-mono font-semibold text-outline mb-3">
          RETENTION BY RANGE
        </h3>
        <p className="text-muted-foreground text-xs font-mono text-center">
          Start a session to see retention data
        </p>
      </div>
    );
  }

  return (
    <div className="md:col-span-6 border-2 border-neutral-800 bg-[#1c1b1b] p-5 py-10">
      <h3 className="text-muted-foreground text-sm font-mono font-semibold text-outline mb-3">
        RETENTION BY RANGE
      </h3>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            <span className="text-xs font-semibold w-24 truncate shrink-0">
              {row.label}
            </span>
            <div className="flex-grow flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-4 w-4 ${
                    i < row.filledBars ? "bg-primary" : "bg-outline-variant"
                  }`}
                />
              ))}
            </div>
            <span
              className={`text-xs font-semibold ${
                row.status === "SOLID" ? "text-primary" : "text-outline"
              }`}
            >
              {row.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
