import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient";
import { Election } from "@renderer/types/api";

type Result<T = void> =
  | { data: T; error: null }
  | { data: null; error: string };

interface ElectionState {
  elections: Election[];
  loading: boolean;
  error: string | null;

  fetchElections: () => Promise<Result<Election[]>>;
  addElection: (election: Omit<Election, "id">) => Promise<Result<Election>>;
  updateElection: (
    id: string,
    updates: Partial<Election>
  ) => Promise<Result<Election>>;
  deleteElection: (id: string) => Promise<Result<null>>;
}

export const useElectionStore = create<ElectionState>((set, get) => ({
  elections: [],
  loading: false,
  error: null,

  // FETCH
  // FETCH
  fetchElections: async () => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.from("elections").select(`
    id,
    election,
    status,
    start_time,
    end_time,
    candidates:candidates(id)
  `);

    // 🔍 Log the raw response from Supabase
    console.log("📦 Raw elections data from Supabase:", data);
    if (error) {
      console.error("❌ Error fetching elections:", error);
      set({ error: error.message, loading: false });
      return { data: null, error: error.message };
    }

    // 🔍 If data is empty, show that too
    if (!data || data.length === 0) {
      console.warn("⚠️ No elections found in the database.");
      set({ elections: [], loading: false });
      return { data: [], error: null };
    }

    const transformed: Election[] = data.map((e) => {
      // Guard against null times
      let duration = "Not set";
      if (e.start_time && e.end_time) {
        const start = new Date(e.start_time);
        const end = new Date(e.end_time);
        const diffMs = end.getTime() - start.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

        duration = "";
        if (diffDays > 0) duration += `${diffDays}d `;
        if (diffHours > 0) duration += `${diffHours}h`;
        if (!duration) duration = "Less than 1h";
      }

      return {
        id: e.id,
        election: e.election,
        status: e.status,
        candidates: e.candidates?.length ?? 0,
        duration,
      };
    });

    // 🔍 Log after transformation
    console.log("✅ Transformed elections for UI:", transformed);

    set({ elections: transformed, loading: false });
    return { data: transformed, error: null };
  },

  // ADD
  addElection: async (election) => {
    const { data, error } = await supabase
      .from("elections")
      .insert([election])
      .select()
      .single();

    if (error) {
      set({ error: error.message });
      return { data: null, error: error.message };
    }

    await get().fetchElections();
    return { data, error: null };
  },

  // UPDATE
  updateElection: async (id, updates) => {
    const { data, error } = await supabase
      .from("elections")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      set({ error: error.message });
      return { data: null, error: error.message };
    }

    await get().fetchElections();
    return { data, error: null };
  },

  // DELETE
  deleteElection: async (id) => {
    const { error } = await supabase.from("elections").delete().eq("id", id);

    if (error) {
      set({ error: error.message });
      return { data: null, error: error.message };
    }

    await get().fetchElections();
    return { data: null, error: null };
  },
}));
