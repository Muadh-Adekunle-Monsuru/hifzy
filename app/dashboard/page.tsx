"use client";
import { useState } from "react";
import "./dashboard.css";

import { getToken } from "@/lib/utils/auth";
import { Footer } from "@/components/landing/Footer";
import { TopAppBar } from "@/components/landing/TopAppBar";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CurrentStreak } from "./_components/CurrentStreak";
import { DailyTip } from "./_components/DailyTip";
import { DashboardHeader } from "./_components/DashboardHeader";
import { MoonCard } from "./_components/MoonCard";
import { RecentRanges } from "./_components/RecentRanges";
import { StreakHeatmap } from "./_components/StreakHeatmap";
import { DailyVerse } from "./_components/DailyVerse";

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();

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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <StreakHeatmap />
            <CurrentStreak />
            <RecentRanges />
            <MoonCard />
            <DailyTip />
            <DailyVerse />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
