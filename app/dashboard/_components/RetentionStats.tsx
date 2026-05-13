import React from "react";

export function RetentionStats() {
  return (
    <div className="md:col-span-6 border-2 border-neutral-800 bg-[#1c1b1b]  p-5 py-10">
      <h3 className="text-muted-foreground text-sm font-mono font-semibold text-outline mb-3">
        RETENTION BY JUZ
      </h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold w-10">JUZ 1</span>
          <div className="flex-grow flex gap-1">
            <div className="h-4 w-4 bg-primary"></div>
            <div className="h-4 w-4 bg-primary"></div>
            <div className="h-4 w-4 bg-primary"></div>
            <div className="h-4 w-4 bg-primary"></div>
            <div className="h-4 w-4 bg-outline-variant"></div>
          </div>
          <span className="text-xs font-semibold text-primary">SOLID</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold w-10">JUZ 2</span>
          <div className="flex-grow flex gap-1">
            <div className="h-4 w-4 bg-primary"></div>
            <div className="h-4 w-4 bg-primary"></div>
            <div className="h-4 w-4 bg-outline-variant"></div>
            <div className="h-4 w-4 bg-outline-variant"></div>
            <div className="h-4 w-4 bg-outline-variant"></div>
          </div>
          <span className="text-xs font-semibold text-outline">SHAKY</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold w-10">JUZ 3</span>
          <div className="flex-grow flex gap-1">
            <div className="h-4 w-4 bg-primary"></div>
            <div className="h-4 w-4 bg-outline-variant"></div>
            <div className="h-4 w-4 bg-outline-variant"></div>
            <div className="h-4 w-4 bg-outline-variant"></div>
            <div className="h-4 w-4 bg-outline-variant"></div>
          </div>
          <span className="text-xs font-semibold text-outline">WEAK</span>
        </div>
      </div>
    </div>
  );
}
