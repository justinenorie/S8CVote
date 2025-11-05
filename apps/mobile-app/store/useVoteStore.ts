import { syncElectionsAndCandidates } from "@/db/queries/syncQuery";
import {
  getElectionsWithCandidates,
  hasLocalVote,
  insertLocalVote,
} from "@/db/queries/voteQuery";
import { supabase } from "@/lib/supabaseClient";
import { Election } from "@/types/api";
import { create } from "zustand";

type VoteResult<T = void> =
  | { data: null; error: string }
  | { data: T; error: null }
  | { data: null; error: null };

interface VoteState {
  elections: Election[];
  loading: boolean;
  error: string | null;
  lastUpdated?: number;
  studentSessionId: string | null;
  studentSessionName: string | null;

  loadElections: () => Promise<VoteResult<Election[]>>;
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
  triggerRefresh: () => void;
  subscribeToVotes: () => void;
  unsubscribeFromVotes: () => void;
  setStudentSession: (id: string, name: string) => Promise<void>;
  clearLocalVotes: () => Promise<void>;
  markElectionVoted: (electionId: string) => Promise<void>;
  localVoted: { [electionId: string]: boolean };
}

let votesChannel: ReturnType<typeof supabase.channel> | null = null;

export const useVoteStore = create<VoteState>((set, get) => ({
  elections: [],
  loading: false,
  lastUpdated: Date.now(),
  error: null,
  studentSessionId: null,
  studentSessionName: null,
  localVoted: {},

  markElectionVoted: (electionId) => {
    set((state) => ({
      localVoted: { ...state.localVoted, [electionId]: true },
      elections: state.elections.map((e) =>
        e.id === electionId ? { ...e, has_voted: true } : e
      ),
    }));
    return Promise.resolve();
  },

  setStudentSession: (id: string, name: string) => {
    set({ studentSessionId: id, studentSessionName: name });
    return Promise.resolve();
  },

  clearLocalVotes: () => {
    set({ localVoted: {}, studentSessionId: null, studentSessionName: null });
    return Promise.resolve();
  },

  loadElections: async () => {
    try {
      set({ loading: true, error: null });

      // const localElections = await getElectionsWithCandidates();
      // const localVoted = get().localVoted;
      // const elections = localElections.map((e) => ({
      //   ...e,
      //   has_voted: localVoted[e.id] ? true : e.has_voted,
      // }));

      const studentId = get().studentSessionId;
      const electionsFromDb = await getElectionsWithCandidates();

      // Always compute has_voted per student using SQLite votes table
      const elections = await Promise.all(
        electionsFromDb.map(async (e) => {
          if (!studentId) return { ...e, has_voted: false };

          const local = await hasLocalVote(studentId, e.id);
          return { ...e, has_voted: local.has_voted };
        })
      );

      const allDone = elections.every((e) => e.has_voted === true);
      if (allDone) {
        console.log("🎉 All elections completed — resetting session...");
        await get().clearLocalVotes();
        // ✅ Re-run loadElections AFTER clearing to update UI
        set({ elections: [], loading: false });
        return await get().loadElections();
      }

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

  castVote: async (electionId, candidateId, studentId) => {
    try {
      console.log("🗳️ Casting vote (offline-first)...");

      await insertLocalVote(electionId, candidateId, studentId);
      await get().loadElections();
      // get().markElectionVoted(electionId);

      console.log("💾 Vote stored locally");

      return { data: null, error: null };
    } catch (err: any) {
      console.error("❌ castVote error:", err);

      set({ loading: false, error: err.message || "Verification failed" });
      return { data: null, error: err.message || "Failed to cast vote" };
    }
  },

  verifyStudent: async (studentId: string, electionId: string) => {
    try {
      set({ loading: true, error: null });

      const local = await hasLocalVote(studentId, electionId);

      if (!local) {
        return {
          data: {
            is_valid: false,
            student_name: "",
            has_voted: false,
          },
          error: null,
        };
      }

      set({ loading: false, lastUpdated: Date.now() });
      return { data: local, error: null };
    } catch (err: any) {
      console.error("❌ verifyStudent error:", err);
      set({ loading: false, error: err.message || "Verification failed" });
      return { data: null, error: err.message || "Verification failed" };
    }
  },

  triggerRefresh: () => {
    console.log("🔄 Triggering UI refresh from background sync...");
    set({ lastUpdated: Date.now() });
    get().loadElections();
  },

  // REAL-TIME VOTE COUNTING
  subscribeToVotes: () => {
    if (votesChannel) {
      console.log("🔁 Realtime votes already active");
      return votesChannel;
    }

    console.log("📡 Subscribing to realtime votes...");

    votesChannel = supabase
      .channel("votes-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "votes" },
        async () => {
          console.log("🔃 Vote detected → refreshing UI");
          await syncElectionsAndCandidates();
          await get().loadElections();
        }
      )
      .subscribe();

    return votesChannel;
  },

  unsubscribeFromVotes: () => {
    if (votesChannel) {
      console.log("🔌 Unsubscribing realtime votes...");
      supabase.removeChannel(votesChannel);
      votesChannel = null;
    }
  },
}));
