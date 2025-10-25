// db/queries/authQueries.ts
// import { getDatabase } from "@/db/client";
import { db } from "../client";
import { adminAuth } from "@/db/schema";
// import { eq } from "drizzle-orm";

// const db = getDatabase();

// Save admin session after login
export async function saveAdminSession({
  id,
  fullname,
  email,
  role,
  access_token,
  refresh_token,
}: {
  id: string;
  fullname: string;
  email: string;
  role: string;
  access_token: string;
  refresh_token: string;
}) {
  const data = {
    id,
    fullname,
    email,
    role,
    access_token,
    refresh_token,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  await db.delete(adminAuth);
  await db.insert(adminAuth).values(data);
}

// Load admin session (if any)
export async function loadAdminSession() {
  const rows = await db.select().from(adminAuth).limit(1);
  return rows[0] || null;
}

// Delete admin session (logout)
export async function clearAdminSession() {
  await db.delete(adminAuth);
}
