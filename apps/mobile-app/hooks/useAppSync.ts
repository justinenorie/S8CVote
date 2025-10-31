import { useEffect } from "react";
import { AppState } from "react-native";
import { supabase } from "@/lib/supabaseClient";
import { isOnline } from "@/utils/network";
import {
  syncElectionsAndCandidates,
  syncStudentsFromSupabase,
  syncVotesToSupabase,
  syncVoteResults,
} from "@/db/queries/syncQuery";
import { useVoteStore } from "@/store/useVoteStore";

export function useAppSync() {
  const { triggerRefresh } = useVoteStore();

  useEffect(() => {
    // 🟢 1. Realtime listener for votes
    const votesChannel = supabase
      .channel("votes-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "votes" },
        async () => {
          await syncElectionsAndCandidates();
          triggerRefresh();
        }
      )
      .subscribe((status) => {
        console.log("📡 Channel status:", status);
      });

    // 🟢 2. AppState listener (resume → sync)
    const subscription = AppState.addEventListener("change", async (state) => {
      if (state === "active") {
        const online = await isOnline();
        if (online) {
          console.log("🔄 App resumed & online — syncing data...");
          await Promise.all([
            syncElectionsAndCandidates(),
            syncStudentsFromSupabase(),
            syncVotesToSupabase(),
            syncVoteResults(),
          ]);
          triggerRefresh();
        } else {
          console.log("📴 Offline mode — skipping sync");
        }
      }
    });

    // 🧹 Cleanup
    return () => {
      subscription.remove();
      // if (interval) clearInterval(interval);
      supabase.removeChannel(votesChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
