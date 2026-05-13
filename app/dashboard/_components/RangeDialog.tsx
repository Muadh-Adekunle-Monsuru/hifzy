"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import NewRangeButton from "./NewRangeButton";
import { surahDetail } from "./SurahDetails";
import { initDatabase } from "@/lib/database/init";
import { Range } from "@/lib/database/models/Range";
import { Cards } from "@/lib/database/models/Cards";
import { getAyahsByPages, getAyahsBySurah } from "@/lib/utils/action";
import { toast } from "sonner";
import { initializeCards } from "@/lib/srs/RawCardConverter";

type Mode = "surah" | "page";

export default function RangeDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("surah");
  const [creating, setCreating] = useState(false);

  // Selection States
  const [startSurah, setStartSurah] = useState(1);
  const [startVerse, setStartVerse] = useState(1);
  const [endSurah, setEndSurah] = useState(1);
  const [endVerse, setEndVerse] = useState(1);

  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(604);
  const [reciter, setReciter] = useState(6);

  // Derived Data
  const currentStartSurahData = surahDetail.find((s) => s.id === startSurah);
  const currentEndSurahData = surahDetail.find((s) => s.id === endSurah);

  // Filter end surahs to only show those >= startSurah
  const availableEndSurahs = useMemo(() => {
    return surahDetail.filter((s) => s.id >= startSurah);
  }, [startSurah]);

  // Handle start surah change (reset verses if they exceed new bounds)
  const handleStartSurahChange = (id: number) => {
    setStartSurah(id);
    setStartVerse(1);
    if (endSurah < id) {
      setEndSurah(id);
      setEndVerse(1);
    }
  };

  const handleCreateRange = async () => {
    setCreating(true);
    try {
      const rawData =
        mode === "page"
          ? await getAyahsByPages(startPage, endPage, reciter)
          : await getAyahsBySurah(
              startSurah,
              endSurah,
              startVerse,
              endVerse,
              reciter,
            );

      if (!rawData || rawData.length === 0) {
        toast.error(
          "No data found for this range, try Surah Fatihah or Surah Al-Baqarah",
        );
        return;
      }
      const initializedDataset = initializeCards(rawData);

      const db = await initDatabase();
      await db.write(async () => {
        const rangeRecord = await db.get<Range>("range").create((record) => {
          if (mode === "surah") {
            record.startSurahNumber = startSurah;
            record.startSurahName =
              currentStartSurahData?.transliteration || "";
            record.startAyahNumber = startVerse;
            record.endSurahNumber = endSurah;
            record.endSurahName = currentEndSurahData?.transliteration || "";
            record.endAyahNumber = endVerse;
          } else {
            record.startPage = startPage;
            record.endPage = endPage;
          }
          record.reciter = reciter;
          record.createdAt = new Date();
        });

        // Save cards
        for (const card of initializedDataset) {
          await db.get<Cards>("cards").create((record) => {
            record.rangeId = rangeRecord.id;
            record.verseId = card.verseId;
            record.arabicText = card.arabic_text;
            record.audioUrl = card.audio_url;
            record.answerVerses = JSON.stringify(card.answer_verses);
            record.interval = card.interval;
            record.easeFactor = card.easeFactor;
            record.repetitions = card.repetitions;
            record.nextReviewDate = new Date(card.nextReviewDate);
            record.isMastered = card.isMastered;
            record.createdAt = new Date();
          });
        }
      });

      setDialogOpen(false);
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Failed to save range:", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <NewRangeButton />
      </DialogTrigger>
      <DialogContent className="p-10 border-2" showCloseButton={false}>
        <div className="relative overflow-hidden shadow-2xl w-full">
          <div className="relative z-20">
            <div className="mb-4 text-center">
              <DialogTitle className="text-2xl font-medium text-primary">
                Setup Revision
              </DialogTitle>
              <DialogDescription className="sr-only">
                Configure your revision mode by surah or by page and select the
                reciter.
              </DialogDescription>
            </div>

            <div className="space-y-10">
              {/* Mode Toggle */}
              <div className="flex flex-col items-center gap-5 w-full ">
                <label className="text-xs font-medium text-muted-foreground">
                  SELECT REVISION MODE
                </label>
                <div className="flex border border-gray-500 p-2 gap-2 w-full ">
                  <button
                    onClick={() => setMode("surah")}
                    className={`flex-1 p-1 font-mono text-sm font-medium  transition-colors cursor-pointer ${
                      mode === "surah"
                        ? "bg-primary text-on-primary"
                        : "text-primary/50 hover:text-primary"
                    }`}
                  >
                    BY SURAH
                  </button>
                  <button
                    onClick={() => setMode("page")}
                    className={`flex-1 p-1 font-mono text-sm font-medium  transition-colors cursor-pointer ${
                      mode === "page"
                        ? "bg-primary text-on-primary"
                        : "text-primary/50 hover:text-primary"
                    }`}
                  >
                    BY PAGE
                  </button>
                </div>
              </div>

              {mode === "surah" ? (
                <div className="space-y-5">
                  {/* Start Selection */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="flex flex-col gap-5">
                      <label className="font-medium text-sm text-muted-foreground">
                        START SURAH
                      </label>
                      <select
                        value={startSurah}
                        onChange={(e) =>
                          handleStartSurahChange(Number(e.target.value))
                        }
                        className="border-b border-primary  bg-[#181818] focus:border-b-[3px] focus:outline-none outline-none ring-0 py-2 text-primary appearance-none w-full cursor-pointer"
                      >
                        {surahDetail.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.id}. {s.transliteration}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-5">
                      <label className="font-medium text-sm text-muted-foreground">
                        VERSE
                      </label>
                      <select
                        value={startVerse}
                        onChange={(e) => setStartVerse(Number(e.target.value))}
                        className="border-b border-primary bg-[#181818] focus:border-b-[3px] focus:outline-none outline-none ring-0 py-2 text-primary appearance-none w-full cursor-pointer"
                      >
                        {Array.from(
                          { length: currentStartSurahData?.total_verses || 0 },
                          (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>

                  {/* End Selection */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="flex flex-col gap-5">
                      <label className="font-medium text-sm text-muted-foreground">
                        END SURAH
                      </label>
                      <select
                        value={endSurah}
                        onChange={(e) => {
                          setEndSurah(Number(e.target.value));
                          setEndVerse(1);
                        }}
                        className="border-b border-primary bg-[#181818] focus:border-b-[3px] focus:outline-none outline-none ring-0 py-2 text-primary appearance-none w-full cursor-pointer"
                      >
                        {availableEndSurahs.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.id}. {s.transliteration}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-5">
                      <label className="font-medium text-sm text-muted-foreground">
                        VERSE
                      </label>
                      <select
                        value={endVerse}
                        onChange={(e) => setEndVerse(Number(e.target.value))}
                        className="border-b border-primary bg-[#181818] focus:border-b-[3px] focus:outline-none outline-none ring-0 py-2 text-primary appearance-none w-full cursor-pointer"
                      >
                        {Array.from(
                          { length: currentEndSurahData?.total_verses || 0 },
                          (_, i) => {
                            const vNum = i + 1;
                            // If same surah, end verse cannot be before start verse
                            if (startSurah === endSurah && vNum < startVerse)
                              return null;
                            return (
                              <option key={vNum} value={vNum}>
                                {vNum}
                              </option>
                            );
                          },
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                /* Page Mode */
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-5">
                    <label className="font-medium text-sm text-muted-foreground">
                      START PAGE
                    </label>
                    <select
                      value={startPage}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setStartPage(val);
                        if (endPage < val) setEndPage(val);
                      }}
                      className="border-b border-primary bg-[#181818] focus:border-b-[3px] focus:outline-none outline-none ring-0 py-2 text-primary appearance-none w-full cursor-pointer"
                    >
                      {Array.from({ length: 604 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Page {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-5">
                    <label className="font-medium text-sm text-muted-foreground">
                      END PAGE
                    </label>
                    <select
                      value={endPage}
                      onChange={(e) => setEndPage(Number(e.target.value))}
                      className="border-b border-primary bg-[#181818] focus:border-b-[3px] focus:outline-none outline-none ring-0 py-2 text-primary appearance-none w-full cursor-pointer"
                    >
                      {Array.from({ length: 605 - startPage }, (_, i) => {
                        const pNum = i + startPage;
                        return (
                          <option key={pNum} value={pNum}>
                            Page {pNum}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              )}

              {/* Reciter & Action */}
              <div className="flex flex-col gap-5">
                <label className="font-medium text-sm text-muted-foreground">
                  SELECT RECITER
                </label>
                <select
                  value={reciter}
                  onChange={(e) => setReciter(Number(e.target.value))}
                  className="border-b border-primary bg-[#181818] focus:border-b-[3px] focus:outline-none outline-none ring-0 py-2 text-primary appearance-none w-full cursor-pointer"
                >
                  <option value={6}>Mahmoud Khalil Al-Husary</option>
                  <option value={7}>Mishari Rashid al-`Afasy</option>
                </select>
              </div>

              <div className="pt-lg">
                <button
                  onClick={handleCreateRange}
                  disabled={creating}
                  className="w-full bg-primary px-10  py-2 border-2 border-primary text-background font-bold uppercase tracking-widest hover:bg-transparent hover:text-primary transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:bg-primary/50"
                >
                  {creating ? (
                    "Loading..."
                  ) : (
                    <span className="flex items-center gap-3">
                      BEGIN REVISION
                      <span className="material-symbols-outlined transition-transform group-active:translate-x-1">
                        arrow_forward
                      </span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
