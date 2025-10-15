import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient";
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

    try {
      const data = await window.electronAPI.candidatesGet();

      set({ candidates: data, loading: false });
      return { data: data, error: null };
    } catch (error: unknown) {
      console.error("Fetch elections error:", error);
      set({ error: error as string, loading: false });
    }
    return { data: null, error: "" };
  },

  // ADD
  addCandidate: async (candidate) => {
    const { data, error } = await supabase
      .from("candidates")
      .insert([candidate])
      .select()
      .single();

    if (error) {
      set({ error: error.message });
      return { data: null, error: error.message };
    }

    await get().fetchCandidates();
    return { data, error: null };
  },

  // UPDATE
  updateCandidate: async (id: string, updates: Partial<Candidates>) => {
    const { data, error } = await supabase
      .from("candidates")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      set({ error: error.message });
      return { data: null, error: error.message };
    }

    await get().fetchCandidates();
    return { data, error: null };
  },

  // DELETE
  deleteCandidate: async (id) => {
    const { data: candidate } = await supabase
      .from("candidates")
      .select("profile_path")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("candidates").delete().eq("id", id);
    if (error) return { data: null, error: error.message };

    if (candidate?.profile_path) {
      await supabase.storage.from("avatars").remove([candidate.profile_path]);
    }

    await get().fetchCandidates();
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
      console.error("Fetch elections error:", error);
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
      console.error("Fetch elections error:", error);
      set({ error: error as string, loading: false });
    }
    return { data: null, error: "" };
  },

  fullSyncCandidates: async () => {
    set({ syncing: true, syncError: null });
    try {
      await get().syncToServerCandidates();
      await get().syncFromServerCandidates();
      set({ lastSyncedAt: new Date().toISOString() });
    } catch (error: unknown) {
      console.error("Fetch elections error:", error);
      set({ error: error as string, loading: false });
    } finally {
      set({ syncing: false });
    }

    return { data: null, error: "" };
  },
}));
