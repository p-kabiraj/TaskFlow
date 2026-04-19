// ─────────────────────────────────────────────────────────────
// App.js — Root component
//
// This component is intentionally THIN. It only:
//   1. Calls useTasks() to get state + actions
//   2. Manages the active filter (all | active | completed)
//   3. Passes everything down to child components via props
//
// HOW TO ADD A NEW PAGE / SECTION IN THE FUTURE:
//   1. Create a new component in src/components/
//   2. Add a new filter/view option in Sidebar.js
//   3. Conditionally render it here instead of <ToDoList>
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from "react";
import { useTasks } from "./hooks/useTasks";
import Navbar    from "./components/Navbar";
import Sidebar   from "./components/Sidebar";
import ToDoList  from "./components/ToDoList";
import "./App.css";

export default function App() {
  // All task state and actions come from the custom hook
  const {
    tasks,
    loading,
    error,
    counts,
    addTask,
    toggleTask,
    removeTask,
    clearCompleted,
  } = useTasks();

  // Filter is pure UI state — lives here, not in the hook
  const [filter, setFilter] = useState("all"); // "all" | "active" | "completed"

  // Derive the visible task list from filter — no API call needed
  const filteredTasks = useMemo(() => {
    if (filter === "active")    return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) =>  t.completed);
    return tasks;
  }, [tasks, filter]);

  return (
    <div className="app-shell">
      {/* Top navigation bar */}
      <Navbar pendingCount={counts.active} />

      <div className="app-body">
        {/* Left sidebar — filters + progress */}
        <Sidebar
          filter={filter}
          setFilter={setFilter}
          counts={counts}
          onClearCompleted={clearCompleted}
        />

        {/* Main content area */}
        <main className="main-content">
          <ToDoList
            tasks={filteredTasks}
            filter={filter}
            loading={loading}
            error={error}
            onAdd={addTask}
            onToggle={toggleTask}
            onDelete={removeTask}
          />
        </main>
      </div>
    </div>
  );
}
