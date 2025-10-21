import { create } from "zustand";
import { supabase } from "@renderer/lib/supabaseClient";

interface CandidateResult {
  candidate_id: string;
  candidate_name: string;
  votes_count: number;
  percentage: number;
  candidate_profile: string | null;
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
}

export const useDashboardStore = create<DashboardState>((set) => ({
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
        "election_id, election_title, candidate_id, candidate_name, votes_count, percentage, candidate_profile"
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
}));
