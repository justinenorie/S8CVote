import { db } from "../client";
import { voteTallies } from "../schema";
import { desc } from "drizzle-orm";

// Fetch from local DB
export async function getLocalResults() {
  return await db
    .select()
    .from(voteTallies)
    .orderBy(desc(voteTallies.created_at));
}
