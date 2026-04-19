// ─────────────────────────────────────────────────────────────
// components/Navbar.js
//
// Top navigation bar. Displays:
//   • Brand name + icon (left)
//   • Tagline (center)
//   • Pending task count badge + avatar (right)
//
// HOW TO ADD NEW NAV ITEMS IN THE FUTURE:
//   Add them inside .navbar-center or .navbar-right below.
//   Keep this component focused on navigation only.
// ─────────────────────────────────────────────────────────────

import React from "react";
import "./Navbar.css";

export default function Navbar({ pendingCount }) {
  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <span className="brand-icon">✦</span>
        <span className="brand-name">TaskFlow</span>
      </div>

      {/* Center tagline */}
      <div className="navbar-center">
        <span className="nav-tagline">Stay focused. Ship things.</span>
      </div>

      {/* Right: badge + avatar */}
      <div className="navbar-right">
        {/* Badge only shows when there are pending tasks */}
        {pendingCount > 0 && (
          <div className="task-badge" aria-label={`${pendingCount} pending tasks`}>
            <span className="badge-dot" />
            <span>{pendingCount} pending</span>
          </div>
        )}

        {/* User avatar — replace initials/colour for multi-user support */}
        <div className="avatar" title="Your profile">TF</div>
      </div>
    </nav>
  );
}
