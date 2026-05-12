import { quranVerses } from "@/lib/data/quranic-verses";
import { CardState } from "@/lib/srs/sm2-algorithm";

export interface SessionCard {
  id: string;
  verseId: string;
  state: CardState;
  verse: (typeof quranVerses)[0];
}

export interface SessionStats {
  totalReviewed: number;
  avgQuality: number | string;
  graduated: number;
  sessionDuration: number;
}
