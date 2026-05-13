import React from "react";
import { MotionDiv } from "../ui/Motion";
import { fadeUp } from "@/lib/motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      className="h-[70vh] flex flex-col items-center justify-center rounded-4xl"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='88' viewBox='0 0 80 88' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M22 21.91V26h-2c-9.94 0-18 8.06-18 18 0 9.943 8.058 18 18 18h2v4.09c8.012.722 14.785 5.738 18 12.73 3.212-6.99 9.983-12.008 18-12.73V62h2c9.94 0 18-8.06 18-18 0-9.943-8.058-18-18-18h-2v-4.09c-8.012-.722-14.785-5.738-18-12.73-3.212 6.99-9.983 12.008-18 12.73zM54 58v4.696c-5.574 1.316-10.455 4.428-14 8.69-3.545-4.262-8.426-7.374-14-8.69V58h-5.993C12.27 58 6 51.734 6 44c0-7.732 6.275-14 14.007-14H26v-4.696c5.574-1.316 10.455-4.428 14-8.69 3.545 4.262 8.426 7.374 14 8.69V30h5.993C67.73 30 74 36.266 74 44c0 7.732-6.275 14-14.007 14H54zM42 88c0-9.94 8.06-18 18-18h2v-4.09c8.016-.722 14.787-5.738 18-12.73v7.434c-3.545 4.262-8.426 7.374-14 8.69V74h-5.993C52.275 74 46 80.268 46 88h-4zm-4 0c0-9.943-8.058-18-18-18h-2v-4.09c-8.012-.722-14.785-5.738-18-12.73v7.434c3.545 4.262 8.426 7.374 14 8.69V74h5.993C27.73 74 34 80.266 34 88h4zm4-88c0 9.943 8.058 18 18 18h2v4.09c8.012.722 14.785 5.738 18 12.73v-7.434c-3.545-4.262-8.426-7.374-14-8.69V14h-5.993C52.27 14 46 7.734 46 0h-4zM0 34.82c3.213-6.992 9.984-12.008 18-12.73V18h2c9.94 0 18-8.06 18-18h-4c0 7.732-6.275 14-14.007 14H14v4.696c-5.574 1.316-10.455 4.428-14 8.69v7.433z' fill='%235f5e61' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      }}
    >
      <MotionDiv
        variants={fadeUp}
        className="max-w-2xl text-center px-10 flex flex-col items-center gap-3"
      >
        <h1 className="text-5xl font-bold text-primary mb-3">
          Master Your Hifz Through Active Recall
        </h1>
        <p className="text-muted-foreground text-lg font-medium mb-5">
          A streamlined, offline-first revision loop using Anki-style
          flashcards. Prompt with one Ayah, recite the next three, and verify
          with official recordings.
        </p>
        <Link
          href="/dashboard"
          className=" w-fit bg-primary px-10  py-4 border-2 border-primary text-background font-bold uppercase tracking-widest hover:bg-transparent hover:text-primary transition-all active:scale-[0.98]"
        >
          Begin Revision
        </Link>
      </MotionDiv>
    </MotionDiv>
  );
}
