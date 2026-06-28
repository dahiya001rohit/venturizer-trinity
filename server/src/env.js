const dotenv = require("dotenv");

dotenv.config(); // loads .env from project root

/**
 * Validates env on boot. Fail fast + loud if something's missing —
 * better to crash at startup than mid-request.
 */
function required(key) {
  const val = process.env[key];
  if (!val || val.trim() === "") {
    throw new Error(`[env] missing required env var: ${key}`);
  }
  return val;
}

function optional(key, fallback) {
  const val = process.env[key];
  return val && val.trim() !== "" ? val : fallback;
}

const env = {
  NODE_ENV: optional("NODE_ENV", "development"),
  PORT: parseInt(optional("PORT", "5001"), 10),
  SERVER_URL: optional("SERVER_URL", `http://localhost:${optional("PORT", "5001")}`),

  DATABASE_URL: required("DATABASE_URL"),

  GROQ_API_KEY: required("GROQ_API_KEY"),
  GROQ_MODEL: optional("GROQ_MODEL", "llama-3.3-70b-versatile"),

  JWT_SECRET: required("JWT_SECRET"),
  REDIS_URL: optional("REDIS_URL", "redis://127.0.0.1:6379"),
};

module.exports = { env };
