const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { env } = require("./env");
const { pingDb } = require("../db/pool");
const authRouter = require("../routes/auth");
const leadsRouter = require("../routes/leads");
const submitRouter = require("../routes/submit");
const flowRouter = require("../routes/flow");

// Initialize queue and worker
require("../queue");

const app = express();

// ── Helmet — sets security HTTP headers ──
app.use(helmet());

// ── CORS — allow the frontend to call this API ──
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    "https://trinity-nine.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());
app.use(cookieParser());


// Health route — confirms server + DB are alive.
app.get("/api/health", async (_req, res) => {
  const dbOk = await pingDb();
  res.status(dbOk ? 200 : 503).json({ ok: dbOk, db: dbOk ? "up" : "down" });
});

// Routes
app.use("/api/auth", authRouter);     // authentication
app.use("/api/flow", flowRouter);     // serve question definitions to frontend
app.use("/api/submit", submitRouter); // submit endpoint (fast async)
app.use("/api/leads", leadsRouter);   // dashboard reads (protected)

async function start() {
  const dbOk = await pingDb();
  if (!dbOk) {
    console.error("[boot] database unreachable — check DATABASE_URL. Exiting.");
    process.exit(1);
  }
  console.log("[boot] database connected");

  app.listen(env.PORT, () => {
    console.log(`[boot] server listening on :${env.PORT}`);
    
    // Ping health endpoint every 10 minutes to prevent server sleeping on deployed hosts
    setInterval(() => {
      fetch(`${env.SERVER_URL || 'http://localhost:4000'}/api/health`)
        .catch(() => {}); // silent catch
    }, 10 * 60 * 1000);
    console.log(`[health] Scheduled self-ping to ${env.SERVER_URL || 'http://localhost:4000'}/api/health every 10m`);

    // Background job: Rescore provisional leads every 15 minutes
    setInterval(async () => {
      try {
        const { getProvisionalLeads } = require("../db/leads.repo");
        const { processLead } = require("../queue");
        const leads = await getProvisionalLeads();
        if (leads.length > 0) {
          console.log(`[worker] Found ${leads.length} provisional leads. Attempting rescore...`);
          for (const lead of leads) {
            await processLead({ 
              leadId: lead.id, 
              transcript: { type: lead.type, answers: lead.answers },
              junkFields: [] 
            }, "rescoreLead");
          }
        }
      } catch (err) {
        console.error("[worker] Background rescore job failed:", err);
      }
    }, 15 * 60 * 1000); // 15 mins

    if (env.SERVER_URL) {
      setInterval(() => {
        const pingUrl = `${env.SERVER_URL}/api/health`;
        fetch(pingUrl)
          .then(res => console.log(`[health] self-ping OK (${res.status})`))
          .catch(err => console.error(`[health] self-ping failed:`, err.message));
      }, 10 * 60 * 1000);
      console.log(`[health] Scheduled self-ping to ${env.SERVER_URL}/api/health every 10m`);
    }
  });
}

start();