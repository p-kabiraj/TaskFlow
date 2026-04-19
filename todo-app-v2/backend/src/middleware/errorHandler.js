// ─────────────────────────────────────────────────────────────
// middleware/errorHandler.js
//
// Global Express error handler.
// Any route that calls next(err) ends up here.
//
// HOW TO USE IN A CONTROLLER:
//   try { ... } catch (err) { next(err); }
//
// HOW TO ADD CUSTOM ERROR TYPES IN THE FUTURE:
//   Create a custom error class, throw it from controllers,
//   and add a case in the switch below.
// ─────────────────────────────────────────────────────────────

const config = require("../config");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Log full error in development, minimal in production
  if (config.isDev) {
    console.error("❌ Error:", err.stack || err.message);
  } else {
    console.error("❌ Error:", err.message);
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    error: message,
    // Only expose stack trace in development
    ...(config.isDev && { stack: err.stack }),
  });
}

module.exports = errorHandler;
