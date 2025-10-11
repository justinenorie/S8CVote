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

let electionSyncQueue: {
  electionId: string;
  operation: "create" | "update" | "delete";
}[] = [];

export function setupIpcHandlers(): void {
  // ELECTIONS
  // SYNC HELPERS FOR ELECTIONS
  ipcMain.handle("elections:get-election-sync-queue", async () => {
    return electionSyncQueue;
  });

  ipcMain.handle(
    "elections:clear-election-sync-queue",
    async (_, ids: string[]) => {
      electionSyncQueue = electionSyncQueue.filter(
        (q) => !ids.includes(q.electionId)
      );
      return { success: true };
    }
  );

  // Get unsynced elections (not yet synced to Supabase)
  ipcMain.handle("elections:getUnsynced", async () => {
    const db = getDatabase();
    const unsynced = await db
      .select()
      .from(elections)
      .where(sql`synced_at IS NULL OR updated_at > synced_at`);
    return unsynced;
  });

  // Mark elections as synced
  ipcMain.handle("elections:markSynced", async (_, ids: string[]) => {
    const db = getDatabase();
    const now = new Date().toISOString();
    await db
      .update(elections)
      .set({ syncedAt: now })
      .where(inArray(elections.id, ids));
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.insert(elections).values(data);

    electionSyncQueue.push({
      electionId: electionData.id,
      operation: "create",
    });
    return { success: true };
  });

  ipcMain.handle("elections:update", async (_, id, updates) => {
    const db = getDatabase();
    await db
      .update(elections)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(elections.id, id));

    electionSyncQueue.push({ electionId: id, operation: "update" });
    return { success: true };
  });

  ipcMain.handle("elections:delete", async (_, id: string) => {
    const db = getDatabase();
    await db
      .update(elections)
      .set({
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(elections.id, id));

    electionSyncQueue.push({ electionId: id, operation: "delete" });
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .onConflictDoUpdate({
          target: adminAuth.id,
          set: {
            email,
            role,
            access_token: access_token,
            refresh_token: refresh_token,
            updatedAt: new Date().toISOString(),
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
