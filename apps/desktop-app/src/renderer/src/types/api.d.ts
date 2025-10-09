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
  synced?: boolean;
  deletedAt?: string | null;
  updatedAt?: string;
  createdAt?: string;
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
  synced?: boolean;
  deletedAt?: string | null;
  updatedAt?: string;
  createdAt?: string;
}

export interface Student {
  id?: string;
  fullname: string;
  student_id: string;
  email?: string;
  isRegistered: boolean;
  synced?: boolean;
  deletedAt?: string | null;
  updatedAt?: string;
  createdAt?: string;
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
