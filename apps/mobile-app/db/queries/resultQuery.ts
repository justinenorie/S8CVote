import { desc } from "drizzle-orm";
import { db } from "../client";
import { voteTallies } from "../schema";

// Fetch from local DB
export async function getLocalResults() {
  return await db
    .select()
    .from(voteTallies)
    .orderBy(desc(voteTallies.created_at));
}
