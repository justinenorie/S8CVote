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

    console.log(candidatesData);
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
  updateCandidate: async (id, updates) => {
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
    const { data, error } = await supabase
      .from("candidates")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      set({ error: error.message });
      return { data: null, error: error.message };
    }

    if (!data || data.length === 0) {
      console.warn("⚠️ No candidate deleted. Check id:", id);
      return { data: null, error: "No candidate deleted" };
    }

    await get().fetchCandidates();
    return { data: null, error: null };
  },
}));
