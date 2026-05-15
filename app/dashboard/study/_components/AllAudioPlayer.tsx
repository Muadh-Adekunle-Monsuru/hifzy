"use client";

import { MicVocal, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function AllAudioPlayer({
  answerVerses,
  isSelected,
  togglePlayMode,
}: {
  answerVerses: string;
  isSelected: boolean;
  togglePlayMode: (value: string) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parse once or keep in ref if it changes frequently
  const answerAudios = JSON.parse(answerVerses).map((v: any) => v.audio_url);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
    };
  }, []);

  // Sync internal isPlaying with external isSelected
  useEffect(() => {
    if (!isSelected) {
      setIsPlaying(false);
    }
  }, [isSelected]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    // Set source for the current index if it changed
    const currentAudioUrl = answerAudios[currentIndex];
    if (audio.src !== currentAudioUrl) {
      audio.src = currentAudioUrl;
      audio.load();
    }

    // Handle end of audio to play next one
    audio.onended = () => {
      if (currentIndex < answerAudios.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Finished all audios
        setIsPlaying(false);
        setCurrentIndex(0);
      }
    };

    if (isPlaying && isSelected) {
      audio.play().catch((error) => {
        console.warn("Playback failed or blocked:", error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [currentIndex, isPlaying, isSelected, answerAudios]);

  const togglePlayPause = () => {
    if (isSelected && isPlaying) {
      // Stopping playback
      togglePlayMode("");
      setIsPlaying(false);
    } else {
      // Starting playback
      togglePlayMode("reciter-audio");
      setIsPlaying(true);
    }
  };

  return (
    <div
      onClick={togglePlayPause}
      className={`size-32 border p-5 flex flex-col items-center justify-center hover:bg-primary hover:text-black transition-all duration-200 ease-in-out cursor-pointer ${
        isPlaying && isSelected ? "bg-primary text-black" : ""
      }`}
    >
      {isPlaying && isSelected ? (
        <Pause className="size-5" />
      ) : (
        <MicVocal className="size-5" />
      )}
      <p className="mt-2 text-xs text-center font-mono uppercase">
        {isPlaying && isSelected
          ? `Playing ${currentIndex + 1}/${answerAudios.length}`
          : "Listen to reciter"}
      </p>
    </div>
  );
}
