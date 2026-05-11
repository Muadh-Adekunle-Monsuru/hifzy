/**
 * Web Audio API recorder utility
 * Handles recording user's recitation using the browser's microphone
 */

export interface AudioRecorderConfig {
  mimeType?: string;
  audioBitsPerSecond?: number;
}

export interface RecordingData {
  blob: Blob;
  duration: number;
  url: string;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private startTime: number = 0;
  private isRecording = false;
  private stream: MediaStream | null = null;

  /**
   * Start recording
   */
  async start(config: AudioRecorderConfig = {}): Promise<void> {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Determine MIME type
      const mimeType = config.mimeType || this.getCompatibleMimeType();

      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        audioBitsPerSecond: config.audioBitsPerSecond || 128000,
      });

      this.audioChunks = [];
      this.startTime = Date.now();
      this.isRecording = true;

      // Collect audio chunks
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
      console.log('[v0] Recording started');
    } catch (error) {
      console.error('[v0] Microphone access denied:', error);
      throw new Error(
        'Microphone access is required to record your recitation'
      );
    }
  }

  /**
   * Stop recording and return audio data
   */
  async stop(): Promise<RecordingData> {
    if (!this.mediaRecorder || !this.isRecording) {
      throw new Error('No active recording');
    }

    return new Promise((resolve, reject) => {
      this.mediaRecorder!.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, {
          type: this.mediaRecorder!.mimeType,
        });

        // Calculate duration
        const duration = (Date.now() - this.startTime) / 1000;

        // Create object URL for playback
        const url = URL.createObjectURL(audioBlob);

        // Stop all tracks
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
        }

        this.isRecording = false;
        console.log('[v0] Recording stopped. Duration:', duration.toFixed(2), 'seconds');

        resolve({
          blob: audioBlob,
          duration,
          url,
        });
      };

      this.mediaRecorder!.onerror = (event) => {
        reject(new Error(`Recording error: ${event.error}`));
      };

      this.mediaRecorder!.stop();
    });
  }

  /**
   * Cancel recording
   */
  cancel(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;

      // Stop all tracks
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
      }

      this.audioChunks = [];
      console.log('[v0] Recording cancelled');
    }
  }

  /**
   * Get recording duration
   */
  getDuration(): number {
    if (!this.isRecording) {
      return 0;
    }

    return (Date.now() - this.startTime) / 1000;
  }

  /**
   * Check if currently recording
   */
  getIsRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Get compatible MIME type
   */
  private getCompatibleMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    // Fallback to default
    return 'audio/webm';
  }

  /**
   * Convert blob to data URL
   */
  static async blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Get audio duration from blob
   */
  static async getAudioDuration(blob: Blob): Promise<number> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio();
      audio.src = url;

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(audio.duration);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get audio duration'));
      };
    });
  }
}
