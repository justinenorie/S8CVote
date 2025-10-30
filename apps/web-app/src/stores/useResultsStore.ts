import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";

interface CandidateRow {
  id: string;
  election_id: string | null;
  election_name: string;
  candidate_id: string | null;
  candidate_name: string;
  votes_count: number;
  percentage: number;
  total_votes: number;
  candidate_profile: string | null;
  partylist_name: string | null;
  partylist_acronym: string | null;
  partylist_color: string | null;
  created_at: string;
}

interface Candidate {
  id: string | null;
  name: string;
  votes: number;
  percentage: number;
  image: string | null;
  partylist: string | null;
  acronym: string | null;
  color: string | null;
}

interface Election {
  id: string | null;
  election: string;
  total_votes: number;
  candidates: Candidate[];
}

interface MonthGroup {
  date: string;
  elections: Election[];
}

interface YearGroup {
  year: number;
  months: MonthGroup[];
}

interface ResultsStore {
  results: YearGroup[];
  loading: boolean;
  error: string | null;

  loadResults: () => Promise<void>;
}

export const useResultsStore = create<ResultsStore>((set) => ({
  results: [],
  loading: false,
  error: null,

  loadResults: async () => {
    set({ loading: true, error: null });

    const { data, error } = await supabase
      .from("vote_tallies")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data) {
      set({ loading: false, error: error?.message ?? "Failed to load." });
      return;
    }

    const grouped: Record<number, YearGroup> = {};

    data.forEach((row: CandidateRow) => {
      const date = new Date(row.created_at);
      const year = date.getFullYear();
      const monthLabel =
        date.toLocaleString("en-US", { month: "long" }) + " " + year;

      if (!grouped[year]) grouped[year] = { year, months: [] };

      let month = grouped[year].months.find((m) => m.date === monthLabel);
      if (!month) {
        month = { date: monthLabel, elections: [] };
        grouped[year].months.push(month);
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
        votes: row.votes_count,
        percentage: Number(row.percentage),
        image: row.candidate_profile,
        partylist: row.partylist_name,
        acronym: row.partylist_acronym,
        color: row.partylist_color,
      });
    });

    set({ results: Object.values(grouped), loading: false });
  },
}));
