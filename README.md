# Trinity

Lead intake and scoring system for Venturizer — a chat-based pipeline that qualifies founders and investors through a 12-turn conversation and produces a 0–100 score with dimension-level breakdown.

## What it does

Trinity replaces a static intake form with a branching conversation flow. Founders and investors answer 12 questions covering context which used to require 16-20 questions; the system validates their answers, sends the full transcript to an AI (Groq / Llama 3.3) for per-dimension signal extraction, then runs those signals through a deterministic scoring engine to produce a score, a bucket (hot / good / maybe / low), and a breakdown per dimension. Results land in a protected dashboard where the Venturizer team can review, filter, rescore, and flag leads.

## Features

- Two 12-turn chat flows: founder flow and investor flow, each with branching follow-up questions driven by selection turns
- Two chat entry points: a full-page chat at `/chat` and a floating bubble widget embedded on the landing page
- Server-side validation: format checks (email, phone, URL) and a junk/gibberish pre-filter that never blocks real answers containing noise words
- Deterministic scoring: every score is computed by `hardScores.js` using band/ladder logic, independent of AI availability
- AI enhancement via Groq (Llama 3.3-70b): produces per-dimension quality signals (specificity, quantification, evidence strength, contradiction detection)
- Graceful AI fallback: when Groq is unavailable, `textAnalyze.js` runs deterministic text analysis (keyword detection, entity detection, quantification) and marks the lead provisional
- Auto-rescore: provisional leads are retried after 30 seconds; a background job also sweeps provisional leads every 15 minutes
- Protected admin dashboard: JWT cookie auth, stats overview, lead list with filter by type/bucket, lead detail view with full transcript and score breakdown
- Manual rescore trigger: dashboard button kicks off a fresh AI scoring pass for any lead
- Human verification: mismatch-flagged leads show a "Mark Verified" button that stamps a `human_verified` flag, clearing the alert
- Self-ping keep-alive: server pings its own `/api/health` every 10 minutes to prevent sleep on hosted platforms
- Landing page: sections explaining how the scoring works, what Venturizer looks for in founders and investors, and the resilience model — no login required

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Node.js ≥20, Express 5 |
| Database | PostgreSQL (Railway) via `pg` |
| AI | Groq API — Llama 3.3-70b-versatile |
| Auth | JWT (jsonwebtoken) + bcrypt + httpOnly cookies |
| Background jobs | In-process worker (`queue.js`) with `setTimeout`; BullMQ + ioredis present as dependencies but not active |
| Frontend | React 19, Vite 8, Tailwind CSS v4, Framer Motion |
| UI components | Radix UI, shadcn, lucide-react |
| Deploy | Vercel (frontend) + Railway (backend + Postgres) |

## Project structure

