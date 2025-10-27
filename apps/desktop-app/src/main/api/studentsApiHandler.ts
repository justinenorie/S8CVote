import { ipcMain } from "electron";
import { getDatabase } from "../db/sqliteDB";
import { students } from "../db/drizzle/schema";
import { eq, sql, inArray } from "drizzle-orm";

export function studentsApiHandlers(): void {
  // Fetching
  ipcMain.handle("students:get", async () => {
    const db = getDatabase();
    return db
      .select()
      .from(students)
      .where(sql`deleted_at IS NULL`);
  });

  // Existing bulk insert (upload)
  ipcMain.handle("students:bulkInsert", async (_, records) => {
    const db = getDatabase();
    for (const record of records) {
      await db
        .insert(students)
        .values(record)
        .onConflictDoUpdate({
          target: students.student_id,
          set: {
            ...record,
            updated_at: new Date().toISOString(),
            synced_at: 0,
          },
        });
    }
    return { success: true };
  });

  // Get unsynced students
  ipcMain.handle("students:getUnsynced", async () => {
    const db = getDatabase();
    const unsynced = await db
      .select()
      .from(students)
      .where(sql`synced_at = 0 OR synced_at IS NULL`);
    return unsynced;
  });

  // Mark students as synced
  ipcMain.handle("students:markSynced", async (_, ids) => {
    const db = getDatabase();
    await db
      .update(students)
      .set({ synced_at: 1 })
      .where(inArray(students.id, ids));
    return { success: true };
  });

  // Bulk upsert from Supabase (syncFromServer)
  ipcMain.handle("students:bulkUpsert", async (_, records) => {
    const db = getDatabase();
    for (const record of records) {
      const [local] = await db
        .select()
        .from(students)
        .where(eq(students.id, record.id));

      // 🧹 If the record from Supabase has been soft-deleted, mirror it locally
      if (record.deleted_at) {
        await db.delete(students).where(eq(students.id, record.id));
        continue;
      }

      if (!local) {
        await db.insert(students).values({ ...record, synced_at: 1 });
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
          .update(students)
          .set({ ...record, synced_at: 1 })
          .where(eq(students.id, record.id));
      }
    }

    return { success: true };
  });
}
