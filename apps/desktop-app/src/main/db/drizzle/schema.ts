import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ADMIN AUTH
export const adminAuth = sqliteTable("adminAuth", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  role: text("role"),
  access_token: text("access_token"),
  refresh_token: text("refresh_token"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at"),
  syncedAt: text("synced_at"),
});

// ELECTIONS
export const elections = sqliteTable("elections", {
  id: text("id").primaryKey(),
  election: text("election").notNull(),
  description: text("description"),
  maxVotesAllowed: integer("max_votes_allowed").default(1).notNull(),
  status: text("status").default("active").notNull(),
  endTime: text("end_time"),
  endDate: text("end_date"),

  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at"),
  syncedAt: text("synced_at"),
});
