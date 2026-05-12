import { SessionCard } from "./types";

interface ActiveSessionProps {
  currentCardIndex: number;
  cardsDue: number;
  currentCard: SessionCard;
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
  handleGrade: (quality: number) => void;
}

export function ActiveSession({
  currentCardIndex,
  cardsDue,
  currentCard,
  showAnswer,
  setShowAnswer,
  handleGrade,
}: ActiveSessionProps) {
  return (
    <>
      {/* Progress Bar Section */}
      <div className="w-full max-w-3xl mb-gap-xl">
        <div className="flex justify-between items-end mb-gap-xs">
          <span className="font-label-caps text-label-caps text-secondary uppercase">
            Session Progress
          </span>
          <span className="font-label-caps text-label-caps text-primary">
            {currentCardIndex + 1} / {cardsDue} Ayahs
          </span>
        </div>
        <div className="h-2 w-full bg-surface-container-highest border border-outline-variant overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentCardIndex + 1) / cardsDue) * 100}%`,
              boxShadow: "0 0 10px rgba(255,255,255,0.5)",
            }}
          ></div>
        </div>
      </div>

      {/* The Revision Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gap-gutter w-full max-w-5xl">
        {/* Context Cell */}
        <div className="md:col-span-12 lg:col-span-3 bento-cell p-gap-md bg-surface-container-low relative overflow-hidden flex flex-col justify-between order-2 lg:order-1">
          <div className="relative z-10">
            <p className="font-label-caps text-label-caps text-secondary mb-gap-xs">
              SURAH
            </p>
            <h2 className="font-headline-md text-headline-md text-primary mb-md">
              {currentCard.verse.surahName}
            </h2>
            <div className="h-px bg-outline-variant w-full mb-md"></div>
            <p className="font-label-caps text-label-caps text-secondary mb-gap-xs">
              AYAH
            </p>
            <h3 className="font-headline-md text-headline-md text-primary">
              {currentCard.verse.ayahNumber}
            </h3>
          </div>
          {/* Decorative Moon */}
          <div className="absolute -bottom-4 -right-4 opacity-20 transform rotate-12">
            <span
              className="material-symbols-outlined text-[120px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              brightness_3
            </span>
          </div>
        </div>

        {/* Prompt Ayah Cell */}
        <div className="md:col-span-12 lg:col-span-9 bento-cell p-gap-xl bg-surface-container relative overflow-hidden flex flex-col items-center justify-center order-1 lg:order-2">
          <div className="absolute top-gap-md right-gap-md">
            <span className="font-label-caps text-label-caps text-outline-variant">
              Prompt
            </span>
          </div>
          <div className="text-center w-full">
            <p
              className="font-arabic-primary text-[48px] text-primary arabic-glow leading-loose mb-lg"
              dir="rtl"
            >
              {currentCard.verse.arabicText}
            </p>
            {showAnswer && (
              <div className="mt-gap-md mb-gap-md text-secondary">
                <p className="italic mb-2">{currentCard.verse.transliteration}</p>
                <p className="text-sm">{currentCard.verse.translation}</p>
              </div>
            )}
            <div className="flex items-center justify-center gap-gap-md">
              <button className="w-12 h-12 border-2 border-primary flex items-center justify-center hover:bg-primary hover:text-background transition-colors group">
                <span className="material-symbols-outlined group-active:scale-90">
                  play_arrow
                </span>
              </button>
              <span className="font-label-caps text-label-caps text-secondary">
                Recitation
              </span>
            </div>
          </div>
        </div>

        {/* Recording Interaction Cell */}
        <div className="md:col-span-12 bento-cell p-gap-lg bg-background flex flex-col items-center justify-center gap-gap-md order-3">
          <div className="flex flex-col items-center gap-gap-sm">
            <div className="relative flex items-center justify-center">
              {/* Pulse Rings */}
              <div className="absolute w-24 h-24 border border-primary rounded-full animate-ping opacity-20"></div>
              <div className="absolute w-32 h-32 border border-primary rounded-full animate-ping opacity-10"></div>
              <button className="w-20 h-20 bg-primary text-background rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform relative z-10">
                <span
                  className="material-symbols-outlined text-[40px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  mic
                </span>
              </button>
            </div>
            <p className="font-label-caps text-label-caps text-primary tracking-widest mt-gap-sm">
              TAP TO RECORD RESPONSE
            </p>
            <p className="text-secondary text-sm font-body-md opacity-60">
              Recite the verse from memory
            </p>
          </div>
        </div>

        {/* Main Action Button */}
        <div className="md:col-span-12 mt-gap-md order-4">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-gap-md border-2 border-primary bg-primary text-background font-headline-md uppercase tracking-tighter hover:bg-background hover:text-primary transition-all active:scale-[0.98]"
            >
              Reveal Answer
            </button>
          ) : (
            <div className="flex flex-col gap-gap-sm">
              <p className="text-center font-label-caps text-primary mb-2">HOW WELL DID YOU DO?</p>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-gap-sm w-full">
                {[
                  { value: 0, label: "Blackout", color: "hover:bg-red-900/50 border-red-900" },
                  { value: 1, label: "Difficult", color: "hover:bg-orange-900/50 border-orange-900" },
                  { value: 2, label: "Hard", color: "hover:bg-yellow-900/50 border-yellow-900" },
                  { value: 3, label: "Good", color: "hover:bg-blue-900/50 border-blue-900" },
                  { value: 4, label: "Easy", color: "hover:bg-green-900/50 border-green-900" },
                  { value: 5, label: "Perfect", color: "hover:bg-emerald-900/50 border-emerald-900" },
                ].map((grade) => (
                  <button
                    key={grade.value}
                    onClick={() => handleGrade(grade.value)}
                    className={`py-gap-sm border-2 transition-colors flex flex-col items-center justify-center bento-cell ${grade.color}`}
                  >
                    <span className="font-label-caps">{grade.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
