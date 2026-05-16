"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils/auth";
import { Loader2, BookOpen, ExternalLink } from "lucide-react";

interface DailyVerseData {
  verse_key: string;
  arabic_text: string;
  chapter_id: number;
  verse_number: number;
  juz_number: number;
  page_number: number;
  translation_text: string;
  tafsir_url: string;
}

export function DailyVerse() {
  const [data, setData] = useState<DailyVerseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyVerse = async () => {
      try {
        const response = await apiFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/content/daily-verse`,
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
      <div className="md:col-span-12 border-2 border-neutral-800 bg-[#1c1b1b] p-5 flex items-center justify-center min-h-[220px]">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="md:col-span-12 border-2 border-neutral-800 bg-[#1c1b1b] p-5 flex flex-col justify-between min-h-[260px]">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-muted-foreground text-sm font-mono font-semibold tracking-wider">
            DAILY VERSE
          </h3>
          <BookOpen className="text-primary size-5" />
        </div>
        
        <div className="space-y-6">
          <p
            className="text-right text-3xl font-serif leading-[2.2] text-primary drop-shadow-sm"
            dir="rtl"
            style={{ fontFamily: '"Amiri Quran", serif' }}
          >
            {data.arabic_text}
          </p>
          
          <p className="text-muted-foreground italic text-lg leading-relaxed border-l-2 border-primary/30 pl-4 py-1">
            "{data.translation_text}"
          </p>
        </div>
      </div>

      <div className="flex justify-between items-end border-t border-neutral-800 pt-6 mt-8">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest">
            Location
          </span>
          <span className="text-white text-xs font-semibold">
            PAGE {data.page_number} • JUZ {data.juz_number}
          </span>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <a 
            href={data.tafsir_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-[10px] font-mono uppercase text-primary/80 hover:text-primary transition-colors bg-primary/5 px-2 py-1 rounded-sm border border-primary/10 hover:border-primary/30"
          >
            Read Tafsir <ExternalLink className="size-3 group-hover:scale-110 transition-transform" />
          </a>
          
          <div className="flex flex-col items-end gap-1">
            <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest">
              Reference
            </span>
            <span className="text-primary font-bold text-sm">
              {data.verse_key}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
