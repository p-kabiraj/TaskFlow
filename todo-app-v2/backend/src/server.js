// ─────────────────────────────────────────────────────────────
// src/server.js
//
// Express application entry point.
// Responsibilities:
//   • Load config & environment variables
//   • Set up global middleware (CORS, JSON parsing, logging)
//   • Mount API route modules
//   • Mount the global error handler (must be LAST)
//   • Start the HTTP server
//
// HOW TO ADD A NEW RESOURCE IN THE FUTURE (e.g. "categories"):
//   1. Create src/db/database.js   → add new table in schema
//   2. Create src/controllers/categoryController.js
//   3. Create src/routes/categoryRoutes.js
//   4. Add:  app.use("/api/categories", require("./routes/categoryRoutes"));
//   Nothing else in this file needs to change.
// ─────────────────────────────────────────────────────────────

const express = require("express");
const cors    = require("cors");
const morgan  = require("morgan");

const config       = require("./config");
const taskRoutes   = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

// ── Create app ───────────────────────────────────────────────
const app = express();

// ── Global middleware ────────────────────────────────────────

// CORS — only allow requests from the configured frontend origin
app.use(cors({ origin: config.corsOrigin }));

// Parse JSON request bodies
app.use(express.json());

// HTTP request logger (dev = colourful, production = combined)
app.use(morgan(config.isDev ? "dev" : "combined"));

// ── API Routes ───────────────────────────────────────────────
app.use("/api/tasks", taskRoutes);

// Future resources go here, e.g.:
// app.use("/api/categories", require("./routes/categoryRoutes"));

// ── Health check ─────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ success: true, status: "ok", env: config.nodeEnv });
});

// ── 404 catch-all ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found." });
});

// ── Global error handler (must be last!) ─────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`\n✅  TaskFlow backend running`);
  console.log(`   ENV  : ${config.nodeEnv}`);
  console.log(`   PORT : ${config.port}`);
  console.log(`   DB   : ${config.dbPath}\n`);
});
