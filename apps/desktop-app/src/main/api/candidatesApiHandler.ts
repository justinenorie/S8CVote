import { ipcMain } from "electron";
import { getDatabase } from "../db/sqliteDB";
import { candidates } from "../db/drizzle/schema";
import { eq, sql, inArray } from "drizzle-orm";

export function candidatesApiHandlers(): void {
  // SYNC HELPERS FOR CANDIDATES
  // get the unsynced Candidates
  ipcMain.handle("candidates:getUnsynced", async () => {
    const db = getDatabase();
    const unsynced = await db
      .select()
      .from(candidates)
      .where(sql`synced_at = 0 OR synced_at IS NULL`);
    return unsynced;
  });

  // Mark Candidates as synced
  ipcMain.handle("candidates:markSynced", async (_, ids) => {
    const db = getDatabase();

    await db
      .update(candidates)
      .set({ synced_at: 1 })
      .where(inArray(candidates.id, ids))
      .returning();

    console.log(ids);
    return { success: true };
  });

  // Upsert all the changes
  ipcMain.handle("candidates:bulkUpsert", async (_, records) => {
    const db = getDatabase();

    for (const record of records) {
      const { election, ...cleanRecord } = record;

      console.log(record);

      // Ensure election_id exists (foreign key)
      if (!cleanRecord.election_id && election?.id) {
        cleanRecord.election_id = election.id;
      }

      const [local] = await db
        .select()
        .from(candidates)
        .where(eq(candidates.id, cleanRecord.id));

      if (!local) {
        await db.insert(candidates).values({
          ...cleanRecord,
          synced_at: 1,
        });
        continue;
      }

      const localUpdated = local.updated_at
        ? new Date(local.updated_at).getTime()
        : 0;
      const serverUpdated = cleanRecord.updated_at
        ? new Date(cleanRecord.updated_at).getTime()
        : 0;

      if (serverUpdated > localUpdated) {
        await db
          .update(candidates)
          .set({
            ...cleanRecord,
            synced_at: 1,
          })
          .where(eq(candidates.id, cleanRecord.id));
      }
    }

    return { success: true };
  });

  // GET
  ipcMain.handle("candidates:get", async () => {
    const db = getDatabase();
    return db
      .select()
      .from(candidates)
      .where(sql`deleted_at IS NULL`);
  });

  // POST
  ipcMain.handle("candidates:add", async (_, electionData) => {
    console.log("Incoming electionData:", electionData);

    const db = getDatabase();
    const data = {
      ...electionData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      synced_at: 0,
    };
    await db.insert(candidates).values(data);

    return { success: true };
  });

  // UPDATE
  ipcMain.handle("candidates:update", async (_, id, updates) => {
    const db = getDatabase();
    await db
      .update(candidates)
      .set({
        ...updates,
        updated_at: new Date().toISOString(),
        synced_at: 0,
      })
      .where(eq(candidates.id, id));
  });

  // DELETE
  ipcMain.handle("candidates:delete", async (_, id: string) => {
    const db = getDatabase();
    await db
      .update(candidates)
      .set({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        synced_at: 0,
      })
      .where(eq(candidates.id, id));

    return { success: true };
  });
}
