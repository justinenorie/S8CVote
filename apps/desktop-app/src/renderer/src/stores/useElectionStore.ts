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
  lastChangedAt: string | null;

  fetchElections: () => Promise<Result<Election[]>>;
  addElection: (election: Omit<Election, "id">) => Promise<Result<Election>>;
  updateElection: (
    id: string,
    updates: Partial<Election>
  ) => Promise<Result<Election>>;
  deleteElection: (id: string) => Promise<Result<null>>;

  syncToServerElection: () => Promise<Result<null>>;
  syncFromServerElection: () => Promise<Result<null>>;
  fullSyncElection: () => Promise<Result<null>>;
}

export const useElectionStore = create<ElectionState>((set, get) => ({
  elections: [],
  loading: false,
  error: null,

  syncing: false,
  syncError: null,
  lastSyncedAt: null,
  lastChangedAt: null,

  // TODO: Loading is kinda glitchy fix the logic later.

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
          candidates: e.candidate_count ?? 0,
          end_date: e.end_date,
          end_time: e.end_time,
          duration,
          description: e.description,
        };
      });

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

    try {
      set({ loading: true });
      await window.electronAPI.addElection(newElection);
      set({ lastChangedAt: new Date().toISOString() });
      await get().fetchElections();

      return { data: newElection, error: null };
    } catch (error: unknown) {
      console.error("Adding elections error:", error);
      set({ error: error as string, loading: false });
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
      set({ loading: true });
      await window.electronAPI.updateElection(id, updates);
      set({ lastChangedAt: new Date().toISOString() });
      await get().fetchElections();

      return { data: updates as Election, error: null };
    } catch (error: unknown) {
      console.error("Updating elections error:", error);
      set({ error: error as string, loading: false });
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
      set({ loading: true });
      await window.electronAPI.deleteElection(id);
      set({ lastChangedAt: new Date().toISOString() });
      get().fetchElections();

      return { data: null, error: null };
    } catch (error: unknown) {
      console.error("Deleting elections error:", error);
      set({ error: error as string, loading: false });
    }

    return { data: null, error: "" };
  },

  // SYNC METHODS HERE FOR ELECTIONS
  // Check if Online then proceed
  // syncToServer: All data that has not exist in the server will sync from sqlite to supabase
  syncToServerElection: async () => {
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
      console.error("Sync elections error:", error);
      set({ error: error as string, loading: false });
    }

    return { data: null, error: "" };
  },

  // syncFromServer: Get all updated data from the supabase and pass to sqlite
  syncFromServerElection: async () => {
    try {
      const { data, error } = await supabase.from("elections").select("*");
      if (error) throw error;

      await window.electronAPI.bulkUpsertElections(data);
      await get().fetchElections();
    } catch (error: unknown) {
      console.error("Sync elections error:", error);
      set({ error: error as string, loading: false });
    }
    return { data: null, error: "" };
  },

  fullSyncElection: async () => {
    set({ syncing: true, syncError: null });
    try {
      await get().syncToServerElection();
      await get().syncFromServerElection();
      set({ lastSyncedAt: new Date().toISOString() });
    } catch (error: unknown) {
      console.error("Sync elections error:", error);
      set({ error: error as string, loading: false });
    } finally {
      set({ syncing: false });
    }

    return { data: null, error: "" };
  },
}));
