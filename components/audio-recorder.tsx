"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AudioRecorder } from "@/lib/audio/recorder";
import { AudioComparison, type ComparisonResult } from "@/lib/audio/comparison";

interface AudioRecorderProps {
  onRecordingComplete?: (data: {
    blob: Blob;
    duration: number;
    url: string;
    accuracy?: number;
  }) => void;
  referenceAudioUrl?: string;
  showComparison?: boolean;
}

export function AudioRecorderComponent({
  onRecordingComplete,
  referenceAudioUrl,
  showComparison = true,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<{
    blob: Blob;
    duration: number;
    url: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<AudioRecorder | null>(null);
  const durationIntervalRef = useRef<number | null>(null);
  const audioPlaybackRef = useRef<HTMLAudioElement | null>(null);

  // Duration timer
  useEffect(() => {
    if (isRecording) {
      durationIntervalRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 0.1);
      }, 100);
    } else {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setRecordedAudio(null);
      setComparisonResult(null);

      if (!recorderRef.current) {
        recorderRef.current = new AudioRecorder();
      }

      await recorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start recording",
      );
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recorderRef.current) return;

    try {
      setError(null);
      const data = await recorderRef.current.stop();
      setIsRecording(false);
      setRecordedAudio(data);

      // Perform comparison if reference audio is available
      if (showComparison && referenceAudioUrl) {
        try {
          const referenceBlob = await fetch(referenceAudioUrl).then((r) =>
            r.blob(),
          );
          const userAnalysis = await AudioComparison.analyzeAudio(data.blob);
          const referenceAnalysis =
            await AudioComparison.analyzeAudio(referenceBlob);

          const result = AudioComparison.compareAudio(
            referenceAnalysis,
            userAnalysis,
          );
          setComparisonResult(result);

          // Call callback with accuracy
          onRecordingComplete?.({
            ...data,
            accuracy: result.overallAccuracy,
          });
        } catch (compareErr) {
          console.error("Comparison failed:", compareErr);
          onRecordingComplete?.(data);
        }
      } else {
        onRecordingComplete?.(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stop recording");
      setIsRecording(true);
    }
  }, [showComparison, referenceAudioUrl, onRecordingComplete]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins}:${parseFloat(secs) < 10 ? "0" : ""}${secs}`;
  };

  const playRecording = useCallback(async () => {
    if (!recordedAudio) return;

    try {
      if (!audioPlaybackRef.current) {
        audioPlaybackRef.current = new Audio();
      }

      const audio = audioPlaybackRef.current;
      audio.src = recordedAudio.url;

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);

        audio.onended = () => {
          setIsPlaying(false);
        };
      }
    } catch (err) {
      setError("Failed to play recording");
    }
  }, [recordedAudio, isPlaying]);

  const clearRecording = useCallback(() => {
    if (audioPlaybackRef.current) {
      audioPlaybackRef.current.pause();
    }
    setRecordedAudio(null);
    setComparisonResult(null);
    setIsPlaying(false);
  }, []);

  return (
    <Card className="p-6 space-y-4">
      {/* Recording Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Record Your Recitation
          </h3>
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-600">
                Recording: {formatDuration(recordingDuration)}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              disabled={isRecording}
              className="bg-red-600 hover:bg-red-700"
            >
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              disabled={!isRecording}
              className="bg-red-600 hover:bg-red-700"
            >
              Stop Recording
            </Button>
          )}

          {recordedAudio && (
            <>
              <Button
                onClick={playRecording}
                variant="outline"
                disabled={isRecording}
              >
                {isPlaying ? "Pause" : "Play"} Recording
              </Button>
              <Button
                onClick={clearRecording}
                variant="outline"
                disabled={isRecording}
              >
                Clear
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Recording Info */}
      {recordedAudio && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 space-y-2">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Duration:</span>{" "}
            {formatDuration(recordedAudio.duration)}
          </p>
          {recordedAudio.blob.size > 0 && (
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Size:</span>{" "}
              {(recordedAudio.blob.size / 1024).toFixed(1)} KB
            </p>
          )}
        </div>
      )}

      {/* Comparison Results */}
      {comparisonResult && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">Accuracy Results</h4>
            <div className="text-3xl font-bold text-indigo-600">
              {comparisonResult.overallAccuracy}%
            </div>
          </div>

          {/* Accuracy Label */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              {AudioComparison.getAccuracyLabel(
                comparisonResult.overallAccuracy,
              )}
            </span>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded p-3">
              <p className="text-xs text-gray-600 font-semibold">
                Duration Match
              </p>
              <p className="text-lg font-bold text-blue-600 mt-1">
                {comparisonResult.durationMatch}%
              </p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-xs text-gray-600 font-semibold">
                Frequency Match
              </p>
              <p className="text-lg font-bold text-blue-600 mt-1">
                {comparisonResult.frequencyMatch}%
              </p>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white rounded p-3">
            <p className="text-sm text-gray-700 italic">
              {comparisonResult.feedback}
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isRecording && !recordedAudio && (
        <div className="bg-gray-50 border border-gray-200 rounded p-4 text-sm text-gray-600">
          <p className="mb-2 font-semibold text-gray-700">Recording Tips:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Find a quiet environment for better audio quality</li>
            <li>Speak clearly and maintain a steady pace</li>
            <li>Match the pronunciation of the reference audio</li>
            <li>Keep your recording device at arm&apos;s length</li>
          </ul>
        </div>
      )}
    </Card>
  );
}
