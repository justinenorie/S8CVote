import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient";
import { useAuthStore } from "./useAuthStore";
import { Election } from "@renderer/types/api";

type Result<T = void> =
  | { data: T; error: null }
  | { data: null; error: string };

interface ElectionState {
  elections: Election[];
  loading: boolean;
  error: string | null;

  syncing: boolean;
  syncError: string | null;
  lastSyncedAt: string | null;

  fetchElections: () => Promise<Result<Election[]>>;
  addElection: (election: Omit<Election, "id">) => Promise<Result<Election>>;
  updateElection: (
    id: string,
    updates: Partial<Election>
  ) => Promise<Result<Election>>;
  deleteElection: (id: string) => Promise<Result<null>>;

  syncToServer: () => Promise<Result<null>>;
  syncFromServer: () => Promise<Result<null>>;
  fullSync: () => Promise<Result<null>>;
}

export const useElectionStore = create<ElectionState>((set, get) => ({
  elections: [],
  loading: false,
  error: null,

  syncing: false,
  syncError: null,
  lastSyncedAt: null,

  // TODO: Loading is kinda glitchy fix the logic later.

  // TODO: Handle the Error Properly for offline-first structure.

  /* TODO: Remove the online here it means:
    - All online proccess must be go through sync only.
    - This way we can prevent so many request happens.
  */

  // FETCH
  fetchElections: async (): Promise<Result<Election[]>> => {
    set({ loading: true, error: null });

    // Check if userAdmin is logged in
    const userID = useAuthStore.getState().user?.id;
    if (!userID) {
      set({ loading: false, error: "No user logged in" });
      return { data: null, error: "No user logged in" };
    }

    // Offline First fetch from SQLite
    try {
      set({ loading: true });
      const data = await window.electronAPI.getElections();

      const transformed: Election[] = (data as Election[]).map((e) => {
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
            if (diffMinutes > 0 && diffDays === 0)
              duration += `${diffMinutes}m`;
            if (!duration) duration = "Less than 1m";
          } else {
            duration = "Done";
          }
        }

        return {
          id: e.id,
          election: e.election,
          status: e.status,
          candidates: Array.isArray(e.candidates) ? e.candidates.length : 0,
          end_date: e.end_date,
          end_time: e.end_time,
          duration,
          description: e.description,
        };
      });

      // if connected to internet it will show the supabase database instead
      // try {
      //   const { data, error } = await supabase
      //     .from("elections")
      //     .select(
      //       `
      //         id,
      //         election,
      //         status,
      //         end_time,
      //         end_date,
      //         candidates:candidates(id),
      //         description
      //       `
      //     )
      //     .is("deleted_at", null);

      //   if (error) {
      //     console.error("Error fetching elections:", error);
      //     set({ error: error.message, loading: false });
      //     return { data: null, error: error.message };
      //   }

      //   const transformed: Election[] = data.map((e) => {
      //     let duration = "Not set";

      //     if (e.end_date && e.end_time) {
      //       // Combine date + time into a single Date
      //       const endDateTime = new Date(`${e.end_date}T${e.end_time}`);
      //       const now = new Date();

      //       // Difference in ms
      //       const diffMs = endDateTime.getTime() - now.getTime();

      //       if (diffMs > 0) {
      //         const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      //         const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      //         const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

      //         duration = "";
      //         if (diffDays > 0) duration += `${diffDays}d `;
      //         if (diffHours > 0) duration += `${diffHours}h `;
      //         if (diffMinutes > 0 && diffDays === 0)
      //           duration += `${diffMinutes}m`;
      //         if (!duration) duration = "Less than 1m";
      //       } else {
      //         duration = "Done";
      //       }
      //     }

      //     return {
      //       id: e.id,
      //       election: e.election,
      //       status: e.status,
      //       candidates: e.candidates?.length ?? 0,
      //       end_date: e.end_date,
      //       end_time: e.end_time,
      //       duration,
      //       description: e.description,
      //     };
      //   });

      //   set({ elections: transformed, loading: false });
      //   return { data: transformed, error: null };
      // } catch (errorOnline) {
      //   console.error(errorOnline);
      // }
      set({ elections: transformed, loading: false });
      return { data: transformed, error: null };
    } catch (error: unknown) {
      console.error("Fetch elections error:", error);
      set({ error: error as string, loading: false });
    }

    return { data: null, error: "" };
  },

  // ADD
  addElection: async (election) => {
    // Check if userAdmin is logged in
    const userID = useAuthStore.getState().user?.id;
    if (!userID) {
      set({ loading: false, error: "No user logged in" });
      return { data: null, error: "No user logged in" };
    }

    const newElection = {
      id: crypto.randomUUID(),
      ...election,
    };

    // Offline First
    try {
      const data = await window.electronAPI.addElection(newElection);
      get().fetchElections();

      // Then Online if connected to internet
      try {
        const { data, error } = await supabase
          .from("elections")
          .insert([newElection])
          .select()
          .single();

        if (error) {
          set({ error: error.message });
          return { data: null, error: error.message };
        }

        await get().fetchElections();
        return { data, error: null };
      } catch (errorOnline) {
        console.error(errorOnline);
      }
      return { data, error: null };
    } catch (error) {
      console.error("Add election error:", error);
    }

    return { data: null, error: "" };
  },

  // UPDATE
  updateElection: async (id, updates: Partial<Election>) => {
    // Check if userAdmin is logged in
    const userID = useAuthStore.getState().user?.id;
    if (!userID) {
      set({ loading: false, error: "No user logged in" });
      return { data: null, error: "No user logged in" };
    }

    // Offline First
    try {
      const data = await window.electronAPI.updateElection(id, updates);

      get().fetchElections();

      // Then Online if connected to internet
      try {
        const { data, error } = await supabase
          .from("elections")
          .update(updates)
          .eq("id", id)
          .select()
          .maybeSingle();

        if (error) {
          set({ error: error.message });
          return { data: null, error: error.message };
        }

        await get().fetchElections();
        return { data, error: null };
      } catch (errorOnline) {
        console.error(errorOnline);
      }
      return { data, error: null };
    } catch (error) {
      console.error("Update election error:", error);
    }
    return { data: null, error: "" };
  },

  // DELETE
  deleteElection: async (id) => {
    // Check if userAdmin is logged in
    const userID = useAuthStore.getState().user?.id;
    if (!userID) {
      set({ loading: false, error: "No user logged in" });
      return { data: null, error: "No user logged in" };
    }

    try {
      await window.electronAPI.deleteElection(id);
      get().fetchElections();

      try {
        const { error } = await supabase
          .from("elections")
          .update({
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select();

        if (error) {
          set({ error: error.message });
          return { data: null, error: error.message };
        }

        await get().fetchElections();
        return { data: null, error: null };
      } catch (errorOnline) {
        console.error(errorOnline);
      }

      return { data: null, error: null };
    } catch (error) {
      console.error("Delete election error:", error);
    }

    return { data: null, error: "" };
  },

  // SYNC METHODS HERE FOR ELECTIONS
  // Check if Online then proceed
  // syncToServer: All data that has not exist in the server will sync from sqlite to supabase
  syncToServer: async () => {
    try {
      const unsynced: Election[] =
        await window.electronAPI.getUnsyncedElections();

      if (!unsynced || unsynced.length === 0) {
        return { data: null, error: null };
      }

      const ids = unsynced.map((e) => e.id);

      const payload = unsynced.map((e) => ({
        ...e,
        synced_at: 1,
      }));

      const { error } = await supabase.from("elections").upsert(payload);
      if (error) throw error;

      await window.electronAPI.markElectionsSynced(ids);

      return { data: null, error: "" };
    } catch (error: unknown) {
      console.error("Fetch elections error:", error);
      set({ error: error as string, loading: false });
    }

    return { data: null, error: "" };
  },

  // syncFromServer: Get all updated data from the supabase and pass to sqlite
  syncFromServer: async () => {
    try {
      const { data, error } = await supabase.from("elections").select("*");
      if (error) throw error;

      await window.electronAPI.bulkUpsertElections(data);
      await get().fetchElections();
    } catch (error: unknown) {
      console.error("Fetch elections error:", error);
      set({ error: error as string, loading: false });
    }
    return { data: null, error: "" };
  },

  fullSync: async () => {
    set({ syncing: true, syncError: null });
    try {
      await get().syncToServer();
      await get().syncFromServer();
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
