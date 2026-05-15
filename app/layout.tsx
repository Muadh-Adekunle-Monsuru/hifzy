import type { Metadata, Viewport } from "next";

import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

// Initialize fonts
const geist = Geist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const sourceSerif_4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Hifzy -Quranic Memorization Learning Platform",
  description:
    "Master your Quranic memorization with spaced repetition, audio recording, and progress tracking. Offline-first app for Hifz students.",
  icons: {
    icon: [
      {
        url: "/android-chrome-192x192.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/android-chrome-512x512.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`font-sans antialiased bg-white text-gray-900  ${geist.className}`}
      >
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
