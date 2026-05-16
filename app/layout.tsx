import type { Metadata, Viewport } from "next";
import { SerwistProvider } from "@serwist/turbopack/react";
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

const APP_NAME = "Hifzy";
const APP_DEFAULT_TITLE = "Hifzy - Quranic Memorization Platform";
const APP_TITLE_TEMPLATE = "%s - Hifzy";
const APP_DESCRIPTION = "Master your Quranic memorization with spaced repetition, audio recording, and progress tracking. Offline-first app for Hifz students.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: "https://hifzy-srs.vercel.app",
    siteName: APP_NAME,
    images: [
      {
        url: "https://res.cloudinary.com/dzrkcnt5h/image/upload/v1778915295/Screenshot_from_2026-05-16_08-07-53_mhwpkt.png",
        width: 1200,
        height: 630,
        alt: "Hifzy - Quranic Memorization Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: [
      "https://res.cloudinary.com/dzrkcnt5h/image/upload/v1778915295/Screenshot_from_2026-05-16_08-07-53_mhwpkt.png",
    ],
  },
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#131314",
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
        <SerwistProvider swUrl="/serwist/sw.js">
          {children}
          {process.env.NODE_ENV === "production" && <Analytics />}
          <Toaster position="top-center" />
        </SerwistProvider>
      </body>
    </html>
  );
}
