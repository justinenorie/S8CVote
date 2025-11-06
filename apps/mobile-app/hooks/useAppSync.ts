import { isOnline } from "@/utils/network";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";

import {
  syncElectionsAndCandidates,
  syncStudentsFromSupabase,
  syncVoteResults,
  syncVotesToSupabase,
} from "@/db/queries/syncQuery";

import { useSyncStatusStore } from "@/store/useSyncStatusStore";
import { useVoteStore } from "@/store/useVoteStore";

const SYNC_COOLDOWN = 5 * 1000;

async function runFullSync(
  setSyncing: any,
  updateLastSynced: any,
  triggerRefresh: any
) {
  setSyncing(true);
  await Promise.all([
    syncElectionsAndCandidates(),
    syncStudentsFromSupabase(),
    syncVotesToSupabase(),
    syncVoteResults(),
  ]);
  setSyncing(false);
  updateLastSynced();
  triggerRefresh();
}

export function useAppSync() {
  const { setOnline, setSyncing, updateLastSynced } = useSyncStatusStore();
  const { triggerRefresh } = useVoteStore();
  const lastSyncRef = useRef<number>(0); // <-- ✅ Track last sync timestamp

  async function safeSync() {
    const now = Date.now();
    if (now - lastSyncRef.current < SYNC_COOLDOWN) return; // ✅ Skip if too soon
    lastSyncRef.current = now;

    if (await isOnline()) {
      await runFullSync(setSyncing, updateLastSynced, triggerRefresh);
    }
  }

  // 🟢 Background sync on app resume
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state === "active") safeSync();
    });

    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🟣 Sync when network reconnects (NetInfo)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const online = state.isConnected && state.isInternetReachable;
      setOnline(online ?? false);

      if (online) safeSync();
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
