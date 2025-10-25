import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

export const DATABASE_NAME = "database.db";

export const expo_sqlite = openDatabaseSync(DATABASE_NAME);
export const db = drizzle(expo_sqlite, { schema });

// import * as SQLite from "expo-sqlite";
// import { drizzle } from "drizzle-orm/expo-sqlite";
// import { migrate } from "drizzle-orm/expo-sqlite/migrator";
// import * as schema from "./schema";
// import migration from "./drizzle/migrations";

// let db: ReturnType<typeof drizzle> | null = null;

// export async function initDB() {
//   const expoDb = await SQLite.openDatabaseAsync("s8cvote.db");
//   db = drizzle(expoDb, { schema });

//   await migrate(db, migration);
//   console.log("✅ SQLite migrations applied successfully.");

//   return db;
// }

// export function getDatabase() {
//   if (!db) throw new Error("Database not initialized");
//   return db;
// }
// // const expoDb = await SQLite.openDatabaseAsync("s8cvote.db");
// // export const db = drizzle(expoDb, { schema });

// // await migrate(db, migration);
