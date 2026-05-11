import { UserCircle } from "lucide-react";
import React from "react";
import { MotionDiv } from "../ui/Motion";
import { fadeUp } from "@/lib/motion";
import Link from "next/link";

export function TopAppBar() {
  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      className="bg-transparent backdrop-blur-sm text-primary border-b border-primary/10 fixed top-0 w-full z-50 flex justify-between items-center md:px-72 py-sm "
    >
      <MotionDiv
        variants={fadeUp}
        className="text-headline-md font-bold text-primary text-3xl select-none cursor-pointer"
      >
        <Link href="/">Al-Hifz</Link>
      </MotionDiv>
      <MotionDiv variants={fadeUp} className="flex items-center gap-sm">
        <UserCircle className="size-8" />
      </MotionDiv>
    </MotionDiv>
  );
}
