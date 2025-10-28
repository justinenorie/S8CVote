import { useEffect } from "react";
import { useVoteStore } from "@/stores/useVoteStore";

export function useRealtimeSync() {
  const { subscribeToVotes, unsubscribeFromVotes } = useVoteStore();

  useEffect(() => {
    subscribeToVotes();
    return () => {
      unsubscribeFromVotes();
    };
  }, [subscribeToVotes, unsubscribeFromVotes]);
}
