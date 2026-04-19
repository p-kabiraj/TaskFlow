// ─────────────────────────────────────────────────────────────
// hooks/useTasks.js
//
// Custom React hook that owns ALL task-related state and actions.
// Components just call this hook — they don't manage state themselves.
//
// WHY THIS MATTERS:
//   • State logic is in one place, easy to find and change
//   • Components stay thin and focused on rendering
//   • Easy to test the logic independently of the UI
//
// HOW TO ADD A NEW ACTION IN THE FUTURE:
//   1. Add the async function to services/taskService.js
//   2. Add a handler function here (follow the try/catch pattern)
//   3. Return it from this hook
//   4. Call it from the component
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import * as taskService from "../services/taskService";

export function useTasks() {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // ── Load tasks on mount ──────────────────────────────────
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  // ── Add a task ───────────────────────────────────────────
  // Optimistic update: add immediately, rollback on failure
  const addTask = async ({ title, priority }) => {
    try {
      const newTask = await taskService.createTask({ title, priority });
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Toggle completed ─────────────────────────────────────
  const toggleTask = async (id, completed) => {
    // Optimistic update — flip immediately in UI
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
    try {
      const updated = await taskService.updateTask(id, { completed });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      // Rollback on failure
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
      setError(err.message);
    }
  };

  // ── Delete a task ────────────────────────────────────────
  const removeTask = async (id) => {
    const snapshot = tasks; // save for rollback
    setTasks((prev) => prev.filter((t) => t.id !== id)); // optimistic
    try {
      await taskService.deleteTask(id);
    } catch (err) {
      setTasks(snapshot); // rollback
      setError(err.message);
    }
  };

  // ── Clear all completed tasks ────────────────────────────
  const clearCompleted = async () => {
    const snapshot = tasks;
    setTasks((prev) => prev.filter((t) => !t.completed)); // optimistic
    try {
      await taskService.clearCompleted();
    } catch (err) {
      setTasks(snapshot);
      setError(err.message);
    }
  };

  // ── Computed stats ───────────────────────────────────────
  const counts = {
    all:       tasks.length,
    active:    tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) =>  t.completed).length,
  };

  return {
    tasks,
    loading,
    error,
    counts,
    addTask,
    toggleTask,
    removeTask,
    clearCompleted,
    refresh: loadTasks,
  };
}
