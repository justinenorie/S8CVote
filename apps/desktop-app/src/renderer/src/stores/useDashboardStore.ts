import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient";

interface CandidateResult {
  candidate_id: string;
  candidate_name: string;
  votes_count: number;
  percentage: number;
  candidate_profile: string | null;
  partylist_id: string | null;
  partylist_name: string | null;
  partylist_acronym: string | null;
  partylist_color: string | null;
}

interface Election {
  id: string;
  title: string;
  candidates: CandidateResult[];
}

type VoteResult<T = void> =
  | { data: null; error: string }
  | { data: T; error: null }
  | { data: null; error: null };

interface DashboardState {
  elections: Election[];
  loading: boolean;
  error: string | null;

  loadElections: () => Promise<VoteResult<Election[]>>;
  subscribeToVotes: () => void;
  unsubscribeFromVotes: () => void;
}

let votesChannel: ReturnType<typeof supabase.channel> | null = null;

export const useDashboardStore = create<DashboardState>((set, get) => ({
  elections: [],
  loading: false,
  error: null,

  loadElections: async () => {
    set({ loading: true, error: null });

    // 1) list active elections (+ has_voted) from the view
    const { data: electionsRaw, error: e1 } = await supabase
      .from("elections_with_user_flag")
      .select("id, election, status")
      .eq("status", "active")
      .order("created_at", { ascending: true });

    if (e1 || !electionsRaw) {
      set({ loading: false, error: e1?.message || "Failed to load elections" });
      return { data: null, error: e1?.message || "Failed to load elections" };
    }

    if (electionsRaw.length === 0) {
      set({ elections: [], loading: false });
      return { data: [], error: null };
    }

    const ids = electionsRaw.map((e) => e.id);

    const { data: electionRender, error: errFetch } = await supabase
      .from("election_results_with_percent")
      .select(
        "election_id, election_title, candidate_id, candidate_name, votes_count, percentage, candidate_profile, partylist_id, partylist_name, partylist_acronym, partylist_color"
      )
      .in("election_id", ids);

    if (errFetch) {
      set({
        loading: false,
        error: errFetch?.message || "Failed to load results",
      });
      return {
        data: null,
        error: errFetch?.message || "Failed to load results",
      };
    }

    const byElection: Record<string, CandidateResult[]> = {};
    for (const row of electionRender) {
      const arr = byElection[row.election_id] || [];
      arr.push({
        candidate_id: row.candidate_id,
        candidate_name: row.candidate_name,
        votes_count: row.votes_count,
        percentage: Number(row.percentage),
        candidate_profile: row.candidate_profile || null,
        partylist_id: row.partylist_id || null,
        partylist_name: row.partylist_name || null,
        partylist_acronym: row.partylist_acronym || null,
        partylist_color: row.partylist_color || null,
      });
      byElection[row.election_id] = arr;
    }

    const elections: Election[] = electionsRaw.map((e) => ({
      id: e.id,
      title: e.election,
      candidates: (byElection[e.id] || []).sort(
        (a, b) => b.votes_count - a.votes_count
      ),
    }));

    set({ elections, loading: false, error: null });
    return { data: elections, error: null };
  },

  // REAL-TIME VOTE COUNTING
  subscribeToVotes: () => {
    if (votesChannel) {
      console.log("🔁 Realtime votes already active");
      return votesChannel;
    }

    console.log("📡 Subscribing to realtime votes...");

    votesChannel = supabase
      .channel("votes-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "votes" },
        async () => {
          console.log("🔃 Vote detected → refreshing UI");
          await get().loadElections();
        }
      )
      .subscribe();

    return votesChannel;
  },

  unsubscribeFromVotes: () => {
    if (votesChannel) {
      console.log("🔌 Unsubscribing realtime votes...");
      supabase.removeChannel(votesChannel);
      votesChannel = null;
    }
  },
}));
