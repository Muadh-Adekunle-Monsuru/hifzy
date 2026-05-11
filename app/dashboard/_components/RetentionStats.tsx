import React from 'react';

export function RetentionStats() {
  return (
    <div className="md:col-span-6 bento-card bg-surface-container p-md">
      <h3 className="font-label-caps text-label-caps text-outline mb-md">RETENTION BY JUZ</h3>
      <div className="space-y-sm">
        <div className="flex items-center gap-md">
          <span className="font-label-caps text-label-caps w-12">JUZ 1</span>
          <div className="flex-grow flex gap-1">
            <div className="h-4 w-4 bg-primary"></div><div className="h-4 w-4 bg-primary"></div><div className="h-4 w-4 bg-primary"></div><div className="h-4 w-4 bg-primary"></div><div className="h-4 w-4 bg-outline-variant"></div>
          </div>
          <span className="font-label-caps text-label-caps text-primary">SOLID</span>
        </div>
        <div className="flex items-center gap-md">
          <span className="font-label-caps text-label-caps w-12">JUZ 2</span>
          <div className="flex-grow flex gap-1">
            <div className="h-4 w-4 bg-primary"></div><div className="h-4 w-4 bg-primary"></div><div className="h-4 w-4 bg-outline-variant"></div><div className="h-4 w-4 bg-outline-variant"></div><div className="h-4 w-4 bg-outline-variant"></div>
          </div>
          <span className="font-label-caps text-label-caps text-outline">SHAKY</span>
        </div>
        <div className="flex items-center gap-md">
          <span className="font-label-caps text-label-caps w-12">JUZ 3</span>
          <div className="flex-grow flex gap-1">
            <div className="h-4 w-4 bg-primary"></div><div className="h-4 w-4 bg-outline-variant"></div><div className="h-4 w-4 bg-outline-variant"></div><div className="h-4 w-4 bg-outline-variant"></div><div className="h-4 w-4 bg-outline-variant"></div>
          </div>
          <span className="font-label-caps text-label-caps text-outline">WEAK</span>
        </div>
      </div>
    </div>
  );
}
