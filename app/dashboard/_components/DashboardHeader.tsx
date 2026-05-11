"use client";
import { MotionDiv } from "@/components/ui/Motion";
import { fadeUp } from "@/lib/motion";
import { getToken } from "@/lib/utils/auth";
import { useEffect, useState } from "react";

export function DashboardHeader() {
  const [firstName, setFirst] = useState("");
  useEffect(() => {
    const token = getToken();
    const getUser = async () => {
      const response = await fetch(
        "https://quran-be-59779bf2.fastapicloud.dev/auth/me",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const { data } = await response.json();
        setFirst(data.user.given_name || data.user.username || "There");
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
          Ahlan, {firstName} 👋.
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
