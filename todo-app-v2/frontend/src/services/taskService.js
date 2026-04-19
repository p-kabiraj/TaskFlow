// ─────────────────────────────────────────────────────────────
// services/taskService.js
//
// ALL API calls to the backend live here — nowhere else.
// Components never use fetch() directly; they call these functions.
//
// WHY THIS MATTERS:
//   If the API URL or response shape changes, you update ONE file.
//   Components stay untouched.
//
// HOW TO ADD A NEW API CALL IN THE FUTURE:
//   1. Add a new exported async function below
//   2. Import and call it from your component or hook
// ─────────────────────────────────────────────────────────────

// Base URL comes from .env — defaults to /api (proxied in dev)
const BASE = process.env.REACT_APP_API_URL || "/api";

// ── Helper: throw a readable error if response is not 2xx ────
async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── GET /api/tasks ───────────────────────────────────────────
export async function fetchTasks() {
  const res = await fetch(`${BASE}/tasks`);
  const json = await handleResponse(res);
  return json.data; // array of task objects
}

// ── POST /api/tasks ──────────────────────────────────────────
export async function createTask({ title, priority = "medium" }) {
  const res = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, priority }),
  });
  const json = await handleResponse(res);
  return json.data; // the newly created task
}

// ── PATCH /api/tasks/:id ─────────────────────────────────────
// Pass only the fields you want to change: { completed? title? priority? }
export async function updateTask(id, changes) {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  const json = await handleResponse(res);
  return json.data; // the updated task
}

// ── DELETE /api/tasks/:id ────────────────────────────────────
export async function deleteTask(id) {
  const res = await fetch(`${BASE}/tasks/${id}`, { method: "DELETE" });
  return handleResponse(res); // { success, message, id }
}

// ── DELETE /api/tasks/completed ──────────────────────────────
export async function clearCompleted() {
  const res = await fetch(`${BASE}/tasks/completed`, { method: "DELETE" });
  return handleResponse(res);
}
