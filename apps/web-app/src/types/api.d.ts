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
