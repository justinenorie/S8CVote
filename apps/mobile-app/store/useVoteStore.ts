import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { Election } from "@/types/api";
import { syncElectionsAndCandidates } from "@/db/queries/syncQuery";
import {
  getElectionsWithCandidates,
  getElectionById,
} from "@/db/queries/voteQuery";

type VoteResult<T = void> =
  | { data: null; error: string }
  | { data: T; error: null }
  | { data: null; error: null };

interface VoteState {
  elections: Election[];
  loading: boolean;
  error: string | null;

  loadElections: () => Promise<VoteResult<Election[]>>;
  loadElection: (electionId: string) => Promise<VoteResult<Election>>;
  castVote: (
    electionId: string,
    candidateId: string,
    studentId: string
  ) => Promise<VoteResult>;
  verifyStudent: (
    studentId: string,
    electionId: string
  ) => Promise<
    VoteResult<{ is_valid: boolean; student_name: string; has_voted: boolean }>
  >;
}

export const useVoteStore = create<VoteState>((set, get) => ({
  elections: [],
  loading: false,
  error: null,

  // Renders all the active elections
  // loadElections: async () => {
  //   set({ loading: true, error: null });

  //   // 1) list active elections (+ has_voted) from the view
  //   const { data: electionsRaw, error: e1 } = await supabase
  //     .from("elections_with_user_flag")
  //     .select("id, election, has_voted, status")
  //     .eq("status", "active")
  //     .order("created_at", { ascending: true });

  //   if (e1 || !electionsRaw) {
  //     set({ loading: false, error: e1?.message || "Failed to load elections" });
  //     return { data: null, error: e1?.message || "Failed to load elections" };
  //   }

  //   if (electionsRaw.length === 0) {
  //     set({ elections: [], loading: false });
  //     return { data: [], error: null };
  //   }

  //   const ids = electionsRaw.map((e) => e.id);

  //   // 2) get candidate tallies for those elections in one go
  //   const { data: resultsRaw, error: e2 } = await supabase
  //     .from("election_results_with_percent")
  //     .select(
  //       "election_id, candidate_id, candidate_name, votes_count, percentage, candidate_profile"
  //     )
  //     .in("election_id", ids);

  //   if (e2 || !resultsRaw) {
  //     set({ loading: false, error: e2?.message || "Failed to load results" });
  //     return { data: null, error: e2?.message || "Failed to load results" };
  //   }

  //   // 3) group candidates -> elections
  //   const byElection: Record<string, Candidate[]> = {};
  //   for (const row of resultsRaw) {
  //     const arr = byElection[row.election_id] || [];
  //     arr.push({
  //       candidate_id: row.candidate_id,
  //       candidate_name: row.candidate_name,
  //       votes_count: row.votes_count,
  //       percentage: Number(row.percentage),
  //       candidate_profile: row.candidate_profile || null,
  //     });
  //     byElection[row.election_id] = arr;
  //   }

  //   // 4) final shape - to display to UI
  //   const elections: Election[] = electionsRaw.map((e) => ({
  //     id: e.id,
  //     title: e.election,
  //     has_voted: !!e.has_voted,
  //     candidates: (byElection[e.id] || []).sort(
  //       (a, b) => b.votes_count - a.votes_count
  //     ),
  //   }));

  //   set({ elections, loading: false, error: null });

  //   return { data: elections, error: null };
  // },

  // ✅ Load all elections (offline-first)
  // TODO: Add a state to mark if online, and offline..
  loadElections: async () => {
    try {
      set({ loading: true, error: null });

      // 2️⃣ Always read from SQLite
      const localElections = await getElectionsWithCandidates();
      set({ elections: localElections, loading: false });
      console.log(`✅ Loaded ${localElections.length} elections from SQLite`);

      // 1️⃣ Try syncing from Supabase if online
      try {
        const { data: connection } = await supabase
          .from("elections")
          .select("id")
          .limit(1);
        if (connection) {
          console.log("🌐 Online: syncing elections...");
          await syncElectionsAndCandidates();
        }
      } catch {
        console.log("📴 Offline mode: using cached elections");
      }

      return { data: localElections, error: null };
    } catch (err: any) {
      console.error("loadElections error:", err);
      set({ loading: false, error: err.message || "Failed to load elections" });
      return { data: null, error: err.message || "Failed to load elections" };
    }
  },

  // ✅ Load single election (offline-first)
  loadElection: async (electionId) => {
    try {
      set({ loading: true, error: null });

      const election = await getElectionById(electionId);
      if (!election) {
        return { data: null, error: "Election not found" };
      }

      set({ loading: false });
      return { data: election, error: null };
    } catch (err: any) {
      console.error("loadElection error:", err);
      set({ loading: false, error: err.message || "Failed to load election" });
      return { data: null, error: err.message || "Failed to load election" };
    }
  },

  // Renderes the clicked election then fetch the candidates belong to the clicked election
  // loadElection: async (electionId) => {
  //   // one election from view
  //   const { data: eRaw, error: e1 } = await supabase
  //     .from("elections_with_user_flag")
  //     .select("id, election, has_voted, status")
  //     .eq("id", electionId)
  //     .single();

  //   if (e1 || !eRaw) {
  //     return { data: null, error: e1?.message || "Election not found" };
  //   }

  //   // candidates for that election
  //   const { data: cRaw, error: e2 } = await supabase
  //     .from("election_results_with_percent")
  //     .select(
  //       "election_id, candidate_id, candidate_name, votes_count, percentage, candidate_profile"
  //     )
  //     .eq("election_id", electionId);

  //   if (e2 || !cRaw) {
  //     return { data: null, error: e2?.message || "Failed to load candidates" };
  //   }

  //   const election: Election = {
  //     id: eRaw.id,
  //     title: eRaw.election,
  //     has_voted: !!eRaw.has_voted,
  //     candidates: cRaw
  //       .map((row) => ({
  //         candidate_id: row.candidate_id,
  //         candidate_name: row.candidate_name,
  //         votes_count: row.votes_count,
  //         percentage: Number(row.percentage),
  //         candidate_profile: row.candidate_profile || null,
  //       }))
  //       .sort((a, b) => b.votes_count - a.votes_count),
  //   };

  //   // update store copy
  //   const current = get().elections;
  //   const idx = current.findIndex((x) => x.id === electionId);
  //   if (idx >= 0) {
  //     const next = [...current];
  //     next[idx] = election;
  //     set({ elections: next });
  //   } else {
  //     set({ elections: [...current, election] });
  //   }

  //   return { data: election, error: null };
  // },

  castVote: async (electionId, candidateId, studentId) => {
    const { error } = await supabase.rpc("admin_cast_vote", {
      p_election_id: electionId,
      p_candidate_id: candidateId,
      p_student_id: studentId,
    });

    console.log(electionId, candidateId, studentId);

    if (error) {
      return { data: null, error: error.message };
    }

    await get().loadElection(electionId);
    return { data: null, error: null };
  },

  verifyStudent: async (studentId, electionId) => {
    const { data, error } = await supabase.rpc("verify_student", {
      p_student_id: studentId,
      p_election_id: electionId,
    });

    if (error || !data || data.length === 0) {
      return { data: null, error: error?.message || "Invalid Student ID" };
    }

    const result = data[0];

    return {
      data: {
        is_valid: result.is_valid,
        student_name: result.student_name,
        has_voted: result.has_voted,
      },
      error: null,
    };
  },
}));
