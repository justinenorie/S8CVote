import { ipcMain } from "electron";
import { getDatabase } from "../db/sqliteDB";
import { candidates, elections, candidateTallies } from "../db/drizzle/schema";
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

    return { success: true };
  });

  // Upsert all the changes
  ipcMain.handle("candidates:bulkUpsert", async (_, records) => {
    const db = getDatabase();

    for (const record of records) {
      const { election, ...cleanRecord } = record;

      // Ensure election_id exists (foreign key)
      if (!cleanRecord.election_id && election?.id) {
        cleanRecord.election_id = election.id;
      }

      const [local] = await db
        .select()
        .from(candidates)
        .where(eq(candidates.id, cleanRecord.id));

      // 🧹 Delete locally if Supabase has deleted it
      if (record.deleted_at) {
        await db.delete(candidates).where(eq(candidates.id, record.id));
        continue;
      }

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

    // Join candidates with elections on election_id
    const results = await db
      .select({
        id: candidates.id,
        name: candidates.name,
        description: candidates.description,
        profile: candidates.profile,
        election_id: candidates.election_id,
        // election details from joined table
        election: elections.election,
        election_status: elections.status,

        votes_count: candidateTallies.votes_count,
        percentage: candidateTallies.percentage,
      })
      .from(candidates)
      .leftJoin(elections, eq(candidates.election_id, elections.id))
      .leftJoin(
        candidateTallies,
        eq(candidateTallies.candidate_id, candidates.id)
      )
      .where(sql`${candidates.deleted_at} IS NULL`);

    // ✅ Transform to match your frontend type
    return results.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      profile: row.profile,
      election_id: row.election_id,
      election: row.election
        ? {
            id: row.election_id,
            election: row.election,
            status: row.election_status,
          }
        : null,
      votes_count: row.votes_count ?? 0,
      percentage: row.percentage ?? 0,
    }));
  });

  // POST
  ipcMain.handle("candidates:add", async (_, candidatesData) => {
    const db = getDatabase();
    const data = {
      ...candidatesData,
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
    return { success: true };
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

  // FETCH VOTE COUNTS
  ipcMain.handle("tallies:replaceForElections", async (_, rows) => {
    const db = getDatabase();
    // const electionIds = [...new Set(rows.map((r) => r.election_id))];

    // wipe old tallies for these elections
    await db.delete(candidateTallies).where(
      inArray(
        candidateTallies.election_id,
        rows.map((r) => r.election_id)
      )
    );

    // .where(inArray(candidates.id, ids))

    // insert fresh rows
    const now = new Date().toISOString();
    if (rows.length) {
      await db.insert(candidateTallies).values(
        rows.map((r) => ({
          election_id: r.election_id,
          candidate_id: r.candidate_id,
          votes_count: r.votes_count ?? 0,
          percentage: r.percentage ?? 0,
          candidate_profile: r.candidate_profile ?? null,
          updated_at: now,
        }))
      );
    }

    return { success: true };
  });
}
