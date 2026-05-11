"use client";

import React from "react";
import { TopAppBar } from "@/components/landing/TopAppBar";
import { Footer } from "@/components/landing/Footer";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    window.location.href =
      "https://quran-be-59779bf2.fastapicloud.dev/auth/login";
  };

  return (
    <div className="dark bg-[#131314] text-on-surface selection:bg-primary selection:text-on-primary font-body-md min-h-screen flex flex-col">
      <TopAppBar />
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-32 px-4 max-w-7xl mx-auto w-full">
        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-8 flex flex-col items-center text-center shadow-lg">
          <UserCircle className="size-12 text-primary mb-4" />
          <h1 className="text-white text-2xl font-display-md mb-2">
            Sign in with Quran.com
          </h1>
          <p className="text-white/55 text-body-md mb-8">
            You can sign in using your Quran.com account to continue using the
            app.
          </p>
          <div className="flex w-full gap-4 justify-center">
            <Button
              type="submit"
              className="bg-primary text-on-primary cursor-pointer hover:bg-black/80 hover:text-white transition-all duration-200 ease-in-out flex-1"
              onClick={handleLogin}
            >
              Sign In
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
