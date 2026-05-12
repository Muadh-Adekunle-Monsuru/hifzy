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

type Mode = "surah" | "page";

export default function RangeDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("surah");

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

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <NewRangeButton />
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-2xl p-0 border-none bg-transparent shadow-none"
        showCloseButton={false}
      >
        <div className="border-2 border-primary bg-surface-container-lowest p-md md:p-xl relative overflow-hidden shadow-2xl w-full">
          {/* Decorative Icon */}
          <div className="absolute -top-6 -right-6 opacity-20 transform rotate-12 pointer-events-none">
            <span
              className="material-symbols-outlined text-[140px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bookmark
            </span>
          </div>

          <div className="relative z-20">
            <div className="mb-lg text-center">
              <DialogTitle className="font-display-lg text-headline-md md:text-display-lg text-primary">
                Setup Revision
              </DialogTitle>
              <DialogDescription className="sr-only">
                Configure your revision mode by surah or by page and select the
                reciter.
              </DialogDescription>
            </div>

            <div className="space-y-lg">
              {/* Mode Toggle */}
              <div className="flex flex-col items-center gap-sm w-full ">
                <label className="font-label-caps text-label-caps text-outline">
                  REVISION MODE
                </label>
                <div className="flex border-2 border-outline-variant p-1 gap-1 w-full ">
                  <button
                    onClick={() => setMode("surah")}
                    className={`flex-1 py-xs font-label-caps text-label-caps transition-colors ${
                      mode === "surah"
                        ? "bg-primary text-on-primary"
                        : "text-secondary hover:text-primary"
                    }`}
                  >
                    BY SURAH
                  </button>
                  <button
                    onClick={() => setMode("page")}
                    className={`disabled:opacity-50 disabled:cursor-not-allowed flex-1 py-xs font-label-caps text-label-caps transition-colors ${
                      mode === "page"
                        ? "bg-primary text-on-primary"
                        : "text-secondary hover:text-primary"
                    }`}
                  >
                    BY PAGE
                  </button>
                </div>
              </div>

              {mode === "surah" ? (
                <div className="space-y-xl">
                  {/* Start Selection */}
                  <div className="grid grid-cols-2 gap-md">
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-caps text-label-caps text-outline">
                        START SURAH
                      </label>
                      <select
                        value={startSurah}
                        onChange={(e) =>
                          handleStartSurahChange(Number(e.target.value))
                        }
                        className="border-b border-primary  bg-surface-container-lowest focus:border-b-[3px] focus:outline-none outline-none ring-0 py-xs text-primary font-body-md appearance-none w-full cursor-pointer"
                      >
                        {surahDetail.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.id}. {s.transliteration}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-caps text-label-caps text-outline">
                        VERSE
                      </label>
                      <select
                        value={startVerse}
                        onChange={(e) => setStartVerse(Number(e.target.value))}
                        className="border-b border-primary bg-surface-container-lowest focus:border-b-[3px] focus:outline-none outline-none ring-0 py-xs text-primary font-body-md appearance-none w-full cursor-pointer"
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
                  <div className="grid grid-cols-2 gap-md">
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-caps text-label-caps text-outline">
                        END SURAH
                      </label>
                      <select
                        value={endSurah}
                        onChange={(e) => {
                          setEndSurah(Number(e.target.value));
                          setEndVerse(1);
                        }}
                        className="border-b border-primary  bg-surface-container-lowest focus:border-b-[3px] focus:outline-none outline-none ring-0 py-xs text-primary font-body-md appearance-none w-full cursor-pointer"
                      >
                        {availableEndSurahs.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.id}. {s.transliteration}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-caps text-label-caps text-outline">
                        VERSE
                      </label>
                      <select
                        value={endVerse}
                        onChange={(e) => setEndVerse(Number(e.target.value))}
                        className="border-b border-primary bg-surface-container-lowest focus:border-b-[3px] focus:outline-none outline-none ring-0 py-xs text-primary font-body-md appearance-none w-full cursor-pointer"
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
                <div className="grid grid-cols-2 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-caps text-label-caps text-outline">
                      START PAGE
                    </label>
                    <select
                      value={startPage}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setStartPage(val);
                        if (endPage < val) setEndPage(val);
                      }}
                      className="border-b border-primary bg-surface-container-lowest focus:border-b-[3px] focus:outline-none outline-none ring-0 py-xs text-primary font-body-md appearance-none w-full cursor-pointer"
                    >
                      {Array.from({ length: 604 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Page {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-caps text-label-caps text-outline">
                      END PAGE
                    </label>
                    <select
                      value={endPage}
                      onChange={(e) => setEndPage(Number(e.target.value))}
                      className="border-b border-primary bg-surface-container-lowest focus:border-b-[3px] focus:outline-none outline-none ring-0 py-xs text-primary font-body-md appearance-none w-full cursor-pointer"
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
              <div className="flex flex-col gap-xs pt-2">
                <label className="font-label-caps text-label-caps text-outline">
                  SELECT RECITER
                </label>
                <select
                  value={reciter}
                  onChange={(e) => setReciter(Number(e.target.value))}
                  className="border-b border-primary bg-surface-container-lowest focus:border-b-[3px] focus:outline-none outline-none ring-0 py-xs text-primary font-body-md appearance-none w-full cursor-pointer"
                >
                  <option value={6}>Mahmoud Khalil Al-Husary</option>
                  <option value={7}>Abdul Rahman Al-Sudais</option>
                </select>
              </div>

              <div className="pt-lg">
                <button
                  onClick={async () => {
                    try {
                      const db = await initDatabase();
                      await db.write(async () => {
                        await db.get<Range>("range").create((record) => {
                          if (mode === "surah") {
                            record.startSurahNumber = startSurah;
                            record.startSurahName =
                              currentStartSurahData?.transliteration || "";
                            record.startAyahNumber = startVerse;
                            record.endSurahNumber = endSurah;
                            record.endSurahName =
                              currentEndSurahData?.transliteration || "";
                            record.endAyahNumber = endVerse;
                          } else if (mode === "page") {
                            record.startPage = startPage;
                            record.endPage = endPage;
                          }
                          record.reciter = reciter;
                        });
                      });
                      console.log("Range saved successfully");
                      setDialogOpen(false);
                    } catch (error) {
                      console.error("Failed to save range:", error);
                    }
                  }}
                  className="bg-primary text-background border-2 border-primary active:bg-background active:text-primary transition-none w-full py-md font-headline-md flex items-center justify-center gap-sm group cursor-pointer"
                >
                  BEGIN REVISION
                  <span className="material-symbols-outlined transition-transform group-active:translate-x-1">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
