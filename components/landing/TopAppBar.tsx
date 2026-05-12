"use client";
import { fadeUp } from "@/lib/motion";
import Link from "next/link";
import { MotionDiv } from "../ui/Motion";
import LoginDialog from "./LoginDialog";
import { getToken } from "@/lib/utils/auth";
import LogoutButton from "./LogoutButton";
import { useEffect, useState } from "react";

export function TopAppBar() {
  const [token, setToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setToken(getToken());
  }, []);

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
      <MotionDiv variants={fadeUp} className="">
        {!isMounted ? null : token ? <LogoutButton /> : <LoginDialog />}
      </MotionDiv>
    </MotionDiv>
  );
}
