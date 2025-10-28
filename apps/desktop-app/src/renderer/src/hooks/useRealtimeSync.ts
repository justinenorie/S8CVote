import { useEffect } from "react";
import { useDashboardStore } from "@renderer/stores/useDashboardStore";

export function useRealtimeSync() {
  const { subscribeToVotes, unsubscribeFromVotes } = useDashboardStore();

  useEffect(() => {
    subscribeToVotes();
    return () => {
      unsubscribeFromVotes();
    };
  }, [subscribeToVotes, unsubscribeFromVotes]);
}
