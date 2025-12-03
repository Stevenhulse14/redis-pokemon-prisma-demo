// Script to create moves tables
import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

const databaseUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ Error: POSTGRES_PRISMA_URL or DATABASE_URL environment variable is not set");
  process.exit(1);
}

const url = new URL(databaseUrl);
const isSupabase = url.hostname.includes("supabase") || url.hostname.includes("pooler");

const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port) || 5432,
  database: url.pathname.slice(1),
  user: url.username,
  password: url.password,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
});

async function main() {
  console.log("📦 Creating moves tables...");

  try {
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, "004-create-moves-tables.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");

    // Execute the SQL
    await pool.query(sql);

    console.log("✅ Moves tables created successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });

