import { db } from "../client";
import { elections, candidates, students, votes } from "../schema";
import { eq } from "drizzle-orm";
import { supabase } from "@/lib/supabaseClient";

// TODO: after sync automatically update the data
export async function syncElectionsAndCandidates() {
  try {
    console.log("🌐 Syncing elections and candidates...");

    // 1️⃣ Fetch elections from Supabase view
    const { data: electionsRaw, error: e1 } = await supabase
      .from("elections_with_user_flag")
      .select("id, election, has_voted, status")
      .eq("status", "active");

    if (e1 || !electionsRaw)
      throw new Error(e1?.message ?? "Failed to fetch elections");

    // 2️⃣ Save elections locally
    await db.delete(elections);
    await db.insert(elections).values(
      electionsRaw.map((e) => ({
        id: e.id,
        title: e.election,
        has_voted: e.has_voted ? 1 : 0,
        status: e.status,
        synced_at: Date.now(),
      }))
    );

    // 3️⃣ Fetch candidate tallies
    const electionIds = electionsRaw.map((e) => e.id);
    const { data: candidatesRaw, error: e2 } = await supabase
      .from("election_results_with_percent")
      .select(
        "election_id, candidate_id, candidate_name, votes_count, percentage, candidate_profile"
      )
      .in("election_id", electionIds);

    if (e2 || !candidatesRaw)
      throw new Error(e2?.message ?? "Failed to fetch candidates");

    // 4️⃣ Save candidates locally
    await db.delete(candidates);
    await db.insert(candidates).values(
      candidatesRaw.map((c) => ({
        candidate_id: c.candidate_id,
        candidate_name: c.candidate_name,
        election_id: c.election_id,
        votes_count: c.votes_count,
        percentage: c.percentage,
        candidate_profile: c.candidate_profile || null,
        synced_at: Date.now(),
      }))
    );

    console.log("✅ Synced rendering data successfully");
  } catch (err) {
    console.error("❌ syncElectionsAndCandidates failed:", err);
  }
}

export async function syncStudentsFromSupabase() {
  try {
    console.log("🌐 Syncing students from Supabase...");

    const { data, error } = await supabase
      .from("students")
      .select("student_id, fullname, email, isRegistered");

    if (error || !data)
      throw new Error(error?.message ?? "Failed to fetch students");

    // Clear and reinsert to avoid duplicates
    await db.delete(students);
    await db.insert(students).values(
      data.map((s) => ({
        id: s.student_id,
        student_id: s.student_id,
        fullname: s.fullname,
        email: s.email || null,
        isRegistered: s.isRegistered ? 1 : 0,
        synced_at: Date.now(),
      }))
    );

    console.log(`✅ Synced ${data.length} students to SQLite`);
  } catch (err) {
    console.error("❌ syncStudentsFromSupabase failed:", err);
  }
}

export async function syncVotesToSupabase() {
  console.log("SYNC FOR VOTE GOT CALLED");
  const unsyncedVotes = await db
    .select()
    .from(votes)
    .where(eq(votes.synced_at, 0));

  for (const v of unsyncedVotes) {
    const { error } = await supabase.rpc("admin_cast_vote", {
      p_election_id: v.election_id,
      p_candidate_id: v.candidate_id,
      p_student_id: v.student_id,
    });

    if (!error) {
      await db.update(votes).set({ synced_at: 1 }).where(eq(votes.id, v.id));
    }
  }
}
