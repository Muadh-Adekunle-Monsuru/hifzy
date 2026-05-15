"use client";
import { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Mic, Square } from "lucide-react";
import { AudioRecorder } from "@/lib/audio/recorder";

interface RecordingInteractionProps {
  setShowAnswer: (show: boolean) => void;
  variants: Variants;
  setUserAudio: (url: string) => void;
}

export function RecordingInteraction({
  setShowAnswer,
  variants,
  setUserAudio,
}: RecordingInteractionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    recorderRef.current = new AudioRecorder();
    return () => {
      if (recorderRef.current?.getIsRecording()) {
        recorderRef.current.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      await recorderRef.current?.start();
      setIsRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      const data = await recorderRef.current?.stop();
      if (data) {
        setUserAudio(data.url);
      }
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      key="recording-section"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-6"
    >
      <div className="md:col-span-12 bento-cell p-8 bg-background flex flex-col items-center justify-center gap-6">
        {/* Recording Interaction Cell */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            {isRecording && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0.3 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 bg-red-500 rounded-full"
              />
            )}
            <motion.button
              onClick={toggleRecording}
              animate={isRecording ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={isRecording ? { duration: 1, repeat: Infinity } : {}}
              className={`w-20 h-20 ${
                isRecording ? "bg-red-500" : "bg-primary"
              } text-background rounded-full flex items-center justify-center relative z-10 shadow-lg transition-colors duration-300`}
            >
              {isRecording ? <Square className="fill-current" /> : <Mic />}
            </motion.button>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="font-label-caps text-primary tracking-widest mt-2 uppercase">
              {isRecording ? "Recording..." : "Tap to record response"}
            </p>
            {isRecording && (
              <p className="text-red-500 font-mono text-xl font-bold">
                {formatDuration(duration)}
              </p>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            Recite the next three verses from memory
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          if (isRecording) stopRecording();
          setShowAnswer(true);
        }}
        className="md:col-span-12 w-full py-4 border-2 border-primary bg-primary text-background font-bold uppercase tracking-widest hover:bg-transparent hover:text-primary transition-all active:scale-[0.98]"
      >
        Reveal Answer
      </button>
    </motion.div>
  );
}
