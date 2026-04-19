// ─────────────────────────────────────────────────────────────
// controllers/taskController.js
//
// Contains ALL the business logic for the tasks resource.
// Each exported function maps to one REST endpoint.
//
// Pattern: controller calls db, formats the response, then
//          calls next(err) on any failure → errorHandler.js picks it up.
//
// HOW TO ADD A NEW ENDPOINT IN THE FUTURE:
//   1. Add a new exported function here
//   2. Add a route in src/routes/taskRoutes.js
//   That's it — server.js doesn't need to change.
// ─────────────────────────────────────────────────────────────

const db = require("../db/database");

// ── Helper: convert SQLite row → JS-friendly object ──────────
// SQLite stores booleans as 0/1 — we convert to true/false here
// so the frontend always receives proper JSON booleans.
function formatTask(task) {
  return {
    ...task,
    completed: task.completed === 1,
  };
}

// ── GET /api/tasks ───────────────────────────────────────────
// Returns all tasks, newest first.
// Optional query params: ?filter=active|completed
function getAllTasks(req, res, next) {
  try {
    const { filter } = req.query;

    let query = "SELECT * FROM tasks ORDER BY created_at DESC";
    let params = [];

    // Apply optional server-side filter
    if (filter === "active") {
      query = "SELECT * FROM tasks WHERE completed = 0 ORDER BY created_at DESC";
    } else if (filter === "completed") {
      query = "SELECT * FROM tasks WHERE completed = 1 ORDER BY created_at DESC";
    }

    const tasks = db.prepare(query).all(...params);
    res.json({ success: true, data: tasks.map(formatTask) });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/tasks/:id ───────────────────────────────────────
// Returns a single task by ID.
function getTaskById(req, res, next) {
  try {
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found." });
    }

    res.json({ success: true, data: formatTask(task) });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/tasks ──────────────────────────────────────────
// Creates a new task. Body: { title, priority? }
function createTask(req, res, next) {
  try {
    const { title, priority = "medium" } = req.body;

    const info = db
      .prepare("INSERT INTO tasks (title, priority) VALUES (?, ?)")
      .run(title.trim(), priority);

    // Fetch the just-created row so we return all fields (including created_at)
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(info.lastInsertRowid);

    res.status(201).json({ success: true, data: formatTask(task) });
  } catch (err) {
    next(err);
  }
}

// ── PATCH /api/tasks/:id ─────────────────────────────────────
// Partially updates a task. Body: { title?, completed?, priority? }
function updateTask(req, res, next) {
  try {
    const existing = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, error: "Task not found." });
    }

    // Merge: use incoming value if provided, otherwise keep existing value
    const newTitle     = req.body.title     !== undefined ? req.body.title.trim()       : existing.title;
    const newCompleted = req.body.completed !== undefined ? (req.body.completed ? 1 : 0) : existing.completed;
    const newPriority  = req.body.priority  !== undefined ? req.body.priority            : existing.priority;

    db.prepare(
      "UPDATE tasks SET title = ?, completed = ?, priority = ? WHERE id = ?"
    ).run(newTitle, newCompleted, newPriority, req.params.id);

    const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
    res.json({ success: true, data: formatTask(updated) });
  } catch (err) {
    next(err);
  }
}

// ── DELETE /api/tasks/:id ────────────────────────────────────
// Deletes a task by ID.
function deleteTask(req, res, next) {
  try {
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found." });
    }

    db.prepare("DELETE FROM tasks WHERE id = ?").run(req.params.id);
    res.json({ success: true, message: "Task deleted.", id: Number(req.params.id) });
  } catch (err) {
    next(err);
  }
}

// ── DELETE /api/tasks (bulk: completed only) ─────────────────
// Deletes all completed tasks at once. Useful for "clear completed" button.
function clearCompleted(req, res, next) {
  try {
    const info = db.prepare("DELETE FROM tasks WHERE completed = 1").run();
    res.json({ success: true, message: `Deleted ${info.changes} completed task(s).` });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask, clearCompleted };
