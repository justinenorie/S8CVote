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
  profile: string;
  name: string;
  election: string;
  description?: string;
}

// TODO: Add more api types here
