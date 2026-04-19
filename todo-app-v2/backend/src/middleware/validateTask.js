// ─────────────────────────────────────────────────────────────
// middleware/validateTask.js
//
// Express middleware for validating task request bodies.
// Runs BEFORE the controller so controllers stay clean.
//
// HOW TO ADD A NEW FIELD VALIDATION IN THE FUTURE:
//   Add a new check inside validateCreate or validateUpdate below.
// ─────────────────────────────────────────────────────────────

const VALID_PRIORITIES = ["low", "medium", "high"];

// Validates POST /api/tasks body
function validateCreate(req, res, next) {
  const { title, priority } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ success: false, error: "Title is required and must be a non-empty string." });
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      success: false,
      error: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}.`,
    });
  }

  next();
}

// Validates PATCH /api/tasks/:id body
function validateUpdate(req, res, next) {
  const { title, completed, priority } = req.body;

  // At least one field must be provided
  if (title === undefined && completed === undefined && priority === undefined) {
    return res.status(400).json({ success: false, error: "Provide at least one field to update: title, completed, or priority." });
  }

  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    return res.status(400).json({ success: false, error: "Title must be a non-empty string." });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ success: false, error: "completed must be a boolean (true or false)." });
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      success: false,
      error: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}.`,
    });
  }

  next();
}

module.exports = { validateCreate, validateUpdate };
