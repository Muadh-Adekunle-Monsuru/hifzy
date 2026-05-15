"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils/auth";
import { Loader2, BookOpen } from "lucide-react";

interface DailyVerseData {
  verse_key: string;
  arabic_text: string;
  chapter_id: number;
  verse_number: number;
  juz_number: number;
  page_number: number;
}

export function DailyVerse() {
  const [data, setData] = useState<DailyVerseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyVerse = async () => {
      try {
        const response = await apiFetch(
          "https://quran-be-59779bf2.fastapicloud.dev/content/daily-verse",
        );
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch daily verse:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyVerse();
  }, []);

  if (loading) {
    return (
      <div className="md:col-span-6 border-2 border-neutral-800 bg-[#1c1b1b] p-5 flex items-center justify-center min-h-[200px]">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="md:col-span-12 border-2 border-neutral-800 bg-[#1c1b1b] p-5 flex flex-col justify-between min-h-[220px]">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-muted-foreground text-sm font-mono font-semibold tracking-wider">
            DAILY VERSE
          </h3>
          <BookOpen className="text-primary size-5" />
        </div>
        <p
          className="text-right text-3xl font-serif leading-[2.2] mb-6 text-primary drop-shadow-sm"
          dir="rtl"
          style={{ fontFamily: '"Amiri Quran", serif' }}
        >
          {data.arabic_text}
        </p>
      </div>
      <div className="flex justify-between items-end border-t border-neutral-800 pt-4">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-[10px] font-mono uppercase">
            Location
          </span>
          <span className="text-white text-xs font-semibold">
            PAGE {data.page_number} • JUZ {data.juz_number}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-muted-foreground text-[10px] font-mono uppercase">
            Reference
          </span>
          <span className="text-primary font-bold text-sm">
            {data.verse_key}
          </span>
        </div>
      </div>
    </div>
  );
}
