import { defineConfig } from 'drizzle-kit'
import { config } from "dotenv";

config({ path: ".env" });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEONDB_URL || 'default string',
  },
  verbose: true,
  strict: true,
})