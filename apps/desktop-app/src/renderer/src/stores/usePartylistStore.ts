import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient";
import { useAuthStore } from "./useAuthStore";
import { Partylist } from "@renderer/types/api"; // define this like Candidates type

type Result<T = void> =
  | { data: T; error: null }
  | { data: null; error: string };

interface PartylistState {
  partylist: Partylist[];
  loading: boolean;
  error: string | null;

  syncing: boolean;
  syncError: string | null;
  lastSyncedAt: string | null;
  lastChangedAt: string | null;

  fetchPartylist: () => Promise<Result<Partylist[]>>;
  addPartylist: (
    record: Omit<Partylist, "id" | "members_count">
  ) => Promise<Result<Partylist>>;
  updatePartylist: (
    id: string,
    updates: Partial<Partylist>
  ) => Promise<Result<Partylist>>;
  deletePartylist: (id: string) => Promise<Result<null>>;

  syncToServerPartylist: () => Promise<Result<null>>;
  syncFromServerPartylist: () => Promise<Result<null>>;
  fullSyncPartylist: () => Promise<Result<null>>;
}

export const usePartylistStore = create<PartylistState>((set, get) => ({
  partylist: [],
  loading: false,
  error: null,

  syncing: false,
  syncError: null,
  lastSyncedAt: null,
  lastChangedAt: null,

  // FETCH (Offline First)
  fetchPartylist: async () => {
    set({ loading: true, error: null });

    try {
      const data = await window.electronAPI.partylistGet();

      const transformed = (data as Partylist[]).map((p) => ({
        ...p,
        members_count: p.members_count ?? 0,
      }));

      set({ partylist: transformed, loading: false });
      return { data: transformed, error: null };
    } catch (error: unknown) {
      console.error("Fetch partylist error:", error);
      set({ error: error as string, loading: false });
      return { data: null, error: "Failed to fetch partylist" };
    }
  },

  // ADD
  addPartylist: async (record) => {
    const newPartylist = {
      id: crypto.randomUUID(),
      ...record,
    };

    try {
      set({ loading: true });
      await window.electronAPI.partylistAdd(newPartylist);
      set({ lastChangedAt: new Date().toISOString() });
      await get().fetchPartylist();

      return { data: newPartylist, error: null };
    } catch (error: unknown) {
      console.error("Add partylist error:", error);
      set({ error: error as string, loading: false });
      return { data: null, error: "Failed to add partylist" };
    }
  },

  // UPDATE
  updatePartylist: async (id, updates) => {
    try {
      set({ loading: true });
      await window.electronAPI.partylistUpdate(id, updates);
      set({ lastChangedAt: new Date().toISOString() });
      await get().fetchPartylist();
      return { data: updates as Partylist, error: null };
    } catch (error: unknown) {
      console.error("Update partylist error:", error);
      set({ error: error as string, loading: false });
      return { data: null, error: "Failed to update partylist" };
    }
  },

  // DELETE (Soft Delete)
  deletePartylist: async (id) => {
    try {
      set({ loading: true });
      await window.electronAPI.partylistDelete(id);
      set({ lastChangedAt: new Date().toISOString() });
      await get().fetchPartylist();
      return { data: null, error: null };
    } catch (error: unknown) {
      console.error("Delete partylist error:", error);
      set({ error: error as string, loading: false });
      return { data: null, error: "Failed to delete partylist" };
    }
  },

  // 🔄 SYNC TO SERVER
  syncToServerPartylist: async () => {
    const userID = useAuthStore.getState().user?.id;
    if (!userID) {
      set({ loading: false, error: "No user logged in" });
      return { data: null, error: "No user logged in" };
    }

    try {
      const unsynced = await window.electronAPI.partylistGetUnsynced();
      if (!unsynced || unsynced.length === 0)
        return { data: null, error: null };

      const payload = unsynced.map((p) => ({
        ...p,
        synced_at: 1,
      }));

      const { error } = await supabase.from("partylist").upsert(payload);
      if (error) throw error;

      const ids = unsynced.map((p) => p.id);
      await window.electronAPI.partylistMarkSynced(ids);

      return { data: null, error: null };
    } catch (error: unknown) {
      console.error("SyncToServer partylist error:", error);
      set({ error: error as string, loading: false });
      return { data: null, error: "Failed to sync to server" };
    }
  },

  // 🔁 SYNC FROM SERVER
  syncFromServerPartylist: async () => {
    const userID = useAuthStore.getState().user?.id;
    if (!userID) {
      set({ loading: false, error: "No user logged in" });
      return { data: null, error: "No user logged in" };
    }

    try {
      const { data, error } = await supabase.from("partylist").select("*");
      if (error) throw error;

      await window.electronAPI.partylistBulkUpsert(data);
      await get().fetchPartylist();

      return { data: null, error: null };
    } catch (error: unknown) {
      console.error("SyncFromServer partylist error:", error);
      set({ error: error as string, loading: false });
      return { data: null, error: "Failed to sync from server" };
    }
  },

  // 🧩 FULL SYNC
  fullSyncPartylist: async () => {
    const userID = useAuthStore.getState().user?.id;
    if (!userID) {
      set({ loading: false, error: "No user logged in" });
      return { data: null, error: "No user logged in" };
    }

    set({ syncing: true, syncError: null });
    try {
      await get().syncToServerPartylist();
      await get().syncFromServerPartylist();
      set({ lastSyncedAt: new Date().toISOString() });
      return { data: null, error: null };
    } catch (error: unknown) {
      console.error("FullSync partylist error:", error);
      set({ syncError: error as string });
      return { data: null, error: "Full sync failed" };
    } finally {
      set({ syncing: false });
    }
  },
}));
