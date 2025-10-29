import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient";

interface Result {
  year: number;
  months: Month[];
}

interface Month {
  date: string;
  elections: Election[];
}

interface Election {
  id: string;
  election: string;
  total_votes: number;
  candidates: Candidate[];
}

interface Candidate {
  id: string;
  name: string;
  vote_counts: number;
  percentage: number;
  partylist: string;
  acronym: string;
  color: string;
  image: string;
}

interface ResultsStore {
  results: Result[];
  loading: boolean;
  error: string | null;

  loadResults: () => Promise<void>;
  syncToServerResults: () => Promise<void>;
  syncFromServerResults: () => Promise<void>;
  fullSyncResults: () => Promise<void>;
}

export const useResultsStore = create<ResultsStore>((set, get) => ({
  results: [],
  loading: false,
  error: null,

  loadResults: async () => {
    set({ loading: true, error: null });
    try {
      const rows = await window.electronAPI.voteTalliesGetAll();

      // Group by year + month → same format as your UI expects
      const grouped = rows.reduce((acc, row) => {
        const date = new Date(row.created_at);
        const year = date.getFullYear();
        const monthLabel =
          date.toLocaleString("en-US", { month: "long" }) + " " + year;

        acc[year] ??= { year, months: [] };
        let month = acc[year].months.find((m) => m.date === monthLabel);
        if (!month) {
          month = { date: monthLabel, elections: [] };
          acc[year].months.push(month);
        }

        let election = month.elections.find((e) => e.id === row.election_id);
        if (!election) {
          election = {
            id: row.election_id,
            election: row.election_name,
            total_votes: row.total_votes,
            candidates: [],
          };
          month.elections.push(election);
        }

        election.candidates.push({
          id: row.candidate_id,
          name: row.candidate_name,
          vote_counts: row.votes_count,
          percentage: row.percentage,
          partylist: row.partylist_name,
          acronym: row.partylist_acronym,
          color: row.partylist_color,
          image: row.candidate_profile,
        });

        return acc;
      }, {});

      set({ results: Object.values(grouped) });
    } catch (error: unknown) {
      console.error("Loading Results error:", error);
      set({ error: error as string, loading: false });
    }
  },

  // SYNC TO SERVER
  syncToServerResults: async () => {
    set({ loading: true, error: null });

    try {
      const unsynced = await window.electronAPI.voteTalliesGetUnsynced();
      if (!unsynced.length) return;

      const payload = unsynced.map((r) => ({ ...r, synced_at: 1 }));

      const { error } = await supabase.from("vote_tallies").upsert(payload);
      if (error) return console.error("❌ Sync results error:", error);

      await window.electronAPI.voteTalliesMarkSynced(unsynced.map((r) => r.id));
    } catch (error: unknown) {
      console.error("Reports Sync for Local to Server error:", error);
      set({ error: error as string, loading: false });
    }
  },

  // SYNC FROM SERVER
  syncFromServerResults: async () => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase.from("vote_tallies").select("*");
      if (error) return;

      await window.electronAPI.voteTalliesBulkUpsert(data);
      await get().loadResults();
    } catch (error: unknown) {
      console.error("Reports Sync for Server to Local error:", error);
      set({ error: error as string, loading: false });
    }
  },

  // FULL SYNC
  fullSyncResults: async () => {
    set({ loading: true, error: null });

    try {
      await get().syncToServerResults();
      await get().syncFromServerResults();
    } catch (error: unknown) {
      console.error("Reports Full Syncing error:", error);
      set({ error: error as string, loading: false });
    }
  },
}));
