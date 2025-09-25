// LOGIN
export type LoginResponse = {
  success: boolean;
  token?: string;
  message?: string;
};

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

export type ElectionResponse = {
  success: boolean;
  message?: string;
  data?: Election[];
};
