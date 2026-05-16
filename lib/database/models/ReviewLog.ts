import { Model } from "@nozbe/watermelondb";

export class ReviewLog extends Model {
  static table = "review_logs";

  get cardId(): string {
    return this.asModel._getRaw("card_id") as string;
  }
  set cardId(value: string) {
    this.asModel._setRaw("card_id", value);
  }

  get grade(): number {
    return this.asModel._getRaw("grade") as number;
  }
  set grade(value: number) {
    this.asModel._setRaw("grade", value);
  }

  get elapsedDays(): number {
    return this.asModel._getRaw("elapsed_days") as number;
  }
  set elapsedDays(value: number) {
    this.asModel._setRaw("elapsed_days", value);
  }

  get scheduledDays(): number {
    return this.asModel._getRaw("scheduled_days") as number;
  }
  set scheduledDays(value: number) {
    this.asModel._setRaw("scheduled_days", value);
  }

  get reviewedAt(): Date | null {
    const rawValue = this.asModel._getRaw("reviewed_at");
    return typeof rawValue === "number" ? new Date(rawValue) : null;
  }
  set reviewedAt(date: Date | null) {
    const rawValue = date ? date.getTime() : null;
    this.asModel._setRaw("reviewed_at", rawValue);
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
