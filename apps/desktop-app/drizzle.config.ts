import type { Config } from "drizzle-kit";

export default {
  schema: "./src/main/db/drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "./drizzle/s8cvote.db",
  },
} satisfies Config;
