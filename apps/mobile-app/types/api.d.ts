// CANDIDATES
export interface Candidate {
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

// ELECTIONS
export interface Election {
  id: string;
  title: string;
  has_voted: boolean;
  status?: string;
  elections?: any;
  candidates: Candidate[];
}
