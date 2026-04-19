// ─────────────────────────────────────────────────────────────
// routes/taskRoutes.js
//
// Defines all HTTP routes for the /api/tasks resource.
// Routes are thin — they just attach middleware + controller.
//
// HOW TO ADD A NEW ROUTE IN THE FUTURE:
//   1. Write the handler in controllers/taskController.js
//   2. Add a router.METHOD('/path', handler) line below
// ─────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  clearCompleted,
} = require("../controllers/taskController");

const { validateCreate, validateUpdate } = require("../middleware/validateTask");

// GET    /api/tasks              → list all tasks (supports ?filter=active|completed)
router.get("/", getAllTasks);

// GET    /api/tasks/:id          → get one task
router.get("/:id", getTaskById);

// POST   /api/tasks              → create a task
router.post("/", validateCreate, createTask);

// PATCH  /api/tasks/:id          → update a task (partial)
router.patch("/:id", validateUpdate, updateTask);

// DELETE /api/tasks/completed    → clear all completed tasks (must be before /:id)
router.delete("/completed", clearCompleted);

// DELETE /api/tasks/:id          → delete one task
router.delete("/:id", deleteTask);

module.exports = router;
