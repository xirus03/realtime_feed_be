import fs from "fs";
import path from "path";
import db from "./index.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.resolve(__dirname, "migrations");

console.log("PATH:", MIGRATIONS_DIR);

const runMigrations = async () => {

  console.log("PATH:", MIGRATIONS_DIR);
  console.log("🔍 Checking for pending migrations...");

  const client = await db.connect();

  console.log("🔌 Connecting to database...");
  console.log("trying to establish connection...");

  try {
    console.log("🔌 Database connection established");

    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ Migrations table ready");

    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith(".sql")).sort();

    console.log(`📂 Found ${files.length} migration(s)`);

    if (files.length === 0) {
      console.log("⚠️ No migration files found");
      return;
    }

    for (const file of files) {
      const exists = await client.query(
        "SELECT 1 FROM migrations WHERE name = $1",
        [file]
      );

      if (exists.rowCount > 0) {
        console.log(`⏭ Skipping ${file}`);
        continue;
      }

      console.log(`🚀 Running ${file}`);

      const sqlPath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(sqlPath, "utf-8");

      try {
        await client.query("BEGIN");

        // safer execution: split statements
        const statements = sql
          .split(";")
          .map(s => s.trim())
          .filter(Boolean);

        for (const stmt of statements) {
          await client.query(stmt);
        }

        await client.query(
          "INSERT INTO migrations (name) VALUES ($1)",
          [file]
        );

        await client.query("COMMIT");

        console.log(`✅ Done ${file}`);
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`❌ Failed ${file}:`, err.message);
        throw err;
      }
    }

    console.log("🎉 All migrations completed");
  } catch (err) {
    console.error("💥 Migration runner crashed:", err.message);
    throw err;
  } finally {
    client.release();
    console.log("🔌 Database connection released");
  }
};

export default runMigrations;