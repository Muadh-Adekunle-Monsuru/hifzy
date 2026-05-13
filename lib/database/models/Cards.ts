import { Model } from "@nozbe/watermelondb";

export class Cards extends Model {
  static table = "cards";

  get rangeId(): string {
    return this.asModel._getRaw("range_id") as string;
  }
  set rangeId(value: string) {
    this.asModel._setRaw("range_id", value);
  }

  get verseId(): string {
    return this.asModel._getRaw("verse_id") as string;
  }
  set verseId(value: string) {
    this.asModel._setRaw("verse_id", value);
  }

  get arabicText(): string {
    return this.asModel._getRaw("arabic_text") as string;
  }
  set arabicText(value: string) {
    this.asModel._setRaw("arabic_text", value);
  }

  get audioUrl(): string {
    return this.asModel._getRaw("audio_url") as string;
  }
  set audioUrl(value: string) {
    this.asModel._setRaw("audio_url", value);
  }

  get answerVerses(): string {
    return this.asModel._getRaw("answer_verses") as string;
  }
  set answerVerses(value: string) {
    this.asModel._setRaw("answer_verses", value);
  }

  get interval(): number {
    return this.asModel._getRaw("interval") as number;
  }
  set interval(value: number) {
    this.asModel._setRaw("interval", value);
  }

  get easeFactor(): number {
    return this.asModel._getRaw("ease_factor") as number;
  }
  set easeFactor(value: number) {
    this.asModel._setRaw("ease_factor", value);
  }

  get repetitions(): number {
    return this.asModel._getRaw("repetitions") as number;
  }
  set repetitions(value: number) {
    this.asModel._setRaw("repetitions", value);
  }

  get lastReviewDate(): Date | null {
    const rawValue = this.asModel._getRaw("last_review_date");
    return typeof rawValue === "number" ? new Date(rawValue) : null;
  }
  set lastReviewDate(date: Date | null) {
    const rawValue = date ? date.getTime() : null;
    this.asModel._setRaw("last_review_date", rawValue);
  }

  get nextReviewDate(): Date | null {
    const rawValue = this.asModel._getRaw("next_review_date");
    return typeof rawValue === "number" ? new Date(rawValue) : null;
  }
  set nextReviewDate(date: Date | null) {
    const rawValue = date ? date.getTime() : null;
    this.asModel._setRaw("next_review_date", rawValue);
  }

  get isMastered(): boolean {
    return this.asModel._getRaw("is_mastered") as boolean;
  }
  set isMastered(value: boolean) {
    this.asModel._setRaw("is_mastered", value);
  }

  get createdAt(): Date | null {
    const rawValue = this.asModel._getRaw("created_at");
    return typeof rawValue === "number" ? new Date(rawValue) : null;
  }
  set createdAt(date: Date | null) {
    const rawValue = date ? date.getTime() : null;
    this.asModel._setRaw("created_at", rawValue);
  }
}
