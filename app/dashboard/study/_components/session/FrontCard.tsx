"use client";
import FrontAudioTogglePlayer from "../FrontAudioPlay";
import { Card } from "@/hooks/useSpacedRepetition";

interface FrontCardProps {
  currentCard: Card;
}

export function FrontCard({ currentCard }: FrontCardProps) {
  return (
    <div className="w-full bento-cell p-3 md:px-10 bg-card overflow-hidden flex flex-col items-center justify-center gap-3">
      <span className="font-label-caps text-muted-foreground uppercase">
        Front Card
      </span>
      <div className=" w-full">
        <p
          className="quran-container text-3xl arabic-glow text-justify text-primary"
          dir="rtl"
          lang="ar"
        >
          {currentCard.arabicText}
        </p>
      </div>
      <FrontAudioTogglePlayer audioUrl={currentCard.audioUrl} />
    </div>
  );
}
