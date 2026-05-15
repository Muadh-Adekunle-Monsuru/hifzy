"use client";
import { Card } from "@/hooks/useSpacedRepetition";

interface BackCardProps {
  currentCard: Card;
}

export function BackCard({ currentCard }: BackCardProps) {
  return (
    <div className="w-full bento-cell p-3 md:px-10 bg-card overflow-hidden flex flex-col items-center justify-center gap-3">
      <span className="font-label-caps text-muted-foreground uppercase">
        Back Card
      </span>
      <div className="w-full">
        {JSON.parse(currentCard.answerVerses).map(
          (verse: any, index: number) => (
            <p
              key={index}
              className="quran-container text-xl md:text-3xl arabic-glow text-justify text-primary py-2 border-b border-secondary"
              dir="rtl"
              lang="ar"
            >
              {verse.arabic_text}
            </p>
          ),
        )}
      </div>
    </div>
  );
}
