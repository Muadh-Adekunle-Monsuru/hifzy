import { Model } from '@nozbe/watermelondb';

export class Range extends Model {
  static table = 'range';

  get startSurahNumber(): number {
    return this.asModel._getRaw('start_surah_number') as number;
  }
  set startSurahNumber(value: number) {
    this.asModel._setRaw('start_surah_number', value);
  }

  get startSurahName(): string {
    return this.asModel._getRaw('start_surah_name') as string;
  }
  set startSurahName(value: string) {
    this.asModel._setRaw('start_surah_name', value);
  }

  get startAyahNumber(): number {
    return this.asModel._getRaw('start_ayah_number') as number;
  }
  set startAyahNumber(value: number) {
    this.asModel._setRaw('start_ayah_number', value);
  }

  get endSurahNumber(): number {
    return this.asModel._getRaw('end_surah_number') as number;
  }
  set endSurahNumber(value: number) {
    this.asModel._setRaw('end_surah_number', value);
  }

  get endSurahName(): string {
    return this.asModel._getRaw('end_surah_name') as string;
  }
  set endSurahName(value: string) {
    this.asModel._setRaw('end_surah_name', value);
  }

  get endAyahNumber(): number {
    return this.asModel._getRaw('end_ayah_number') as number;
  }
  set endAyahNumber(value: number) {
    this.asModel._setRaw('end_ayah_number', value);
  }

  get createdAt(): Date | null {
    const rawValue = this.asModel._getRaw('created_at');
    return typeof rawValue === 'number' ? new Date(rawValue) : null;
  }
  set createdAt(date: Date | null) {
    const rawValue = date ? date.getTime() : null;
    this.asModel._setRaw('created_at', rawValue);
  }
}
