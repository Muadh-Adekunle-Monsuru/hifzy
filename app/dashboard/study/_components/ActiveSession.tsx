"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/hooks/useSpacedRepetition";
import { ChevronLeft, Mic, MicVocal } from "lucide-react";
import { useRouter } from "next/navigation";
import FrontAudioTogglePlayer from "./FrontAudioPlay";
import AllAudioPlayer from "./AllAudioPlayer";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";

interface ActiveSessionProps {
  currentCardIndex: number;
  cardsDue: number;
  currentCard: Card;
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
  handleGrade: (quality: number) => void;
}

const softFade: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeOut" } },
};

export function ActiveSession({
  currentCardIndex,
  cardsDue,
  currentCard,
  showAnswer,
  setShowAnswer,
  handleGrade,
}: ActiveSessionProps) {
  const router = useRouter();
  const [playmode, setPlayMode] = useState("");

  const togglePlayMode = (value: string) => {
    setPlayMode(value);
  };
  return (
    <div className="flex flex-col gap-5 md:w-5xl mx-auto py-20">
      <Button
        variant={"outline"}
        className="w-fit mb-5"
        onClick={() => {
          router.push("/dashboard");
        }}
      >
        <ChevronLeft /> Dashboard
      </Button>

      {/* Progress Section */}
      <div className="w-full">
        <div className="flex justify-between items-end mb-2">
          <span className="uppercase">Session Progress</span>
          <span className="font-label-caps text-primary">
            {currentCardIndex + 1} / {cardsDue} Cards
          </span>
        </div>
        {/* Progress Bar using your variable colors */}
        <div className="h-2 w-full bg-white/10 border border-border overflow-hidden rounded-full">
          <div
            className="h-full bg-primary transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{
              width: `${((currentCardIndex + 1) / cardsDue) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
        {/* Prompt Ayah Cell */}
        <div className="w-full bento-cell p-3 px-10 bg-card overflow-hidden flex flex-col items-center justify-center gap-3">
          <span className="font-label-caps text-muted-foreground uppercase">
            Front Card
          </span>
          <div className=" w-full">
            <p
              className="quran-container text-5xl md:text-3xl arabic-glow text-justify text-primary"
              dir="rtl"
              lang="ar"
            >
              {currentCard.arabicText}
            </p>
          </div>
          <FrontAudioTogglePlayer audioUrl={currentCard.audioUrl} />
        </div>

        <div className="transition-all duration-300 ease-in-out">
          <AnimatePresence mode="wait">
            {!showAnswer ? (
              <motion.div
                key="recording-section"
                variants={softFade}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-6"
              >
                <div className="md:col-span-12 bento-cell p-8 bg-background flex flex-col items-center justify-center gap-6">
                  {/* Recording Interaction Cell */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative flex items-center justify-center">
                      <motion.button
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-20 h-20 bg-primary text-background rounded-full flex items-center justify-center relative z-10 shadow-lg"
                      >
                        <span
                          className="material-symbols-outlined text-4xl"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          mic
                        </span>
                      </motion.button>
                    </div>
                    <p className="font-label-caps text-primary tracking-widest mt-2">
                      TAP TO RECORD RESPONSE
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Recite the next three verses from memory
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAnswer(true)}
                  className="md:col-span-12 w-full py-4 border-2 border-primary bg-primary text-background font-bold uppercase tracking-widest hover:bg-transparent hover:text-primary transition-all active:scale-[0.98]"
                >
                  Reveal Answer
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="answer-section"
                variants={softFade}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-3"
              >
                <div className="w-full bento-cell p-3 px-10 bg-card overflow-hidden flex flex-col items-center justify-center gap-3">
                  <span className="font-label-caps text-muted-foreground uppercase">
                    Back Card
                  </span>
                  <div className="w-full">
                    {JSON.parse(currentCard.answerVerses).map(
                      (verse: any, index: number) => (
                        <p
                          key={index}
                          className="quran-container text-5xl md:text-3xl arabic-glow text-justify text-primary py-2 border-b border-secondary"
                          dir="rtl"
                          lang="ar"
                        >
                          {verse.arabic_text}
                        </p>
                      ),
                    )}
                  </div>
                </div>

                <div className="w-full">
                  <div className="grid grid-cols-12 gap-3 w-full">
                    <div className="col-span-12  md:col-span-4 bento-cell p-5">
                      <p className="text-center mb-2 font-medium text-muted-foreground uppercase font-mono">
                        Audio Comparision
                      </p>
                      <div className="flex justify-around gap-5 border-t border-white/20 pt-5">
                        <div
                          onClick={() => setPlayMode("my-audio")}
                          className={`size-32 border p-5 flex flex-col items-center justify-center hover:bg-primary hover:text-black transition-all duration-200 ease-in-out cursor-pointer`}
                        >
                          <Mic className="size-5" />
                          <p className="mt-2 text-xs text-center font-mono uppercase">
                            Listen to me
                          </p>
                        </div>
                        <AllAudioPlayer
                          answerVerses={currentCard.answerVerses}
                          isSelected={playmode === "reciter-audio"}
                          togglePlayMode={togglePlayMode}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-8 flex flex-col gap-4 bento-cell p-5">
                      <p className="text-center mb-2 font-medium text-muted-foreground uppercase font-mono border-b border-white/20 pb-2">
                        HOW WELL DID YOU DO?
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
                        {[
                          {
                            value: 0,
                            label: "Hard (Again)",
                            color: "hover:bg-yellow-900/50 border-yellow-900",
                          },
                          {
                            value: 2,
                            label: "Good",
                            color: "hover:bg-blue-900/50 border-blue-900",
                          },
                          {
                            value: 4,
                            label: "Easy",
                            color: "hover:bg-green-900/50 border-green-900",
                          },
                          {
                            value: 5,
                            label: "Perfect",
                            color: "hover:bg-emerald-900/50 border-emerald-900",
                          },
                        ].map((grade) => (
                          <button
                            key={grade.value}
                            onClick={() => handleGrade(grade.value)}
                            className={`aspect-square  py-3 border-2 flex flex-col items-center justify-center   hover:bg-white/80 hover:text-black transition-all duration-200 ease-in-out`}
                          >
                            <span className="font-label-caps text-sm">
                              {grade.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
