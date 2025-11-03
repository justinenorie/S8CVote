import { create } from "zustand";

interface SyncStatusState {
  online: boolean;
  syncing: boolean;
  lastSynced: string | null;

  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  updateLastSynced: () => void;
}

export const useSyncStatusStore = create<SyncStatusState>((set) => ({
  online: false,
  syncing: false,
  lastSynced: null,

  setOnline: (online) => set({ online }),
  setSyncing: (syncing) => set({ syncing }),
  updateLastSynced: () => set({ lastSynced: new Date().toISOString() }),
}));
