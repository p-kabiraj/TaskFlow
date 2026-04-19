// ─────────────────────────────────────────────────────────────
// db/database.js
//
// Initialises the SQLite database using better-sqlite3.
// • Creates the DB file if it doesn't exist (at DB_PATH from .env)
// • Creates the `tasks` table if it doesn't exist
// • Exports a single `db` instance used by all controllers
//
// HOW TO ADD A NEW TABLE IN THE FUTURE:
//   1. Add a new db.exec(`CREATE TABLE IF NOT EXISTS ...`) block below
//   2. Create a matching controller in src/controllers/
//   3. Create a matching route  in src/routes/
//   4. Register the route in src/server.js
// ─────────────────────────────────────────────────────────────

const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const config = require("../config");

// Resolve absolute path so the DB is always created in the right place
const dbPath = path.resolve(__dirname, "../../", config.dbPath);

// Make sure the directory exists (e.g. ./data/)
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

// ── Enable WAL mode for better concurrent read performance ──
db.pragma("journal_mode = WAL");

// ── Schema ──────────────────────────────────────────────────
// tasks table
// Columns:
//   id          — auto-incrementing primary key
//   title       — the task text (required)
//   completed   — 0 = false, 1 = true  (SQLite has no boolean type)
//   priority    — 'low' | 'medium' | 'high'  (easy to extend later)
//   created_at  — ISO timestamp, set automatically on insert
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    completed  INTEGER NOT NULL DEFAULT 0,
    priority   TEXT    NOT NULL DEFAULT 'medium',
    created_at DATETIME         DEFAULT CURRENT_TIMESTAMP
  )
`);

// ── Future tables go here ────────────────────────────────────
// Example:
// db.exec(`CREATE TABLE IF NOT EXISTS categories ( ... )`);

module.exports = db;
