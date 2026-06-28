const { readFileSync } = require("fs");
const { join } = require("path");
const { pool, pingDb } = require("./pool");

/**
 * Applies schema.sql. Idempotent (everything uses IF NOT EXISTS),
 * so it's safe to run repeatedly.
 *
 * Run with:  node db/migrate.js
 */
async function migrate() {
  const ok = await pingDb();
  if (!ok) {
    console.error("[migrate] cannot reach database — check DATABASE_URL");
    process.exit(1);
  }

  const schemaPath = join(__dirname, "schema.sql");
  const sql = readFileSync(schemaPath, "utf-8");

  try {
    await pool.query(sql);
    console.log("[migrate] schema applied successfully");
  } catch (err) {
    console.error("[migrate] failed", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
