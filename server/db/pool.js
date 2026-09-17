const { Pool } = require("pg");
const { env } = require("../src/env");

/**
 * Single shared Postgres connection pool.
 *
 * Supabase provides DATABASE_URL (pooler endpoint). We use a pool (not single
 * clients) so the stateless backend can handle concurrent /submit requests
 * cleanly at scale.
 *
 * Import `pool` anywhere you need to query. Do NOT create new Pools elsewhere.
 */
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // Supabase is always remote, so always TLS — not just in production.
  ssl: { rejectUnauthorized: false },
  max: 10, // plenty for 500 req/day; tune later if needed
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

// Surface pool-level errors instead of crashing silently.
pool.on("error", (err) => {
  console.error("[db] unexpected idle client error", err);
});

/**
 * Thin query helper so call sites don't each grab/release clients.
 * Use this for one-off queries. For transactions, grab a client manually.
 */
async function query(text, params) {
  const res = await pool.query(text, params);
  return res.rows;
}

/** Health check — used by GET /api/health and on boot. */
async function pingDb() {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch (err) {
    console.error("[db] ping failed", err);
    return false;
  }
}

module.exports = { pool, query, pingDb };
