"use client";

import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import { dbSchema } from "./schema";

import { Range } from "./models/Range";
import { Cards } from "./models/Cards";
import { Visitation } from "./models/Visitation";

let db: Database | null = null;

export async function initDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  try {
    const adapter = new LokiJSAdapter({
      schema: dbSchema,
      useWebWorker: false, // Set to true for better performance
      useIncrementalIndexedDB: true,
      dbName: "my_new_db",
    });

    db = new Database({
      adapter,
      modelClasses: [Range, Cards, Visitation],
    });

    return db;
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return db;
}