```
Trinity/
├── client/                         React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx                 Routes: landing /, chat /chat, login, /overview, /dashboard
│   │   ├── AuthContext.jsx         JWT auth context (checks /api/auth/me on load)
│   │   ├── config.js               API_URL — reads VITE_API_URL, falls back to localhost:4000
│   │   ├── constants.js            Shared constants (bucket colour map, etc.)
│   │   ├── chat/
│   │   │   ├── ChatPage.jsx        Full-page chat (type selector → ChatWidget in full mode)
│   │   │   ├── ChatWidget.jsx      Core chat UI — two modes: full and bubble
│   │   │   ├── FloatingBubble.jsx  Floating launcher on the landing page (bubble mode)
│   │   │   ├── flowEngine.js       Client-side flow helpers: getFlow, resolvePrompt, getAcknowledgement
│   │   │   ├── founderFlow.js      Client-side copy of founder flow definition
│   │   │   ├── investorFlow.js     Client-side copy of investor flow definition
│   │   │   ├── MessageBubble.jsx   Individual chat message
│   │   │   ├── OptionPills.jsx     Selection-turn pill buttons
│   │   │   ├── ProgressBar.jsx     Turn progress bar
│   │   │   ├── ResultCard.jsx      Post-submit confirmation card
│   │   │   ├── ChatInput.jsx       Free-text input field
│   │   │   └── TypingDots.jsx      Animated typing indicator
│   │   ├── dashboard/
│   │   │   ├── Login.jsx           Admin login form
│   │   │   ├── DashboardLayout.jsx Shared sidebar + nav shell
│   │   │   ├── Overview.jsx        /overview — stat cards, bucket bar, pipeline health, hot leads, needs-attention
│   │   │   ├── LeadsList.jsx       /dashboard — paginated lead table with type/bucket filters
│   │   │   ├── LeadsTable.jsx      Table component used by LeadsList
│   │   │   ├── FilterBar.jsx       Filter controls (type, bucket)
│   │   │   ├── LeadDetail.jsx      /dashboard/:id — transcript + score + actions (rescore, delete, mark verified)
│   │   │   ├── ScoreBlock.jsx      Score circle + bucket badge
│   │   │   ├── ScoreBreakdown.jsx  Per-dimension bar chart
│   │   │   ├── Transcript.jsx      Rendered Q&A transcript
│   │   │   ├── StatusBadge.jsx     Provisional / processing / final badge
│   │   │   └── StatsRow.jsx        Compact stat row component
│   │   └── components/             Landing page sections
│   │       ├── Navbar.jsx
│   │       ├── Hero.jsx
│   │       ├── HowItWorks.jsx
│   │       ├── ScoringExplainer.jsx
│   │       ├── AudienceSplit.jsx
│   │       ├── Resilience.jsx
│   │       ├── FinalCTA.jsx
│   │       ├── Footer.jsx
│   │       └── Aurora.jsx          Background effect
│   └── vite.config.js
│
└── server/                         Express API
    ├── src/
    │   ├── index.js                Server entry — mounts routes, starts server, background jobs
    │   ├── env.js                  Env validation (fail-fast on missing required vars)
    │   └── requireAuth.js          JWT cookie middleware for protected routes
    ├── flow/
    │   ├── founder.js              Founder flow definition (12 turns, branching)
    │   ├── investor.js             Investor flow definition (12 turns, branching)
    │   └── flow.js                 Helpers: getFlow, resolveBranchPrompt, getDimensions, getAllFields
    ├── routes/
    │   ├── submit.js               POST /api/submit — validate, insert pending, kick off scoring
    │   ├── leads.js                GET/PATCH/DELETE /api/leads — dashboard reads (auth required)
    │   ├── flow.js                 GET /api/flow/:type — serves flow definition to frontend
    │   └── auth.js                 POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout
    ├── db/
    │   ├── schema.sql              leads + admins tables, four indexes
    │   ├── migrate.js              Migration runner (applies schema.sql idempotently)
    │   ├── leads.repo.js           All DB queries: insert, list, get, update, delete, rescore
    │   ├── seedAdmin.js            Creates default admin account (team@venturizer.com)
    │   └── pool.js                 pg connection pool (SSL auto-enabled in production)
    ├── validate.js                 Transcript validation: format checks + junk/gibberish filter
    ├── hardScores.js               Deterministic scoring engine: bands, ladders, contradiction logic
    ├── groc.js                     Groq AI layer: prompt construction, retry, safe parse
    ├── textAnalyze.js              Deterministic fallback: keyword/entity/quantification analysis
    ├── queue.js                    In-process lead scoring worker
    └── .env.example
```

## Getting started

### Prerequisites

