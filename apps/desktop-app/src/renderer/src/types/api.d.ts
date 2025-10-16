// ADMINS
export interface Admin {
  id?: string;
  fullname: string;
  email?: string;
  role: string;
  status?: string;
  synced_at?: string;
  deleted_at?: string | null;
  updated_at?: string;
  created_at?: string;
}

// ELECTIONS
export interface Election {
  id?: string;
  election?: string;
  status?: "active" | "closed";
  end_date?: string;
  end_time?: string;
  description?: string;
  max_votes_allowed?: number;
  candidate_count?: number;
  duration?: string;
  synced_at?: string;
  deleted_at?: string | null;
  updated_at?: string;
  created_at?: string;
}

// CANDIDATES
export interface Candidates {
  id: string;
  profile: string | null;
  profile_path?: string | null;
  name: string;
  description?: string;
  election_id?: string;
  election?: {
    id: string;
    election: string;
    status: "active" | "closed";
  } | null;
  synced_at?: string;
  deleted_at?: string | null;
  updated_at?: string;
  created_at?: string;
}

// STUDENTS
export interface Student {
  id: string;
  student_id: string;
  fullname: string;
  email?: string;
  isRegistered: number;
  synced_at?: number;
  deleted_at?: string | null;
  updated_at?: string;
  created_at?: string;
}

// TODO: Add more api types here
// // Students (voters)

// // Settings
// export interface Setting {
//   id: string;
//   key: string;
//   value: string;
//   synced?: boolean;
//   updatedAt?: string;
//   createdAt?: string;
// }
