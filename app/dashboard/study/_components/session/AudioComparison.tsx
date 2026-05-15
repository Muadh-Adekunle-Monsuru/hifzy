"use client";
import { Mic, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AllAudioPlayer from "../AllAudioPlayer";
import { Card } from "@/hooks/useSpacedRepetition";

interface AudioComparisonProps {
  currentCard: Card;
  playmode: string;
  setPlayMode: (mode: string) => void;
  togglePlayMode: (value: string) => void;
  userAudio: string;
}

export function AudioComparison({
  currentCard,
  playmode,
  setPlayMode,
  togglePlayMode,
  userAudio,
}: AudioComparisonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (playmode !== "my-audio") {
      setIsPlaying(false);
      audioRef.current?.pause();
    }
  }, [playmode]);

  const toggleUserAudio = () => {
    if (!userAudio) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(userAudio);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setPlayMode("");
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayMode("");
    } else {
      togglePlayMode("my-audio");
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="col-span-12 md:col-span-4 bento-cell p-5">
      <p className="text-center mb-2 font-medium text-muted-foreground uppercase font-mono">
        Audio Comparision
      </p>
      <div className="flex justify-around gap-5 border-t border-white/20 pt-5">
        <div
          onClick={toggleUserAudio}
          className={`size-32 border p-5 flex flex-col items-center justify-center hover:bg-primary hover:text-black transition-all duration-200 ease-in-out cursor-pointer ${
            isPlaying ? "bg-primary text-black" : ""
          } ${!userAudio ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isPlaying ? (
            <Pause className="size-5" />
          ) : (
            <Mic className="size-5" />
          )}
          <p className="mt-2 text-xs text-center font-mono uppercase">
            {isPlaying ? "Playing..." : "Listen to me"}
          </p>
        </div>
        <AllAudioPlayer
          answerVerses={currentCard.answerVerses}
          isSelected={playmode === "reciter-audio"}
          togglePlayMode={togglePlayMode}
        />
      </div>
    </div>
  );
}
