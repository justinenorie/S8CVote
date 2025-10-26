import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { Candidate, Election } from "@/types/api";
import {
  syncElectionsAndCandidates,
  syncStudentsFromSupabase,
  syncVotesToSupabase,
} from "@/db/queries/syncQuery";
import {
  getElectionsWithCandidates,
  insertLocalVote,
  hasLocalVote,
} from "@/db/queries/voteQuery";

import { hybridSync } from "@/utils/hybridSync";

type VoteResult<T = void> =
  | { data: null; error: string }
  | { data: T; error: null }
  | { data: null; error: null };

interface VoteState {
  elections: Election[];
  loading: boolean;
  error: string | null;

  loadElections: () => Promise<VoteResult<Election[]>>;
  // loadElection: (electionId: string) => Promise<VoteResult<Election>>;
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

  loadElections: async () => {
    try {
      set({ loading: true, error: null });

      const elections = await hybridSync<Election[]>(
        // 🟢 ONLINE MODE
        async () => {
          // TODO: instead of console.log change it to state then renders it
          // Get elections from view
          const { data: electionsRaw, error: e1 } = await supabase
            .from("elections_with_user_flag")
            .select("id, election, has_voted, status")
            .eq("status", "active")
            .order("created_at", { ascending: true });

          if (e1 || !electionsRaw)
            throw new Error(e1?.message ?? "Failed to load elections");

          if (electionsRaw.length === 0) return [];

          const ids = electionsRaw.map((e) => e.id);

          // Get candidate tallies
          const { data: resultsRaw, error: e2 } = await supabase
            .from("election_results_with_percent")
            .select(
              "election_id, candidate_id, candidate_name, votes_count, percentage, candidate_profile"
            )
            .in("election_id", ids);

          if (e2 || !resultsRaw)
            throw new Error(e2?.message ?? "Failed to load results");

          // Group candidates by election
          const byElection: Record<string, Candidate[]> = {};
          for (const row of resultsRaw) {
            const arr = byElection[row.election_id] || [];
            arr.push({
              candidate_id: row.candidate_id,
              candidate_name: row.candidate_name,
              votes_count: row.votes_count,
              percentage: Number(row.percentage),
              candidate_profile: row.candidate_profile || null,
            });
            byElection[row.election_id] = arr;
          }

          // Final shape for rendering
          const electionsData: Election[] = electionsRaw.map((e) => ({
            id: e.id,
            title: e.election,
            has_voted: !!e.has_voted,
            candidates: (byElection[e.id] || []).sort(
              (a, b) => b.votes_count - a.votes_count
            ),
          }));

          // Cache it locally for offline use
          await syncElectionsAndCandidates();

          return electionsData;
        },

        // 🔵 OFFLINE MODE
        async () => {
          console.log("📴 Fetching elections from SQLite cache...");
          const localElections = await getElectionsWithCandidates();
          return localElections;
        },

        // Optional: run cache sync when new data comes
        async (data) => {
          if (data?.length) await syncElectionsAndCandidates();
        }
      );

      set({ elections, loading: false });
      return { data: elections, error: null };
    } catch (err: any) {
      console.error("❌ loadElections error:", err);
      set({
        loading: false,
        error: err.message || "Failed to load elections",
      });
      return { data: null, error: err.message };
    }
  },

  // loadElection: async (electionId) => {
  //   try {
  //     set({ loading: true, error: null });

  //     const election = await getElectionById(electionId);
  //     if (!election) {
  //       return { data: null, error: "Election not found" };
  //     }

  //     set({ loading: false });
  //     return { data: election, error: null };
  //   } catch (err: any) {
  //     console.error("loadElection error:", err);
  //     set({ loading: false, error: err.message || "Failed to load election" });
  //     return { data: null, error: err.message || "Failed to load election" };
  //   }
  // },

  castVote: async (electionId, candidateId, studentId) => {
    try {
      console.log("🗳️ Attempting to cast vote...");

      const session = await supabase.auth.getSession();
      const adminId = session.data?.session?.user?.id;
      console.log("SUPABASE SESSION:", adminId);

      const result = await hybridSync(
        // 🟢 ONLINE MODE
        async () => {
          console.log("🌐 Casting vote via Supabase RPC...");
          const body = {
            p_election_id: electionId,
            p_candidate_id: candidateId,
            p_student_id: studentId,
          };

          console.log("Sending RPC body:", body);

          const { error } = await supabase.rpc("admin_cast_vote", body);

          if (error) throw new Error(error.message);

          // ✅ If RPC succeeds, sync any pending offline votes
          await syncVotesToSupabase();

          console.log("🗳️ Vote submitted online successfully");
        },

        // 🔵 OFFLINE MODE
        async () => {
          console.log("📴 Offline mode: saving vote locally...");
          await insertLocalVote(electionId, candidateId, studentId);
          console.log("💾 Vote saved to local SQLite for later sync");
        },

        // 🟣 Cache refresher or background sync (optional)
        async () => {
          await syncVotesToSupabase();
        }
      );

      return { data: result, error: null };
    } catch (err: any) {
      console.error("❌ castVote error:", err);

      set({ loading: false, error: err.message || "Verification failed" });
      return { data: null, error: err.message || "Failed to cast vote" };
    }
  },

  verifyStudent: async (studentId: string, electionId: string) => {
    try {
      set({ loading: true, error: null });

      const result = await hybridSync(
        // 🟢 ONLINE MODE
        async () => {
          console.log("🌐 Verifying student via Supabase RPC...");

          const { data, error } = await supabase.rpc("verify_student", {
            p_student_id: studentId,
            p_election_id: electionId,
          });

          if (error || !data || data.length === 0) {
            throw new Error(error?.message || "Invalid Student ID");
          }

          const verified = data[0];

          // 🔄 Cache update: refresh students locally
          await syncStudentsFromSupabase();

          return {
            is_valid: verified.is_valid,
            student_name: verified.student_name,
            has_voted: verified.has_voted,
          };
        },

        // 🔵 OFFLINE MODE
        async () => {
          console.log("📴 Offline mode: verifying student locally...");
          const local = await hasLocalVote(studentId, electionId);

          if (!local) {
            return {
              is_valid: false,
              student_name: "",
              has_voted: false,
            };
          }

          return local;
        },

        // 🟣 Cache refresher (optional, runs after online fetch)
        async () => {
          await syncStudentsFromSupabase();
        }
      );

      set({ loading: false });
      return { data: result, error: null };
    } catch (err: any) {
      console.error("❌ verifyStudent error:", err);
      set({ loading: false, error: err.message || "Verification failed" });
      return { data: null, error: err.message || "Verification failed" };
    }
  },
}));
