import { ipcMain } from "electron";
import { getDatabase } from "../db/sqliteDB";
import { elections, candidates } from "../db/drizzle/schema";
import { eq, sql, inArray } from "drizzle-orm";

export function electionsApiHandlers(): void {
  // SYNC HELPERS FOR ELECTIONS
  // Get unsynced elections (not yet synced to Supabase)
  ipcMain.handle("elections:getUnsynced", async () => {
    const db = getDatabase();
    const unsynced = await db
      .select()
      .from(elections)
      .where(sql`synced_at = 0 OR synced_at IS NULL`);

    return unsynced;
  });

  // Mark elections as synced
  ipcMain.handle("elections:markSynced", async (_, ids) => {
    const db = getDatabase();

    await db
      .update(elections)
      .set({ synced_at: 1 })
      .where(inArray(elections.id, ids))
      .returning();

    return { success: true };
  });

  // Upsert all the changes
  ipcMain.handle("elections:bulkUpsert", async (_, records) => {
    const db = getDatabase();

    for (const record of records) {
      const [local] = await db
        .select()
        .from(elections)
        .where(eq(elections.id, record.id));

      // 1️⃣ If deleted remotely, mark as soft-deleted locally (not hard delete)
      if (record.deleted_at) {
        await db
          .update(elections)
          .set({
            deleted_at: record.deleted_at,
            synced_at: 1,
          })
          .where(eq(elections.id, record.id));

        // 2️⃣ Soft-delete linked candidates too
        await db
          .update(candidates)
          .set({ deleted_at: record.deleted_at })
          .where(eq(candidates.election_id, record.id));

        continue;
      }

      // 3️⃣ Insert if new
      if (!local) {
        await db.insert(elections).values({ ...record, synced_at: 1 });
        continue;
      }

      // 4️⃣ Update if server newer
      const localUpdated = local.updated_at
        ? new Date(local.updated_at).getTime()
        : 0;
      const serverUpdated = record.updated_at
        ? new Date(record.updated_at).getTime()
        : 0;

      if (serverUpdated > localUpdated) {
        await db
          .update(elections)
          .set({ ...record, synced_at: 1 })
          .where(eq(elections.id, record.id));
      }
    }

    return { success: true };
  });

  // ELECTIONS CRUD
  ipcMain.handle("elections:get", async () => {
    const db = getDatabase();
    const results = await db
      .select({
        id: elections.id,
        election: elections.election,
        status: elections.status,
        end_time: elections.end_time,
        end_date: elections.end_date,
        description: elections.description,
        candidate_count:
          sql<number>`COUNT(CASE WHEN ${candidates.deleted_at} IS NULL THEN ${candidates.id} ELSE NULL END)`.as(
            "candidate_count"
          ),
      })
      .from(elections)
      .leftJoin(candidates, eq(candidates.election_id, elections.id))
      .where(sql`${elections.deleted_at} IS NULL`)
      .groupBy(elections.id);

    return results;
  });

  ipcMain.handle("elections:add", async (_, electionData) => {
    const db = getDatabase();
    const data = {
      ...electionData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      synced_at: 0,
    };
    await db.insert(elections).values(data);

    return { success: true };
  });

  ipcMain.handle("elections:update", async (_, id, updates) => {
    const db = getDatabase();
    await db
      .update(elections)
      .set({
        ...updates,
        updated_at: new Date().toISOString(),
        synced_at: 0,
      })
      .where(eq(elections.id, id));
  });

  ipcMain.handle("elections:delete", async (_, id: string) => {
    const db = getDatabase();
    await db
      .update(elections)
      .set({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        synced_at: 0,
      })
      .where(eq(elections.id, id));

    return { success: true };
  });
}

// CLEAN IS HERE
ipcMain.handle("cleanup:removedRecords", async () => {
  const db = getDatabase();
  console.log("clean up done");

  // Delete elections that are soft-deleted
  await db.delete(elections).where(sql`${elections.deleted_at} IS NOT NULL`);

  // Delete candidates whose election is soft-deleted
  await db.delete(candidates).where(sql`${candidates.deleted_at} IS NOT NULL`);

  return { success: true };
});
