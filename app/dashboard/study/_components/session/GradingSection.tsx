"use client";

interface GradingSectionProps {
  handleGrade: (quality: number) => void;
}

const GRADES = [
  {
    value: 0,
    label: "Again",
    color: "hover:bg-yellow-900/50 border-yellow-900",
  },
  {
    value: 2,
    label: "Hard",
    color: "hover:bg-blue-900/50 border-blue-900",
  },
  {
    value: 4,
    label: "Good",
    color: "hover:bg-green-900/50 border-green-900",
  },
  {
    value: 5,
    label: "Easy",
    color: "hover:bg-emerald-900/50 border-emerald-900",
  },
];

export function GradingSection({ handleGrade }: GradingSectionProps) {
  return (
    <div className="col-span-12 md:col-span-8 flex flex-col gap-4 bento-cell p-5">
      <p className="text-center mb-2 font-medium text-muted-foreground uppercase font-mono border-b border-white/20 pb-2">
        HOW WELL DID YOU DO?
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
        {GRADES.map((grade) => (
          <button
            key={grade.value}
            onClick={() => handleGrade(grade.value)}
            className={`aspect-square py-3 border-2 flex flex-col items-center justify-center hover:bg-white/80 hover:text-black transition-all duration-200 ease-in-out`}
          >
            <span className="font-label-caps text-sm">
              {grade.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
