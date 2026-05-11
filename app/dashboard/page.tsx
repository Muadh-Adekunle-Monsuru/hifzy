"use client";
import React, { useState } from "react";
import "./dashboard.css";

import { DashboardHeader } from "./_components/DashboardHeader";
import { MasteryHeatmap } from "./_components/MasteryHeatmap";
import { CurrentStreak } from "./_components/CurrentStreak";
import { RecentRanges } from "./_components/RecentRanges";
import { RetentionStats } from "./_components/RetentionStats";
import { DailyTip } from "./_components/DailyTip";
import { TopAppBar } from "@/components/landing/TopAppBar";
import { Footer } from "@/components/landing/Footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return null;
  }

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen">
      <TopAppBar />
      <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="sky-doodle top-40 left-10">
          <span className="material-symbols-outlined text-[120px]">
            dark_mode
          </span>
        </div>
        <div className="sky-doodle bottom-20 right-20 scale-150 rotate-12">
          <span className="material-symbols-outlined text-[80px]">flare</span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <DashboardHeader />

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <MasteryHeatmap />
            <CurrentStreak />
            <RecentRanges />
            <RetentionStats />
            <DailyTip />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
