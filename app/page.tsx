import React from "react";
import { TopAppBar } from "@/components/landing/TopAppBar";
import { HeroSection } from "@/components/landing/HeroSection";
import { BentoGridSection } from "@/components/landing/BentoGridSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="dark bg-[#131314] text-on-surface selection:bg-primary selection:text-on-primary font-body-md min-h-screen">
      <TopAppBar />
      <main className="pt-24 pb-32  max-w-7xl mx-auto ">
        <HeroSection />
        <BentoGridSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}
