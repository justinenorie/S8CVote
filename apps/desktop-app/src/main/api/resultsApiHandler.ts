import { ipcMain } from "electron";
import { getDatabase } from "../db/sqliteDB";
import { voteTallies } from "../db/drizzle/schema";
import { eq, sql, inArray } from "drizzle-orm";

export function resultsApiHandlers(): void {
  // GET ALL RESULTS
  ipcMain.handle("voteTallies:getAll", async () => {
    const db = getDatabase();
    const rows = await db
      .select()
      .from(voteTallies)
      .where(sql`${voteTallies.deleted_at} IS NULL`)
      .orderBy(voteTallies.created_at);
    return rows;
  });

  // IPC - Insert Many Vote Tallies
  ipcMain.handle("voteTallies:insertMany", async (_, rows) => {
    const db = getDatabase();
    await db.insert(voteTallies).values(rows);
    return { success: true };
  });

  // DELETE TALLIES FOR UPSERTING PURPOSES
  ipcMain.handle("voteTallies:deleteByElectionId", async (_, electionId) => {
    const db = getDatabase();
    await db.delete(voteTallies).where(eq(voteTallies.election_id, electionId));
    return { success: true };
  });

  // GET UNSYNCED SNAPSHOTS
  ipcMain.handle("voteTallies:getUnsynced", async () => {
    const db = getDatabase();
    return await db
      .select()
      .from(voteTallies)
      .where(
        sql`${voteTallies.synced_at} = 0 OR ${voteTallies.synced_at} IS NULL`
      );
  });

  // MARK SYNCED
  ipcMain.handle("voteTallies:markSynced", async (_, ids) => {
    const db = getDatabase();
    await db
      .update(voteTallies)
      .set({ synced_at: 1 })
      .where(inArray(voteTallies.id, ids));
    return { success: true };
  });

  // BULK UPSERT FROM SERVER
  ipcMain.handle("voteTallies:bulkUpsert", async (_, records) => {
    const db = getDatabase();

    for (const record of records) {
      const [local] = await db
        .select()
        .from(voteTallies)
        .where(eq(voteTallies.id, record.id));

      if (!local) {
        await db.insert(voteTallies).values({ ...record, synced_at: 1 });
        continue;
      }

      const localUpdated = local.updated_at
        ? new Date(local.updated_at).getTime()
        : 0;
      const serverUpdated = record.updated_at
        ? new Date(record.updated_at).getTime()
        : 0;

      if (serverUpdated > localUpdated) {
        await db
          .update(voteTallies)
          .set({ ...record, synced_at: 1 })
          .where(eq(voteTallies.id, record.id));
      }
    }

    return { success: true };
  });
}
