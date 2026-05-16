import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const dbSchema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: "range",
      columns: [
        { name: "start_surah_number", type: "number", isOptional: true },
        { name: "start_surah_name", type: "string", isOptional: true },
        { name: "start_ayah_number", type: "number", isOptional: true },
        { name: "end_surah_number", type: "number", isOptional: true },
        { name: "end_surah_name", type: "string", isOptional: true },
        { name: "end_ayah_number", type: "number", isOptional: true },
        { name: "start_page", type: "number", isOptional: true },
        { name: "end_page", type: "number", isOptional: true },
        { name: "reciter", type: "number" },
        { name: "created_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "verses",
      columns: [
        { name: "surah_number", type: "number" },
        { name: "surah_name", type: "string" },
        { name: "ayah_number", type: "number" },
        { name: "arabic_text", type: "string" },
        { name: "transliteration", type: "string" },
        { name: "translation", type: "string" },
        { name: "audio_url", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "cards",
      columns: [
        { name: "range_id", type: "string" },
        { name: "verse_id", type: "string" },
        { name: "arabic_text", type: "string" },
        { name: "audio_url", type: "string" },
        { name: "answer_verses", type: "string" },
        { name: "interval", type: "number" }, // days
        { name: "ease_factor", type: "number" }, // SM-2 ease factor
        { name: "repetitions", type: "number" }, // times reviewed
        { name: "last_review_date", type: "number", isOptional: true }, // timestamp
        { name: "next_review_date", type: "number" }, // timestamp
        { name: "is_mastered", type: "boolean" },
        { name: "created_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "sessions",
      columns: [
        { name: "start_time", type: "number" }, // timestamp
        { name: "end_time", type: "number", isOptional: true }, // timestamp
        { name: "verses_reviewed", type: "number" },
        { name: "average_accuracy", type: "number", isOptional: true }, // 0-100%
        { name: "created_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "progress",
      columns: [
        { name: "total_verses", type: "number" },
        { name: "memorized_count", type: "number" },
        { name: "mastered_cards", type: "number" },
        { name: "cards_due_today", type: "number" },
        { name: "average_accuracy", type: "number", isOptional: true },
        { name: "study_streak", type: "number" },
        { name: "last_study_date", type: "number", isOptional: true },
        { name: "total_study_minutes", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "visitation_logs",
      columns: [
        { name: "visit_date", type: "number" },
        { name: "created_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "review_logs",
      columns: [
        { name: "card_id", type: "string" },
        { name: "grade", type: "number" },
        { name: "elapsed_days", type: "number" },
        { name: "scheduled_days", type: "number" },
        { name: "reviewed_at", type: "number" },
        { name: "created_at", type: "number" },
      ],
    }),
  ],
});
