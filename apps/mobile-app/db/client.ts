import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import * as schema from "./schema";
import migration from "./drizzle/migrations";

let dbInstance: ReturnType<typeof drizzle> | null = null;

export async function initDB() {
  if (dbInstance) return dbInstance;

  const expoDb = await SQLite.openDatabaseAsync("s8cvote.db");
  const db = drizzle(expoDb, { schema });

  await migrate(db, migration);
  console.log("✅ SQLite migrations applied successfully.");

  dbInstance = db;
  return db;
}

// const expoDb = await SQLite.openDatabaseAsync("s8cvote.db");
// export const db = drizzle(expoDb, { schema });

// await migrate(db, migration);
