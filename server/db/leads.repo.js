const { query } = require("./pool");

/**
 * Shape we persist. The route builds this from validate + scoring output.
 * `answers` is the raw transcript; contact fields are also lifted out
 * as columns for the dashboard.
 *
 * NewLead shape (JS doc for reference):
 * {
 *   type: "founder" | "investor",
 *   name: string | null,
 *   email: string | null,
 *   phone: string | null,
 *   linkedin: string | null,
 *   answers: any,           // full transcript (jsonb)
 *   score: number,          // 0-100
 *   bucket: "hot" | "good" | "maybe" | "low",
 *   breakdown: any,         // per-dimension scores (jsonb)
 *   flags: any[],           // jsonb array
 *   aiParams: any | null,   // raw AI params (jsonb) or null on fallback
 *   scoreStatus: "final" | "provisional",
 *   needsAiRescore: boolean,
 * }
 */

/**
 * Insert one scored lead. Persist-once: this is the only write per lead
 * during the chat phase. Returns the new row's id + created_at.
 */
async function insertLead(lead) {
  const rows = await query(
    `INSERT INTO leads
       (type, name, email, phone, linkedin, answers,
        score, bucket, breakdown, flags, ai_params,
        score_status, needs_ai_rescore)
     VALUES
       ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13)
     RETURNING id, created_at`,
    [
      lead.type,
      lead.name,
      lead.email,
      lead.phone,
      lead.linkedin,
      JSON.stringify(lead.answers),
      lead.score,
      lead.bucket,
      JSON.stringify(lead.breakdown),
      JSON.stringify(lead.flags),
      lead.aiParams === null ? null : JSON.stringify(lead.aiParams),
      lead.scoreStatus,
      lead.needsAiRescore,
    ]
  );
  return rows[0];
}

// ---- Dashboard reads (stubs — implemented in the dashboard phase) ----

/**
 * Insert one pending lead before it's scored.
 */
async function insertPendingLead(lead) {
  const rows = await query(
    `INSERT INTO leads
       (type, name, email, phone, linkedin, answers,
        score, bucket, breakdown, score_status, needs_ai_rescore)
     VALUES
       ($1, $2, $3, $4, $5, $6, 0, 'maybe', '{}'::jsonb, 'processing', false)
     RETURNING id, created_at`,
    [
      lead.type,
      lead.name,
      lead.email,
      lead.phone,
      lead.linkedin,
      JSON.stringify(lead.answers),
    ]
  );
  return rows[0];
}

/**
 * Update the score data for an existing lead (called by the async worker).
 */
async function updateLeadScore(id, data) {
  const rows = await query(
    `UPDATE leads
     SET score = $1,
         bucket = $2,
         breakdown = $3,
         flags = $4,
         ai_params = $5,
         score_status = $6,
         needs_ai_rescore = $7,
         name = COALESCE($8, name),
         email = COALESCE($9, email),
         phone = COALESCE($10, phone),
         linkedin = COALESCE($11, linkedin)
     WHERE id = $12
     RETURNING *`,
    [
      data.score,
      data.bucket,
      JSON.stringify(data.breakdown),
      JSON.stringify(data.flags),
      data.aiParams === null ? null : JSON.stringify(data.aiParams),
      data.scoreStatus,
      data.needsAiRescore,
      data.name || null,
      data.email || null,
      data.phone || null,
      data.linkedin || null,
      id,
    ]
  );
  return rows[0];
}

/** List leads with optional filters, newest first. (Dashboard phase.) */
async function listLeads(filters = {}) {
  const where = [];
  const params = [];

  if (filters.type) {
    params.push(filters.type);
    where.push(`type = $${params.length}`);
  }
  if (filters.bucket) {
    params.push(filters.bucket);
    where.push(`bucket = $${params.length}`);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const limit = filters.limit ?? 50;
  const offset = filters.offset ?? 0;
  params.push(limit, offset);

  return query(
    `SELECT * FROM leads
     ${whereSql}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
}

/** Fetch one lead by id. (Dashboard phase.) */
async function getLeadById(id) {
  const rows = await query(`SELECT * FROM leads WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

/** Get dashboard stats. */
async function getStats() {
  const [totalRes, bucketRes, typeRes, flagRes] = await Promise.all([
    query(`SELECT COUNT(*) as count FROM leads`),
    query(`SELECT bucket, COUNT(*) as count FROM leads GROUP BY bucket`),
    query(`SELECT type, COUNT(*) as count FROM leads GROUP BY type`),
    query(`SELECT COUNT(*) as count FROM leads WHERE score_status = 'provisional' OR jsonb_array_length(flags) > 0`)
  ]);

  const buckets = bucketRes.rows.reduce((acc, row) => ({ ...acc, [row.bucket]: parseInt(row.count, 10) }), {});
  const types = typeRes.rows.reduce((acc, row) => ({ ...acc, [row.type]: parseInt(row.count, 10) }), {});

  return {
    total: parseInt(totalRes.rows[0].count, 10),
    buckets,
    types,
    needsReview: parseInt(flagRes.rows[0].count, 10)
  };
}

/** Update a lead (status, flags, bucket) manually by the team. */
async function updateLead(id, data) {
  const sets = [];
  const params = [];
  let paramIdx = 1;

  for (const [key, val] of Object.entries(data)) {
    sets.push(`${key} = $${paramIdx}`);
    params.push(val);
    paramIdx++;
  }

  if (sets.length === 0) return null;

  params.push(id);
  const rows = await query(
    `UPDATE leads SET ${sets.join(", ")} WHERE id = $${paramIdx} RETURNING *`,
    params
  );
  return rows[0];
}

async function deleteLead(id) {
  await query(`DELETE FROM leads WHERE id = $1`, [id]);
}

module.exports = { 
  insertLead, 
  insertPendingLead, 
  updateLeadScore, 
  listLeads, 
  getLeadById,
  getStats,
  updateLead,
  deleteLead
};

async function getProvisionalLeads() {
  const { query } = require("./pool");
  const rows = await query(`SELECT * FROM leads WHERE score_status = 'provisional'`);
  return rows;
}

module.exports.getProvisionalLeads = getProvisionalLeads;
