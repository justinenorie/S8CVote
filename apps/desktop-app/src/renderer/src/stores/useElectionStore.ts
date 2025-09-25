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
  fetchElections: async () => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.from("elections").select(`
    id,
    election,
    status,
    end_time,
    end_date,
    candidates:candidates(id)
  `);

    if (error) {
      console.error("❌ Error fetching elections:", error);
      set({ error: error.message, loading: false });
      return { data: null, error: error.message };
    }

    // TODO: Fix the duration display
    const transformed: Election[] = data.map((e) => {
      let duration = "Not set";
      if (e.end_time && e.end_date) {
        const end_time = new Date(e.end_time);
        const end_date = new Date(e.end_date);
        const diffMs = end_time.getTime() - end_date.getTime();
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
