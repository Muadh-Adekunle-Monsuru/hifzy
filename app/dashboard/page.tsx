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
import { Loader } from "lucide-react";

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
    return (
      <div className="bg-background h-screen flex flex-col items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background text-primary selection:bg-primary selection:text-black font-sans min-h-screen">
      <TopAppBar />
      <main className="pt-32 pb-24 px-5 md:px-20 min-h-screen relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <DashboardHeader />

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
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
