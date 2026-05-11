import React from 'react';

export function DailyTip() {
  return (
    <div className="md:col-span-6 bento-card bg-surface-container-high p-md flex flex-col justify-between">
      <div>
        <h3 className="font-label-caps text-label-caps text-outline mb-md">QUICK ACTION</h3>
        <p className="text-headline-md-mobile font-headline-md italic">"Retention is not memorization; it is the repeated return to the word until it resides within you."</p>
      </div>
      <button className="mt-md w-fit bg-primary text-on-primary px-lg py-xs font-bold active:scale-95 transition-all">
        RESUME SESSION
      </button>
    </div>
  );
}
