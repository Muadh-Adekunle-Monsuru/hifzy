import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hifzy",
    short_name: "Hifzy",
    description:
      "Master your Quranic memorization with spaced repetition, audio recording, and progress tracking.",
    start_url: "/",
    display: "standalone",
    background_color: "#131314",
    theme_color: "#131314",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
