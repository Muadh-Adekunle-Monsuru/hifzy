import React from "react";
import { MotionDiv, MotionSection } from "../ui/Motion";
import { fadeIn, stagger } from "@/lib/motion";

export function HowItWorksSection() {
  return (
    <MotionSection
      initial="hidden"
      animate="visible"
      className="px-5 md:px-10 py-20 bg-[#1c1b1b]"
    >
      <div className="text-center mb-20">
        <h2 className="font-bold text-4xl text-primary mb-3">
          The Revision Loop
        </h2>
        <div className="w-12 h-1 bg-primary mx-auto"></div>
      </div>
      <MotionDiv
        variants={fadeIn}
        className="flex flex-col md:flex-row gap-lg items-center justify-center relative space-y-5"
      >
        {/* Step 1 */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-16 h-16 border-2 border-primary flex items-center justify-center mb-4 bg-background">
            <span className="text-headline-md text-primary">01</span>
          </div>
          <h4 className="font-bold text-xl text-primary mb-3">Input Range</h4>
          <p className="text-gray-300 font-light max-w-xs">
            Select specific Surahs, Pages, or Juz to focus your session.
          </p>
        </div>
        <div className="hidden md:block absolute left-[33%] top-8 w-[5%] bg-primary/50 rounded-full h-1"></div>

        {/* Step 2 */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-16 h-16 border-2 border-primary flex items-center justify-center mb-4 bg-background">
            <span className="text-headline-md text-primary">02</span>
          </div>
          <h4 className="font-bold text-xl text-primary mb-3">Active Recite</h4>
          <p className="text-gray-300 font-light max-w-xs">
            See a prompt Ayah, record your recitation of the following verses.
          </p>
        </div>
        <div className="hidden md:block absolute left-[66%] top-8 w-[5%] bg-primary/50 rounded-full h-1"></div>

        {/* Step 3 */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary text-on-primary flex items-center justify-center mb-4">
            <span className="text-headline-md text-black">03</span>
          </div>
          <h4 className="font-bold text-xl text-primary mb-3">Self Perfect</h4>
          <p className="text-gray-300 font-light max-w-xs">
            Compare your audio with the reciter and grade your memory
            difficulty.
          </p>
        </div>
      </MotionDiv>
    </MotionSection>
  );
}
