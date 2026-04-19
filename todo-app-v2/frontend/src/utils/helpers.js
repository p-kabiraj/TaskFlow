// ─────────────────────────────────────────────────────────────
// utils/helpers.js
//
// Pure utility functions shared across components.
// No React imports — just plain JS.
//
// HOW TO ADD A NEW UTILITY IN THE FUTURE:
//   Add a new exported function below and import it anywhere.
// ─────────────────────────────────────────────────────────────

// Format a date string (e.g. "2025-04-04T10:00:00") to "Apr 4"
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Capitalise the first letter of a string
export function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Map priority → display colour class (used in TaskItem)
export const PRIORITY_COLOR = {
  low:    "priority-low",
  medium: "priority-medium",
  high:   "priority-high",
};
