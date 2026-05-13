"use client";

import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
// import { Play } from "next/font/google";
import { useState, useRef, useEffect } from "react";

export default function FrontAudioTogglePlayer({
  audioUrl,
}: {
  audioUrl: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      setIsPlaying(false);
    } else {
      // Initialize it for the first time
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    // We wrap it in a play() promise to catch potential browser blocks
    const playAudio = async () => {
      try {
        await audioRef.current?.play();
        setIsPlaying(true);
      } catch (error) {
        // This usually happens on the very first card if the user hasn't clicked anything yet
        console.warn(
          "Autoplay blocked: User must interact with the page first.",
        );
        setIsPlaying(false);
      }
    };

    playAudio();
    return () => {
      audioRef.current?.pause();
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    // Toggle the state
    setIsPlaying(!isPlaying);
  };

  return (
    <Button
      variant={"ghost"}
      size={"lg"}
      onClick={togglePlayPause}
      className={`transition-all ${
        isPlaying ? "text-red-500" : "text-green-600"
      } text-white p-4 cursor-pointer group`}
    >
      {isPlaying ? (
        <Pause className="size-8 text-muted-foreground group-hover:text-primary" />
      ) : (
        <Play className="size-8 text-muted-foreground group-hover:text-primary" />
      )}
    </Button>
  );
}
