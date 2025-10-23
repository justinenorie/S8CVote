import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient";
import { useAuthStore } from "./useAuthStore";
import { Candidates } from "@renderer/types/api";

type Result<T = void> =
  | { data: T; error: null }
  | { data: null; error: string };

interface CandidateState {
  candidates: Candidates[];
  loading: boolean;
  error: string | null;

  syncing: boolean;
  syncError: string | null;
  lastSyncedAt: string | null;

  fetchCandidates: () => Promise<Result<Candidates[]>>;
  addCandidate: (
    candidate: Omit<Candidates, "id" | "election">
  ) => Promise<Result<Candidates>>;
  updateCandidate: (
    id: string,
    updates: Partial<Candidates>
  ) => Promise<Result<Candidates>>;
  deleteCandidate: (id: string) => Promise<Result<null>>;
  syncToServerCandidates: () => Promise<Result<null>>;
  syncFromServerCandidates: () => Promise<Result<null>>;
  fullSyncCandidates: () => Promise<Result<null>>;
  refreshTalliesFor: (electionIds: string[]) => Promise<Result<null>>;
}

export const useCandidateStore = create<CandidateState>((set, get) => ({
  candidates: [],
  loading: false,
  error: null,

  syncing: false,
  syncError: null,
  lastSyncedAt: null,

  // FETCH
  fetchCandidates: async () => {
    set({ loading: true, error: null });

    const userID = useAuthStore.getState().user?.id;
    if (!userID) {
      set({ loading: false, error: "No user logged in" });
      return { data: null, error: "No user logged in" };
    }

    try {
      set({ loading: true });
      const data = await window.electronAPI.candidatesGet();

      set({ candidates: data, loading: false });
      return { data: data, error: null };
    } catch (error: unknown) {
      console.error("Fetch candidates error:", error);
      set({ error: error as string, loading: false });
    }
    return { data: null, error: "" };
  },

  // ADD
  addCandidate: async (candidate) => {
    const userID = useAuthStore.getState().user?.id;
    if (!userID) {
      set({ loading: false, error: "No user logged in" });
      return { data: null, error: "No user logged in" };
    }

    const newCandidates = {
      id: crypto.randomUUID(),
      ...candidate,
    };

    try {
      set({ loading: true });
      await window.electronAPI.candidatesAdd(newCandidates);
      await get().fetchCandidates();

      return { data: newCandidates, error: null };
    } catch (error: unknown) {
      console.error("Adding candidates error:", error);
      set({ error: error as string, loading: false });
    }

    return { data: null, error: "" };
  },

  // UPDATE
  updateCandidate: async (id, updates) => {
    const userID = useAuthStore.getState().user?.id;
    if (!userID) {
      set({ loading: false, error: "No user logged in" });
      return { data: null, error: "No user logged in" };
    }

    try {
      set({ loading: true });
      await window.electronAPI.candidatesUpdate(id, updates as Candidates);
      await get().fetchCandidates();

      return { data: updates as Candidates, error: null };
    } catch (error: unknown) {
      console.error("Updating candidates error:", error);
      set({ error: error as string, loading: false });
    }

    return { data: null, error: "" };
  },

  // DELETE
  deleteCandidate: async (id) => {
    const userID = useAuthStore.getState().user?.id;
    if (!userID) {
      set({ loading: false, error: "No user logged in" });
      return { data: null, error: "No user logged in" };
    }

    try {
      set({ loading: true });
      await window.electronAPI.candidatesDelete(id);
      get().fetchCandidates();

      return { data: null, error: null };
    } catch (error: unknown) {
      console.error("Deleting candidates error:", error);
      set({ error: error as string, loading: false });
    }

    return { data: null, error: null };
  },

  // SYNC METHODS HERE FOR CANDIDATES
  // SYNC TO SERVER
  syncToServerCandidates: async () => {
    try {
      const unsynced = await window.electronAPI.candidatesGetUnsynced();
      if (!unsynced || unsynced.length === 0)
        return { data: null, error: null };

      const payload = unsynced.map((c) => ({ ...c, synced_at: 1 }));

      const { error } = await supabase.from("candidates").upsert(payload);
      if (error) throw error;

      const ids = unsynced.map((c) => c.id);
      await window.electronAPI.candidatesMarkSynced(ids);

      return { data: null, error: null };
    } catch (error: unknown) {
      console.error("Sync candidates error:", error);
      set({ error: error as string, loading: false });
    }
    return { data: null, error: "" };
  },

  // SYNC FROM SERVER
  syncFromServerCandidates: async () => {
    try {
      const { data, error } = await supabase.from("candidates").select("*");
      if (error) throw error;

      await window.electronAPI.candidatesBulkUpsert(data);
      await get().fetchCandidates();
    } catch (error: unknown) {
      console.error("Sync Candidates error:", error);
      set({ error: error as string, loading: false });
    }
    return { data: null, error: "" };
  },

  // in your zustand vote store
  refreshTalliesFor: async (electionIds: string[]) => {
    if (!electionIds.length) return { data: null, error: null };

    const { data, error } = await supabase
      .from("election_results_with_percent")
      .select(
        "election_id, candidate_id, votes_count, percentage, candidate_profile"
      )
      .in("election_id", electionIds);

    if (error) return { data: null, error: error.message };

    await window.electronAPI.talliesReplaceForElections(data ?? []);
    return { data: null, error: null };
  },

  fullSyncCandidates: async () => {
    set({ syncing: true, syncError: null });
    try {
      await get().syncToServerCandidates();
      await get().syncFromServerCandidates();
      set({ lastSyncedAt: new Date().toISOString() });
    } catch (error: unknown) {
      console.error("Sync candidates error:", error);
      set({ error: error as string, loading: false });
    } finally {
      set({ syncing: false });
    }

    return { data: null, error: "" };
  },
}));
