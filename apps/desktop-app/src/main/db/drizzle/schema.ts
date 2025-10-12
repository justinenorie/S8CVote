import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ADMIN AUTH
export const adminAuth = sqliteTable("adminAuth", {
  id: text("id").primaryKey(),
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

  created_at: text("created_at").default(new Date().toISOString()),
  updated_at: text("updated_at"),
  deleted_at: text("deleted_at"),
  synced_at: text("synced_at"),
});
