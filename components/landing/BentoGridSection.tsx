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
      className="px-5  py-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3  md:h-[70vh] text-white">
        {/* Offline-First */}
        <MotionDiv
          variants={fadeUp}
          className="md:col-span-8 bento-cell p-4 flex flex-col justify-between relative overflow-hidden group"
        >
          <CloudOff className="size-10 md:size-20 text-muted-foreground" />
          <div>
            <h3 className="font-bold text-4xl text-primary mb-3">
              Offline-First Architecture
            </h3>
            <p className="font-light max-w-lg">
              Seamless revision regardless of your connection. Your data syncs
              automatically once you're back online.
            </p>
          </div>
        </MotionDiv>

        {/* SRS Logic */}
        <MotionDiv
          variants={fadeUp}
          className="md:col-span-4 bento-cell p-4 flex flex-col justify-between border-primary"
        >
          <div className="flex justify-between items-start">
            <Repeat className="size-10 md:size-20 text-muted-foreground" />
            <div className=" text-xs text-primary  px-2 py-1">ALGORITHM</div>
          </div>
          <div>
            <h3 className="font-bold text-4xl text-primary mb-3">SRS Logic</h3>
            <p className="font-light max-w-lg">
              Intelligent Spaced Repetition scheduling based on your self-graded
              performance.
            </p>
          </div>
        </MotionDiv>

        {/* Audio Comparison */}
        <MotionDiv
          variants={fadeUp}
          className="md:col-span-4 bento-cell p-4 flex flex-col justify-between"
        >
          <AudioLines className="size-10 md:size-20 text-muted-foreground" />
          <div>
            <h3 className="font-bold text-4xl text-primary mb-3">
              Audio Comparison
            </h3>
            <p className="font-light max-w-lg">
              Record your recitation and compare it directly with master
              reciters to self-correct.
            </p>
          </div>
        </MotionDiv>

        {/* Consistency */}
        <MotionDiv
          variants={fadeUp}
          className="md:col-span-8 bento-cell p-4 flex items-center justify-between gap-4"
        >
          <div className="flex-1">
            <h3 className="font-bold text-4xl text-primary mb-3">
              Focus Focused
            </h3>
            <p className="font-light max-w-lg">
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
