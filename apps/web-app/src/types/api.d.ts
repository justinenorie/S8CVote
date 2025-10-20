// Students Credentials
export interface StudentCredentials {
  id: string;
  student_id?: string;
  fullname: string;
  email?: string;
  role: string;
  isRegistered?: number;
  synced_at?: string;
  deleted_at?: string | null;
  updated_at?: string;
  created_at?: string;
}

export interface CandidateResult {
  candidate_id: string;
  candidate_name: string;
  votes_count: number;
  percentage: number;
  candidate_profile: string | null;
}

export interface Election {
  id: string;
  title: string;
  has_voted: boolean;
  candidates: CandidateResult[];
}

export interface Profile {
  fullname: string;
  student_id: string;
  role: string;
}
