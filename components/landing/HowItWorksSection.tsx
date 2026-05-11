import React from "react";
import { MotionDiv, MotionSection } from "../ui/Motion";
import { fadeIn, stagger } from "@/lib/motion";

export function HowItWorksSection() {
  return (
    <MotionSection
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="px-margin-mobile md:px-margin-desktop py-xl bg-surface-container-low"
    >
      <div className="text-center mb-xl">
        <h2 className="font-display-lg text-headline-md text-primary uppercase tracking-widest mb-xs">
          The Revision Loop
        </h2>
        <div className="w-12 h-1 bg-primary mx-auto"></div>
      </div>
      <MotionDiv
        variants={fadeIn}
        className="flex flex-col md:flex-row gap-lg items-start relative"
      >
        {/* Step 1 */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-16 h-16 border-2 border-primary flex items-center justify-center mb-md bg-background">
            <span className="font-label-caps text-headline-md">01</span>
          </div>
          <h4 className="font-headline-md text-headline-md text-primary mb-sm">
            Input Range
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Select specific Surahs, Pages, or Juz to focus your session.
          </p>
        </div>
        <div className="hidden md:block absolute left-[33%] top-8 w-[5%] step-line h-px"></div>

        {/* Step 2 */}
        <MotionDiv
          variants={fadeIn}
          className="flex-1 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 border-2 border-primary flex items-center justify-center mb-md bg-background">
            <span className="font-label-caps text-headline-md">02</span>
          </div>
          <h4 className="font-headline-md text-headline-md text-primary mb-sm">
            Active Recite
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            See a prompt Ayah, record your recitation of the following verses.
          </p>
        </MotionDiv>
        <div className="hidden md:block absolute left-[66%] top-8 w-[5%] step-line h-px"></div>

        {/* Step 3 */}
        <MotionDiv
          variants={fadeIn}
          className="flex-1 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-primary text-on-primary flex items-center justify-center mb-md">
            <span className="font-label-caps text-headline-md">03</span>
          </div>
          <h4 className="font-headline-md text-headline-md text-primary mb-sm">
            Self Perfect
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Compare your audio with the reciter and grade your memory
            difficulty.
          </p>
        </MotionDiv>
      </MotionDiv>
    </MotionSection>
  );
}
