import React from "react";

export interface DailyMotivation {
  day: string;
  quote: string;
}

const dailyMotivations: DailyMotivation[] = [
  {
    day: "Monday",
    quote:
      "Every ayah revised is a star added to your heart’s sky. Keep shining.",
  },
  {
    day: "Tuesday",
    quote:
      "Consistency is not about perfection; it is about showing up for your Muraja'ah even when the clouds are heavy.",
  },
  {
    day: "Wednesday",
    quote:
      "Like the moon, your progress has phases. Some days feel full, some feel small, but you are always there.",
  },
  {
    day: "Thursday",
    quote:
      "The best amongst you are those who learn and teach. Today, be the one who learns.",
  },
  {
    day: "Friday",
    quote:
      "Let your recitation be the peace in your busy week. One verse at a time, your heart finds its rhythm.",
  },
  {
    day: "Saturday",
    quote:
      "Revision is the thread that keeps the pearls of your Hifz together. Don't let the thread break.",
  },
  {
    day: "Sunday",
    quote:
      "The Quran is a lifelong companion. Today’s effort is a conversation that lasts forever.",
  },
];
export function DailyTip() {
  const today = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
  // Adjust index because array starts with Monday (index 0)
  const motivationIndex = (today + 6) % 7;
  const currentMotivation = dailyMotivations[motivationIndex];

  return (
    <div className="md:col-span-6  lg:col-span-4 border-2 border-neutral-800 bg-[#1c1b1b] p-5 flex flex-col justify-between">
      <div>
        <h3 className="text-muted-foreground text-sm font-mono font-semibold mb-3 ">
          MOTIVATION
        </h3>
        <p className="text-4xl lg:text-3xl italic font-thin">
          {currentMotivation.quote}
        </p>
      </div>
    </div>
  );
}
