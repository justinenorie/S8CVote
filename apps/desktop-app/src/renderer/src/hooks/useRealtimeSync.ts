import { useEffect } from "react";
import { useDashboardStore } from "@renderer/stores/useDashboardStore";
import { useSyncStatusStore } from "@renderer/stores/useSyncStatusStore";

export function useRealtimeSync() {
  const { subscribeToVotes, unsubscribeFromVotes } = useDashboardStore();
  const { online } = useSyncStatusStore();

  useEffect(() => {
    if (online) {
      subscribeToVotes();
      return () => {
        unsubscribeFromVotes();
      };
    }
    return;
  }, [subscribeToVotes, unsubscribeFromVotes, online]);
}
