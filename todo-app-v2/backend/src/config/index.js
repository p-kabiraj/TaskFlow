// ─────────────────────────────────────────────────────────────
// config/index.js
//
// Central place for ALL configuration values.
// Everything comes from environment variables (via .env).
// To change a setting: edit .env — never hardcode here.
// ─────────────────────────────────────────────────────────────

require("dotenv").config();

const config = {
  // Server
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  dbPath: process.env.DB_PATH || "./data/todos.db",

  // CORS — which frontend URL is allowed to call this API
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",

  // Derived helpers
  isDev: (process.env.NODE_ENV || "development") === "development",
};

module.exports = config;
