import React from "react";

export function Footer() {
  return (
    <footer className="bg-[#171718] text-primary border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-5 md:px-72 py-5 w-full">
      <div className="flex flex-col items-center md:items-start gap-2 mb-md md:mb-0">
        <div className="text-primary font-bold font-headline-md">Hifzy</div>
        <div className="font-label-caps text-label-caps opacity-80">
          Built for the Ummah
        </div>
      </div>
      <div className="flex gap-4 font-label-caps text-label-caps">
        <a
          className="text-primary/50 hover:text-primary transition-colors underline"
          href="#"
        >
          Privacy
        </a>
        <a
          className="text-primary/50 hover:text-primary transition-colors underline"
          href="#"
        >
          Support
        </a>
        <a
          className="text-primary/50 hover:text-primary transition-colors underline"
          href="#"
        >
          Open Source
        </a>
      </div>
    </footer>
  );
}
