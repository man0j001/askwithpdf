import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import { config } from "dotenv";

neonConfig.fetchConnectionCache = true

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);