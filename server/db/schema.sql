-- Trinity schema — single leads table (chat phase).
-- Dashboard later only READS this; no new tables needed.

-- Enable UUID generation (pgcrypto ships with Railway Postgres).
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admins (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email              TEXT UNIQUE NOT NULL,
  password_hash      TEXT NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- which flow the lead went through
  type               TEXT NOT NULL CHECK (type IN ('founder', 'investor')),

  -- contact fields pulled out as first-class columns (dashboard display/sort/filter)
  name               TEXT,
  email              TEXT,
  phone              TEXT,
  linkedin           TEXT,

  -- raw transcript: all 12 turns of answers as captured
  answers            JSONB NOT NULL,

  -- scoring output
  score              INT  NOT NULL CHECK (score >= 0 AND score <= 100),
  bucket             TEXT NOT NULL CHECK (bucket IN ('hot', 'good', 'maybe', 'low')),
  breakdown          JSONB NOT NULL,          -- per-dimension scores (auditable)
  flags              JSONB NOT NULL DEFAULT '[]'::jsonb,  -- mismatch/junk/etc.

  -- the raw AI parameters used (debugging, demo, future rescore)
  ai_params          JSONB,

  -- resilience / Gap 4 (background rescore deferred, schema ready now)
  score_status       TEXT NOT NULL DEFAULT 'final'
                       CHECK (score_status IN ('final', 'provisional', 'processing')),
  needs_ai_rescore   BOOLEAN NOT NULL DEFAULT FALSE,

  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for the dashboard's common queries (filter by bucket/type, newest first).
CREATE INDEX IF NOT EXISTS idx_leads_bucket      ON leads (bucket);
CREATE INDEX IF NOT EXISTS idx_leads_type        ON leads (type);
CREATE INDEX IF NOT EXISTS idx_leads_created_at  ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status      ON leads (score_status);