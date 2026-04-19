// ─────────────────────────────────────────────────────────────
// components/Sidebar.js
//
// Left sidebar. Contains:
//   • View filter buttons (All / Active / Completed)
//   • SVG progress ring showing completion %
//   • "Clear completed" button
//   • Keyboard shortcut tip
//
// HOW TO ADD A NEW FILTER IN THE FUTURE:
//   Add a new entry to the FILTERS array below.
//   The button renders automatically — no other changes needed.
// ─────────────────────────────────────────────────────────────

import React from "react";
import "./Sidebar.css";

// ── Filter definitions ──────────────────────────────────────
// To add a new view: add an entry here with { id, label, icon }
// `id` must match the filter value used in App.js
const FILTERS = [
  { id: "all",       label: "All Tasks",  icon: "◈" },
  { id: "active",    label: "Active",     icon: "◎" },
  { id: "completed", label: "Completed",  icon: "◉" },
];

// ── SVG Progress Ring ────────────────────────────────────────
// Draws a circular progress indicator using stroke-dasharray math
function ProgressRing({ completed, total }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius      = 28;
  const circumference = 2 * Math.PI * radius; // ~175.9
  const filled      = (pct / 100) * circumference;

  return (
    <div className="progress-ring-wrap">
      <svg width="72" height="72" viewBox="0 0 72 72" aria-label={`${pct}% complete`}>
        {/* Background track */}
        <circle
          cx="36" cy="36" r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="5"
        />
        {/* Filled arc — rotated so it starts at the top */}
        <circle
          cx="36" cy="36" r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeDasharray={`${filled.toFixed(1)} ${circumference.toFixed(1)}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      </svg>
      <div className="progress-pct">{pct}%</div>
    </div>
  );
}

// ── Sidebar component ────────────────────────────────────────
export default function Sidebar({ filter, setFilter, counts, onClearCompleted }) {
  return (
    <aside className="sidebar">

      {/* ── View filters ── */}
      <div className="sidebar-section">
        <p className="sidebar-label">Views</p>
        <nav className="sidebar-nav">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`sidebar-btn ${filter === f.id ? "active" : ""}`}
              onClick={() => setFilter(f.id)}
              aria-current={filter === f.id ? "page" : undefined}
            >
              <span className="sidebar-btn-icon">{f.icon}</span>
              <span className="sidebar-btn-label">{f.label}</span>
              <span className="sidebar-btn-count">{counts[f.id]}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-divider" />

      {/* ── Progress ring ── */}
      <div className="sidebar-section">
        <p className="sidebar-label">Progress</p>
        <ProgressRing completed={counts.completed} total={counts.all} />
        <p className="progress-caption">
          {counts.completed} of {counts.all} done
        </p>
      </div>

      <div className="sidebar-divider" />

      {/* ── Actions ── */}
      <div className="sidebar-section">
        <p className="sidebar-label">Actions</p>
        <button
          className="sidebar-clear-btn"
          onClick={onClearCompleted}
          disabled={counts.completed === 0}
          title="Remove all completed tasks"
        >
          Clear completed ({counts.completed})
        </button>
      </div>

      <div className="sidebar-divider" />

      {/* ── Keyboard tip ── */}
      <div className="sidebar-section sidebar-footer">
        <div className="sidebar-tip">
          <span className="tip-icon">💡</span>
          <span>Press <kbd>Enter</kbd> to quickly add a task</span>
        </div>
      </div>

    </aside>
  );
}
