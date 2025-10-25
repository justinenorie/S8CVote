// CANDIDATES
export interface Candidate {
  candidate_id: string;
  candidate_name: string;
  votes_count: number;
  percentage: number;
  candidate_profile: string | null;
}

// ELECTIONS
export interface Election {
  id: string;
  title: string;
  has_voted: boolean;
  elections?: any;
  candidates: Candidate[];
}
