import { create } from "zustand";

interface SyncStatusState {
  online: boolean;
  syncing: boolean;
  lastSynced: string | null;
  setOnline: (state: boolean) => void;
  setSyncing: (state: boolean) => void;
  setLastSynced: (timestamp: string) => void;
}

export const useSyncStatusStore = create<SyncStatusState>((set) => ({
  online: navigator.onLine,
  syncing: false,
  lastSynced: null,

  setOnline: (state) => set({ online: state }),
  setSyncing: (state) => set({ syncing: state }),
  setLastSynced: (timestamp) => set({ lastSynced: timestamp }),
}));
