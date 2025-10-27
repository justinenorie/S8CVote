import { ipcMain } from "electron";
import { getDatabase } from "../db/sqliteDB";
import { partylist, candidates } from "../db/drizzle/schema";
import { eq, sql, inArray } from "drizzle-orm";

export function partylistApiHandlers(): void {
  // 🟢 Get unsynced partylist data
  ipcMain.handle("partylist:getUnsynced", async () => {
    const db = getDatabase();
    const unsynced = await db
      .select()
      .from(partylist)
      .where(sql`synced_at = 0 OR synced_at IS NULL`);
    return unsynced;
  });

  // 🟢 Mark partylist as synced
  ipcMain.handle("partylist:markSynced", async (_, ids) => {
    const db = getDatabase();
    await db
      .update(partylist)
      .set({ synced_at: 1 })
      .where(inArray(partylist.id, ids))
      .returning();

    return { success: true };
  });

  // 🟢 Bulk upsert from server (syncFromServer)
  ipcMain.handle("partylist:bulkUpsert", async (_, records) => {
    const db = getDatabase();

    for (const record of records) {
      const [local] = await db
        .select()
        .from(partylist)
        .where(eq(partylist.id, record.id));

      if (!local) {
        await db.insert(partylist).values({
          ...record,
          synced_at: 1,
        });
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
          .update(partylist)
          .set({
            ...record,
            synced_at: 1,
          })
          .where(eq(partylist.id, record.id));
      }
    }

    return { success: true };
  });

  // 🟢 Get all partylist (with member count)
  ipcMain.handle("partylist:get", async () => {
    const db = getDatabase();

    const results = await db
      .select({
        id: partylist.id,
        partylist: partylist.partylist,
        acronym: partylist.acronym,
        color: partylist.color,
        logo: partylist.logo,
        logo_path: partylist.logo_path,
        created_at: partylist.created_at,
        updated_at: partylist.updated_at,
        deleted_at: partylist.deleted_at,
        synced_at: partylist.synced_at,

        members_count: sql<number>`COUNT(${candidates.id})`.as("members_count"),
      })
      .from(partylist)
      .leftJoin(candidates, eq(partylist.id, candidates.partylist_id))
      .where(sql`${partylist.deleted_at} IS NULL`)
      .groupBy(partylist.id);

    return results.map((row) => ({
      ...row,
      members_count: row.members_count ?? 0,
    }));
  });

  // 🟢 Add new partylist
  ipcMain.handle("partylist:add", async (_, partylistData) => {
    const db = getDatabase();
    const data = {
      ...partylistData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      synced_at: 0,
    };
    await db.insert(partylist).values(data);
    return { success: true };
  });

  // 🟡 Update existing partylist
  ipcMain.handle("partylist:update", async (_, id, updates) => {
    const db = getDatabase();
    await db
      .update(partylist)
      .set({
        ...updates,
        updated_at: new Date().toISOString(),
        synced_at: 0,
      })
      .where(eq(partylist.id, id));
    return { success: true };
  });

  // 🔴 Soft delete
  ipcMain.handle("partylist:delete", async (_, id: string) => {
    const db = getDatabase();
    await db
      .update(partylist)
      .set({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        synced_at: 0,
      })
      .where(eq(partylist.id, id));

    return { success: true };
  });
}
