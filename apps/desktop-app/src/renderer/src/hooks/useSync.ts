import { useEffect } from "react";
import { useElectionStore } from "@renderer/stores/useElectionStore";

// TODO: Instead of interval it should detect if online or offline sync
// TODO: Interval Syncing is bad because it is too much request
export function useSyncElections(interval = 10000): void {
  const { fullSync } = useElectionStore();

  useEffect(() => {
    const sync = async (): Promise<void> => {
      if (navigator.onLine) {
        await fullSync();
      }
    };

    // initial sync
    sync();

    // interval background sync
    const timer = setInterval(sync, interval);
    return () => clearInterval(timer);
  }, [fullSync, interval]);
}
