import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

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

// 🗳️ Elections (for rendering)
export const elections = sqliteTable("elections", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  has_voted: integer("has_voted").notNull().default(0), // boolean (0/1)
  status: text("status").notNull().default("active"),
  synced_at: integer("synced_at").default(0),
});

// 👤 Candidates (for rendering)
export const candidates = sqliteTable("candidates", {
  candidate_id: text("candidate_id").primaryKey(),
  candidate_name: text("candidate_name").notNull(),
  election_id: text("election_id").notNull(),
  votes_count: integer("votes_count").notNull().default(0),
  percentage: real("percentage").notNull().default(0),
  candidate_profile: text("candidate_profile"),
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
  election_id: text("election_id")
    .notNull()
    .references(() => elections.id),
  candidate_id: text("candidate_id")
    .notNull()
    .references(() => candidates.candidate_id),
  student_id: text("student_id").references(() => students.student_id),

  created_at: text("created_at").default(new Date().toISOString()),
  updated_at: text("updated_at"),
  deleted_at: text("deleted_at"),
  synced_at: integer("synced_at").default(0),
});
