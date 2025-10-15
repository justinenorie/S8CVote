import { useEffect } from "react";
import { useElectionStore } from "@renderer/stores/useElectionStore";
import { useCandidateStore } from "@renderer/stores/useCandidateStore";

export function useFullSync(): void {
  const { fullSyncElection } = useElectionStore();
  const { fullSyncCandidates } = useCandidateStore();

  useEffect(() => {
    const syncAll = async (): Promise<void> => {
      if (!navigator.onLine) {
        console.log("🛑 Offline mode: sync postponed.");
        return;
      }

      try {
        console.log("🔄 Starting full sync...");
        await fullSyncElection();
        await fullSyncCandidates();
        console.log("✅ Full sync complete!");
      } catch (err) {
        console.error("❌ Sync error:", err);
      }
    };

    syncAll();

    window.addEventListener("online", syncAll);
    return () => {
      window.removeEventListener("online", syncAll);
    };
  }, [fullSyncElection, fullSyncCandidates]);
}
