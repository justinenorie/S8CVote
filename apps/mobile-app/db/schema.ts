import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Save ADMIN AUTH Table
export const adminAuth = sqliteTable("adminAuth", {
  id: text("id").primaryKey(),
  fullname: text("fullname"),
  email: text("email").notNull(),
  role: text("role"),
  access_token: text("access_token"),
  refresh_token: text("refresh_token"),

  created_at: text("created_at").default(new Date().toISOString()),
  updated_at: text("updated_at"),
  deleted_at: text("deleted_at"),
  synced_at: text("synced_at"),
});

// Elections Table
export const elections = sqliteTable("elections", {
  id: text("id").primaryKey(),
  election: text("election").notNull(),
  description: text("description"),
  max_votes_allowed: integer("max_votes_allowed").notNull().default(1),
  status: text("status").notNull().default("active"),
  end_time: text("end_time"),
  end_date: text("end_date"),

  created_at: text("created_at").default(new Date().toISOString()),
  updated_at: text("updated_at"),
  deleted_at: text("deleted_at"),
  synced_at: integer("synced_at"),
});

// Candidates Table
export const candidates = sqliteTable("candidates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  election_id: text("election_id")
    .notNull()
    .references(() => elections.id, { onDelete: "cascade" }),
  profile: text("profile"),
  profile_path: text("profile_path"),

  created_at: text("created_at").default(new Date().toISOString()),
  updated_at: text("updated_at"),
  deleted_at: text("deleted_at"),
  synced_at: integer("synced_at").default(0),
});

// Students Table
export const students = sqliteTable("students", {
  id: text("id").primaryKey(),
  student_id: text("student_id").unique().notNull(),
  fullname: text("fullname").notNull(),
  email: text("email"),
  isRegistered: integer("isRegistered").default(0),

  created_at: text("created_at").default(new Date().toISOString()),
  updated_at: text("updated_at"),
  deleted_at: text("deleted_at"),
  synced_at: integer("synced_at").default(0),
});

// Votes Table
export const votes = sqliteTable("votes", {
  id: text("id").primaryKey(),
  timestamp: integer("timestamp"), // epoch ms
  electionId: text("election_id")
    .notNull()
    .references(() => elections.id),
  candidateId: text("candidate_id")
    .notNull()
    .references(() => candidates.id),
  studentId: text("student_id").references(() => students.student_id),
  created_at: integer("created_at"),
  updated_at: integer("updated_at"),
  deleted_at: integer("deleted_at"),
  synced_at: integer("synced_at"),
});
