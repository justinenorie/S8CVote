// Elections
export interface Election {
  id: string;
  election: string;
  status: "active" | "closed";
  end_date?: string;
  end_time?: string;
  description?: string;
  candidates?: number;
  duration?: string;
}

export interface Candidates {
  id: string;
  profile: string | null;
  profile_path?: string | null;
  name: string;
  description?: string;
  election_id?: string;
  election: {
    id: string;
    election: string;
    status: "active" | "closed";
  } | null;
}

// TODO: Add more api types here
