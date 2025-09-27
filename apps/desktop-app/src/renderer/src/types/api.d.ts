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
  profile: string;
  name: string;
  description?: string;
  election_id?: string;
  election?: Pick<Election, "id" | "election" | "status">;
}

// TODO: Add more api types here
