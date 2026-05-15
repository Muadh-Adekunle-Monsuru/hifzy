"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/hooks/useSpacedRepetition";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";
import { SessionProgress } from "./session/SessionProgress";
import { FrontCard } from "./session/FrontCard";
import { RecordingInteraction } from "./session/RecordingInteraction";
import { BackCard } from "./session/BackCard";
import { AudioComparison } from "./session/AudioComparison";
import { GradingSection } from "./session/GradingSection";

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
  const [userAudio, setUserAudio] = useState("");

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

      <SessionProgress
        currentCardIndex={currentCardIndex}
        cardsDue={cardsDue}
      />

      <div className="w-full flex flex-col gap-3">
        <FrontCard currentCard={currentCard} />

        <div className="transition-all duration-300 ease-in-out">
          <AnimatePresence mode="wait">
            {!showAnswer ? (
            <RecordingInteraction
                setShowAnswer={setShowAnswer}
                variants={softFade}
                setUserAudio={setUserAudio}
              />
            ) : (
              <motion.div
                key="answer-section"
                variants={softFade}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-3"
              >
                <BackCard currentCard={currentCard} />

                <div className="w-full">
                  <div className="grid grid-cols-12 gap-3 w-full">
                    <AudioComparison
                      currentCard={currentCard}
                      playmode={playmode}
                      setPlayMode={setPlayMode}
                      togglePlayMode={togglePlayMode}
                      userAudio={userAudio}
                    />
                    <GradingSection handleGrade={handleGrade} />
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
