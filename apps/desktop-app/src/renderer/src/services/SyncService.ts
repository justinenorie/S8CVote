// services/SyncService.ts
import { supabase } from "@renderer/lib/supabaseClient";
import type { Election } from "../types/api";

export class SyncService {
  private syncInProgress = false;

  async syncElections(
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    if (this.syncInProgress)
      return { success: false, error: "Sync already in progress" };
    this.syncInProgress = true;

    try {
      // 1. Get sync queue
      const queue = await window.electronAPI.getElectionSyncQueue();
      if (queue.length === 0) {
        await this.pullFromSupabase(userId);
        return { success: true };
      }

      // 2. Push local changes
      const localElections: Election[] =
        await window.electronAPI.getElections();
      const electionsToSync = localElections.filter((e) =>
        queue.some((q) => q.electionId === e.id)
      );

      for (const election of electionsToSync) {
        const operation = queue.find(
          (q) => q.electionId === election.id
        )?.operation;

        if (operation === "delete") {
          await supabase
            .from("elections")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", election.id);
        } else if (operation === "create") {
          const { error } = await supabase.from("elections").insert({
            id: election.id,
            election: election.election,
            status: election.status,
            description: election.description,
            end_date: election.end_date,
            end_time: election.end_time,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          if (error) throw error;
        } else if (operation === "update") {
          await supabase
            .from("elections")
            .update({
              election: election.election,
              status: election.status,
              description: election.description,
              end_date: election.end_date,
              end_time: election.end_time,
              updated_at: new Date().toISOString(),
            })
            .eq("id", election.id);
        }
      }

      // 3. Clear processed queue
      await window.electronAPI.clearElectionSyncQueue(
        electionsToSync.map((e) => e.id)
      );

      // 4. Pull latest from Supabase
      await this.pullFromSupabase(userId);

      return { success: true };
    } catch (error) {
      console.error("Election sync error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  private async pullFromSupabase(userId: string): Promise<void> {
    const { data: remoteElections, error } = await supabase
      .from("elections")
      .select("*")
      .eq("user_id", userId)
      .is("deleted_at", null);

    if (error) throw error;

    const localElections: Election[] = await window.electronAPI.getElections();
    const localIds = new Set(localElections.map((e) => e.id));

    for (const remoteElection of remoteElections || []) {
      if (!localIds.has(remoteElection.id)) {
        await window.electronAPI.addElection(remoteElection);
      }
    }
  }
}
