import { ipcMain } from "electron";
import { getDatabase } from "./db/sqliteDB";
import { elections, adminAuth } from "./db/drizzle/schema";
import { eq } from "drizzle-orm";

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
  ipcMain.handle("elections:get", async () => {
    const db = getDatabase();
    return db.select().from(elections);
  });

  ipcMain.handle("elections:add", async (_, electionData) => {
    const db = getDatabase();
    await db.insert(elections).values({
      ...electionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    electionSyncQueue.push({
      electionId: electionData.id,
      operation: "create",
    });
    return { success: true };
  });

  ipcMain.handle("elections:update", async (_, { id, ...data }) => {
    const db = getDatabase();
    await db
      .update(elections)
      .set({
        ...data,
        updatedAt: new Date(),
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

  // SYNC HELPERS
  ipcMain.handle("get-election-sync-queue", async () => {
    return electionSyncQueue;
  });

  ipcMain.handle("clear-election-sync-queue", async (_, ids: string[]) => {
    electionSyncQueue = electionSyncQueue.filter(
      (q) => !ids.includes(q.electionId)
    );
    return { success: true };
  });
}
