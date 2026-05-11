import { MotionDiv } from "@/components/ui/Motion";
import { fadeUp } from "@/lib/motion";
import React from "react";

export function DashboardHeader() {
  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      className="mb-lg flex flex-col md:flex-row md:items-end justify-between gap-sm"
    >
      <MotionDiv variants={fadeUp}>
        <p className="font-label-caps text-label-caps text-outline mb-xs">
          BISMILLAHIR RAHMANIR RAHIM
        </p>
        <h2 className="font-display-lg text-display-lg tracking-tighter">
          Ahlan, Hafiz.
        </h2>
      </MotionDiv>
      <MotionDiv
        variants={fadeUp}
        className="flex items-center gap-sm bg-surface-container-low p-sm border border-outline-variant"
      >
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps text-outline">
            SYNC STATUS
          </span>
          <span className="font-headline-md text-headline-md-mobile text-primary">
            Offline Ready
          </span>
        </div>
        <span
          className="material-symbols-outlined text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          cloud_done
        </span>
      </MotionDiv>
    </MotionDiv>
  );
}
