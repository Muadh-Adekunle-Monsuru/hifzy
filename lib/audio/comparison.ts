/**
 * Audio comparison and analysis utilities
 * Provides basic audio metrics for accuracy scoring
 */

export interface AudioAnalysis {
  duration: number;
  frequency?: number; // Estimated dominant frequency
  intensity?: number; // RMS (root mean square) level
}

export interface ComparisonResult {
  durationMatch: number; // 0-100%
  frequencyMatch: number; // 0-100% (if available)
  overallAccuracy: number; // 0-100%
  feedback: string;
}

export class AudioComparison {
  /**
   * Analyze audio blob
   */
  static async analyzeAudio(blob: Blob): Promise<AudioAnalysis> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Get duration
      const duration = audioBuffer.duration;

      // Calculate RMS (root mean square) for intensity
      const rawData = audioBuffer.getChannelData(0);
      const intensity = this.calculateRMS(rawData);

      // Estimate dominant frequency using autocorrelation (simplified)
      const frequency = this.estimateFrequency(rawData, audioBuffer.sampleRate);

      return {
        duration,
        intensity,
        frequency,
      };
    } catch (error) {
      console.error('[v0] Audio analysis failed:', error);
      // Return default values if analysis fails
      return {
        duration: 0,
        intensity: 0,
        frequency: undefined,
      };
    }
  }

  /**
   * Compare two audio recordings
   */
  static compareAudio(
    referenceAnalysis: AudioAnalysis,
    userAnalysis: AudioAnalysis
  ): ComparisonResult {
    // Duration comparison (±20% tolerance)
    const durationDiff = Math.abs(
      userAnalysis.duration - referenceAnalysis.duration
    );
    const durationTolerance = referenceAnalysis.duration * 0.2;
    const durationMatch = Math.max(
      0,
      100 - (durationDiff / durationTolerance) * 100
    );

    // Frequency comparison (if available)
    let frequencyMatch = 75; // Default good match
    if (
      referenceAnalysis.frequency &&
      userAnalysis.frequency &&
      referenceAnalysis.frequency > 0
    ) {
      const frequencyRatio =
        userAnalysis.frequency / referenceAnalysis.frequency;
      const frequencyDiff = Math.abs(frequencyRatio - 1);
      frequencyMatch = Math.max(0, 100 - frequencyDiff * 100);
    }

    // Overall accuracy (weighted average)
    const overallAccuracy = (durationMatch * 0.6 + frequencyMatch * 0.4);

    // Generate feedback
    const feedback = this.generateFeedback(
      durationMatch,
      frequencyMatch,
      userAnalysis,
      referenceAnalysis
    );

    return {
      durationMatch: Math.round(durationMatch),
      frequencyMatch: Math.round(frequencyMatch),
      overallAccuracy: Math.round(overallAccuracy),
      feedback,
    };
  }

  /**
   * Calculate RMS (root mean square) of audio data
   */
  private static calculateRMS(data: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i] * data[i];
    }
    return Math.sqrt(sum / data.length);
  }

  /**
   * Estimate fundamental frequency using autocorrelation
   */
  private static estimateFrequency(
    data: Float32Array,
    sampleRate: number
  ): number {
    // Use a simplified approach with FFT
    // For production, consider using a proper pitch detection library

    // Check if data has sufficient amplitude
    const rms = this.calculateRMS(data);
    if (rms < 0.01) {
      return 0; // Silent or very quiet
    }

    // Use autocorrelation on a subset of the audio
    const bufferSize = Math.min(4096, data.length);
    const correlations = this.autocorrelate(data.slice(0, bufferSize), sampleRate);

    // Find the peak in correlations
    let maxValue = -Infinity;
    let maxIndex = -1;

    // Start search from minimum frequency (50 Hz)
    const minIndex = Math.floor(sampleRate / 400);

    for (let i = minIndex; i < correlations.length; i++) {
      if (correlations[i] > maxValue) {
        maxValue = correlations[i];
        maxIndex = i;
      }
    }

    // Convert index to frequency
    if (maxIndex > 0 && maxValue > 0.1) {
      return sampleRate / maxIndex;
    }

    return 0;
  }

  /**
   * Simple autocorrelation function
   */
  private static autocorrelate(data: Float32Array, sampleRate: number): number[] {
    const correlations: number[] = [];

    for (let lag = 0; lag < data.length / 2; lag++) {
      let sum = 0;
      let count = 0;

      for (let i = 0; i < data.length - lag; i++) {
        sum += data[i] * data[i + lag];
        count++;
      }

      correlations[lag] = sum / count;
    }

    // Normalize
    const maxCorr = Math.max(...correlations);
    return correlations.map((c) => (maxCorr > 0 ? c / maxCorr : 0));
  }

  /**
   * Generate feedback message based on comparison
   */
  private static generateFeedback(
    durationMatch: number,
    frequencyMatch: number,
    userAnalysis: AudioAnalysis,
    referenceAnalysis: AudioAnalysis
  ): string {
    const accuracy = (durationMatch * 0.6 + frequencyMatch * 0.4);

    if (accuracy >= 90) {
      return 'Excellent recitation! Very close to the reference.';
    } else if (accuracy >= 75) {
      return 'Good effort! Minor adjustments needed.';
    } else if (accuracy >= 60) {
      let feedback = 'Needs improvement. ';

      if (durationMatch < 60) {
        const durationDiff =
          Math.abs(userAnalysis.duration - referenceAnalysis.duration) > 0
            ? 'longer'
            : 'shorter';
        feedback += `Try to recite a bit ${durationDiff}. `;
      }

      if (frequencyMatch < 60 && userAnalysis.frequency) {
        feedback += 'Work on your pronunciation tone.';
      }

      return feedback;
    } else {
      return 'Keep practicing! Compare closely with the reference audio and adjust your pace and tone.';
    }
  }

  /**
   * Get accuracy label
   */
  static getAccuracyLabel(accuracy: number): string {
    if (accuracy >= 90) return 'Excellent';
    if (accuracy >= 75) return 'Good';
    if (accuracy >= 60) return 'Fair';
    if (accuracy >= 45) return 'Poor';
    return 'Very Poor';
  }

  /**
   * Convert accuracy score to quality grade for SRS
   */
  static accuracyToQualityGrade(accuracy: number): number {
    // Map accuracy (0-100) to quality grade (0-5)
    // 90-100% = 5 (perfect)
    // 75-89% = 4 (easy)
    // 60-74% = 3 (good)
    // 45-59% = 2 (hard)
    // 30-44% = 1 (difficult)
    // 0-29% = 0 (blackout)

    if (accuracy >= 90) return 5;
    if (accuracy >= 75) return 4;
    if (accuracy >= 60) return 3;
    if (accuracy >= 45) return 2;
    if (accuracy >= 30) return 1;
    return 0;
  }
}
