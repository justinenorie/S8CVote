import { useEffect, useRef } from "react";
import { useElectionStore } from "@renderer/stores/useElectionStore";
import { useCandidateStore } from "@renderer/stores/useCandidateStore";
import { useStudentStore } from "@renderer/stores/useStudentStore";
import { usePartylistStore } from "@renderer/stores/usePartylistStore";
import { useSyncStatusStore } from "@renderer/stores/useSyncStatusStore";

export function useFullSync(): void {
  const { fullSyncElection, lastChangedAt: electionSyncedAt } =
    useElectionStore();
  const { fullSyncCandidates, lastChangedAt: candidatesSyncedAt } =
    useCandidateStore();
  const { fullSyncStudents, lastChangedAt: studentsSyncedAt } =
    useStudentStore();
  const { fullSyncPartylist, lastChangedAt: partylistSyncedAt } =
    usePartylistStore();

  const { setOnline, setSyncing, setLastSynced } = useSyncStatusStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const syncAll = async (): Promise<void> => {
      if (!navigator.onLine) {
        console.log("🛑 Offline mode: sync postponed.");
        setOnline(false);
        return;
      }

      setOnline(true);

      try {
        console.log("🔄 Syncing all data...");
        await Promise.all([
          fullSyncElection(),
          fullSyncCandidates(),
          fullSyncStudents(),
          fullSyncPartylist(),
        ]);
        setLastSynced(
          new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(new Date())
        );
        setSyncing(false);
        console.log("✅ Sync complete!");
      } catch (err) {
        console.error("❌ Sync error:", err);
      }
    };

    // 🔁 Debounce logic: wait 3 seconds after last change
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSyncing(true);
    console.log("Wait I am waiting if there's another changes..");
    timeoutRef.current = setTimeout(() => {
      syncAll();
    }, 3000);

    window.addEventListener("online", syncAll);
    return () => {
      window.removeEventListener("online", syncAll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    electionSyncedAt,
    candidatesSyncedAt,
    studentsSyncedAt,
    partylistSyncedAt,
  ]);
}
