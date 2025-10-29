import { ipcMain } from "electron";
import { getDatabase } from "./db/sqliteDB";
import { adminAuth } from "./db/drizzle/schema";
import { electionsApiHandlers } from "./api/electionsApiHandler";
import { candidatesApiHandlers } from "./api/candidatesApiHandler";
import { studentsApiHandlers } from "./api/studentsApiHandler";
import { partylistApiHandlers } from "./api/partylistApiHandler";
import { resultsApiHandlers } from "./api/resultsApiHandler";

// TODO: Add more ipc Handler here:
/* 
  Missing Handler
  - dashboard (fetching data)
  - candidates
  - list of students
  - settings
*/

// TODO: Make a separation ipc for different module

export function setupIpcHandlers(): void {
  electionsApiHandlers();

  candidatesApiHandlers();

  studentsApiHandlers();

  partylistApiHandlers();

  resultsApiHandlers();

  // AUTH (simple offline cache)
  ipcMain.handle(
    "auth:admin",
    async (_, { id, email, fullname, role, access_token, refresh_token }) => {
      const db = getDatabase();
      await db
        .insert(adminAuth)
        .values({
          id,
          email,
          fullname,
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
