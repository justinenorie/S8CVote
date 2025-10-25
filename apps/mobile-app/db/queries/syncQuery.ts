// db/queries/syncQueries.ts
import { db } from "../client";
import { elections, candidates } from "../schema";
import { supabase } from "@/lib/supabaseClient";

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
