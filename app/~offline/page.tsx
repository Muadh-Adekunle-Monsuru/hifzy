import React from "react";
import { WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#131314] text-white p-5 text-center">
      <div className="bg-neutral-800/50 p-8 rounded-3xl border border-neutral-700/50 backdrop-blur-xl max-w-md w-full">
        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-black mb-4">You're Offline</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Don't worry! Hifzy is built to work offline. You can still access your
          saved ranges and continue your memorization.
        </p>
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block w-full py-4 bg-primary text-black font-bold rounded-2xl hover:bg-primary/90 transition-all active:scale-95"
          >
            Go to Dashboard
          </Link>
          <p className="text-xs text-neutral-500 uppercase tracking-widest font-medium">
            Data will sync when you're back online
          </p>
        </div>
      </div>
    </div>
  );
}
