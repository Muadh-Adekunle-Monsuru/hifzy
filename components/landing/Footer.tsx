import React from "react";

export function Footer() {
  return (
    <footer className="bg-background text-secondary border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-72 py-lg w-full">
      <div className="flex flex-col items-center md:items-start gap-xs mb-md md:mb-0">
        <div className="text-primary font-bold font-headline-md">Al-Hifz</div>
        <div className="font-label-caps text-label-caps opacity-80">
          Built for the Ummah
        </div>
      </div>
      <div className="flex gap-lg font-label-caps text-label-caps">
        <a
          className="text-secondary hover:text-primary transition-colors underline"
          href="#"
        >
          Privacy
        </a>
        <a
          className="text-secondary hover:text-primary transition-colors underline"
          href="#"
        >
          Support
        </a>
        <a
          className="text-secondary hover:text-primary transition-colors underline"
          href="#"
        >
          Open Source
        </a>
      </div>
    </footer>
  );
}
