import { useEffect } from "react";
import { useVoteStore } from "@/store/useVoteStore";
import { isOnline } from "@/utils/network";

export function useRealtime() {
  const { subscribeToVotes, unsubscribeFromVotes } = useVoteStore();

  useEffect(() => {
    let active = true;

    async function setup() {
      const online = await isOnline();
      if (online && active) {
        subscribeToVotes();
      }
    }

    setup();

    return () => {
      active = false;
      unsubscribeFromVotes();
    };
  }, [subscribeToVotes, unsubscribeFromVotes]);
}
