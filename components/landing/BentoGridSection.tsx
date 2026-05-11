import { AudioLines, CloudOff, Repeat, WifiOff } from "lucide-react";
import React from "react";
import { MotionDiv, MotionSection } from "../ui/Motion";
import { stagger, fadeUp } from "@/lib/motion";

export function BentoGridSection() {
  return (
    <MotionSection
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="px-margin-mobile md:px-margin-desktop py-xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-md md:h-[70vh]">
        {/* Offline-First */}
        <MotionDiv
          variants={fadeUp}
          className="md:col-span-8 bento-cell p-md flex flex-col justify-between relative overflow-hidden group"
        >
          <CloudOff className="size-10 md:size-20" />
          <div>
            <h3 className="font-headline-md text-headline-md text-primary mb-xs">
              Offline-First Architecture
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Seamless revision regardless of your connection. Your data syncs
              automatically once you're back online.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-sm opacity-10 group-hover:opacity-30 transition-opacity">
            <WifiOff className="size-20" />
          </div>
        </MotionDiv>

        {/* SRS Logic */}
        <MotionDiv
          variants={fadeUp}
          className="md:col-span-4 bento-cell p-md flex flex-col justify-between border-primary"
        >
          <div className="flex justify-between items-start">
            <Repeat className="size-10" />
            <div className="text-label-caps bg-primary text-on-primary px-xs py-1">
              ALGORITHM
            </div>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-primary mb-xs">
              SRS Logic
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Intelligent Spaced Repetition scheduling based on your self-graded
              performance.
            </p>
          </div>
        </MotionDiv>

        {/* Audio Comparison */}
        <MotionDiv
          variants={fadeUp}
          className="md:col-span-4 bento-cell p-md flex flex-col justify-between"
        >
          <AudioLines className="size-10" />
          <div>
            <h3 className="font-headline-md text-headline-md text-primary mb-xs">
              Audio Comparison
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Record your recitation and compare it directly with master
              reciters to self-correct.
            </p>
          </div>
        </MotionDiv>

        {/* Consistency */}
        <MotionDiv
          variants={fadeUp}
          className="md:col-span-8 bento-cell p-md flex items-center justify-between gap-md"
        >
          <div className="flex-1">
            <h3 className="font-headline-md text-headline-md text-primary mb-xs">
              Focus Focused
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Eliminating digital noise for spiritual retention. No ads, no
              social feeds, just the Quran.
            </p>
          </div>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-primary"></div>
            <div className="w-4 h-4 bg-outline-variant"></div>
            <div className="w-4 h-4 bg-primary"></div>
            <div className="w-4 h-4 bg-primary"></div>
            <div className="w-4 h-4 bg-primary"></div>
          </div>
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
