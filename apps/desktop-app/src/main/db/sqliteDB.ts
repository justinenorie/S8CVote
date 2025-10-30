import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { app } from "electron";
import path from "path";
import * as schema from "./drizzle/schema";

type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

let db: DrizzleDB | null = null;

export function initDatabase(): DrizzleDB {
  const userDataPath = app.getPath("userData");
  const dbPath = path.join(userDataPath, "s8cvote.db");

  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");

  db = drizzle(sqlite, { schema });

  try {
    const migrationsPath = app.isPackaged
      ? path.join(process.resourcesPath, "migrations") // Production
      : path.join(__dirname, "../../drizzle/migrations"); // Development

    migrate(db, { migrationsFolder: migrationsPath });
    console.log("Migrations applied successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  }

  return db;
}

export function getDatabase(): DrizzleDB {
  if (!db) throw new Error("Database not initialized");
  return db;
}
