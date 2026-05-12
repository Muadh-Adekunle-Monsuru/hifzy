"use client";
import { MotionDiv } from "@/components/ui/Motion";
import { fadeUp } from "@/lib/motion";
import { getToken } from "@/lib/utils/auth";
import { useEffect, useState } from "react";

export function DashboardHeader() {
  const [firstName, setFirst] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const getUser = async () => {
      const response = await fetch(
        "https://quran-be-59779bf2.fastapicloud.dev/auth/me",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setFirst(data?.username[0]);
      }
    };

    getUser();
  }, []);
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
          Ahlan, {firstName.toUpperCase()} 👋
        </h2>
      </MotionDiv>
      <MotionDiv variants={fadeUp} className="">
        <button className="mt-md w-fit bg-primary text-on-primary px-lg py-xs font-bold active:scale-95 transition-all">
          RESUME SESSION
        </button>
      </MotionDiv>
    </MotionDiv>
  );
}
