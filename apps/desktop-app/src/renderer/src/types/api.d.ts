// LOGIN
export type LoginResponse = {
  success: boolean;
  token?: string;
  message?: string;
};

// Elections
export type Election = {
  id: string;
  election: string;
  candidates: number;
  duration: string;
  status: "active" | "closed";
};

export type ElectionResponse = {
  success: boolean;
  message?: string;
  data?: Election[];
};

// Exporting the API types
export interface Api {}
