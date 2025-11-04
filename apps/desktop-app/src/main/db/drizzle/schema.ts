import { sqliteTable, text, integer, numeric } from "drizzle-orm/sqlite-core";

// ADMIN AUTH
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

// ELECTIONS
export const elections = sqliteTable("elections", {
  id: text("id").primaryKey(),
  election: text("election").notNull(),
  description: text("description"),
  max_votes_allowed: integer("max_votes_allowed").default(1).notNull(),
  status: text("status").default("active").notNull(),
  end_time: text("end_time"),
  end_date: text("end_date"),
  position_order: integer("position_order").default(99),

  created_at: text("created_at").default(new Date().toISOString()),
  updated_at: text("updated_at"),
  deleted_at: text("deleted_at"),
  synced_at: integer("synced_at").default(0),
});

// CANDIDATES
export const candidates = sqliteTable("candidates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  profile: text("profile"),
  profile_path: text("profile_path"),
  election_id: text("election_id")
    .notNull()
    .references(() => elections.id, { onDelete: "cascade" }),
  partylist_id: text("partylist_id").references(() => partylist.id, {
    onDelete: "set null",
  }),

  created_at: text("created_at").default(new Date().toISOString()),
  updated_at: text("updated_at"),
  deleted_at: text("deleted_at"),
  synced_at: integer("synced_at").default(0),
});

// STUDENT DATA
export const students = sqliteTable("students", {
  id: text("id").primaryKey(),
  student_id: text("student_id").notNull().unique(),
  fullname: text("fullname").notNull(),
  email: text("email"),
  isRegistered: integer("isRegistered").default(0),

  created_at: text("created_at").default(new Date().toISOString()),
  updated_at: text("updated_at"),
  deleted_at: text("deleted_at"),
  synced_at: integer("synced_at").default(0),
});

// Votes
export const candidateTallies = sqliteTable("candidate_tallies", {
  election_id: text("election_id"),
  candidate_id: text("candidate_id"),
  votes_count: integer("votes_count").notNull(),
  percentage: numeric("percentage").notNull(),
  updated_at: text("updated_at"),
});

// PARTY LIST
export const partylist = sqliteTable("partylist", {
  id: text("id").primaryKey(),
  partylist: text("partylist").notNull(),
  acronym: text("acronym").notNull(),
  color: text("color").notNull(),
  logo: text("logo"),
  logo_path: text("logo_path"),

  created_at: text("created_at").default(new Date().toISOString()),
  updated_at: text("updated_at"),
  deleted_at: text("deleted_at"),
  synced_at: integer("synced_at").default(0),
});

// VOTE TALLIES
export const voteTallies = sqliteTable("voteTallies", {
  id: text("id").primaryKey(),

  election_id: text("election_id"),
  election_name: text("election_name").notNull(),

  candidate_id: text("candidate_id"),
  candidate_name: text("candidate_name").notNull(),

  partylist_id: text("partylist_id"),
  partylist_name: text("partylist_name"),

  partylist_acronym: text("partylist_acronym"),
  partylist_color: text("partylist_color"),

  candidate_profile: text("candidate_profile"),

  votes_count: integer("votes_count").notNull(),
  percentage: numeric("percentage").notNull(),
  total_votes: integer("total_votes").notNull(),

  created_at: text("created_at").default(new Date().toISOString()),
  updated_at: text("updated_at"),
  deleted_at: text("deleted_at"),
  synced_at: integer("synced_at").default(0),
});
