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
      console.error("Error fetching elections:", error);
      set({ error: error.message, loading: false });
      return { data: null, error: error.message };
    }

    // TODO: Fix the duration display
    const transformed: Election[] = data.map((e) => {
      let duration = "Not set";

      if (e.end_date && e.end_time) {
        // Combine date + time into a single Date
        const endDateTime = new Date(`${e.end_date}T${e.end_time}`);
        const now = new Date();

        // Difference in ms
        const diffMs = endDateTime.getTime() - now.getTime();

        if (diffMs > 0) {
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
          const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

          duration = "";
          if (diffDays > 0) duration += `${diffDays}d `;
          if (diffHours > 0) duration += `${diffHours}h `;
          if (diffMinutes > 0 && diffDays === 0) duration += `${diffMinutes}m`;
          if (!duration) duration = "Less than 1m";
        } else {
          duration = "Done";
        }
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
    const { data, error } = await supabase
      .from("elections")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      set({ error: error.message });
      return { data: null, error: error.message };
    }

    // TODO: FOR TESTING DELETE LATER
    if (!data || data.length === 0) {
      console.warn(
        "⚠️ No election deleted. Check if the id matches exactly:",
        id
      );
      return { data: null, error: "No election deleted" };
    }

    await get().fetchElections();
    return { data: null, error: null };
  },
}));
