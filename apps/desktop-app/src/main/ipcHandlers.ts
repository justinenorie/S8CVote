import { ipcMain } from "electron";
import { getDatabase } from "./db/sqliteDB";
import { elections, adminAuth } from "./db/drizzle/schema";
import { eq, sql, inArray } from "drizzle-orm";

// TODO: Add more ipc Handler here:
/* 
  Missing Handler
  - dashboard (fetching data)
  - candidates
  - list of students
  - settings
*/

export function setupIpcHandlers(): void {
  // ELECTIONS
  // SYNC HELPERS FOR ELECTIONS
  // Get unsynced elections (not yet synced to Supabase)
  ipcMain.handle("elections:getUnsynced", async () => {
    const db = getDatabase();
    const unsynced = await db
      .select()
      .from(elections)
      .where(sql`synced_at = 0 OR synced_at IS NULL`);

    const unsyncedString = unsynced
      .map((election) => `${election.id} - ${election.election}`)
      .join("\n ");
    console.log(`Unsynced data: ${unsyncedString}`);

    return unsynced;
    // TODO: Double check how does the synced_at work here
  });

  // Mark elections as synced
  ipcMain.handle("elections:markSynced", async (_, ids) => {
    const db = getDatabase();

    await db
      .update(elections)
      .set({ synced_at: 1 })
      .where(inArray(elections.id, ids))
      .returning();

    console.log(ids);
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

      // ✅ If record doesn’t exist locally, insert it
      if (!local) {
        await db.insert(elections).values({
          ...record,
          synced_at: 1, // because this came from Supabase
        });
        continue;
      }

      // ✅ Safely compare updated_at timestamps
      const localUpdated = local.updated_at
        ? new Date(local.updated_at).getTime()
        : 0;
      const serverUpdated = record.updated_at
        ? new Date(record.updated_at).getTime()
        : 0;

      // 🧩 Only update local if Supabase has newer record
      if (serverUpdated > localUpdated) {
        await db
          .update(elections)
          .set({
            ...record,
            synced_at: 1, // mark synced since it came from Supabase
          })
          .where(eq(elections.id, record.id));

        console.log(
          `✅ Updated local election (${record.id}) — Supabase is newer`
        );
      } else {
        console.log(
          `⏭️ Skipped election (${record.id}) — Local is newer or same timestamp`
        );
      }
    }

    return { success: true };
  });

  // ELECTIONS CRUD
  ipcMain.handle("elections:get", async () => {
    const db = getDatabase();
    return db
      .select()
      .from(elections)
      .where(sql`deleted_at IS NULL`);
  });

  ipcMain.handle("elections:add", async (_, electionData) => {
    console.log("Incoming electionData:", electionData);

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

  // AUTH (simple offline cache)
  ipcMain.handle(
    "auth:admin",
    async (_, { id, email, role, access_token, refresh_token }) => {
      const db = getDatabase();
      await db
        .insert(adminAuth)
        .values({
          id,
          email,
          role,
          access_token: access_token,
          refresh_token: refresh_token,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .onConflictDoUpdate({
          target: adminAuth.id,
          set: {
            email,
            role,
            access_token: access_token,
            refresh_token: refresh_token,
            updated_at: new Date().toISOString(),
          },
        });

      return { success: true };
    }
  );

  ipcMain.handle("auth:getUser", async () => {
    const db = getDatabase();
    const [user] = await db.select().from(adminAuth).limit(1);
    return user ?? null;
  });

  ipcMain.handle("auth:clearSession", async () => {
    const db = getDatabase();
    db.delete(adminAuth).run();
    return true;
  });
}