- Node.js ≥ 20
- PostgreSQL database (Railway recommended)
- Groq API key — [console.groq.com](https://console.groq.com)
- Redis (optional — present in deps but not required for the in-process worker)

### Installation

```bash
# Backend
cd server
npm install
cp .env.example .env
# Fill in DATABASE_URL, GROQ_API_KEY, JWT_SECRET

# Frontend
cd ../client
npm install
```

### Database setup

```bash
cd server
npm run migrate
```

This applies `db/schema.sql` against `DATABASE_URL`. The script is idempotent — safe to run multiple times. It creates the `leads` table, `admins` table, and four indexes (bucket, type, created\_at, score\_status).

### Create the admin account

```bash
cd server
node db/seedAdmin.js
```

This seeds the default admin credentials:

| Field | Value |
|---|---|
| Email | `team@venturizer.com` |
| Password | `reviewer123` |

Change the password after first login, or edit `seedAdmin.js` before running it. The script is safe to run multiple times — it upserts on email conflict.

### Run locally

```bash
# Backend (port 5001 by default, or PORT in .env)
cd server
npm run dev

# Frontend (port 5173 by default)
cd client
npm run dev
```

> **Note:** `client/src/config.js` defaults `VITE_API_URL` to `http://localhost:4000`. If the backend is running on a different port, set `VITE_API_URL` in `client/.env` to match.

### Run the test suite

```bash
cd server
npm test
```

56 plain-Node tests, no framework needed. Covers:

- `positionInBand` — floor, mid-cap (no quantification), ceiling (with quantification)
- `pickLadderIdx` — weak/mid/strong evidence picks correct ladder rung
- `bucketFor` — all four bucket thresholds (0, 39/40, 59/60, 79/80, 100)
- `scoreTranscript` (founder) — hot/low end-to-end, all 6 dimensions present and in range, selection ordering, Gap 1 contradiction (drops score + mismatch flag), Gap 2 junk (floors dimension + junk flag)
- `scoreTranscript` (investor) — hot end-to-end, selection ordering, all 6 dimensions, unknown type throws
- `isJunk` — blocklist words, gibberish/keyboard-mash, real answers containing noise words pass
- `validateField` — required/optional/email/number validators, junk vs hard error distinction
- `validateTranscript` — valid founder + investor transcripts, unknown type, bad selection, junk field handling

Exit 0 = all pass. Exit 1 = failures (listed with names and messages).

### Pipeline smoke test (requires DB)

```bash
cd server
node test.js --no-db           # full pipeline with deterministic fallback, skips DB
node test.js --live-ai --no-db # calls Groq API, skips DB
node test.js --live-ai         # full pipeline including DB insert
```

Exercises every stage end-to-end: flow → validate → AI params (or fallback) → score → persist → response shape, and prints each stage's output.

## API reference

### POST /api/submit

Accepts a completed transcript. Validates it, inserts a pending lead with `score_status: processing`, kicks off background scoring, and returns immediately with the new lead's ID.

**Request body:**

```json
{
  "type": "founder",
  "answers": [
    {
      "questionId": "intro",
      "values": { "name": "Alice", "one_liner": "..." }
    },
    {
      "questionId": "mvp_stage",
      "selection": "revenue",
      "values": { "mvp_stage": "revenue" }
    }
  ]
}
```

**Response (202):**

```json
{ "message": "submitted", "id": "uuid" }
```

**Error cases:**
- `400` — missing `type` or `answers`, unknown flow type, or hard validation failure (invalid selection, bad format)
- `500` — database insert failed

---

### GET /api/leads

Returns a paginated list of leads. Requires auth cookie.

**Query params:**

| Param | Type | Description |
|---|---|---|
| `type` | `founder` \| `investor` | Filter by lead type |
| `bucket` | `hot` \| `good` \| `maybe` \| `low` | Filter by score bucket |
| `limit` | number | Max rows (default 50) |
| `offset` | number | Pagination offset (default 0) |

**Response:**

```json
{ "leads": [ { ...lead row } ] }
```

---

### GET /api/leads/stats

Returns aggregate counts for the dashboard overview. Requires auth.

```json
{
  "total": 142,
  "buckets": { "hot": 12, "good": 34, "maybe": 61, "low": 35 },
  "types": { "founder": 98, "investor": 44 },
  "needsReview": 7
}
```

`needsReview` is the count of leads that are provisional or have at least one flag.

---

### GET /api/leads/:id

Returns a single lead by UUID. Requires auth.

**Response:**

```json
{
  "lead": {
    "id": "...",
    "type": "founder",
    "name": "...",
    "email": "...",
    "phone": "...",
    "linkedin": "...",
    "score": 81,
    "bucket": "hot",
    "breakdown": [...],
    "flags": [...],
    "answers": [...],
    "ai_params": {...},
    "score_status": "final",
    "needs_ai_rescore": false,
    "created_at": "..."
  }
}
```

Returns `404` if the lead does not exist.

---

### PATCH /api/leads/:id

Manually update a lead's `bucket` or `flags`. Used by the dashboard to set `human_verified` or override bucket. Requires auth.

```json
{ "bucket": "good" }
```

```json
{ "flags": [{ "type": "human_verified" }] }
```

---

### POST /api/leads/:id/rescore

Triggers a fresh AI scoring pass for a lead. Sets `score_status` to `processing` immediately; the worker updates it asynchronously. Used by the "Re-score with AI" button in the dashboard.

---

### DELETE /api/leads/:id

Permanently deletes a lead. Requires auth. The dashboard shows a confirmation prompt before calling this.

---

### GET /api/flow/:type

Returns the full flow definition (questions, options, branch maps) for `founder` or `investor`. The chat widget fetches this on session start so the server is the single source of truth for question text and branching logic.

```json
{ "flow": { "type": "founder", "questions": [...] } }
```

Returns `404` for unknown flow types.

---

### POST /api/auth/login

```json
{ "email": "team@venturizer.com", "password": "reviewer123" }
```

Sets an httpOnly JWT cookie (`token`, 7-day expiry) on success. Returns `{ "user": { "email": "..." } }`. Returns `401` for wrong credentials.

---

### GET /api/auth/me

Returns the currently logged-in admin from the cookie. Used by `AuthContext` to restore session on page load.

---

### POST /api/auth/logout

Clears the `token` cookie. Returns `{ "ok": true }`.

---

### GET /api/health

```json
{ "ok": true, "db": "up" }
```

Returns `503` if the database is unreachable. Also used by the self-ping keep-alive timer.

## Scoring system

### How scoring works

1. **Selection sets the band.** For turns with `kind: "select"` (MVP stage, funding stage, portfolio depth, deploy timeline), the chosen option maps directly to a `[floor, ceil]` point range. A founder who selects "Revenue" gets the revenue band `[11, 15]` for MVP; "Idea" gets `[1, 3]`.

2. **AI signals position within the band.** Groq analyzes the full transcript and returns per-dimension signals: `specificity` (0–1), `evidence_strength` (0–1), `has_quantification`, `has_named_entities`, `supports_selection`, and `internal_consistency`. These determine where in the band the score lands.

3. **Quantification gates the top of the band.** Without real numbers in the answer, the score is capped at mid-band regardless of other signals. Concrete metrics (users, revenue, cheque size, percentages) are the only way to reach the top of a band.

4. **Gap 1 — contradiction.** If the AI detects that the text explicitly contradicts the selection (e.g. selected "Revenue" but writes "we don't charge yet"), the score re-bands down one level and sits at that band's floor. A `mismatch` flag is set and the lead surfaces in the "Needs attention" panel on the overview.

5. **Gap 2 — junk.** Answers that match the blocklist (`idk`, `n/a`, gibberish keyboard-mash, etc.) are caught by `validate.js`. Junk fields score at the band floor and receive a `junk` flag.

6. **Gap 3 — AI fallback.** If Groq is unavailable (timeout, API error, or unparseable response after 2 retries), `textAnalyze.js` steps in and produces the same per-dimension param shape that Groq would have returned — but computed entirely from the answer text without any API call. It detects: real numbers and currency values (`₹`, `$`, lakhs, crores, MRR, ARR, etc.), named entities (capitalized mid-sentence words, all-caps acronyms, `ex-Company` patterns), strong-evidence keywords (`paying`, `signed`, `contract`, `loi`, `customers`, `pilot`, `retained`, etc.), and moderate-evidence keywords (`exploring`, `prototype`, `experience`, etc.). From those signals it estimates `specificity`, `evidence_strength`, `has_quantification`, and `has_named_entities` — the same fields the scoring engine reads. This means a lead submitted during a Groq outage still gets a meaningful score rather than a flat floor. The lead is marked `provisional` and `needs_ai_rescore = true`; it will be rescored with real AI once Groq is reachable again. The one thing `textAnalyze.js` cannot do that Groq can: detect contradictions between a selection and the answer text, or catch cross-field inconsistencies. Those signals (`supports_selection`, `internal_consistency`) always default to `true` in the fallback.

7. **Gap 4 — rescore.** Provisional leads are retried 30 seconds after submission. The server also sweeps all provisional leads every 15 minutes.

---

### Score status lifecycle

```
submit → processing → final
                    → provisional → (rescore after 30s or 15min sweep) → final
```

| Status | Meaning | Dashboard indicator |
|---|---|---|
| `processing` | Background worker is scoring | Pulsing blue "Processing" banner |
| `provisional` | Scored without AI (textAnalyze fallback) | Amber "Provisional" banner |
| `final` | Scored with real AI | No banner |

---

### Founder dimensions

| Dimension | Max points | Set by |
|---|---|---|
| Validation | 25 | Ladder (evidence strength) |
| Traction | 20 | Ladder (evidence strength) |
| MVP stage | 15 | Selection (idea / building / live / revenue) |
| Problem clarity | 15 | Ladder (specificity) |
| Team | 15 | Ladder (evidence strength) |
| Funding fit | 10 | Selection (pre-seed / seed / series-a / later) |
| **Total** | **100** | |

---

### Investor dimensions

| Dimension | Max points | Set by |
|---|---|---|
| Cheque capacity | 22 | Ladder (evidence strength) |
| Stage fit | 20 | Selection (pre-seed / seed / series-a / growth / agnostic) |
| Thesis clarity | 18 | Ladder (specificity) |
| Portfolio | 15 | Selection (experienced / some / first-time) |
| Deploy timeline | 15 | Selection (now / near / exploring / learning) |
| Support model | 10 | Ladder (evidence strength) |
| **Total** | **100** | |

---

### Score buckets

| Score | Bucket | Meaning |
|---|---|---|
| 80–100 | `hot` | Strong signal, prioritize outreach |
| 60–79 | `good` | Worth a conversation |
| 40–59 | `maybe` | Weak signal, monitor |
| 0–39 | `low` | Poor fit or insufficient information |

## Conversation flows

Both flows have 12 turns. Turns with `kind: "select"` collect a structured option choice and trigger a branch follow-up on the next turn — the follow-up prompt is chosen dynamically based on which option was selected. The client fetches the full flow definition from `/api/flow/:type` at session start; the server is the single source of truth.

**Founder flow (12 turns, ~18 captured fields):**

| Turn | ID | Kind | What it captures |
|---|---|---|---|
| 1 | `intro` | text | Name, one-liner |
| 2 | `problem` | text | Problem statement, target segment |
| 3 | `mvp_stage` | select | Stage: idea / building / live / revenue |
| 4 | `mvp_detail` | text | Branch follow-up (adapts to selection) |
| 5 | `traction` | text | Users, revenue |
| 6 | `pilots` | text | Pilots, partnerships, LOIs |
| 7 | `team` | text | Team size, tech cofounder |
| 8 | `funding` | select | Stage: pre-seed / seed / series-a / later |
| 9 | `funding_milestone` | text | What the round unlocks |
| 10 | `validation` | text | Strongest evidence of demand |
| 11 | `contact` | contact | Email, phone, LinkedIn |
| 12 | `founder_insight` | text | Unique insight + right-person argument |

**Investor flow (12 turns, ~17 captured fields):**

| Turn | ID | Kind | What it captures |
|---|---|---|---|
| 1 | `intro` | text | Name, solo angel vs fund |
| 2 | `thesis` | text | Investment thesis, sector focus |
| 3 | `stage` | select | Stage: pre-seed / seed / series-a / growth / agnostic |
| 4 | `stage_detail` | text | Branch follow-up on conviction signals |
| 5 | `cheque` | text | Cheque size, lead vs follow |
| 6 | `portfolio` | select | Track record: experienced / some / first-time |
| 7 | `portfolio_detail` | text | Entry stage of past investments |
| 8 | `timeline` | select | Deploy urgency: now / near / exploring / learning |
| 9 | `timeline_detail` | text | What needs to line up before deploying |
| 10 | `support` | text | Value-add beyond capital |
| 11 | `contact` | contact | Email, phone, LinkedIn |
| 12 | `alignment` | text | What they want from a Venturizer partnership |

## Dashboard

The dashboard has two views, both protected by the JWT cookie:

**`/overview`** — stats and pipeline health:
- Total leads, hot leads, provisional count, mismatch flag count
- Bucket distribution bar (hot / good / maybe / low with percentages)
- Pipeline health card: average score, founder vs investor split
- Hot leads panel: top 4 leads by score with quick-navigate links
- Needs attention panel: provisional scores and mismatch flags that need a human eye

**`/dashboard`** — lead list:
- Paginated table, filterable by type and bucket
- Click any row to open the lead detail

**`/dashboard/:id`** — lead detail:
- Name, email, phone, LinkedIn (clickable)
- Score circle with bucket badge
- Per-dimension breakdown bar chart
- Full rendered Q&A transcript
- Status banners: amber for provisional, blue (pulsing) for processing, red for mismatch
- Mismatch banner includes a "Mark Verified" button — clicking it adds a `human_verified` flag via PATCH and dismisses the alert
- "Re-score with AI" button: triggers `POST /api/leads/:id/rescore`
- Delete button: triggers `DELETE /api/leads/:id` with a confirm prompt

## Resilience

| Gap | What it covers | Mechanism |
|---|---|---|
| Gap 1 | Contradiction between selection and text | AI `supports_selection=false` → re-band down + floor + mismatch flag |
| Gap 2 | Junk / gibberish answers | Blocklist + consonant-run detection in `validate.js` → floor + junk flag |
| Gap 3 | AI unavailability | `textAnalyze.js` deterministic fallback → provisional score |
| Gap 4 | Provisional rescore | 30s retry after submit + 15-minute background sweep |

## Environment variables

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `GROQ_API_KEY` | Yes | Groq API key for AI scoring | `gsk_...` |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens | any long random string |
| `PORT` | No | Server port (default 5001) | `4000` |
| `NODE_ENV` | No | `development` or `production` | `production` |
| `GROQ_MODEL` | No | Groq model ID (default `llama-3.3-70b-versatile`) | `llama-3.3-70b-versatile` |
| `REDIS_URL` | No | Redis URL for BullMQ (unused in current in-process worker) | `redis://127.0.0.1:6379` |
| `SERVER_URL` | No | Public server URL for self-ping keep-alive | `https://your-api.railway.app` |
| `FRONTEND_URL` | No | Deployed frontend origin added to the CORS allowlist. Read directly via `process.env` — not validated by `env.js`. Local origins (`localhost:3000/5173/5174`) are always allowed. If unset, `filter(Boolean)` silently drops it. | `https://trinity-nine.vercel.app` |

**Frontend:**

| Variable | Required | Description | Example |
|---|---|---|---|
| `VITE_API_URL` | No | Backend URL (defaults to `http://localhost:4000`) | `https://your-api.railway.app` |

## Deploy

**Backend (Railway):**

1. Create a Railway project with a Postgres plugin and a Node service pointed at the `server/` directory
2. Set all required env vars in the Railway variable panel
3. Set the start command to `node src/index.js`
4. After first deploy, run the migration once via the Railway shell: `node db/migrate.js`
5. Seed the admin account: `node db/seedAdmin.js`

The Postgres pool automatically enables SSL (`rejectUnauthorized: false`) when `NODE_ENV=production`, which is required for Railway's hosted Postgres.

**Frontend (Vercel):**

1. Connect the `client/` directory to a Vercel project
2. Set `VITE_API_URL` to your Railway backend URL in Vercel's environment settings
3. Deploy — Vite builds to `dist/`

## Known limitations / planned

- **BullMQ not active.** The in-process `queue.js` worker runs inside the Node event loop using `setTimeout`. `bullmq` and `ioredis` are installed but the queue is not wired to Redis. A proper BullMQ worker would add retries, concurrency control, and failure tracking.
- **No copy-paste or duplicate detection.** Identical or near-identical transcripts are not flagged.
- **No cross-lead deduplication.** The same email can submit multiple times; all submissions are stored.
- **Contradiction detection requires AI.** The deterministic fallback (`textAnalyze.js`) cannot detect contradictions or cross-field inconsistencies — `supports_selection` and `internal_consistency` always default to `true` in fallback mode.
- **Admin accounts seeded manually.** There is no admin creation UI; accounts must be inserted via `db/seedAdmin.js`. Default credentials are `team@venturizer.com` / `reviewer123`.
- **No session polling on lead detail.** After triggering a rescore, the dashboard sets the lead to "processing" visually but does not poll for the result — the user must refresh to see the final score.

## Deployment & Architectural Challenges

During the development and deployment of Trinity across Vercel (Frontend) and Railway (Backend), several critical challenges were addressed to ensure production stability:

### 1. Cross-Domain Authentication & Safari ITP
**The Issue:** Because the frontend was deployed on `vercel.app` and the backend on `up.railway.app`, browsers (especially Safari and Brave) aggressively blocked the JWT authentication cookie as a "Third-Party Tracker". This caused users to instantly log out when refreshing the dashboard, even with `SameSite=None` configured.
**The Fix:** A Reverse Proxy was implemented using Vercel Edge Network (`client/vercel.json`). The React frontend was updated to make relative API calls (`/api/auth`), which Vercel securely tunnels to the Railway backend. The browser now sees the cookies as First-Party, entirely bypassing cross-site tracking preventions.

### 2. Railway Monorepo Build Failures (Nixpacks)
**The Issue:** Railway's Nixpacks builder analyzes the project root to determine the language. Because the Node.js `package.json` was tucked inside the `/server` directory, Nixpacks failed to generate a build plan.
**The Fix:** Instead of relying on manual UI configuration (which can be flaky), a bridge `package.json` was added to the project root. This file explicitly declares the Node environment and redirects the `install` and `start` commands to execute inside the `server/` directory (`"start": "cd server && npm start"`).

### 3. AI Unpredictability & Rate Limits (Resilience)
**The Issue:** Relying on the Groq LLM API for real-time scoring introduces the risk of timeouts, rate limits, or malformed JSON responses, which could break the user submission flow and lose valuable lead data.
**The Fix:** A robust queuing architecture (BullMQ + Redis) was implemented. If the Groq API fails during submission, the lead is safely saved to PostgreSQL with a `score_status: "provisional"`. The user receives an immediate success screen without waiting, and a background worker continuously retries the AI scoring until it succeeds.
