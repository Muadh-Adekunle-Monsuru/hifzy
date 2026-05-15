"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function EmptySession() {
  const router = useRouter();
  return (
    <div className="w-full max-w-2xl bento-cell  bg-[#1b1b1f] relative overflow-hidden flex flex-col items-center p-5 gap-md py-10">
      <div className="flex-grow flex flex-col items-center justify-center gap-4 text-center relative z-10">
        <h2 className="text-3xl font-bold text-primary mb-md">
          No verses due for review
        </h2>
        <p className="text-primary/80 mb-4 max-w-sm">
          Great job! All your revisions are on schedule. Come back tomorrow to
          continue.
        </p>
        <Link href="/dashboard">
          <button className="w-fit bg-primary px-10  py-4 border-2 border-primary text-background font-bold uppercase tracking-widest hover:bg-transparent hover:text-primary transition-all active:scale-[0.98] cursor-pointer">
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
