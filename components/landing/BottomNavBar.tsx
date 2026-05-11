import React from 'react';

export function BottomNavBar() {
  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center h-16 bg-background border-t-2 border-primary">
      <div className="flex flex-col items-center justify-center bg-primary text-on-primary p-xs w-full h-full cursor-pointer transition-all duration-100 ease-linear">
        <span className="material-symbols-outlined">grid_view</span>
        <span className="font-label-caps text-[10px] mt-1">Dashboard</span>
      </div>
      <div className="flex flex-col items-center justify-center text-primary p-xs w-full h-full cursor-pointer hover:bg-on-surface-variant/20 transition-all duration-100 ease-linear">
        <span className="material-symbols-outlined">settings_suggest</span>
        <span className="font-label-caps text-[10px] mt-1">Setup</span>
      </div>
      <div className="flex flex-col items-center justify-center text-primary p-xs w-full h-full cursor-pointer hover:bg-on-surface-variant/20 transition-all duration-100 ease-linear">
        <span className="material-symbols-outlined">auto_graph</span>
        <span className="font-label-caps text-[10px] mt-1">Stats</span>
      </div>
    </nav>
  );
}
