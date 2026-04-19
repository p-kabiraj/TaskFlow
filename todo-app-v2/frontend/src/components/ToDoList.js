// ─────────────────────────────────────────────────────────────
// components/ToDoList.js
//
// Renders the task input form and the list of task items.
// Composed of two sub-components defined in this file:
//   • <AddTaskForm>  — input + priority selector + submit
//   • <TaskItem>     — single task row with checkbox + delete
//
// HOW TO ADD A NEW TASK FIELD IN THE FUTURE (e.g. due date):
//   1. Add the field to the DB schema in backend/src/db/database.js
//   2. Add it to the PATCH handler in taskController.js
//   3. Add the input to <AddTaskForm> below
//   4. Pass and display it in <TaskItem> below
// ─────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { formatDate, PRIORITY_COLOR } from "../utils/helpers";
import "./ToDoList.css";

// ── Priority options for the select dropdown ─────────────────
const PRIORITIES = [
  { value: "low",    label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high",   label: "High" },
];

// ── AddTaskForm ───────────────────────────────────────────────
// Controlled form for creating a new task.
// Calls onAdd({ title, priority }) when submitted.
function AddTaskForm({ onAdd }) {
  const [title,    setTitle]    = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setLoading(true);
    await onAdd({ title: trimmed, priority });
    setTitle("");    // reset input after adding
    setLoading(false);
  };

  // Allow Enter key to submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="add-task-form">
      <input
        className="task-input"
        type="text"
        placeholder="Add a new task…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        aria-label="New task title"
      />

      {/* Priority selector — easy to remove if not needed */}
      <select
        className="priority-select"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        aria-label="Task priority"
      >
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      <button
        className="add-btn"
        onClick={handleSubmit}
        disabled={loading || !title.trim()}
        aria-label="Add task"
      >
        {loading ? "…" : "+ Add"}
      </button>
    </div>
  );
}

// ── TaskItem ──────────────────────────────────────────────────
// Single task row. Handles its own delete animation state.
function TaskItem({ task, onToggle, onDelete }) {
  const [removing, setRemoving] = useState(false);

  // Trigger CSS exit animation, then call the actual delete
  const handleDelete = async () => {
    setRemoving(true);
    // Wait for the CSS transition (250ms) before removing from state
    setTimeout(() => onDelete(task.id), 220);
  };

  return (
    <li
      className={[
        "task-item",
        task.completed ? "done"     : "",
        removing       ? "removing" : "",
      ].join(" ")}
    >
      {/* Checkbox — toggles completed state */}
      <button
        className={`task-checkbox ${task.completed ? "checked" : ""}`}
        onClick={() => onToggle(task.id, !task.completed)}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
            <path
              d="M1 4L4 7.5L10 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Task title */}
      <span className="task-title">{task.title}</span>

      {/* Priority dot — colour comes from PRIORITY_COLOR map in utils/helpers.js */}
      <span
        className={`priority-dot ${PRIORITY_COLOR[task.priority]}`}
        title={`Priority: ${task.priority}`}
        aria-label={`${task.priority} priority`}
      />

      {/* Created date */}
      <span className="task-date">{formatDate(task.created_at)}</span>

      {/* Delete button */}
      <button
        className="task-delete"
        onClick={handleDelete}
        aria-label={`Delete task: ${task.title}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </li>
  );
}

// ── Empty state messages ──────────────────────────────────────
const EMPTY_MESSAGES = {
  all:       "No tasks yet. Add one above to get started.",
  active:    "No active tasks — you're all caught up! 🎉",
  completed: "No completed tasks yet. Keep going!",
};

// ── ToDoList (main export) ────────────────────────────────────
export default function ToDoList({ tasks, filter, loading, error, onAdd, onToggle, onDelete }) {
  const VIEW_TITLES = {
    all:       "All Tasks",
    active:    "Active Tasks",
    completed: "Completed",
  };

  return (
    <div className="todolist">

      {/* Header */}
      <div className="todolist-header">
        <h1 className="todolist-title">{VIEW_TITLES[filter]}</h1>
        <span className="todolist-count">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Add task form — always visible */}
      <AddTaskForm onAdd={onAdd} />

      {/* Loading state */}
      {loading && (
        <div className="state-msg">
          <span className="spinner" aria-hidden="true" />
          Loading tasks…
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="state-msg error" role="alert">
          ⚠ {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && tasks.length === 0 && (
        <div className="empty-state" aria-live="polite">
          <span className="empty-icon" aria-hidden="true">◈</span>
          <p>{EMPTY_MESSAGES[filter]}</p>
        </div>
      )}

      {/* Task list */}
      {!loading && !error && tasks.length > 0 && (
        <ul className="task-list" aria-label="Tasks">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}

    </div>
  );
}
