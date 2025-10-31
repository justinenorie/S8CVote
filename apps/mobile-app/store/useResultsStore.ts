import { create } from "zustand";
import { syncVoteResults } from "@/db/queries/syncQuery";
import { getLocalResults } from "@/db/queries/resultQuery";
import { isOnline } from "@/utils/network";

interface CandidateRow {
  id: string;
  election_id: string | null;
  election_name: string;
  candidate_id: string | null;
  candidate_name: string;
  partylist_id: string | null;
  partylist_name: string | null;
  partylist_acronym: string | null;
  partylist_color: string | null;
  candidate_profile: string | null;
  votes_count: number;
  percentage: string;
  total_votes: number;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  synced_at?: number | null;
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

    const local = await getLocalResults();
    set({ results: groupResults(local), loading: false });

    //If online → sync → fetch again
    if (await isOnline()) {
      await syncVoteResults();
      const fresh = await getLocalResults();
      set({ results: groupResults(fresh) });
    }
  },
}));

// For grouping the results into year then months
function groupResults(rows: CandidateRow[]): YearGroup[] {
  const grouped: Record<number, YearGroup> = {};

  rows.forEach((row) => {
    const date = new Date(row.created_at ?? "");
    const year = date.getFullYear();
    const monthLabel =
      date.toLocaleString("en-US", { month: "long" }) + " " + year;

    // Ensure year exists
    if (!grouped[year]) grouped[year] = { year, months: [] };

    // Ensure month exists
    let month = grouped[year].months.find((m) => m.date === monthLabel);
    if (!month) {
      month = { date: monthLabel, elections: [] };
      grouped[year].months.push(month);
    }

    // Ensure election exists
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

    // Push candidate
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

  // Convert to array
  return Object.values(grouped);
}
