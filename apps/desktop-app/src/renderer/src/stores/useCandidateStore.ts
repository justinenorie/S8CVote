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

  fetchCandidates: () => Promise<Result<Candidates[]>>;
  addCandidate: (
    candidate: Omit<Candidates, "id" | "election">
  ) => Promise<Result<Candidates>>;
  updateCandidate: (
    id: string,
    updates: Partial<Candidates>
  ) => Promise<Result<Candidates>>;
  deleteCandidate: (id: string) => Promise<Result<null>>;
}

export const useCandidateStore = create<CandidateState>((set, get) => ({
  candidates: [],
  loading: false,
  error: null,

  // FETCH
  fetchCandidates: async () => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.from("candidates").select(
      `
        id,
        name,
        description,
        profile,
        election_id,
        election:election_id (
          id,
          election,
          status
        )
      `
    );
    if (error) {
      console.error("Error fetching candidates:", error);
      set({ error: error.message, loading: false });
      return { data: null, error: error.message };
    }

    const candidatesData: Candidates[] = data.map((c) => {
      return {
        id: c.id,
        name: c.name,
        description: c.description,
        profile: c.profile,
        election_id: c.election_id,
        election: Array.isArray(c.election) ? c.election[0] : c.election, // ✅ fix typing
      };
    });

    set({ candidates: candidatesData, loading: false });
    return { data: candidatesData, error: null };
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
}));
